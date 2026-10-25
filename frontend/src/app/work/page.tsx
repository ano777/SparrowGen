import type { Metadata } from "next";
import { brand } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Acc } from "@/components/Roll";
import { WorksGrid } from "@/components/studio/WorksGrid";

export const metadata: Metadata = pageMeta("Our work", "Website demos by " + brand.name + " for cafés, turfs and local businesses: booking, ordering and online stores built to bring in customers.", "/work");

export default function WorkPage() {
  return (
    <section className="s-works">
      <div className="s-wrap">
        <header className="s-pagehead">
          <p className="kicker s-rise">Our work</p>
          <h1 className="s-h s-pagehead__title s-rise" style={{ animationDelay: "80ms" }}>Sites people stop <Acc>scrolling for.</Acc></h1>
        </header>
        <WorksGrid />
      </div>
    </section>
  );
}
