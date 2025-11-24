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

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${apiBase}/posts`, { next: { revalidate: 30 } });

  if (!res.ok) {
    throw new Error(`Failed to load posts (${res.status})`);
  }

  const data = (await res.json()) as Post[];
  return data;
}

export default async function Home() {
  const posts = await fetchPosts();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Full-stack boilerplate</p>
        <h1>Next.js 16 + Laravel 12 blog stub</h1>
        <p className={styles.lead}>
          Data is served from the Laravel API (`/api/posts`) and rendered in an
          App Router server component.
        </p>
      </header>

      <section className={styles.list}>
        {posts.length === 0 ? (
          <p className={styles.muted}>No posts yet. Seed the database first.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <p className={styles.meta}>
                {post.published_at ? new Date(post.published_at).toDateString() : "Draft"}
              </p>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className={styles.preview}>
                {post.body?.slice(0, 160) ?? "No excerpt yet."}
              </p>
              <Link className={styles.link} href={`/blog/${post.slug}`}>
                Read more →
              </Link>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
