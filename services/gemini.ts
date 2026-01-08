import { Profile, Destination, DetailedPlan, AIRecommendation } from "../types";

const EDGE_FUNCTION_URL = "/functions/v1/generate-plan";

export const geminiService = {
  async getRecommendations(profile: Profile, destinations: Destination[]): Promise<AIRecommendation[]> {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "getRecommendations",
        profile,
        destinations
      })
    });

    if (!response.ok) {
      throw new Error("Failed to get recommendations");
    }

    return await response.json();
  },

  async generateDetailedPlan(destination: Destination, profile: Profile): Promise<DetailedPlan> {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generateDetailedPlan",
        destination,
        profile
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate detailed plan");
    }

    return await response.json();
  }
};
