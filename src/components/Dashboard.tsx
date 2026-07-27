import { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, X, Shield, DollarSign, Heart, Sun, Activity, Star, Award, TrendingUp, ChevronRight, Plus, MapPin, CheckCircle2, CloudSun } from 'lucide-react';
import { Trip, TravelGoal, UserProfileData } from '../types';

interface DashboardProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  currentDestination: string;
  activeTrip: Trip | null;
  profile: UserProfileData;
  onNavigate: (tab: string) => void;
  onUpdateGoals: (goals: TravelGoal[]) => void;
}

export default function Dashboard({isLight, isOfflineMode = false, currentDestination, activeTrip, profile, onNavigate, onUpdateGoals }: DashboardProps) {
  // Compute some quick statistics
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const completedGoalsCount = (profile.goals || []).filter(g => g.completed).length;

  const handleToggleGoal = (id: string) => {
    const updated = (profile.goals || []).map(goal => {
      if (goal.id === id) {
        const completed = !goal.completed;
        return {
          ...goal,
          completed,
          progress: completed ? 100 : 35
        };
      }
      return goal;
    });
    onUpdateGoals(updated);
  };

  const handleAddGoal = () => {
    const title = prompt("Enter a new travel goal (e.g. Visit the Colosseum, Try Halal Ramen):");
    if (!title || !title.trim()) return;
    const target = prompt("Enter a target (e.g. Tokyo, Rome, or 'Summer 2026'):") || "Global";
    
    const newGoal: TravelGoal = {
      id: Math.random().toString(36).substring(7),
      title: title.trim(),
      target: target.trim(),
      progress: 0,
      completed: false
    };
    onUpdateGoals([...(profile.goals || []), newGoal]);
  };

  return (
    <div id="dashboard-view" className={`space-y-6 animate-fade-in`}>
      {/* Welcome Banner */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 text-slate-900 dark:bg-slate-800 dark:text-white p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md relative overflow-hidden`}>
        <div className={`absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none`} />
        <div className={`space-y-1 z-10`}>
          <h2 className={`text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight`}>
            Welcome Back, <span className={`text-transparent bg-gradient-to-r from-cyan-300 to-emerald-400 bg-clip-text font-extrabold`}>{profile.name}</span>
          </h2>
          <p className={`text-zinc-500 dark:text-zinc-400 text-sm`}>
            {currentDestination 
              ? `You are currently piloting trip parameters for: ${currentDestination}` 
              : "Ready to launch a new travel adventure? Specify a destination to begin."}
          </p>
        </div>
        <div className={`mt-4 sm:mt-0 flex gap-2.5 z-10`}>
          <button 
            id="dash-quick-plan"
            onClick={() => onNavigate('planner')}
            className={`px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/20 hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5 cursor-pointer`}
          >
            <Compass className={`w-4 h-4`} />
            Planner Cockpit
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className={`grid grid-cols-2 lg:grid-cols-5 gap-4`}>
        <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md animate-slide-up delay-100`}>
          <div className={`p-2 bg-cyan-500/10 text-cyan-400 rounded-lg`}>
            <Compass className={`w-5 h-5`} />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-widest text-zinc-500 font-mono`}>Trips Saved</p>
            <p className={`text-lg font-bold text-zinc-900 dark:text-white font-mono`}>{profile.statistics.tripsPlanned}</p>
          </div>
        </div>

        <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md animate-slide-up delay-200`}>
          <div className={`p-2 bg-emerald-500/10 text-emerald-400 rounded-lg`}>
            <TrendingUp className={`w-5 h-5`} />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-widest text-zinc-500 font-mono`}>Budget Saved</p>
            <p className={`text-lg font-bold text-zinc-900 dark:text-white font-mono`}>{profile.statistics.budgetSaved}</p>
          </div>
        </div>

        <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md animate-slide-up delay-300`}>
          <div className={`p-2 bg-rose-500/10 text-rose-400 rounded-lg`}>
            <Shield className={`w-5 h-5`} />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-widest text-zinc-500 font-mono`}>Scams Shielded</p>
            <p className={`text-lg font-bold text-zinc-900 dark:text-white font-mono`}>{profile.statistics.scamsAvoided}</p>
          </div>
        </div>

        <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md animate-slide-up delay-400`}>
          <div className={`p-2 bg-amber-500/10 text-amber-400 rounded-lg`}>
            <Heart className={`w-5 h-5`} />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-widest text-zinc-500 font-mono`}>Mosques Found</p>
            <p className={`text-lg font-bold text-zinc-900 dark:text-white font-mono`}>{profile.statistics.mosquesFound}</p>
          </div>
        </div>

        <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3 hover:scale-[1.02] transition-all duration-300 shadow-sm hover:shadow-md animate-slide-up delay-500 col-span-2 lg:col-span-1`}>
          <div className={`p-2 bg-sky-500/10 text-sky-400 rounded-lg`}>
            <Award className={`w-5 h-5`} />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-widest text-zinc-500 font-mono`}>Achievements</p>
            <p className={`text-lg font-bold text-zinc-900 dark:text-white font-mono`}>{profile.achievements.length}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-layouts split */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up delay-200`}>
        
        {/* Current / Active Trip brief card */}
        <div className={`lg:col-span-2 space-y-6`}>
          <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4 shadow-sm`}>
            <div className={`flex justify-between items-center border-b border-zinc-200 dark:border-zinc-850 pb-3`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-2`}>
                <Compass className={`w-4 h-4 text-cyan-400 animate-spin-slow`} />
                Active Trip Parameters
              </h3>
              {activeTrip && (
                <span className={`text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 rounded-full`}>
                  SAVED
                </span>
              )}
            </div>

            {activeTrip ? (
              <div className={`space-y-4`}>
                <div className={`flex items-center justify-between`}>
                  <div>
                    <h4 className={`text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                      <MapPin className={`w-4 h-4 text-emerald-400`} />
                      {activeTrip.destination}
                    </h4>
                    <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono`}>
                      {activeTrip.durationDays} Days • Style: {activeTrip.style} • Companion: {activeTrip.companionMode}
                    </p>
                  </div>
                  <div className={`text-right`}>
                    <p className={`text-[10px] font-mono text-zinc-500 uppercase tracking-widest`}>Est. Cost</p>
                    <p className={`text-base font-bold text-emerald-400 font-mono`}>{activeTrip.totalEstimatedCost}</p>
                  </div>
                </div>

                <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 space-y-2`}>
                  <p className={`text-xs font-semibold text-cyan-300 uppercase tracking-wider font-mono`}>Day 1 Theme Spotlight</p>
                  <p className={`text-sm text-zinc-700 dark:text-zinc-200 font-medium`}>"{activeTrip.itinerary?.[0]?.theme || 'Getting settled and exploring'}"</p>
                  <div className={`pt-2 border-t border-zinc-200 dark:border-zinc-850 mt-2`}>
                    <p className={`text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed`}>
                      First stop scheduled: <strong className={`text-zinc-100`}>{activeTrip.itinerary?.[0]?.activities?.[0]?.title || 'Arrival & Check-in'}</strong> at {activeTrip.itinerary?.[0]?.activities?.[0]?.time || 'TBD'}.
                    </p>
                  </div>
                </div>

                <div className={`flex justify-between items-center pt-2`}>
                  <span className={`text-xs text-zinc-500 dark:text-zinc-400`}>Total activities generated: {activeTrip.itinerary?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) || 0}</span>
                  <button 
                    id="dash-view-full-itinerary"
                    onClick={() => onNavigate('planner')}
                    className={`text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer`}
                  >
                    View Full Itinerary
                    <ChevronRight className={`w-4 h-4`} />
                  </button>
                </div>
              </div>
            ) : (
              <div className={`text-center py-12 space-y-3`}>
                <Compass className={`w-10 h-10 text-zinc-600 mx-auto stroke-[1.5]`} />
                <p className={`text-sm text-zinc-500 dark:text-zinc-400`}>No active travel parameters planned yet.</p>
                <p className={`text-xs text-zinc-500 max-w-sm mx-auto`}>Input a destination and style to build your detailed AI itinerary complete with local maps and safety telemetry.</p>
                <button 
                  id="dash-quick-setup"
                  onClick={() => onNavigate('planner')}
                  className={`px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-xl text-xs font-semibold transition-all inline-block mt-2 cursor-pointer`}
                >
                  Quick Setup
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className={`bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl space-y-4`}>
            <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white`}>Rapid Navigation</h3>
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3`}>
              {[
                { id: 'pulse', label: 'Travel Pulse', icon: Sun, color: 'text-amber-400', nav: 'pulse' },
                { id: 'budget', label: 'Budget Tool', icon: DollarSign, color: 'text-emerald-400', nav: 'budget' },
                { id: 'scam-shield', label: 'Scam Shield', icon: Shield, color: 'text-rose-400', nav: 'scam-shield' },
                { id: 'muslim', label: 'Halal Helper', icon: Heart, color: 'text-sky-400', nav: 'muslim' }
              ].map((action, index) => (
                <button 
                  key={action.id}
                  id={`dash-nav-${action.id}`}
                  onClick={() => onNavigate(action.nav as any)}
                  className={`p-3 bg-white dark:bg-zinc-900/80 hover:bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 rounded-xl text-center space-y-2 group transition-all cursor-pointer animate-slide-up delay-${(index + 1) * 100}`}
                >
                  <action.icon className={`w-5 h-5 ${action.color} mx-auto`} />
                  <p className={`text-xs font-semibold text-zinc-700 dark:text-zinc-200`}>{action.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Goals, Weather, Recent Searches */}
        <div className={`space-y-6`}>
          {/* Travel Goals Checklist */}
          <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4 shadow-sm`}>
            <div className={`flex justify-between items-center border-b border-zinc-200 dark:border-zinc-850 pb-3`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <Award className={`w-4 h-4 text-cyan-400`} />
                Travel Goals
              </h3>
              <button 
                id="dash-add-goal"
                onClick={handleAddGoal}
                className={`p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-750 transition-colors cursor-pointer`}
              >
                <Plus className={`w-3.5 h-3.5`} />
              </button>
            </div>

            <div className={`space-y-3`}>
              {(profile.goals || []).map((goal, index) => (
                <div 
                  key={goal.id} 
                  onClick={() => handleToggleGoal(goal.id)}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer animate-slide-up transition-all opacity-0 fill-mode-forwards ${
                    goal.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-zinc-600 dark:text-zinc-300' 
                      : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 hover:border-zinc-700 text-zinc-100'
                  }`}
                >
                  <div className={`space-y-1`}>
                    <p className={`text-xs font-semibold ${goal.completed ? 'line-through text-zinc-500' : ''}`}>{goal.title}</p>
                    <p className={`text-[10px] font-mono text-zinc-500`}>{goal.target}</p>
                  </div>
                  <div className={`flex-shrink-0`}>
                    <CheckCircle2 className={`w-4 h-4 ${goal.completed ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Weather / Air Quality telemetry */}
          <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4 shadow-sm`}>
            <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5`}>
              <CloudSun className={`w-4 h-4 text-amber-400`} />
              Live Destination Intel
            </h3>
            
            <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 space-y-3`}>
              <div className={`flex justify-between items-center`}>
                <div>
                  <h4 className={`text-sm font-bold text-zinc-900 dark:text-white`}>{currentDestination || "Tokyo, Japan"}</h4>
                  <p className={`text-[10px] font-mono text-zinc-500 dark:text-zinc-400`}>Current Forecast</p>
                </div>
                <div className={`text-right`}>
                  <p className={`text-xl font-bold font-mono text-amber-400`}>24°C</p>
                  <p className={`text-[10px] font-mono text-zinc-500 dark:text-zinc-400`}>Partly Cloudy</p>
                </div>
              </div>
              
              <div className={`border-t border-zinc-200 dark:border-zinc-850 pt-2.5 grid grid-cols-2 gap-2 text-center text-xs`}>
                <div>
                  <p className={`text-[10px] font-mono text-zinc-500 uppercase`}>Humidity</p>
                  <p className={`font-bold text-zinc-600 dark:text-zinc-300 font-mono`}>62%</p>
                </div>
                <div>
                  <p className={`text-[10px] font-mono text-zinc-500 uppercase`}>AQI Index</p>
                  <p className={`font-bold text-emerald-400 font-mono`}>34 (Stellar)</p>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* Floating Quick Actions Menu */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
        {quickActionsOpen && (
          <div className="flex flex-col gap-3 animate-slide-up origin-bottom">
            <button 
              onClick={() => { setQuickActionsOpen(false); onNavigate('budget'); }}
              className="flex items-center gap-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2.5 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition-all"
            >
              <span className="text-sm font-medium">Log Expense</span>
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-full text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </button>
            
            <button 
              onClick={() => { setQuickActionsOpen(false); onNavigate('planner'); }}
              className="flex items-center gap-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2.5 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition-all"
            >
              <span className="text-sm font-medium">Pin Location</span>
              <div className="bg-rose-100 dark:bg-rose-900/50 p-1.5 rounded-full text-rose-600 dark:text-rose-400">
                <MapPin className="w-4 h-4" />
              </div>
            </button>
            
            <button 
              onClick={() => { setQuickActionsOpen(false); onNavigate('scam'); }}
              className="flex items-center gap-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2.5 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-105 transition-all"
            >
              <span className="text-sm font-medium">Scam Check</span>
              <div className="bg-amber-100 dark:bg-amber-900/50 p-1.5 rounded-full text-amber-600 dark:text-amber-400">
                <Shield className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
        
        <button
          onClick={() => setQuickActionsOpen(!quickActionsOpen)}
          className={`p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center ${
            quickActionsOpen 
              ? 'bg-zinc-800 dark:bg-zinc-700 text-white rotate-45' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white'
          }`}
        >
          {quickActionsOpen ? <Plus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
      </div>

      </div>
    </div>
  );
}
