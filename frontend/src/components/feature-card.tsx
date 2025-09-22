import { StrapiImage } from "@/components/strapi-image";
import { FeatureCardProps } from "@/types";
import Link from "next/link";
import { Button } from "./ui/button";

export function FeatureCard({ items }: Readonly<FeatureCardProps>) {
  return (
    <div className="w-full h-full container">
      {items.map((item) => (
        <div key={item.id} className="mx-auto overflow-hidden relative">
          <StrapiImage
            width={900}
            height={600}
            src={item.image?.url || ""}
            alt={item.heading ?? "Feature image"}
            className="mx-auto h-full w-full object-cover rounded-xl"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 p-6 bg-gradient-to-r from-black/80 to-transparent rounded-xl max-w-2xl">
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
