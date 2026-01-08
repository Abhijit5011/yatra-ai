
import React, { useState } from 'react';
import { APP_NAME, Icons } from '../constants';
import { dbService } from '../services/supabase';

interface AuthProps {
  onLogin: (userId: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();
      const userId = `user_${btoa(cleanEmail).substring(0, 16)}`;

      if (mode === 'login') {
        const profile = await dbService.getProfile(userId);
        // Check if user exists and password matches
        if (profile && profile.password === password) {
          onLogin(userId);
        } else if (!profile) {
          setError('User not found. Please register.');
        } else {
          setError('Invalid password. Please try again.');
        }
      } else {
        const exists = await dbService.userExists(userId);
        if (exists) {
          setError('Account already exists. Try login.');
        } else {
          await dbService.updateProfile({
            id: userId,
            full_name: fullName.trim() || 'New Traveler',
            password: password, // Save the actual password
            interests: [],
            budget_total: 25000,
            budget_label: 'standard',
            people_count: 2,
            travel_group_type: 'couple',
            current_location: 'India',
            trip_duration_days: 3,
            role: 'user',
            has_completed_onboarding: false,
            created_at: new Date().toISOString(),
            itinerary_history: []
          });
          onLogin(userId);
        }
      }
    } catch (err: any) {
      setError(err.message || 'System error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10  border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl mb-4 transform -rotate-3 transition-transform hover:rotate-0">
            <Icons.Plane />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900">{APP_NAME}</h1>
          <div className="flex gap-4 mt-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button 
              onClick={() => { setMode('login'); setError(''); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase  transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMode('register'); setError(''); }}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase  transition-all ${mode === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[9px] font-black uppercase text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-400 ml-1 ">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs font-bold"
                placeholder="Ex: Sanskar Shinde"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 ml-1 ">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs font-bold"
              placeholder="Ex: traveller@gmail.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-slate-400 ml-1 tracking-widest">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs font-bold"
              placeholder="Enter Password"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-800 text-white py-4 rounded-2xl text-[15px] font-bold uppercase  shadow-lg hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              mode === 'login' ? 'LOGIN' : 'Create Profile'
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-50">
          <p className="text-center text-[9px] text-slate-300 font-bold uppercase leading-relaxed ">
            {mode === 'login' ? 'Secure Login with Database verification.' : 'Your data is synced in real-time.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
