import Link from "next/link";
import type { UseCasesBlock } from "@/lib/blocks/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UseCases({ title, items }: UseCasesBlock['fields']) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Card key={idx} className="h-full bg-gradient-to-br from-white to-slate-50">
            <CardHeader>
              <CardTitle>{item.heading}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.body && <p className="text-sm text-muted-foreground">{item.body}</p>}
              {item.cta_label && item.cta_url && (
                <Button asChild variant="outline">
                  <Link href={item.cta_url}>{item.cta_label}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
