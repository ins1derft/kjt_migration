import type { FAQBlock } from "@/lib/blocks/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQBlock({ title, items }: FAQBlock['fields']) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid gap-3">
        {items.map((item, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
