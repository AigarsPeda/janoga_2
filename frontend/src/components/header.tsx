import type { NavLink } from "@/types";
import Link from "next/link";

import { MobileNavbar } from "@/components/mobile-navbar";
import { Button } from "@/components/ui/button";
import { cn, getStrapiURL } from "@/lib/utils";

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
}

export function Header({ data }: Readonly<HeaderProps>) {
  if (!data) return null;

  const baseUrl = getStrapiURL();
  const { logoText, navItems, cta } = data;

  return (
    <header className="container flex items-center justify-between gap-10 py-4">
      <Link href="/" className="flex items-center gap-3">
        {data.logo?.url && (
          <img
            src={baseUrl + data.logo.url}
            alt={data.logo?.name || "Logo"}
            className="h-10 w-10 object-contain"
          />
        )}
        <span className="font-heading text-xl font-bold">{logoText}</span>
      </Link>
      <div className="flex items-center gap-10">
        <nav className="hidden items-center gap-10 md:flex justify-end">
          {navItems &&
            navItems.map((item, i) => (
              <Link
                href={item.href}
                className={cn("font-medium text-muted-foreground hover:text-foreground", {
                  "text-primary": item.isPrimary,
                })}
                key={`navItems-link-${i}`}
                target={item.isExternal ? "_blank" : "_self"}
              >
                {item.text}
              </Link>
            ))}
        </nav>
        {cta && (
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild>
              <Link
                href={cta.href}
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
              navItems.map((item, i) => (
                <Link
                  // key={item.text}
                  key={`navItems-link-${i}-${item.text}`}
                  href={item.href}
                  className="flex w-full cursor-pointer items-center rounded-md p-2 font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.text}
                </Link>
              ))}

            {cta && (
              <Button asChild size="lg" className="mt-2 w-full">
                <Link
                  href={cta.href}
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
