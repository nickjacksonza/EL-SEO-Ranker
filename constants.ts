import type { PageData, SEOTask, SiteInfo, BrandSettings, SchemaMapping } from './types';

export const PLUGINS = [
  'Elementor (Pro)',
  'Rank Math SEO',
  'Site Kit by Google',
  'A booking plugin (e.g. BA Book Everything)',
  'An e-commerce plugin (e.g. WooCommerce)',
];

export const FONT_OPTIONS: BrandSettings['fonts']['body'][] = ["Roboto", "Open Sans", "Lato", "Montserrat"];

export const INITIAL_BRAND_SETTINGS: BrandSettings = {
  colors: {
    primary: '#003366', // Blue
    secondary: '#4CAF50', // Green
    accent: '#FF9800', // Highlight
    background: '#FFFFFF', // Light
    body: '#1A1A1A', // Dark
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Roboto',
  }
};

export const INITIAL_SITE_INFO: SiteInfo = {
  siteName: 'Dlala Tours',
  tagline: 'Explore the heart of the city with our expert guides.',
  address: '1 Lily Avenue, Berea, Johannesburg',
  phone: '+27670828168',
  email: 'info@dlalanje.org',
  socialProfiles: {
    facebook: 'https://facebook.com/dlalanje',
    instagram: 'https://instagram.com/dlalanje',
    twitter: 'https://twitter.com/dlalanje',
  },
};

const GLOBAL_SECTIONS = {
    header: {
        id: 'global-header',
        title: 'Global Header',
        description: 'Contains the site logo, primary navigation, and a call-to-action button.',
        elementorTip: 'Create this as a Header template in Elementor Theme Builder and set display conditions to "Entire Site".',
        reusable: true,
    },
    footer: {
        id: 'global-footer',
        title: 'Global Footer',
        description: 'Includes contact information, social media links, a simplified sitemap, and legal information (e.g., privacy policy).',
        elementorTip: 'Create this as a Footer template in Elementor Theme Builder and set display conditions to "Entire Site".',
        reusable: true,
    }
};

export const INITIAL_PAGES_DATA: PageData[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'The main landing page, designed to capture user interest, showcase the variety of tours, and drive conversions.',
    structure: [
      { id: 'home-hero', title: 'Hero Section', description: 'Full-width image or video background with a compelling headline and a primary call-to-action (CTA) to view tours.', elementorTip: 'Use a "Hero" widget or a section with a background and a Heading/Button widget.', reusable: false, h1: "Experience the City's Best Kept Secrets" },
      { id: 'home-tours-intro', title: 'Tour Categories Introduction', description: 'A brief overview of the main tour categories offered (e.g., Historical, Culinary, Adventure) with attractive visuals and links to each category.', elementorTip: 'Use an "Inner Section" with "Image Box" widgets for each category.', reusable: false, h2: 'Find Your Perfect Adventure', h3s: ['Historical Walks', 'Culinary Delights', 'Urban Adventures'] },
      { id: 'home-featured-tour', title: 'Featured Tour/Offer', description: 'Highlight a specific popular tour or a seasonal offer to create urgency and interest.', elementorTip: 'Use a two-column section with an image/video on one side and details/CTA on the other.', reusable: true, h2: 'Special Offer: The Twilight Ghost Tour' },
      { id: 'home-testimonials', title: 'Social Proof (Testimonials)', description: 'Display glowing reviews from happy customers to build trust.', elementorTip: 'Use the "Testimonial Carousel" widget.', reusable: true, h2: 'What Our Guests Are Saying' },
      { id: 'home-merch-cta', title: 'Merchandise CTA', description: 'A small, visually appealing section promoting merchandise.', elementorTip: 'Use a "Call to Action" widget.', reusable: true, h2: 'Take a Memory Home' },
    ],
    schemaInfo: [
      { title: 'LocalBusiness Schema', plugin: 'Rank Math SEO', description: 'Helps search engines understand your business type, address, opening hours, etc.', geminiPrompt: 'Generate a LocalBusiness JSON-LD schema for a tour company.', geminiModel: 'gemini-2.5-flash' },
      { title: 'FAQPage Schema', plugin: 'Rank Math SEO', description: 'If you have a FAQ section, this schema can make your questions and answers appear directly in search results.', geminiPrompt: 'Generate FAQPage JSON-LD schema with 3 relevant questions and answers for a city tour company.', geminiModel: 'gemini-2.5-flash' },
    ],
  },
  {
    id: 'about',
    title: 'About Us',
    description: 'Tell the story of the company, introduce the guides, and explain what makes your tours unique.',
    structure: [
      { id: 'about-hero', title: 'Hero Section', description: 'Engaging hero image of the team or a guide in action with the page title.', elementorTip: 'Use a standard section with a background image and a Heading widget.', reusable: false, h1: 'Our Story & Our Passion for This City' },
      { id: 'about-mission', title: 'Mission & Values', description: 'Explain the company\'s purpose and guiding principles.', elementorTip: 'Use a two-column layout with text and icons (using the Icon Box widget).', reusable: false, h2: 'Why We Do What We Do' },
      { id: 'about-team', title: 'Meet the Guides', description: 'Introduce the tour guides with photos and short bios to build a personal connection.', elementorTip: 'Use the "Team Member" widget or create a custom loop grid if you have many guides.', reusable: true, h2: 'Your Expert Guides' },
    ],
    schemaInfo: [
      { title: 'AboutPage Schema', plugin: 'Rank Math SEO', description: 'Clearly identifies the page as an "About Us" page for search engines.', geminiPrompt: 'Generate a basic AboutPage JSON-LD schema.', geminiModel: 'gemini-2.5-flash' }
    ],
  },
  {
    id: 'tours',
    title: 'Book Tours',
    description: 'The main page for booking. Displays all available tours, which can be filtered by category.',
    structure: [
      { id: 'tours-hero', title: 'Hero Section', description: 'A hero image that showcases a montage of tour experiences.', elementorTip: 'Standard section with a background and heading.', reusable: false, h1: 'Choose Your Next Unforgettable Experience' },
      { id: 'tours-grid', title: 'Tours Grid/List', description: 'The core of the page. Display all tours in a filterable grid. Each tour should have a featured image, title, short description, price, and a "Book Now" button.', elementorTip: 'Use the "Loop Grid" with a custom post type for "Tours". Use a plugin like FacetWP for filtering or Elementor Pro\'s taxonomy filter.', reusable: false, h2: 'Our Tours' },
    ],
    schemaInfo: [
      { title: 'Product Schema (for each tour)', plugin: 'A booking plugin (e.g., FareHarbor, Bokun)', description: 'Crucial for tours to be recognized as "products". Should include details like price, availability, and reviews. This is usually handled automatically by the booking/e-commerce plugin.', geminiPrompt: 'Generate a Product JSON-LD schema for a specific tour called "Historic Downtown Walking Tour" costing $45.', geminiModel: 'gemini-2.5-flash' }
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Provides multiple ways for customers to get in touch and shows the business location.',
    structure: [
      { id: 'contact-hero', title: 'Hero Section', description: 'Simple hero with the page title.', elementorTip: 'Standard section with a background and heading.', reusable: false, h1: 'Get In Touch' },
      { id: 'contact-form-map', title: 'Contact Form & Map', description: 'A two-column layout featuring a contact form on one side and an embedded Google Map on the other.', elementorTip: 'Use the "Form" widget and the "Google Maps" widget.', reusable: false, h2: 'Send Us a Message' },
      { id: 'contact-details', title: 'Contact Details', description: 'Display address, phone number, and email clearly.', elementorTip: 'Use "Icon List" widgets for a clean presentation.', reusable: true, h2: 'Other Ways to Reach Us' },
    ],
    schemaInfo: [
      { title: 'ContactPage Schema', plugin: 'Rank Math SEO', description: 'Identifies the page purpose to search engines.', geminiPrompt: 'Generate a basic ContactPage JSON-LD schema.', geminiModel: 'gemini-2.5-flash' }
    ],
  },
  // System Pages
  {
    id: 'globals',
    title: 'Global Elements',
    description: 'Define sitewide elements like the header and footer that appear on every page.',
    structure: [GLOBAL_SECTIONS.header, GLOBAL_SECTIONS.footer],
    schemaInfo: [],
  },
  {
    id: 'plugin-docs',
    title: 'Plugin Documentation',
    description: 'A central place to store documentation and notes for your installed plugins. This context is used by the Gemini AI tool.',
    structure: [],
    schemaInfo: [],
  },
  {
    id: 'schema-mapper',
    title: 'Schema Mapper',
    description: 'Plan and visualize your website\'s schema markup strategy.',
    structure: [],
    schemaInfo: [],
  }
];

export const SEO_TASKS: Record<string, SEOTask[]> = {
  globals: [
    { id: 'g1', text: 'Set up Global Site Title and Tagline in WordPress', isCompleted: false },
    { id: 'g2', text: 'Configure Rank Math SEO initial setup wizard', isCompleted: false },
    { id: 'g3', text: 'Connect Google Analytics and Google Search Console via Rank Math', isCompleted: false },
    { id: 'g4', text: 'Create and submit an XML sitemap via Rank Math', isCompleted: false },
    { id: 'g5', text: 'Set up Local SEO details in Rank Math', isCompleted: false },
  ],
  home: [
    { id: 'h1', text: 'Define Meta Title and Description for the Home Page', isCompleted: false },
    { id: 'h2', text: 'Set a Focus Keyword for the Home Page', isCompleted: false },
    { id: 'h3', text: 'Ensure Home Page H1 is unique and compelling', isCompleted: false },
    { id: 'h4', text: 'Add internal links from Home Page to key tour pages', isCompleted: false },
    { id: 'h5', text: 'Compress all images used on the Home Page', isCompleted: false },
  ],
  about: [
    { id: 'a1', text: 'Define Meta Title and Description for the About Page', isCompleted: false },
    { id: 'a2', text: 'Set a Focus Keyword for the About Page', isCompleted: false },
    { id: 'a3', text: 'Add alt text to all team member images', isCompleted: false },
    { id: 'a4', text: 'Link to the Contact page from the About page', isCompleted: false },
  ],
  tours: [
    { id: 't1', text: 'Define Meta Title and Description for the main Tours Page', isCompleted: false },
    { id: 't2', text: 'Set a Focus Keyword for the main Tours Page', isCompleted: false },
    { id: 't3', text: 'Ensure all tour "products" have unique, descriptive names', isCompleted: false },
    { id: 't4', text: 'Write compelling short descriptions for each tour in the grid view', isCompleted: false },
    { id: 't5', text: 'Ensure booking/e-commerce plugin is correctly generating Product schema', isCompleted: false },
  ],
  contact: [
    { id: 'c1', text: 'Define Meta Title and Description for the Contact Page', isCompleted: false },
    { id: 'c2', text: 'Ensure the address on the page matches the LocalBusiness schema', isCompleted: false },
    { id: 'c3', text: 'Test the contact form to ensure it sends emails correctly', isCompleted: false },
    { id: 'c4', text: 'Embed a Google Map with the correct business location pinned', isCompleted: false },
  ],
};

export const INITIAL_SCHEMA_MAPPINGS: SchemaMapping[] = [
  // --- GLOBAL ---
  {
    id: 'sm-1',
    pageId: 'all',
    schemaType: 'WebSite',
    description: 'Identifies the website and enables site-level features like the Sitelinks Search Box.',
    isEnabled: true,
    properties: [
      { id: 'sm-1-p1', key: '@type', value: 'WebSite', description: 'Schema type.' },
      { id: 'sm-1-p2', key: 'name', value: INITIAL_SITE_INFO.siteName, description: 'The name of the website.' },
      { id: 'sm-1-p3', key: 'url', value: 'https://www.your-domain.com', description: 'The canonical URL of the website.' },
      { id: 'sm-1-p4', key: 'potentialAction', value: '{"@type": "SearchAction", "target": "https://www.your-domain.com/search?q={search_term_string}", "query-input": "required name=search_term_string"}', description: 'Defines the site search functionality.' },
    ],
  },
  {
    id: 'sm-2',
    pageId: 'all',
    schemaType: 'Organization',
    description: 'Describes the organization that owns the website (your business).',
    isEnabled: true,
    properties: [
        { id: 'sm-2-p1', key: '@type', value: 'Organization', description: 'Schema type.' },
        { id: 'sm-2-p2', key: 'name', value: INITIAL_SITE_INFO.siteName, description: 'The name of the organization.' },
        { id: 'sm-2-p3', key: 'url', value: 'https://www.your-domain.com', description: 'The official URL of the organization.' },
        { id: 'sm-2-p4', key: 'logo', value: 'https://www.your-domain.com/logo.png', description: 'URL of the organization\'s logo.' },
        { id: 'sm-2-p5', key: 'sameAs', value: `[ "${INITIAL_SITE_INFO.socialProfiles.facebook}", "${INITIAL_SITE_INFO.socialProfiles.instagram}", "${INITIAL_SITE_INFO.socialProfiles.twitter}" ]`, description: 'Links to social media profiles.' },
    ]
  },
  {
    id: 'sm-7',
    pageId: 'all',
    schemaType: 'Organization (NGO)',
    description: 'Describes a Non-Governmental Organization, useful if the business has a fundraising or non-profit arm.',
    isEnabled: false,
    properties: [
        { id: 'sm-7-p1', key: '@type', value: 'NGO', description: 'Schema type.' },
        { id: 'sm-7-p2', key: 'name', value: 'Your Foundation Name', description: 'The name of the NGO.' },
        { id: 'sm-7-p3', key: 'url', value: 'https://www.your-foundation.org', description: 'The official URL of the NGO.' },
        { id: 'sm-7-p4', key: 'logo', value: 'https://www.your-foundation.org/logo.png', description: 'URL of the NGO\'s logo.' },
        { id: 'sm-7-p5', key: 'sameAs', value: `[]`, description: 'Links to social media profiles.' },
        { id: 'sm-7-p6', key: 'description', value: 'Description of the NGO\'s mission and fundraising goals.', description: 'A brief description of the NGO.' },
    ]
  },
  // --- HOME PAGE ---
  {
    id: 'sm-3',
    pageId: 'home',
    schemaType: 'LocalBusiness',
    description: 'Provides rich details about a physical business, which can appear in Google Search and Maps.',
    isEnabled: true,
    properties: [
      { id: 'sm-3-p1', key: '@type', value: 'TouristInformationCenter', description: 'Specific type of local business.' },
      { id: 'sm-3-p2', key: 'name', value: INITIAL_SITE_INFO.siteName, description: 'Business name.' },
      { id: 'sm-3-p3', key: 'address', value: `{"@type": "PostalAddress", "streetAddress": "${INITIAL_SITE_INFO.address}", "addressLocality": "Johannesburg", "addressRegion": "GP", "postalCode": "2198", "addressCountry": "ZA"}`, description: 'Business address.' },
      { id: 'sm-3-p4', key: 'telephone', value: INITIAL_SITE_INFO.phone, description: 'Business phone number.' },
      { id: 'sm-3-p5', key: 'email', value: INITIAL_SITE_INFO.email, description: 'Business email address.' },
    ],
  },
    {
    id: 'sm-8',
    pageId: 'home',
    schemaType: 'Product (Merchandise)',
    description: 'Schema for a physical product, like merchandise. Often handled automatically by WooCommerce.',
    isEnabled: true,
    properties: [
      { id: 'sm-8-p1', key: '@type', value: 'Product', description: 'Schema type.' },
      { id: 'sm-8-p2', key: 'name', value: 'Official Tour T-Shirt', description: 'Name of the product.' },
      { id: 'sm-8-p3', key: 'image', value: 'https://www.your-domain.com/tshirt.jpg', description: 'URL of a photo of the product.' },
      { id: 'sm-8-p4', key: 'description', value: 'High-quality cotton t-shirt with our company logo.', description: 'A brief description of the product.' },
      { id: 'sm-8-p5', key: 'sku', value: 'DLALA-TSHIRT-01', description: 'Stock Keeping Unit (product ID).'},
      { id: 'sm-8-p6', key: 'brand', value: '{"@type": "Brand", "name": "Dlala Tours"}', description: 'The brand of the product.'},
      { id: 'sm-8-p7', key: 'offers', value: '{"@type": "Offer", "url": "https://www.your-domain.com/product/tshirt", "priceCurrency": "USD", "price": "25.00", "availability": "https://schema.org/InStock", "seller": {"@type": "Organization", "name": "Dlala Tours"}}', description: 'Offer to provide the product.' },
    ]
  },
  // --- ABOUT PAGE ---
  {
    id: 'sm-6',
    pageId: 'about',
    schemaType: 'Person',
    description: 'Schema for an individual, such as a team member or tour guide. Useful for highlighting key people.',
    isEnabled: true,
    properties: [
      { id: 'sm-6-p1', key: '@type', value: 'Person', description: 'Schema type.' },
      { id: 'sm-6-p2', key: 'name', value: 'Guide Name', description: 'Name of the person.' },
      { id: 'sm-6-p3', key: 'jobTitle', value: 'Lead Tour Guide', description: 'The person\'s job title.' },
      { id: 'sm-6-p4', key: 'image', value: 'https://www.your-domain.com/guide-photo.jpg', description: 'URL of a photo of the person.' },
      { id: 'sm-6-p5', key: 'description', value: 'A short bio about the person.', description: 'A brief description of the person.' },
    ]
  },
  // --- TOURS PAGE ---
  {
    id: 'sm-4',
    pageId: 'tours',
    schemaType: 'CollectionPage',
    description: 'A page that lists a collection of other items, in this case, the tours. Often managed by the booking plugin.',
    isEnabled: true,
    properties: [
       { id: 'sm-4-p1', key: '@type', value: 'CollectionPage', description: 'Schema type.' },
       { id: 'sm-4-p2', key: 'name', value: 'Our Tours', description: 'The name of the collection page.' },
       { id: 'sm-4-p3', key: 'description', value: 'Browse our collection of curated city tours.', description: 'A short description of the collection.' },
       { id: 'sm-4-p4', key: 'mainEntity', value: '{"@type": "ItemList", "itemListElement": []}', description: 'A list of items. Usually populated dynamically by your booking/e-commerce plugin.' },
    ]
  },
  // --- CONTACT PAGE ---
  {
    id: 'sm-5',
    pageId: 'contact',
    schemaType: 'ContactPage',
    description: 'Indicates that the page is a contact page.',
    isEnabled: true,
    properties: [
      { id: 'sm-5-p1', key: '@type', value: 'ContactPage', description: 'Schema type.' },
    ]
  },
];
