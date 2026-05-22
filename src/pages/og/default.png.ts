import type { APIContext } from "astro";
import { generateOgImage } from "../../lib/og";

export async function GET(_context: APIContext) {
  const png = await generateOgImage({
    title: "UINUX Blog",
    description: "Writing about systems, design, and building with restraint.",
  });
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
