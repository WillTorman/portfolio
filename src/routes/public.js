import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows: projects } = await query('SELECT * FROM projects WHERE featured = TRUE ORDER BY created_at DESC');
    res.render('home', { title: 'William Torman | Software Engineer', projects });
  } catch (error) { next(error); }
});

router.get('/projects', async (req, res, next) => {
  try {
    const { rows: projects } = await query('SELECT * FROM projects ORDER BY created_at DESC');
    res.render('projects/index', { title: 'Projects', projects });
  } catch (error) { next(error); }
});

router.get('/projects/:slug', async (req, res, next) => {
  try {
    const projectResult = await query('SELECT * FROM projects WHERE slug = $1', [req.params.slug]);
    if (!projectResult.rows[0]) return res.status(404).render('error', { title: 'Project not found', message: 'That project does not exist.' });
    const { rows: comments } = await query(
      `SELECT project_comments.*, users.display_name FROM project_comments
       JOIN users ON users.id = project_comments.user_id
       WHERE project_id = $1 ORDER BY project_comments.created_at DESC`,
      [projectResult.rows[0].id]
    );
    res.render('projects/show', { title: projectResult.rows[0].title, project: projectResult.rows[0], comments, errors: [] });
  } catch (error) { next(error); }
});

router.post('/projects/:slug/comments', [
  body('body').trim().isLength({ min: 1, max: 2000 }).withMessage('Comment must be between 1 and 2,000 characters.')
], async (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('error', { title: 'Invalid comment', message: errors.array()[0].msg });
  try {
    const { rows } = await query('SELECT id FROM projects WHERE slug = $1', [req.params.slug]);
    if (!rows[0]) return res.status(404).render('error', { title: 'Project not found', message: 'That project does not exist.' });
    await query('INSERT INTO project_comments (project_id, user_id, body) VALUES ($1, $2, $3)', [rows[0].id, req.session.user.id, req.body.body]);
    res.redirect(`/projects/${req.params.slug}`);
  } catch (error) { next(error); }
});

router.get('/contact', (req, res) => res.render('contact', { title: 'Contact', errors: [], values: {} }));

router.post('/contact', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5,000 characters.')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('contact', { title: 'Contact', errors: errors.array(), values: req.body });
  try {
    await query('INSERT INTO contact_requests (user_id, name, email, message) VALUES ($1, $2, $3, $4)', [req.session.user?.id ?? null, req.body.name, req.body.email, req.body.message]);
    req.session.flash = 'Thanks for reaching out. Your message has been received.';
    res.redirect('/contact');
  } catch (error) { next(error); }
});

export default router;
