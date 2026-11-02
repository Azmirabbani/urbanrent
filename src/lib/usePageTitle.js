import { useEffect } from "react";

const BASE_TITLE = "UrbanRent";

/**
 * Atur judul tab browser per halaman, contoh: "Jelajahi Apartemen | UrbanRent".
 * Judul dikembalikan ke default saat halaman ditinggalkan.
 * @param {string} [title]
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
