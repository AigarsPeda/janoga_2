"use client";

import { getIcon } from "@/lib/icons";
import { MenuInfoEntry, MenuInfoProps } from "@/types";
import * as React from "react";

function toOfferItems(items: MenuInfoProps["items"][number]["items"]): MenuInfoEntry[] {
  if (Array.isArray(items)) return items;
  if (items) return [items];
  return [];
}

export function MenuInfo({ items }: Readonly<MenuInfoProps>) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Menu information" className="w-full container pb-6 max-w-[680px]">
      <div className="space-y-3">
        {items.map((group, groupIdx) => {
          const { price } = group;
          const mealItems = toOfferItems(group.items);

          return (
            <div
              key={group.id ?? groupIdx}
              className="flex items-center rounded-md border border-border/60 bg-neutral-900/40 px-5 py-3 text-sm md:text-base shadow-sm backdrop-blur-sm"
            >
              <ul className="grid grid-flow-col auto-cols-max items-center gap-3 w-full">
                {mealItems.map((mi, idx: number) => {
                  const Icon = getIcon(mi.kind || mi.description);
                  const label = mi.description || mi.kind;

                  return (
                    <React.Fragment key={mi.id ?? idx}>
                      <li className="flex items-center gap-2 w-32">
                        <Icon className="h-6 w-6 shrink-0 text-neutral-300" aria-hidden />
                        <span className="font-medium tracking-tight text-neutral-300 leading-none">
                          {label}
                        </span>
                      </li>
                      {idx < mealItems.length - 1 && (
                        <span
                          aria-hidden
                          className="font-medium text-neutral-200 select-none self-center px-1"
                        >
                          +
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </ul>
              <div className="ml-auto flex items-baseline gap-1 pl-4 md:pl-0 relative before:md:hidden before:absolute before:left-0 before:top-1/2 before:h-6 before:-translate-y-1/2 before:w-px before:bg-neutral-700">
                <span className="text-2xl font-semibold text-neutral-200 tabular-nums leading-none">
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
