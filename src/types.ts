export interface Activity {
  time: string;
  title: string;
  description: string;
  costEstimate: string;
  locationName: string;
  googleMapsUrl?: string;
  coordinates?: { lat: number; lng: number };
  category: 'sightseeing' | 'food' | 'transport' | 'activity';
}

export interface DailyPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface Hotel {
  name: string;
  rating: string;
  costPerNight: string;
  reason: string;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  rating: string;
  priceRange: string;
  address: string;
}

export interface NearbyAttraction {
  name: string;
  description: string;
  highlights: string[];
}

export interface TransportSuggestion {
  type: string;
  averageCost: string;
  pros: string;
  cons: string;
}

export interface Trip {
  id: string;
  destination: string;
  durationDays: number;
  style: 'luxury' | 'adventure' | 'business' | 'student' | 'solo' | 'family';
  companionMode: 'solo' | 'family' | 'couple' | 'friends';
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  itinerary: DailyPlan[];
  packingList: string[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  transport: TransportSuggestion[];
  nearbyAttractions: NearbyAttraction[];
  totalEstimatedCost: string;
  savedAt?: string;
}

export interface ScoreItem {
  label: string;
  score: number; // 0 to 100
  color: string;
  description: string;
}

export interface TravelPulseData {
  destination: string;
  overallScore: number;
  scores: {
    weather: number;
    safety: number;
    crowd: number;
    walking: number;
    transport: number;
    visa: number;
    cost: number;
  };
  visaDifficulty: string;
  visaDetails: string;
  currentWeather?: {
    condition: string;
    temperatureCelsius: number;
    humidity: number;
    windKph: number;
    forecast: { day: string; temp: number; condition: string }[];
  };
  localEvents: { name: string; date: string; description: string }[];
  historicalTrends: { month: string; temp: number; crowd: number; cost: number }[];
  pulseAnalysis: string;
}

export interface BudgetEstimateItem {
  category: string;
  estimate: string;
  percentage: number;
  details: string;
}

export interface CurrencyConversion {
  from: string;
  to: string;
  rate: number;
  symbol: string;
}

export interface BudgetOptimizerData {
  destination: string;
  budgetStyle: string;
  totalEstimatedCost?: string;
  dailyAverageCost?: string;
  estimates: BudgetEstimateItem[];
  emergencyReserve: string;
  savingsSuggestions: string[];
  convertedBudget?: {
    originalAmount: number;
    convertedAmount: number;
    currency: string;
  };
}

export interface Mosque {
  name: string;
  distance: string;
  address: string;
  facilities?: string[];
}

export interface HalalRestaurant {
  name: string;
  cuisine: string;
  rating: string;
  address: string;
  halalCertification: string;
}

export interface MuslimAssistantData {
  destination: string;
  prayerTimes: {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  nearbyMosques: Mosque[];
  halalRestaurants: HalalRestaurant[];
  qiblaAngle: number; // angle relative to North (0-360)
  travelTips: string[];
  ramadanModeDetails?: string;
}

export interface ScamInfo {
  title: string;
  description: string;
  commonLocations: string;
  howToAvoid: string;
}

export interface ScamShieldData {
  destination: string;
  riskScore: number; // 1 to 10 (low to high risk)
  commonScams: ScamInfo[];
  safeZones: string[];
  unsafeZones: string[];
  taxiPrecautions: string[];
  emergencyNumbers: {
    police: string;
    ambulance: string;
    touristPolice: string;
  };
}

export interface ScamVerifyResult {
  isScam: 'likely' | 'possible' | 'unlikely';
  confidence: number; // 0 to 100
  analysis: string;
  scamType: string;
  precautionTips: string[];
  recommendedAction: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'emerald' | 'sunset';
  language: string;
  currency: string;
  ramadanMode: boolean;
  budgetPreference: 'budget' | 'moderate' | 'luxury';
  travelStyles: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  iconName: string;
}

export interface TravelGoal {
  id: string;
  title: string;
  target: string;
  progress: number; // 0 to 100
  completed: boolean;
}

export interface UserProfileData {
  name: string;
  avatar: string;
  preferences: UserPreferences;
  statistics: {
    tripsPlanned: number;
    countriesVisited: number;
    scamsAvoided: number;
    mosquesFound: number;
    budgetSaved: string;
  };
  achievements: Achievement[];
  goals: TravelGoal[];
}
