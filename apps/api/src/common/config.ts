import { ConfigService } from '@nestjs/config';

export function getNumberConfig(
  config: ConfigService,
  key: string,
  defaultValue: number,
): number {
  const raw = config.get<string | number>(key);
  if (raw === undefined || raw === null || raw === '') {
    return defaultValue;
  }
  const parsed = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}
