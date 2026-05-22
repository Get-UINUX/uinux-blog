import type { APIContext } from "astro";
import { getPublishedPosts } from "../../lib/posts";
import { generateOgImage } from "../../lib/og";

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, description: post.data.description },
  }));
}

export async function GET({ props }: APIContext) {
  const { title, description } = props as { title: string; description: string };
  const png = await generateOgImage({ title, description });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
