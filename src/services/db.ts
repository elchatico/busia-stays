import { Property, Location, Amenity, Host, Review, Enquiry, PropertyType, PropertyStatus, User, UserRole } from '../types';
import { PROPERTIES_DATA, LOCATIONS_DATA, AMENITIES_DATA, HOSTS_DATA, REVIEWS_DATA, ENQUIRIES_DATA } from '../data/seedData';

const STORAGE_KEYS = {
  PROPERTIES: 'busia_stays_properties_v3',
  LOCATIONS: 'busia_stays_locations_v3',
  AMENITIES: 'busia_stays_amenities_v3',
  HOSTS: 'busia_stays_hosts_v3',
  REVIEWS: 'busia_stays_reviews_v3',
  ENQUIRIES: 'busia_stays_enquiries_v3',
  CURRENT_USER: 'busia_stays_current_user_v3',
};

// Default current user
const DEFAULT_USER: User = {
  id: 'usr-admin-1',
  name: 'Grace Owuor',
  email: 'owuorgrace015@gmail.com',
  role: 'admin',
  phone: '+254712345678'
};

export class DatabaseService {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  // Initialize data if missing
  public init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
      this.setStorageItem(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
      this.setStorageItem(STORAGE_KEYS.LOCATIONS, LOCATIONS_DATA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AMENITIES)) {
      this.setStorageItem(STORAGE_KEYS.AMENITIES, AMENITIES_DATA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.HOSTS)) {
      this.setStorageItem(STORAGE_KEYS.HOSTS, HOSTS_DATA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      this.setStorageItem(STORAGE_KEYS.REVIEWS, REVIEWS_DATA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
      this.setStorageItem(STORAGE_KEYS.ENQUIRIES, ENQUIRIES_DATA);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      this.setStorageItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
    }
  }

  public resetToDefault(): void {
    this.setStorageItem(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    this.setStorageItem(STORAGE_KEYS.LOCATIONS, LOCATIONS_DATA);
    this.setStorageItem(STORAGE_KEYS.AMENITIES, AMENITIES_DATA);
    this.setStorageItem(STORAGE_KEYS.HOSTS, HOSTS_DATA);
    this.setStorageItem(STORAGE_KEYS.REVIEWS, REVIEWS_DATA);
    this.setStorageItem(STORAGE_KEYS.ENQUIRIES, ENQUIRIES_DATA);
    this.setStorageItem(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
  }

  // --- PROPERTIES ---
  public getProperties(options?: {
    locationId?: string;
    propertyType?: PropertyType | 'All';
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    bedrooms?: number;
    amenities?: string[];
    minRating?: number;
    searchTerm?: string;
    sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'rating';
    includePending?: boolean;
    featuredOnly?: boolean;
  }): Property[] {
    this.init();
    let props = this.getStorageItem<Property[]>(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);

    // Filter status
    if (!options?.includePending) {
      props = props.filter(p => p.status === 'active');
    }

    if (options?.featuredOnly) {
      props = props.filter(p => p.isFeatured);
    }

    if (options?.locationId && options.locationId !== 'all') {
      props = props.filter(p => p.locationId === options.locationId);
    }

    if (options?.propertyType && options.propertyType !== 'All') {
      props = props.filter(p => p.propertyType === options.propertyType);
    }

    if (options?.minPrice !== undefined) {
      props = props.filter(p => p.pricePerNight >= (options.minPrice || 0));
    }

    if (options?.maxPrice !== undefined && options.maxPrice > 0) {
      props = props.filter(p => p.pricePerNight <= options.maxPrice!);
    }

    if (options?.guests !== undefined && options.guests > 1) {
      props = props.filter(p => p.maxGuests >= options.guests!);
    }

    if (options?.bedrooms !== undefined && options.bedrooms > 0) {
      props = props.filter(p => p.bedrooms >= options.bedrooms!);
    }

    if (options?.amenities && options.amenities.length > 0) {
      props = props.filter(p =>
        options.amenities!.every(aId => p.amenityIds.includes(aId))
      );
    }

    if (options?.minRating !== undefined && options.minRating > 0) {
      props = props.filter(p => p.rating >= options.minRating!);
    }

    if (options?.searchTerm && options.searchTerm.trim() !== '') {
      const term = options.searchTerm.toLowerCase().trim();
      props = props.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.locationName.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.address.toLowerCase().includes(term)
      );
    }

    // Sorting
    const sort = options?.sortBy || 'recommended';
    props.sort((a, b) => {
      if (sort === 'price_asc') return a.pricePerNight - b.pricePerNight;
      if (sort === 'price_desc') return b.pricePerNight - a.pricePerNight;
      if (sort === 'rating') return b.rating - a.rating;
      // recommended: featured first, then rating
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return b.rating - a.rating;
    });

    return props;
  }

  public getPropertyBySlug(slug: string): Property | undefined {
    this.init();
    const props = this.getStorageItem<Property[]>(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    return props.find(p => p.slug === slug);
  }

  public getPropertyById(id: string): Property | undefined {
    this.init();
    const props = this.getStorageItem<Property[]>(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    return props.find(p => p.id === id);
  }

  public createProperty(property: Omit<Property, 'id' | 'slug' | 'createdAt' | 'rating' | 'reviewCount'>): Property {
    this.init();
    const props = this.getStorageItem<Property[]>(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    
    // Slug generator
    const slugBase = property.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const newProperty: Property = {
      ...property,
      id: `prop-${Date.now()}`,
      slug,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    props.unshift(newProperty);
    this.setStorageItem(STORAGE_KEYS.PROPERTIES, props);
    return newProperty;
  }

  public updateProperty(id: string, updates: Partial<Property>): Property | null {
    this.init();
    const props = this.getStorageItem<Property[]>(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    const index = props.findIndex(p => p.id === id);
    if (index === -1) return null;

    props[index] = { ...props[index], ...updates };
    this.setStorageItem(STORAGE_KEYS.PROPERTIES, props);
    return props[index];
  }

  public deleteProperty(id: string): boolean {
    this.init();
    let props = this.getStorageItem<Property[]>(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    const initialLen = props.length;
    props = props.filter(p => p.id !== id);
    if (props.length !== initialLen) {
      this.setStorageItem(STORAGE_KEYS.PROPERTIES, props);
      return true;
    }
    return false;
  }

  public toggleFeatureProperty(id: string): boolean {
    const prop = this.getPropertyById(id);
    if (!prop) return false;
    this.updateProperty(id, { isFeatured: !prop.isFeatured });
    return true;
  }

  public updatePropertyStatus(id: string, status: PropertyStatus): boolean {
    return !!this.updateProperty(id, { status });
  }

  // --- LOCATIONS & AMENITIES ---
  public getLocations(): Location[] {
    this.init();
    return this.getStorageItem<Location[]>(STORAGE_KEYS.LOCATIONS, LOCATIONS_DATA);
  }

  public getLocationById(id: string): Location | undefined {
    return this.getLocations().find(l => l.id === id);
  }

  public getAmenities(): Amenity[] {
    this.init();
    return this.getStorageItem<Amenity[]>(STORAGE_KEYS.AMENITIES, AMENITIES_DATA);
  }

  // --- HOSTS ---
  public getHosts(): Host[] {
    this.init();
    return this.getStorageItem<Host[]>(STORAGE_KEYS.HOSTS, HOSTS_DATA);
  }

  public getHostById(id: string): Host | undefined {
    return this.getHosts().find(h => h.id === id);
  }

  public createOrUpdateHost(hostData: Omit<Host, 'id' | 'joinedDate'>): Host {
    this.init();
    const hosts = this.getHosts();
    const existing = hosts.find(h => h.phone === hostData.phone || h.whatsapp === hostData.whatsapp);
    if (existing) {
      const updated = { ...existing, ...hostData };
      const idx = hosts.findIndex(h => h.id === existing.id);
      hosts[idx] = updated;
      this.setStorageItem(STORAGE_KEYS.HOSTS, hosts);
      return updated;
    }
    const newHost: Host = {
      ...hostData,
      id: `host-${Date.now()}`,
      joinedDate: `Joined ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    };
    hosts.push(newHost);
    this.setStorageItem(STORAGE_KEYS.HOSTS, hosts);
    return newHost;
  }

  // --- REVIEWS ---
  public getReviewsForProperty(propertyId: string): Review[] {
    this.init();
    const reviews = this.getStorageItem<Review[]>(STORAGE_KEYS.REVIEWS, REVIEWS_DATA);
    return reviews.filter(r => r.propertyId === propertyId);
  }

  public addReview(review: Omit<Review, 'id' | 'date'>): Review {
    this.init();
    const reviews = this.getStorageItem<Review[]>(STORAGE_KEYS.REVIEWS, REVIEWS_DATA);
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    reviews.unshift(newRev);
    this.setStorageItem(STORAGE_KEYS.REVIEWS, reviews);

    // Update property rating
    const propReviews = reviews.filter(r => r.propertyId === review.propertyId);
    const avgRating = propReviews.reduce((sum, r) => sum + r.rating, 0) / propReviews.length;
    this.updateProperty(review.propertyId, {
      rating: Number(avgRating.toFixed(2)),
      reviewCount: propReviews.length
    });

    return newRev;
  }

  // --- ENQUIRIES ---
  public getEnquiries(): Enquiry[] {
    this.init();
    return this.getStorageItem<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, ENQUIRIES_DATA);
  }

  public createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    this.init();
    const enquiries = this.getEnquiries();
    const newEnq: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    enquiries.unshift(newEnq);
    this.setStorageItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    return newEnq;
  }

  public updateEnquiryStatus(id: string, status: Enquiry['status']): boolean {
    this.init();
    const enquiries = this.getEnquiries();
    const idx = enquiries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    enquiries[idx].status = status;
    this.setStorageItem(STORAGE_KEYS.ENQUIRIES, enquiries);
    return true;
  }

  // --- AUTH / USER ---
  public getCurrentUser(): User {
    this.init();
    return this.getStorageItem<User>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
  }

  public setCurrentUserRole(role: UserRole): User {
    const user = this.getCurrentUser();
    const updated = { ...user, role };
    this.setStorageItem(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  }

  // --- STATS ---
  public getPlatformStats() {
    this.init();
    const allProps = this.getStorageItem<Property[]>(STORAGE_KEYS.PROPERTIES, PROPERTIES_DATA);
    const enquiries = this.getEnquiries();
    const hosts = this.getHosts();

    return {
      totalProperties: allProps.length,
      activeProperties: allProps.filter(p => p.status === 'active').length,
      pendingApprovals: allProps.filter(p => p.status === 'pending').length,
      totalEnquiries: enquiries.length,
      featuredProperties: allProps.filter(p => p.isFeatured && p.status === 'active').length,
      totalHosts: hosts.length
    };
  }

  // --- WHATSAPP URL GENERATOR ---
  public static generateWhatsAppUrl(
    whatsappNumber: string,
    propertyName: string,
    checkIn?: string,
    checkOut?: string,
    guests?: number
  ): { url: string; message: string } {
    // Sanitize number (remove + and leading zeros if needed)
    let cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('7') || cleanPhone.startsWith('1')) {
      cleanPhone = '254' + cleanPhone;
    }

    let message = `Hello, I found ${propertyName} on Busia Stays.`;
    if (checkIn && checkOut) {
      message += ` I'd like to enquire about staying from ${checkIn} to ${checkOut} for ${guests || 1} guest(s).`;
    } else {
      message += ` I'd like to enquire about availability and rates.`;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    return { url, message };
  }
}

export const db = new DatabaseService();
