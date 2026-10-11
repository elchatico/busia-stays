import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { Property } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { StaysView } from './views/StaysView';
import { PropertyDetailView } from './views/PropertyDetailView';
import { ListPropertyView } from './views/ListPropertyView';
import { LocationsView } from './views/LocationsView';
import { AboutView } from './views/AboutView';
import { WhatsAppModal } from './components/WhatsAppModal';
import { EnquiryModal } from './components/EnquiryModal';

export default function App() {
  // Multi-Page Route State
  const [currentRoute, setCurrentRoute] = useState<'home' | 'stays' | 'property-detail' | 'list-property' | 'locations' | 'about'>('home');
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [navParams, setNavParams] = useState<Record<string, string>>({});

  // WhatsApp Modal State
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [activeWhatsAppProperty, setActiveWhatsAppProperty] = useState<Property | null>(null);
  const [whatsAppCheckIn, setWhatsAppCheckIn] = useState('');
  const [whatsAppCheckOut, setWhatsAppCheckOut] = useState('');
  const [whatsAppGuests, setWhatsAppGuests] = useState(1);

  // Direct Enquiry Modal State
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [activeEnquiryProperty, setActiveEnquiryProperty] = useState<Property | null>(null);

  // Initialize DB & URL Route Sync
  useEffect(() => {
    db.init();

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/stays/')) {
        const slug = hash.replace('/stays/', '');
        if (slug) {
          setSelectedSlug(slug);
          setCurrentRoute('property-detail');
          return;
        }
      }
      if (hash === '/stays') {
        setCurrentRoute('stays');
        return;
      }
      if (hash === '/list-your-property' || hash === '/list-property') {
        setCurrentRoute('list-property');
        return;
      }
      if (hash === '/locations') {
        setCurrentRoute('locations');
        return;
      }
      if (hash === '/about') {
        setCurrentRoute('about');
        return;
      }
      if (!hash || hash === '/' || hash === '/home') {
        setCurrentRoute('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Multi-page navigation router
  const navigate = (route: string, params?: Record<string, string>) => {
    if (route === 'property-detail' && params?.slug) {
      setSelectedSlug(params.slug);
      setCurrentRoute('property-detail');
      window.location.hash = `/stays/${params.slug}`;
    } else if (route === 'list-property') {
      setCurrentRoute('list-property');
      window.location.hash = '/list-your-property';
    } else {
      setCurrentRoute(route as any);
      setNavParams(params || {});
      window.location.hash = route === 'home' ? '' : `/${route}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // WhatsApp Flow Trigger
  const handleOpenWhatsApp = (
    property: Property,
    checkIn?: string,
    checkOut?: string,
    guests?: number
  ) => {
    setActiveWhatsAppProperty(property);
    setWhatsAppCheckIn(checkIn || '');
    setWhatsAppCheckOut(checkOut || '');
    setWhatsAppGuests(guests || 1);
    setWhatsAppModalOpen(true);
  };

  // Direct Enquiry Flow Trigger
  const handleOpenEnquiry = (property: Property) => {
    setActiveEnquiryProperty(property);
    setEnquiryModalOpen(true);
  };

  // Active hosts for modals
  const activeWhatsAppHost = activeWhatsAppProperty
    ? db.getHostById(activeWhatsAppProperty.hostId) || null
    : null;

  const activeEnquiryHost = activeEnquiryProperty
    ? db.getHostById(activeEnquiryProperty.hostId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. TOP NAVBAR */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
      />

      {/* 2. MULTI-PAGE VIEW CONTAINER WITH MOTION TRANSITIONS */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentRoute === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HomeView
                onNavigate={navigate}
                onViewProperty={(slug) => navigate('property-detail', { slug })}
                onOpenWhatsApp={handleOpenWhatsApp}
              />
            </motion.div>
          )}

          {currentRoute === 'stays' && (
            <motion.div
              key="stays"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <StaysView
                initialLocation={navParams.location}
                initialType={navParams.type}
                initialMinPrice={navParams.minPrice}
                initialMaxPrice={navParams.maxPrice}
                initialGuests={navParams.guests}
                onViewProperty={(slug) => navigate('property-detail', { slug })}
                onOpenWhatsApp={handleOpenWhatsApp}
              />
            </motion.div>
          )}

          {currentRoute === 'property-detail' && (
            <motion.div
              key="property-detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <PropertyDetailView
                slug={selectedSlug}
                onBack={() => navigate('stays')}
                onOpenWhatsApp={handleOpenWhatsApp}
                onOpenEnquiry={handleOpenEnquiry}
                onViewProperty={(slug) => navigate('property-detail', { slug })}
              />
            </motion.div>
          )}

          {currentRoute === 'list-property' && (
            <motion.div
              key="list-property"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ListPropertyView
                onNavigate={navigate}
                onPropertySubmitted={() => navigate('stays')}
              />
            </motion.div>
          )}

          {currentRoute === 'locations' && (
            <motion.div
              key="locations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LocationsView
                onNavigateToStays={(locId) => navigate('stays', { location: locId })}
              />
            </motion.div>
          )}

          {currentRoute === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AboutView onNavigate={navigate} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. FOOTER */}
      <Footer onNavigate={navigate} />

      {/* 4. MODALS */}
      {/* WhatsApp Modal with pre-filled guest enquiry */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        property={activeWhatsAppProperty}
        host={activeWhatsAppHost}
        initialCheckIn={whatsAppCheckIn}
        initialCheckOut={whatsAppCheckOut}
        initialGuests={whatsAppGuests}
      />

      {/* Direct Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        property={activeEnquiryProperty}
        host={activeEnquiryHost}
      />

    </div>
  );
}
