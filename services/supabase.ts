
import { createClient } from "@supabase/supabase-js";
import { Profile, Destination, SavedItinerary } from "../types";

const SUPABASE_URL = "https://neyltlxbdfkbffznzduf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWx0bHhiZGZrYmZmem56ZHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTYwNTcsImV4cCI6MjA4MzI5MjA1N30.te9kpJhh7VfqZy7LyKvsjQp52xNeQn0uZ_iQ-wZJ8pM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const dbService = {
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, itineraries(*)')
        .eq('id', userId)
        .maybeSingle();
      
      if (error || !data) return null;
      
      const profile = data as any;
      return {
        ...profile,
        itinerary_history: (profile.itineraries || []).map((it: any) => ({
          id: it.id,
          destination_id: it.destination_id,
          destination_name: it.destination_name,
          date: new Date(it.created_at).toLocaleDateString(),
          data: it.plan_data
        }))
      } as Profile;
    } catch (err) {
      console.error("Profile Fetch Exception:", err);
      return null;
    }
  },

  async updateProfile(profile: Profile): Promise<void> {
    const payload = {
      id: profile.id,
      full_name: profile.full_name,
      password: profile.password || null, // Persist password
      avatar_url: profile.avatar_url || null,
      interests: profile.interests || [],
      budget_total: profile.budget_total || 0,
      budget_label: profile.budget_label || 'standard',
      people_count: profile.people_count || 1,
      travel_group_type: profile.travel_group_type || 'solo',
      current_location: profile.current_location || '',
      trip_duration_days: profile.trip_duration_days || 3,
      has_completed_onboarding: profile.has_completed_onboarding || false,
      role: profile.role || 'user'
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });
    
    if (error) {
      console.error("Supabase Sync Error:", error);
      throw new Error(`DB Sync Failed: ${error.message}`);
    }
  },

  async userExists(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    return !!data && !error;
  },

  async getDestinations(): Promise<Destination[]> {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('rating', { ascending: false });
    return error ? [] : (data as Destination[]);
  },

  async getDestinationById(id: string): Promise<Destination | undefined> {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return data || undefined;
  },

  async saveItinerary(userId: string, plan: { destination_id: string; destination_name: string; data: any }): Promise<void> {
    const { error } = await supabase
      .from('itineraries')
      .insert({
        user_id: userId,
        destination_id: plan.destination_id,
        destination_name: plan.destination_name,
        plan_data: plan.data
      });
    if (error) throw new Error(error.message);
  }
};
