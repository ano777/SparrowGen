"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { services } from "@/lib/site";
import { Acc } from "./Roll";
import { TicketCover, notchMask } from "./ticket-cover";

// Reveal after 20% is scratched — enough to feel the scratch, short enough that nobody gives up.
const REVEAL_AT = 0.2;
const BRUSH = (w: number) => Math.max(56, w / 16);

function Confetti() {
  const colors = ["#feda75", "#fa7e1e", "#d62976", "#962fbf", "#4f5bd5"];
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 4 }}>
      {Array.from({ length: 36 }).map((_, i) => {
        const x = Math.random() * 100;
        const d = 0.9 + Math.random() * 0.9;
        return (
          <span
            key={i}
            style={{
              position: "absolute", left: `${x}%`, top: "-10px",
              width: 6 + Math.random() * 6, height: 10 + Math.random() * 8,
              background: colors[i % colors.length], borderRadius: 2,
              animation: `confetti ${d}s cubic-bezier(.2,.7,.4,1) ${Math.random() * 0.25}s forwards`,
              ["--dx" as string]: `${(Math.random() - 0.5) * 160}px`,
              ["--rot" as string]: `${Math.random() * 720 - 360}deg`,
            }}
          />
        );
      })}
      <style>{`@keyframes confetti { to { transform: translate(var(--dx), 420px) rotate(var(--rot)); opacity: 0; } }`}</style>
    </div>
  );
}

export function ScratchServices() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchRef = useRef<HTMLDivElement>(null);
  const cover = useRef<TicketCover | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [scratching, setScratching] = useState(false);

  const reveal = useCallback(() => {
    setDone(true);
    setPct(1);
  }, []);

  // The cover (orange glitter ticket, see ticket-cover.ts) is drawn on the canvas; scratches go into its mask.
  useEffect(() => {
    const c = canvasRef.current, box = scratchRef.current;
    if (!c || !box) return;
    const tc = new TicketCover(c, reveal);
    cover.current = tc;
    const lay = () => {
      const m = notchMask(tc.layout());
      box.style.setProperty("-webkit-mask", m);
      box.style.setProperty("mask", m);
    };
    lay();
    document.fonts?.ready.then(() => { if (cover.current === tc) lay(); });
    const ro = new ResizeObserver(() => { if (!drawing.current) lay(); });
    ro.observe(c);
    return () => { ro.disconnect(); tc.dispose(); cover.current = null; };
  }, [reveal]);
  useEffect(() => { if (done) cover.current?.stop(); }, [done]);

  const measure = () => {
    const p = cover.current?.cleared() ?? 0;
    setPct(p);
    if (p >= REVEAL_AT) reveal();
  };

  const strokeTo = (x: number, y: number, width: number) => {
    const ctx = cover.current?.maskCtx;
    if (!ctx) return; // card was removed (page left)
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = width;
    ctx.beginPath();
    const from = last.current ?? { x, y };
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x + 0.1, y);
    ctx.stroke();
    cover.current?.scratched();
    last.current = { x, y };
  };

  // offsetX/Y are in the canvas's own coordinates, so scratching stays accurate while the card is tilted.
  const scratchAt = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    strokeTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY, BRUSH(c.clientWidth));
    if (++moves.current % 8 === 0) measure();
  };

  const beginScratch = (e: React.PointerEvent) => {
    drawing.current = true;
    setScratching(true);
    resetTilt();
    last.current = null;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} // the pointer may already be gone
  };
  const endScratch = () => { drawing.current = false; setScratching(false); last.current = null; };

  // Mouse, pen or finger, any direction: the card is fully scratchable (touch-action: none in the CSS).
  // Once it's revealed the canvas lets touches through again, so the page scrolls normally.
  const onDown = (e: React.PointerEvent) => {
    beginScratch(e);
    scratchAt(e);
  };
  const onMove = (e: React.PointerEvent) => { if (drawing.current) scratchAt(e); };
  const onUp = () => {
    const wasScratching = drawing.current;
    endScratch();
    if (wasScratching) measure();
  };
  const onCancel = () => endScratch();

  // 3D tilt + glare that follows the cursor (mouse only; flattens while scratching).
  const onTilt = (e: React.PointerEvent) => {
    const el = ticketRef.current;
    if (!el || e.pointerType !== "mouse" || done) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 18}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const resetTilt = () => {
    const el = ticketRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  return (
    <section id="services" className="s-section s-scratch">
      <div className="s-wrap">
        <div className="s-scratch__head">
          <div>
            <p className="kicker">What we build</p>
            <h2 className="s-h s-h--md">What&apos;s under the <Acc>card?</Acc></h2>
          </div>
          <p className="s-scratch__lede">Three things are hidden under this ticket. One of them is <mark>exactly what your business needs.</mark></p>
        </div>

        <div className="ticket-stage" data-done={done} onPointerMove={onTilt} onPointerLeave={resetTilt}>
          <div className="ticket" ref={ticketRef} data-scratching={scratching} data-done={done}>
            <div className="scratch" ref={scratchRef}>
              <div className="scratch__grid" aria-hidden={!done}>
                {services.map((s) => (
                  <article key={s.title} className={`svc svc--${s.tone}`}>
                    <h3 className="display svc__title">{s.title}</h3>
                    <p className="svc__line">{s.line}</p>
                    <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  </article>
                ))}
              </div>
              <canvas
                ref={canvasRef}
                className="scratch__canvas"
                data-done={done}
                aria-label="Scratch card covering our services. Use the Show me button below to reveal."
                role="img"
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onCancel}
              />
              <div className="scratch__glare" aria-hidden="true" />
              {pct > 0 && <div className="scratch__progress" data-done={done}>{Math.min(99, Math.round((pct / REVEAL_AT) * 100))}% revealed</div>}
              {done && <Confetti />}
            </div>
          </div>
        </div>

        {!done && (
          <p className="scratch__skip">Rather not scratch? <button onClick={reveal}>Just show me</button></p>
        )}
      </div>
    </section>
  );
}
