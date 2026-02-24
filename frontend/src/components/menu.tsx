"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuDay, MenuInfoEntry, MenuInfoProps, MenuItem, MenuProps, Weekday } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CalendarDays,
  CircleHelp,
  Coffee,
  GlassWater,
  IceCream,
  Minus,
  Plus,
  Salad,
  Soup,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface MenuCardProps extends MenuProps {
  note?: string;
  specialOffers?: MenuInfoProps["items"];
}

interface DishSelection {
  kind: string;
  dishId: string;
  quantity: number;
  description: string;
  price: string | number;
}

// Icon map for kinds (case-insensitive). Extend as needed.
const kindIconMap: Record<string, LucideIcon> = {
  soup: Soup,
  salad: Salad,
  drinks: Coffee,
  dessert: IceCream,
  drink: GlassWater,
  main: UtensilsCrossed,
};

export default function Menu({
  days,
  note,
  specialOffers,
  buttonLink,
  title,
  singleDayLabel,
  fullWeekLabel,
  helperText,
  itemLabel,
  itemsLabel,
  specialOfferAppliedLabel,
}: MenuCardProps) {
  const [viewMode, setViewMode] = useState<"single" | "week">("single");
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, DishSelection>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("selections:", selections);
  }, [selections]);

  // Initialize selected day on mount
  useEffect(() => {
    if (days.length > 0 && !selectedDayId) {
      setSelectedDayId(findTodayOrFirst(days));
    }
  }, [days, selectedDayId]);

  const handleDishClick = (item: MenuItem, dayHeading: string) => {
    const key = `${item.id}-${dayHeading}`;
    setSelections((prev) => {
      if (prev[key]) {
        // Increment quantity
        const updated = { ...prev[key], quantity: prev[key].quantity + 1 };
        console.log("Updated selection:", updated);
        return { ...prev, [key]: updated };
      }

      // Add new selection with quantity 1
      const newSelection: DishSelection = {
        dishId: item.id,
        description: item.description,
        kind: item.kind,
        price: item.price,
        quantity: 1,
      };
      return { ...prev, [key]: newSelection };
    });
  };

  const handleQuantityChange = (item: MenuItem, dayHeading: string, delta: number) => {
    const key = `${item.id}-${dayHeading}`;
    setSelections((prev) => {
      const current = prev[key];
      if (!current) return prev;

      const newQuantity = current.quantity + delta;

      if (newQuantity <= 0) {
        // Remove selection
        const newSelections = { ...prev };
        delete newSelections[key];
        console.log("Removed selection:", { dishId: item.id, description: item.description });
        return newSelections;
      }

      // Update quantity
      const updated = { ...current, quantity: newQuantity };
      console.log("Updated selection:", updated);
      return { ...prev, [key]: updated };
    });
  };

  const displayedDays =
    viewMode === "single" && selectedDayId ? days.filter((d) => d.id === selectedDayId) : days;

  const normalizedOffers = useMemo(() => normalizeOffers(specialOffers), [specialOffers]);
  const { totalPrice, savings: specialOfferSavings } = useMemo(
    () => calculateSelectionTotalWithOffers(selections, normalizedOffers),
    [selections, normalizedOffers],
  );

  const totalItems = Object.values(selections).reduce((sum, s) => sum + s.quantity, 0);

  const handlePayment = async () => {
    if (totalItems === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const items = Object.values(selections).map((s) => ({
        dishId: s.dishId,
        description: s.description,
        kind: s.kind,
        price: s.price,
        quantity: s.quantity,
      }));

      const response = await fetch("/api/payments/klix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, totalPrice, locale: "lv" }),
      });

      const data = await response.json();

      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        console.error("Payment creation failed:", data.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          "relative mx-auto w-full max-w-[680px] rounded-[2.2rem]",
          "bg-neutral-900/40 text-foreground shadow-2xl ring-1 ring-border",
          "p-6 sm:p-10 font-[var(--font-heading)]",
        )}
      >
        {/* Header Controls */}
        <div className="mb-8 space-y-5">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            {title ? (
              <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
            ) : (
              <div />
            )}
            <button
              onClick={() => setViewMode(viewMode === "single" ? "week" : "single")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                "transition-all duration-300 ease-out",
                viewMode === "week"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-neutral-900/40 text-foreground ring-1 ring-border",
              )}
            >
              {viewMode === "week" ? (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>{singleDayLabel || "Single Day"}</span>
                </>
              ) : (
                <>
                  <CalendarDays className="w-4 h-4" />
                  <span>{fullWeekLabel || "Full Week"}</span>
                </>
              )}
            </button>
          </div>

          {/* Day Tabs - Only show in single day mode */}
          {viewMode === "single" && days.length > 0 && (
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-2">
                {days.map((day, idx) => {
                  const isSelected = day.id === selectedDayId;
                  const isToday = day.weekday === getTodayDayName();

                  return (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDayId(day.id)}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className={cn(
                        "relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap",
                        "transition-all duration-300 ease-out",
                        "animate-[fadeIn_0.4s_ease-out_forwards] opacity-0",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/40"
                          : "bg-neutral-900/40 text-foreground ring-1 ring-border hover:ring-primary/50",
                      )}
                    >
                      <span className="relative z-10">{day.heading}</span>
                      {isToday && !isSelected && (
                        <span className="absolute -top-0 -right-0 flex h-3 w-3 z-20">
                          <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 " />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary)/0.8)]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && <p className="text-sm text-muted-foreground mb-6 px-1">{helperText}</p>}

        {/* Menu Content */}
        <div
          className={cn(
            "space-y-12",
            viewMode === "week" ? "max-h-[600px] overflow-y-auto pr-2 scrollbar-thin" : "",
          )}
        >
          {displayedDays.map((day, dayIdx) => {
            const isDayOrderable = day.weekday === getTodayDayName();

            return (
              <section
                key={day.id}
                aria-labelledby={`menu-day-${day.id}`}
                className="space-y-6 animate-[slideIn_0.5s_ease-out_forwards] opacity-0"
                style={{ animationDelay: `${dayIdx * 100}ms` }}
              >
                {/* Day heading - only show in week view */}
                {viewMode === "week" && (
                  <h3
                    id={`menu-day-${day.id}`}
                    className="text-2xl font-bold tracking-tight text-foreground border-b-2 border-border pb-3"
                  >
                    {day.heading}
                  </h3>
                )}

                {/* Grouped by Kind */}
                {(() => {
                  const order: string[] = [];
                  const groups: Record<string, typeof day.item> = {};
                  day.item.forEach((it) => {
                    const key = it.kind || "Other";
                    if (!groups[key]) {
                      groups[key] = [];
                      order.push(key);
                    }
                    groups[key].push(it);
                  });

                  return order.map((kind, kindIdx) => {
                    const KindIcon = getKindIcon(kind);
                    return (
                      <div
                        key={kind}
                        className="space-y-3"
                        style={{ animationDelay: `${dayIdx * 100 + kindIdx * 50}ms` }}
                      >
                        {/* Kind Header */}
                        <div className="flex items-center gap-3 pt-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900/40 text-foreground">
                            <KindIcon className="w-5 h-5" aria-hidden />
                          </div>
                          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            {kind}
                          </span>
                        </div>

                        {/* Dish Items */}
                        <ul className="space-y-2">
                          {groups[kind].map((item, itemIdx) => {
                            const selectionKey = `${item.id}-${day.heading}`;
                            const selection = selections[selectionKey];
                            const quantity = selection?.quantity || 0;
                            const isSelected = quantity > 0;

                            return (
                              <li
                                key={item.id}
                                className={cn(
                                  "group relative rounded-2xl transition-all duration-300",
                                  isSelected ? "bg-neutral-700/50" : "bg-neutral-700/50",
                                )}
                                style={{
                                  animationDelay: `${dayIdx * 100 + kindIdx * 50 + itemIdx * 30}ms`,
                                }}
                              >
                                <div className="flex items-center gap-3 p-4">
                                  {/* Dish Details */}
                                  <div className="flex-1 flex items-center gap-3 min-w-0">
                                    <span className="font-medium leading-snug flex-1 break-words text-foreground">
                                      {item.description}
                                    </span>

                                    {/* Decorative Dots */}
                                    <span
                                      aria-hidden
                                      className="hidden sm:block flex-shrink h-[2px] min-w-[40px] text-border"
                                    />

                                    {/* Price */}
                                    <span className="font-semibold tabular-nums whitespace-nowrap text-base text-foreground">
                                      {formatPrice(item.price)}
                                    </span>
                                  </div>

                                  {/* Quantity Controls - Only for orderable days */}
                                  {isDayOrderable && (
                                    <div className="flex items-center gap-2 ml-2">
                                      <button
                                        onClick={() => handleQuantityChange(item, day.heading, -1)}
                                        disabled={quantity === 0}
                                        className={cn(
                                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                                          "ring-1",
                                          quantity === 0
                                            ? "bg-neutral-900/40 text-muted-foreground ring-border/30 cursor-not-allowed opacity-50"
                                            : "bg-neutral-900/60 text-foreground hover:bg-neutral-900/80 ring-border",
                                        )}
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>

                                      <span
                                        className={cn(
                                          "w-10 text-center font-bold tabular-nums text-lg transition-colors duration-200",
                                          isSelected ? "text-primary" : "text-muted-foreground",
                                        )}
                                      >
                                        {quantity}
                                      </span>

                                      <button
                                        onClick={() => {
                                          if (quantity === 0) {
                                            handleDishClick(item, day.heading);
                                          } else {
                                            handleQuantityChange(item, day.heading, 1);
                                          }
                                        }}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ring-1 bg-neutral-900/60 text-foreground hover:bg-neutral-900/80 ring-border"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  });
                })()}
              </section>
            );
          })}
        </div>

        {/* Order Summary & Button */}
        {buttonLink && (
          <div className="mt-10 animate-[fadeIn_0.6s_ease-out_0.5s_forwards] opacity-0">
            {totalItems > 0 && (
              <div className="mb-4 px-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {totalItems} {totalItems === 1 ? (itemLabel || "item") : (itemsLabel || "items")}
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {totalPrice.toFixed(2)}{" "}
                    <span className="text-lg font-medium text-muted-foreground">€</span>
                  </span>
                </div>
                {specialOfferSavings > 0 && (
                  <p className="text-xs text-primary font-medium">
                    {specialOfferAppliedLabel || "Special offer applied"}: -
                    {specialOfferSavings.toFixed(2)} €
                  </p>
                )}
              </div>
            )}
            <Button
              size="lg"
              className={cn(
                "w-full shadow-lg",
                totalItems === 0 && "opacity-50 pointer-events-none",
              )}
              disabled={totalItems === 0 || isSubmitting}
              onClick={handlePayment}
            >
              {isSubmitting ? "Processing..." : buttonLink.text}
            </Button>
          </div>
        )}

        {/* Decorative Background Gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.2rem] bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      </div>
    </div>
  );
}

interface NormalizedOffer {
  price: number;
  requiredKindCounts: Record<string, number>;
}

interface PreparedOffer {
  price: number;
  requiredCounts: number[];
}

function toOfferEntries(items: MenuInfoProps["items"][number]["items"]): MenuInfoEntry[] {
  if (Array.isArray(items)) return items;
  if (items) return [items];
  return [];
}

function normalizeKind(kind: string | undefined): string {
  return kind?.trim().toLowerCase() || "";
}

function toNumericPrice(value: string | number): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeOffers(offers: MenuInfoProps["items"] | undefined): NormalizedOffer[] {
  if (!offers || offers.length === 0) return [];

  return offers.reduce<NormalizedOffer[]>((acc, offer) => {
    const requiredKindCounts: Record<string, number> = {};

    toOfferEntries(offer.items).forEach((entry) => {
      const kind = normalizeKind(entry.kind);
      if (!kind) return;
      requiredKindCounts[kind] = (requiredKindCounts[kind] || 0) + 1;
    });

    if (Object.keys(requiredKindCounts).length === 0) return acc;

    acc.push({
      price: toNumericPrice(offer.price),
      requiredKindCounts,
    });
    return acc;
  }, []);
}

function calculateSelectionTotalWithOffers(
  selections: Record<string, DishSelection>,
  offers: NormalizedOffer[],
) {
  const baseTotal = Object.values(selections).reduce((sum, selection) => {
    return sum + toNumericPrice(selection.price) * selection.quantity;
  }, 0);

  if (offers.length === 0) {
    return { totalPrice: baseTotal, savings: 0 };
  }

  const pricesByKind = new Map<string, number[]>();
  Object.values(selections).forEach((selection) => {
    const normalizedKind = normalizeKind(selection.kind);
    const unitPrice = toNumericPrice(selection.price);

    if (!normalizedKind || unitPrice <= 0 || selection.quantity <= 0) return;

    const bucket = pricesByKind.get(normalizedKind) || [];
    for (let i = 0; i < selection.quantity; i += 1) {
      bucket.push(unitPrice);
    }
    pricesByKind.set(normalizedKind, bucket);
  });

  if (pricesByKind.size === 0) {
    return { totalPrice: baseTotal, savings: 0 };
  }

  pricesByKind.forEach((prices) => prices.sort((a, b) => b - a));

  const kindKeys = Array.from(pricesByKind.keys()).sort();
  const kindIndex = new Map(kindKeys.map((kind, idx) => [kind, idx]));
  const maxKindCounts = kindKeys.map((kind) => pricesByKind.get(kind)?.length || 0);
  const pricePrefixSums = kindKeys.map((kind) => {
    const prices = pricesByKind.get(kind) || [];
    const prefix = [0];
    prices.forEach((price) => {
      prefix.push(prefix[prefix.length - 1] + price);
    });
    return prefix;
  });

  const preparedOffers: PreparedOffer[] = offers
    .map((offer) => {
      const requiredCounts = new Array(kindKeys.length).fill(0);

      for (const [kind, count] of Object.entries(offer.requiredKindCounts)) {
        const idx = kindIndex.get(kind);
        if (idx === undefined) return null;
        requiredCounts[idx] = count;
      }

      return { price: offer.price, requiredCounts };
    })
    .filter((offer): offer is PreparedOffer => offer !== null);

  if (preparedOffers.length === 0) {
    return { totalPrice: baseTotal, savings: 0 };
  }

  const memo = new Map<string, number>();
  const initialState = new Array(kindKeys.length).fill(0);

  const getBestSavings = (consumedCounts: number[]): number => {
    const key = consumedCounts.join("|");
    const cached = memo.get(key);
    if (cached !== undefined) return cached;

    let bestSavings = 0;

    preparedOffers.forEach((offer) => {
      const nextCounts = [...consumedCounts];
      let rawItemsTotal = 0;
      let canApply = true;

      for (let i = 0; i < offer.requiredCounts.length; i += 1) {
        const needed = offer.requiredCounts[i];
        if (needed === 0) continue;

        const nextCount = consumedCounts[i] + needed;
        if (nextCount > maxKindCounts[i]) {
          canApply = false;
          break;
        }

        rawItemsTotal += pricePrefixSums[i][nextCount] - pricePrefixSums[i][consumedCounts[i]];
        nextCounts[i] = nextCount;
      }

      if (!canApply) return;

      const candidateSavings = rawItemsTotal - offer.price + getBestSavings(nextCounts);
      if (candidateSavings > bestSavings) {
        bestSavings = candidateSavings;
      }
    });

    memo.set(key, bestSavings);
    return bestSavings;
  };

  const savings = Math.max(0, getBestSavings(initialState));
  const totalPrice = Math.max(0, baseTotal - savings);

  return { totalPrice, savings };
}

// Find today's menu or return first day
function findTodayOrFirst(days: MenuDay[]): string | null {
  if (days.length === 0) return null;
  const today = getTodayDayName();
  const todayMenu = days.find((d) => d.weekday === today);
  return todayMenu?.id || days[0].id;
}

function formatPrice(price: string | number) {
  if (typeof price === "number") return price.toFixed(price % 1 === 0 ? 0 : 2);
  return price;
}

function getKindIcon(kind: string | undefined): LucideIcon {
  if (!kind) return CircleHelp;
  return kindIconMap[kind.trim().toLowerCase()] || CircleHelp;
}

// Get today's day name as Weekday enum value
function getTodayDayName(): Weekday {
  const days: Weekday[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date().getDay()];
}
