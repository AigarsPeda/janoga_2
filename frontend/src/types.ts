type ComponentType =
  | "layout.map"
  | "layout.form"
  | "layout.hero"
  | "layout.menu"
  | "layout.delivery"
  | "layout.menu-info"
  | "layout.card-grid"
  | "layout.price-grid"
  | "layout.step-form"
  | "layout.side-by-side"
  | "layout.feature-card"
  | "layout.image-gallery"
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
  | StepFormProps
  | SideBySideProps
  | FeatureCardProps
  | CallToActionProps
  | ImageGalleryProps
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

export interface ImageGalleryProps extends Base<"layout.image-gallery"> {
  images: {
    name: string;
    image: {
      id: string;
      url: string;
      width: number;
      height: number;
    };
  }[];
}

export interface CalculatorChoice {
  id: number;
  name: string;
}

export interface MultiChoice {
  __component: "elements.multi-choice";
  id: number;
  question: string;
  choice?: CalculatorChoice[];
}

export interface Question {
  __component: "elements.question";
  id: number;
  question: string;
  inputType: "text" | "number";
  placeholder?: string;
}

export interface Checkbox {
  __component: "elements.checkbox";
  id: number;
  question: string;
  choice?: CalculatorChoice[];
}

export interface Slider {
  __component: "elements.slider";
  id: number;
  question: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface DatePicker {
  __component: "elements.date-picker";
  id: number;
  question: string;
  placeholder?: string;
}

export interface Textarea {
  __component: "elements.textarea";
  id: number;
  question: string;
  placeholder?: string;
  maxLength?: number;
}

export interface Email {
  __component: "elements.email";
  id: number;
  question: string;
  placeholder?: string;
}

export interface Phone {
  __component: "elements.phone";
  id: number;
  question: string;
  placeholder?: string;
}

export interface Dropdown {
  __component: "elements.dropdown";
  id: number;
  question: string;
  placeholder?: string;
  choice?: CalculatorChoice[];
}

export interface YesNo {
  __component: "elements.yes-no";
  id: number;
  question: string;
  yesLabel?: string;
  noLabel?: string;
}

export interface FileUpload {
  __component: "elements.file-upload";
  id: number;
  question: string;
  allowedTypes?: string;
  maxSize?: number;
}

export type CalculatorElement =
  | MultiChoice
  | Question
  | Checkbox
  | Slider
  | DatePicker
  | Textarea
  | Email
  | Phone
  | Dropdown
  | YesNo
  | FileUpload;

export interface FormStep {
  id: number;
  title: string;
  description?: string;
  element?: CalculatorElement[];
}

export interface StepFormProps extends Base<"layout.step-form"> {
  step?: FormStep[];
  backButtonLabel?: string;
  nextButtonLabel?: string;
  submitButtonLabel?: string;
  allowSkipSteps?: boolean;
}
