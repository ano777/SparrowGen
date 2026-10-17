import type { Metadata } from "next";
import { brand } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { FinalCta, ProjectGrid } from "@/components/Sections";

export const metadata: Metadata = pageMeta("Our work", "Website concepts by " + brand.name + " for cafés, turfs and local businesses: booking, ordering and online stores built to bring in customers.", "/work");

export default function WorkPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="kicker">Our work</p>
          <h1 className="display page-head__title">Websites that<span className="grad-text">bring in customers.</span></h1>
          <p className="lede">Concept websites we designed and built to show what we can do for businesses like yours. Client projects are added here as they go live.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap"><ProjectGrid /></div>
      </section>
      <FinalCta />
    </>
  );
}
