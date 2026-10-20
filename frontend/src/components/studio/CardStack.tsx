"use client";

import { useEffect, useRef } from "react";
import { Acc } from "../Roll";

// "Built to bring in customers": the cards stack up as you scroll. Each one sticks near the top and the next
// slides up over it, like a deck being dealt. The sliding is plain sticky positioning, which the browser scrolls
// on its own (no script runs per frame), so it stays smooth on phones. This script only notices when a card
// gets covered: the covered card eases back a little and pauses its looping scene.
export function CardStack({ children }: { children: React.ReactNode }) {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const l = list.current;
    if (!l) return;
    const cards = [...l.children] as HTMLElement[];
    // The card in front is the latest one to slide past the middle of the screen. Only it plays its scene;
    // the ones it covers ease back. (An observer, not a scroll handler: nothing runs while you scroll.)
    const up = cards.map(() => false);
    let front = -2;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) up[cards.indexOf(e.target as HTMLElement)] = e.isIntersecting;
      const f = up.lastIndexOf(true);
      // Scrolled past the whole stack: leave it as it is (no restyle while it leaves, and it's ready if you come back).
      if (f === front || (f < 0 && cards[0].getBoundingClientRect().top < 0)) return;
      front = f;
      cards.forEach((c, i) => { c.classList.toggle("is-on", i === f); c.classList.toggle("is-under", i < f); });
    }, { rootMargin: "0px 0px -50% 0px" });
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="s-approach s-stack" id="why">
      <div className="s-wrap">
        <div className="s-stack__head">
          <p className="kicker">Why it works</p>
          <h2 className="s-h s-h--md">Built to bring in <Acc>customers.</Acc></h2>
        </div>
        <div className="s-stack__list" ref={list}>{children}</div>
      </div>
    </section>
  );
}
