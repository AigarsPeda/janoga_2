import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "@/lib/services/user";
import { i18n } from "../i18n-config";

function getLocale(request: NextRequest): string {
  // Check for locale cookie first
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as (typeof i18n.locales)[number])) {
    return cookieLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().substring(0, 2))
      .find((lang) => i18n.locales.includes(lang as (typeof i18n.locales)[number]));
    if (preferredLocale) {
      return preferredLocale;
    }
  }

  return i18n.defaultLocale;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  // Allow Strapi admin panel to embed this site in an iframe for preview
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
  response.headers.set("Content-Security-Policy", `frame-ancestors 'self' ${strapiUrl}`);

  // Skip static files and api routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/connect")
  ) {
    return response;
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    // Redirect to locale-prefixed path
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    const redirectResponse = NextResponse.redirect(newUrl);
    redirectResponse.headers.set("Content-Security-Policy", `frame-ancestors 'self' ${strapiUrl}`);
    return redirectResponse;
  }

  // Extract locale from path for dashboard protection
  const locale = pathname.split("/")[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  // Dashboard protection
  if (pathWithoutLocale.startsWith("/dashboard")) {
    const user = await getUserMeLoader();
    if (user.ok === false) {
      const redirectResponse = NextResponse.redirect(new URL(`/${locale}`, request.url));
      redirectResponse.headers.set(
        "Content-Security-Policy",
        `frame-ancestors 'self' ${strapiUrl}`,
      );
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
