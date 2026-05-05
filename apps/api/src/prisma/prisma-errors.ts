export function isUniqueConstraintOn(error: unknown, field: string): boolean {
  const e = error as {
    code?: string;
    meta?: { target?: string | string[] };
    message?: string;
  };
  if (e?.code !== 'P2002') return false;

  const target = e.meta?.target;
  const candidates = Array.isArray(target) ? target : target ? [target] : [];
  if (candidates.some((t) => t === field || t.includes(field))) return true;

  return typeof e.message === 'string' && e.message.includes(field);
}
