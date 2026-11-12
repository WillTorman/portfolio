export function notFound(req, res) {
  res.status(404).render('error', {
    title: 'Page not found',
    message: 'The page you requested does not exist.'
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).render('error', {
    title: 'Something went wrong',
    message: 'We could not complete that request. Please try again.'
  });
}
