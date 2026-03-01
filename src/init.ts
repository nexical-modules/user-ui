import { ShellRegistry } from '@/lib/registries/shell-registry';
import { AuthShell } from '@modules/user-ui/src/components/shells/AuthShell';

/**
 * Auth Shell Registration
 *
 * Registers the AuthShell for all authentication-related routes.
 * This file is auto-discovered by GlobHelper.getClientModuleInits()
 * and executed during client initialization.
 */
const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

ShellRegistry.register('auth', AuthShell, (ctx) =>
  AUTH_PATHS.some((p) => ctx.url.pathname === p || ctx.url.pathname.startsWith(p + '/')),
);

export function init() {
  // Registration happens at module load time above.
  // This export satisfies the init() contract expected by initializeClientModules().
}
