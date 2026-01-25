import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    heading: Schema.Attribute.String;
    icon: Schema.Attribute.Enumeration<
      ['Frame', 'Download', 'Globe', 'Sparkles', 'LayoutPanelLeft', 'Palette']
    >;
    text: Schema.Attribute.Text;
  };
}

export interface ElementsCheckbox extends Struct.ComponentSchema {
  collectionName: 'components_elements_checkboxes';
  info: {
    displayName: 'Checkbox';
  };
  attributes: {
    choice: Schema.Attribute.Component<'elements.choice', true>;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsChoice extends Struct.ComponentSchema {
  collectionName: 'components_elements_choices';
  info: {
    displayName: 'Choice';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsDatePicker extends Struct.ComponentSchema {
  collectionName: 'components_elements_date_pickers';
  info: {
    displayName: 'DatePicker';
  };
  attributes: {
    placeholder: Schema.Attribute.String;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsDropdown extends Struct.ComponentSchema {
  collectionName: 'components_elements_dropdowns';
  info: {
    displayName: 'Dropdown';
  };
  attributes: {
    choice: Schema.Attribute.Component<'elements.choice', true>;
    placeholder: Schema.Attribute.String;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsEmail extends Struct.ComponentSchema {
  collectionName: 'components_elements_emails';
  info: {
    displayName: 'Email';
  };
  attributes: {
    placeholder: Schema.Attribute.String;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsFeature extends Struct.ComponentSchema {
  collectionName: 'components_elements_features';
  info: {
    displayName: 'Feature';
  };
  attributes: {
    buttonLink: Schema.Attribute.Component<'elements.link', false>;
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files'>;
  };
}

export interface ElementsField extends Struct.ComponentSchema {
  collectionName: 'components_elements_fields';
  info: {
    displayName: 'Field';
  };
  attributes: {
    isRequired: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['string', 'number', 'e-mail', 'textField']
    >;
  };
}

export interface ElementsFileUpload extends Struct.ComponentSchema {
  collectionName: 'components_elements_file_uploads';
  info: {
    displayName: 'FileUpload';
  };
  attributes: {
    allowedTypes: Schema.Attribute.String;
    maxSize: Schema.Attribute.Integer;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsFormStep extends Struct.ComponentSchema {
  collectionName: 'components_elements_form_steps';
  info: {
    displayName: 'FormStep';
  };
  attributes: {
    description: Schema.Attribute.Text;
    element: Schema.Attribute.DynamicZone<
      [
        'elements.multi-choice',
        'elements.question',
        'elements.checkbox',
        'elements.slider',
        'elements.date-picker',
        'elements.textarea',
        'elements.email',
        'elements.phone',
        'elements.dropdown',
        'elements.yes-no',
        'elements.file-upload',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsImage extends Struct.ComponentSchema {
  collectionName: 'components_elements_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String;
  };
}

export interface ElementsInfoItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_info_items';
  info: {
    displayName: 'Info item';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.menu-info', true>;
    price: Schema.Attribute.String;
  };
}

export interface ElementsItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_items';
  info: {
    displayName: 'Item';
  };
  attributes: {
    description: Schema.Attribute.String;
    kind: Schema.Attribute.Enumeration<
      ['Soup', 'Main', 'Dessert', 'Side dish', 'Salad', 'Drink']
    >;
    price: Schema.Attribute.Decimal;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_elements_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface ElementsLogo extends Struct.ComponentSchema {
  collectionName: 'components_elements_logos';
  info: {
    displayName: 'Logo';
  };
  attributes: {
    href: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface ElementsMenuInfo extends Struct.ComponentSchema {
  collectionName: 'components_elements_menu_infos';
  info: {
    displayName: 'Info';
  };
  attributes: {
    description: Schema.Attribute.String;
    kind: Schema.Attribute.Enumeration<
      ['Soup', 'Main', 'Dessert', 'Side dish', 'Salad', 'Drink']
    >;
  };
}

export interface ElementsMultiChoice extends Struct.ComponentSchema {
  collectionName: 'components_elements_multi_choices';
  info: {
    displayName: 'MultiChoice';
  };
  attributes: {
    choice: Schema.Attribute.Component<'elements.choice', true>;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsPhone extends Struct.ComponentSchema {
  collectionName: 'components_elements_phones';
  info: {
    displayName: 'Phone';
  };
  attributes: {
    placeholder: Schema.Attribute.String;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsPriceCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_price_cards';
  info: {
    description: '';
    displayName: 'Price Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    feature: Schema.Attribute.Component<'elements.feature', true>;
    heading: Schema.Attribute.String;
    link: Schema.Attribute.Component<'elements.link', false>;
    price: Schema.Attribute.String;
    selected: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ElementsQuestion extends Struct.ComponentSchema {
  collectionName: 'components_elements_questions';
  info: {
    displayName: 'Question';
  };
  attributes: {
    inputType: Schema.Attribute.Enumeration<['text', 'number']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
    placeholder: Schema.Attribute.String;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsSlider extends Struct.ComponentSchema {
  collectionName: 'components_elements_sliders';
  info: {
    displayName: 'Slider';
  };
  attributes: {
    max: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<100>;
    min: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    question: Schema.Attribute.String & Schema.Attribute.Required;
    step: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    unit: Schema.Attribute.String;
  };
}

export interface ElementsStep extends Struct.ComponentSchema {
  collectionName: 'components_elements_steps';
  info: {
    displayName: 'Icon with description';
  };
  attributes: {
    description: Schema.Attribute.String;
    icon: Schema.Attribute.Enumeration<
      ['phone', 'truck', 'money', 'dish', 'menu']
    >;
  };
}

export interface ElementsTextarea extends Struct.ComponentSchema {
  collectionName: 'components_elements_textareas';
  info: {
    displayName: 'Textarea';
  };
  attributes: {
    maxLength: Schema.Attribute.Integer;
    placeholder: Schema.Attribute.String;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsYesNo extends Struct.ComponentSchema {
  collectionName: 'components_elements_yes_nos';
  info: {
    displayName: 'YesNo';
  };
  attributes: {
    noLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'No'>;
    question: Schema.Attribute.String & Schema.Attribute.Required;
    yesLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Yes'>;
  };
}

export interface LayoutCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_layout_call_to_actions';
  info: {
    displayName: 'Call to action';
  };
  attributes: {
    buttonLink: Schema.Attribute.Component<'elements.link', false>;
    heading: Schema.Attribute.String;
  };
}

export interface LayoutCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_layout_card_grids';
  info: {
    description: '';
    displayName: 'Card Grid';
  };
  attributes: {
    cardItems: Schema.Attribute.Component<'elements.card', true>;
  };
}

export interface LayoutClientCarousel extends Struct.ComponentSchema {
  collectionName: 'components_layout_client_carousels';
  info: {
    displayName: 'Client Carousel';
  };
  attributes: {
    clients: Schema.Attribute.Component<'elements.logo', true>;
  };
}

export interface LayoutContentWithImage extends Struct.ComponentSchema {
  collectionName: 'components_layout_content_with_images';
  info: {
    displayName: 'Content With Image';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    reverse: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subHeading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutDay extends Struct.ComponentSchema {
  collectionName: 'components_layout_days';
  info: {
    displayName: 'Day';
  };
  attributes: {
    heading: Schema.Attribute.String;
    item: Schema.Attribute.Component<'elements.item', true>;
  };
}

export interface LayoutDelivery extends Struct.ComponentSchema {
  collectionName: 'components_layout_deliveries';
  info: {
    displayName: 'Delivery';
  };
  attributes: {
    steps: Schema.Attribute.Component<'elements.step', true>;
  };
}

export interface LayoutFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_layout_feature_cards';
  info: {
    displayName: 'FeatureCard';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.feature', true>;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    socialLinks: Schema.Attribute.Component<'elements.link', true>;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutForm extends Struct.ComponentSchema {
  collectionName: 'components_layout_forms';
  info: {
    displayName: 'Form';
  };
  attributes: {
    fields: Schema.Attribute.Component<'elements.field', true>;
    recipientEmail: Schema.Attribute.String;
    submitButton: Schema.Attribute.Component<'elements.link', false>;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    description: '';
    displayName: 'Hero';
  };
  attributes: {
    buttonLink: Schema.Attribute.Component<'elements.link', true>;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image2: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutImageGallery extends Struct.ComponentSchema {
  collectionName: 'components_layout_image_galleries';
  info: {
    displayName: 'Image Gallery';
  };
  attributes: {
    images: Schema.Attribute.Component<'elements.image', true>;
  };
}

export interface LayoutMap extends Struct.ComponentSchema {
  collectionName: 'components_layout_maps';
  info: {
    displayName: 'Map';
  };
  attributes: {
    address: Schema.Attribute.String;
  };
}

export interface LayoutMenu extends Struct.ComponentSchema {
  collectionName: 'components_layout_menus';
  info: {
    displayName: 'Menu';
  };
  attributes: {
    buttonLink: Schema.Attribute.Component<'elements.link', false>;
    days: Schema.Attribute.Component<'layout.day', true>;
  };
}

export interface LayoutMenuInfo extends Struct.ComponentSchema {
  collectionName: 'components_layout_menu_infos';
  info: {
    displayName: 'Menu Info';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.info-item', true>;
  };
}

export interface LayoutPriceGrid extends Struct.ComponentSchema {
  collectionName: 'components_layout_price_grids';
  info: {
    displayName: 'Price Grid';
  };
  attributes: {
    priceCard: Schema.Attribute.Component<'elements.price-card', true>;
  };
}

export interface LayoutSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_layout_section_headings';
  info: {
    displayName: 'Section Heading';
  };
  attributes: {
    heading: Schema.Attribute.Text;
    subHeading: Schema.Attribute.String;
    text: Schema.Attribute.Text;
  };
}

export interface LayoutSideBySide extends Struct.ComponentSchema {
  collectionName: 'components_layout_side_by_sides';
  info: {
    displayName: 'Side by side';
  };
  attributes: {
    form: Schema.Attribute.Component<'layout.form', false>;
    map: Schema.Attribute.Component<'layout.map', false>;
  };
}

export interface LayoutStepForm extends Struct.ComponentSchema {
  collectionName: 'components_layout_step_forms';
  info: {
    displayName: 'StepForm';
  };
  attributes: {
    step: Schema.Attribute.Component<'elements.form-step', true>;
  };
}

export interface LayoutTopNav extends Struct.ComponentSchema {
  collectionName: 'components_layout_top_navs';
  info: {
    description: '';
    displayName: 'Top Nav';
  };
  attributes: {
    cta: Schema.Attribute.Component<'elements.link', false>;
    logo: Schema.Attribute.Media<'images' | 'files'>;
    logoText: Schema.Attribute.String;
    navItems: Schema.Attribute.Component<'elements.link', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.card': ElementsCard;
      'elements.checkbox': ElementsCheckbox;
      'elements.choice': ElementsChoice;
      'elements.date-picker': ElementsDatePicker;
      'elements.dropdown': ElementsDropdown;
      'elements.email': ElementsEmail;
      'elements.feature': ElementsFeature;
      'elements.field': ElementsField;
      'elements.file-upload': ElementsFileUpload;
      'elements.form-step': ElementsFormStep;
      'elements.image': ElementsImage;
      'elements.info-item': ElementsInfoItem;
      'elements.item': ElementsItem;
      'elements.link': ElementsLink;
      'elements.logo': ElementsLogo;
      'elements.menu-info': ElementsMenuInfo;
      'elements.multi-choice': ElementsMultiChoice;
      'elements.phone': ElementsPhone;
      'elements.price-card': ElementsPriceCard;
      'elements.question': ElementsQuestion;
      'elements.slider': ElementsSlider;
      'elements.step': ElementsStep;
      'elements.textarea': ElementsTextarea;
      'elements.yes-no': ElementsYesNo;
      'layout.call-to-action': LayoutCallToAction;
      'layout.card-grid': LayoutCardGrid;
      'layout.client-carousel': LayoutClientCarousel;
      'layout.content-with-image': LayoutContentWithImage;
      'layout.day': LayoutDay;
      'layout.delivery': LayoutDelivery;
      'layout.feature-card': LayoutFeatureCard;
      'layout.footer': LayoutFooter;
      'layout.form': LayoutForm;
      'layout.hero': LayoutHero;
      'layout.image-gallery': LayoutImageGallery;
      'layout.map': LayoutMap;
      'layout.menu': LayoutMenu;
      'layout.menu-info': LayoutMenuInfo;
      'layout.price-grid': LayoutPriceGrid;
      'layout.section-heading': LayoutSectionHeading;
      'layout.side-by-side': LayoutSideBySide;
      'layout.step-form': LayoutStepForm;
      'layout.top-nav': LayoutTopNav;
    }
  }
}
