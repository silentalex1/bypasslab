import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import { verifyToken } from "./shared.js";

const app = express();
app.use(bodyParser.json());

function randomUserAgent() {
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

app.get("/proxy", async (req, res) => {
  const { url, token } = req.query;
  if (!token || !verifyToken(token)) return res.status(401).end();
  if (!url || !/^https?:\/\//.test(url)) return res.status(400).end();
  try {
    const r = await fetch(url, {
      headers: {
        "user-agent": randomUserAgent(),
        "accept": req.headers["accept"] || "*/*"
      }
    });
    res.status(r.status);
    r.headers.forEach((v, k) => res.setHeader(k, v));
    r.body.pipe(res);
  } catch {
    res.status(502).end();
  }
});

app.listen(4002);
