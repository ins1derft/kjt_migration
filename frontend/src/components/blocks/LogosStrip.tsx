import type { LogosBlock } from "@/lib/blocks/types";

export default function LogosStrip({ title, logos }: LogosBlock['fields']) {
  if (!logos || logos.length === 0) return null;
  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {logos.map((logo, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={idx}
            src={logo.image}
            alt={logo.alt || 'logo'}
            className="mx-auto h-14 w-full max-w-[180px] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </section>
  );
}
