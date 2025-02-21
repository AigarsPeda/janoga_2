import type { Block } from "@/types";

import qs from "qs";
import { getStrapiURL } from "@/lib/utils";

import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import ContentWithImage from "@/components/content-with-image";
import { Pricing } from "@/components/pricing";
import { CardCarousel } from "@/components/card-carousel";

async function loader() {
  const { fetchData } = await import("@/lib/fetch");
  const path = "/api/landing-page";
  const baseUrl = getStrapiURL();

  const query = qs.stringify({
    populate: {
      blocks: {
        on: {
          "layout.hero": {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
              buttonLink: {
                populate: "*",
              },
              topLink: {
                populate: "*",
              },
            },
          },
          "layout.card-grid": {
            populate: "*",
          },
          "layout.section-heading": {
            populate: "*",
          },
          "layout.content-with-image": {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
            },
          },
          "layout.price-grid": {
            populate: {
              priceCard: {
                populate: "*",
              },
            },
          },
        },
      },
    },
  });

  const url = new URL(path, baseUrl);
  url.search = query;
  const data = await fetchData(url.href);
  return data;
}

function BlockRenderer(block: Block, index: number) {
  console.dir(block.__component, { depth: null });
  // console.dir(block, { depth: null });
  console.log(block, "Block Component");
  switch (block.__component) {
    case "layout.hero":
      return <Hero key={index} {...block} />;
    case "layout.card-grid":
      return <CardCarousel key={index} {...block} />;
    case "layout.section-heading":
      return <SectionHeading key={index} {...block} />;
    case "layout.content-with-image":
      return <ContentWithImage key={index} {...block} />;
    case "layout.price-grid":
      return <Pricing key={index} {...block} />;
    default:
      return null;
  }
}

export default async function Home() {
  const data = await loader();
  const blocks = data?.data?.blocks;

  if (!blocks) return null;

  return (
    <div>
      {blocks ? blocks.map((block: Block, index: number) => BlockRenderer(block, index)) : null}
    </div>
  );
}
