
import React, { useState, useEffect } from 'react';
import { dbService } from '../services/supabase';
import { geminiService } from '../services/gemini';
import { Destination, Profile, DetailedPlan, ActivitySlot } from '../types';
import { Icons } from '../constants';

interface Props {
  id: string;
  profile: Profile;
  onBack: () => void;
  onSavePlan: (plan: any) => void;
  initialData?: DetailedPlan | null;
}

const DestinationDetails: React.FC<Props> = ({ id, profile, onBack, onSavePlan, initialData }) => {
  const [dest, setDest] = useState<Destination | null>(null);
  const [itinerary, setItinerary] = useState<DetailedPlan | null>(initialData || null);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => {
    dbService.getDestinationById(id).then(d => {
      if (d) setDest(d);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  const generate = async () => {
    if (!dest) return;
    setGenLoading(true);
    try {
      const plan = await geminiService.generateDetailedPlan(dest, profile);
      setItinerary(plan);
      onSavePlan({ 
        destination_id: dest.id,
        destination_name: dest.name, 
        data: plan 
      });
    } catch (err) { console.error(err); }
    setGenLoading(false);
  };

  const renderActivity = (title: string, data: ActivitySlot, color: string) => (
    <div className="flex-1 space-y-4">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</span>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all">
        <div className="flex items-center justify-between mb-2">
          <h6 className="text-base font-bold text-slate-900 leading-tight">{data.activity}</h6>
          <div className="flex gap-2">
            <a href={data.google_maps_url} target="_blank" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
              <Icons.MapPin />
            </a>
            {data.official_website_url && (
              <a href={data.official_website_url} target="_blank" className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                <Icons.InfoSquare />
              </a>
            )}
          </div>
        </div>
        <p className="text-xs font-bold text-indigo-600 mb-4">📍 {data.location_name}</p>
        <ul className="space-y-2">
          {data.details.map((point, idx) => (
            <li key={idx} className="text-sm text-slate-500 leading-relaxed flex gap-3">
              <span className="text-slate-300">•</span> {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (loading || !dest) return <div className="p-20 text-center text-sm font-bold uppercase animate-pulse">Synchronizing Data...</div>;

  return (
    <div className="w-full font-sans bg-white min-h-screen">
      {/* Full Screen Attractive Loader */}
      {genLoading && (
        <div className="fixed inset-0 z-[100] loader-overlay flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="relative mb-12">
            <div className="w-24 h-24 border-8 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
              <Icons.Plane />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Designing Your Voyage</h2>
          <p className="text-slate-500 text-lg max-w-md font-medium">Yatra AI is crafting a pointwise premium itinerary, calculating logistics, and selecting local gems for {dest.name}.</p>
          <div className="mt-12 flex gap-2">
            {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-${i}00`} />)}
          </div>
        </div>
      )}

      {/* Hero Header - Full Screen Width style */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={dest.image_url} className="w-full h-full object-cover" alt={dest.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-12 md:p-24">
          <button onClick={onBack} className="absolute top-12 left-12 flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/40 transition-all">
            <Icons.Home /> Back to Dashboard
          </button>
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <div className="flex gap-4">
               <span className="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">{dest.category}</span>
               <span className="bg-amber-500 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">★ {dest.rating}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">{dest.name}</h1>
            <p className="text-lg text-white/70 font-bold uppercase tracking-widest">{dest.country} — Prime Season: {dest.best_season}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 md:p-24 space-y-24">
        {!itinerary ? (
          <div className="flex flex-col items-center py-24 border-2 border-dashed border-slate-100 rounded-[3rem] text-center space-y-8">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
               <Icons.Plane />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 uppercase">Construct Itinerary</h2>
              <p className="text-slate-500 text-lg font-medium max-w-lg">Transform this destination into a complete pointwise plan powered by Yatra AI.</p>
            </div>
            <button 
              onClick={generate}
              className="px-12 py-6 bg-slate-900 text-white rounded-2xl text-base font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl active:scale-95"
            >
              Generate AI Trip Plan
            </button>
          </div>
        ) : (
          <div className="space-y-24">
            {/* Overview & Core Data */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-6">
                  <p className="text-1xl font-medium text-slate-500 leading-relaxed italic">"{itinerary.overview}"</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-8 rounded-3xl space-y-2">
                        <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest"> Weather</span>
                        <p className="text-[13px] bg-white px-1.5 py-1.5 rounded-lg border border-slate-100 font-bold text-slate-500">{itinerary.weather_preview}</p>
                     </div>
                     <div className="bg-slate-50 p-8 rounded-3xl space-y-2">
                        <span className="text-[12px] font-bold text-slate-600 uppercase tracking-widest">Travel Essentials</span>
                        <div className="flex flex-wrap gap-2 pt-2">
                           {itinerary.packing_essentials.map(p => <span key={p} className="text-[12px] font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-slate-500">{p}</span>)}
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Professional Budget Breakdown Section */}
               <div className="bg-slate-900 text-white p-10 rounded-[3rem] space-y-8 shadow-2xl">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Financial Blueprint</h3>
                  <div className="space-y-6">
                    <div className="pb-6 border-b border-white/10">
                       <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Estimated Total (Group)</p>
                       <p className="text-4xl font-black tracking-tighter">₹{itinerary.budget_planner.grand_total.toLocaleString()}</p>
                    </div>
                    <div className="space-y-4">
                       <BudgetRow label="Flights & Travel" amount={itinerary.budget_planner.travel} />
                       <BudgetRow label="Accommodation" amount={itinerary.budget_planner.accommodation} />
                       <BudgetRow label="Food & Dining" amount={itinerary.budget_planner.food} />
                       <BudgetRow label="Activities" amount={itinerary.budget_planner.activities} />
                       <BudgetRow label="Local Transport" amount={itinerary.budget_planner.local_transport} />
                    </div>
                    <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                       <p className="text-sm font-bold text-white/50">Total Per Person</p>
                       <p className="text-2xl font-black">₹{itinerary.budget_planner.total_per_person.toLocaleString()}</p>
                    </div>
                  </div>
               </div>
            </section>

            {/* Daily Detailed Schedule */}
            <section className="space-y-12">
               <h3 className="text-xL font-black text-slate-400 uppercase px-2">Daily Activities Log</h3>
               <div className="space-y-24">
                  {itinerary.days.map((day, i) => (
                    <div key={i} className="space-y-10 group">
                       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                          <div className="space-y-3">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black">0{day.day_number}</div>
                               <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{day.theme}</h4>
                             </div>
                             <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl w-fit">
                                <span className="text-[10px] font-black text-indigo-600 uppercase">Pro Tip :</span>
                                <p className="text-sm font-medium text-indigo-900">"{day.pro_tip}"</p>
                             </div>
                          </div>
                            <a href={day.day_route_url} target="_blank" className="group flex items-center gap-2 w-fit px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-indigo-300 rounded-full shadow-sm hover:shadow-lg hover:shadow-indigo-100 transition-all duration-500"><span className="text-[10px] font-black text-slate-500 group-hover:text-indigo-600 uppercase tracking-[0.15em] transition-colors">View Route</span><div className="p-1 bg-slate-50 group-hover:bg-indigo-600 rounded-full transition-all duration-300"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-slate-400 group-hover:text-white transition-transform group-hover:rotate-45"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" /></svg></div></a>                       </div>
                       
                       <div className="flex flex-col lg:flex-row gap-12">
                          {renderActivity('Morning Sequence', day.morning, 'bg-amber-400')}
                          {renderActivity('Afternoon Quest', day.afternoon, 'bg-indigo-600')}
                          {renderActivity('Evening Serenity', day.evening, 'bg-slate-900')}
                       </div>
                    </div>
                  ))}
               </div>
            </section>


              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-400"></div>
                  <h3 className="text-[20px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    More Secret Spots
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-400"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {itinerary.local_hidden_gems.map((gem, i) => (
                    <div key={i} className="group relative bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                      </div>
                      <div className="flex flex-col gap-3 relative z-10">
                        <div className="w-fit px-3 py-1 bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest rounded-full mb-1 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">Hidden Gem</div>
                        <h4 className="text-lg font-bold text-slate-800 leading-tight">{gem.name}</h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium line-clamp-3">{gem.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8 overflow-hidden relative">
              <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 via-blue-400 to-red-400 opacity-30"></div>

              <div class="flex items-center justify-between border-b border-slate-50 pb-6">
                <div>
                  <h4 class="text-[20px] font-bold uppercase text-slate-800 ">
                   Trip Partners
                  </h4>
                  <p class="text-[10px] text-slate-400 font-medium mt-1 italic">Verified Booking Channels</p>
                </div>
                <div class="bg-slate-50 p-2 rounded-full">
                  
                </div>
              </div>

              <div class="grid grid-cols-2 gap-5">
                
                <a href="https://www.makemytrip.com" target="_blank" class="group flex flex-col items-center p-6 rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-100 hover:border-rose-200">
                  <div class="w-12 h-12 mb-3 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </div>
                  <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-4">MakeMyTrip</span>
                  <div class="w-full py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 text-center group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">VISIT SITE</div>
                </a>

                <a href="https://www.goibibo.com" target="_blank" class="group flex flex-col items-center p-6 rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100 hover:border-blue-200">
                  <div class="w-12 h-12 mb-3 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
                      <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 4.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm0 2.25a3 3 0 100 6 3 3 0 000-6z" />
                    </svg>
                  </div>
                  <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-4">Goibibo</span>
                  <div class="w-full py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 text-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">VISIT SITE</div>
                </a>

                <a href="https://www.irctc.co.in" target="_blank" class="group flex flex-col items-center p-6 rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-100 hover:border-orange-200">
                  <div class="w-12 h-12 mb-3 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
                      <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 013-3h15a3 3 0 013 3v15a3 3 0 01-3 3h-15a3 3 0 01-3-3v-15zm4.5 4.5a.75.75 0 000 1.5h12a.75.75 0 000-1.5H6zm0 4.5a.75.75 0 000 1.5h12a.75.75 0 000-1.5H6zm0 4.5a.75.75 0 000 1.5h12a.75.75 0 000-1.5H6z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-4">IRCTC Rail</span>
                  <div class="w-full py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 text-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">VISIT SITE</div>
                </a>

                <a href="https://www.yatra.com" target="_blank" class="group flex flex-col items-center p-6 rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-red-100 hover:border-red-200">
                  <div class="w-12 h-12 mb-3 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-7 h-7">
                      <path d="M19.006 3.705a.75.75 0 10-.512-1.41L6 6.838V3a.75.75 0 00-1.5 0v11.33l-1.494.512a.75.75 0 10.512 1.41l1.494-.512V18a3 3 0 003 3h8a3 3 0 003-3V9.162l1.494-.512a.75.75 0 10-.512-1.41l-1.494.512V3.705z" />
                    </svg>
                  </div>
                  <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-4">Yatra</span>
                  <div class="w-full py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 text-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">VISIT SITE</div>
                </a>

              </div>
            </div>
 
              

            {/* Cultural & Safety Hub */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="bg-slate-50 p-12 rounded-[3rem] space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase ">Cultural Intelligence</h4>
                  <ul className="space-y-4">
                    {itinerary.local_etiquette.map((tip, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                         <span className="text-indigo-600 font-bold text-lg">•</span>
                         <p className="text-base text-slate-600 font-medium leading-relaxed italic">"{tip}"</p>
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-red-50 p-12 rounded-[3rem] space-y-6">
                  <h4 className="text-xs font-black text-red-400 uppercase ">Security & Alerts</h4>
                  <div className="space-y-4">
                    {itinerary.safety_tips.map((tip, idx) => (
                      <div key={idx} className="bg-white/80 p-5 rounded-2xl border border-red-100 flex gap-4">
                         <span className="text-red-500 font-black">!</span>
                         <p className="text-sm font-bold text-slate-800">{tip}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </section>

            {/* Hidden Gems & Footer Disclaimer */}
            <div className="flex flex-col items-center text-center space-y-12 pb-24">
              

              <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 flex items-center gap-4">
                 <span className="text-amber-500 text-xl font-bold">⚠️</span>
                 <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Note: Yatra AI may make Mistakes. Verify Important Info.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BudgetRow = ({ label, amount }: { label: string, amount: number }) => (
  <div className="flex justify-between items-center group">
    <span className="text-sm font-medium text-white/50">{label}</span>
    <span className="text-base font-bold text-white">₹{amount.toLocaleString()}</span>
  </div>
);

export default DestinationDetails;
