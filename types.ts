
export type AssociationCategory = 'youth' | 'sports';

export interface Association {
  id: string;
  ownerId?: string; // ID of the user (President) who created it
  name: string;
  category: AssociationCategory;
  president: string;
  phone: string;
  email?: string;
  address: string;
  municipality: string;
  activityType: string;
  workingHours: string;
  foundedYear: number;
  logoUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  documents?: {
    name: string;
    url: string;
  }[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  imageUrl: string;
}

export type Language = 'ar' | 'fr';

export interface Translations {
  [key: string]: {
    ar: string;
    fr: string;
  };
}

export type Role = 'user' | 'president' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  associationId?: string; // For presidents
}
