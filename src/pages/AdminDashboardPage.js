import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import '../styles/AdminDashboardPage.css';

const PRESET_OPTIONS = [
  { value: '24h', label: 'Ultimas 24h' },
  { value: '7d', label: 'Ultimos 7 dias' },
  { value: '30d', label: 'Ultimos 30 dias' },
];

const numberFormatter = new Intl.NumberFormat('pt-BR');

function toDateTimeLocalValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatDuration(durationMs) {
  const value = Number(durationMs || 0);
  if (!Number.isFinite(value) || value <= 0) return '0s';
  if (value < 60_000) return `${Math.max(1, Math.round(value / 1000))}s`;

  const totalMinutes = Math.floor(value / 60_000);
  const seconds = Math.round((value % 60_000) / 1000);
  if (totalMinutes < 60) return `${totalMinutes}m ${seconds}s`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function formatBucketLabel(rawValue, bucket) {
  if (!rawValue) return '-';

  const date = bucket === 'day' ? new Date(`${rawValue}T00:00:00.000Z`) : new Date(rawValue);
  if (Number.isNaN(date.getTime())) return String(rawValue);

  if (bucket === 'day') {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDefaultDateRange() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    from: toDateTimeLocalValue(sevenDaysAgo),
    to: toDateTimeLocalValue(now),
  };
}

function buildAnalyticsQuery(filterMode, preset, from, to) {
  if (filterMode === 'preset') {
    return `preset=${encodeURIComponent(preset)}`;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new Error('Selecione um intervalo valido.');
  }
  if (toDate.getTime() <= fromDate.getTime()) {
    throw new Error('A data final precisa ser maior que a inicial.');
  }

  return `from=${encodeURIComponent(fromDate.toISOString())}&to=${encodeURIComponent(toDate.toISOString())}`;
}

async function fetchWithJson(url, options) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  return { response, payload };
}

function EmptyRow({ colSpan, text }) {
  return (
    <tr>
      <td className="adm-emptyCell" colSpan={colSpan}>
        {text}
      </td>
    </tr>
  );
}

export default function AdminDashboardPage() {
  const initialRange = useMemo(() => getDefaultDateRange(), []);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [filterMode, setFilterMode] = useState('preset');
  const [preset, setPreset] = useState('24h');
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);

  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  const loadAnalytics = useCallback(async () => {
    if (!isAuthenticated) return;

    let query;
    try {
      query = buildAnalyticsQuery(filterMode, preset, from, to);
    } catch (error) {
      setAnalyticsError(error.message || 'Intervalo invalido.');
      return;
    }

    setIsLoadingAnalytics(true);
    setAnalyticsError('');

    try {
      const { response, payload } = await fetchWithJson(`/api/analytics?${query}`);
      if (response.status === 401) {
        setIsAuthenticated(false);
        setAnalytics(null);
        return;
      }
      if (!response.ok) {
        throw new Error((payload && payload.error) || 'Falha ao carregar analytics.');
      }
      setAnalytics(payload);
    } catch (error) {
      setAnalyticsError(error.message || 'Falha ao carregar analytics.');
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [filterMode, from, isAuthenticated, preset, to]);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      try {
        const { response, payload } = await fetchWithJson('/api/auth/me', { method: 'GET' });
        if (!active) return;
        if (response.ok && payload && payload.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (!active) return;
        setIsAuthenticated(false);
      } finally {
        if (active) setIsCheckingAuth(false);
      }
    };

    void checkAuth();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (analytics) return;
    void loadAnalytics();
  }, [analytics, isAuthenticated, loadAnalytics]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (!password) return;

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const { response, payload } = await fetchWithJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setLoginError(response.status === 401 ? 'Senha incorreta.' : 'Falha no login.');
        return;
      }

      setPassword('');
      setAnalytics(null);
      setIsAuthenticated(Boolean(payload && payload.authenticated));
    } catch (error) {
      setLoginError('Falha no login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (error) {
      // Logout precisa invalidar a sessao local mesmo se a request falhar.
    } finally {
      setIsAuthenticated(false);
      setAnalytics(null);
      setPassword('');
      setLoginError('');
    }
  };

  const summary = analytics && analytics.summary ? analytics.summary : {};
  const range = analytics && analytics.range ? analytics.range : {};

  if (isCheckingAuth) {
    return (
      <div className="adm-loginPage">
        <div className="adm-loginCard">
          <h1>Carregando...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="adm-loginPage">
        <form className="adm-loginCard" onSubmit={handleLoginSubmit}>
          <h1>Painel de Analytics</h1>
          <p>Acesso restrito para administracao.</p>

          <label htmlFor="adm-password">Senha</label>
          <input
            id="adm-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {loginError ? <div className="adm-error">{loginError}</div> : null}

          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <header className="adm-header">
        <div className="adm-headerTitle">
          <h1>Analytics</h1>
          <p>
            {range.from && range.to
              ? `Periodo: ${new Date(range.from).toLocaleString('pt-BR')} ate ${new Date(
                  range.to
                ).toLocaleString('pt-BR')}`
              : 'Selecione um periodo e clique em Atualizar.'}
          </p>
        </div>

        <div className="adm-filters">
          <div className="adm-modeSwitch">
            <button
              type="button"
              className={filterMode === 'preset' ? 'active' : ''}
              onClick={() => setFilterMode('preset')}
            >
              Preset
            </button>
            <button
              type="button"
              className={filterMode === 'custom' ? 'active' : ''}
              onClick={() => setFilterMode('custom')}
            >
              Custom
            </button>
          </div>

          {filterMode === 'preset' ? (
            <select value={preset} onChange={(event) => setPreset(event.target.value)}>
              {PRESET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="adm-dateRange">
              <input type="datetime-local" value={from} onChange={(event) => setFrom(event.target.value)} />
              <input type="datetime-local" value={to} onChange={(event) => setTo(event.target.value)} />
            </div>
          )}

          <button type="button" className="adm-primaryBtn" onClick={() => void loadAnalytics()}>
            Atualizar
          </button>
          <button type="button" className="adm-ghostBtn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      {analyticsError ? <div className="adm-bannerError">{analyticsError}</div> : null}

      <main className="adm-grid">
        <section className="adm-metrics">
          <article className="adm-card adm-metricCard">
            <h2>Total de cliques</h2>
            <strong>{numberFormatter.format(summary.total_clicks || 0)}</strong>
          </article>

          <article className="adm-card adm-metricCard">
            <h2>Total de pageviews</h2>
            <strong>{numberFormatter.format(summary.total_pageviews || 0)}</strong>
          </article>

          <article className="adm-card adm-metricCard">
            <h2>Tempo medio por pagina</h2>
            <strong>{formatDuration(summary.avg_duration_ms || 0)}</strong>
          </article>
        </section>

        <section className="adm-card adm-chartCard">
          <div className="adm-cardHeader">
            <h2>Tendencia de cliques</h2>
            <span>{isLoadingAnalytics ? 'Atualizando...' : `${summary.total_events || 0} eventos`}</span>
          </div>
          <div className="adm-chartWrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={(analytics && analytics.timeseries) || []} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="admAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0b5ed7" stopOpacity={0.48} />
                    <stop offset="100%" stopColor="#0b5ed7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e6edf7" strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  minTickGap={18}
                  tick={{ fill: '#385270', fontSize: 12 }}
                  tickFormatter={(value) => formatBucketLabel(value, range.bucket)}
                />
                <YAxis allowDecimals={false} tick={{ fill: '#385270', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [numberFormatter.format(value), 'Cliques']}
                  labelFormatter={(label) => formatBucketLabel(label, range.bucket)}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#0b5ed7"
                  strokeWidth={2}
                  fill="url(#admAreaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="adm-card adm-tableCard adm-topPagesCard">
          <div className="adm-cardHeader">
            <h2>Top paginas (cliques)</h2>
          </div>
          <div className="adm-tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Pagina</th>
                  <th>Cliques</th>
                </tr>
              </thead>
              <tbody>
                {analytics && analytics.top_pages && analytics.top_pages.length ? (
                  analytics.top_pages.map((row) => (
                    <tr key={row.path}>
                      <td title={row.path}>{row.path}</td>
                      <td>{numberFormatter.format(row.clicks || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={2} text="Sem dados no periodo." />
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="adm-card adm-tableCard adm-topElementsCard">
          <div className="adm-cardHeader">
            <h2>Top elementos (cliques)</h2>
          </div>
          <div className="adm-tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Seletor</th>
                  <th>Pagina</th>
                  <th>Cliques</th>
                </tr>
              </thead>
              <tbody>
                {analytics && analytics.top_elements && analytics.top_elements.length ? (
                  analytics.top_elements.map((row, index) => (
                    <tr key={`${row.selector}-${row.path}-${index}`}>
                      <td title={row.selector}>{row.selector}</td>
                      <td title={row.path}>{row.path}</td>
                      <td>{numberFormatter.format(row.count || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={3} text="Sem dados no periodo." />
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="adm-card adm-tableCard adm-durationCard">
          <div className="adm-cardHeader">
            <h2>Tempo medio por pagina</h2>
          </div>
          <div className="adm-tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Pagina</th>
                  <th>Tempo medio</th>
                  <th>Amostras</th>
                </tr>
              </thead>
              <tbody>
                {analytics && analytics.avg_duration_by_page && analytics.avg_duration_by_page.length ? (
                  analytics.avg_duration_by_page.map((row) => (
                    <tr key={row.path}>
                      <td title={row.path}>{row.path}</td>
                      <td>{formatDuration(row.avg_duration_ms || 0)}</td>
                      <td>{numberFormatter.format(row.samples || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <EmptyRow colSpan={3} text="Sem dados no periodo." />
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
