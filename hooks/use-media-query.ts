"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(minWidth: number = 768): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const handleResize = () => setMatches(window.innerWidth >= minWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [minWidth]);

  return matches;
}
