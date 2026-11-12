export function attachUser(req, res, next) {
  res.locals.currentUser = req.session.user ?? null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        title: 'Access denied',
        message: 'You do not have permission to access this page.'
      });
    }
    next();
  };
}
