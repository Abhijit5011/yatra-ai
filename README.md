
# Yatra AI - Tourism Recommendation System

A complete React-based Tourism Recommendation System. This system serves as a full-scale AI-first travel platform where all intelligence is delegated to Large Language Models.

## Core Features

- **AI-Driven Personalization**: Uses user interests, budget, and location to suggest destinations with reasoning.
- **Dynamic Itinerary Planning**: Generates detailed 3-day plans including morning/afternoon/evening activities and travel tips.
- **Review Summarization**: Aggregates crowdsourced feedback into a concise "Verdict" paragraph.
- **Role-Based Access**: Supabase-ready structure with distinct User and Admin roles.
- **Geospatial Visualization**: Integrated interactive maps for destination exploration.
- **Responsive UI**: High-end Tailwind CSS design optimized for mobile and desktop.

## Architecture

- **Frontend**: React 18+ with TypeScript.
- **Styling**: Tailwind CSS for a modern, luxurious aesthetic.
- **Database/Auth**: Supabase (PostgreSQL with RLS policies).
- **Intelligence Engine**: Google Gemini API (`gemini-3-flash-preview`).


## Setup Instructions

1. **Environment Variables**:
   Set the following Gemini API Key in edge function of Supabase:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   Set the following Supabase variables:
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key.

2. **Database Schema**:
   Run the SQL provided in `services/supabase.ts` inside your Supabase SQL editor to create the necessary tables and relationships.

3. **Install Dependencies**:
   ```bash
   npm install @google/genai @supabase/supabase-js react-router-dom lucide-react
   ```

4. **Run Application**:
   ```bash
   npm run start
   ```

