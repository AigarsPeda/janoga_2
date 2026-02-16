"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuDay, MenuItem, MenuProps } from "@/types";
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
import Link from "next/link";
import { useEffect, useState } from "react";

interface MenuCardProps extends MenuProps {
  note?: string;
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

function getKindIcon(kind: string | undefined): LucideIcon {
  if (!kind) return CircleHelp;
  return kindIconMap[kind.trim().toLowerCase()] || CircleHelp;
}

// Get today's day name
function getTodayDayName(): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

// Find today's menu or return first day
function findTodayOrFirst(days: MenuDay[]): string | null {
  if (days.length === 0) return null;
  const today = getTodayDayName();
  const todayMenu = days.find((d) => d.heading.toLowerCase().includes(today.toLowerCase()));
  return todayMenu?.id || days[0].id;
}

export default function Menu({
  days,
  note,
  buttonLink,
  title,
  singleDayLabel,
  fullWeekLabel,
  helperText,
}: MenuCardProps) {
  const [viewMode, setViewMode] = useState<"single" | "week">("single");
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, DishSelection>>({});

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

    if (selections[key]) {
      // Increment quantity
      const updated = { ...selections[key], quantity: selections[key].quantity + 1 };
      setSelections({ ...selections, [key]: updated });
      console.log("Updated selection:", updated);
    } else {
      // Add new selection with quantity 1
      const newSelection: DishSelection = {
        dishId: item.id,
        description: item.description,
        kind: item.kind,
        price: item.price,
        quantity: 1,
      };
      setSelections({ ...selections, [key]: newSelection });
    }
  };

  const handleQuantityChange = (item: MenuItem, dayHeading: string, delta: number) => {
    const key = `${item.id}-${dayHeading}`;
    const current = selections[key];

    if (!current) return;

    const newQuantity = current.quantity + delta;

    if (newQuantity <= 0) {
      // Remove selection
      const newSelections = { ...selections };
      delete newSelections[key];
      setSelections(newSelections);
      console.log("Removed selection:", { dishId: item.id, description: item.description });
    } else {
      // Update quantity
      const updated = { ...current, quantity: newQuantity };
      setSelections({ ...selections, [key]: updated });
      console.log("Updated selection:", updated);
    }
  };

  const displayedDays =
    viewMode === "single" && selectedDayId ? days.filter((d) => d.id === selectedDayId) : days;

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
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
                {days.map((day, idx) => {
                  const isSelected = day.id === selectedDayId;
                  const isToday = day.heading
                    .toLowerCase()
                    .includes(getTodayDayName().toLowerCase());

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
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-card" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && (
          <p className="text-sm text-muted-foreground mb-6 px-1">{helperText}</p>
        )}

        {/* Menu Content */}
        <div
          className={cn(
            "space-y-12",
            viewMode === "week" ? "max-h-[600px] overflow-y-auto pr-2 scrollbar-thin" : "",
          )}
        >
          {displayedDays.map((day, dayIdx) => (
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

                                {/* Quantity Controls - Always visible */}
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
          ))}
        </div>

        {/* Button Link */}
        {buttonLink && (
          <div className="mt-10 animate-[fadeIn_0.6s_ease-out_0.5s_forwards] opacity-0">
            <Button asChild size={"lg"} className="w-full sm:w-auto shadow-lg">
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

        {/* Decorative Background Gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.2rem] bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      </div>
    </div>
  );
}

function formatPrice(price: string | number) {
  if (typeof price === "number") return price.toFixed(price % 1 === 0 ? 0 : 2);
  return price;
}
