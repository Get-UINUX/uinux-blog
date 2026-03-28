import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const index = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    date: post.data.date.toISOString(),
    tags: post.data.tags,
    body: (post.body ?? "")
      .replace(/^---[\s\S]*?\n---\n?/, "")
      .replace(/[#*`\[\]()>_~|\\]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  }));

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
}
