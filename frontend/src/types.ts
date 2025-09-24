type ComponentType =
  | "layout.hero"
  | "layout.card-grid"
  | "layout.section-heading"
  | "layout.content-with-image"
  | "layout.price-grid"
  | "layout.feature-card"
  | "layout.client-carousel";

interface Base<T extends ComponentType, D extends {} = {}> {
  __component: T;
  id: string;
  createdAt: string;
  updatedAt: string;
  data: D;
}

export interface NavLink {
  href: string;
  text: string;
  isExternal: boolean;
  isPrimary: boolean;
}

export type Block =
  | HeroProps
  | CardGridProps
  | SectionHeadingProps
  | ContentWithImageProps
  | PriceGridProps
  | FeatureCardProps
  | ClientCarouselProps;

export interface FeatureCardProps extends Base<"layout.feature-card"> {
  items: {
    id: string;
    icon: string;
    heading: string;
    description: string;
    image?: {
      url: string;
      name: string;
    };
    buttonLink?: NavLink;
  }[];
}

export interface HeroProps extends Base<"layout.hero"> {
  heading: string;
  text: string;
  // topLink?: NavLink;
  buttonLink?: NavLink[];
  image: {
    url: string;
    alternativeText: string | null;
    name: string;
  };
}

export interface CardGridProps extends Base<"layout.card-grid"> {
  cardItems: {
    id: string;
    heading: string;
    text: string;
    icon: string;
  }[];
}

export interface SectionHeadingProps extends Base<"layout.section-heading"> {
  heading: string;
  subHeading: string;
  text: string;
  centered?: boolean;
}

export interface ContentWithImageProps extends Base<"layout.content-with-image"> {
  reverse: boolean;
  image: {
    url: string;
    name: string;
  };
  heading: string;
  subHeading: string;
  text: string;
}

export interface PriceGridProps extends Base<"layout.price-grid"> {
  priceCard: {
    id: string;
    price: string;
    heading: string;
    selected: boolean;
    description: string;
    feature: {
      id: string;
      description: string;
    }[];
    link?: NavLink;
  }[];
}

export interface Client {
  id: string;
  href: string;
  isExternal: boolean;
  image: {
    url: string;
    alternativeText: string | null;
    name: string;
  };
}

export interface ClientCarouselProps extends Base<"layout.client-carousel"> {
  clients: Client[];
}
