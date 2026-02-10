// GENERATED CODE - DO NOT MODIFY
import type { APIContext, MiddlewareNext } from 'astro';

import { authConfig } from '../auth.config';
import type { UserModuleTypes } from '@/lib/api';

// GENERATED CODE - DO NOT MODIFY
export async function onRequest(context: APIContext, next: MiddlewareNext) {
  // Dynamic Auth Bypass: Use authConfig.basePath
  const authPath = authConfig.basePath || '/api/auth';
  if (context.url.pathname.startsWith(authPath)) return next();

  // Session Hydration
  const user: UserModuleTypes.User | null = null;

  // Inject navData into locals for pages to consume
  const userData = (user || context.locals.actor || null) as UserModuleTypes.User | null;

  context.locals.navData = {
    ...context.locals.navData,
    context: {
      ...context.locals.navData?.context,
      user: userData
        ? {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            username: userData.username,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            role: (userData as any).role,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status: (userData as any).status,
          }
        : null,
    },
  };

  // Dynamic Bouncer Pattern: Validate Actor Status
  if (context.locals.actor) return next();

  // Public Routes Check
  const publicRoutes = ['/login', '/register', '/forgot-password', '/verify-email'];
  if (publicRoutes.some((route) => context.url.pathname.startsWith(route))) return next();

  return next();
}
export default { onRequest };
