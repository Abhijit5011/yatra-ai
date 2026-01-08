
import React from 'react';
import { SavedItinerary } from '../types';

interface Props {
  history: SavedItinerary[];
  onSelect: (item: SavedItinerary) => void;
  onBack: () => void;
}

const History: React.FC<Props> = ({ history, onSelect, onBack }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20 px-2">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-10">
          <div className="flex items-center gap-2">
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Saved Trip Plans</h2>
        </div>
        <button 
          onClick={onBack} 
          className="px-6 py-3 bg-white border-2 border-slate-50 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all rounded-2xl shadow-sm"
        >
          Return Home
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {history.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 space-y-8">
             <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] mx-auto flex items-center justify-center rotate-12">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             </div>
             <div className="space-y-2">
               <h3 className="text-xl font-black text-slate-300 uppercase tracking-tight">The archive is currently empty</h3>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">Your future explorations will materialize here once saved.</p>
             </div>
          </div>
        ) : history.map(item => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-8 bg-white rounded-[3rem] border border-slate-50 shadow-xl shadow-slate-200/30 flex flex-col justify-between group cursor-pointer hover:border-indigo-600 hover:-translate-y-2 transition-all duration-500"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-5">
                <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg ">{item.data.best_time_to_visit || 'Anytime'}</span>
                <div className="w-10 h-10 flex-shrink-0 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{item.destination_name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase ">Constructed on {item.date}</p>
              </div>
              <div className="flex gap-4 pt-2">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase ">Budget</p>
                    <p className="text-[12px] font-extrabold text-slate-700 uppercase">₹{item.data.budget_planner.grand_total.toLocaleString()}</p>
                 </div>
                 <div className="w-px h-6 bg-slate-100" />
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase ">Duration</p>
                    <p className="text-[12px] font-extrabold text-slate-700 uppercase">{item.data.days.length} Days</p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
