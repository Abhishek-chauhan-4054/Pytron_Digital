"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reveals elements marked with data-reveal once, as they scroll into view.
 * Hidden state only applies when <html class="js"> is set and the user
 * has not requested reduced motion (see globals.css).
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    (window as unknown as { __pdReveal?: boolean }).__pdReveal = true;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
