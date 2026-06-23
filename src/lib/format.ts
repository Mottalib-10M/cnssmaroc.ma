/**
 * Formate un nombre en dirhams marocains (DH)
 */
export function formatDH(montant: number): string {
  return (
    new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(montant) + ' DH'
  );
}

/**
 * Formate un nombre sans décimales
 */
export function formatEntier(n: number): string {
  return new Intl.NumberFormat('fr-MA').format(Math.round(n));
}

/**
 * Formate un pourcentage
 */
export function formatPourcent(taux: number, decimales = 2): string {
  return (taux * 100).toFixed(decimales) + ' %';
}

/**
 * Formate un pourcentage déjà en base 100
 */
export function formatPourcentBase100(taux: number, decimales = 2): string {
  return taux.toFixed(decimales) + ' %';
}

/**
 * Parse un nombre depuis un input text (accepte virgule et point)
 */
export function parseNombre(value: string): number {
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}
