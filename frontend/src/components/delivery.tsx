"use client";

import type { DeliveryProps } from "@/types";
import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CircleDollarSign,
  CircleHelp,
  Phone,
  Truck,
  Utensils,
  Wallet,
  SquareMenu,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  phone: Phone,
  money: Wallet,
  dish: Utensils,
  menu: SquareMenu,
  dollar: CircleDollarSign,
};

function getIconComponent(name: string | undefined): LucideIcon {
  if (!name) return CircleHelp;
  return iconMap[name.trim().toLowerCase()] || CircleHelp;
}

export function Delivery({ steps }: Readonly<DeliveryProps>) {
  if (!steps || steps.length === 0) return null;

  function renderDescription(text: string) {
    if (!text) return null;
    // Regex matches (broadly): URLs, www domains, emails, and raw phone-like sequences (final validation below)
    const pattern =
      /((https?:\/\/[^\s<]+)|(www\.[^\s<]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\+?\d[\d\s()\-]{5,}\d))/gi;
    const nodes: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const matchText = match[0];
      const start = match.index;
      if (start > lastIndex) {
        nodes.push(text.slice(lastIndex, start));
      }

      let href = matchText;
      let isEmail = false;
      let isPhone = false;

      if (matchText.includes("@") && !matchText.startsWith("http")) {
        // Email
        isEmail = true;
        href = `mailto:${matchText}`;
      } else if (matchText.startsWith("www.")) {
        // Bare domain
        href = `https://${matchText}`;
      } else if (!matchText.startsWith("http")) {
        // Potential phone (exclude urls/emails) – validate pattern now
        const cleaned = matchText.replace(/[\s()\-.]/g, "");
        const digitCount = cleaned.replace(/\D/g, "").length;
        if (/^[+]?\d[\d\s()\-.]*$/.test(matchText) && digitCount >= 7 && digitCount <= 16) {
          isPhone = true;
          href = `tel:${cleaned}`;
        }
      }

      nodes.push(
        <a
          key={`${start}-${matchText}`}
          href={href}
          target={isEmail || isPhone ? undefined : "_blank"}
          rel={isEmail || isPhone ? undefined : "noopener noreferrer nofollow"}
          className="underline decoration-dotted text-primary break-all hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
          aria-label={
            isEmail
              ? `Email ${matchText}`
              : isPhone
                ? `Call ${matchText}`
                : `Open link ${matchText} in new tab`
          }
        >
          {matchText}
        </a>,
      );
      lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }
    // Preserve React key stability by wrapping in Fragment (parent <p> already provides key context)
    return <Fragment>{nodes}</Fragment>;
  }

  return (
    <section aria-label="Delivery steps timeline" className="w-full py-8 container">
      <div className="relative" id="delivery-timeline-root">
        {/* Dynamic horizontal line (desktop only) */}
        <TimelineLine />
        {/* Dynamic vertical line (mobile only) */}
        <TimelineLineVertical />
        <ol className="relative flex flex-col gap-8 md:grid md:grid-flow-col md:auto-cols-fr md:gap-8 md:items-stretch">
          {steps.map((step, idx) => {
            const Icon = getIconComponent(step.icon);
            const isLast = idx === steps.length - 1;
            return (
              <li
                key={step.id ?? idx}
                className="group relative flex md:flex-1 md:flex-col md:h-full"
                data-timeline-icon
              >
                {idx < steps.length - 1 && (
                  <span className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px bg-muted md:hidden" />
                )}
                <div className="flex items-start md:flex-col md:items-center h-full w-full">
                  <span
                    className="timeline-icon relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary ring-4 ring-background shadow-md transition-transform group-hover:scale-105 will-change-transform"
                    data-last-icon={isLast ? "true" : undefined}
                    aria-hidden
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="mt-0 flex-1 pl-4 md:mt-4 md:pl-0 md:flex md:flex-col h-full w-full">
                    <div className="rounded-md border border-border/50 text-black bg-white px-4 py-3 shadow-sm backdrop-blur-sm transition-colors whitespace-pre-line md:text-base text-sm flex-1 flex">
                      <p className="m-0 leading-snug">{renderDescription(step.description)}</p>
                    </div>
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

/* Separate component so we can use hooks without re-rendering list unnecessarily */
function TimelineLine() {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);
  const lastIconRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function computeBounds() {
      if (!lineRef.current) return;
      const icons = Array.from(
        document.querySelectorAll<HTMLElement>(
          "#delivery-timeline-root [data-timeline-icon] .timeline-icon",
        ),
      );
      if (icons.length < 2) return;
      const first = icons[0];
      const last = icons[icons.length - 1];
      lastIconRef.current = last;
      const parent = lineRef.current.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();
      const left = firstRect.left + firstRect.width / 2 - parentRect.left;
      const right = lastRect.left + lastRect.width / 2 - parentRect.left;
      const width = right - left;
      lineRef.current.style.left = left + "px";
      lineRef.current.style.width = width + "px";
      // Center vertically to icon centers
      const iconCenter = firstRect.top + firstRect.height / 2 - parentRect.top;
      lineRef.current.style.top = iconCenter + "px";
    }
    computeBounds();
    window.addEventListener("resize", computeBounds);
    return () => window.removeEventListener("resize", computeBounds);
  }, []);

  // GSAP animated pulse + glow on last icon each loop
  useEffect(() => {
    if (!lineRef.current || !pulseRef.current) return;
    const line = lineRef.current;
    const pulse = pulseRef.current;
    const tween = gsap.fromTo(
      pulse,
      { x: () => -pulse.offsetWidth },
      {
        x: () => line.offsetWidth,
        duration: 4,
        ease: "none",
        repeat: -1,
        onRepeat: () => {
          if (lastIconRef.current) {
            lastIconRef.current.classList.remove("delivery-icon-glow");
            void lastIconRef.current.offsetWidth;
            lastIconRef.current.classList.add("delivery-icon-glow");
          }
        },
      },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={lineRef} className="timeline-line pointer-events-none hidden md:block" aria-hidden>
      <div ref={pulseRef} className="timeline-pulse" />
    </div>
  );
}

/* Mobile vertical line */
function TimelineLineVertical() {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const pulseRef = useRef<HTMLDivElement | null>(null);
  const lastIconRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function computeBounds() {
      if (!lineRef.current) return;
      const icons = Array.from(
        document.querySelectorAll<HTMLElement>(
          "#delivery-timeline-root [data-timeline-icon] .timeline-icon",
        ),
      );
      if (icons.length < 2) return;
      const first = icons[0];
      const last = icons[icons.length - 1];
      lastIconRef.current = last;
      const parent = lineRef.current.parentElement;
      if (!parent) return;
      const parentRect = parent.getBoundingClientRect();
      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();
      const top = firstRect.top + firstRect.height / 2 - parentRect.top;
      const bottom = lastRect.top + lastRect.height / 2 - parentRect.top;
      const height = bottom - top;
      lineRef.current.style.top = top + "px";
      lineRef.current.style.height = height + "px";
      // center horizontally to icon centers (icons aligned left with some padding -> use first icon center)
      const xCenter = firstRect.left + firstRect.width / 2 - parentRect.left;
      lineRef.current.style.left = xCenter + "px";
    }
    computeBounds();
    window.addEventListener("resize", computeBounds);
    return () => window.removeEventListener("resize", computeBounds);
  }, []);

  useEffect(() => {
    if (!lineRef.current || !pulseRef.current) return;
    const line = lineRef.current;
    const pulse = pulseRef.current;
    const tween = gsap.fromTo(
      pulse,
      { y: () => -pulse.offsetHeight },
      {
        y: () => line.offsetHeight,
        duration: 4,
        ease: "none",
        repeat: -1,
        onRepeat: () => {
          if (lastIconRef.current) {
            lastIconRef.current.classList.remove("delivery-icon-glow");
            void lastIconRef.current.offsetWidth;
            lastIconRef.current.classList.add("delivery-icon-glow");
          }
        },
      },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={lineRef} className="timeline-line-vertical pointer-events-none md:hidden" aria-hidden>
      <div ref={pulseRef} className="timeline-pulse-vertical" />
    </div>
  );
}
