const https = require('https');

function callClaude(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return reject(new Error('ANTHROPIC_API_KEY not configured'));

    const body = JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const text = parsed.content?.find(b => b.type === 'text')?.text || '';
          resolve(text);
        } catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Solo acepta pedidos que vienen desde el propio dashboard (evita que otros
  // sitios usen tu clave de Claude).
  const origin = req.headers.origin || '';
  const host = req.headers.host || '';
  if (origin && host && !origin.endsWith('//' + host)) {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: 'Origen no permitido' }));
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let metrics;
  try { metrics = JSON.parse(body); }
  catch { res.statusCode = 400; res.end(JSON.stringify({ error: 'Invalid JSON' })); return; }

  const systemPrompt = `Eres una consultora de marketing digital especializada en Instagram.
Analiza las métricas y escribe un reporte breve en español latino neutro, hablándole de tú a la dueña de la cuenta, con:

1. RESUMEN (2-3 frases sobre cómo está el perfil)
2. LO QUE ESTÁ FUNCIONANDO (2-3 puntos con datos concretos)
3. A QUÉ PRESTARLE ATENCIÓN (2-3 puntos con datos y referencias)
4. PLAN DE ACCIÓN (3-5 acciones concretas para el próximo mes, en orden de prioridad)

Referencias:
- Tasa de interacción buena: más de 3%
- Tasa de guardados sana: más de 2%
- Tasa de compartidos buena: más de 1%

Sé directa, usa números y da recomendaciones que se puedan aplicar. No uses markdown con # ni **, solo texto limpio.`;

  const m = metrics;
  const userMessage = `Perfil: @${m.username || 'desconocido'}
Período: ${m.periodo || '30 días'}
Seguidores: ${m.seguidores || 0}
Nuevos seguidores: ${m.novosSeguidores || 0}
Alcance: ${m.alcance || 0}
Impresiones: ${m.impressoes || 0}
Me gusta: ${m.curtidas || 0}
Comentarios: ${m.comentarios || 0}
Guardados: ${m.salvamentos || 0}
Compartidos: ${m.compartilhamentos || 0}
Interacciones totales: ${m.interacoesTotal || 0}
Tasa de interacción: ${m.taxaEngajamento || 0}%
Toques en el link de la bio: ${m.toquesLinkBio || 0}
Reels publicados: ${m.reels || 0}
Carruseles publicados: ${m.carrosseis || 0}
Posts estáticos: ${m.postsEstaticos || 0}
Historias: ${m.stories || 0}
Audiencia: ${m.pctMulheres || 0}% mujeres, ${m.pctHomens || 0}% hombres
Rango de edad principal: ${m.faixaEtaria || 'desconocido'}
Ciudades principales: ${(m.cidades || []).map(c => c.nome + ' ' + c.pct + '%').join(', ') || 'sin datos'}
Mejor horario: ${m.melhorHorario || 'sin datos'}`;

  try {
    const analysis = await callClaude(systemPrompt, userMessage);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(JSON.stringify({ analysis }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
};
