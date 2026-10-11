// ============================================================
//  ui.js — Render helpers for the Instagram Dashboard
// ============================================================

let _chartInstances = {};

const ICON_PATHS = {
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  'trending-up': '<path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
  'trending-down': '<path d="m3 7 6 6 4-4 8 8"/><path d="M21 10v7h-7"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7C3.73 7.71 7.4 5 12 5s8.27 2.71 9.94 6.65a1 1 0 0 1 0 .7C20.27 16.29 16.6 19 12 19S3.73 16.29 2.06 12.35Z"/><circle cx="12" cy="12" r="3"/>',
  sparkles: '<path d="m12 3-1.6 4.4L6 9l4.4 1.6L12 15l1.6-4.4L18 9l-4.4-1.6L12 3Z"/><path d="m5 16-.8 2.2L2 19l2.2.8L5 22l.8-2.2L8 19l-2.2-.8L5 16Z"/><path d="m19 14-.8 2.2L16 17l2.2.8L19 20l.8-2.2L22 17l-2.2-.8L19 14Z"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
  share: '<path d="m17 1 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 23-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V7M17 16v-3"/>',
  reel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m7 3 4 4M13 3l4 4M3 11h18"/><path d="m10 14 4 2-4 2Z"/>',
  carousel: '<rect width="14" height="14" x="3" y="7" rx="2"/><path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  flame: '<path d="M12 22c4.4 0 8-3.6 8-8 0-3-1.5-5.5-4-7 .2 2-1 3.5-2.5 4.3.2-3.5-1.8-7-5-9.3.2 3-1.8 5.2-3.4 7.2A7.8 7.8 0 0 0 4 14c0 4.4 3.6 8 8 8Z"/><path d="M9 18c0-2 1.5-3 3-4 0 2 1 3 2 4"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 11M20 13l-2.2 4.8A7 7 0 0 1 5.5 15"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  stop: '<circle cx="12" cy="12" r="10"/><path d="M8 8l8 8M16 8l-8 8"/>'
};

function iconSvg(name) {
  const paths = ICON_PATHS[name];
  if (!paths) return '';
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

function formatNumber(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString('es');
}

function animateCounter(el) {
  const raw = parseFloat(el.dataset.counter ?? '0');
  const suffix = el.dataset.suffix ?? '';
  const isFloat = el.dataset.float === 'true';
  const duration = 700;
  const start = Date.now();

  function tick() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = raw * eased;

    if (isFloat) {
      el.textContent = current.toFixed(1) + suffix;
    } else {
      el.textContent = formatNumber(Math.round(current)) + suffix;
    }

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function animateAllCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => animateCounter(el));
}

function trendHtml(value, label = '') {
  if (value === 0 || value == null) return '';
  const dir = value > 0 ? 'up' : 'down';
  const arrow = value > 0 ? '↑' : '↓';
  return `<span class="metric-trend ${dir}">${arrow} ${Math.abs(value)}% ${escapeHtml(label)}</span>`;
}

function metricCard({ icon, value, label, cssClass = '', suffix = '', isFloat = false, trend = null }) {
  const numVal = typeof value === 'number' ? value : 0;
  const displayVal = typeof value === 'string' ? escapeHtml(value) : formatNumber(numVal);
  const classAttr = cssClass ? ` ${escapeHtml(cssClass)}` : '';
  const dataAttr = typeof value === 'number'
    ? `data-counter="${numVal}" data-suffix="${escapeHtml(suffix)}"${isFloat ? ' data-float="true"' : ''}`
    : '';

  return `<div class="metric-card">
    ${icon ? `<div class="metric-icon">${iconSvg(icon)}</div>` : ''}
    <span class="metric-value${classAttr}" ${dataAttr}>${displayVal}${escapeHtml(suffix)}</span>
    <span class="metric-label">${escapeHtml(label)}</span>
    ${trend !== null ? trendHtml(trend) : ''}
  </div>`;
}

function sectionWrap(eyebrow, title, content, extraClass = '') {
  return `<div class="section ${extraClass}">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">${escapeHtml(eyebrow)}</div>
        <h2 class="section-title">${escapeHtml(title)}</h2>
      </div>
    </div>
    ${content}
  </div>`;
}

// ============================================================
//  HEADER
// ============================================================

export function renderHeader(data, days = 30, periodo = null, accounts = [], activeAccountId = null, isCustomRange = false) {
  const header = document.getElementById('header');
  if (!header) return;

  const { account, crescimento, alcance, engajamento } = data;
  const { username, name, profilePicture } = account ?? {};

  const initial = escapeHtml((username ?? 'U')[0].toUpperCase());
  const avatarSrc = profilePicture ? '/api/avatar?url=' + encodeURIComponent(profilePicture) : '';
  const avatarInner = profilePicture
    ? `<img src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(username ?? '')}" onerror="this.replaceWith(document.createTextNode('${initial}'))">`
    : initial;

  const kpis = [
    { label: 'Seguidores', value: formatNumber(crescimento?.seguidoresTotal ?? 0) },
    { label: 'Eng. del perfil', value: (engajamento?.taxaEngajamento ?? 0) + '%' },
    { label: 'Alcance', value: formatNumber(alcance?.contasAlcancadas ?? 0) },
    { label: 'Impresiones', value: formatNumber(alcance?.impressoes ?? 0) },
  ];

  const kpisHtml = kpis.map((kpi, i) => {
    const divider = i < kpis.length - 1 ? '<div class="header-kpi-divider"></div>' : '';
    return `<div class="header-kpi">
      <span class="header-kpi-value">${escapeHtml(kpi.value)}</span>
      <span class="header-kpi-label">${escapeHtml(kpi.label)}</span>
    </div>${divider}`;
  }).join('');

  // Account switcher dropdown
  const accountItems = accounts.map(acc => {
    const isActive = acc.id === activeAccountId;
    const initial = (acc.username || acc.label || 'U')[0].toUpperCase();
    const thumbSrc = acc.profilePicture ? '/api/avatar?url=' + encodeURIComponent(acc.profilePicture) : '';
    const thumb = acc.profilePicture
      ? `<img src="${escapeHtml(thumbSrc)}" style="width:28px;height:28px;border-radius:50%;object-fit:cover" onerror="this.outerHTML='<span class=\\'acc-initial\\'>${escapeHtml(initial)}</span>'">`
      : `<span class="acc-initial">${escapeHtml(initial)}</span>`;
    return `<div class="acc-item${isActive ? ' active' : ''}" data-account-id="${escapeHtml(acc.id)}">
      <div class="acc-thumb">${thumb}</div>
      <span class="acc-label">${escapeHtml(acc.label || '@' + acc.username)}</span>
      ${isActive ? '<span class="acc-check">✓</span>' : ''}
    </div>`;
  }).join('');

  const switcherHtml = accounts.length > 0 ? `
    <div class="account-switcher" id="accountSwitcher">
      <button class="account-switcher-btn" id="accountSwitcherBtn">
        <div class="acc-thumb-sm">${avatarInner}</div>
        <span>@${escapeHtml(username ?? '')}</span>
        <span class="switcher-arrow">▾</span>
      </button>
      <div class="account-switcher-dropdown" id="accountSwitcherDropdown">
        ${accountItems}
        <div class="acc-divider"></div>
        <button class="acc-add-btn" id="btnAddAccount">+ Agregar cuenta</button>
      </div>
    </div>` : '';

  header.innerHTML = `
    <div class="header-top">
      <div class="header-user">
        ${switcherHtml}
        <div>
          ${name ? `<div class="header-name">${escapeHtml(name)}</div>` : ''}
        </div>
      </div>
      <div class="header-actions">
        <span class="header-timestamp"></span>
        ${periodo ? `<span class="period-badge">${escapeHtml(periodo.desde)} → ${escapeHtml(periodo.ate)}</span>` : ''}
        <div class="date-filter">
          <button class="date-filter-btn ${!isCustomRange && days === 7 ? 'active' : ''}" data-days="7">7d</button>
          <button class="date-filter-btn ${!isCustomRange && days === 14 ? 'active' : ''}" data-days="14">14d</button>
          <button class="date-filter-btn ${!isCustomRange && days === 30 ? 'active' : ''}" data-days="30">30d</button>
          <button class="date-filter-btn ${isCustomRange ? 'active' : ''}" id="btnCustomRange">Personalizado</button>
        </div>
        <div class="custom-range-picker ${isCustomRange ? 'visible' : ''}" id="customRangePicker">
          <input type="date" id="dateFrom" class="date-input">
          <span class="date-separator">→</span>
          <input type="date" id="dateTo" class="date-input">
          <button class="btn btn-primary btn-sm" id="btnApplyRange">Aplicar</button>
        </div>
        <button class="btn btn-ghost" id="btnExport">${iconSvg('download')}<span>HTML</span></button>
        <button class="btn btn-ghost" id="btnAiAnalysis">${iconSvg('sparkles')}<span>Analizar</span></button>
        <button class="btn btn-ghost" id="btnExportPdf">${iconSvg('file')}<span>PDF</span></button>
        <button class="btn btn-primary" id="btnRefresh">${iconSvg('refresh')}<span>Actualizar</span></button>
        <button class="btn btn-danger btn-icon-only" id="btnDisconnect" aria-label="Salir" title="Salir">${iconSvg('logout')}</button>
      </div>
    </div>
    <div class="header-kpis">${kpisHtml}</div>`;
}

// ============================================================
//  CHARTS
// ============================================================

function destroyPrimaryCharts() {
  ['weekly', 'content'].forEach(key => {
    try { _chartInstances[key]?.destroy(); } catch (_) {}
    delete _chartInstances[key];
  });
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function chartFallback(canvas, message) {
  if (!canvas) return;
  canvas.style.display = 'none';
  const container = canvas.parentElement;
  if (!container) return;

  let emptyState = container.querySelector('.chart-empty-state');
  if (!emptyState) {
    emptyState = document.createElement('div');
    emptyState.className = 'chart-empty-state';
    container.appendChild(emptyState);
  }
  emptyState.innerHTML = `${iconSvg('chart')}<span>${escapeHtml(message)}</span>`;
}

function createChartSafe(key, canvas, config, errorMessage) {
  if (!canvas) return null;

  try {
    const registered = typeof Chart.getChart === 'function' ? Chart.getChart(canvas) : null;
    if (registered && registered !== _chartInstances[key]) registered.destroy();
    try { _chartInstances[key]?.destroy(); } catch (_) {}

    canvas.style.display = '';
    canvas.parentElement?.querySelector('.chart-empty-state')?.remove();
    const instance = new Chart(canvas, config);
    _chartInstances[key] = instance;
    return instance;
  } catch (error) {
    console.error(`No se pudo crear el gráfico ${key}:`, error);
    chartFallback(canvas, errorMessage || 'No fue posible mostrar este gráfico. Actualiza el dashboard e inténtalo de nuevo.');
    return null;
  }
}

function initCharts(weeklyData, conteudo) {
  if (typeof Chart === 'undefined') return;

  destroyPrimaryCharts();

  if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
  }

  Chart.defaults.color = '#7D5D51';
  Chart.defaults.font.family = "'DM Sans', sans-serif";
  Chart.defaults.font.size = 11;

  const tooltipDefaults = {
    backgroundColor: 'rgba(42, 27, 21, 0.96)',
    titleColor: '#FFF8F7',
    bodyColor: '#F6E3DF',
    borderColor: 'rgba(255, 181, 183, 0.45)',
    borderWidth: 1,
    padding: 10,
    cornerRadius: 10,
  };

  const gridColor = 'rgba(71, 46, 37, 0.08)';
  const tickColor = '#7D5D51';

  // Chart 1: Engajamento semanal
  const ctx1 = document.getElementById('chartWeekly');
  if (ctx1 && weeklyData?.length) {
    createChartSafe('weekly', ctx1, {
      type: 'bar',
      data: {
        labels: weeklyData.map(w => w.label),
        datasets: [
          {
            label: 'Me gusta',
            data: weeklyData.map(w => safeNumber(w.curtidas)),
            backgroundColor: '#472E25',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Guardados',
            data: weeklyData.map(w => safeNumber(w.saves)),
            backgroundColor: '#FFB5B7',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Compartidos',
            data: weeklyData.map(w => safeNumber(w.shares)),
            backgroundColor: '#B8445A',
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { labels: { color: tickColor, boxWidth: 12, padding: 16 } },
          tooltip: tooltipDefaults,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#472E25',
            font: { size: 10, weight: '600' },
            formatter: v => v > 0 ? (v >= 1000 ? (v / 1000).toFixed(1) + 'K' : v) : '',
          },
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: tickColor } },
          y: { grid: { color: gridColor }, ticks: { color: tickColor } },
        },
      },
    }, 'No hay datos semanales disponibles todavía. Pulsa Actualizar para volver a consultarlos.');
  } else if (ctx1) {
    chartFallback(ctx1, 'No hay datos semanales disponibles todavía. Pulsa Actualizar para volver a consultarlos.');
  }

  // Chart 2: Distribuição de conteúdo
  const ctx2 = document.getElementById('chartContent');
  if (ctx2) {
    const raw = conteudo ?? {};
    const reels = safeNumber(raw.reels);
    const carrosseis = safeNumber(raw.carrosseis);
    const postsEstaticos = safeNumber(raw.postsEstaticos);
    const stories = safeNumber(raw.stories);
    const total = reels + carrosseis + postsEstaticos + stories;
    if (total <= 0) {
      chartFallback(ctx2, 'Meta todavía no devolvió publicaciones para este periodo. Prueba con 30 días y pulsa Actualizar.');
      return;
    }
    createChartSafe('content', ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Reels', 'Carruseles', 'Posts', 'Historias'],
        datasets: [{
          data: [reels, carrosseis, postsEstaticos, stories],
          backgroundColor: ['#472E25', '#FFB5B7', '#B8445A', '#C9A79D'],
          borderColor: '#FFFFFF',
          borderWidth: 2,
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        cutout: '62%',
        plugins: {
          legend: { position: 'bottom', labels: { color: tickColor, boxWidth: 12, padding: 14 } },
          tooltip: tooltipDefaults,
          datalabels: {
            color: '#FFFFFF',
            font: { size: 11, weight: '700' },
            formatter: (v) => {
              const pct = total > 0 ? Math.round(v / total * 100) : 0;
              return pct >= 8 ? pct + '%' : '';
            },
          },
        },
      },
    }, 'No fue posible mostrar la distribución de contenido. Pulsa Actualizar para intentarlo otra vez.');
  }
}

// ============================================================
//  TOP POSTS
// ============================================================

function typeLabel(m) {
  if (m.media_product_type === 'REELS') return 'Reel';
  if (m.media_type === 'CAROUSEL_ALBUM') return 'Carrusel';
  return 'Post';
}

function typeIcon(m) {
  if (m.media_product_type === 'REELS') return iconSvg('reel');
  if (m.media_type === 'CAROUSEL_ALBUM') return iconSvg('carousel');
  return iconSvg('image');
}

function renderTopPosts(topPosts) {
  if (!topPosts?.length) return '';

  const cards = topPosts.map(post => {
    const imgSrc = post.thumbnail_url || post.media_url || null;
    const thumb = imgSrc
      ? `<img src="${escapeHtml(imgSrc)}" alt="post" loading="lazy">`
      : `<span class="post-placeholder-icon">${typeIcon(post)}</span>`;

    const link = post.permalink ? escapeHtml(post.permalink) : '#';

    return `<a class="post-card" href="${link}" target="_blank" rel="noopener">
      <div class="post-thumb-wrap">
        ${thumb}
        <span class="post-type-badge">${typeLabel(post)}</span>
      </div>
      <div class="post-stats">
        <div class="post-stat">
          <span class="post-stat-value">${formatNumber(post.like_count ?? 0)}</span>
          <span class="post-stat-label">Me gusta</span>
        </div>
        <div class="post-stat">
          <span class="post-stat-value">${formatNumber(post.saves ?? 0)}</span>
          <span class="post-stat-label">Guardados</span>
        </div>
        <div class="post-stat">
          <span class="post-stat-value">${formatNumber(post.shares ?? 0)}</span>
          <span class="post-stat-label">Compartidos</span>
        </div>
      </div>
    </a>`;
  }).join('');

  return sectionWrap('Mejores publicaciones', 'Top posts', `<div class="posts-grid">${cards}</div>`);
}

// ============================================================
//  AUDIENCE
// ============================================================

function renderAudience(audiencia) {
  const { pctMulheres = 0, pctHomens = 0, faixaEtaria = null, cidades = [] } = audiencia ?? {};

  const genderCard = `<div class="glass-card">
    <div class="section-eyebrow">Género</div>
    <h3 class="section-title" style="font-size:17px;margin-bottom:20px">Audiencia</h3>
    <div class="gender-bar-container">
      <div class="gender-row">
        <div class="gender-header">
          <span class="gender-label">Mujeres</span>
          <span class="gender-value female">${pctMulheres}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill female" style="width:${pctMulheres}%"></div>
        </div>
      </div>
      <div class="gender-row">
        <div class="gender-header">
          <span class="gender-label">Hombres</span>
          <span class="gender-value male">${pctHomens}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill male" style="width:${pctHomens}%"></div>
        </div>
      </div>
    </div>
  </div>`;

  const cityItems = (cidades ?? []).map((c, i) => `
    <div class="city-item">
      <div class="city-row">
        <span class="city-rank">${i + 1}</span>
        <span class="city-name">${escapeHtml(c.nome)}</span>
        <span class="city-pct">${c.pct}%</span>
      </div>
      <div class="city-bar"><div class="city-bar-fill" style="width:${c.pct}%"></div></div>
    </div>`).join('');

  const citiesCard = `<div class="glass-card">
    <div class="section-eyebrow">Ubicación</div>
    <h3 class="section-title" style="font-size:17px;margin-bottom:20px">Ciudades principales</h3>
    <div class="city-list">${cityItems || '<span style="color:var(--text-muted);font-size:13px">Sin datos</span>'}</div>
  </div>`;

  const ageCard = `<div class="glass-card" style="display:flex;flex-direction:column">
    <div class="section-eyebrow">Rango de edad</div>
    <h3 class="section-title" style="font-size:17px;margin-bottom:16px">Principal</h3>
    <div class="age-display">
      <div class="age-value">${escapeHtml(faixaEtaria ?? '—')}</div>
      <div class="age-label">Donde se concentran<br>tus seguidores</div>
    </div>
  </div>`;

  return `<div class="section">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">Quién te sigue</div>
        <h2 class="section-title">Audiencia y datos</h2>
      </div>
    </div>
    <div class="audience-grid">${genderCard}${citiesCard}${ageCard}</div>
  </div>`;
}

// ============================================================
//  ANALYSIS & RECOMMENDATIONS
// ============================================================

function renderAnalysis(data) {
  const { engajamento, alcance, crescimento, contentPerformance, storiesPerformance } = data;

  const reach = alcance?.contasAlcancadas ?? 0;
  const saves = engajamento?.salvamentos ?? 0;
  const shares = engajamento?.compartilhamentos ?? 0;
  const taxaEng = engajamento?.taxaEngajamento ?? 0;
  const novosSegs = crescimento?.novosSeguidores ?? 0;

  const saveRate = reach > 0 ? Math.round((saves / reach) * 1000) / 10 : 0;
  const shareRate = reach > 0 ? Math.round((shares / reach) * 1000) / 10 : 0;

  const cp = contentPerformance ?? {};
  const formats = [
    { name: 'Reels', avgViews: cp.reels?.avgViews ?? 0, avgLikes: cp.reels?.avgLikes ?? 0, avgSaves: cp.reels?.avgSaves ?? 0, count: cp.reels?.count ?? 0 },
    { name: 'Carruseles', avgViews: cp.carrosseis?.avgViews ?? 0, avgLikes: cp.carrosseis?.avgLikes ?? 0, avgSaves: cp.carrosseis?.avgSaves ?? 0, count: cp.carrosseis?.count ?? 0 },
    { name: 'Posts', avgViews: cp.posts?.avgViews ?? 0, avgLikes: cp.posts?.avgLikes ?? 0, avgSaves: cp.posts?.avgSaves ?? 0, count: cp.posts?.count ?? 0 },
  ].filter(f => f.count > 0);

  const bestReach = formats.length > 0 ? formats.reduce((b, f) => f.avgViews > b.avgViews ? f : b, formats[0]) : null;
  const bestSaves = formats.length > 0 ? formats.reduce((b, f) => f.avgSaves > b.avgSaves ? f : b, formats[0]) : null;
  const worstReach = formats.length > 1 ? [...formats].sort((a, b) => a.avgViews - b.avgViews)[0] : null;

  const continuar = [];
  const melhorar = [];
  const parar = [];

  // --- Continuar ---
  if (bestReach && formats.length > 1) {
    continuar.push(`<strong>${bestReach.name}</strong> lideran en alcance promedio (${formatNumber(bestReach.avgViews)} por publicación). Sigue priorizando ese formato.`);
  }
  if (saveRate >= 2) {
    continuar.push(`Tasa de guardados en <strong>${saveRate}%</strong>, por encima de la referencia de 2%. Tu contenido está generando autoridad. Mantén ese enfoque.`);
  }
  if (taxaEng >= 3) {
    continuar.push(`Tasa de interacción en <strong>${taxaEng}%</strong>, dentro del rango ideal. Mantén la frecuencia y la calidad.`);
  }
  if ((storiesPerformance?.retencaoPct ?? 0) >= 70) {
    continuar.push(`Retención de historias en <strong>${storiesPerformance.retencaoPct}%</strong>. Tus secuencias funcionan. Sigue publicando historias con regularidad.`);
  }
  if (novosSegs > 0) {
    continuar.push(`<strong>${formatNumber(novosSegs)} nuevos seguidores</strong> en el período. Tu estrategia para atraer seguidores está funcionando.`);
  }

  // --- Melhorar ---
  if (saveRate < 2 && reach > 0) {
    melhorar.push(`Tasa de guardados en <strong>${saveRate}%</strong> (referencia: más de 2%). Crea contenidos más didácticos, completos o con paso a paso para que te guarden.`);
  }
  if (shareRate < 1 && reach > 0) {
    melhorar.push(`Tasa de compartidos en <strong>${shareRate}%</strong> (referencia: más de 1%). Apuesta por contenidos con opinión clara, listas y comparaciones que tu audiencia quiera compartir.`);
  }
  if (taxaEng > 0 && taxaEng < 3) {
    melhorar.push(`Tasa de interacción en <strong>${taxaEng}%</strong>, por debajo de lo ideal. Revisa tus llamados a la acción e incluye preguntas en los posts para que comenten.`);
  }
  if ((storiesPerformance?.retencaoPct ?? 0) > 0 && storiesPerformance.retencaoPct < 60) {
    melhorar.push(`Retención de historias en <strong>${storiesPerformance.retencaoPct}%</strong>. Baja a 3-5 historias por secuencia y usa encuestas y preguntas para mantener la atención.`);
  }
  if (bestSaves && bestSaves.name !== bestReach?.name) {
    melhorar.push(`<strong>${bestSaves.name}</strong> generan más guardados pero no lideran en alcance. Prueba publicar ese formato más seguido para sumar autoridad y alcance.`);
  }

  // --- Parar ---
  if (worstReach && bestReach && bestReach.avgViews > 0 && worstReach.avgViews < bestReach.avgViews * 0.35 && worstReach.name !== bestReach.name) {
    parar.push(`<strong>${worstReach.name}</strong> tienen un alcance promedio de ${formatNumber(worstReach.avgViews)} frente a ${formatNumber(bestReach.avgViews)} de los ${bestReach.name}. Publica menos de ese formato y dirige el esfuerzo hacia el formato que mejor funciona.`);
  }
  if (novosSegs <= 0 && (crescimento?.seguidoresTotal ?? 0) > 0) {
    parar.push(`Crecimiento de seguidores <strong>estancado</strong> en el período. Revisa tu estrategia para atraer seguidores y prueba ganchos más fuertes en los primeros 3 segundos de los reels.`);
  }
  if (shareRate === 0 && reach > 200) {
    parar.push(`<strong>Cero compartidos</strong> en el período. Evita contenidos genéricos o sin punto de vista. Cada post necesita una postura clara o información que no se encuentre en otro lado.`);
  }

  if (continuar.length === 0) continuar.push('Revisa tus métricas cada mes para detectar patrones con el tiempo.');
  if (melhorar.length === 0) melhorar.push('No se detectaron caídas importantes. Prueba formatos nuevos y compara en los próximos meses.');
  if (parar.length === 0) parar.push('No se detectaron patrones negativos en este período.');

  const saveColor = saveRate >= 2 ? 'var(--positive)' : saveRate >= 1 ? '#f59e0b' : 'var(--negative)';
  const shareColor = shareRate >= 1 ? 'var(--positive)' : shareRate >= 0.5 ? '#f59e0b' : 'var(--negative)';
  const engColor = taxaEng >= 3 ? 'var(--positive)' : taxaEng >= 1.5 ? '#f59e0b' : 'var(--negative)';

  const healthCards = `<div class="cards-row">
    <div class="metric-card">
      <div class="metric-icon">${iconSvg('bookmark')}</div>
      <span class="metric-value" style="color:${saveColor}">${saveRate}%</span>
      <span class="metric-label">Tasa de guardados</span>
      <span class="metric-trend neutral" style="font-size:10px">referencia: más de 2%</span>
    </div>
    <div class="metric-card">
      <div class="metric-icon">${iconSvg('share')}</div>
      <span class="metric-value" style="color:${shareColor}">${shareRate}%</span>
      <span class="metric-label">Tasa de compartidos</span>
      <span class="metric-trend neutral" style="font-size:10px">referencia: más de 1%</span>
    </div>
    <div class="metric-card">
      <div class="metric-icon">${iconSvg('zap')}</div>
      <span class="metric-value" style="color:${engColor}">${taxaEng}%</span>
      <span class="metric-label">Tasa de interacción</span>
      <span class="metric-trend neutral" style="font-size:10px">referencia: más de 3%</span>
    </div>
    ${bestReach ? `<div class="metric-card">
      <div class="metric-icon">${iconSvg('trophy')}</div>
      <span class="metric-value" style="font-size:18px">${escapeHtml(bestReach.name)}</span>
      <span class="metric-label">Mejor formato (alcance)</span>
      <span class="metric-trend neutral" style="font-size:10px">${formatNumber(bestReach.avgViews)} por publicación</span>
    </div>` : ''}
  </div>`;

  const makeList = items => items.map(i => `<li style="margin-bottom:10px;line-height:1.6;font-size:13px">${i}</li>`).join('');

  const recCards = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px">
    <div class="metric-card" style="text-align:left;padding:28px 28px;align-self:start">
      <div class="recommendation-icon positive">${iconSvg('check')}</div>
      <div style="font-weight:600;color:var(--positive);margin-bottom:16px;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Seguir haciendo</div>
      <ul style="padding-left:18px;margin:0;color:var(--text-secondary)">${makeList(continuar)}</ul>
    </div>
    <div class="metric-card" style="text-align:left;padding:28px 28px;align-self:start">
      <div class="recommendation-icon warning">${iconSvg('alert')}</div>
      <div style="font-weight:600;color:#f59e0b;margin-bottom:16px;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Mejorar</div>
      <ul style="padding-left:18px;margin:0;color:var(--text-secondary)">${makeList(melhorar)}</ul>
    </div>
    <div class="metric-card" style="text-align:left;padding:28px 28px;align-self:start">
      <div class="recommendation-icon danger">${iconSvg('stop')}</div>
      <div style="font-weight:600;color:var(--negative);margin-bottom:16px;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Dejar de hacer</div>
      <ul style="padding-left:18px;margin:0;color:var(--text-secondary)">${makeList(parar)}</ul>
    </div>
  </div>`;

  return sectionWrap('Lo que dicen tus datos', 'Análisis y recomendaciones', healthCards + recCards);
}

// ============================================================
//  POSTING HEATMAP
// ============================================================

function renderHeatmap(postingHeatmap) {
  if (!postingHeatmap || postingHeatmap.length === 0) return '';

  const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const grid = {};
  let maxEng = 0;
  postingHeatmap.forEach(h => {
    const key = h.day + '-' + h.hour;
    grid[key] = h;
    if (h.avgEng > maxEng) maxEng = h.avgEng;
  });

  // Find best slot
  let bestSlot = null;
  postingHeatmap.forEach(h => {
    if (!bestSlot || h.avgEng > bestSlot.avgEng) bestSlot = h;
  });

  const headerCells = hours.map(h => '<div class="heatmap-header-cell">' + h + 'h</div>').join('');

  const rows = dayLabels.map((label, dayIdx) => {
    const cells = hours.map(hour => {
      const key = dayIdx + '-' + hour;
      const cell = grid[key];
      if (!cell) return '<div class="heatmap-cell empty"></div>';
      const intensity = maxEng > 0 ? Math.round((cell.avgEng / maxEng) * 100) : 0;
      const isBest = bestSlot && cell.day === bestSlot.day && cell.hour === bestSlot.hour;
      return '<div class="heatmap-cell' + (isBest ? ' best' : '') + '" style="--intensity:' + intensity + '%" title="' + label + ' ' + hour + 'h: ' + cell.avgEng + ' interacción promedio (' + cell.count + ' posts)">' + (cell.count > 0 ? cell.avgEng : '') + '</div>';
    }).join('');
    return '<div class="heatmap-row"><div class="heatmap-day-label">' + label + '</div>' + cells + '</div>';
  }).join('');

  const bestLabel = bestSlot ? dayLabels[bestSlot.day] + ' a las ' + bestSlot.hour + 'h (' + bestSlot.avgEng + ' interacción promedio)' : '';

  return sectionWrap('Cuándo publicar', 'Mejor horario', '<div class="heatmap-wrap"><div class="heatmap-header"><div class="heatmap-day-label"></div>' + headerCells + '</div>' + rows + '</div>' + (bestLabel ? '<p class="heatmap-best">' + iconSvg('sparkles') + '<span>Mejor horario: <strong>' + bestLabel + '</strong></span></p>' : '') + '<p class="heatmap-legend"><span class="heatmap-legend-low"></span> Interacción baja <span class="heatmap-legend-high"></span> Interacción alta</p>');
}

// ============================================================
//  MAIN RENDER
// ============================================================

export function renderDashboard(data, deltas = null) {
  const dashboard = document.getElementById('dashboard');
  if (!dashboard) return;

  const d = deltas || {};

  const { crescimento, alcance, engajamento, conteudo,
    reelsPerformance, storiesPerformance, audiencia,
    topPosts, weeklyData, contentPerformance, periodo,
    postingHeatmap } = data;

  const unfollowsCard = crescimento?.unfollows === null
    ? `<div class="metric-card">
        <div class="metric-icon">${iconSvg('trending-down')}</div>
        <span class="metric-value" style="font-size:16px;color:var(--text-muted)">N/D</span>
        <span class="metric-label">Dejaron de seguir</span>
        <span class="metric-trend neutral" style="font-size:10px">La API no lo muestra</span>
      </div>`
    : metricCard({ icon: 'trending-down', value: crescimento?.unfollows ?? 0, label: 'Dejaron de seguir', cssClass: 'negative' });

  let periodoLabel = periodo
    ? `${periodo.desde} → ${periodo.ate}`
    : `Últimos ${periodo?.dias ?? 30} días`;

  if (d._prevDate) {
    const [y, m, day] = d._prevDate.split('-');
    periodoLabel += ` — comparado con el registro del ${day}/${m}`;
  }

  const weeklyValues = (weeklyData ?? []).map(w => (w.curtidas ?? 0) + (w.saves ?? 0) + (w.shares ?? 0));
  const sparkValues = weeklyValues.length > 1 ? weeklyValues : [24, 42, 35, 68, 57, 86];
  const sparkMax = Math.max(...sparkValues, 1);
  const sparkPoints = sparkValues.map((value, index) => {
    const x = sparkValues.length === 1 ? 150 : index * (300 / (sparkValues.length - 1));
    const y = 92 - (value / sparkMax) * 72;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const hero = `<section class="insight-hero">
    <div class="insight-hero-copy">
      <div class="hero-eyebrow">Inteligencia de Instagram · ${escapeHtml(periodoLabel)}</div>
      <h1>Tus datos, convertidos en <em>decisiones.</em></h1>
      <p>En este periodo alcanzaste <strong>${formatNumber(alcance?.contasAlcancadas ?? 0)} cuentas</strong> y generaste <strong>${formatNumber(engajamento?.interacoesTotal ?? 0)} interacciones</strong>. Aquí tienes la lectura completa para decidir qué repetir, ajustar y dejar atrás.</p>
      <div class="hero-stats">
        <div><strong>${formatNumber(crescimento?.novosSeguidores ?? 0)}</strong><span>Nuevos seguidores</span></div>
        <div><strong>${formatNumber(alcance?.contasAlcancadas ?? 0)}</strong><span>Alcance</span></div>
        <div><strong>${engajamento?.taxaEngajamento ?? 0}%</strong><span>Engagement del perfil</span></div>
      </div>
    </div>
    <div class="hero-visual" aria-label="Tendencia de interacciones del periodo">
      <div class="hero-chart-label"><span>${iconSvg('trending-up')}</span> Tendencia del periodo</div>
      <svg viewBox="0 0 300 110" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="heroFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#FFB5B7" stop-opacity=".34"/>
            <stop offset="100%" stop-color="#FFB5B7" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="0,106 ${sparkPoints} 300,106" fill="url(#heroFill)"/>
        <polyline points="${sparkPoints}" fill="none" stroke="#FFB5B7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="hero-chart-footer"><span>Contenido</span><span>Alcance</span><span>Conversación</span></div>
    </div>
  </section>`;

  // 1. Crescimento + Alcance + Engajamento
  const s1 = sectionWrap(periodoLabel, 'Crecimiento y alcance', `
    <div class="cards-row">
      ${metricCard({ icon: 'users', value: crescimento?.seguidoresTotal ?? 0, label: 'Seguidores totales', trend: d.seguidores })}
      ${metricCard({ icon: 'trending-up', value: crescimento?.novosSeguidores ?? 0, label: 'Nuevos seguidores', cssClass: 'positive', trend: d.novosSeguidores })}
      ${unfollowsCard}
      ${metricCard({ icon: 'eye', value: alcance?.contasAlcancadas ?? 0, label: 'Cuentas alcanzadas', trend: d.alcance })}
      ${metricCard({ icon: 'sparkles', value: alcance?.impressoes ?? 0, label: 'Impresiones', trend: d.impressoes })}
    </div>`);

  // 2. Engajamento
  const s2 = sectionWrap('Lectura del periodo', 'Engagement e interacciones', `
    <div class="cards-row">
      ${metricCard({ icon: 'heart', value: engajamento?.curtidas ?? 0, label: 'Me gusta', trend: d.curtidas })}
      ${metricCard({ icon: 'message', value: engajamento?.comentarios ?? 0, label: 'Comentarios', trend: d.comentarios })}
      ${metricCard({ icon: 'bookmark', value: engajamento?.salvamentos ?? 0, label: 'Guardados', trend: d.salvamentos })}
      ${metricCard({ icon: 'share', value: engajamento?.compartilhamentos ?? 0, label: 'Compartidos', trend: d.compartilhamentos })}
      ${metricCard({ icon: 'zap', value: engajamento?.interacoesTotal ?? 0, label: 'Interacciones totales', trend: d.interacoesTotal })}
      ${metricCard({ icon: 'chart', value: engajamento?.taxaEngajamento ?? 0, label: 'Engagement del perfil', suffix: '%', isFloat: true, cssClass: 'accent', trend: d.taxaEngajamento })}
      ${metricCard({ icon: 'trending-up', value: engajamento?.engagementMedioPost ?? 0, label: 'Engagement promedio por post', suffix: '%', isFloat: true, cssClass: 'accent', trend: d.engagementMedioPost })}
    </div>`);

  // 3. Charts
  const chartsSection = `<div class="section">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">Tendencias</div>
        <h2 class="section-title">Análisis visual</h2>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-eyebrow">últimas 4 semanas</div>
        <div class="chart-title">Interacción semanal</div>
        <div class="chart-container"><canvas id="chartWeekly"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-eyebrow">distribución</div>
        <div class="chart-title">Mix de contenido</div>
        <div class="chart-container"><canvas id="chartContent"></canvas></div>
      </div>
    </div>
  </div>`;

  // 4. Content Performance
  const cp = contentPerformance ?? {};
  const s4 = sectionWrap('Rendimiento por formato', 'Resultados por tipo', `
    <div class="cards-row">
      ${metricCard({ icon: 'reel', value: cp.reels?.count ?? 0, label: 'Reels publicados' })}
      ${metricCard({ icon: 'eye', value: cp.reels?.avgViews ?? 0, label: 'Promedio de vistas por reel' })}
      ${metricCard({ icon: 'heart', value: cp.reels?.avgLikes ?? 0, label: 'Promedio de me gusta por reel' })}
      ${metricCard({ icon: 'bookmark', value: cp.reels?.avgSaves ?? 0, label: 'Promedio de guardados por reel' })}
    </div>
    <div class="cards-row" style="margin-top:12px">
      ${metricCard({ icon: 'carousel', value: cp.carrosseis?.count ?? 0, label: 'Carruseles publicados' })}
      ${metricCard({ icon: 'heart', value: cp.carrosseis?.avgLikes ?? 0, label: 'Promedio de me gusta por carrusel' })}
      ${metricCard({ icon: 'bookmark', value: cp.carrosseis?.avgSaves ?? 0, label: 'Promedio de guardados por carrusel' })}
      ${metricCard({ icon: 'image', value: cp.posts?.count ?? 0, label: 'Posts estáticos' })}
    </div>`);

  // 5. Stories
  const s5 = sectionWrap('Historias', 'Rendimiento de historias', `
    <div class="cards-row">
      ${metricCard({ icon: 'flame', value: storiesPerformance?.alcanceMedio ?? 0, label: 'Alcance promedio' })}
      ${metricCard({ icon: 'chart', value: storiesPerformance?.retencaoPct ?? 0, label: 'Retención', suffix: '%', isFloat: false, cssClass: 'accent' })}
      ${metricCard({ icon: 'message', value: storiesPerformance?.respostas ?? 0, label: 'Respuestas' })}
      ${metricCard({ icon: 'smartphone', value: conteudo?.stories ?? 0, label: 'Historias publicadas' })}
    </div>`);

  // 6. Posting Heatmap
  const s6 = renderHeatmap(postingHeatmap);

  // 7. Top Posts
  const s7 = renderTopPosts(topPosts);

  // 8. Audience
  const s8 = renderAudience(audiencia);

  // 9. Analysis & Recommendations
  const s9 = renderAnalysis(data);

  // 10. Evolution (placeholder — populated async from IndexedDB)
  const evolutionSection = `<div class="section" id="evolutionSection" style="display:none">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">Historial</div>
        <h2 class="section-title">Evolución en el tiempo</h2>
      </div>
    </div>
    <div class="evolution-grid">
      <div class="chart-card">
        <div class="chart-eyebrow">seguidores</div>
        <div class="chart-title">Crecimiento de seguidores</div>
        <div class="chart-container"><canvas id="chartEvoFollowers"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-eyebrow">alcance e impresiones</div>
        <div class="chart-title">Alcance por período</div>
        <div class="chart-container"><canvas id="chartEvoReach"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-eyebrow">interacción</div>
        <div class="chart-title">Tasa de interacción</div>
        <div class="chart-container"><canvas id="chartEvoEngagement"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-eyebrow">interacciones</div>
        <div class="chart-title">Me gusta, guardados y compartidos</div>
        <div class="chart-container"><canvas id="chartEvoInteractions"></canvas></div>
      </div>
    </div>
    <p class="evolution-hint" id="evolutionHint"></p>
  </div>`;

  // 11. AI Analysis (hidden, populated on button click)
  const aiSection = `<div class="section" id="aiAnalysisSection" style="display:none">
    <div class="section-header">
      <div>
        <div class="section-eyebrow">Inteligencia artificial</div>
        <h2 class="section-title">Análisis personalizado</h2>
      </div>
    </div>
    <div class="glass-card" style="padding:24px">
      <pre class="ai-analysis-content" style="white-space:pre-wrap;font-family:var(--font-ui);font-size:13px;line-height:1.8;color:var(--text-secondary)"></pre>
    </div>
  </div>`;

  dashboard.innerHTML = hero + s1 + s2 + chartsSection + s4 + s5 + s6 + s7 + s8 + s9 + aiSection + evolutionSection;

  // Init charts and counters after DOM is ready
  requestAnimationFrame(() => {
    initCharts(weeklyData, conteudo);
    animateAllCounters();
  });
}

// ============================================================
//  EVOLUTION CHARTS (populated from IndexedDB snapshots)
// ============================================================

export function initEvolutionCharts(snapshots) {
  const section = document.getElementById('evolutionSection');
  if (section) section.style.display = '';

  const chartKeys = ['evoFollowers', 'evoReach', 'evoEngagement', 'evoInteractions'];
  const chartIds = ['chartEvoFollowers', 'chartEvoReach', 'chartEvoEngagement', 'chartEvoInteractions'];

  if (typeof Chart === 'undefined' || !snapshots?.length) {
    chartIds.forEach(id => chartFallback(document.getElementById(id), 'Este gráfico se completará con tus próximas actualizaciones diarias.'));
    const hint = document.getElementById('evolutionHint');
    if (hint) hint.textContent = 'Todavía no hay registros históricos. Pulsa Actualizar para guardar el primero.';
    return;
  }

  chartKeys.forEach(key => {
    try { _chartInstances[key]?.destroy(); } catch (_) {}
    delete _chartInstances[key];
  });

  // A snapshot is saved for every period (7, 14 and 30 days). Keep only one
  // entry per calendar day so the timeline never repeats the same date.
  const byDate = new Map();
  [...snapshots].sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach(snapshot => {
    if (!snapshot?.date) return;
    const existing = byDate.get(snapshot.date);
    const snapshotTime = snapshot.updatedAt || snapshot.createdAt || '';
    const existingTime = existing?.updatedAt || existing?.createdAt || '';
    if (!existing || snapshot.days === 30 || (existing.days !== 30 && snapshotTime >= existingTime)) {
      byDate.set(snapshot.date, snapshot);
    }
  });

  const sorted = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) {
    chartIds.forEach(id => chartFallback(document.getElementById(id), 'Este gráfico se completará con tus próximas actualizaciones diarias.'));
    return;
  }
  const labels = sorted.map(s => {
    const [y, m, d] = s.date.split('-');
    return d + '/' + m;
  });

  const gridColor = 'rgba(71, 46, 37, 0.08)';
  const tickColor = '#7D5D51';
  const tooltipDefaults = {
    backgroundColor: 'rgba(42, 27, 21, 0.96)',
    titleColor: '#FFF8F7',
    bodyColor: '#F6E3DF',
    borderColor: 'rgba(255, 181, 183, 0.45)',
    borderWidth: 1,
    padding: 10,
    cornerRadius: 10,
  };

  const lineOpts = (yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 950, easing: 'easeOutQuart' },
    plugins: {
      legend: { labels: { color: tickColor, boxWidth: 10, padding: 14 } },
      tooltip: tooltipDefaults,
      datalabels: { display: false },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: tickColor } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor }, title: { display: false } },
    },
    elements: { point: { radius: sorted.length === 1 ? 5 : 4, hoverRadius: 6 }, line: { tension: 0.3 } },
  });

  // 1. Followers
  const ctx1 = document.getElementById('chartEvoFollowers');
  if (ctx1) {
    createChartSafe('evoFollowers', ctx1, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Seguidores',
          data: sorted.map(s => safeNumber(s.kpis?.seguidores)),
          borderColor: '#472E25',
          backgroundColor: 'rgba(255, 181, 183, 0.22)',
          fill: true,
        }],
      },
      options: lineOpts(),
    }, 'El crecimiento de seguidores se mostrará con tus próximas actualizaciones.');
  }

  // 2. Reach & Impressions
  const ctx2 = document.getElementById('chartEvoReach');
  if (ctx2) {
    createChartSafe('evoReach', ctx2, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Alcance',
            data: sorted.map(s => safeNumber(s.kpis?.alcance)),
            borderColor: '#472E25',
            backgroundColor: 'rgba(71, 46, 37, 0.08)',
            fill: false,
          },
          {
            label: 'Impresiones',
            data: sorted.map(s => safeNumber(s.kpis?.impressoes)),
            borderColor: '#FFB5B7',
            backgroundColor: 'rgba(255, 181, 183, 0.14)',
            fill: false,
          },
        ],
      },
      options: lineOpts(),
    }, 'La evolución del alcance se mostrará con tus próximas actualizaciones.');
  }

  // 3. Engagement rate
  const ctx3 = document.getElementById('chartEvoEngagement');
  if (ctx3) {
    createChartSafe('evoEngagement', ctx3, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Tasa de interacción (%)',
          data: sorted.map(s => safeNumber(s.kpis?.taxaEngajamento)),
          borderColor: '#B8445A',
          backgroundColor: 'rgba(184, 68, 90, 0.12)',
          fill: true,
        }],
      },
      options: lineOpts(),
    }, 'La tasa de interacción se mostrará con tus próximas actualizaciones.');
  }

  // 4. Interactions breakdown
  const ctx4 = document.getElementById('chartEvoInteractions');
  if (ctx4) {
    createChartSafe('evoInteractions', ctx4, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Me gusta',
            data: sorted.map(s => safeNumber(s.kpis?.curtidas)),
            borderColor: '#472E25',
            fill: false,
          },
          {
            label: 'Guardados',
            data: sorted.map(s => safeNumber(s.kpis?.salvamentos)),
            borderColor: '#FFB5B7',
            fill: false,
          },
          {
            label: 'Compartidos',
            data: sorted.map(s => safeNumber(s.kpis?.compartilhamentos)),
            borderColor: '#B8445A',
            fill: false,
          },
        ],
      },
      options: lineOpts(),
    }, 'La evolución de las interacciones se mostrará con tus próximas actualizaciones.');
  }

  const hint = document.getElementById('evolutionHint');
  if (hint) {
    hint.textContent = sorted.length === 1
      ? 'Este es tu primer registro. La evolución se completará con las próximas actualizaciones diarias.'
      : sorted.length + ' días registrados — del ' + labels[0] + ' al ' + labels[labels.length - 1];
  }
}
