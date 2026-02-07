"use client";
import { StrapiImage } from "@/components/strapi-image";
import { Button } from "@/components/ui/button";
import type { FeatureCardProps } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function FeatureCard({ items }: Readonly<FeatureCardProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const container = containerRef.current;

      if (!container) return;

      const stickyCards = container.querySelectorAll<HTMLElement>(".sticky-card");
      const triggers: ScrollTrigger[] = [];

      stickyCards.forEach((card, index) => {
        if (index < stickyCards.length - 1) {
          const trigger = ScrollTrigger.create({
            trigger: card,
            start: "top 10%",
            endTrigger: stickyCards[stickyCards.length - 1],
            end: "top 10%",
            pin: true,
            pinSpacing: false,
          });
          triggers.push(trigger);
        }

        if (index < stickyCards.length - 1) {
          const trigger2 = ScrollTrigger.create({
            trigger: stickyCards[index + 1],
            start: "top 45%",
            end: "bottom 45%",
            onUpdate: (self) => {
              const progress = self.progress;
              const scale = 1 - progress * 0.35;
              const rotate = (index % 2 === 0 ? -1 : 1) * progress * 5;
              const afterOpacity = progress;

              gsap.to(card, {
                scale,
                rotate,
                opacity: 1 - afterOpacity,
                transformOrigin: "center center",
                ease: "power1.out",
                duration: 0.3,
              });
            },
          });
          triggers.push(trigger2);
        }
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef },
  );

  return (
    <div className="w-full h-full container sticky-cards" ref={containerRef}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="sticky-card mx-auto overflow-hidden relative h-[30rem] sm:h-[34rem] lg:h-[36rem] mb-10 rounded-3xl"
        >
          <StrapiImage
            width={1100}
            height={720}
            src={item.image?.url || ""}
            alt={item.heading ?? "Feature image"}
            className="mx-auto h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />

          <div className="absolute inset-0 flex items-end sm:items-center">
            <div className="m-5 sm:m-8 md:m-10 max-w-xl p-6 sm:p-8">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4">
                {item.heading}
              </h3>
              <p className="text-base sm:text-lg text-white/85 leading-relaxed">
                {item.description}
              </p>
              {item.buttonLink && (
                <Button
                  asChild
                  size="sm"
                  variant={item.buttonLink.isPrimary ? "default" : "outline"}
                  className="cursor-pointer border-border text-sm sm:text-base mt-6 sm:mt-8 py-5 px-6"
                >
                  <Link
                    href={item.buttonLink.href}
                    target={item.buttonLink.isExternal ? "_blank" : "_self"}
                  >
                    {item.buttonLink.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
