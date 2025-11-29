import Link from "next/link";
import type { CSSProperties } from "react";
import type { HeroBlock, ProductSummary } from "@/lib/blocks/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection({
  title,
  subtitle,
  badge,
  background,
  primary_cta_label,
  primary_cta_url,
  secondary_cta_label,
  secondary_cta_url,
  product,
}: HeroBlock['fields'] & { product?: ProductSummary | null }) {
  const resolvedTitle = title ?? product?.name;
  const resolvedSubtitle = subtitle ?? product?.subtitle ?? product?.excerpt ?? product?.description ?? undefined;
  const resolvedBackground = background ?? product?.hero_image ?? undefined;
  const primaryLabel = primary_cta_label ?? product?.default_cta_label ?? undefined;
  const primaryUrl = primary_cta_url ?? (primaryLabel ? '#quote' : undefined);

  const style = resolvedBackground
    ? ({
        backgroundImage: `linear-gradient(135deg, rgba(15,107,255,0.05), rgba(255,255,255,0.2)), url(${resolvedBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } as CSSProperties)
    : undefined;

  return (
    <section className="section-shell">
      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-xl shadow-primary/10"
        style={style}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-sky-50/70 to-white/20" />
        <div className="relative space-y-4 px-6 py-10 sm:px-10 sm:py-14">
          {badge && <Badge className="bg-primary/10 text-primary">{badge}</Badge>}
          {resolvedTitle && <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{resolvedTitle}</h1>}
          {resolvedSubtitle && <p className="max-w-3xl text-lg text-muted-foreground lg:text-xl">{resolvedSubtitle}</p>}
          <div className="flex flex-wrap gap-3">
            {primaryLabel && primaryUrl && (
              <Button asChild size="lg" className="shadow-lg">
                <Link href={primaryUrl}>{primaryLabel}</Link>
              </Button>
            )}
            {secondary_cta_label && secondary_cta_url && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondary_cta_url}>{secondary_cta_label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
