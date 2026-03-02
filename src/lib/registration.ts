import { ShellRegistry, type ShellContext } from '@/lib/registries/shell-registry';
import { lazy } from 'react';

/**
 * Auth Shell Registration logic.
 * Uses lazy loading to avoid top-level evaluating the component tree during Node SSR.
 */
const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

const LazyAuthShell = lazy(() =>
  import('../components/shells/AuthShell').then((m) => ({ default: m.AuthShell })),
);

export function registerAuthShell() {
  ShellRegistry.register('auth', LazyAuthShell as any, (ctx: ShellContext) =>
    AUTH_PATHS.some((p) => ctx.url.pathname === p || ctx.url.pathname.startsWith(p + '/')),
  );
}
