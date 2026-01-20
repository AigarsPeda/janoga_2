import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaņoga",
  description: "Izbraukuma banketi Rīgā & apkārtnē – Jāņoga Catering pasākumiem",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
