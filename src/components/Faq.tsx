import Icon from "@/components/Icon";

export type FaqItem = { q: string; a: string };

/** schema.org FAQPage markup for rich results */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Accordion built on <details> — works without JavaScript */
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="card divide-y divide-line px-6 md:px-8">
      {items.map(({ q, a }) => (
        <details key={q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none select-none items-center justify-between gap-6 font-semibold text-ink transition-colors hover:text-blue">
            {q}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky text-blue transition-transform duration-300 group-open:rotate-45">
              <Icon name="plus" className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
          </summary>
          <p className="mt-3 pr-10 text-[15px] leading-relaxed text-ink-soft">{a}</p>
        </details>
      ))}
    </div>
  );
}
