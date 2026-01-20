import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { cn, getStrapiURL } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import qs from "qs";
import { i18n, type Locale } from "../../../i18n-config";
import "../globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Nunito({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jaņoga",
  description: "Izbraukuma banketi Rīgā & apkārtnē – Jāņoga Catering pasākumiem",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

const globalPopulate = {
  topNav: { populate: "*" },
  footer: { populate: "*" },
};

async function loader(locale: string) {
  const { fetchData } = await import("@/lib/fetch");
  const baseUrl = getStrapiURL();

  // Fetch global data
  const globalPath = "/api/global";
  const query = qs.stringify({
    populate: globalPopulate,
    locale: locale,
  });

  const globalUrl = new URL(globalPath, baseUrl);
  globalUrl.search = query;

  // Fetch available locales from Strapi i18n plugin
  const localesUrl = new URL("/api/i18n/locales", baseUrl);

  let globalData = await fetchData(globalUrl.href);

  // Fallback to default locale if no global data found
  if (!globalData?.data?.topNav && locale !== i18n.defaultLocale) {
    const fallbackQuery = qs.stringify({
      populate: globalPopulate,
      locale: i18n.defaultLocale,
    });
    const fallbackUrl = new URL(globalPath, baseUrl);
    fallbackUrl.search = fallbackQuery;
    globalData = await fetchData(fallbackUrl.href);
  }

  // Locales endpoint may require permissions - handle gracefully
  let localesData = [];
  try {
    const response = await fetch(localesUrl.href);
    if (response.ok) {
      localesData = await response.json();
    }
  } catch (error) {
    console.warn("Could not fetch locales:", error);
  }

  return { globalData, locales: localesData };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const { globalData, locales } = await loader(locale);
  const { topNav, footer } = globalData?.data ?? {};

  return (
    <html lang={locale}>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <Header data={topNav} locales={locales} currentLocale={locale} />
        {children}
        <Footer data={footer} />
      </body>
    </html>
  );
}
