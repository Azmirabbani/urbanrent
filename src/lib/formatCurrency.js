/**
 * Format angka ke Rupiah (IDR).
 * @param {number} value
 * @param {{ locale?: string }} [opts]
 */
export function formatCurrency(value, opts = {}) {
  const locale = opts.locale ?? 'id-ID'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}
