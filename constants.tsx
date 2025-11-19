import { LocationInfo, Review } from './types';
import React from 'react';

export const LOCATIONS: Record<string, LocationInfo> = {
  gilmer: {
    id: 'gilmer',
    name: 'Gilmer Location',
    address: '1125 US Hwy 271 S',
    cityStateZip: 'Gilmer, TX 75644',
    phone: '(903) 843-4494',
    mapUrl: 'https://maps.app.goo.gl/GR4UxXLaHYprJrZHA',
    scheduleUrl: 'https://www.droptop-scheduler.com/rdDIZZK2rUaG2HMeUT11O5dwGFg9yC9s9IwubayO/TdM1vot1sv/',
    features: ['DOT Inspections', 'Commercial Inspections', 'Drive-Thru', 'Pickup Service'],
    hours: {
      mf: '8:00 AM - 5:00 PM',
      sat: '8:00 AM - 12:00 PM',
      sun: 'Closed'
    }
  },
  longview: {
    id: 'longview',
    name: 'Longview Location',
    address: '2903 Estes Pkwy',
    cityStateZip: 'Longview, TX 75602',
    phone: '(903) 704-0269',
    mapUrl: 'https://maps.app.goo.gl/kwEr7qUoeEFCDucD7',
    scheduleUrl: 'https://www.droptop-scheduler.com/rdDIZZK2rUaG2HMeUT11O5dwGFg9yC9s9IwubayO/UCjd2ZpK4t/',
    features: ['Drive-Thru', 'Pickup Service', 'Fleet Services'],
    hours: {
      mf: '8:00 AM - 5:00 PM',
      sat: '8:00 AM - 12:00 PM',
      sun: 'Closed'
    }
  }
};

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Cecilia Vicars",
    rating: 5,
    text: "Giving a great big shout out to Diamond D Lube. David and Josh Management great job building the perfect team. Between Seth, James, Dillon and Jordon I tip my hat to y'all.",
    location: "Gilmer Location",
    source: "Google Maps"
  },
  {
    id: 2,
    name: "Mikey Rad",
    rating: 5,
    text: "The only family owned oil lube left in town. I wouldn't use anyone else. Owned and operated by good people. They are the only place that consistently has licensed inspectors working.",
    location: "Gilmer Location",
    source: "Google Maps"
  },
  {
    id: 3,
    name: "Bekah Wilbourn",
    rating: 5,
    text: "AMAZING service. Crew was absolutely wonderful and so kind and helpful. I was traveling for work and needed a quick place to stop for an oil change, and they made it the best experience.",
    location: "Longview Location",
    source: "Google Maps"
  },
  {
    id: 4,
    name: "Kay Porter",
    rating: 5,
    text: "My first time here today and I was so impressed with this place! Had oil changed and new windshield wipers installed. The service was extremely fast.",
    location: "Gilmer Location",
    source: "Google Maps"
  }
];

// Custom SVG Logo Component
export const DiamondLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
    </defs>
    {/* Diamond Shape */}
    <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="url(#logoGradient)" strokeWidth="6" fill="white" />
    {/* Inner D / Drop stylized */}
    <path d="M50 25 C50 25 30 50 30 65 C30 76.0457 38.9543 85 50 85 C61.0457 85 70 76.0457 70 65 C70 50 50 25 50 25 Z" fill="url(#logoGradient)" />
    {/* Shine on drop */}
    <path d="M40 60 Q40 55 45 50" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
