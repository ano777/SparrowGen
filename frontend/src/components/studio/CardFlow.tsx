"use client";

import { useEffect, useRef } from "react";
import { Acc } from "../Roll";

// "Built to bring in customers": the section pins while you scroll and the cards glide sideways like a
// story. The card in focus is big and straight; the others tilt back in 3D. The page background takes the
// active card's colour, and a counter + bar show progress. Same on phones (your thumb scrolls, cards glide).
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
    let range = 0, raf = 0, last = -1;

    const size = () => {
      t.style.transform = "none";
      range = cards.length > 1 ? cards[cards.length - 1].offsetLeft - cards[0].offsetLeft : 0;
      s.style.height = `${st.offsetHeight + range * 1.1}px`;
      update();
    };
    const update = () => {
      raf = 0;
      const top = parseFloat(getComputedStyle(st).top) || 0;
      const scrollable = s.offsetHeight - st.offsetHeight;
      const p = Math.min(1, Math.max(0, (top - s.getBoundingClientRect().top) / Math.max(1, scrollable)));
      const f = p * (cards.length - 1);
      t.style.transform = `translate3d(${(-p * range).toFixed(1)}px,0,0)`;
      cards.forEach((c, i) => {
        const d = i - f;
        // Set transform/opacity directly (not via inherited CSS variables, which would restyle every element inside the card each frame).
        const ad = Math.min(Math.abs(d), 2);
        c.style.transform = `perspective(1400px) rotateY(${Math.max(-28, Math.min(28, d * -16)).toFixed(2)}deg) scale(${(1 - ad * 0.09).toFixed(4)})`;
        c.style.opacity = (1 - ad * 0.28).toFixed(3);
        const art = arts[i];
        if (art) art.style.transform = `translate3d(${(d * 22).toFixed(1)}px,0,0)`;
        c.classList.toggle("is-on", Math.abs(d) < 0.5);
        c.classList.toggle("is-far", Math.abs(d) > 1.3); // off-screen cards pause their scenes (saves battery and keeps phones smooth)
      });
      const i = Math.round(f);
      if (i !== last) {
        last = i;
        if (num.current) num.current.textContent = String(i + 1).padStart(2, "0");
        st.style.setProperty("--tint", tints[i]);
      }
      meta?.style.setProperty("--p", p.toFixed(4)); // only the counter/bar/hint read it
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    size();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", size);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", size); cancelAnimationFrame(raf); };
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
