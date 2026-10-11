import { Property, Location, Amenity, Host, Review, Enquiry } from '../types';

export const LOCATIONS_DATA: Location[] = [
  {
    id: 'loc-cbd',
    name: 'Busia CBD / Kisumu Rd',
    slug: 'busia-cbd',
    description: 'The commercial heart of Busia with banking halls, supermarkets (Khetia & Frankmatt), and quick highway access.',
    landmark: 'Near The Breeze Hotel, Khetia Supermarket & Frankmatt',
    distanceToBorder: '1.5 km from One-Stop Border Post',
    popularFor: 'Business travelers, short official visits, shopping & dining'
  },
  {
    id: 'loc-border',
    name: 'Busia Town / Border Post',
    slug: 'busia-border',
    description: 'Central Busia Town located just 2 kilometers from the 24/7 Kenya-Uganda border crossing.',
    landmark: '2 km from Customs Road & Uganda Border Crossing',
    distanceToBorder: '2.0 km from Border Gate',
    popularFor: 'Cross-border logistics, regional trade, transit stays'
  },
  {
    id: 'loc-korinda',
    name: 'Korinda',
    slug: 'korinda',
    description: 'Tranquil and secure residential neighborhood just outside the CBD known for modern private stays.',
    landmark: 'Near Korinda Junction & Police Station',
    distanceToBorder: '3.2 km from Border Post',
    popularFor: 'Executives, cozy short-stays, quiet compound parking'
  },
  {
    id: 'loc-matayos',
    name: 'Matayos',
    slug: 'matayos',
    description: 'Peaceful green suburb along the Busia-Kisumu highway offering quiet homes and privacy.',
    landmark: 'Matayos Market Area',
    distanceToBorder: '6.5 km from Border Post',
    popularFor: 'Family retreats, long-term stays, serene environments'
  },
  {
    id: 'loc-nambale',
    name: 'Nambale',
    slug: 'nambale',
    description: 'Bustling town center in the Western agricultural belt with authentic local warmth.',
    landmark: 'Nambale Urban Centre',
    distanceToBorder: '14 km from Border Post',
    popularFor: 'Agricultural specialists, project teams, family visits'
  },
  {
    id: 'loc-alupe',
    name: 'Alupe',
    slug: 'alupe',
    description: 'Home to Alupe University and research institutions, offering tranquil lodging.',
    landmark: 'Near Alupe University',
    distanceToBorder: '8.0 km from Border Post',
    popularFor: 'Researchers, medical professionals, tranquil retreats'
  }
];

export const AMENITIES_DATA: Amenity[] = [
  { id: 'wifi', name: 'High-Speed Wi-Fi', category: 'essentials', icon: 'Wifi' },
  { id: 'parking', name: 'Ample Secure Parking', category: 'essentials', icon: 'Car' },
  { id: 'kitchen', name: 'Fully Equipped Kitchen', category: 'comfort', icon: 'Utensils' },
  { id: 'backup_gen', name: 'Backup Power / Generator', category: 'essentials', icon: 'Zap' },
  { id: 'hot_shower', name: 'Instant Hot Shower', category: 'comfort', icon: 'ShowerHead' },
  { id: 'dstv_netflix', name: 'Smart TV with DSTV & Netflix', category: 'comfort', icon: 'Tv' },
  { id: 'security', name: '24-Hour Security Guard', category: 'safety', icon: 'ShieldCheck' },
  { id: 'perimeter_wall', name: 'Private Gated Perimeter Wall', category: 'safety', icon: 'ShieldCheck' },
  { id: 'gazebo', name: 'Outdoor Garden Gazebo', category: 'outdoor', icon: 'Trees' },
  { id: 'balcony', name: 'Private Balcony', category: 'outdoor', icon: 'Sun' },
  { id: 'workspace', name: 'Dedicated Work Desk', category: 'comfort', icon: 'Briefcase' },
  { id: 'compound', name: 'Private Compound', category: 'outdoor', icon: 'Trees' }
];

export const HOSTS_DATA: Host[] = [
  {
    id: 'host-ricone',
    name: 'Ricone Homes Management',
    phone: '0722880416',
    whatsapp: '254722880416',
    responseTime: 'Replies within 10 mins',
    joinedDate: 'Verified Host',
    isVerified: true,
    bio: 'Professional hospitality management for Ricone Homes bungalow and suites along Kisumu-Busia Road.'
  },
  {
    id: 'host-mehomes',
    name: 'MeHomes Host',
    phone: '+254712345678',
    whatsapp: '254712345678',
    responseTime: 'Replies within 15 mins',
    joinedDate: 'Verified Host',
    isVerified: true,
    bio: 'Dedicated host providing clean, accessible 1-bedroom apartments near Breeze Hotel and Busia highway.'
  },
  {
    id: 'host-yunia',
    name: 'Yunia Residences Host',
    phone: '+254722987654',
    whatsapp: '254722987654',
    responseTime: 'Replies within 20 mins',
    joinedDate: 'Verified Host',
    isVerified: true,
    bio: 'Providing tranquil, secure serviced apartments in Busia Town, 2km from the border.'
  },
  {
    id: 'host-vatrak',
    name: 'Vatrak Homes Host',
    phone: '+254733456789',
    whatsapp: '254733456789',
    responseTime: 'Replies within 15 mins',
    joinedDate: 'Verified Host',
    isVerified: true,
    bio: 'Welcoming travelers to our warm, cozy home away from home in Korinda, Busia.'
  }
];

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'prop-ricone',
    slug: 'ricone-homes-luxurious-4bedroom-bungalow',
    title: 'Ricone Homes · Luxurious 4-Bedroom Bungalow',
    propertyType: 'Villa',
    locationId: 'loc-cbd',
    locationName: 'Busia CBD / Kisumu Rd',
    address: 'Kisumu - Busia Road, Busia Town',
    pricePerNight: 7500,
    maxGuests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3,
    description: 'Ricone Homes is a luxurious 4-bedroom bungalow offering an executive stay in Busia. The home can be flexibly booked as 2, 3, or all 4 bedrooms to suit your party size.\n\nKey features include 3 en-suite bathrooms, a private compound with a secure perimeter wall and 24-hour security guard, fast Wi-Fi, Netflix, DSTV, a fully equipped modern kitchen, instant hot shower, and a private garden gazebo for outdoor relaxation.',
    amenityIds: ['wifi', 'dstv_netflix', 'kitchen', 'hot_shower', 'compound', 'security', 'perimeter_wall', 'gazebo', 'parking'],
    houseRules: [
      'Flexible booking: Can be booked as 2, 3, or 4 bedrooms',
      'Check-in: From 12:00 PM',
      'Check-out: By 11:00 AM',
      'Private compound: Parties or events allowed upon host agreement',
      'Government ID required at check-in'
    ],
    sleepingArrangement: '4 Spacious Bedrooms (3 En-Suite) with King & Queen Beds · Bookable as 2, 3, or 4 bedrooms',
    hostId: 'host-ricone',
    isFeatured: true,
    isVerified: true,
    status: 'active',
    primaryImage: '/src/assets/images/ricone_homes_bungalow_1791712666866.jpg',
    additionalImages: [
      '/src/assets/images/hero_busia_villa_1791403460678.jpg',
      '/src/assets/images/busia_executive_suite_1791403472206.jpg'
    ],
    rating: 4.96,
    reviewCount: 38,
    createdAt: '2024-03-01T10:00:00Z'
  },
  {
    id: 'prop-mehomes',
    slug: 'mehomes-1-bedroom-apartment-busia',
    title: 'MeHomes 1-Bedroom Apartment · Near Breeze Hotel',
    propertyType: 'Apartment',
    locationId: 'loc-cbd',
    locationName: 'Busia CBD / Kisumu Rd',
    address: 'About 300m off Highway, near The Breeze Hotel, Busia',
    pricePerNight: 3000,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: 'MeHomes is a modern 1-bedroom apartment situated about 300 meters from the highway, near The Breeze Hotel in Busia.\n\nConveniently located within a 3-to-5-minute drive to Khetia Supermarket, Frankmatt Supermarket, and the Busia CBD/border crossing. Offers high-speed Wi-Fi, a fully equipped kitchenette, secure parking, and family- and business-friendly access for guests visiting Busia.',
    amenityIds: ['wifi', 'parking', 'kitchen', 'hot_shower', 'security', 'workspace'],
    houseRules: [
      'Check-in: From 12:00 PM',
      'Check-out: By 10:30 AM',
      'Family- and business-friendly environment',
      'Quiet hours after 10:00 PM'
    ],
    sleepingArrangement: '1 Queen Bed with crisp cotton linens and bedside lighting',
    hostId: 'host-mehomes',
    isFeatured: true,
    isVerified: true,
    status: 'active',
    primaryImage: '/src/assets/images/mehomes_apartment_busia_1791712678579.jpg',
    additionalImages: [
      '/src/assets/images/busia_korinda_apartment_1791403501833.jpg',
      '/src/assets/images/busia_executive_suite_1791403472206.jpg'
    ],
    rating: 4.88,
    reviewCount: 26,
    createdAt: '2024-02-15T09:30:00Z'
  },
  {
    id: 'prop-yunia',
    slug: 'yunia-residences-1-busia-town',
    title: 'Yunia Residences 1 · 2km to Busia Border',
    propertyType: 'Apartment',
    locationId: 'loc-border',
    locationName: 'Busia Town / Border Post',
    address: 'Busia Town, 2 km from the Kenya-Uganda Border',
    pricePerNight: 4200,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    description: 'Yunia Residences 1 offers a serene and comfortable serviced apartment stay in Busia Town, situated just 2 kilometers from the Busia border.\n\nEnjoy a peaceful atmosphere, ample secure parking on site, 24-hour security personnel, and high-speed Wi-Fi. Features a bright living room, private balcony with green views, and a fully equipped kitchen suitable for both short stays and extended visits.',
    amenityIds: ['wifi', 'parking', 'security', 'balcony', 'kitchen', 'hot_shower', 'dstv_netflix'],
    houseRules: [
      'Check-in: 1:00 PM – 9:00 PM',
      'Check-out: 11:00 AM',
      '24-hour guarded security entrance',
      'No loud noise past 10:30 PM'
    ],
    sleepingArrangement: 'Master Bedroom: Queen Bed | Bedroom 2: Queen Bed',
    hostId: 'host-yunia',
    isFeatured: true,
    isVerified: true,
    status: 'active',
    primaryImage: '/src/assets/images/yunia_residences_busia_1791712688288.jpg',
    additionalImages: [
      '/src/assets/images/busia_executive_suite_1791403472206.jpg',
      '/src/assets/images/hero_busia_villa_1791403460678.jpg'
    ],
    rating: 4.91,
    reviewCount: 31,
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 'prop-vatrak',
    slug: 'vatrak-airbnb-homes-korinda',
    title: 'Vatrak Airbnb Homes · Cozy Stay in Korinda',
    propertyType: 'Airbnb',
    locationId: 'loc-korinda',
    locationName: 'Korinda',
    address: 'Korinda, Busia County',
    pricePerNight: 3500,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    description: 'Vatrak Airbnb Homes in Korinda is a welcoming "home away from home" in Busia County. Decorated with warm, cozy furnishings suited for travelers, executives, and families visiting the border town.\n\nFeatures comfortable plush seating, high-speed Wi-Fi, instant hot shower, fully equipped kitchen, secure free parking, and a peaceful environment away from town traffic.',
    amenityIds: ['wifi', 'parking', 'kitchen', 'hot_shower', 'security', 'compound'],
    houseRules: [
      'Check-in: From 12:00 PM',
      'Check-out: By 10:30 AM',
      'Pets allowed upon prior request',
      'Quiet hours from 10:00 PM'
    ],
    sleepingArrangement: 'Master Bedroom: Queen Bed | Bedroom 2: Double Bed',
    hostId: 'host-vatrak',
    isFeatured: true,
    isVerified: true,
    status: 'active',
    primaryImage: '/src/assets/images/vatrak_homes_korinda_1791712698331.jpg',
    additionalImages: [
      '/src/assets/images/hero_busia_villa_1791403460678.jpg',
      '/src/assets/images/busia_korinda_apartment_1791403501833.jpg'
    ],
    rating: 4.87,
    reviewCount: 22,
    createdAt: '2024-02-01T12:00:00Z'
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    propertyId: 'prop-ricone',
    guestName: 'Denis Wafula',
    guestLocation: 'Nairobi, Kenya',
    rating: 5,
    date: 'February 2024',
    comment: 'Ricone Homes is unmatched in Busia. We booked all 4 bedrooms for our project team. The gazebo in the compound is a wonderful evening spot, the Wi-Fi and Netflix were seamless, and the security guard made us feel completely safe.',
    stayType: 'Business Team'
  },
  {
    id: 'rev-2',
    propertyId: 'prop-ricone',
    guestName: 'Brenda Mukasa',
    guestLocation: 'Kampala, Uganda',
    rating: 5,
    date: 'January 2024',
    comment: 'Super clean, high perimeter wall, and peaceful surroundings. The host was very responsive on 0722880416. Will always be my first choice when in Busia.',
    stayType: 'Family Stay'
  },
  {
    id: 'rev-3',
    propertyId: 'prop-mehomes',
    guestName: 'Onyango Kevin',
    guestLocation: 'Kisumu, Kenya',
    rating: 5,
    date: 'March 2024',
    comment: 'Location is perfect! 3 minutes to Khetia and Frankmatt supermarkets, right near The Breeze Hotel. Fast Wi-Fi and sparkling clean kitchenette.',
    stayType: 'Business Traveler'
  },
  {
    id: 'rev-4',
    propertyId: 'prop-yunia',
    guestName: 'Mercy Nekesa',
    guestLocation: 'Eldoret, Kenya',
    rating: 5,
    date: 'March 2024',
    comment: 'Only 2km from the border post, which made our early morning crossing painless. The balcony view and 24-hr security gave us peace of mind.',
    stayType: 'Cross-Border Trip'
  },
  {
    id: 'rev-5',
    propertyId: 'prop-vatrak',
    guestName: 'Tariq Hassan',
    guestLocation: 'Mombasa, Kenya',
    rating: 5,
    date: 'February 2024',
    comment: 'Vatrak Homes truly felt like a cozy home away from home in Korinda. Warm decor, comfortable sofa, and very quiet night sleep.',
    stayType: 'Solo Traveler'
  }
];

export const ENQUIRIES_DATA: Enquiry[] = [
  {
    id: 'enq-1',
    propertyId: 'prop-ricone',
    propertyTitle: 'Ricone Homes · Luxurious 4-Bedroom Bungalow',
    guestName: 'Timothy Nyongesa',
    guestPhone: '+254711223344',
    guestEmail: 'timothy.n@gmail.com',
    checkInDate: '2026-10-15',
    checkOutDate: '2026-10-18',
    guestsCount: 4,
    message: 'Hello, inquiring about booking 3 bedrooms at Ricone Homes for an NGO project trip.',
    createdAt: '2026-10-06T14:32:00Z',
    status: 'contacted',
    whatsappSent: true
  }
];
