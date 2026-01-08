
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/supabase';
import { geminiService } from '../services/gemini';
import { Profile, Destination, AIRecommendation } from '../types';
import { Icons } from '../constants';

interface DashboardProps {
  profile: Profile;
  onSelectDestination: (id: string) => void;
  onStartNewPlan: () => void;
  onViewHistory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onSelectDestination, onStartNewPlan }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await dbService.getDestinations();
        setDestinations(data || []);
        
        const cachedRecs = localStorage.getItem(`ai_recs_${profile.id}_${profile.trip_duration_days}`);
        if (cachedRecs) {
          setRecommendations(JSON.parse(cachedRecs));
        } else {
          if (profile.interests.length > 0) {
            getAIRecommendations(data);
          }
        }
      } catch (err) {
        console.error("Error loading data.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [profile.id, profile.trip_duration_days]);

  const getAIRecommendations = async (allDests?: Destination[]) => {
    const targetDests = allDests || destinations;
    if (targetDests.length === 0) return;
    setAiLoading(true);
    try {
      const recs = await geminiService.getRecommendations(profile, targetDests);
      setRecommendations(recs);
      localStorage.setItem(`ai_recs_${profile.id}_${profile.trip_duration_days}`, JSON.stringify(recs));
    } catch (err) {
      console.error("AI help failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 space-y-16 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Welcome, {profile.full_name.split(' ')[0]}.
          </h1>
          <p className="text-slate-500 text-lg font-medium">Where would you like to explore next?</p>
        </div>
        <button onClick={onStartNewPlan} className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-2xl shadow-indigo-200/50 hover:bg-indigo-700 transition-all transform active:scale-95 group"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 transition-transform group-hover:rotate-90"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg><span>Plan New Trip</span></button>
      </header>

      {/* Modern Search */}
      <div className="relative group max-w-3xl">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <Icons.Search />
        </div>
        <input 
          type="text"
          placeholder="Search by city, category, or country..."
          className="w-full bg-white border border-slate-200 rounded-3xl py-6 pl-16 pr-8 text-base font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* AI Recommendations - Horizontal Scroll */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Intelligence Recommendations</h3>
         <button onClick={() => getAIRecommendations()} disabled={aiLoading} className="group flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-600 rounded-full transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">{aiLoading ? (<svg className="animate-spin h-3.5 w-3.5 text-indigo-600 group-hover:text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white"><path fillRule="evenodd" d="M15.312 11.424a1 1 0 01-1.664.12l-3.577-4.997a1 1 0 01.12-1.366l4.547-3.637a1 1 0 011.581.801l-.123 5.334 3.12 4.16a1 1 0 01-.12 1.366l-3.884 3.107z" clipRule="evenodd" /><path d="M4.735 8.791l-2.798-.35a1 1 0 01-.875-1.118l.262-2.094a1 1 0 011.118-.875l2.094.262a1 1 0 01.875 1.118l-.262 2.094a1 1 0 01-1.118.875zM14 17a1 1 0 100-2 1 1 0 000 2zM3 17a1 1 0 100-2 1 1 0 000 2z" /></svg>)}<span className="text-[10px] font-black uppercase tracking-[0.15em] text-indigo-600 group-hover:text-white transition-colors">{aiLoading ? 'Syncing...' : 'Refresh AI Picks'}</span></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aiLoading ? (
            [1,2,3].map(i => (
              <div key={i} className="h-64 bg-slate-50 rounded-3xl animate-pulse" />
            ))
          ) : recommendations.length > 0 ? (
            recommendations.map(rec => (
              <div 
                key={rec.id}
                onClick={() => onSelectDestination(rec.id)}
                className="group bg-slate-900 rounded-[2rem] p-8 text-white cursor-pointer hover:shadow-2xl hover:bg-indigo-900 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full group-hover:scale-110 transition-transform" />
                <h4 className="text-2xl font-bold mb-4 tracking-tight">{rec.name}</h4>
                <p className="text-sm text-slate-400 line-clamp-3 mb-6 font-medium leading-relaxed">{rec.reason}</p>
                <div className="flex flex-wrap gap-2">
                   {rec.tags.slice(0, 2).map(t => <span key={t} className="text-[10px] font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">{t}</span>)}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
               <button onClick={() => getAIRecommendations()} className="px-8 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm">Engage AI Advisor</button>
            </div>
          )}
        </div>
      </section>

      {/* Main Grid */}
      <section className="space-y-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Destinations Explorer</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {loading ? [1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[450px] bg-slate-50 animate-pulse rounded-3xl" />
          )) : filteredDestinations.map(dest => (
            <div 
              key={dest.id}
              onClick={() => onSelectDestination(dest.id)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-64 relative overflow-hidden">
                <img src={dest.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={dest.name} />
                <div className="absolute top-6 right-6 bg-white/95 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xl">
                   <span className="text-sm font-bold text-amber-500">★</span>
                   <span className="text-sm font-bold text-slate-900">{dest.rating}</span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="space-y-1">
                   <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{dest.name}</h4>
                   <p className="text-sm font-semibold text-slate-400">{dest.country}</p>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">{dest.description}</p>
                <div className="pt-6 flex items-center justify-between border-t border-slate-50">
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">{dest.category}</span>
                   <div className="text-sm font-bold text-slate-900 flex items-center gap-2 group-hover:gap-4 transition-all">
                      View details
                      <Icons.Explore />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
