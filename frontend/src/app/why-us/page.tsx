import type { Metadata } from "next";
import { Compare, FinalCta, Process } from "@/components/Sections";
import { brand } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("Why us", "Why businesses choose " + brand.name + ": hand-coded websites, no templates, a design you approve first and a site live in about a week.", "/why-us");

export default function WhyUsPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="kicker">Why us</p>
          <h1 className="display page-head__title">Not prompted.<span className="grad-text">Engineered.</span></h1>
          <p className="lede">Anyone can generate a website in a minute. Here&apos;s what you&apos;re actually getting when people build it.</p>
        </div>
      </section>
      <Compare />
      <Process />
      <FinalCta />
    </>
  );
}
