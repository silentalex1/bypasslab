import express from "express";
import bodyParser from "body-parser";
import { readUsers, writeUsers, createToken } from "./shared.js";

const app = express();
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).end();
  const users = readUsers();
  if (users.find(u => u.username === username)) return res.status(409).end();
  users.push({ username, password });
  writeUsers(users);
  res.json({ token: createToken({ username }) });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).end();
  res.json({ token: createToken(user) });
});

app.listen(4001);