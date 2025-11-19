export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  location: string;
  source: 'Google Maps' | 'Facebook' | 'Yelp';
}

export interface LocationInfo {
  id: 'gilmer' | 'longview';
  name: string;
  address: string;
  cityStateZip: string;
  phone: string;
  mapUrl: string;
  scheduleUrl: string;
  coordinates: [number, number];
  features: string[];
  hours: {
    mf: string;
    sat: string;
    sun: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}