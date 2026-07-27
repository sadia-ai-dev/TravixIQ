import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Sun, Compass, MapPin, Coffee, Utensils, Info, AlertCircle, 
  HelpCircle, RefreshCw, Loader2, Volume2, Sparkles, AlertTriangle 
} from 'lucide-react';
import { MuslimAssistantData } from '../types';

interface MuslimAssistantProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  destination: string;
  muslimData: MuslimAssistantData | null;
  onSetMuslimData: (data: MuslimAssistantData | null) => void;
}

export default function MuslimAssistant({isLight, isOfflineMode = false, destination, muslimData, onSetMuslimData }: MuslimAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ramadanMode, setRamadanMode] = useState(false);
  
  // Audio notification simulation
  const [notifiedPrayer, setNotifiedPrayer] = useState<string | null>(null);

  const fetchMuslimAssistant = async (targetDest: string, isRamadan: boolean) => {
    if (!targetDest.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (isOfflineMode) {
        const cached = localStorage.getItem(`muslim_${targetDest.trim().toLowerCase()}_${isRamadan}`);
        if (cached) {
          onSetMuslimData(JSON.parse(cached));
          setLoading(false);
          return;
        } else {
          throw new Error('No offline Halal Helper data available for this destination.');
        }
      }

      const response = await fetch('/api/muslim-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: targetDest.trim(), ramadanMode: isRamadan })
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server. Could not connect to the AI engine. Please check your local server.");
      }
      const data = await response.json();
      onSetMuslimData(data);
      localStorage.setItem(`muslim_${targetDest.trim().toLowerCase()}_${isRamadan}`, JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to the AI engine. Please check your local server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destination) {
      fetchMuslimAssistant(destination, ramadanMode);
    }
  }, [destination, ramadanMode]);

  const handleSimulateAthan = (prayer: string) => {
    setNotifiedPrayer(prayer);
    setTimeout(() => {
      setNotifiedPrayer(null);
    }, 4000);
  };

  return (
    <div id="muslim-assistant-view" className={`space-y-6 animate-fade-in`}>
      
      {/* Header and Ramadan Toggle */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5`}>
        <div>
          <h2 className={`text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white flex items-center gap-2`}>
            <Heart className={`w-5 h-5 text-cyan-400 fill-cyan-400/20`} />
            Muslim Traveler Assistant
          </h2>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>Accurate local prayer schedules, certified Halal dining reviews, and visual Qibla indicators.</p>
        </div>

        {/* Ramadan Mode switch */}
        <div className={`flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl text-xs`}>
          <span className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Ramadan Mode</span>
          <button 
            id="ramadan-mode-toggle"
            onClick={() => setRamadanMode(!ramadanMode)}
            className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${
              ramadanMode ? 'bg-cyan-500' : 'bg-zinc-100 dark:bg-zinc-800'
            }`}
          >
            <div 
              className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                ramadanMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {loading ? (
        <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3 flex flex-col items-center justify-center`}>
          <Loader2 className={`w-10 h-10 text-cyan-400 animate-spin`} />
          <h4 className={`text-base font-bold text-zinc-900 dark:text-white font-display`}>Averaging Astronomical Horizons</h4>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 max-w-sm`}>Mapping local geometric coordinates to Mecca, querying certified halal dining directories, and scheduling prayer matrices...</p>
        </div>
      ) : muslimData ? (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 items-start`}>
          
          {/* Prayer schedules and Compass */}
          <div className={`lg:col-span-2 space-y-6`}>
            
            {/* Simulation Notification */}
            {notifiedPrayer && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl flex items-center justify-between text-cyan-300 text-xs font-semibold`}
              >
                <div className={`flex items-center gap-2`}>
                  <Volume2 className={`w-4 h-4 text-cyan-400 animate-bounce`} />
                  <span>Simulating localized Athan notifications for: {notifiedPrayer} prayer time.</span>
                </div>
                <span className={`text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded font-mono`}>ATHAN LIVE</span>
              </motion.div>
            )}

            {/* Prayer Times Grid */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center justify-between`}>
                <span>Prayer schedule (Local Standard Time)</span>
                <span className={`text-[10px] font-mono text-zinc-500 dark:text-zinc-400`}>Angle: {muslimData.qiblaAngle}° Qibla</span>
              </h3>

              <div className={`grid grid-cols-5 gap-2.5`}>
                {Object.entries(muslimData.prayerTimes || {}).map(([name, time], idx) => {
                  const isCurrent = idx === 2; // Simulating Dhuhr or Asr is next
                  return (
                    <div 
                      key={name}
                      onClick={() => handleSimulateAthan(name)}
                      className={`p-3 rounded-xl border text-center space-y-1 cursor-pointer transition-all ${
                        isCurrent 
                          ? 'bg-cyan-500/5 border-cyan-500/40 shadow-lg shadow-cyan-500/5 ring-1 ring-cyan-500/10' 
                          : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 hover:border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <p className={`text-[10px] uppercase font-bold tracking-wider font-mono ${isCurrent ? 'text-cyan-400' : 'text-zinc-500'}`}>{name}</p>
                      <p className={`text-xs font-extrabold text-zinc-900 dark:text-white font-mono`}>{time}</p>
                      {isCurrent && (
                        <span className={`text-[8px] font-mono font-bold bg-cyan-500 text-zinc-950 px-1 py-0.5 rounded inline-block`}>NEXT</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Halal restaurants and Mosques */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
              
              {/* Halal Dining options */}
              <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3`}>
                <h4 className={`text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5`}>
                  <Utensils className={`w-3.5 h-3.5`} />
                  Verified Halal Eating Options
                </h4>

                <div className={`space-y-3`}>
                  {(muslimData.halalRestaurants || []).map((rest, idx) => (
                    <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-850 text-xs space-y-1.5`}>
                      <div className={`flex justify-between items-center`}>
                        <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>{rest.name}</p>
                        <span className={`text-[10px] font-mono text-emerald-400`}>{rest.rating}</span>
                      </div>
                      <p className={`text-[11px] text-zinc-500 dark:text-zinc-400`}>Cuisine: {rest.cuisine}</p>
                      <div className={`pt-1.5 border-t border-zinc-200 dark:border-zinc-850 flex justify-between items-center text-[10px] text-zinc-500 font-mono`}>
                        <span>{rest.address}</span>
                        <span className={`text-[9px] font-bold bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20`}>{rest.halalCertification}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nearby Mosques list */}
              <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3`}>
                <h4 className={`text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-1.5`}>
                  <Compass className={`w-3.5 h-3.5 animate-pulse`} />
                  Nearby Places of Worship
                </h4>

                <div className={`space-y-3`}>
                  {(muslimData.nearbyMosques || []).map((mosque, idx) => (
                    <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-850 text-xs space-y-1`}>
                      <div className={`flex justify-between items-center`}>
                        <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>{mosque.name}</p>
                        <span className={`text-[10px] font-mono text-cyan-400 font-bold`}>{mosque.distance}</span>
                      </div>
                      <p className={`text-zinc-500 text-[11px] font-mono`}>{mosque.address}</p>
                      {mosque.facilities && (
                        <div className={`flex gap-1.5 flex-wrap pt-1`}>
                          {(mosque.facilities || []).map((fac, fIdx) => (
                            <span key={fIdx} className={`text-[8px] bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-850 font-mono`}>{fac}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Sidebar: Qibla Compass & Islamic travel tips */}
          <div className={`space-y-6`}>
            
            {/* Visual Qibla Compass */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <Compass className={`w-4 h-4 text-cyan-400`} />
                Live Qibla Compass
              </h3>

              <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center space-y-4 relative`}>
                {/* Simulated compass dial */}
                <div className={`relative w-36 h-36 rounded-full border-4 border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 shadow-2xl`}>
                  {/* Compass markings */}
                  <span className={`absolute top-2 text-[10px] font-mono text-rose-400 font-bold`}>N</span>
                  <span className={`absolute bottom-2 text-[10px] font-mono text-zinc-500 font-bold`}>S</span>
                  <span className={`absolute right-2 text-[10px] font-mono text-zinc-500 font-bold`}>E</span>
                  <span className={`absolute left-2 text-[10px] font-mono text-zinc-500 font-bold`}>W</span>

                  {/* Rotated arrow pointer pointing to Qibla Angle */}
                  <div 
                    className={`absolute w-full h-full flex items-center justify-center transition-transform duration-1000`}
                    style={{ transform: `rotate(${muslimData.qiblaAngle}deg)` }}
                  >
                    {/* The Qibla arrow indicator */}
                    <div className={`relative w-2 h-20 flex flex-col items-center`}>
                      <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-cyan-400`} />
                      <div className={`w-1 h-14 bg-cyan-500/40`} />
                    </div>
                  </div>
                </div>

                <div className={`text-center space-y-1.5`}>
                  <p className={`text-xs text-zinc-600 dark:text-zinc-300 font-semibold`}>Qibla Direction: <span className={`text-cyan-400 font-bold font-mono`}>{muslimData.qiblaAngle}°</span> relative to North</p>
                  <p className={`text-[10px] text-zinc-500 max-w-xs leading-normal`}>
                    Rotate your device until the compass N indicator lines up with your surrounding local compass alignment.
                  </p>
                </div>
              </div>
            </div>

            {/* Ramadan Mode alerts */}
            {ramadanMode && (
              <div className={`bg-cyan-950/25 border border-cyan-500/20 p-4 rounded-xl space-y-2 text-xs leading-relaxed`}>
                <h4 className={`font-semibold text-cyan-300 flex items-center gap-1.5`}>
                  <Sparkles className={`w-4 h-4 text-cyan-400 animate-spin-slow`} />
                  Active Ramadan Fasting Intelligence
                </h4>
                <p className={`text-zinc-600 dark:text-zinc-300`}>{muslimData.ramadanModeDetails}</p>
              </div>
            )}

            {/* Muslim Travel tips checklist */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <Info className={`w-4 h-4 text-cyan-400`} />
                Islamic Travel tips
              </h3>
              
              <div className={`space-y-3`}>
                {(muslimData.travelTips || []).map((tip, idx) => (
                  <div key={idx} className={`flex gap-2.5 bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed`}>
                    <span className={`text-cyan-400 font-mono font-bold`}>#0{idx+1}</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className={`bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3`}>
          <Heart className={`w-12 h-12 text-zinc-700 mx-auto stroke-[1.25] animate-pulse`} />
          <h4 className={`text-sm font-semibold text-zinc-500 dark:text-zinc-400`}>Helper Offline</h4>
          <p className={`text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed`}>Ensure a destination is selected in the Planner cockpit to activate Halal dining locator maps and astronomical mosque directories.</p>
        </div>
      )}

    </div>
  );
}
