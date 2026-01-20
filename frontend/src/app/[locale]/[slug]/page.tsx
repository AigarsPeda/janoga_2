import type { Block } from "@/types";

import qs from "qs";
import { getStrapiURL } from "@/lib/utils";

import { Hero } from "@/components/hero";
import { CardGrid } from "@/components/card-grid";
import { SectionHeading } from "@/components/section-heading";
import ContentWithImage from "@/components/content-with-image";
import { steps } from "framer-motion";
import { Delivery } from "@/components/delivery";
import { notFound } from "next/navigation";
import Menu from "@/components/menu";
import { MenuInfo } from "@/components/menu-info";
import { Form } from "@/components/form";
import { MapComponent } from "@/components/map";
import { SideBySide } from "@/components/layout.side-by-side";
import { i18n, type Locale } from "../../../../i18n-config";

// Allow dynamic params not returned by generateStaticParams
export const dynamicParams = true;

interface StaticParamsProps {
  id: number;
  slug: string;
}

export async function generateStaticParams() {
  const { fetchData } = await import("@/lib/fetch");

  const path = "/api/pages";
  const baseUrl = getStrapiURL();

  const params: { locale: string; slug: string }[] = [];

  for (const locale of i18n.locales) {
    const url = new URL(path, baseUrl);
    url.search = qs.stringify({
      fields: ["slug"],
      locale: locale,
    });

    const pages = await fetchData(url.href);

    pages.data.forEach((page: Readonly<StaticParamsProps>) => {
      params.push({ locale, slug: page.slug });
    });
  }

  return params;
}

async function loader(slug: string, locale: string) {
  const { fetchData } = await import("@/lib/fetch");
  const path = "/api/pages";
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
              image2: {
                fields: ["url", "alternativeText", "name"],
              },
              buttonLink: {
                populate: "*",
              },
              // topLink: {
              //   populate: "*",
              // },
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
          "layout.feature-card": {
            populate: {
              items: {
                populate: "*",
              },
            },
          },
          "layout.delivery": {
            populate: {
              steps: {
                populate: "*",
              },
            },
          },
          "layout.menu": {
            populate: {
              days: {
                populate: {
                  item: {
                    populate: "*",
                  },
                },
              },
              buttonLink: {
                populate: "*",
              },
            },
          },
          "layout.menu-info": {
            populate: {
              items: {
                populate: "*",
              },
            },
          },
          "layout.form": {
            populate: "*",
          },
          "layout.map": {
            populate: "*",
          },
          "layout.side-by-side": {
            populate: {
              map: {
                populate: "*",
              },
              form: {
                populate: "*",
              },
            },
          },
        },
      },
    },
    filters: {
      slug: slug,
    },
    locale: locale,
  });

  const url = new URL(path, baseUrl);
  url.search = query;
  const data = await fetchData(url.href);
  return data;
}

function BlockRenderer(block: Block) {
  switch (block.__component) {
    case "layout.hero":
      return <Hero key={block.id} {...block} />;
    case "layout.card-grid":
      return <CardGrid key={block.id} {...block} />;
    case "layout.section-heading":
      return <SectionHeading key={block.id} {...block} />;
    case "layout.content-with-image":
      return <ContentWithImage key={block.id} {...block} />;
    case "layout.delivery":
      return <Delivery key={block.id} {...block} />;
    case "layout.menu":
      return <Menu key={block.id} {...block} />;
    case "layout.menu-info":
      return <MenuInfo key={block.id} {...block} />;
    case "layout.form":
      return <Form key={block.id} {...block} />;
    case "layout.map":
      return <MapComponent key={block.id} {...block} />;
    case "layout.side-by-side":
      return <SideBySide key={block.id} {...block} />;
    default:
      return null;
  }
}

export default async function PageBySlugRoute({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;

  if (!slug) notFound();

  const data = await loader(slug, locale);
  const pageEntry = data?.data?.[0];

  if (!pageEntry) notFound();

  const blocks = pageEntry?.blocks;

  if (!blocks || !Array.isArray(blocks)) return null;

  return <div>{blocks.map((block) => BlockRenderer(block))}</div>;
}
