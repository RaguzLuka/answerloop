import { Eyebrow } from "@/components/Section";

/** Centered hero for inner pages */
export default function PageHero({
  eyebrow, icon, title, sub, children,
}: {
  eyebrow: string;
  icon?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-36 text-center md:pb-20 md:pt-44">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="halo pointer-events-none absolute inset-0" />
      <div className="halo-drift pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] rounded-full bg-blue/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="animate-fade-up mb-6">
          <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
        </div>
        <h1 className="font-display animate-fade-up anim-d1 text-[2.75rem] leading-[1.04] md:text-6xl lg:text-[4.1rem]">
          {title}
        </h1>
        {sub && (
          <p className="animate-fade-up anim-d2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            {sub}
          </p>
        )}
        {children && <div className="animate-fade-up anim-d3">{children}</div>}
      </div>
    </section>
  );
}
