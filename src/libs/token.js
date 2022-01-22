import jwt from "jsonwebtoken";

export function createToken(content) {
  return jwt.sign(content, process.env.JWT_SECRET);
}

export function getUserEmailFromToken(token) {
  return jwt.decode(token, process.env.JWT_SECRET);
}
