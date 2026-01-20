"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface StrapiLocale {
  id: number;
  documentId: string;
  name: string;
  code: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LocaleSwitcherProps {
  locales: StrapiLocale[];
  currentLocale: string;
  className?: string;
}

export function LocaleSwitcher({ locales, currentLocale, className }: LocaleSwitcherProps) {
  const pathname = usePathname();

  // Replace current locale in path with new locale
  const getLocalizedPath = (newLocale: string) => {
    // Remove current locale from path and add new one
    const segments = pathname.split("/");
    segments[1] = newLocale; // Replace locale segment
    return segments.join("/");
  };

  if (!locales || locales.length <= 1) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={getLocalizedPath(locale.code)}
          className={cn(
            "px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground uppercase rounded transition-colors",
            {
              "text-foreground font-bold bg-muted": currentLocale === locale.code,
            },
          )}
        >
          {locale.code}
        </Link>
      ))}
    </div>
  );
}
