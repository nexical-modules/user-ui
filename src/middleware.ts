import type { APIContext, MiddlewareNext } from 'astro';
import { getSession } from './lib/auth-session';

export async function onRequest(context: APIContext, next: MiddlewareNext) {
  console.log('[UserMiddleware] onRequest triggered for:', context.url.pathname);
  const publicRoutes: string[] = [];
  if (publicRoutes.some((route) => context.url.pathname.startsWith(route))) return next();

  const session = await getSession(context.request, context);
  console.log('[UserMiddleware] Session fetched:', session ? 'Valid' : 'Null/None');

  if (session && session.user) {
    // Compatibility with Actor system
    context.locals.actor = session.user as any;
    context.locals.actorType = 'user';

    // Inject user into NavContext for client-side rendering
    context.locals.navData = {
      ...context.locals.navData,
      context: {
        ...context.locals.navData?.context,
        user: session.user,
      },
    };
    console.log(`[USER MID] Session Match, User: ${session.user.email}`);
  } else {
    console.log(`[USER MID] No Session or User`);
  }

  return next();
}
export default { onRequest };
