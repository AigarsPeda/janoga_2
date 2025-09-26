"use client";

import { MenuProps } from "@/types";
import { cn } from "@/lib/utils";
import * as React from "react";

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

export default function Menu({ days, title = "Drinks", note }: MenuCardProps) {
  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          "relative mx-auto w-full max-w-[420px] rounded-[2.2rem]",
          "bg-neutral-50 text-neutral-900 shadow-xl ring-1 ring-black/5",
          "p-8 sm:p-10 font-[var(--font-heading)]",
        )}
      >
        <div className="space-y-10">
          {days.map((cat) => (
            <section key={cat.id} aria-labelledby={`menu-cat-${cat.id}`} className="space-y-4">
              <h3
                id={`menu-cat-${cat.id}`}
                className="text-lg font-bold tracking-wide text-neutral-800"
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
                return order.map((kind) => (
                  <div key={kind} className="space-y-2">
                    <h4 className="pt-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
                      {kind}
                    </h4>
                    <ul className="space-y-2">
                      {groups[kind].map((it) => (
                        <li
                          key={it.id}
                          className="group flex items-start text-sm leading-relaxed text-neutral-700"
                        >
                          <div className="grid w-full grid-cols-[auto_1fr_auto] items-baseline">
                            <span className="pr-2 capitalize tracking-wide text-neutral-800">
                              {it.description}
                            </span>
                            <span
                              aria-hidden
                              className="mx-1 mb-1 h-[2px] self-end bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:6px_2px] text-neutral-300"
                            />
                            <span className="pl-2 font-semibold tabular-nums text-neutral-900">
                              {formatPrice(it.price)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ));
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
