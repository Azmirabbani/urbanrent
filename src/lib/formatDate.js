/**
 * @param {Date | string | number} input
 * @param {{ locale?: string; dateStyle?: Intl.DateTimeFormatOptions['dateStyle'] }} [opts]
 */
export function formatDate(input, opts = {}) {
  const locale = opts.locale ?? 'id-ID'
  const dateStyle = opts.dateStyle ?? 'medium'
  const d = input instanceof Date ? input : new Date(input)
  return new Intl.DateTimeFormat(locale, { dateStyle }).format(d)
}
