import { motion } from 'motion/react';
import { 
  User, Award, Bookmark, Compass, Shield, DollarSign, Heart, 
  MapPin, CheckCircle2, Star, Calendar, ChevronRight, Check, Sparkles, Edit 
} from 'lucide-react';
import { UserProfileData } from '../types';

interface ProfileProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  profile: UserProfileData;
  onUpdateAvatar: (avatar: string) => void;
  onUpdateName: (name: string) => void;
}

export default function Profile({isLight, isOfflineMode = false, profile, onUpdateAvatar, onUpdateName }: ProfileProps) {
  
  const avatars = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Naveed",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam"
  ];

  const handleRename = () => {
    const val = prompt("Enter your traveler name:", profile.name);
    if (val && val.trim()) {
      onUpdateName(val.trim());
    }
  };

  const getBadgeColor = (unlocked: boolean) => {
    return unlocked 
      ? 'bg-cyan-600/10 border-cyan-500/30 text-cyan-300' 
      : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-850 text-zinc-500 opacity-60';
  };

  return (
    <div id="profile-view" className={`space-y-6 animate-fade-in`}>
      
      {/* Header Profile Section */}
      <div className={`flex flex-col md:flex-row gap-6 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none`} />
        
        {/* Avatar Area */}
        <div className={`flex flex-col items-center gap-4 flex-shrink-0 relative z-10`}>
          <div className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-zinc-50/50 dark:bg-zinc-950 flex items-center justify-center p-1.5 shadow-xl shadow-cyan-950/40`}>
            <img 
              src={profile.avatar || avatars[0]} 
              alt="Traveler Avatar" 
              className={`w-full h-full object-cover rounded-lg`}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quick Avatar selection bubble */}
          <div className={`flex gap-1`}>
            {avatars.map((avUrl, index) => (
              <button
                key={index}
                onClick={() => onUpdateAvatar(avUrl)}
                className={`w-6 h-6 rounded-full overflow-hidden border transition-all ${
                  profile.avatar === avUrl ? 'border-cyan-400 scale-110' : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={avUrl} alt="picker" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Bio & Details */}
        <div className={`space-y-4 flex-grow relative z-10 text-center md:text-left`}>
          <div className={`space-y-1`}>
            <div className={`flex items-center justify-center md:justify-start gap-2`}>
              <h2 className={`text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-display`}>{profile.name}</h2>
              <button 
                id="profile-rename"
                onClick={handleRename}
                className={`p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white rounded hover:bg-zinc-100 dark:bg-zinc-800 transition-colors`}
              >
                <Edit className={`w-3.5 h-3.5`} />
              </button>
            </div>
            <p className={`text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center justify-center md:justify-start gap-1.5`}>
              <span className={`w-1.5 h-1.5 bg-cyan-500 rounded-full`} />
              Pilot Tier: Explorer Cadet
            </p>
          </div>

          <p className={`text-xs text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed`}>
            Nurturing a healthy obsession with global street gastronomy, pedestrian infrastructure, and safe border tracking. Currently navigating custom trip parameters with real-time AI assistance.
          </p>

          <div className={`flex flex-wrap justify-center md:justify-start gap-2.5`}>
            <span className={`text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold`}>
              Pref: {profile.preferences.budgetPreference}
            </span>
            <span className={`text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold`}>
              Lang: {profile.preferences.language.toUpperCase()}
            </span>
            <span className={`text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase font-bold`}>
              Currency: {profile.preferences.currency}
            </span>
          </div>
        </div>
      </div>

      {/* Stats and Badges Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6`}>
        
        {/* Unlocked Achievements list */}
        <div className={`md:col-span-2 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Award className={`w-4 h-4 text-cyan-400 animate-pulse`} />
            Travel Achievements Badges
          </h3>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3`}>
            {(profile.achievements || []).map((badge) => {
              const isUnlocked = !!badge.unlockedAt;
              return (
                <div 
                  key={badge.id}
                  className={`p-3.5 border rounded-xl flex gap-3 items-center transition-all ${getBadgeColor(isUnlocked)}`}
                >
                  <div className={`p-2.5 bg-zinc-50/50 dark:bg-zinc-950 rounded-lg flex-shrink-0`}>
                    <Star className={`w-5 h-5 ${isUnlocked ? 'text-amber-400 animate-spin-slow' : 'text-zinc-700'}`} />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold text-zinc-900 dark:text-white font-display`}>{badge.title}</h4>
                    <p className={`text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight`}>{badge.description}</p>
                    {isUnlocked && (
                      <span className={`text-[8px] font-mono text-emerald-400 mt-1 inline-block uppercase font-bold`}>Unlocked {badge.unlockedAt}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saved Spots bookmarks panel */}
        <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Bookmark className={`w-4 h-4 text-emerald-400`} />
            Saved spots bookmarks
          </h3>

          <div className={`space-y-2.5`}>
            <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-850 flex items-center justify-between text-xs hover:border-zinc-200 dark:border-zinc-800 transition-colors`}>
              <div className={`space-y-0.5`}>
                <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>The Tsukiji Outer Market</p>
                <p className={`text-[10px] font-mono text-zinc-500`}>Tokyo • Street Gastronomy</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-zinc-500`} />
            </div>

            <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-850 flex items-center justify-between text-xs hover:border-zinc-200 dark:border-zinc-800 transition-colors`}>
              <div className={`space-y-0.5`}>
                <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>The Colosseum Pedestrian Plaza</p>
                <p className={`text-[10px] font-mono text-zinc-500`}>Rome • Historical Sight</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-zinc-500`} />
            </div>

            <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-850 flex items-center justify-between text-xs hover:border-zinc-200 dark:border-zinc-800 transition-colors`}>
              <div className={`space-y-0.5`}>
                <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>Sultanahmet Mosque District</p>
                <p className={`text-[10px] font-mono text-zinc-500`}>Istanbul • Islamic Center</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-zinc-500`} />
            </div>
          </div>
        </div>

      </div>

      {/* Completed travel goals checklist */}
      <div className={`bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl space-y-3.5`}>
        <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
          <CheckCircle2 className={`w-4 h-4 text-emerald-400`} />
          Historic Travel goals scorecard
        </h3>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs`}>
          <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-850 rounded-xl flex items-center justify-between`}>
            <div className={`space-y-0.5`}>
              <p className={`font-bold text-zinc-700 dark:text-zinc-200 line-through`}>Check safety ratings for Tokyo</p>
              <p className={`text-[10px] font-mono text-zinc-500`}>Completed June 2026</p>
            </div>
            <Check className={`w-4 h-4 text-emerald-400`} />
          </div>

          <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-850 rounded-xl flex items-center justify-between`}>
            <div className={`space-y-0.5`}>
              <p className={`font-bold text-zinc-700 dark:text-zinc-200 line-through`}>Draft optimized budget for Cairo</p>
              <p className={`text-[10px] font-mono text-zinc-500`}>Completed July 2026</p>
            </div>
            <Check className={`w-4 h-4 text-emerald-400`} />
          </div>
        </div>
      </div>

    </div>
  );
}
