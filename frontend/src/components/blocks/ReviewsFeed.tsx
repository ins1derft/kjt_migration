import type { ReviewsFeedBlock } from "@/lib/blocks/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewsFeed({ title, rating, count, provider, embed_code }: ReviewsFeedBlock['fields']) {
  return (
    <section className="section-shell space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{title ?? 'Reviews'}</h2>
        <p className="text-sm text-muted-foreground">
          {rating ? `${rating}★` : ''} {count ? `• ${count} reviews` : ''} {provider ? `on ${provider}` : ''}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Live feed</CardTitle>
        </CardHeader>
        <CardContent>
          {embed_code ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: embed_code }} />
          ) : (
            <p className="text-sm text-muted-foreground">Reviews feed coming soon.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
