import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeaturesGridBlock } from "@/lib/blocks/types";

export default function FeaturesGrid({ title, items }: FeaturesGridBlock['fields']) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <Card key={idx} className="h-full bg-card">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              {item.icon && <span className="text-sm text-muted-foreground">{item.icon}</span>}
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground">{item.text}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
