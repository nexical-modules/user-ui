// GENERATED CODE - DO NOT MODIFY
import type { APIContext, MiddlewareNext } from 'astro';

export async function onRequest(context: APIContext, next: MiddlewareNext) {
  const publicRoutes: string[] = [];
  if (publicRoutes.some((route) => context.url.pathname.startsWith(route))) return next();
  const session = (context.locals as any).session;
  if (session) {
    const user = await session.get('user');
    if (user) {
      // Compatibility with Actor system
      context.locals.actor = user;
      context.locals.actorType = 'user';
    }
  }
  if (context.locals.actor) return next();
  return next();
}
export default { onRequest };
