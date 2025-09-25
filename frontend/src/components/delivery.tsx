"use client";

import type { DeliveryProps } from "@/types";
import type { LucideIcon } from "lucide-react";
import { CircleDollarSign, CircleHelp, Phone, Truck, Utensils, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  phone: Phone,
  money: Wallet,
  dish: Utensils,
  dollar: CircleDollarSign,
};

function getIconComponent(name: string | undefined): LucideIcon {
  if (!name) return CircleHelp;
  return iconMap[name.toLowerCase()] || CircleHelp;
}

export function Delivery({ steps }: Readonly<DeliveryProps>) {
  if (!steps || steps.length === 0) return null;

  // Refs to each description paragraph to measure tallest height
  const boxesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const [uniformHeight, setUniformHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!steps?.length) return;

    boxesRef.current.forEach((el) => {
      if (el) el.style.minHeight = "auto";
    });

    const heights = boxesRef.current.map((el) => el?.offsetHeight || 0);
    const max = Math.max(...heights, 0);
    setUniformHeight(max);
  }, [steps]);

  return (
    <section aria-label="Delivery steps timeline" className="w-full py-8 container">
      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-0.5 bg-muted md:block" />
        <ol className="relative flex flex-col gap-8 md:flex-row md:gap-0 md:items-stretch">
          {steps.map((step, idx) => {
            const Icon = getIconComponent(step.icon);
            const isLast = idx === steps.length - 1;
            return (
              <li
                key={step.id ?? idx}
                className="group relative flex md:flex-1 md:flex-col md:h-full"
              >
                {idx < steps.length - 1 && (
                  <span className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-muted md:hidden" />
                )}
                <div className="flex items-start md:flex-col md:items-center">
                  <span
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary ring-4 ring-background shadow-md transition-transform group-hover:scale-105"
                    aria-hidden
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="mt-0 flex-1 pl-4 md:mt-4 md:pl-0 md:flex md:flex-col h-full">
                    <p
                      ref={(el) => {
                        boxesRef.current[idx] = el;
                      }}
                      style={uniformHeight ? { minHeight: uniformHeight } : undefined}
                      className="rounded-md border border-border/50 text-black bg-white px-4 py-3 shadow-sm backdrop-blur-sm transition-colors whitespace-pre-line md:text-base text-sm md:flex-1"
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
                {!isLast && <span className="sr-only">Next step</span>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
