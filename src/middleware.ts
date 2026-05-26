import { defineMiddleware } from 'astro:middleware';

const REDIRECT_TO_HOME = new Set([
  '/login',
  '/login/',
  '/iniciar-sesion',
  '/iniciar-sesion/',
  '/signin',
  '/signin/',
  '/sign-in',
  '/sign-in/',
  '/registro',
  '/registro/',
  '/register',
  '/register/',
  '/signup',
  '/signup/',
]);

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname.toLowerCase();
  if (REDIRECT_TO_HOME.has(pathname)) {
    return context.redirect('/', 302);
  }
  return next();
});
