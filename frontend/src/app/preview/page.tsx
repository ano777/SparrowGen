import type { Metadata } from "next";
import { PreviewRow } from "@/components/PreviewRow";
import { PreviewStudio } from "@/components/PreviewStudio";
import { CATEGORIES, photo } from "@/lib/previews";
import { brand } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("Preview website designs free", "Type your business name and explore four sample website designs for your kind of business. Free and instant; we then build the real one around you.", "/preview");

const byId = (id: string) => CATEGORIES.find((c) => c.id === id)!;

// Two sample sites for the showcase card further down.
const SHOTS = [
  { cat: byId("restaurant"), name: "Barkas", title: "Good food, worth the trip." },
  { cat: byId("fashion"), name: "Velvet Lane", title: "New season. Limited pieces." },
];

const PILLS = [
  { t: "100% free", c: "#fa7e1e" },
  { t: "Preview in 10 seconds", c: "#d62976" },
  { t: "4 sample designs", c: "#962fbf" },
  { t: "No sign-up", c: "#4f5bd5" },
];

export default function PreviewPage() {
  return (
    <>
      <section className="page-head pv-head">
        <div className="pv-aurora" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="wrap pv-head__in">
          <div>
            <p className="kicker">Free website preview</p>
            <h1 className="display page-head__title">Picture your website<span className="grad-text">before we build it.</span></h1>
            <p className="lede">Tell us your business name and what you do. Explore four sample designs for businesses like yours, then we build the real one around you.</p>
            <ul className="pv-pills">
              {PILLS.map((p) => <li key={p.t} style={{ "--c": p.c } as React.CSSProperties}>{p.t}</li>)}
            </ul>
          </div>
        </div>
        <PreviewRow />
      </section>

      <section className="section pv-studio" style={{ paddingTop: 0 }}>
        <div className="wrap"><PreviewStudio /></div>
      </section>

      <section className="pv-showcase" aria-label="Business types we design for">
        <div className="wrap">
          <div className="pv-feature">
            <div className="pv-feature__text">
              <p className="kicker">Made for every kind of business</p>
              <h2 className="display h2">One preview, <span className="grad-text">any business.</span></h2>
              <p className="lede">Restaurants, cafés, salons, clinics, software firms. Pick your type above and see a site built around it, with your name on it.</p>
              <a href="/preview" className="pv-feature__link">Try it with your name <span aria-hidden="true">↑</span></a>
            </div>
            <div className="pv-shots" aria-hidden="true">
              {SHOTS.map((f, i) => (
                <div className="pv-card" key={f.name} style={{ "--i": i, "--a": f.cat.palettes.bold.accent } as React.CSSProperties}>
                  <div className="pv-card__bar"><i /><i /><i /><span>www.{f.name.toLowerCase().replace(/\s+/g, "")}.com</span></div>
                  <div className="pv-card__body">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo(f.cat.photos.hero[0], 720)} alt="" loading="lazy" />
                    <div className="pv-card__text"><b>{f.name}</b><strong>{f.title}</strong><em>{f.cat.cta}</em></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
