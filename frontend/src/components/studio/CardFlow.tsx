"use client";

import { useEffect, useRef } from "react";
import { Acc } from "../Roll";

// "Built to bring in customers": the section pins while you scroll and the cards glide sideways like a
// story. The card in focus is big and straight; the others tilt back in 3D. The page background takes the
// active card's colour, and a counter + bar show progress. Same on phones (your thumb scrolls, cards glide).
//
// Smoothness: where the browser supports CSS scroll-driven animations (Chrome, Edge, Safari 26 / iOS 26+),
// all the motion is generated as CSS keyframes tied to the scroll position, so it runs on the browser's
// scrolling thread and stays glued to your finger on iPhone. Older browsers fall back to a per-frame script.
// Either way the script only switches the counter, the tint and the "in focus" class at card boundaries.

// Card pose for an offset `d` from the focus (0 = centred, ±1 = one card away).
const pose = (d: number) => {
  const ad = Math.min(Math.abs(d), 2);
  return {
    transform: `perspective(1400px) rotateY(${Math.max(-28, Math.min(28, d * -16)).toFixed(3)}deg) scale(${(1 - ad * 0.09).toFixed(4)})`,
    opacity: +(1 - ad * 0.28).toFixed(4),
  };
};

// Keyframes for card i of n over the section's scroll progress p (0..1), where d = i - p·(n-1).
// The pose is piecewise linear in d (kinks at 0, ±1.75 and ±2), so keyframes at those points reproduce it exactly.
function cardKeyframes(i: number, n: number, name: string) {
  const span = Math.max(1, n - 1);
  const ps = new Set([0, 1]);
  for (const d of [-2, -1.75, 0, 1.75, 2]) { const p = (i - d) / span; if (p > 0 && p < 1) ps.add(p); }
  const stops = [...ps].sort((a, b) => a - b).map((p) => {
    const { transform, opacity } = pose(i - p * span);
    return `${(p * 100).toFixed(3)}%{transform:${transform};opacity:${opacity}}`;
  });
  const art = `@keyframes ${name}-art{from{transform:translate3d(${(i * 22).toFixed(1)}px,0,0)}to{transform:translate3d(${((i - span) * 22).toFixed(1)}px,0,0)}}`;
  return `@keyframes ${name}{${stops.join("")}}${art}`;
}

export function CardFlow({ children, count }: { children: React.ReactNode; count: number }) {
  const sec = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const s = sec.current, st = stage.current, t = track.current;
    if (!s || !st || !t) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // CSS shows a plain swipeable row instead
    const cards = [...t.children] as HTMLElement[];
    const arts = cards.map((c) => c.querySelector<HTMLElement>(".s-art"));
    const meta = st.querySelector<HTMLElement>(".s-flow__meta");
    const tints = cards.map((c) => getComputedStyle(c).getPropertyValue("--c1").trim() || "#d62976");
    const css = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    let range = 0, raf = 0, last = -1;
    const on: boolean[] = [], far: boolean[] = [];

    let styleEl: HTMLStyleElement | null = null;
    if (css) {
      styleEl = document.createElement("style");
      styleEl.textContent = cards.map((_, i) => cardKeyframes(i, cards.length, `cf-c${i}`)).join("");
      document.head.appendChild(styleEl);
      cards.forEach((c, i) => {
        c.style.animationName = `cf-c${i}`;
        const art = arts[i];
        if (art) art.style.animationName = `cf-c${i}-art`;
      });
      s.classList.add("s-flow--css");
    }

    const size = () => {
      t.style.transform = "none";
      t.style.animationName = "none";
      range = cards.length > 1 ? cards[cards.length - 1].offsetLeft - cards[0].offsetLeft : 0;
      t.style.setProperty("--range", `${range}px`);
      t.style.removeProperty("transform");
      t.style.removeProperty("animation-name");
      s.style.height = `${st.offsetHeight + range * 1.1}px`;
      update();
    };
    const update = () => {
      raf = 0;
      const scrollable = s.offsetHeight - st.offsetHeight;
      const p = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / Math.max(1, scrollable)));
      const f = p * (cards.length - 1);
      if (!css) {
        t.style.transform = `translate3d(${(-p * range).toFixed(1)}px,0,0)`;
        meta?.style.setProperty("--p", p.toFixed(4));
      }
      cards.forEach((c, i) => {
        const d = i - f;
        if (!css) {
          const { transform, opacity } = pose(d);
          c.style.transform = transform;
          c.style.opacity = String(opacity);
          const art = arts[i];
          if (art) art.style.transform = `translate3d(${(d * 22).toFixed(1)}px,0,0)`;
        }
        // Only touch the classes when they actually change (no needless restyles while scrolling).
        const isOn = Math.abs(d) < 0.5, isFar = Math.abs(d) > 1.3; // far cards pause their scenes
        if (on[i] !== isOn) { on[i] = isOn; c.classList.toggle("is-on", isOn); }
        if (far[i] !== isFar) { far[i] = isFar; c.classList.toggle("is-far", isFar); }
      });
      const i = Math.round(f);
      if (i !== last) {
        last = i;
        if (num.current) num.current.textContent = String(i + 1).padStart(2, "0");
        st.style.setProperty("--tint", tints[i]);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    size();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", size);
      cancelAnimationFrame(raf);
      styleEl?.remove();
    };
  }, []);

  return (
    <section className="s-approach s-flow" id="why" ref={sec}>
      <div className="s-flow__stage" ref={stage}>
        <div className="s-wrap s-flow__head">
          <div>
            <p className="kicker">Why it works</p>
            <h2 className="s-h s-h--md">Built to bring in <Acc>customers.</Acc></h2>
          </div>
          <div className="s-flow__meta" aria-hidden="true">
            <span className="s-flow__count"><span ref={num}>01</span><small> / {String(count).padStart(2, "0")}</small></span>
            <span className="s-flow__bar"><i /></span>
            <span className="s-flow__hint">Keep scrolling →</span>
          </div>
        </div>
        <div className="s-flow__track" ref={track}>{children}</div>
      </div>
    </section>
  );
}
