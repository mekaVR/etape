type Issue = { path: PropertyKey[]; message: string };

export function isZodValidationError(
  value: unknown,
): value is { issues: Issue[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'issues' in value &&
    Array.isArray((value as { issues: unknown }).issues)
  );
}

export function extractBusinessError(
  value: unknown,
  fallback: { message: string; name: string },
): { message: string; error: string; fields?: Record<string, string> } {
  if (typeof value === 'string') {
    return { message: value, error: fallback.name.replace(/Exception$/, '') };
  }
  if (typeof value === 'object' && value !== null) {
    const obj = value as {
      message?: string;
      error?: string;
      fields?: Record<string, string>;
    };
    return {
      message: obj.message ?? fallback.message,
      error: obj.error ?? fallback.name.replace(/Exception$/, ''),
      fields: obj.fields,
    };
  }
  return {
    message: fallback.message,
    error: fallback.name.replace(/Exception$/, ''),
  };
}
