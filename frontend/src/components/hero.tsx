"use client";
import { StrapiImage } from "@/components/strapi-image";
import { Button } from "@/components/ui/button";
import type { HeroProps } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  // Initial entrance animation: images fade/slide in, then text elements stagger
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;
    const contentWrapper = contentRef.current;
    const decor = decorRef.current;
    if (!contentWrapper) return;

    const images = [leftImage, rightImage].filter(Boolean) as HTMLDivElement[];
    const contentElements: Element[] = Array.from(
      contentWrapper.querySelectorAll("h1, p, a, button, .hero-stagger"),
    );

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Animate decorative gradient
      if (decor) {
        gsap.set(decor, { scale: 0.8, opacity: 0 });
        tl.to(
          decor,
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          0,
        );
      }

      // Image animation configuration
      const imageFadeDuration = 0.8;
      const imageStagger = 0.2;
      const imagesTotal = images.length
        ? imageFadeDuration + imageStagger * (images.length - 1)
        : 0;
      const midPoint = imagesTotal / 2;

      if (images.length) {
        const rotations = images.map((img, idx) => (idx === 1 ? 6 : -6));
        gsap.set(images, { y: 60, rotation: 0, scale: 0.9 });
        images.forEach((img, idx) => {
          tl.to(
            img,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: rotations[idx],
              duration: imageFadeDuration,
              ease: "power3.out",
              onComplete: () => img.classList.remove("opacity-0"),
            },
            idx * imageStagger,
          );
        });
      }

      tl.to(
        contentWrapper,
        {
          opacity: 1,
          duration: 0.01,
          onComplete: () => contentWrapper.classList.remove("opacity-0"),
        },
        images.length ? Math.max(midPoint - 0.08, 0) : 0,
      );

      if (contentElements.length) {
        tl.from(
          contentElements,
          {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.08,
            clearProps: "opacity,transform",
          },
          images.length ? midPoint : 0.05,
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;
    const section = sectionRef.current;

    if (!leftImage || !rightImage || !section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(leftImage, { yPercent: -15, ease: "none" }, 0);
    tl.to(rightImage, { yPercent: 15, ease: "none" }, 0);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-[95svh] flex flex-col justify-center items-center overflow-hidden"
      >
        {/* Background gradient decoration */}
        <div
          ref={decorRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-2xl" />
        </div>

        {/* Main container */}
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[65svh] py-12 md:py-16 pb-24">
            {/* Left image */}
            <div
              ref={leftImageRef}
              className="hidden lg:flex lg:col-span-3 justify-center lg:justify-end opacity-0 will-change-transform"
              data-hero-image
            >
              <div className="relative w-52 xl:w-64 aspect-[3/4] group">
                {/* Glow effect behind image */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <StrapiImage
                    src={image.url}
                    alt={image.name || "Hero image"}
                    priority
                    fill
                    sizes="(max-width: 1024px) 208px, 256px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
                </div>
              </div>
            </div>

            <div
              ref={contentRef}
              className="lg:col-span-6 flex flex-col justify-center items-center text-center gap-6 sm:gap-8 opacity-0"
            >
              <h1 className="max-w-2xl font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text">
                  {heading}
                </span>
              </h1>

              <p className="max-w-lg text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
                {text}
              </p>

              <div className="flex flex-col sm:flex-row w-full max-w-md justify-center gap-3 sm:gap-4 pt-2">
                {buttonLink &&
                  buttonLink.map((link, i) => (
                    <Button
                      key={`link-${i}-${link.text}`}
                      size="lg"
                      variant={link.isPrimary ? "default" : "outline"}
                      asChild
                      className={`h-12 sm:h-14 cursor-pointer text-base font-medium px-8 sm:px-10 rounded-full transition-all duration-300 ${
                        link.isPrimary
                          ? "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Link href={link.href} target={link.isExternal ? "_blank" : "_self"}>
                        {link.text}
                      </Link>
                    </Button>
                  ))}
              </div>
            </div>

            {/* Right image */}
            <div
              ref={rightImageRef}
              className="hidden lg:flex lg:col-span-3 justify-center lg:justify-start opacity-0 will-change-transform"
              data-hero-image
            >
              <div className="relative w-52 xl:w-64 aspect-[3/4] group -mt-20">
                {/* Glow effect behind image */}
                <div className="absolute -inset-4 bg-gradient-to-tl from-primary/30 to-primary/10 rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  <StrapiImage
                    src={image2.url}
                    alt={image2.name || "Hero image"}
                    priority
                    fill
                    sizes="(max-width: 1024px) 208px, 256px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile images - show as overlapping cards */}
        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-16 top-20 w-32 h-40 rounded-xl overflow-hidden opacity-20 rotate-[-12deg]">
            <StrapiImage src={image.url} alt="" fill className="object-cover" />
          </div>
          <div className="absolute -right-16 bottom-32 w-32 h-40 rounded-xl overflow-hidden opacity-20 rotate-[12deg]">
            <StrapiImage src={image2.url} alt="" fill className="object-cover" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Uzzināt vairāk
          </span>
          <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </div>
      </section>
    </>
  );
}
