import type { CSSProperties } from "react";

// Button label whose letters roll up one by one on hover (each letter is stacked twice and slides up).
// Screen readers and touch screens get the plain text.
export function Roll({ children }: { children: string }) {
  return (
    <>
      <span className="s-roll-plain">{children}</span>
      <span className="s-roll" aria-hidden="true">
        {[...children].map((c, i) => (
          <span key={i} className="s-roll__c" style={{ "--i": i } as CSSProperties}>
            <span>{c}</span>
            <span>{c}</span>
          </span>
        ))}
      </span>
    </>
  );
}

// Headline word in the thin Fraunces serif. `roman` keeps it upright instead of italic.
export function Acc({ children, roman = false }: { children: React.ReactNode; roman?: boolean }) {
  return <span className={roman ? "s-acc s-acc--roman" : "s-acc"}>{children}</span>;
}
