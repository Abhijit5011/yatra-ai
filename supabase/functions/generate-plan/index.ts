import { Profile, Destination, DetailedPlan, AIRecommendation } from "../types";

const SUPABASE_EDGE_URL = "https://neyltlxbdfkbffznzduf.supabase.co/functions/v1/gemini";

export const geminiService = {
  async getRecommendations(profile: Profile, destinations: Destination[]): Promise<AIRecommendation[]> {
    const response = await fetch(SUPABASE_EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getRecommendations",
        profile,
        destinations
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
