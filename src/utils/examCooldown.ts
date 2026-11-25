import type { ExamScope } from '../components/FinalExamSection';

export const EXAM_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export function isExamScopeLocked(lockedUntilMs: number | undefined, nowMs: number): boolean {
  return typeof lockedUntilMs === 'number' && lockedUntilMs > nowMs;
}

export function formatRemainingCountdown(lockedUntilMs: number, nowMs: number): string {
  const diff = Math.max(0, lockedUntilMs - nowMs);
  const totalSeconds = Math.ceil(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

export function formatRemainingWords(lockedUntilMs: number, nowMs: number): string {
  const diff = Math.max(0, lockedUntilMs - nowMs);
  const totalMinutes = Math.ceil(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours} soat ${minutes} daqiqa`;
  }
  if (hours > 0) {
    return `${hours} soat`;
  }
  return `${Math.max(1, minutes)} daqiqa`;
}

export function formatUnlockClock(lockedUntilMs: number): string {
  try {
    return new Date(lockedUntilMs).toLocaleString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export const EXAM_SCOPE_LABELS: Record<ExamScope, string> = {
  literacy: 'Kompyuter savodxonligi',
  programming: 'Dasturlash asoslari',
  all: 'Umumiy imtihon',
};
