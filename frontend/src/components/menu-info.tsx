"use client";

import { MenuInfoProps } from "@/types";
import { getIcon } from "@/lib/icons";
import * as React from "react";

/*
  MenuInfo renders a horizontal list of value elements describing what is included
  in a menu price (e.g. Main dish + Side + Salad 5.0€). It accepts an array of
  items (each has { price, items: { description, kind } }). We'll display each
  group on its own line if multiple exist.

  items[] shape (from types): {
    id: string; price: string|number; items: { id, description, kind }
  }

  Assumption: For the visual similar to screenshot we group by price line.
*/
export function MenuInfo({ items }: Readonly<MenuInfoProps>) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Menu information" className="w-full container py-6 max-w-[840px]">
      <div className="space-y-3">
        {items.map((group, groupIdx) => {
          const { price } = group;
          const mealItems = Array.isArray((group as any).items)
            ? (group as any).items
            : [group.items];

          return (
            <div
              key={group.id ?? groupIdx}
              className="flex items-center rounded-md border border-border/60 bg-neutral-900/40 px-5 py-3 text-sm md:text-base shadow-sm backdrop-blur-sm"
            >
              <ul className="flex items-center gap-4 flex-nowrap overflow-x-auto scrollbar-none">
                {mealItems.map((mi: any, idx: number) => {
                  const Icon = getIcon(mi.kind || mi.description);
                  const label = [
                    mi.description,
                    mi.kind && mi.kind !== mi.description ? mi.kind : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <li key={mi.id ?? idx} className="flex items-center gap-2 whitespace-nowrap">
                      <Icon className="h-6 w-6 shrink-0 text-neutral-300" aria-hidden />
                      <span className="font-medium tracking-tight text-neutral-300 leading-none">
                        {label || mi.kind}
                      </span>
                      {idx < mealItems.length - 1 && (
                        <span
                          aria-hidden
                          className="mx-1 -mr-2 text-neutral-500 font-light select-none"
                        >
                          +
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {/* Divider before price */}
              <div
                aria-hidden
                className="mx-5 hidden h-8 w-px bg-gradient-to-b from-transparent via-neutral-600 to-transparent md:block"
              />
              <div className="ml-auto flex items-baseline gap-1 pl-4 md:pl-0 relative before:md:hidden before:absolute before:left-0 before:top-1/2 before:h-6 before:-translate-y-1/2 before:w-px before:bg-neutral-700">
                <span className="text-2xl font-light text-neutral-200 tabular-nums leading-none">
                  {typeof price === "number" ? price.toFixed(1) : price}
                </span>
                <span className="text-lg font-medium text-neutral-300">€</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
