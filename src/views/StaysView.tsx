import React, { useState, useMemo } from 'react';
import { db } from '../services/db';
import { Property, PropertyType } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  ArrowUpDown,
  Building,
  Filter
} from 'lucide-react';

interface StaysViewProps {
  initialLocation?: string;
  initialType?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialGuests?: string;
  onViewProperty: (slug: string) => void;
  onOpenWhatsApp: (property: Property) => void;
}

export const StaysView: React.FC<StaysViewProps> = ({
  initialLocation = '',
  initialType = '',
  initialMinPrice = '',
  initialMaxPrice = '',
  initialGuests = '',
  onViewProperty,
  onOpenWhatsApp,
}) => {
  const locations = db.getLocations();
  const amenitiesList = db.getAmenities();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationId, setLocationId] = useState(initialLocation || 'all');
  const [propertyType, setPropertyType] = useState<PropertyType | 'All'>(
    (initialType as PropertyType) || 'All'
  );
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice ? Number(initialMinPrice) : 0);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice ? Number(initialMaxPrice) : 10000);
  const [guests, setGuests] = useState<number>(initialGuests ? Number(initialGuests) : 1);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');
  
  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationId('all');
    setPropertyType('All');
    setMinPrice(0);
    setMaxPrice(10000);
    setGuests(1);
    setBedrooms(0);
    setSelectedAmenities([]);
    setMinRating(0);
    setSortBy('recommended');
  };

  // Filtered properties
  const properties = useMemo(() => {
    return db.getProperties({
      locationId,
      propertyType,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      amenities: selectedAmenities,
      minRating,
      searchTerm,
      sortBy
    });
  }, [locationId, propertyType, minPrice, maxPrice, guests, bedrooms, selectedAmenities, minRating, searchTerm, sortBy]);

  const activeFiltersCount = 
    (locationId !== 'all' ? 1 : 0) +
    (propertyType !== 'All' ? 1 : 0) +
    (minPrice > 0 || maxPrice < 10000 ? 1 : 0) +
    (guests > 1 ? 1 : 0) +
    (bedrooms > 0 ? 1 : 0) +
    selectedAmenities.length +
    (minRating > 0 ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Title & Search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Stays in Busia, Kenya
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse {properties.length} available {properties.length === 1 ? 'property' : 'properties'} with direct host contact
          </p>
        </div>

        {/* Search input + Mobile Filter Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, area, street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-semibold text-slate-800 rounded-xl flex items-center gap-1.5 shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 bg-emerald-800 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Property Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-xl border border-stone-200/80 sticky top-20 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-800" />
              <span>Filters</span>
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Neighborhood
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full text-xs p-2 border border-stone-200 rounded-lg bg-stone-50 focus:bg-white focus:outline-none"
            >
              <option value="all">All Locations in Busia</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Stay Type
            </label>
            <div className="space-y-1 text-xs">
              {(['All', 'Apartment', 'Airbnb', 'Villa', 'Hotel', 'Guesthouse', 'Furnished'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                    propertyType === type
                      ? 'bg-emerald-50 text-emerald-900 font-semibold'
                      : 'text-slate-600 hover:bg-stone-50'
                  }`}
                >
                  <span>{type === 'All' ? 'All Types' : type}</span>
                  {propertyType === type && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Max Price per Night
              </label>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                KES {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>KES 2,000</span>
              <span>KES 10,000+</span>
            </div>
          </div>

          {/* Guests & Bedrooms */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
              >
                <option value={1}>1+ Guest</option>
                <option value={2}>2+ Guests</option>
                <option value={4}>4+ Guests</option>
                <option value={6}>6+ Guests</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full p-2 border border-stone-200 rounded-lg bg-stone-50"
              >
                <option value={0}>Any</option>
                <option value={1}>1+ Bed</option>
                <option value={2}>2+ Beds</option>
                <option value={3}>3+ Beds</option>
              </select>
            </div>
          </div>

          {/* Key Amenities */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Key Amenities
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                    className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-800"
                  />
                  <span>{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Guest Rating
            </label>
            <div className="flex gap-1">
              {[0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`flex-1 py-1.5 text-xs rounded-md border text-center transition-colors ${
                    minRating === rating
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-stone-200 text-slate-600 hover:bg-stone-50'
                  }`}
                >
                  {rating === 0 ? 'Any' : `${rating}+ ★`}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Listings Section (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Sorting & Result bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 text-xs">
            <span className="text-slate-600">
              Showing <strong className="text-slate-900">{properties.length}</strong> stays in Busia
            </span>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 border border-stone-300 rounded-lg bg-white text-xs text-slate-800 font-medium focus:outline-none"
              >
                <option value="recommended">Recommended & Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Property Cards Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {properties.map((property, idx) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={idx}
                  onViewDetails={onViewProperty}
                  onOpenWhatsApp={onOpenWhatsApp}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No stays match your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, removing certain amenity filters, or switching neighborhood.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Drawer / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white h-full ml-auto p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-bold text-base text-slate-900">Filter Stays</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Location
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg bg-stone-50"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg bg-stone-50"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Airbnb">Airbnb</option>
                  <option value="Villa">Villa</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Guesthouse">Guesthouse</option>
                  <option value="Furnished">Furnished</option>
                </select>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 uppercase">Max Price</span>
                  <span className="font-bold tabular-nums">KES {maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={10000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-800"
                />
              </div>

              {/* Key Amenities */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Amenities
                </label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity.id} className="flex items-center gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="rounded border-stone-300 text-emerald-800"
                      />
                      <span>{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-2.5 text-xs font-semibold text-slate-700 border border-stone-300 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-1/2 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-xl"
              >
                Apply ({properties.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
