import { NextResponse } from "next/server";

export async function GET() {
  const entries = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/editor", changefreq: "weekly", priority: "0.8" },
  ];

  const urls = entries
    .map(
      (e) =>
        [
          "  <url>",
          `    <loc>${e.path}</loc>`,
          e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
          e.priority ? `    <priority>${e.priority}</priority>` : null,
          "  </url>",
        ]
          .filter(Boolean)
          .join("\n"),
    )
    .join("\n");

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
  ].join("\n");

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
