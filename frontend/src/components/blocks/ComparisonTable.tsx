import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComparisonTableBlock } from "@/lib/blocks/types";
import { Button } from "@/components/ui/button";

export default function ComparisonTable({ title, variants }: ComparisonTableBlock['fields']) {
  if (!variants || variants.length === 0) return null;

  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {variants.map((variant, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">{variant.name}</CardTitle>
              {variant.price && <CardDescription className="text-lg font-semibold text-primary">{variant.price}</CardDescription>}
              {variant.description && <CardDescription>{variant.description}</CardDescription>}
              {variant.badges && (
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-primary">
                  {variant.badges.map((badge, i) => (
                    <span key={i} className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {variant.specs && (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {Object.entries(variant.specs).map(([key, value]) => (
                    <li key={key} className="flex justify-between gap-2">
                      <span className="font-semibold text-foreground/80">{key}</span>
                      <span className="text-right">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {variant.cta_label && variant.cta_url && (
                <Button asChild variant="outline" className="w-full">
                  <a href={variant.cta_url}>{variant.cta_label}</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
