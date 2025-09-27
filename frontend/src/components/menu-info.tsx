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
    <section aria-label="Menu information" className="w-full container py-6 max-w-[720px]">
      <div className="space-y-4">
        {items.map((group, groupIdx) => {
          const { price } = group;
          // In provided type group.items is singular (not array) -> adapt for potential future extension
          const mealItems = Array.isArray((group as any).items)
            ? (group as any).items
            : [group.items];

          return (
            <div
              key={group.id ?? groupIdx}
              className="flex flex-wrap items-center gap-3 rounded-md border border-border/60 px-4 py-3 text-sm md:text-base backdrop-blur-sm shadow-sm"
            >
              {mealItems.map((mi: any, idx: number) => {
                const Icon = getIcon(mi.kind || mi.description);
                return (
                  <React.Fragment key={mi.id ?? idx}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-7 w-7 text-neutral-300" aria-hidden />
                      <span className="font-medium tracking-tight text-neutral-300">
                        {mi.description || mi.kind}
                      </span>
                    </div>
                    {idx < mealItems.length - 1 && (
                      <span className="text-neutral-300 mx-1 font-light select-none" aria-hidden>
                        +
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
              {/* Price at end */}
              <div className="ml-auto flex items-baseline gap-1">
                <span className="text-2xl text-neutral-300 tabular-nums leading-none">
                  {typeof price === "number" ? price.toFixed(1) : price}
                </span>
                {/* <span className="text-lg font-semibold">€</span> */}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
