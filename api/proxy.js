import fetch from 'node-fetch';

export default async (req, res) => {
  const { url } = req.method === "POST" ? req.body : req.query;
  if (!url) {
    res.status(400).end();
    return;
  }
  try {
    const r = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'BatProx/1.0' } });
    res.status(r.status);
    r.headers.forEach((v, k) => res.setHeader(k, v));
    r.body.pipe(res);
  } catch {
    res.status(502).end();
  }
};