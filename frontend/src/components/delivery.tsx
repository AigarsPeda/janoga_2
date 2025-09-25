import type { DeliveryProps } from "@/types";
import type { LucideIcon } from "lucide-react";
import { CircleDollarSign, CircleHelp, Phone, Truck, Utensils, Wallet } from "lucide-react";

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

  return (
    <section aria-label="Delivery steps timeline" className="w-full py-8 container">
      <div className="relative">
        <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-0.5 bg-muted md:block" />
        <ol className="relative flex flex-col gap-8 md:flex-row md:gap-0">
          {steps.map((step, idx) => {
            const Icon = getIconComponent(step.icon);
            const isLast = idx === steps.length - 1;
            return (
              <li key={step.id ?? idx} className="group relative flex md:flex-1 md:flex-col">
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
                  <div className="mt-0 flex-1 pl-4 md:mt-4 md:pl-0">
                    <p className="rounded-md border border-border/50 text-black bg-white px-4 py-3 shadow-sm backdrop-blur-sm transition-colors whitespace-pre-line md:text-base text-sm">
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
