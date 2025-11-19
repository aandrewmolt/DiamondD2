import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  Star, 
  Shield, 
  Droplet, 
  Truck, 
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  Navigation
} from 'lucide-react';
import { LOCATIONS, REVIEWS, DiamondLogo } from './constants';
import { LocationInfo } from './types';
import { Chatbot } from './components/Chatbot';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LocationInfo>(LOCATIONS.gilmer);
  const [schedulingModalOpen, setSchedulingModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Map Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const isMapMounted = useRef(false);

  // Handle scroll for sticky header styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current && (window as any).L) {
      const L = (window as any).L;
      
      // Initialize map centered between the two locations
      const map = L.map(mapRef.current, {
        center: [32.63, -94.84], 
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control to top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Use CartoDB Dark Matter tiles for the premium dark aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Define Locations from CONSTANTS
      const locations = Object.values(LOCATIONS);

      // Custom Marker Icon
      const createCustomIcon = (name: string) => L.divIcon({
        className: 'bg-transparent border-0',
        html: `<div class="relative flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                 <div class="w-4 h-4 bg-[#DC2626] rounded-full shadow-[0_0_15px_rgba(220,38,38,1)] animate-pulse group-hover:scale-125 transition-transform"></div>
                 <span class="absolute top-5 bg-gray-900/90 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider backdrop-blur-sm border border-gray-700 whitespace-nowrap group-hover:text-brand-red transition-colors">${name}</span>
               </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      locations.forEach(loc => {
        // Add Marker
        const marker = L.marker(loc.coordinates, { icon: createCustomIcon(loc.name) }).addTo(map);
        
        // Add Click Handler to Marker
        marker.on('click', () => {
           setActiveLocation(loc);
        });

        // Add 15 Mile Radius Circle (approx 24,140 meters)
        L.circle(loc.coordinates, {
          color: '#DC2626',
          fillColor: '#DC2626',
          fillOpacity: 0.1,
          weight: 1,
          dashArray: '5, 10',
          radius: 24140 
        }).addTo(map);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Map "FlyTo" when active location changes (but skip initial mount)
  useEffect(() => {
    if (isMapMounted.current && mapInstanceRef.current && activeLocation) {
      mapInstanceRef.current.flyTo(activeLocation.coordinates, 13, {
        animate: true,
        duration: 1.5
      });
    }
    isMapMounted.current = true;
  }, [activeLocation]);

  const toggleLocation = (locId: string) => {
    if (LOCATIONS[locId]) setActiveLocation(LOCATIONS[locId]);
  };

  const handleScheduleClick = () => {
    setSchedulingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <header 
        className={`fixed w-full top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-white py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <DiamondLogo className="w-10 h-10 md:w-12 md:h-12" />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-none tracking-tight">
                DIAMOND <span className="text-brand-red">D</span> LUBE
              </h1>
              <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Premium Service • Family Owned</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">Services</a>
            <a href="#locations" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">Locations</a>
            <a href="#reviews" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">Reviews</a>
            <button 
              onClick={handleScheduleClick}
              className="bg-brand-red text-white px-6 py-2.5 rounded-md font-semibold hover:bg-brand-darkRed transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Calendar size={18} />
              Book Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-6 flex flex-col gap-4 animate-fade-in">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-medium py-2">Services</a>
            <a href="#locations" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-medium py-2">Locations</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-medium py-2">Reviews</a>
            <button 
              onClick={() => {
                handleScheduleClick();
                setMobileMenuOpen(false);
              }}
              className="bg-brand-red text-white text-center py-3 rounded-md font-semibold"
            >
              Book Appointment
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gray-900 relative overflow-hidden">
        {/* Background Overlay Image - Abstract darker garage/car theme */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/60 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red border border-brand-red/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Star size={12} fill="currentColor" /> #1 Rated in East Texas
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Service That Comes To You.<br />
              <span className="text-brand-red">Or Drive Right Up.</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Experience the convenience of our <strong>Pickup & Delivery service</strong> within 15 miles of Gilmer & Longview, or visit our drive-thru for premium oil changes and inspections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleScheduleClick}
                className="bg-brand-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-darkRed transition-all shadow-lg shadow-brand-red/30 flex items-center justify-center gap-2"
              >
                Schedule Pickup
                <ArrowRight size={20} />
              </button>
              <a 
                href="#locations"
                className="bg-white/10 text-white border border-white/20 backdrop-blur-sm px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-brand-black transition-all flex items-center justify-center gap-2"
              >
                Find a Location
                <MapPin size={20} />
              </a>
            </div>
            <p className="mt-6 text-gray-400 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> No appointment needed for drive-up service.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premium Automotive Care</h2>
            <p className="text-gray-600">We use only top-tier synthetic oils and employ licensed inspectors to ensure your vehicle runs safely and smoothly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
                <Droplet size={28} className="text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Oil Changes</h3>
              <p className="text-gray-600 mb-6">Featuring Amsoil and Mobil 1 Synthetic oils. We handle specialty synthetic requests—just let us know what you need.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-red" /> Amsoil & Mobil 1
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-red" /> Filter Replacement
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
                <Shield size={28} className="text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inspections</h3>
              <p className="text-gray-600 mb-6">State inspections and DOT/Commercial inspections. We have licensed inspectors consistently available.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-red" /> State Inspections
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-red" /> DOT Certified (Gilmer)
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-brand-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
                <Truck size={28} className="text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Convenience</h3>
              <p className="text-gray-600 mb-6">Choose between our fast drive-thru service or our exclusive pickup & delivery service within 15 miles.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-red" /> 15-Mile Pickup Radius
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-brand-red" /> Wiper Blade Install
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Radius Section */}
      <section id="locations" className="py-20 bg-gray-900 text-white scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Interactive Leaflet Map */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700 min-h-[400px] h-[450px] bg-gray-800 group z-0">
               {/* Map Container */}
               <div ref={mapRef} className="absolute inset-0 w-full h-full z-10" />
               
               {/* Subtle Overlay for aesthetic depth */}
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent pointer-events-none z-20"></div>

               {/* Open Google Maps Button */}
               <a 
                 href={activeLocation.mapUrl} 
                 target="_blank" 
                 rel="noreferrer"
                 className="absolute bottom-4 right-4 bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg z-[1000]"
               >
                 <Navigation size={16} />
                 Open in Google Maps
               </a>
            </div>

            {/* Location Details */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Find Your Location</h2>
              
              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-gray-700 pb-1">
                <button 
                  onClick={() => toggleLocation('gilmer')}
                  className={`pb-3 text-lg font-medium transition-all border-b-2 ${
                    activeLocation.id === 'gilmer' ? 'text-brand-red border-brand-red' : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  Gilmer
                </button>
                <button 
                  onClick={() => toggleLocation('longview')}
                  className={`pb-3 text-lg font-medium transition-all border-b-2 ${
                    activeLocation.id === 'longview' ? 'text-brand-red border-brand-red' : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  Longview
                </button>
              </div>

              {/* Active Content with Key for Animation Reset */}
              <div key={activeLocation.id} className="animate-fade-in space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{activeLocation.name}</h3>
                  <p className="text-gray-300 text-lg flex items-start gap-2">
                    <MapPin className="mt-1 text-brand-red shrink-0" size={20} />
                    {activeLocation.address}, {activeLocation.cityStateZip}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                     <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Hours</h4>
                     <ul className="space-y-1 text-gray-200">
                       <li className="flex justify-between"><span className="text-gray-400">Mon-Fri</span> {activeLocation.hours.mf}</li>
                       <li className="flex justify-between"><span className="text-gray-400">Sat</span> {activeLocation.hours.sat}</li>
                       <li className="flex justify-between"><span className="text-gray-400">Sun</span> <span className="text-brand-red">{activeLocation.hours.sun}</span></li>
                     </ul>
                   </div>
                   <div>
                     <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Contact</h4>
                     <a href={`tel:${activeLocation.phone.replace(/\D/g,'')}`} className="text-2xl font-bold text-white hover:text-brand-red transition-colors flex items-center gap-2">
                       <Phone size={24} />
                       {activeLocation.phone}
                     </a>
                     <a href="mailto:info@diamonddlube.com" className="block mt-2 text-gray-400 hover:text-white transition-colors">
                       info@diamonddlube.com
                     </a>
                   </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-3">Location Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeLocation.features.map(feat => (
                      <span key={feat} className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-700">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleScheduleClick}
                  className="w-full mt-4 bg-brand-red hover:bg-brand-darkRed text-white py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  Schedule Pickup for {activeLocation.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-50 scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Locals</h2>
              <p className="text-gray-600 text-lg">See what our neighbors in Gilmer and Longview have to say about our service.</p>
            </div>
            <div className="flex gap-4">
               <a 
                 href={LOCATIONS.gilmer.mapUrl} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="text-brand-red font-semibold hover:underline flex items-center gap-1"
               >
                 Write a Review (Gilmer) <ArrowRight size={16} />
               </a>
               <a 
                 href={LOCATIONS.longview.mapUrl} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="text-brand-red font-semibold hover:underline flex items-center gap-1"
               >
                 Write a Review (Longview) <ArrowRight size={16} />
               </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 flex-grow">"{review.text}"</p>
                <div className="mt-auto border-t border-gray-100 pt-4">
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{review.location}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{review.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                 <DiamondLogo className="w-8 h-8" />
                 <span className="font-bold text-xl tracking-tight">DIAMOND D LUBE</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Family owned and operated. Providing premium oil changes and inspections to East Texas with honesty and integrity.
              </p>
              <div className="flex gap-4 mt-6">
                {/* Social Placeholders */}
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-brand-red hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#services" className="hover:text-brand-red">Services</a></li>
                <li><a href="#locations" className="hover:text-brand-red">Locations</a></li>
                <li><a href="#reviews" className="hover:text-brand-red">Reviews</a></li>
                <li><button onClick={handleScheduleClick} className="hover:text-brand-red">Book Appointment</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Gilmer</h4>
              <p className="text-sm text-gray-600 mb-2">1125 US Hwy 271 S<br/>Gilmer, TX 75644</p>
              <a href="tel:9038434494" className="text-sm font-semibold text-brand-red hover:underline">(903) 843-4494</a>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Longview</h4>
              <p className="text-sm text-gray-600 mb-2">2903 Estes Pkwy<br/>Longview, TX 75602</p>
              <a href="tel:9037040269" className="text-sm font-semibold text-brand-red hover:underline">(903) 704-0269</a>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Diamond D Lube. All rights reserved.</p>
            <div className="flex gap-6">
               <button onClick={() => alert('Privacy Policy: We respect your data.')} className="hover:text-gray-900">Privacy Policy</button>
               <button onClick={() => alert('Terms: Standard service terms apply.')} className="hover:text-gray-900">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Tools */}
      <Chatbot />

      {/* Scheduling Modal */}
      {schedulingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
             <button 
              onClick={() => setSchedulingModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
             >
               <X size={20} />
             </button>
             
             <div className="p-8 text-center">
               <div className="mx-auto bg-brand-red/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                 <Calendar size={32} className="text-brand-red" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Schedule Pickup</h3>
               <p className="text-gray-600 mb-8">Select your preferred location for our pickup & delivery service.</p>
               
               <div className="space-y-4">
                 <a 
                   href={LOCATIONS.gilmer.scheduleUrl}
                   target="_blank"
                   rel="noreferrer"
                   className="block w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-red hover:shadow-md transition-all group text-left"
                 >
                   <div className="flex justify-between items-center">
                     <div>
                       <span className="block font-bold text-gray-900 text-lg">Gilmer Location</span>
                       <span className="text-gray-500 text-sm">1125 US Hwy 271 S</span>
                     </div>
                     <ArrowRight className="text-gray-300 group-hover:text-brand-red transition-colors" />
                   </div>
                 </a>

                 <a 
                   href={LOCATIONS.longview.scheduleUrl}
                   target="_blank"
                   rel="noreferrer"
                   className="block w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-red hover:shadow-md transition-all group text-left"
                 >
                   <div className="flex justify-between items-center">
                     <div>
                       <span className="block font-bold text-gray-900 text-lg">Longview Location</span>
                       <span className="text-gray-500 text-sm">2903 Estes Pkwy</span>
                     </div>
                     <ArrowRight className="text-gray-300 group-hover:text-brand-red transition-colors" />
                   </div>
                 </a>
               </div>

               <p className="mt-6 text-xs text-gray-400">
                 Note: Pickup service is available within a 15-mile radius of each location. For drive-up service, no appointment is necessary.
               </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;