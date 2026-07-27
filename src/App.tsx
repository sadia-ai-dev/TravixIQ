import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Compass, Shield, DollarSign, Heart, Sun, Activity, Star, Award, Moon, 
  Settings, User, Menu, X, ArrowLeft, LogOut, Loader2, Wifi, WifiOff 
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TravelPlanner from './components/TravelPlanner';
import TravelPulse from './components/TravelPulse';
import BudgetOptimizer from './components/BudgetOptimizer';
import MuslimAssistant from './components/MuslimAssistant';
import ScamShield from './components/ScamShield';
import Profile from './components/Profile';
import SettingsComponent from './components/Settings';
import Footer from './components/Footer';
import TransitionProvider from './components/TransitionProvider';

import { 
  Trip, TravelPulseData, BudgetOptimizerData, 
  MuslimAssistantData, ScamShieldData, UserProfileData, 
  UserPreferences, TravelGoal 
} from './types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  currency: 'USD',
  ramadanMode: false,
  budgetPreference: 'moderate',
  travelStyles: ['adventure']
};

const DEFAULT_PROFILE: UserProfileData = {
  name: "Naveed",
  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Naveed",
  preferences: DEFAULT_PREFERENCES,
  statistics: {
    tripsPlanned: 1,
    countriesVisited: 3,
    scamsAvoided: 12,
    mosquesFound: 5,
    budgetSaved: "$450"
  },
  achievements: [
    { id: "1", title: "Compass Pioneer", description: "Configured and launched your first multi-day travel planner with AI.", iconName: "compass", unlockedAt: "2026-07-15" },
    { id: "2", title: "Safe Explorer", description: "Scanned scenario using the AI Scam scanner and avoided active street decoy traps.", iconName: "shield" },
    { id: "3", title: "Budget Guru", description: "Achieved optimal budget ratios of 100% distribution across category limits.", iconName: "dollar" },
    { id: "4", title: "Halal Nomad", description: "Located certified Halal restaurants and verified astronomical mosque coordinates.", iconName: "heart" }
  ],
  goals: [
    { id: "g1", title: "Check Tokyo Walkability Index", target: "Tokyo, Japan", progress: 35, completed: false },
    { id: "g2", title: "Optimizing Cairo dining guides", target: "Cairo, Egypt", progress: 0, completed: false },
    { id: "g3", title: "Build standard Rome adventure plan", target: "Rome, Italy", progress: 100, completed: true }
  ]
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname === '/' ? 'landing' : location.pathname.substring(1);
  const [destination, setDestination] = useState<string>('Tokyo, Japan');
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  
  // Telemetry caches
  const [pulseData, setPulseData] = useState<TravelPulseData | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetOptimizerData | null>(null);
  const [muslimData, setMuslimData] = useState<MuslimAssistantData | null>(null);
  const [scamData, setScamData] = useState<ScamShieldData | null>(null);

  // Profile and recovery
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('TravixIQ_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (err) {
        console.error("Failed to parse local profile:", err);
      }
    }
    const savedTrip = localStorage.getItem('TravixIQ_active_trip');
    if (savedTrip) {
      try {
        const parsedTrip = JSON.parse(savedTrip);
        setActiveTrip(parsedTrip);
        setDestination(parsedTrip.destination);
      } catch (err) {
        console.error("Failed to parse active trip:", err);
      }
    }
  }, []);

  // Save profile helper
  const handleSaveProfile = (updatedProfile: UserProfileData) => {
    setProfile(updatedProfile);
    localStorage.setItem('TravixIQ_profile', JSON.stringify(updatedProfile));
  };

  const handleUpdatePreferences = (prefs: UserPreferences) => {
    const updated = { ...profile, preferences: prefs };
    handleSaveProfile(updated);
  };

  const handleUpdateGoals = (goals: TravelGoal[]) => {
    const updated = { ...profile, goals };
    handleSaveProfile(updated);
  };

  const handleUpdateAvatar = (avatar: string) => {
    const updated = { ...profile, avatar };
    handleSaveProfile(updated);
  };

  const handleUpdateName = (name: string) => {
    const updated = { ...profile, name };
    handleSaveProfile(updated);
  };

  const handleSaveTrip = (trip: Trip) => {
    setActiveTrip(trip);
    localStorage.setItem('TravixIQ_active_trip', JSON.stringify(trip));
    
    // Add to stats
    const tripsPlanned = profile.statistics.tripsPlanned + 1;
    const updated = {
      ...profile,
      statistics: {
        ...profile.statistics,
        tripsPlanned
      }
    };
    handleSaveProfile(updated);
  };

  const handleResetApp = () => {
    localStorage.removeItem('TravixIQ_profile');
    localStorage.removeItem('TravixIQ_active_trip');
    setProfile(DEFAULT_PROFILE);
    setActiveTrip(null);
    setDestination('Tokyo, Japan');
    setPulseData(null);
    setBudgetData(null);
    setMuslimData(null);
    setScamData(null);
    navigate('/');
  };

  const handleStartApp = (targetDestination: string, initialTab: string) => {
    setDestination(targetDestination);
    navigate("/" + initialTab);
    
    // Auto-unlock Compass Pioneer badge if they plan a trip
    if (initialTab === 'planner') {
      const achievements = (profile.achievements || []).map(badge => {
        if (badge.id === "1" && !badge.unlockedAt) {
          return { ...badge, unlockedAt: new Date().toISOString().split('T')[0] };
        }
        return badge;
      });
      handleSaveProfile({ ...profile, achievements });
    }
  };

  const isLight = profile.preferences.theme === 'light';

  // Navigation config
  const navItems = [
    { id: 'dashboard', label: 'Cockpit View', icon: <Compass className="w-4 h-4" /> },
    { id: 'planner', label: 'Travel Planner', icon: <Star className="w-4 h-4" /> },
    { id: 'pulse', label: 'Travel Pulse', icon: <Activity className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget Tool', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'scam-shield', label: 'Scam Shield', icon: <Shield className="w-4 h-4" /> },
    { id: 'muslim', label: 'Halal Helper', icon: <Heart className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];


  useEffect(() => {
    if (profile.preferences.theme === 'dark' || profile.preferences.theme === 'emerald' || profile.preferences.theme === 'sunset') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.preferences.theme]);

  if (activeTab === 'landing') {
    return <LandingPage onStartApp={handleStartApp} />;
  }

  return (
    <div id="app-wrapper" className="min-h-screen flex flex-col md:flex-row transition-colors duration-500 overflow-x-hidden bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-cyan-200 dark:selection:bg-cyan-500 selection:text-cyan-900 dark:selection:text-white">
      
      {/* Side Dock Navigation on Desktop */}
            <aside className="hidden md:flex w-64 flex-shrink-0 md:min-h-screen border-r flex flex-col justify-between bg-white/80 dark:bg-[#121212]/90 border-gray-200 dark:border-zinc-800/80 backdrop-blur-xl relative z-20">
        
        <div>
          {/* Header branding */}
          <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center">
                <Compass className="w-4 h-4 text-zinc-950" />
              </div>
              <div>
                <h2 className={`font-display text-base font-bold tracking-tight text-zinc-900 dark:text-white`}>
                  TravixIQ
                </h2>
                <p className="text-[9px] uppercase tracking-wider text-cyan-400 font-mono">Travel Intel</p>
              </div>
            </div>
            
            <button 
              id="exit-to-landing-desktop"
              onClick={() => navigate('/')}
              className="md:hidden text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => navigate('/' + item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${isActive ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/55 hover:text-gray-900 dark:hover:text-zinc-100"}`}
                >
                  <div className="flex items-center gap-3">                    {item.icon}
                  {item.label}                  </div>                  {item.id === "scam-shield" && !isActive && <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>}
                </button>
              );
            })}
          </nav>
          
          {/* Offline Mode Toggle */}
          <div className="px-4 pb-4">
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              isOfflineMode 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-gray-100 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isOfflineMode ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400'
                }`}>
                  {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                </div>
                <div>
                  <p className={`text-xs font-bold ${isOfflineMode ? 'text-amber-700 dark:text-amber-500' : 'text-gray-700 dark:text-zinc-300'}`}>
                    {isOfflineMode ? 'Offline Mode' : 'Online Sync'}
                  </p>
                  <p className={`text-[9px] font-mono ${isOfflineMode ? 'text-amber-600/80 dark:text-amber-500/80' : 'text-gray-500 dark:text-zinc-500'}`}>
                    {isOfflineMode ? 'Using cached data' : 'Live data active'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                  isOfflineMode ? 'bg-amber-500' : 'bg-gray-300 dark:bg-zinc-600'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isOfflineMode ? 'translate-x-3.5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Exit footer */}
        <div className="p-4 border-t border-zinc-800/50">
          <button 
            id="nav-exit-btn"
            onClick={() => navigate('/')}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Exit to Home
          </button>
        </div>
      </aside>

      {/* Main viewport area */}
      <div className="flex-grow flex flex-col min-h-screen relative overflow-y-auto">
        
        {/* Dynamic header with quick overview */}
        <header className="px-6 py-4 border-b flex items-center justify-between backdrop-blur-md relative z-10 bg-white/80 dark:bg-[#0a0a0a]/80 border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ArrowLeft 
              className={`w-4 h-4 cursor-pointer hover:scale-110 transition-transform text-gray-500 dark:text-zinc-400`} 
              onClick={() => navigate('/')} 
            />
            <span className={`text-xs font-semibold tracking-wide text-gray-800 dark:text-zinc-200`}>
              Destination Telemetry Area
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setProfile(prev => ({ ...prev, preferences: { ...prev.preferences, theme: isLight ? 'dark' : 'light' } }))}
              className="p-2 rounded-full border transition-colors bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-white shadow-sm"
              title="Toggle Light/Dark Theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-300 font-bold uppercase">
              {destination}
            </div>
          </div>
        </header>

        {/* Content switchport */}
        <main className="flex-grow p-6 relative z-10 max-w-7xl w-full mx-auto pb-32 md:pb-8 animate-fade-in">
          <TransitionProvider key={activeTab}>
            <Routes location={location}>
              <Route path="/dashboard" element={
                <Dashboard 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  currentDestination={destination}
                  activeTrip={activeTrip}
                  profile={profile}
                  onNavigate={(path) => navigate('/' + path)}
                  onUpdateGoals={handleUpdateGoals}
                />
              } />
              <Route path="/planner" element={
                <TravelPlanner 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  destination={destination}
                  onSetDestination={setDestination}
                  activeTrip={activeTrip}
                  onSetActiveTrip={setActiveTrip}
                  onSaveTrip={handleSaveTrip}
                />
              } />
              <Route path="/pulse" element={
                <TravelPulse 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  destination={destination}
                  pulseData={pulseData}
                  onSetPulseData={setPulseData}
                />
              } />
              <Route path="/budget" element={
                <BudgetOptimizer 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  destination={destination}
                  budgetData={budgetData}
                  onSetBudgetData={setBudgetData}
                />
              } />
              <Route path="/scam-shield" element={
                <ScamShield 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  destination={destination}
                  scamData={scamData}
                  onSetScamData={setScamData}
                />
              } />
              <Route path="/muslim" element={
                <MuslimAssistant 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  destination={destination}
                  muslimData={muslimData}
                  onSetMuslimData={setMuslimData}
                />
              } />
              <Route path="/profile" element={
                <Profile 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  profile={profile}
                  onUpdateAvatar={handleUpdateAvatar}
                  onUpdateName={handleUpdateName}
                />
              } />
              <Route path="/settings" element={
                <SettingsComponent 
                  isLight={isLight}
                  isOfflineMode={isOfflineMode}
                  preferences={profile.preferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  onResetApp={handleResetApp}
                  profileData={profile}
                />
              } />
            </Routes>
          </TransitionProvider>
        </main>        <Footer />
      </div>


      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-t border-gray-200 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex items-center overflow-x-auto hide-scrollbar px-2 py-2 gap-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate('/' + item.id)}
                className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[72px] min-h-[44px] rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-600 dark:text-cyan-400' 
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:scale-[1.02]'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-0.5 ${isActive ? 'bg-cyan-100 dark:bg-cyan-900/40' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[9px] font-semibold tracking-wide truncate max-w-[68px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );

}
