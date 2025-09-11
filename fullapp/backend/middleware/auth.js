import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const {
  JWT_SECRET = 'change-me',
  COOKIE_NAME = 'el_jwt',
  NODE_ENV = 'development',
} = process.env;

export function cookieOptions(maxAgeMs) {
  const secure =
    process.env.COOKIE_SECURE === 'true' || NODE_ENV === 'production';
  const sameSite = 'lax';
  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    ...(maxAgeMs ? { maxAge: maxAgeMs } : {}),
  };
}

export function signToken(user) {
  const payload = { sub: user._id.toString(), role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  return token;
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
}