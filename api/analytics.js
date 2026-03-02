const { requireAdminSession } = require('./_lib/auth');
const { getEnv } = require('./_lib/env');
const {
  ensureMethod,
  enforceAllowedOrigin,
  getQuery,
  handleOptions,
  sendJson,
} = require('./_lib/http');
const { fetchEventsForRange } = require('./_lib/supabase');

const PRESET_TO_MS = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

function pickFirst(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeSelector(element) {
  if (!element || typeof element !== 'object') return 'unknown';

  if (typeof element.selector === 'string' && element.selector.trim()) {
    return element.selector.trim().slice(0, 240);
  }

  if (typeof element.dataTrack === 'string' && element.dataTrack.trim()) {
    return `[data-track="${element.dataTrack.trim().slice(0, 120)}"]`;
  }

  const tag = typeof element.tag === 'string' ? element.tag.trim().toLowerCase() : '';
  if (!tag) return 'unknown';

  const id = typeof element.id === 'string' && element.id.trim() ? `#${element.id.trim()}` : '';
  const classes = Array.isArray(element.classes)
    ? element.classes
        .filter((value) => typeof value === 'string' && value.trim())
        .slice(0, 2)
        .map((className) => `.${className.trim()}`)
        .join('')
    : '';

  return `${tag}${id}${classes}`.slice(0, 240);
}

function normalizePath(pathValue) {
  if (typeof pathValue !== 'string' || !pathValue.trim()) return '/';
  try {
    const parsed = new URL(pathValue, 'https://comercias.local');
    return parsed.pathname || '/';
  } catch (error) {
    const cleaned = pathValue.trim();
    const prefixed = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    return prefixed.split('?')[0].split('#')[0] || '/';
  }
}

function normalizeDateInput(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function resolveRange(query) {
  const now = new Date();
  const preset = pickFirst(query.preset);
  const fromParam = pickFirst(query.from);
  const toParam = pickFirst(query.to);

  let fromDate;
  let toDate;
  let activePreset = null;

  if (preset && PRESET_TO_MS[preset]) {
    activePreset = preset;
    toDate = now;
    fromDate = new Date(now.getTime() - PRESET_TO_MS[preset]);
  } else if (fromParam && toParam) {
    fromDate = normalizeDateInput(fromParam);
    toDate = normalizeDateInput(toParam);
  } else {
    activePreset = '24h';
    toDate = now;
    fromDate = new Date(now.getTime() - PRESET_TO_MS['24h']);
  }

  if (!fromDate || !toDate) {
    return { error: 'invalid_time_range' };
  }

  if (toDate.getTime() <= fromDate.getTime()) {
    return { error: 'invalid_time_range' };
  }

  const maxRangeMs = 180 * 24 * 60 * 60 * 1000;
  if (toDate.getTime() - fromDate.getTime() > maxRangeMs) {
    return { error: 'time_range_too_large' };
  }

  const bucket = toDate.getTime() - fromDate.getTime() <= 48 * 60 * 60 * 1000 ? 'hour' : 'day';

  return {
    preset: activePreset,
    bucket,
    fromIso: fromDate.toISOString(),
    toIso: toDate.toISOString(),
  };
}

function getBucketLabel(createdAt, bucket) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  if (bucket === 'hour') {
    date.setUTCMinutes(0, 0, 0);
    return `${date.toISOString().slice(0, 13)}:00:00Z`;
  }

  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

function aggregateEvents(rows, bucket) {
  const timeseriesMap = new Map();
  const topPagesMap = new Map();
  const topElementsMap = new Map();
  const durationByPageMap = new Map();
  const uniquePageviewSessions = new Set();

  let totalClicks = 0;
  let totalPageviews = 0;
  let durationSum = 0;
  let durationSamples = 0;

  for (const row of rows) {
    const type = row && typeof row.type === 'string' ? row.type : '';
    const path = normalizePath(row && typeof row.path === 'string' ? row.path : '/');

    if (type === 'click') {
      totalClicks += 1;

      const selector = normalizeSelector(row.element);
      const elementKey = `${selector}|||${path}`;
      const current = topElementsMap.get(elementKey) || { selector, path, count: 0 };
      current.count += 1;
      topElementsMap.set(elementKey, current);
    }

    if (type === 'pageview') {
      totalPageviews += 1;

      const bucketLabel = getBucketLabel(row.created_at, bucket);
      if (bucketLabel) {
        timeseriesMap.set(bucketLabel, (timeseriesMap.get(bucketLabel) || 0) + 1);
      }

      topPagesMap.set(path, (topPagesMap.get(path) || 0) + 1);

      if (typeof row.session_id === 'string' && row.session_id.trim()) {
        uniquePageviewSessions.add(row.session_id.trim());
      }
    }

    if (type === 'duration') {
      const durationMs = Number(row.duration_ms);
      if (Number.isFinite(durationMs) && durationMs >= 0) {
        durationSum += durationMs;
        durationSamples += 1;

        const current = durationByPageMap.get(path) || { sum: 0, count: 0 };
        current.sum += durationMs;
        current.count += 1;
        durationByPageMap.set(path, current);
      }
    }
  }

  const timeseries = Array.from(timeseriesMap.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([time, accesses]) => ({ time, accesses }));

  const topPages = Array.from(topPagesMap.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 20)
    .map(([path, accesses]) => ({ path, accesses }));

  const avgDurationByPage = Array.from(durationByPageMap.entries())
    .map(([path, data]) => ({
      path,
      avg_duration_ms: data.count > 0 ? Math.round(data.sum / data.count) : 0,
      samples: data.count,
    }))
    .sort((left, right) => right.avg_duration_ms - left.avg_duration_ms)
    .slice(0, 20);

  const topElements = Array.from(topElementsMap.values())
    .sort((left, right) => right.count - left.count)
    .slice(0, 20);

  return {
    summary: {
      total_accesses: totalPageviews,
      total_clicks: totalClicks,
      total_pageviews: totalPageviews,
      unique_sessions: uniquePageviewSessions.size,
      avg_duration_ms: durationSamples > 0 ? Math.round(durationSum / durationSamples) : 0,
      duration_samples: durationSamples,
      total_events: rows.length,
    },
    timeseries,
    top_pages: topPages,
    avg_duration_by_page: avgDurationByPage,
    top_elements: topElements,
  };
}

module.exports = async function handler(req, res) {
  const allowedOrigin = getEnv('ALLOWED_ORIGIN');

  if (handleOptions(req, res, allowedOrigin)) return;
  if (!ensureMethod(req, res, ['GET', 'OPTIONS'])) return;
  if (!enforceAllowedOrigin(req, res, allowedOrigin)) return;

  const session = requireAdminSession(req);
  if (!session) {
    return sendJson(res, 401, { error: 'unauthorized' });
  }

  const query = getQuery(req);
  const range = resolveRange(query);
  if (range.error) {
    return sendJson(res, 400, { error: range.error });
  }

  let analyticsRows;
  let truncated = false;
  try {
    const result = await fetchEventsForRange({
      fromIso: range.fromIso,
      toIso: range.toIso,
    });
    analyticsRows = result.rows;
    truncated = result.truncated;
  } catch (error) {
    return sendJson(res, 500, { error: 'failed_to_load_analytics' });
  }

  const analytics = aggregateEvents(analyticsRows, range.bucket);

  return sendJson(res, 200, {
    range: {
      preset: range.preset,
      bucket: range.bucket,
      from: range.fromIso,
      to: range.toIso,
      truncated,
    },
    ...analytics,
  });
};
