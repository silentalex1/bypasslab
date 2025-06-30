import fs from "fs";
import jwt from "jsonwebtoken";
const secret = "batprox_secret";
const dbPath = "./users.json";
export function readUsers() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "[]");
  return JSON.parse(fs.readFileSync(dbPath));
}
export function writeUsers(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data));
}
export function createToken(user) {
  return jwt.sign({ username: user.username }, secret, { expiresIn: "7d" });
}
export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}