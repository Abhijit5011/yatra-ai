import { Profile, Destination, DetailedPlan, AIRecommendation } from "../types";

const SUPABASE_EDGE_URL = "https://neyltlxbdfkbffznzduf.supabase.co/functions/v1/gemini";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leWx0bHhiZGZrYmZmem56ZHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTYwNTcsImV4cCI6MjA4MzI5MjA1N30.te9kpJhh7VfqZy7LyKvsjQp52xNeQn0uZ_iQ-wZJ8pM";


export const geminiService = {
  async getRecommendations(profile: Profile, destinations: Destination[]): Promise<AIRecommendation[]> {
    const response = await fetch(SUPABASE_EDGE_URL, {
      method: "POST",
     headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY
          }

      })
    });

    const data = await response.text();
    return JSON.parse(data.trim() || "[]");
  },

  async generateDetailedPlan(destination: Destination, profile: Profile): Promise<DetailedPlan> {
    const response = await fetch(SUPABASE_EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generateDetailedPlan",
        destination,
        profile
      })
    });

    const data = await response.text();
    return JSON.parse(data.trim() || "{}");
  }
};
