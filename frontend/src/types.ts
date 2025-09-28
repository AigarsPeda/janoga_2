type ComponentType =
  | "layout.map"
  | "layout.form"
  | "layout.hero"
  | "layout.menu"
  | "layout.delivery"
  | "layout.menu-info"
  | "layout.card-grid"
  | "layout.price-grid"
  | "layout.side-by-side"
  | "layout.feature-card"
  | "layout.call-to-action"
  | "layout.client-carousel"
  | "layout.section-heading"
  | "layout.content-with-image";

interface Base<T extends ComponentType, D extends {} = {}> {
  __component: T;
  id: string; // is this correct?
  createdAt: string;
  updatedAt: string;
  data: D;
}

export interface NavLink {
  href: string;
  text: string;
  isPrimary: boolean;
  isExternal: boolean;
}

export type Block =
  | FormProps
  | HeroProps
  | MenuProps
  | MyMapProps
  | MenuInfoProps
  | DeliveryProps
  | CardGridProps
  | PriceGridProps
  | SideBySideProps
  | FeatureCardProps
  | CallToActionProps
  | ClientCarouselProps
  | SectionHeadingProps
  | ContentWithImageProps;

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
  text: string;
  heading: string;
  buttonLink?: NavLink[];
  image: {
    url: string;
    name: string;
    alternativeText: string | null;
  };
  image2: {
    url: string;
    name: string;
    alternativeText: string | null;
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

export interface CallToActionProps extends Base<"layout.call-to-action"> {
  id: string;
  heading: string;
  buttonLink: NavLink;
}

export interface Step {
  id: string;
  icon: string;
  description: string;
}

export interface DeliveryProps extends Base<"layout.delivery"> {
  steps: Step[];
}

export type DishKind = "Soup" | "Main" | "Dessert" | "Side dish" | "Salad" | string;

export interface MenuItem {
  id: string;
  description: string;
  price: string | number;
  kind: DishKind;
}

export interface MenuDay {
  id: string;
  heading: string;
  item: MenuItem[];
}

export interface MenuProps extends Base<"layout.menu"> {
  days: MenuDay[];
  buttonLink?: NavLink;
}

export interface MenuInfoProps extends Base<"layout.menu-info"> {
  items: {
    id: string;
    price: string | number;
    items: {
      id: string;
      description: string;
      kind: DishKind;
    };
  }[];
}

export type Field = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  isRequired: boolean;
};

export interface FormProps extends Base<"layout.form"> {
  submitButton: NavLink;
  recipientEmail: string;
  fields: Field[];
}

export interface MyMapProps extends Base<"layout.map"> {
  address: string;
}

export interface SideBySideProps extends Base<"layout.side-by-side"> {
  map: { id: string; address: string };
  form: { id: string; recipientEmail: string; fields: Field[]; submitButton: NavLink };
}
