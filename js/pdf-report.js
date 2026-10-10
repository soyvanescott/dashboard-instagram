function fmt(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString('es');
}

function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function kpiRow(items) {
  return '<div class="kpi-row">' + items.map(function(k) {
    return '<div class="kpi"><span class="kpi-val">' + esc(k.value) + '</span><span class="kpi-label">' + esc(k.label) + '</span>'
    + (k.delta != null && k.delta !== 0 ? '<span class="kpi-delta ' + (k.delta > 0 ? 'up' : 'down') + '">' + (k.delta > 0 ? '+' : '') + k.delta + '%</span>' : '')
    + '</div>';
  }).join('') + '</div>';
}

function section(title, content) {
  return '<div class="section"><h2>' + esc(title) + '</h2>' + content + '</div>';
}

export function generateReportHTML(data, deltas, canvasImages) {
  var d = deltas || {};
  var account = data.account || {};
  var periodo = data.periodo;
  var crescimento = data.crescimento || {};
  var alcance = data.alcance || {};
  var engajamento = data.engajamento || {};
  var conteudo = data.conteudo || {};
  var storiesPerformance = data.storiesPerformance || {};
  var audiencia = data.audiencia || {};
  var topPosts = data.topPosts || [];
  var contentPerformance = data.contentPerformance || {};
  var postingHeatmap = data.postingHeatmap || [];

  var username = account.username || 'instagram';
  var periodoText = periodo ? periodo.desde + ' al ' + periodo.ate : '';
  var today = new Date().toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' });

  var cover = '<div class="cover"><div class="cover-inner">'
    + '<div class="cover-icon"><svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="30" width="10" height="24" rx="5"/><rect x="27" y="12" width="10" height="42" rx="5"/><rect x="46" y="22" width="10" height="32" rx="5"/></svg></div>'
    + '<h1>Reporte de métricas</h1>'
    + '<p class="cover-account">@' + esc(username) + '</p>'
    + (periodoText ? '<p class="cover-period">' + esc(periodoText) + '</p>' : '')
    + '<p class="cover-date">Generado el ' + esc(today) + '</p>'
    + '<p class="cover-brand">Dashboard de Instagram</p>'
    + '</div></div>';

  var s1 = section('Crecimiento y alcance', kpiRow([
    { value: fmt(crescimento.seguidoresTotal), label: 'Seguidores', delta: d.seguidores },
    { value: fmt(crescimento.novosSeguidores), label: 'Nuevos seguidores', delta: d.novosSeguidores },
    { value: fmt(alcance.contasAlcancadas), label: 'Alcance', delta: d.alcance },
    { value: fmt(alcance.impressoes), label: 'Impresiones', delta: d.impressoes },
  ]));

  var s2 = section('Interacción', kpiRow([
    { value: fmt(engajamento.curtidas), label: 'Me gusta', delta: d.curtidas },
    { value: fmt(engajamento.comentarios), label: 'Comentarios', delta: d.comentarios },
    { value: fmt(engajamento.salvamentos), label: 'Guardados', delta: d.salvamentos },
    { value: fmt(engajamento.compartilhamentos), label: 'Compartidos', delta: d.compartilhamentos },
  ]) + kpiRow([
    { value: fmt(engajamento.interacoesTotal), label: 'Interacciones totales', delta: d.interacoesTotal },
    { value: (engajamento.taxaEngajamento || 0) + '%', label: 'Tasa de interacción', delta: d.taxaEngajamento },
  ]));

  var chartsHtml = '';
  if (canvasImages && (canvasImages.chartWeekly || canvasImages.chartContent)) {
    chartsHtml = '<div class="section"><h2>Análisis visual</h2><div class="charts-row">';
    if (canvasImages.chartWeekly) chartsHtml += '<div class="chart-img"><p class="chart-label">Interacción semanal</p><img src="' + canvasImages.chartWeekly + '"></div>';
    if (canvasImages.chartContent) chartsHtml += '<div class="chart-img"><p class="chart-label">Mix de contenido</p><img src="' + canvasImages.chartContent + '"></div>';
    chartsHtml += '</div></div>';
  }

  var cp = contentPerformance;
  var s4 = section('Rendimiento por formato', '<table class="data-table"><thead><tr><th>Formato</th><th>Cant.</th><th>Prom. vistas</th><th>Prom. me gusta</th><th>Prom. guardados</th></tr></thead><tbody>'
    + '<tr><td>Reels</td><td>' + (cp.reels ? cp.reels.count : 0) + '</td><td>' + fmt(cp.reels ? cp.reels.avgViews : 0) + '</td><td>' + fmt(cp.reels ? cp.reels.avgLikes : 0) + '</td><td>' + fmt(cp.reels ? cp.reels.avgSaves : 0) + '</td></tr>'
    + '<tr><td>Carruseles</td><td>' + (cp.carrosseis ? cp.carrosseis.count : 0) + '</td><td>' + fmt(cp.carrosseis ? cp.carrosseis.avgViews : 0) + '</td><td>' + fmt(cp.carrosseis ? cp.carrosseis.avgLikes : 0) + '</td><td>' + fmt(cp.carrosseis ? cp.carrosseis.avgSaves : 0) + '</td></tr>'
    + '<tr><td>Posts</td><td>' + (cp.posts ? cp.posts.count : 0) + '</td><td>' + fmt(cp.posts ? cp.posts.avgViews : 0) + '</td><td>' + fmt(cp.posts ? cp.posts.avgLikes : 0) + '</td><td>' + fmt(cp.posts ? cp.posts.avgSaves : 0) + '</td></tr>'
    + '</tbody></table>');

  var s5 = section('Historias', kpiRow([
    { value: fmt(storiesPerformance.alcanceMedio), label: 'Alcance promedio' },
    { value: (storiesPerformance.retencaoPct || 0) + '%', label: 'Retención' },
    { value: fmt(storiesPerformance.respostas), label: 'Respuestas' },
    { value: String(conteudo.stories || 0), label: 'Historias publicadas' },
  ]));

  var topPostsHtml = '';
  if (topPosts.length) {
    topPostsHtml = section('Mejores publicaciones', '<div class="top-posts">' + topPosts.slice(0, 6).map(function(p) {
      var type = p.media_product_type === 'REELS' ? 'Reel' : p.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : 'Post';
      return '<div class="top-post"><span class="post-type">' + type + '</span>'
        + '<span class="post-stats">' + fmt(p.like_count || 0) + ' me gusta &middot; ' + fmt(p.saves || 0) + ' guardados &middot; ' + fmt(p.shares || 0) + ' compartidos</span></div>';
    }).join('') + '</div>');
  }

  var aud = audiencia;
  var s7 = section('Audiencia', '<div class="audience-row">'
    + '<div class="aud-block"><h3>Género</h3><p><strong style="color:#c0457b">' + (aud.pctMulheres || 0) + '%</strong> Mujeres &nbsp; <strong style="color:#2471a3">' + (aud.pctHomens || 0) + '%</strong> Hombres</p></div>'
    + '<div class="aud-block"><h3>Rango de edad</h3><p class="age-big">' + esc(aud.faixaEtaria || '—') + '</p></div>'
    + '<div class="aud-block"><h3>Ciudades principales</h3>' + ((aud.cidades || []).length ? '<ol>' + aud.cidades.map(function(c) { return '<li>' + esc(c.nome) + ' <strong>' + c.pct + '%</strong></li>'; }).join('') + '</ol>' : '<p>Sin datos</p>') + '</div>'
    + '</div>');

  var heatmapHtml = '';
  if (postingHeatmap.length) {
    var best = postingHeatmap.reduce(function(b, h) { return h.avgEng > (b ? b.avgEng : 0) ? h : b; }, null);
    var days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    if (best) {
      heatmapHtml = section('Mejor horario', '<p class="best-time">&#x2B50; <strong>' + days[best.day] + ' a las ' + best.hour + 'h</strong> — ' + best.avgEng + ' interacción promedio (' + best.count + ' posts)</p>'
        + '<p style="color:#666;font-size:11px;margin-top:8px">Top 5 horarios:</p><ol>'
        + postingHeatmap.slice().sort(function(a, b) { return b.avgEng - a.avgEng; }).slice(0, 5).map(function(h) { return '<li>' + days[h.day] + ' ' + h.hour + 'h — ' + h.avgEng + ' interacciones (' + h.count + ' publicaciones)</li>'; }).join('')
        + '</ol>');
    }
  }

  var css = '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"); @page { size: A4; margin: 18mm 16mm; } @page :first { margin: 0; } * { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: "DM Sans", system-ui, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 1.6; } .cover { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #2A1B15, #3A261F, #472E25); page-break-after: always; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .cover-inner { text-align: center; color: #FFF8F7; padding: 60px; } .cover-icon { width:64px;height:64px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;border-radius:18px;background:rgba(255,181,183,.12);color:#FFB5B7; } .cover-icon svg { width:34px;height:34px;fill:currentColor; } .cover h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; font-family: "DM Sans", sans-serif; letter-spacing:-.04em; } .cover-account { font-size: 20px; color: #FFB5B7; margin-bottom: 28px; } .cover-period { font-size: 13px; color: rgba(255,248,247,0.68); background: rgba(255,248,247,0.08); border-radius: 20px; padding: 6px 20px; display: inline-block; margin-bottom: 32px; } .cover-date { font-size: 12px; color: rgba(255,248,247,0.45); margin-top: 24px; } .cover-brand { font-size: 10px; color: rgba(255,248,247,0.28); letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; } .section { margin-bottom: 28px; page-break-inside: avoid; } .section h2 { font-size: 16px; font-weight: 700; color: #B8445A; border-bottom: 2px solid #F1D6D3; padding-bottom: 6px; margin-bottom: 14px; } .kpi-row { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; } .kpi { flex: 1; min-width: 120px; background: #FFF8F7; border: 1px solid #F1D6D3; border-radius: 10px; padding: 14px 16px; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .kpi-val { display: block; font-size: 22px; font-weight: 700; color: #472E25; font-family: "DM Sans", sans-serif; } .kpi-label { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; color: #7D5D51; margin-top: 2px; } .kpi-delta { display: block; font-size: 11px; font-weight: 600; margin-top: 4px; } .kpi-delta.up { color: #2F7D5B; } .kpi-delta.down { color: #B8445A; } .data-table { width: 100%; border-collapse: collapse; font-size: 12px; } .data-table th { background: #472E25; color: #fff; padding: 8px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .data-table td { padding: 8px 12px; border-bottom: 1px solid #F1D6D3; } .data-table tr:nth-child(even) td { background: #FFF8F7; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .charts-row { display: flex; gap: 16px; } .chart-img { flex: 1; text-align: center; } .chart-img img { max-width: 100%; height: auto; border: 1px solid #F1D6D3; border-radius: 8px; } .chart-label { font-size: 11px; color: #7D5D51; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; } .top-posts { display: flex; flex-direction: column; gap: 8px; } .top-post { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #FFF8F7; border-radius: 8px; border: 1px solid #F1D6D3; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .post-type { font-size: 11px; font-weight: 700; color: #B8445A; text-transform: uppercase; } .post-stats { font-size: 12px; color: #7D5D51; } .audience-row { display: flex; gap: 16px; } .aud-block { flex: 1; background: #FFF8F7; border: 1px solid #F1D6D3; border-radius: 8px; padding: 16px; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .aud-block h3 { font-size: 11px; text-transform: uppercase; color: #B8445A; letter-spacing: 0.5px; margin-bottom: 8px; } .aud-block ol { padding-left: 18px; font-size: 12px; } .aud-block li { margin-bottom: 4px; } .age-big { font-size: 28px; font-weight: 700; color: #B8445A; font-family: "DM Sans", sans-serif; } .best-time { font-size: 15px; color: #472E25; } .footer { text-align: center; font-size: 10px; color: #A98D84; margin-top: 40px; padding-top: 16px; border-top: 1px solid #F1D6D3; }';

  var footer = '<div class="footer">Reporte generado automáticamente por tu Dashboard de Instagram · ' + esc(today) + '</div>';

  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Reporte @' + esc(username) + '</title><style>' + css + '</style></head><body>'
    + cover + s1 + s2 + chartsHtml + s4 + s5 + topPostsHtml + s7 + heatmapHtml + footer
    + '</body></html>';
}

export function openPdfReport(data, deltas) {
  var canvasImages = {};
  document.querySelectorAll('canvas').forEach(function(c) {
    try { canvasImages[c.id] = c.toDataURL('image/png'); } catch (e) {}
  });

  var html = generateReportHTML(data, deltas, canvasImages);
  var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var win = window.open(url, '_blank');
  if (!win) { alert('La ventana emergente está bloqueada. Permite las ventanas emergentes para generar el PDF.'); return; }
  win.onload = function() { setTimeout(function() { win.print(); URL.revokeObjectURL(url); }, 400); };
}
