import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Post = {
  id: number;
  title: string;
  slug: string;
  body?: string;
  published_at?: string | null;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function fetchPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${apiBase}/posts/${slug}`, { cache: "no-store" });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load post (${res.status})`);
  }

  return (await res.json()) as Post;
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return (
      <main className="section-shell space-y-4">
        <p className="text-muted-foreground">Post not found.</p>
        <Link href="/" className="text-primary hover:underline">← Back to posts</Link>
      </main>
    );
  }

  return (
    <main className="section-shell space-y-4">
      <Badge variant="secondary" className="uppercase tracking-wide">
        {post.published_at ? new Date(post.published_at).toDateString() : "Draft"}
      </Badge>
      <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-foreground">{post.body ?? "No content yet."}</div>
        </CardContent>
      </Card>
      <Link href="/" className="text-primary hover:underline">
        ← Back to posts
      </Link>
    </main>
  );
}
