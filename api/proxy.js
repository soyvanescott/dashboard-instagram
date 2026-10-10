const https = require('https');
const GRAPH_HOST = 'graph.instagram.com';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({error:{message:'Método no permitido'}}));
  }
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        res.statusCode = 403;
        return res.end(JSON.stringify({error:{message:'Origen no permitido'}}));
      }
    } catch {
      res.statusCode = 403;
      return res.end(JSON.stringify({error:{message:'Origen no válido'}}));
    }
  }
  try {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 20000) throw new Error('Solicitud demasiado grande');
    }
    const {apiPath,params={},token} = JSON.parse(raw);
    if (typeof apiPath !== 'string' || !/^\/v\d+\.\d+\/[a-zA-Z0-9_./-]+$/.test(apiPath) || apiPath.includes('..')) {
      res.statusCode = 400;
      return res.end(JSON.stringify({error:{message:'Ruta de Instagram no válida'}}));
    }
    if (typeof token !== 'string' || token.length < 10 || token.length > 1000) {
      res.statusCode = 400;
      return res.end(JSON.stringify({error:{message:'Conecta primero tu token personal'}}));
    }
    const url = new URL('https://' + GRAPH_HOST + apiPath);
    for (const [key,value] of Object.entries(params)) {
      if (key !== 'access_token' && key !== 'apiPath' && value !== undefined && value !== null) url.searchParams.set(key,String(value));
    }
    // El token viaja al servidor en el cuerpo, no en la URL del navegador.
    // La API de Meta lo recibe en una cabecera Authorization.
    const request = https.request(url, {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + token},
      timeout: 20000
    }, response => {
      let body = '';
      response.on('data', chunk => { if (body.length < 5000000) body += chunk; });
      response.on('end', () => {
        res.statusCode = response.statusCode || 502;
        res.end(body || JSON.stringify({error:{message:'Respuesta vacía de Instagram'}}));
      });
    });
    request.on('timeout', () => request.destroy(new Error('Tiempo de espera agotado')));
    request.on('error', err => {
      if (!res.writableEnded) {
        res.statusCode = 502;
        res.end(JSON.stringify({error:{message:'No se pudo conectar con Instagram'}}));
      }
    });
    request.end();
  } catch {
    if (!res.writableEnded) {
      res.statusCode = 400;
      res.end(JSON.stringify({error:{message:'Solicitud inválida'}}));
    }
  }
};
