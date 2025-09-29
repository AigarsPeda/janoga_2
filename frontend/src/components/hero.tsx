"use client";
import { StrapiImage } from "@/components/strapi-image";
import { Button } from "@/components/ui/button";
import type { HeroProps } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero(data: Readonly<HeroProps>) {
  if (!data) return null;

  const { heading, text, buttonLink, image, image2 } = data;

  // Refs for parallax elements
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;
    const section = sectionRef.current;

    if (!leftImage || !rightImage || !section) return;

    // Create parallax animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Left image moves slower (parallax effect)
    tl.to(
      leftImage,
      {
        yPercent: -20,
        ease: "none",
      },
      0,
    );

    // Right image moves in opposite direction
    tl.to(
      rightImage,
      {
        yPercent: 20,
        ease: "none",
      },
      0,
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="container mx-auto text-center relative flex flex-col justify-center items-center gap-10 md:pb-28 pb-20 md:pt-32 pt-10 sm:gap-14 md:flex-row md:min-h-[89vh] isolate"
      >
        {/* Left image - hidden on mobile */}
        <div
          ref={leftImageRef}
          className="hidden md:block absolute -left-5 top-[55%] -translate-y-1/2 w-60 lg:w-72 aspect-[4/5] z-20"
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
            <StrapiImage
              src={image.url}
              alt={image.name || "Coffee preparation"}
              priority
              fill
              sizes="240px, 288px"
              className="object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-primary/20 [filter:blur(180px)]" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 text-center z-30 px-4 md:px-0 md:absolute mix-blend-difference text-white transition-colors duration-300">
          <h1 className="max-w-4xl text-center font-heading text-5xl sm:text-7xl md:text-7xl font-semibold leading-tight will-change-auto">
            {heading}
          </h1>
          <p className="max-w-sm sm:max-w-md text-center text-base sm:text-lg opacity-90">{text}</p>
          <div className="flex w-full max-w-sm sm:max-w-md flex-wrap justify-center gap-3 sm:gap-4">
            {buttonLink &&
              buttonLink.map((link, i) => (
                <Button
                  key={`link-${i}-${link.text}`}
                  size="lg"
                  variant={link.isPrimary ? "default" : "outline"}
                  asChild
                  className="h-11 sm:h-12 md:h-14 cursor-pointer border-border text-sm sm:text-base px-6 sm:px-8 md:px-10 mix-blend-normal"
                >
                  <Link href={link.href} target={link.isExternal ? "_blank" : "_self"}>
                    {link.text}
                  </Link>
                </Button>
              ))}
          </div>
        </div>

        {/* Right image - hidden on mobile */}
        <div
          ref={rightImageRef}
          className="hidden md:block absolute -right-15 top-[10%] -translate-y-1/2 w-60 lg:w-72 aspect-[4/5] z-20"
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
            <StrapiImage
              src={image2.url}
              alt={image2.name || "Hero image"}
              priority
              fill
              sizes="(max-width: 768px) 240px, 288px"
              className="rounded-xl border border-border shadow-lg object-cover"
            />
            <div className="absolute inset-0 z-50 bg-primary/20 [filter:blur(180px)]" />
          </div>
        </div>
      </section>

      {/* Animated ChevronDown at bottom */}
      <div className="flex justify-center pb-6 sm:pb-8">
        <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground animate-bounce" />
      </div>
    </>
  );
}
