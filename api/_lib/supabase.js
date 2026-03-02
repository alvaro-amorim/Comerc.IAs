const { getRequiredEnv } = require('./env');

const DEFAULT_PAGE_SIZE = 1000;
const DEFAULT_MAX_ROWS = 20_000;

function getSupabaseConfig() {
  const url = getRequiredEnv('SUPABASE_URL').replace(/\/+$/, '');
  const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  return { url, serviceRoleKey };
}

async function supabaseRequest(path, options = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const method = options.method || 'GET';

  const response = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body,
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch (error) {
      detail = '';
    }
    throw new Error(`Supabase request failed (${response.status}): ${detail}`);
  }

  return response;
}

async function insertEvents(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return;
  await supabaseRequest('/rest/v1/events', {
    method: 'POST',
    headers: {
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(rows),
  });
}

function buildRangeQuery(fromIso, toIso) {
  const fromFilter = `created_at=gte.${encodeURIComponent(fromIso)}`;
  const toFilter = `created_at=lt.${encodeURIComponent(toIso)}`;
  return `${fromFilter}&${toFilter}`;
}

async function fetchEventsForRange(params) {
  const fromIso = params.fromIso;
  const toIso = params.toIso;
  const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
  const maxRows = params.maxRows || DEFAULT_MAX_ROWS;

  let offset = 0;
  let rows = [];
  let truncated = false;

  while (offset < maxRows) {
    const upperBound = offset + pageSize - 1;
    const query = [
      'select=type,path,session_id,created_at,duration_ms,element',
      buildRangeQuery(fromIso, toIso),
      'order=created_at.asc',
    ].join('&');

    const response = await supabaseRequest(`/rest/v1/events?${query}`, {
      headers: {
        Range: `${offset}-${upperBound}`,
      },
    });

    const page = await response.json();
    if (!Array.isArray(page) || page.length === 0) break;

    rows = rows.concat(page);
    offset += page.length;

    if (page.length < pageSize) break;
  }

  if (rows.length >= maxRows) {
    rows = rows.slice(0, maxRows);
    truncated = true;
  }

  return { rows, truncated };
}

module.exports = {
  fetchEventsForRange,
  insertEvents,
};
