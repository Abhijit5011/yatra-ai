
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
import Onboarding from './pages/Onboarding';
import DestinationDetails from './pages/DestinationDetails';
import HistoryPage from './pages/History';
import Auth from './pages/Auth';
import { dbService } from './services/supabase';
import { Profile } from './types';

type ViewState = 'dashboard' | 'details' | 'profile' | 'history';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('yatra_user_id'));
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);
  const [historyPlanData, setHistoryPlanData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isPlanningNew, setIsPlanningNew] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoadingProfile(true);
      dbService.getProfile(userId).then(p => {
        if (!p) {
          setIsPlanningNew(true);
        } else {
          setProfile(p);
          if (!p.has_completed_onboarding) {
            setIsPlanningNew(true);
          }
        }
        setLoadingProfile(false);
      }).catch(err => {
        console.error("Profile load failed:", err);
        setLoadingProfile(false);
      });
    }
  }, [userId]);

  const handleLogin = (id: string) => {
    setUserId(id);
    localStorage.setItem('yatra_user_id', id);
  };

  const handleLogout = () => {
    setUserId(null);
    setProfile(null);
    setIsPlanningNew(false);
    localStorage.removeItem('yatra_user_id');
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = async (updates: Partial<Profile>) => {
    if (userId) {
      const existing = profile || { 
        id: userId, 
        full_name: 'Traveler',
        interests: [],
        budget_total: 50000,
        budget_label: 'standard',
        people_count: 2,
        travel_group_type: 'couple',
        current_location: 'India',
        trip_duration_days: 3,
        role: 'user',
        has_completed_onboarding: true,
        created_at: new Date().toISOString(),
        itinerary_history: []
      } as Profile;
      
      const newProfile = { ...existing, ...updates, has_completed_onboarding: true } as Profile;
      setProfile(newProfile);
      
      try {
        await dbService.updateProfile(newProfile);
        setIsPlanningNew(false);
        setCurrentView('dashboard');
      } catch (err) {
        alert("Failed to save profile. Please try again.");
      }
    }
  };

  const handleSavePlan = async (plan: any) => {
    if (profile && userId) {
      try {
        await dbService.saveItinerary(userId, plan);
        const updatedProfile = await dbService.getProfile(userId);
        if (updatedProfile) setProfile(updatedProfile);
      } catch (err) {
        console.error("Failed to save itinerary:", err);
      }
    }
  };

  if (!userId) return <Auth onLogin={handleLogin} />;
  
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center font-sans">
        <div className="space-y-6">
           <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
           <p className="text-sm font-bold text-slate-500 uppercase  animate-pulse">Syncing Yatra AI...</p>
        </div>
      </div>
    );
  }

  // Handle onboarding or "New Plan" mode
  if (isPlanningNew) {
    return (
      <Onboarding 
        onComplete={handleUpdateProfile} 
        onCancel={() => {
          if (profile && profile.has_completed_onboarding) {
            setIsPlanningNew(false);
          } else {
            handleLogout();
          }
        }} 
      />
    );
  }

  if (!profile) return null;

  return (
    <Layout 
      onLogout={handleLogout} 
      activeTab={currentView}
      setActiveTab={(tab) => {
        setHistoryPlanData(null);
        setSelectedDestId(null);
        setCurrentView(tab as ViewState);
      }}
    >
      {currentView === 'details' && selectedDestId ? (
        <DestinationDetails 
          id={selectedDestId} 
          profile={profile} 
          onBack={() => {
            setSelectedDestId(null);
            setCurrentView('dashboard');
          }} 
          onSavePlan={handleSavePlan}
          initialData={historyPlanData}
        />
      ) : currentView === 'history' ? (
        <HistoryPage 
          history={profile.itinerary_history || []}
          onSelect={(item) => {
            setSelectedDestId(item.destination_id);
            setHistoryPlanData(item.data);
            setCurrentView('details');
          }}
          onBack={() => setCurrentView('dashboard')}
        />
      ) : currentView === 'profile' ? (
        <ProfilePage 
          profile={profile} 
          onUpdate={handleUpdateProfile} 
        />
      ) : (
        <Dashboard 
          profile={profile} 
          onSelectDestination={(id) => {
            setSelectedDestId(id);
            setCurrentView('details');
          }} 
          onStartNewPlan={() => setIsPlanningNew(true)}
          onViewHistory={() => setCurrentView('history')}
        />
      )}
    </Layout>
  );
};

export default App;
