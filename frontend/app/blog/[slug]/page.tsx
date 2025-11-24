import Link from "next/link";
import styles from "./page.module.css";

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
      <main className={styles.main}>
        <p className={styles.muted}>Post not found.</p>
        <Link href="/">← Back to posts</Link>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <p className={styles.meta}>
        {post.published_at ? new Date(post.published_at).toDateString() : "Draft"}
      </p>
      <h1>{post.title}</h1>
      <article className={styles.body}>
        <p>{post.body ?? "No content yet."}</p>
      </article>
      <Link href="/" className={styles.link}>
        ← Back to posts
      </Link>
    </main>
  );
}
