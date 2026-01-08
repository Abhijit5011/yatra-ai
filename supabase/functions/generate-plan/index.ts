import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: Deno.env.get("GEMINI_API_KEY")!
});

Deno.serve(async (req) => {
  const body = await req.json();

  if (body.action === "getRecommendations") {
    const profile = body.profile;
    const destinations = body.destinations;

    const prompt = `
      Recommend EXACTLY 3 destinations from: ${JSON.stringify(destinations.map(d => ({ id: d.id, name: d.name, category: d.category, country: d.country })))}.
      User Context: ${profile.full_name}, Starting ${profile.current_location}, Interests: ${profile.interests.join(", ")}, Budget: ₹${profile.budget_total}.
      Return JSON with id, name, reason, matching_score, and tags.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              reason: { type: Type.STRING },
              matching_score: { type: Type.NUMBER },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "name", "reason", "matching_score", "tags"]
          }
        }
      }
    });

    return new Response(response.response.text(), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (body.action === "generateDetailedPlan") {
    const destination = body.destination;
    const profile = body.profile;

    const prompt = `
      Create a premium ${profile.trip_duration_days}-day travel itinerary for ${destination.name}, ${destination.country}.
      Start: ${profile.current_location}. Group: ${profile.people_count} people. Budget: ₹${profile.budget_total}.
      
      LINK RULES:
      1. google_maps_url MUST be: 'https://www.google.com/maps/search/?api=1&query=Location+Name+City'
      2. official_website_url MUST be the ACTUAL official site (e.g. whc.unesco.org, official tourism boards, or tripadvisor page).
      3. No shortened URLs (no goo.gl).
      
      Add:
      - 'local_hidden_gems': 3 unique points.
      - 'pro_tip': One per day.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            best_time_to_visit: { type: Type.STRING },
            weather_preview: { type: Type.STRING },
            packing_essentials: { type: Type.ARRAY, items: { type: Type.STRING } },
            local_etiquette: { type: Type.ARRAY, items: { type: Type.STRING } },
            safety_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            local_hidden_gems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, reason: { type: Type.STRING } },
                required: ["name", "reason"]
              }
            },
            stay_options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  price_range: { type: Type.STRING },
                  booking_url: { type: Type.STRING }
                },
                required: ["name", "type", "price_range", "booking_url"]
              }
            },
            food_gems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  specialty: { type: Type.STRING },
                  price_level: { type: Type.STRING },
                  maps_url: { type: Type.STRING }
                },
                required: ["name", "specialty", "price_level", "maps_url"]
              }
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day_number: { type: Type.NUMBER },
                  theme: { type: Type.STRING },
                  pro_tip: { type: Type.STRING },
                  morning: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      location_name: { type: Type.STRING },
                      google_maps_url: { type: Type.STRING },
                      official_website_url: { type: Type.STRING }
                    },
                    required: ["activity", "details", "location_name", "google_maps_url"]
                  },
                  afternoon: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      location_name: { type: Type.STRING },
                      google_maps_url: { type: Type.STRING },
                      official_website_url: { type: Type.STRING }
                    },
                    required: ["activity", "details", "location_name", "google_maps_url"]
                  },
                  evening: {
                    type: Type.OBJECT,
                    properties: {
                      activity: { type: Type.STRING },
                      details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      location_name: { type: Type.STRING },
                      google_maps_url: { type: Type.STRING },
                      official_website_url: { type: Type.STRING }
                    },
                    required: ["activity", "details", "location_name", "google_maps_url"]
                  },
                  travel_segments: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        from: { type: Type.STRING },
                        to: { type: Type.STRING },
                        mode: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        cost_estimate: { type: Type.STRING }
                      },
                      required: ["from", "to", "mode", "duration"]
                    }
                  },
                  estimated_daily_spend: { type: Type.STRING },
                  day_route_url: { type: Type.STRING }
                },
                required: ["day_number", "theme", "pro_tip", "morning", "afternoon", "evening", "travel_segments", "day_route_url"]
              }
            },
            budget_planner: {
              type: Type.OBJECT,
              properties: {
                travel: { type: Type.NUMBER },
                accommodation: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                activities: { type: Type.NUMBER },
                local_transport: { type: Type.NUMBER },
                total_per_person: { type: Type.NUMBER },
                grand_total: { type: Type.NUMBER }
              },
              required: ["travel", "accommodation", "food", "activities", "local_transport", "total_per_person", "grand_total"]
            }
          },
          required: ["overview", "best_time_to_visit", "stay_options", "food_gems", "days", "budget_planner", "packing_essentials", "weather_preview", "local_etiquette", "safety_tips", "local_hidden_gems"]
        }
      }
    });

    return new Response(response.response.text(), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Invalid action", { status: 400 });
});

