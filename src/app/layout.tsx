import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SharkDown — Write Like Word. Publish Like Markdown.",
  description:
    "SharkDown is a visual-first Markdown editor. Compose like Notion or Word, export pristine Markdown.",
  authors: [{ name: "SharkDown" }],
  openGraph: {
    title: "SharkDown — Visual Markdown Editor",
    description:
      "Write like Word. Publish like Markdown. The friendliest way to author technical docs.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
