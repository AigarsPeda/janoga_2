"use client";
import { StrapiImage } from "@/components/strapi-image";
import { Button } from "@/components/ui/button";
import type { FeatureCardProps } from "@/types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useRef } from "react";
import { PartyPopper, TruckIcon, ChefHat, Settings } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_ICONS = [PartyPopper, TruckIcon, ChefHat, Settings];

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
      {items.map((item, index) => {
        const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];

        return (
          <div
            key={item.id}
            className="sticky-card mx-auto overflow-hidden relative h-[30rem] sm:h-[34rem] lg:h-[36rem] mb-10 rounded-3xl group"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          >
            <StrapiImage
              width={1100}
              height={720}
              src={item.image?.url || ""}
              alt={item.heading ?? "Feature image"}
              className="mx-auto h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Enhanced overlay for better readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Subtle accent gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 mix-blend-overlay" />

            <div className="absolute inset-0 flex items-end sm:items-center">
              <div className="m-5 sm:m-8 md:m-10 lg:m-12 max-w-xl">
                {/* Service Icon Badge */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-5">
                  <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>

                <h3
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4 drop-shadow-lg"
                  style={{ fontFamily: "'Lora', 'Georgia', serif" }}
                >
                  {item.heading}
                </h3>

                <p className="text-base sm:text-lg text-white/95 leading-relaxed mb-6 drop-shadow-md max-w-md font-light">
                  {item.description}
                </p>

                {item.buttonLink && (
                  <Button
                    asChild
                    size="sm"
                    variant={item.buttonLink.isPrimary ? "default" : "outline"}
                    className="cursor-pointer text-sm sm:text-base mt-2 py-5 px-7 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-lg font-semibold"
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

            {/* Decorative border */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
          </div>
        );
      })}
    </div>
  );
}
