// GENERATED CODE - DO NOT MODIFY
import type { AstroGlobal, APIContext } from 'astro';
import type { RolePolicy } from '@/lib/registries/role-registry';

export class MemberRole implements RolePolicy {
  public async check(
    context: AstroGlobal | APIContext,
    input: Record<string, unknown>,
    data?: unknown,
  ): Promise<void> {
    const locals = (context as { locals?: App.Locals }).locals;
    if (!locals?.actor) {
      throw new Error('Unauthorized: Member access required');
    }
  }

  public async redirect(
    context: AstroGlobal | APIContext,
    input: Record<string, unknown>,
    data?: unknown,
  ): Promise<Response | undefined> {
    const locals = (context as { locals?: App.Locals }).locals;
    if (!locals?.actor) {
      return (context as any).redirect('/login');
    }
    return undefined;
  }
}
