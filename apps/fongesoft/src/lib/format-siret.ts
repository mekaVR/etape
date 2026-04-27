export function extractSiretDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 14);
}

export function formatSiret(digits: string): string {
  const clean = extractSiretDigits(digits);

  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  if (clean.length <= 9) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
}
