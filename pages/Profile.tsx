
import React, { useState, useEffect } from 'react';
import { Profile as IProfile } from '../types';
import { INTEREST_OPTIONS } from '../constants';

interface Props {
  profile: IProfile;
  onUpdate: (updated: Partial<IProfile>) => void;
}

const Profile: React.FC<Props> = ({ profile, onUpdate }) => {
  const [fullName, setFullName] = useState(profile.full_name);
  const [location, setLocation] = useState(profile.current_location);
  const [userInterests, setUserInterests] = useState(profile.interests);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFullName(profile.full_name);
    setLocation(profile.current_location);
    setUserInterests(profile.interests);
  }, [profile]);

  const toggleInterest = (interest: string) => {
    setUserInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({
      full_name: fullName,
      current_location: location,
      interests: userInterests
    });
    setSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-1 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 pb-16">
        <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl">
          {fullName[0]?.toUpperCase() || 'U'}
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{fullName}</h2>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">Verified Explorer</span>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">{location}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <h3 className="text-xs font-black text-slate-400 uppercase ">Personal Identification</h3>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase  ml-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-base font-semibold"
                placeholder="Ex: Alexander Pierce"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase  ml-1">Current Base Location</label>
              <input 
                type="text" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-base font-semibold"
                placeholder="Ex: London, UK"
              />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <h3 className="text-xs font-black text-slate-400 uppercase ">Travel Interests</h3>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
             <div className="flex flex-wrap gap-3">
              {INTEREST_OPTIONS.map(i => (
                <button 
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`px-5 py-3 rounded-xl text-xs font-bold transition-all border-2 ${userInterests.includes(i) ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center gap-6 border-t border-slate-100">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto px-8 py-6 bg-indigo-600 text-white rounded-2xl text-base font-black uppercase shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Synchronizing Profile...' : 'Update Explorer Data'}
          </button>
          {showSuccess && <p className="text-sm font-bold text-green-600 uppercase tracking-widest">Profile data successfully updated in database.</p>}
      </div>
    </div>
  );
};

export default Profile;
