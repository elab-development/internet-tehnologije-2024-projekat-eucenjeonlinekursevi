import User from '../models/User.js';
import { signToken, cookieOptions } from '../middleware/auth.js';

const { COOKIE_NAME = 'el_jwt', JWT_EXPIRES_IN = '7d' } = process.env;

function parseExpToMs(exp = '7d') {
  const m = /^(\d+)([dhm])$/.exec(exp);
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = Number(m[1]);
  const unit = m[2];
  if (unit === 'd') return n * 24 * 60 * 60 * 1000;
  if (unit === 'h') return n * 60 * 60 * 1000;
  if (unit === 'm') return n * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
}

export const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: 'name, email and password are required' });
      }

      const exists = await User.findOne({ email });
      if (exists)
        return res.status(409).json({ message: 'Email already in use' });

      const user = await User.create({ name, email, password });
      const token = signToken(user);

      res
        .cookie(COOKIE_NAME, token, cookieOptions(parseExpToMs(JWT_EXPIRES_IN)))
        .status(201)
        .json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (err) {
      console.error('register error:', err);
      res.status(500).json({ message: 'Registration failed' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });

      const ok = await user.comparePassword(password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

      const token = signToken(user);
      res
        .cookie(COOKIE_NAME, token, cookieOptions(parseExpToMs(JWT_EXPIRES_IN)))
        .json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (err) {
      console.error('login error:', err);
      res.status(500).json({ message: 'Login failed' });
    }
  },

  async logout(_req, res) {
    res.clearCookie(COOKIE_NAME, cookieOptions()).json({ ok: true });
  },

  async me(req, res) {
    res.json({ user: req.user });
  },
};