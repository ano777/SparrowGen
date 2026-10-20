"use client";

import { useEffect, useRef } from "react";

// A soft brand-coloured light that follows the mouse across the page background (every page).
// On phones there is no cursor, so it blooms where you tap and fades out shortly after.
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, x = 0, y = 0, fade: ReturnType<typeof setTimeout> | undefined;
    const paint = () => { raf = 0; el.style.transform = `translate3d(${x}px, ${y}px, 0)`; }; // moving a layer (GPU), not repainting the screen
    const at = (cx: number, cy: number) => {
      x = cx; y = cy;
      el.dataset.on = "true";
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const move = (e: PointerEvent) => { if (e.pointerType === "mouse") at(e.clientX, e.clientY); };
    const touch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      clearTimeout(fade);
      at(t.clientX, t.clientY);
    };
    const lift = () => { clearTimeout(fade); fade = setTimeout(() => { el.dataset.on = "false"; }, 700); };
    const leave = () => { el.dataset.on = "false"; };
    window.addEventListener("pointermove", move, { passive: true });
    // Touch: the glow blooms where you tap, then fades. It doesn't chase the finger while scrolling (that would move a
    // full-screen layer every frame of the scroll, which is what makes phones stutter).
    window.addEventListener("touchstart", touch, { passive: true });
    window.addEventListener("touchend", lift, { passive: true });
    window.addEventListener("touchcancel", lift, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("touchstart", touch);
      window.removeEventListener("touchend", lift);
      window.removeEventListener("touchcancel", lift);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf); clearTimeout(fade);
    };
  }, []);
  return <div className="s-glow" ref={ref} aria-hidden="true" />;
}
