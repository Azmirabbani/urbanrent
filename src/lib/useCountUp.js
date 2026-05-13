import { useEffect, useRef, useState } from "react";

/**
 * Animasi angka naik dari 0 ke target.
 * @param {number} target
 * @param {{ duration?: number; enabled?: boolean }} opts
 */
export function useCountUp(target, { duration = 1200, enabled = true } = {}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof target !== "number" || isNaN(target)) {
      setValue(target);
      return;
    }

    // respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);

  return value;
}
