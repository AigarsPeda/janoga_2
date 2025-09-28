import { StrapiImage } from "@/components/strapi-image";
import { Button } from "@/components/ui/button";
import type { HeroProps } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function Hero(data: Readonly<HeroProps>) {
  if (!data) return null;

  const { heading, text, buttonLink, image } = data;

  return (
    <>
      <section className="container relative flex flex-col items-center gap-10 md:pb-28 pb-20 pt-20 sm:gap-14 md:flex-row md:min-h-[90vh]">
        <div className="flex flex-1 flex-col items-center gap-8 md:items-start md:gap-10">
          <h1 className="max-w-2xl text-center font-heading text-4xl font-semibold sm:text-5xl sm:leading-tight md:text-left">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-md text-center text-lg md:text-left">{text}</p>
          <div className="flex w-full max-w-md flex-wrap justify-center gap-4 md:justify-start">
            {buttonLink &&
              buttonLink.map((link, i) => (
                <Button
                  key={`link-${i}-${link.text}`}
                  size="lg"
                  variant={link.isPrimary ? "default" : "outline"}
                  asChild
                  className="h-12 cursor-pointer border-border text-base sm:h-14 sm:px-10"
                >
                  <Link href={link.href} target={link.isExternal ? "_blank" : "_self"}>
                    {link.text}
                  </Link>
                </Button>
              ))}
          </div>
        </div>
        <div className="relative flex-1 w-full h-80 md:h-96 lg:h-[500px]">
          <StrapiImage
            src={image.url}
            alt={image.name || "Hero image"}
            priority
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            className="rounded-xl border border-border shadow-lg object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-primary/20 [filter:blur(180px)]" />
        </div>
      </section>
      <div className="relative">
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground/80">
          <ChevronDown className="h-8 w-8 animate-bounce" aria-hidden="true" />
          <span className="sr-only">Scroll down</span>
        </div>
      </div>
    </>
  );
}
