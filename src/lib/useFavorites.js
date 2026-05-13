import { useCallback, useState } from "react";

const KEY = "urbanrent_favorites";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => load());

  const toggle = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      save(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
