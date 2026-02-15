// GENERATED CODE - DO NOT MODIFY
import type { AstroGlobal, APIContext } from 'astro';
import type { RolePolicy } from '@/lib/registries/role-registry';

export class AnonymousRole implements RolePolicy {
  public async check(
    context: AstroGlobal | APIContext,
    input: Record<string, unknown>,
    data?: unknown,
  ): Promise<void> {
    return;
  }
}
