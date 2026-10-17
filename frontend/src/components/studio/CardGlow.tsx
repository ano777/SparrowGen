"use client";

import { useEffect } from "react";

// "Built to bring in customers" cards: a soft light follows the pointer, and the looping scenes only run while the section is on screen.
export function CardGlow() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".s-card");
    const move = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement, r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    cards.forEach((c) => c.addEventListener("pointermove", move));
    // Play the card scenes only while the section is on screen (they start fresh when you scroll to them).
    const sec = document.querySelector<HTMLElement>(".s-approach");
    const io = sec ? new IntersectionObserver(([e]) => { sec.dataset.play = String(e.isIntersecting); }, { threshold: 0.08 }) : null;
    if (sec) io!.observe(sec);
    return () => { cards.forEach((c) => c.removeEventListener("pointermove", move)); io?.disconnect(); };
  }, []);
  return null;
}
