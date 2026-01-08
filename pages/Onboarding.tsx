
import React, { useState } from 'react';
import { Profile, BudgetLevel } from '../types';
import { INTEREST_OPTIONS } from '../constants';

interface Props {
  onComplete: (preferences: Partial<Profile>) => void;
  onCancel?: () => void;
}

const BUDGET_RANGES = [
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000, level: 'low' as BudgetLevel },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000, level: 'low' as BudgetLevel },
  { label: '₹10,000 - ₹15,000', min: 10000, max: 15000, level: 'classic' as BudgetLevel },
  { label: '₹15,000 - ₹25,000', min: 15000, max: 25000, level: 'classic' as BudgetLevel },
  { label: '₹25,000 - ₹50,000', min: 25000, max: 50000, level: 'standard' as BudgetLevel },
  { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000, level: 'standard' as BudgetLevel },
  { label: '₹1,00,000+', min: 100000, max: 500000, level: 'luxury' as BudgetLevel },
];

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [currentLocation, setCurrentLocation] = useState('');
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState<number | null>(null);
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(2);
  const [groupType, setGroupType] = useState<Profile['travel_group_type']>('couple');
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const finish = () => {
    const budget = selectedBudgetIndex !== null ? BUDGET_RANGES[selectedBudgetIndex] : BUDGET_RANGES[4];
    onComplete({
      current_location: currentLocation || "Mumbai, India",
      budget_total: budget.max,
      budget_label: budget.level,
      people_count: people,
      travel_group_type: groupType,
      trip_duration_days: days,
      interests: interests,
      has_completed_onboarding: true
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-1xl border border-slate-200 space-y-12 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-between items-center gap-8">
           <div className="h-2 bg-slate-100 flex-1 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-700 ease-out" style={{ width: `${(step/3)*100}%` }} />
           </div>
           <span className="text-sm font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Step {step} / 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-10">
            <header className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Base Location</h2>
              <p className="text-lg text-slate-500 font-medium">Where is your starting point?</p>
            </header>
            <div className="space-y-6">
               <div className="space-y-3">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Your City, District, State</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Ishwarpur, Sangli, MH" 
                   className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-base font-semibold"
                   value={currentLocation}
                   onChange={e => setCurrentLocation(e.target.value)}
                 />
               </div>
            </div>
            <div className="flex flex-col gap-6 pt-6">
              <button 
                onClick={() => setStep(2)} 
                disabled={!currentLocation} 
                className=" bg-slate-700 text-white py-3 rounded-2xl text-base font-bold uppercase shadow-2xl shadow-slate-200 disabled:opacity-50 hover:bg-indigo-600 transition-all active:scale-95"
              >
                Continue Setup
              </button>
              <button onClick={onCancel} className="text-sm font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
             <header className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Group Dynamics</h2>
              <p className="text-lg text-slate-500 font-medium">Define your Group type and stay duration.</p>
            </header>
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Days</label>
                  <input type="number" min="1" max="30" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full p-6 bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 rounded-2xl text-lg font-bold outline-none transition-all" />
               </div>
               <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Travelers</label>
                  <input type="number" min="1" max="50" value={people} onChange={e => setPeople(Number(e.target.value))} className="w-full p-6 bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 rounded-2xl text-lg font-bold outline-none transition-all" />
               </div>
            </div>
            <div className="space-y-6">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Travel Mode</label>
               <div className="grid grid-cols-4 gap-4">
                  {['solo', 'couple', 'family', 'friends'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setGroupType(t as any)} 
                      className={`py-3 rounded-2xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${groupType === t ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-300'}`}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>
            <div className="flex gap-6 pt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-2xl text-base font-bold uppercase hover:bg-slate-100 transition-all">Back</button>
              <button onClick={() => setStep(3)} className="flex-[2] bg-slate-900 text-white py-3 rounded-2xl text-base font-bold uppercase  shadow-2xl hover:bg-indigo-600 active:scale-95 transition-all">Preferences</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <header className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Personalization</h2>
              <p className="text-lg text-slate-500 font-medium">Select your budget and core interests.</p>
            </header>
            <div className="space-y-10">
               <div className="space-y-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Budget Bracket</label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {BUDGET_RANGES.map((range, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedBudgetIndex(idx)}
                        className={`p-5 rounded-2xl text-sm font-bold border-2 transition-all text-left flex justify-between items-center ${selectedBudgetIndex === idx ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-slate-50 text-slate-600 border-slate-50 hover:border-indigo-200'}`}
                      >
                        {range.label}
                        {selectedBudgetIndex === idx && <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-sm"></div>}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="space-y-6">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activity Interests</label>
                  <div className="flex flex-wrap gap-3 max-h-56 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 custom-scrollbar shadow-inner">
                    {INTEREST_OPTIONS.map(i => (
                      <button 
                        key={i}
                        onClick={() => toggleInterest(i)}
                        className={`px-5 py-3 rounded-xl text-xs font-bold uppercase transition-all border-2 ${interests.includes(i) ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
            <div className="flex gap-6 pt-6">
              <button onClick={() => setStep(2)} className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-2xl text-base font-bold uppercase hover:bg-slate-100 transition-all">Back</button>
              <button 
                onClick={finish} 
                disabled={interests.length === 0 || selectedBudgetIndex === null}
                className="flex-[2] bg-indigo-600 text-white py-3 rounded-2xl text-base font-black uppercase  shadow-2xl shadow-indigo-100 disabled:opacity-50 active:scale-95 transition-all hover:bg-indigo-700"
              >
                recommend Destinations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
