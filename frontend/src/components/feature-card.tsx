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
      {items.map((item) => (
        <div key={item.id} className="sticky-card mx-auto overflow-hidden relative h-[32rem] mb-10">
          <StrapiImage
            width={900}
            height={600}
            src={item.image?.url || ""}
            alt={item.heading ?? "Feature image"}
            className="mx-auto h-full w-full object-cover rounded-xl"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 p-6 bg-gradient-to-r from-black/80 to-transparent rounded-xl max-w-xl">
            <h3 className="text-5xl font-bold tracking-tight text-white mb-10 text-left pt-10">
              {item.heading}
            </h3>
            <p className="text-xl text-gray-200 text-left">{item.description}</p>
            {item.buttonLink && (
              <Button
                asChild
                size="sm"
                variant={item.buttonLink.isPrimary ? "default" : "outline"}
                className="cursor-pointer border-border text-base mt-10 py-5 px-6"
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
      ))}
    </div>
  );
}
