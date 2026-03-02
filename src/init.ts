/**
 * Auth Shell Initialization
 *
 * This file is auto-discovered by GlobHelper.getClientModuleInits()
 * and executed during client initialization.
 */

import { registerAuthShell } from './lib/registration';

export function init() {
  registerAuthShell();
}
