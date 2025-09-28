import { StrapiImage } from "@/components/strapi-image";
import { Button } from "@/components/ui/button";
import type { HeroProps } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function Hero(data: Readonly<HeroProps>) {
  if (!data) return null;

  const { heading, text, buttonLink, image, image2 } = data;

  return (
    <>
      <section className="container mx-auto text-center relative flex flex-col justify-center items-center gap-10 md:pb-28 pb-20 pt-20 sm:gap-14 md:flex-row md:min-h-[92vh]">
        <div className="absolute -left-10 top-2/3 -translate-y-1/2 w-60 lg:w-72 aspect-[4/5] z-20">
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
            <StrapiImage
              src={image.url}
              alt={image.name || "Coffee preparation"}
              priority
              fill
              sizes="(max-width: 768px) 240px, 288px"
              className="object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-primary/20 [filter:blur(180px)]" />
          </div>
        </div>
        <div className="flex absolute z-30 flex-col justify-center items-center gap-8 md:gap-10 text-center">
          <h1 className="max-w-2xl text-center font-heading text-4xl font-semibold sm:text-5xl sm:leading-tight">
            {heading}
          </h1>
          <p className="text-muted-foreground max-w-md text-center text-lg">{text}</p>
          <div className="flex w-full max-w-md flex-wrap justify-center gap-4">
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
        <div className="absolute -right-20 top-1/3 -translate-y-1/2 w-60 lg:w-72 aspect-[4/5] z-20">
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
    </>
  );
}
