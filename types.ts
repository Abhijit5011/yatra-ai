
export type UserRole = 'user' | 'admin';
export type BudgetLevel = 'low' | 'classic' | 'standard' | 'luxury';

export interface Profile {
  id: string;
  full_name: string;
  password?: string;
  avatar_url?: string;
  interests: string[];
  budget_total: number;
  budget_label: BudgetLevel;
  people_count: number;
  travel_group_type: 'solo' | 'couple' | 'family' | 'friends';
  current_location: string;
  trip_duration_days: number;
  role: UserRole;
  has_completed_onboarding: boolean;
  created_at: string;
  itinerary_history: SavedItinerary[];
}

export interface SavedItinerary {
  id: string;
  destination_id: string;
  destination_name: string;
  date: string;
  data: DetailedPlan;
}

export interface TravelSegment {
  from: string;
  to: string;
  mode: string;
  duration: string;
  cost_estimate: string;
}

export interface ActivitySlot {
  activity: string;
  details: string[];
  location_name: string;
  google_maps_url: string; // New field for robust mapping
  official_website_url?: string; // New field for official verification
}

export interface BudgetBreakdown {
  travel: number;
  accommodation: number;
  food: number;
  activities: number;
  local_transport: number;
  total_per_person: number;
  grand_total: number;
}

export interface DetailedPlan {
  overview: string;
  best_time_to_visit: string;
  packing_essentials: string[];
  weather_preview: string;
  local_etiquette: string[];
  safety_tips: string[];
  local_hidden_gems: { name: string; reason: string }[]; // Interesting new element
  stay_options: { name: string; type: string; price_range: string; booking_url: string }[];
  food_gems: { name: string; specialty: string; price_level: string; maps_url: string }[];
  days: {
    day_number: number;
    theme: string;
    pro_tip: string; // Interesting per-day element
    morning: ActivitySlot;
    afternoon: ActivitySlot;
    evening: ActivitySlot;
    travel_segments: TravelSegment[];
    estimated_daily_spend: string;
    day_route_url: string;
  }[];
  budget_planner: BudgetBreakdown;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  category: string;
  location_lat: number;
  location_lng: number;
  image_url: string;
  rating: number;
  country: string;
  best_season: string;
}

export interface AIRecommendation {
  id: string;
  name: string;
  reason: string;
  matching_score: number;
  tags: string[];
}
