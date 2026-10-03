import Icon from "@/components/Icon";

/** Small pill that sits above a headline */
export function Eyebrow({
  children, icon, dark = false,
}: {
  children: React.ReactNode;
  icon?: string;
  dark?: boolean;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
        dark
          ? "border-periwinkle/25 bg-white/5 text-periwinkle"
          : "border-blue/15 bg-white/80 text-blue shadow-sm backdrop-blur"
      }`}
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" strokeWidth={2} />}
      {children}
    </p>
  );
}

/** Eyebrow + headline + supporting line, revealed on scroll */
export function SectionHeading({
  eyebrow, icon, title, sub, dark = false, align = "center", className = "",
}: {
  eyebrow?: string;
  icon?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div data-reveal className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <div className="mb-5">
          <Eyebrow icon={icon} dark={dark}>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className={`font-display text-[2.4rem] leading-[1.08] md:text-[3.25rem] ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-5 text-lg leading-relaxed ${dark ? "text-sky/65" : "text-ink-soft"} ${
            center ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Round check used in feature lists */
export function CheckDot({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        dark ? "bg-periwinkle/15 text-periwinkle" : "bg-sky text-blue"
      }`}
    >
      <Icon name="check" className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}
