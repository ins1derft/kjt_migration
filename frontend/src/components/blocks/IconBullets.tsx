import type { IconBulletsBlock } from "@/lib/blocks/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IconBullets({ title, items }: IconBulletsBlock['fields']) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader className="space-y-1">
              {item.icon && <div className="text-2xl">{item.icon}</div>}
              <CardTitle>{item.heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
