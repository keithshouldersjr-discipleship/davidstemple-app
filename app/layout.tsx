import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://davidstemple.app"),
  title: "David's Temple App",
  description:
    "A simple digital hub for David's Temple members, visitors, and ministry leaders.",
  openGraph: {
    title: "David's Temple App",
    description:
      "Ask. Find. Stay connected with David's Temple Missionary Baptist Church.",
    url: "https://davidstemple.app",
    siteName: "David's Temple App",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "David's Temple App - Ask. Find. Stay connected.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "David's Temple App",
    description:
      "Ask. Find. Stay connected with David's Temple Missionary Baptist Church.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
