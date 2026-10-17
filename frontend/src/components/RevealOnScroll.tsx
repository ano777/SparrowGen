"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Anything marked data-reveal fades up the first time it scrolls into view (CSS in studio.css).
export function RevealOnScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          (en.target as HTMLElement).dataset.shown = "true";
          io.unobserve(en.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown='true'])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
