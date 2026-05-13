/** Kota yang didukung untuk filter & konten marketing */
export const SERVICE_CITIES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
];

export function formatServiceCities(separator = " · ") {
  return SERVICE_CITIES.join(separator);
}
