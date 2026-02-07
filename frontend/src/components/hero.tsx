"use client";

import { StrapiImage } from "@/components/strapi-image";
import { Button } from "@/components/ui/button";
import type { HeroProps } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero(data: Readonly<HeroProps>) {
  if (!data) return null;

  const { heading, text, buttonLink, image, image2 } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const accentImageRef = useRef<HTMLDivElement>(null);

  const handleScrollToNextDiv = () => {
    const section = sectionRef.current;
    if (section) {
      const nextDiv = section.nextElementSibling;
      if (nextDiv) {
        const offsetTop = nextDiv.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const content = contentRef.current;
    const mainImage = mainImageRef.current;
    const accentImage = accentImageRef.current;

    if (!content) return;

    const contentElements: Element[] = Array.from(
      content.querySelectorAll("h1, .hero-rule, p, a, button, .hero-stagger"),
    );

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (mainImage) {
        gsap.set(mainImage, { y: 24 });
        tl.to(
          mainImage,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            onComplete: () => mainImage.classList.remove("opacity-0"),
          },
          0,
        );
      }

      tl.to(
        content,
        {
          opacity: 1,
          duration: 0.01,
          onComplete: () => content.classList.remove("opacity-0"),
        },
        0.25,
      );

      if (contentElements.length) {
        tl.from(
          contentElements,
          {
            opacity: 0,
            y: 20,
            duration: 0.55,
            stagger: 0.09,
            clearProps: "opacity,transform",
          },
          0.3,
        );
      }

      if (accentImage) {
        gsap.set(accentImage, { y: 16 });
        tl.to(
          accentImage,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            onComplete: () => accentImage.classList.remove("opacity-0"),
          },
          0.5,
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mainImage = mainImageRef.current;
    const accentImage = accentImageRef.current;
    const section = sectionRef.current;

    if (!mainImage || !section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(mainImage, { yPercent: -6, ease: "none" }, 0);

    if (accentImage) {
      tl.to(accentImage, { yPercent: 10, ease: "none" }, 0);
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[95svh] flex flex-col justify-center overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10 md:pb-24">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-12 items-center pt-1 pb-16 md:py-20 lg:py-0">
          {/* Text content */}
          <div ref={contentRef} className="flex flex-col gap-5 opacity-0 order-2 lg:order-1">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-foreground">
              {heading}
            </h1>

            <div className="hero-rule w-10 h-[3px] rounded-full bg-primary" />

            <p className="max-w-md text-muted-foreground text-base sm:text-lg leading-relaxed">
              {text}
            </p>

            {buttonLink && buttonLink.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1">
                {buttonLink.map((link, i) => (
                  <Button
                    key={`link-${i}-${link.text}`}
                    size="lg"
                    variant={link.isPrimary ? "default" : "outline"}
                    asChild
                    className={`h-12 cursor-pointer text-base font-medium px-8 rounded-xl transition-colors duration-200 ${
                      link.isPrimary ? "" : "hover:bg-muted/60"
                    }`}
                  >
                    <Link href={link.href} target={link.isExternal ? "_blank" : "_self"}>
                      {link.text}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="relative order-1 lg:order-2 pb-10 lg:pb-0">
            <div
              ref={mainImageRef}
              className="relative w-full max-w-[560px] mx-auto aspect-[4/3] sm:aspect-[3/2] sm:max-w-none rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-white/10 will-change-transform opacity-0"
            >
              <StrapiImage
                src={image.url}
                alt={image.alternativeText || image.name || "Hero image"}
                priority
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
            </div>

            <div
              ref={accentImageRef}
              className="absolute -bottom-6 left-2 sm:-bottom-8 sm:-left-4 lg:-left-6 w-28 sm:w-36 lg:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl ring-[3px] ring-background/80 will-change-transform opacity-0"
            >
              <StrapiImage
                src={image2.url}
                alt={image2.alternativeText || image2.name || "Hero image"}
                priority
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown
          className="w-5 h-5 text-muted-foreground animate-bounce cursor-pointer"
          onClick={handleScrollToNextDiv}
        />
      </div>
    </section>
  );
}
