export type PropertyType = 'Apartment' | 'Airbnb' | 'Hotel' | 'Guesthouse' | 'Furnished' | 'Villa';

export type PropertyStatus = 'active' | 'pending' | 'rejected';

export interface Location {
  id: string;
  name: string;
  slug: string;
  description: string;
  landmark: string;
  distanceToBorder: string;
  popularFor: string;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'essentials' | 'comfort' | 'safety' | 'outdoor';
  icon: string;
}

export interface Host {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  responseTime: string;
  joinedDate: string;
  isVerified: boolean;
  avatarUrl?: string;
  bio?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  guestName: string;
  guestLocation: string;
  rating: number;
  date: string;
  comment: string;
  stayType: string;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  propertyType: PropertyType;
  locationId: string;
  locationName: string;
  address: string;
  pricePerNight: number; // in KES
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  description: string;
  amenityIds: string[];
  houseRules: string[];
  sleepingArrangement: string;
  hostId: string;
  isFeatured: boolean;
  isVerified: boolean;
  status: PropertyStatus;
  primaryImage: string;
  additionalImages: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'booked' | 'archived';
  whatsappSent?: boolean;
}

export type UserRole = 'guest' | 'host' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}
