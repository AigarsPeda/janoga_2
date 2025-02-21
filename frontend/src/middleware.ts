import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserMeLoader } from "@/lib/services/user";

export async function middleware(request: NextRequest) {
  const user = await getUserMeLoader();
  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith("/dashboard") && user.ok === false) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// import { i18n } from "../i18n-config"; // Import your i18n config file

// import { match as matchLocale } from "@formatjs/intl-localematcher";
// import Negotiator from "negotiator";

// function getLocale(request: NextRequest): string | undefined {
//   // Add error handling for negotiator
//   try {
//     const negotiatorHeaders: Record<string, string> = {};
//     request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

//     let languages = new Negotiator({ headers: negotiatorHeaders }).languages();

//     // Ensure languages is not empty and contains valid values
//     if (!languages.length) {
//       languages = [i18n.defaultLocale];
//     }

//     // Filter out any invalid language tags
//     languages = languages.filter((lang) => {
//       try {
//         return Boolean(new Intl.Locale(lang));
//       } catch {
//         return false;
//       }
//     });

//     const locales: string[] = [...i18n.locales];
//     return matchLocale(languages, locales, i18n.defaultLocale);
//   } catch (error) {
//     console.error("Locale matching error:", error);
//     return i18n.defaultLocale;
//   }
// }

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Handle root path specifically
//   if (pathname === "/") {
//     const locale = getLocale(request);
//     return NextResponse.redirect(new URL(`/${locale}/`, request.url), {
//       status: 308, // Permanent redirect
//     });
//   }

//   // Your existing exclusion logic
//   if (["/manifest.json", "/favicon.ico", "/robots.txt"].includes(pathname)) {
//     return;
//   }

//   const pathnameIsMissingLocale = i18n.locales.every(
//     (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
//   );

//   if (pathnameIsMissingLocale) {
//     const locale = getLocale(request);
//     return NextResponse.redirect(
//       new URL(`/${locale}${pathname}`, request.url),
//       {
//         status: 308,
//       }
//     );
//   }
// }

// export const config = {
//   // Matcher to exclude paths like `/_next/` and `/api/` which shouldn't be handled by this middleware
//   matcher: ["/((?!_next|api).*)"],
// };
