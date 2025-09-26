"use client";

import { cn } from "@/lib/utils";
import { MenuProps } from "@/types";
import type { LucideIcon } from "lucide-react";
import { CircleHelp, Coffee, IceCream, Salad, Soup, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface MenuCardProps extends MenuProps {
  title?: string;
  note?: string;
}

function formatPrice(price: string | number) {
  if (typeof price === "number") return price.toFixed(price % 1 === 0 ? 0 : 2);
  return price;
}

// Icon map for kinds (case-insensitive). Extend as needed.
const kindIconMap: Record<string, LucideIcon> = {
  soup: Soup,
  main: UtensilsCrossed,
  dessert: IceCream,
  salad: Salad,
  drinks: Coffee,
  drink: Coffee,
};

function getKindIcon(kind: string | undefined): LucideIcon {
  if (!kind) return CircleHelp;
  return kindIconMap[kind.trim().toLowerCase()] || CircleHelp;
}

export default function Menu({ days, note, buttonLink }: MenuCardProps) {
  console.log("buttonLink", buttonLink);
  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          "relative mx-auto w-full max-w-[620px] rounded-[2.2rem]",
          "bg-neutral-50 text-neutral-900 shadow-xl ring-1 ring-black/5",
          "p-8 sm:p-10 font-[var(--font-heading)]",
        )}
      >
        <div className="space-y-10">
          {days.map((cat) => (
            <section key={cat.id} aria-labelledby={`menu-cat-${cat.id}`} className="space-y-4">
              <h3
                id={`menu-cat-${cat.id}`}
                className="text-2xl font-extrabold tracking-wide text-neutral-900"
              >
                {cat.heading}
              </h3>
              {(() => {
                // Group items by their first-seen kind preserving appearance order
                const order: string[] = [];
                const groups: Record<string, typeof cat.item> = {};
                cat.item.forEach((it) => {
                  const key = it.kind || "Other";
                  if (!groups[key]) {
                    groups[key] = [];
                    order.push(key);
                  }
                  groups[key].push(it);
                });
                return order.map((kind) => {
                  const KindIcon = getKindIcon(kind);
                  return (
                    <div key={kind} className="space-y-2">
                      <div className="pt-2 flex items-center gap-3">
                        <KindIcon className="h-6 w-6 text-neutral-500" aria-hidden />
                      </div>
                      <ul className="space-y-2">
                        {groups[kind].map((it) => (
                          <li
                            key={it.id}
                            className="group flex items-start text-base leading-relaxed text-neutral-800"
                          >
                            <div className="flex w-full items-start">
                              <span className="pr-3 font-medium tracking-wide leading-snug max-w-[65%] break-words">
                                {it.description}
                              </span>
                              <span
                                aria-hidden
                                className="flex-1 self-center h-[2px] bg-[repeating-linear-gradient(90deg,currentColor_0,currentColor_2px,transparent_2px,transparent_6px)] text-neutral-300"
                              />
                              <span className="ml-3 font-semibold tabular-nums text-neutral-900 text-base whitespace-nowrap">
                                {formatPrice(it.price)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                });
              })()}
            </section>
          ))}
          {buttonLink && (
            <div className="mt-10">
              <Button asChild size={"lg"}>
                <Link
                  href={buttonLink.href}
                  className="cursor-pointer"
                  target={buttonLink.isExternal ? "_blank" : "_self"}
                >
                  {buttonLink.text}
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Subtle outer glow similar to mockup */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-b from-neutral-900/10 to-neutral-900/0" />
      </div>
    </div>
  );
}
