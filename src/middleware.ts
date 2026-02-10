// GENERATED CODE - DO NOT MODIFY
import type { APIContext, MiddlewareNext } from 'astro';
// GENERATED CODE - DO NOT MODIFY
export async function onRequest(context: APIContext, next: MiddlewareNext) {
  const publicRoutes = [];
  if (publicRoutes.some((route) => context.url.pathname.startsWith(route))) return next();
  if (context.locals.actor) return next();
  return next();
}
export default { onRequest };
