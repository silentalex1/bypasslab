import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
const secret = "batprox_secret"
function randomUserAgent() {
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  ]
  return agents[Math.floor(Math.random() * agents.length)]
}
export default async (req, res) => {
  const url = req.query.url
  const token = req.query.token
  if (!token) {
    res.status(401).end()
    return
  }
  let valid
  try {
    valid = jwt.verify(token, secret)
  } catch {
    res.status(401).end()
    return
  }
  if (!url || !/^https?:\/\//.test(url)) {
    res.status(400).end()
    return
  }
  try {
    const headers = {
      "user-agent": randomUserAgent(),
      "accept": req.headers["accept"] || "*/*",
      "accept-language": req.headers["accept-language"] || "en-US,en;q=0.9"
    }
    const r = await fetch(url, { headers, redirect: "follow" })
    res.status(r.status)
    r.headers.forEach((v, k) => res.setHeader(k, v))
    r.body.pipe(res)
  } catch {
    res.status(502).end()
  }
}
