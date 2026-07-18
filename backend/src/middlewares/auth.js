import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Verify the Bearer JWT and attach the decoded payload to req.user.
 */
export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'ต้องเข้าสู่ระบบก่อน' });
  }

  try {
    req.user = jwt.verify(token, env.jwt.secret);
    return next();
  } catch {
    return res.status(401).json({ message: 'โทเคนไม่ถูกต้องหรือหมดอายุ' });
  }
}
