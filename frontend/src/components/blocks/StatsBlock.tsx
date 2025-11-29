import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsBlock } from "@/lib/blocks/types";

export default function StatsBlock({ title, items }: StatsBlock['fields']) {
  if (!items || items.length === 0) return null;
  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <Card key={idx} className="h-full text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold text-foreground">
                {item.value}
                {item.suffix ? <span className="text-lg font-semibold text-muted-foreground"> {item.suffix}</span> : null}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
