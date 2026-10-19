"use client";

import * as React from "react";

/* ── a curved, streaming row of cards ─────────────────────────────
 * Adapted from the "tilted grid hero" reference (plain CSS, no Tailwind).
 * One row of cards streams from right to left round the inside of a
 * cylinder: the centre faces you flat, the ends bend toward you, and both
 * ends fade into the page.
 *
 * A box can't bend, so each card is cut into vertical strips, each a flat
 * facet of the cylinder showing its share of the card. The strips sit still
 * inside their tile; the tile (preserve-3d) is what moves, with one rotateY
 * about the cylinder's axis. Transform-only, so it runs on the GPU.
 * ─────────────────────────────────────────────────────────────── */

// Camera distance as a multiple of the cylinder radius.
const CAMERA = 1.6;
// Default cap on a card's width (share of the row), so phones still show its neighbours.
const MAX_WIDTH = 56;

/** Cylinder radius (share of the row's width) that puts the frame edge `bend` radians round the arc. */
function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

function measure(width: number, height: number, tile: number, aspect: number, gap: number, bend: number, maxW = MAX_WIDTH) {
  const h = Math.min((tile / 100) * height, ((maxW / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(40, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return { columns, sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
}

export type CurvedRowProps<T> = {
  /** Cards in order. Each tile takes the next one every time it wraps (out of sight), so all of them play through. */
  items: T[];
  /** Draws one card. It fills the tile; use `var(--th)` (the tile height) to size things inside it. */
  render: (item: T) => React.ReactNode;
  /** Seconds for the row to move one card along. @default 4.5 */
  speed?: number;
  /** Card height, % of the row's height. @default 76 */
  tileHeight?: number;
  /** Card width ÷ height. @default 1.25 */
  aspectRatio?: number;
  /** Space between cards, % of a card's height. @default 8 */
  gap?: number;
  /** Vertical centre of the row, % of its height. @default 50 */
  axis?: number;
  /** Widest a card may be, % of the row's width (matters on phones). @default 56 */
  maxWidth?: number;
  /** How hard the ends curl toward you, in degrees (5–85). @default 60 */
  curve?: number;
  /** Width of the fade at each end, % of the row's width. @default 14 */
  fade?: number;
  className?: string;
  children?: React.ReactNode;
};

export function CurvedRow<T>({
  items,
  render,
  speed = 4.5,
  tileHeight = 76,
  aspectRatio = 1.25,
  gap = 8,
  axis = 50,
  maxWidth = MAX_WIDTH,
  curve = 60,
  fade = 14,
  className = "",
  children,
}: CurvedRowProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `cr-o-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  const [layout, setLayout] = React.useState<(ReturnType<typeof measure> & { slices: number }) | null>(null);
  const [shown, setShown] = React.useState<Record<number, number>>({});
  const [onScreen, setOnScreen] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      // Fewer strips on phones: still reads as a smooth curve, half the work for the GPU.
      const next = { ...measure(width, height, tileHeight, aspectRatio, gap, bend, maxWidth), slices: width < 700 ? 6 : 10 };
      setLayout((prev) =>
        prev && prev.columns === next.columns && prev.sweep === next.sweep && prev.unit === next.unit && prev.slices === next.slices ? prev : next,
      );
    });
    ro.observe(el);
    // Only animate while the row is on screen (battery, smooth scrolling on phones).
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, [tileHeight, aspectRatio, gap, bend, maxWidth]);

  const { columns, sweep, unit, limit, slices } = layout ?? { ...measure(1200, 420, tileHeight, aspectRatio, gap, bend, maxWidth), slices: 10 };

  const u = (n: number) => `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(maxWidth / aspectRatio).toFixed(4)}cqw))`;
  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  const turn = (deg: number) => `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}`;

  const share = aspectRatio / slices;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100 - fade}%,transparent)`;

  return (
    <div ref={ref} className={`cr ${className}`} data-play={onScreen} style={{ containerType: "size" }}>
      <style>{css}</style>
      {/* The fade sits on its own flat wrapper: Chrome skips masks on layers that hold 3D children. */}
      <div className="cr__mask" aria-hidden="true" style={{ opacity: layout ? 1 : 0, maskImage: mask, WebkitMaskImage: mask }}>
      <div
        className="cr__band"
        style={{
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const item = items[(shown[t] ?? first) % Math.max(items.length, 1)];
          return (
            <div
              key={t}
              className="cr__tile"
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                ["--th" as string]: u(1),
                // Shared timing, so things inside a card can animate in step with its trip round the curve
                // (it passes the centre at 50% of the cycle).
                ["--dur" as string]: `${duration}s`,
                ["--delay" as string]: `${-t * speed}s`,
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(e) => {
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: slices }, (_, k) => (
                <div
                  key={k}
                  className={`cr__slice${k === 0 ? " cr__slice--first" : ""}${k === slices - 1 ? " cr__slice--last" : ""}`}
                  style={{
                    left: u((aspectRatio - share) / 2),
                    width: k === slices - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                    height: u(1),
                    transform: turn((aspectRatio / 2 - (k + 0.5) * share) * unit),
                  }}
                >
                  <div className="cr__face" style={{ left: u(-k * share), width: u(aspectRatio), height: u(1) }}>
                    {item ? render(item) : null}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      </div>
      {children}
    </div>
  );
}

export default CurvedRow;
