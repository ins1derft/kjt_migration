import Link from "next/link";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductCardsBlock } from "@/lib/blocks/types";
import { Button } from "@/components/ui/button";

export default function ProductCards({ title, items }: ProductCardsBlock['fields']) {
  if (!items || items.length === 0) return null;
  return (
    <section className="section-shell space-y-6">
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <Card key={idx} className="flex h-full flex-col">
            {item.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image} alt={item.title} className="h-40 w-full rounded-t-xl object-cover" />
            )}
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              {item.subtitle && <CardDescription>{item.subtitle}</CardDescription>}
            </CardHeader>
            <CardFooter className="mt-auto">
              {item.url && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={item.url}>Learn more →</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
