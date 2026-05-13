import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/**
 * Wraps children with a smooth fade+slide transition on route change.
 */
export function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState("enter"); // 'enter' | 'exit'
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;

    // start exit
    setStage("exit");

    timeoutRef.current = setTimeout(() => {
      setDisplayLocation(location);
      setStage("enter");
    }, 180); // match CSS duration

    return () => clearTimeout(timeoutRef.current);
  }, [location, displayLocation]);

  return (
    <div
      key={displayLocation.pathname}
      style={{
        animation:
          stage === "enter"
            ? "page-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both"
            : "page-out 0.18s ease forwards",
      }}
    >
      {children}
    </div>
  );
}
