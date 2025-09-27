import type { LucideIcon } from "lucide-react";
import {
  CircleDollarSign,
  CircleHelp,
  Phone,
  Truck,
  Utensils,
  Wallet,
  SquareMenu,
  Salad,
  Drumstick,
  IceCream2,
  Soup,
  UtensilsCrossed,
  GlassWater,
} from "lucide-react";
import * as React from "react";

/*
  Central icon map so components (Delivery, MenuInfo, etc.) can reuse a single
  lightweight lookup + fallback without redefining local maps.
  Keys are stored lowercase; pass any-cased strings to getIcon.
*/
const baseIconMap: Record<string, LucideIcon> = {
  truck: Truck,
  phone: Phone,
  money: Wallet,
  dish: Utensils,
  menu: SquareMenu,
  dollar: CircleDollarSign,
  // Menu kinds (normalized to lowercase)
  main: UtensilsCrossed,
  "main dish": UtensilsCrossed,
  soup: Soup,
  dessert: IceCream2,
  salad: Salad,
  side: Utensils,
  "side dish": Utensils,
  drink: GlassWater,
};

// Fallback inline soup/bowl icon (swap to official if available later)
function BowlIconFallback(): LucideIcon {
  const Comp = ((props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10a9 9 0 0 0 18 0H3Z" />
      <path d="M5 18h14" />
    </svg>
  )) as LucideIcon;
  Comp.displayName = "BowlIconFallback";
  return Comp;
}

export function getIcon(name?: string): LucideIcon {
  if (!name) return CircleHelp;
  const key = name.trim().toLowerCase();
  return baseIconMap[key] || Utensils;
}

export { baseIconMap as iconMap };
