"use client";

import { MenuProps } from "@/types";
import { cn } from "@/lib/utils";
import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Soup, UtensilsCrossed, IceCream, CircleHelp, Salad, Coffee } from "lucide-react";

/* ---------------------------------------------
   Cafe Style Menu Card
   - Uses incoming `days` array as categories
   - Each category heading displayed
   - Items have dotted leader between name & price
   - Optional kind rendered in subtle italics
   - Pure Tailwind (no extra CSS file needed)
---------------------------------------------- */

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

export default function Menu({ days, title = "Drinks", note }: MenuCardProps) {
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
        </div>

        {/* Optional note area */}
        {note && (
          <div className="mt-10 flex items-start gap-3 text-xs text-neutral-600">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-neutral-300 bg-white text-neutral-500">
              {/* Simple cup icon (ASCII) */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-8 w-8"
              >
                <path d="M6 8h11a4 4 0 0 1 0 8H6V8Z" />
                <path d="M6 8v9a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3V8M9 5c0 .5-.5 1-.5 1s-.5.5-.5 1" />
              </svg>
            </div>
            <p className="max-w-[220px] leading-snug">{note}</p>
          </div>
        )}

        {/* Subtle outer glow similar to mockup */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-b from-neutral-900/10 to-neutral-900/0" />
      </div>
    </div>
  );
}
