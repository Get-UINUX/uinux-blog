import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";

const fontsDir = path.join(process.cwd(), "node_modules/@fontsource/inter/files");

let _fontRegular: Buffer | null = null;
let _fontBold: Buffer | null = null;

function getFontRegular(): Buffer {
  if (!_fontRegular) {
    _fontRegular = fs.readFileSync(path.join(fontsDir, "inter-latin-400-normal.woff"));
  }
  return _fontRegular;
}

function getFontBold(): Buffer {
  if (!_fontBold) {
    _fontBold = fs.readFileSync(path.join(fontsDir, "inter-latin-700-normal.woff"));
  }
  return _fontBold;
}

export async function generateOgImage({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<Buffer> {
  const truncatedDesc =
    description.length > 120 ? description.slice(0, 117) + "..." : description;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#141413",
          padding: "60px 72px",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "p",
            props: {
              style: {
                fontSize: 18,
                fontWeight: 400,
                color: "#6e6e6c",
                margin: 0,
                letterSpacing: "-0.02em",
              },
              children: "UINUX Blog",
            },
          },
          {
            type: "div",
            props: { style: { flex: 1, display: "flex" }, children: "" },
          },
          {
            type: "h1",
            props: {
              style: {
                fontSize: title.length > 50 ? 44 : 52,
                fontWeight: 700,
                color: "#e8e8e6",
                lineHeight: 1.25,
                margin: "0 0 20px 0",
                letterSpacing: "-0.03em",
              },
              children: title,
            },
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: 22,
                fontWeight: 400,
                color: "#6e6e6c",
                lineHeight: 1.5,
                margin: 0,
              },
              children: truncatedDesc,
            },
          },
          {
            type: "div",
            props: { style: { flex: 1, display: "flex" }, children: "" },
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: 15,
                fontWeight: 400,
                color: "#3a3a38",
                margin: 0,
                letterSpacing: "0.01em",
              },
              children: "uinuxblog.getuinux.com",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: getFontRegular(), weight: 400, style: "normal" },
        { name: "Inter", data: getFontBold(), weight: 700, style: "normal" },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}
