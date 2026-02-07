"use client";

import type { NavLink } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNavbar } from "@/components/mobile-navbar";
import { Button } from "@/components/ui/button";
import { cn, getStrapiURL } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/locale-switcher";

interface StrapiLocale {
  id: number;
  documentId: string;
  name: string;
  code: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HeaderProps {
  data: {
    logoText: string;
    navItems: NavLink[];
    cta: NavLink;
    logo: {
      url: string;
      name: string;
    } | null;
  };
  locales?: StrapiLocale[];
  currentLocale?: string;
}

export function Header({ data, locales, currentLocale = "lv" }: Readonly<HeaderProps>) {
  if (!data) return null;

  const baseUrl = getStrapiURL();
  const { logoText, navItems, cta } = data;
  const pathname = usePathname() ?? "/";

  // Helper function to add locale prefix to internal links
  const getLocalizedHref = (href: string, isExternal?: boolean) => {
    if (
      isExternal ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return href;
    }
    // Ensure href starts with /
    const path = href.startsWith("/") ? href : `/${href}`;
    return `/${currentLocale}${path}`;
  };

  const normalizePath = (path: string) => {
    if (path === "/") return "/";
    return path.replace(/\/$/, "");
  };

  return (
    <header className="container flex items-center justify-between gap-10 py-4">
      <Link href={`/${currentLocale}`} className="flex items-center gap-3">
        {data.logo?.url && (
          <img
            src={baseUrl + data.logo.url}
            alt={data.logo?.name || "Logo"}
            className="h-10 w-10 object-contain"
          />
        )}
        <span className="text-xl font-bold">{logoText}</span>
      </Link>
      <div className="flex items-center gap-10">
        <nav className="hidden items-center gap-10 md:flex justify-end">
          {navItems &&
            navItems.map((item, i) =>
              (() => {
                const localizedHref = getLocalizedHref(item.href, item.isExternal);
                const isActive =
                  !item.isExternal && normalizePath(pathname) === normalizePath(localizedHref);

                return (
                  <Link
                    href={localizedHref}
                    className={cn("font-medium text-muted-foreground hover:text-foreground", {
                      "text-primary": item.isPrimary || isActive,
                    })}
                    key={`navItems-link-${i}`}
                    target={item.isExternal ? "_blank" : "_self"}
                  >
                    {item.text}
                  </Link>
                );
              })(),
            )}
        </nav>
        {locales && locales.length > 1 && (
          <LocaleSwitcher
            locales={locales}
            currentLocale={currentLocale}
            className="hidden md:flex"
          />
        )}
        {cta && (
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild>
              <Link
                href={getLocalizedHref(cta.href, cta.isExternal)}
                className="cursor-pointer"
                target={cta.isExternal ? "_blank" : "_self"}
              >
                {cta.text}
              </Link>
            </Button>
          </div>
        )}
      </div>
      <MobileNavbar>
        <div className="rounded-b-lg bg-background py-4 container text-foreground shadow-xl">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems &&
              navItems.map((item, i) =>
                (() => {
                  const localizedHref = getLocalizedHref(item.href, item.isExternal);
                  const isActive =
                    !item.isExternal && normalizePath(pathname) === normalizePath(localizedHref);

                  return (
                    <Link
                      // key={item.text}
                      key={`navItems-link-${i}-${item.text}`}
                      href={localizedHref}
                      className={cn(
                        "flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground",
                        { "text-primary": item.isPrimary || isActive },
                      )}
                    >
                      {item.text}
                    </Link>
                  );
                })(),
              )}

            {locales && locales.length > 1 && (
              <div className="pt-2 border-t mt-2">
                <LocaleSwitcher locales={locales} currentLocale={currentLocale} />
              </div>
            )}

            {cta && (
              <Button asChild size="lg" className="mt-2 w-full">
                <Link
                  href={getLocalizedHref(cta.href, cta.isExternal)}
                  className="cursor-pointer"
                  target={cta.isExternal ? "_blank" : "_self"}
                >
                  {cta.text}
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </MobileNavbar>
    </header>
  );
}
