// Fix: Define all necessary types for the application.
export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  body: string;
}

export interface BrandFonts {
  heading: "Roboto" | "Open Sans" | "Lato" | "Montserrat";
  body: "Roboto" | "Open Sans" | "Lato" | "Montserrat";
}

export interface BrandSettings {
  colors: BrandColors;
  fonts: BrandFonts;
}


export interface SiteInfo {
  siteName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  socialProfiles: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface PageStructureSection {
  id: string;
  title: string;
  description: string;
  elementorTip: string;
  reusable: boolean;
  h1?: string; // H1 for hero section
  h2?: string; // H2 for standard sections
  h3s?: string[]; // H3s for standard sections
}

export interface SchemaInfo {
  title: string;
  plugin: string;
  description: string;
  geminiPrompt: string;
  geminiModel: 'gemini-2.5-pro' | 'gemini-2.5-flash';
}

export interface PageData {
  id: string;
  title: string;
  description: string;
  structure: PageStructureSection[];
  schemaInfo: SchemaInfo[];
}

export interface SEOTask {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface SchemaProperty {
  id: string;
  key: string;
  value: string;
  description: string;
}

export interface SchemaMapping {
  id: string;
  pageId: string; // 'all' for global, or a page id
  schemaType: string;
  description: string;
  isEnabled: boolean;
  properties: SchemaProperty[];
}
