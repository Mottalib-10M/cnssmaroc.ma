/**
 * Salary amounts for programmatic cotisation-by-salary pages.
 * Each entry generates a page at /cotisation/[montant]/
 */
export const SALARY_AMOUNTS = [
  3_000, 3_500, 4_000, 4_500, 5_000,
  5_500, 6_000, 6_500, 7_000, 7_500,
  8_000, 9_000, 10_000, 12_000, 15_000,
  20_000, 25_000, 30_000, 40_000, 50_000,
] as const;

export type SalaryAmount = (typeof SALARY_AMOUNTS)[number];

/** Format a salary amount for display: "5 000" */
export function formatSalaryLabel(montant: number): string {
  return new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(montant);
}

/** Get nearby salary amounts for internal linking */
export function getNearbySalaries(montant: number, count = 4): number[] {
  const idx = SALARY_AMOUNTS.indexOf(montant as SalaryAmount);
  if (idx === -1) return SALARY_AMOUNTS.slice(0, count) as unknown as number[];
  const start = Math.max(0, idx - Math.floor(count / 2));
  const end = Math.min(SALARY_AMOUNTS.length, start + count);
  return (SALARY_AMOUNTS.slice(start, end) as unknown as number[]).filter((s) => s !== montant);
}
