import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult, body } from 'express-validator';
import { query } from '../db/pool.js';

const router = Router();
const credentials = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
];

router.get('/login', (req, res) => res.render('auth/login', { title: 'Sign in', errors: [], values: {} }));

router.post('/login', credentials, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('auth/login', { title: 'Sign in', errors: errors.array(), values: req.body });
  try {
    const result = await query('SELECT id, email, password_hash, display_name, role FROM users WHERE email = $1', [req.body.email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
      return res.status(401).render('auth/login', { title: 'Sign in', errors: [{ msg: 'Email or password is incorrect.' }], values: req.body });
    }
    req.session.user = { id: user.id, email: user.email, displayName: user.display_name, role: user.role };
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (error) {
    next(error);
  }
});

router.get('/register', (req, res) => res.render('auth/register', { title: 'Create account', errors: [], values: {} }));

router.post('/register', [
  body('displayName').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
  ...credentials
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('auth/register', { title: 'Create account', errors: errors.array(), values: req.body });
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const result = await query(
      'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name, role',
      [req.body.email, passwordHash, req.body.displayName]
    );
    const user = result.rows[0];
    req.session.user = { id: user.id, email: user.email, displayName: user.display_name, role: user.role };
    res.redirect('/dashboard');
  } catch (error) {
    if (error.code === '23505') return res.status(409).render('auth/register', { title: 'Create account', errors: [{ msg: 'An account with that email already exists.' }], values: req.body });
    next(error);
  }
});

router.post('/logout', (req, res, next) => req.session.destroy(error => {
  if (error) return next(error);
  res.redirect('/');
}));

export default router;
