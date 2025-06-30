import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import { verifyToken } from "./shared.js";

const app = express();
app.use(bodyParser.json());

app.post("/proxy", async (req, res) => {
  const { url } = req.body;
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).end();
  const token = auth.split(" ")[1];
  const valid = verifyToken(token);
  if (!valid) return res.status(401).end();
  if (!url) return res.status(400).end();
  try {
    const r = await fetch(url);
    res.status(r.status);
    r.headers.forEach((v, k) => res.setHeader(k, v));
    r.body.pipe(res);
  } catch {
    res.status(502).end();
  }
});

app.get("/games", (req, res) => {
  res.json([
    { name: "2048", url: "https://play2048.co/" },
    { name: "Tetris", url: "https://tetris.com/play-tetris" }
  ]);
});

app.listen(4002);