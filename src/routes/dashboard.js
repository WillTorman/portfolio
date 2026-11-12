import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const canManage = req.session.user.role === 'admin' || req.session.user.role === 'moderator';
    const [comments, requests, users, projects] = await Promise.all([
      query('SELECT project_comments.*, projects.title, projects.slug FROM project_comments JOIN projects ON projects.id = project_comments.project_id WHERE user_id = $1 ORDER BY project_comments.created_at DESC', [req.session.user.id]),
      canManage
        ? query('SELECT * FROM contact_requests ORDER BY created_at DESC')
        : query('SELECT * FROM contact_requests WHERE user_id = $1 ORDER BY created_at DESC', [req.session.user.id]),
      req.session.user.role === 'admin' ? query('SELECT id, email, display_name, role, created_at FROM users ORDER BY created_at DESC') : Promise.resolve({ rows: [] }),
      req.session.user.role === 'admin' ? query('SELECT * FROM projects ORDER BY created_at DESC') : Promise.resolve({ rows: [] })
    ]);
    res.render('dashboard/index', { title: 'Dashboard', comments: comments.rows, requests: requests.rows, users: users.rows, projects: projects.rows });
  } catch (error) { next(error); }
});

router.post('/projects', requireRole('admin'), [
  body('title').trim().isLength({ min: 2, max: 150 }),
  body('summary').trim().isLength({ min: 10, max: 500 }),
  body('description').trim().isLength({ min: 10 }),
  body('technology').trim().notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('error', { title: 'Invalid project', message: 'Please provide all required project fields.' });
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await query('INSERT INTO projects (title, slug, summary, description, technology, project_url, featured) VALUES ($1, $2, $3, $4, $5, $6, $7)', [req.body.title, slug, req.body.summary, req.body.description, req.body.technology, req.body.projectUrl || null, req.body.featured === 'on']);
    res.redirect('/dashboard');
  } catch (error) { next(error); }
});

router.post('/projects/:id/update', requireRole('admin'), [
  body('title').trim().isLength({ min: 2, max: 150 }),
  body('summary').trim().isLength({ min: 10, max: 500 }),
  body('description').trim().isLength({ min: 10 }),
  body('technology').trim().notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('error', { title: 'Invalid project', message: 'Please provide all required project fields.' });
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await query(
      'UPDATE projects SET title = $1, slug = $2, summary = $3, description = $4, technology = $5, project_url = $6, featured = $7, updated_at = NOW() WHERE id = $8',
      [req.body.title, slug, req.body.summary, req.body.description, req.body.technology, req.body.projectUrl || null, req.body.featured === 'on', req.params.id]
    );
    res.redirect('/dashboard');
  } catch (error) { next(error); }
});

router.post('/projects/:id/delete', requireRole('admin'), async (req, res, next) => {
  try {
    await query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.redirect('/dashboard');
  } catch (error) { next(error); }
});

router.post('/users/:id/role', requireRole('admin'), [
  body('role').isIn(['admin', 'moderator', 'user'])
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('error', { title: 'Invalid role', message: 'Choose a valid user role.' });
  try {
    await query('UPDATE users SET role = $1 WHERE id = $2', [req.body.role, req.params.id]);
    res.redirect('/dashboard');
  } catch (error) { next(error); }
});

router.post('/requests/:id', requireRole('admin', 'moderator'), [
  body('status').isIn(['received', 'in_progress', 'replied', 'closed']),
  body('response').trim().isLength({ max: 5000 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('error', { title: 'Invalid request update', message: 'Choose a valid status and response.' });
  try {
    await query('UPDATE contact_requests SET status = $1, response = $2, updated_at = NOW() WHERE id = $3', [req.body.status, req.body.response || null, req.params.id]);
    res.redirect('/dashboard');
  } catch (error) { next(error); }
});

export default router;
