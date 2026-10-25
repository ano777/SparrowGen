import Image from "next/image";
import type { Project, SiteKind } from "@/lib/site";

// Small drawn website (one of our "see your site first" styles). Sizes scale with the tile (container query units).
export function MiniSite({ k }: { k: SiteKind }) {
  const c = k.colors;
  return (
    <div className="s-mini" style={{ background: c.bg, color: c.text }}>
      <div className="s-mini__nav">
        <b>{k.label}</b>
        <span>{k.nav.map((n) => <i key={n}>{n}</i>)}</span>
      </div>
      <p className="s-mini__h">{k.headline}</p>
      <span className="s-mini__btn" style={{ background: c.accent, color: c.bg }}>{k.cta}</span>
      <div className="s-mini__cards">{[0, 1, 2].map((i) => <span key={i} style={{ background: c.card }} />)}</div>
    </div>
  );
}

// Real screenshot of one of our demo sites.
export function Shot({ p, sizes = "400px", priority = false }: { p: Project; sizes?: string; priority?: boolean }) {
  if (!p.image) return null;
  return (
    <div className="s-shot">
      <Image src={p.image} alt={`${p.name} website (demo)`} fill sizes={sizes} priority={priority} />
    </div>
  );
}
