import { StepForm } from "@/components/step-form";
import { CardGrid } from "@/components/card-grid";
import ContentWithImage from "@/components/content-with-image";
import { Delivery } from "@/components/delivery";
import { Form } from "@/components/form";
import { Hero } from "@/components/hero";
import { SideBySide } from "@/components/layout.side-by-side";
import { MapComponent } from "@/components/map";
import Menu from "@/components/menu";
import { MenuInfo } from "@/components/menu-info";
import { SectionHeading } from "@/components/section-heading";
import { getStrapiURL } from "@/lib/utils";
import type { Block } from "@/types";
import { notFound } from "next/navigation";
import qs from "qs";
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

// Shared populate config for pages
const pagePopulate = {
  blocks: {
    on: {
      "layout.hero": {
        populate: {
          image: { fields: ["url", "alternativeText", "name"] },
          image2: { fields: ["url", "alternativeText", "name"] },
          buttonLink: { populate: "*" },
        },
      },
      "layout.card-grid": { populate: "*" },
      "layout.section-heading": { populate: "*" },
      "layout.content-with-image": {
        populate: { image: { fields: ["url", "alternativeText", "name"] } },
      },
      "layout.feature-card": { populate: { items: { populate: "*" } } },
      "layout.delivery": { populate: { steps: { populate: "*" } } },
      "layout.menu": {
        populate: {
          days: { populate: { item: { populate: "*" } } },
          buttonLink: { populate: "*" },
        },
      },
      "layout.menu-info": { populate: { items: { populate: "*" } } },
      "layout.form": { populate: "*" },
      "layout.map": { populate: "*" },
      "layout.side-by-side": {
        populate: { map: { populate: "*" }, form: { populate: "*" } },
      },
      "layout.step-form": {
        populate: {
          step: {
            populate: {
              element: {
                on: {
                  "elements.multi-choice": {
                    populate: { choice: { populate: "*" } },
                  },
                  "elements.question": {
                    populate: "*",
                  },
                  "elements.checkbox": {
                    populate: { choice: { populate: "*" } },
                  },
                  "elements.slider": {
                    populate: "*",
                  },
                  "elements.date-picker": {
                    populate: "*",
                  },
                  "elements.textarea": {
                    populate: "*",
                  },
                  "elements.email": {
                    populate: "*",
                  },
                  "elements.phone": {
                    populate: "*",
                  },
                  "elements.dropdown": {
                    populate: { choice: { populate: "*" } },
                  },
                  "elements.yes-no": {
                    populate: "*",
                  },
                  "elements.file-upload": {
                    populate: "*",
                  },
                  "elements.contact": {
                    populate: { field: { populate: "*" } },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

async function loader(slug: string, locale: string) {
  const { fetchData } = await import("@/lib/fetch");
  const path = "/api/pages";
  const baseUrl = getStrapiURL();

  const query = qs.stringify({
    populate: pagePopulate,
    filters: { slug: slug },
    locale: locale,
  });

  const url = new URL(path, baseUrl);
  url.search = query;
  const data = await fetchData(url.href);

  // Fallback to default locale if no page found
  if ((!data?.data || data.data.length === 0) && locale !== i18n.defaultLocale) {
    const fallbackQuery = qs.stringify({
      populate: pagePopulate,
      filters: { slug: slug },
      locale: i18n.defaultLocale,
    });
    const fallbackUrl = new URL(path, baseUrl);
    fallbackUrl.search = fallbackQuery;
    return await fetchData(fallbackUrl.href);
  }

  return data;
}

function BlockRenderer(block: Block, locale?: string) {
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
    case "layout.step-form":
      return <StepForm key={block.id} {...block} locale={locale} />;
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

  return <div>{blocks.map((block) => BlockRenderer(block, locale))}</div>;
}
