import type { Metadata } from "next";
import { brand } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { StartWizard } from "@/components/StartWizard";

export const metadata: Metadata = pageMeta("Book a website project", "Tell us about your business in 3 quick questions and get a call within a day about your new website or online store.", "/start");

export default function StartPage() {
  return (
    <section className="section">
      <div className="wrap">
        <Suspense><StartWizard /></Suspense>
      </div>
    </section>
  );
}
