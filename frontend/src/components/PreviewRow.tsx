"use client";

import { CurvedRow } from "@/components/ui/curved-row";
import { elegant, statement } from "@/lib/previewFonts";

// /preview hero: real-looking sample websites streaming round a curve. Photos: Unsplash (free licence).

type Layout = "full" | "split" | "center";
type Font = "display" | "elegant" | "statement";
type Card = { name: string; tag: string; title: string; cta: string; img: string; layout: Layout; font: Font; accent: string; links: [string, string, string] };

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=820&h=620&q=72`;

const CARDS: Card[] = [
  { name: "Glow Studio", tag: "Salon", title: "Walk in. Glow out.", cta: "Book a slot", img: img("photo-1637777277337-f114350fb088"), layout: "full", font: "display", accent: "#ff4fa3", links: ["Services", "Stylists", "Book"] },
  { name: "Velvet Lane", tag: "Fashion", title: "New season. Limited pieces.", cta: "Shop the edit", img: img("photo-1573879500655-98f2012dd1db"), layout: "split", font: "elegant", accent: "#b0365a", links: ["New in", "Shop", "Lookbook"] },
  { name: "Urban Nest", tag: "Real estate", title: "Find the place you'll call home.", cta: "Schedule a visit", img: img("photo-1707190205120-228c6656086c"), layout: "full", font: "display", accent: "#8a6bff", links: ["Homes", "About", "Contact"] },
  { name: "Petal Patisserie", tag: "Bakery", title: "Baked at dawn. Gone by noon.", cta: "Order a box", img: img("photo-1567941723610-db0bcb4cca67"), layout: "center", font: "elegant", accent: "#e0457b", links: ["Cakes", "Bakes", "Order"] },
  { name: "Pulse Fitness", tag: "Gym", title: "Stronger every week.", cta: "Start free trial", img: img("photo-1740895307920-0ba63bffc1c9"), layout: "center", font: "statement", accent: "#ff5a1f", links: ["Classes", "Coaches", "Join"] },
  { name: "Wander Trails", tag: "Travel", title: "Trips planned end to end.", cta: "Plan my journey", img: img("photo-1691849233457-837d8e2f9da3"), layout: "full", font: "display", accent: "#13b5c6", links: ["Trips", "Stays", "Contact"] },
  { name: "Saffron Table", tag: "Restaurant", title: "Good food, worth the trip.", cta: "Reserve a table", img: img("photo-1622023133253-63706c9c3eb4"), layout: "center", font: "elegant", accent: "#e3a33c", links: ["Menu", "About", "Visit"] },
  { name: "Brew Lab", tag: "Café", title: "Slow coffee, good company.", cta: "Order ahead", img: img("photo-1689037676470-b72230d5236e"), layout: "split", font: "display", accent: "#c86b3c", links: ["Menu", "Coffee", "Visit"] },
  { name: "Haven Retreat", tag: "Stays", title: "Stay somewhere unforgettable.", cta: "Book your stay", img: img("photo-1775112862850-02b1f72edcb1"), layout: "center", font: "elegant", accent: "#d86aa8", links: ["Rooms", "Spa", "Book"] },
  { name: "Aura Skin", tag: "Skincare", title: "Skin that glows, naturally.", cta: "Shop skincare", img: img("photo-1789098175597-e633516c3df8"), layout: "split", font: "display", accent: "#8f5bd6", links: ["Shop", "Rituals", "Visit"] },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "") || "yourname";

function Site({ c, name }: { c: Card; name: string }) {
  const brand = name || c.name;
  const nameKey = name ? `n-${name}` : "sample"; // remounts the name so it plays its little shimmer when it changes
  return (
    <div className={`pv-rcard pv-rcard--${c.layout} pv-font--${c.font}`} style={{ "--a": c.accent } as React.CSSProperties}>
      <div className="pv-rcard__bar"><i /><i /><i /><span key={nameKey} className="pv-rcard__url">www.{slug(brand)}.com</span></div>
      <div className="pv-rcard__body">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.img} alt="" draggable={false} />
        <div className="pv-rcard__nav"><b key={nameKey} className="pv-rcard__brand">{brand}</b><span>{c.links.map((l) => <i key={l}>{l}</i>)}</span></div>
        <div className="pv-rcard__copy">
          <small>{c.tag}</small>
          <strong>{c.title}</strong>
          <em>{c.cta}</em>
        </div>
        <span className="pv-rcard__sheen" />
      </div>
    </div>
  );
}

export function PreviewRow() {
  return (
    <div className={`pv-live ${elegant.variable} ${statement.variable}`}>
      <CurvedRow items={CARDS} render={(c) => <Site c={c} name="" />} className="pv-row" speed={4} tileHeight={66} aspectRatio={1.3} gap={9} maxWidth={74} curve={48} fade={17} />
    </div>
  );
}
