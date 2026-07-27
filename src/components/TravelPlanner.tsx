import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, MapPin, Calendar, Users, Briefcase, Sparkles, AlertCircle, 
  Map, DollarSign, Download, Share2, Copy, RefreshCw, Edit, Plus, Trash2, 
  Utensils, Info, Check, Eye, Coffee, Car, Camera, Loader2 
} from 'lucide-react';
import { Trip, DailyPlan, Activity } from '../types';

interface TravelPlannerProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  destination: string;
  onSetDestination: (dest: string) => void;
  activeTrip: Trip | null;
  onSetActiveTrip: (trip: Trip | null) => void;
  onSaveTrip: (trip: Trip) => void;
}

export default function TravelPlanner({isLight, isOfflineMode = false, 
  destination, 
  onSetDestination, 
  activeTrip, 
  onSetActiveTrip, 
  onSaveTrip 
}: TravelPlannerProps) {
  const [duration, setDuration] = useState(3);
  const [style, setStyle] = useState<'luxury' | 'adventure' | 'business' | 'student' | 'solo' | 'family'>('adventure');
  const [companion, setCompanion] = useState<'solo' | 'family' | 'couple' | 'friends'>('solo');
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Day selection for showing itinerary days
  const [selectedDay, setSelectedDay] = useState(1);

  const handleGenerate = async () => {
    if (!destination.trim()) {
      setError('Please specify a destination.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      if (isOfflineMode) {
        const cached = localStorage.getItem(`trip_${destination.trim().toLowerCase()}`);
        if (cached) {
          const tripData = JSON.parse(cached);
          onSetActiveTrip(tripData);
          onSaveTrip(tripData);
          setSelectedDay(1);
          setLoading(false);
          return;
        } else {
          throw new Error('No offline trip plan available for this destination.');
        }
      }

      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destination.trim(),
          durationDays: duration,
          style,
          companionMode: companion,
          budgetLevel: budget
        })
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server. Could not connect to the AI engine. Please check your local server.");
      }
      const data = await response.json();
      onSetActiveTrip(data);
      onSaveTrip(data);
      localStorage.setItem(`trip_${destination.trim().toLowerCase()}`, JSON.stringify(data));
      setSelectedDay(1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to the AI engine. Please check your local server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = () => {
    if (!activeTrip) return;
    const duplicated: Trip = {
      ...activeTrip,
      id: Math.random().toString(36).substring(7),
      destination: `${activeTrip.destination} (Copy)`,
      savedAt: new Date().toISOString()
    };
    onSetActiveTrip(duplicated);
    onSaveTrip(duplicated);
    onSetDestination(duplicated.destination);
    alert('Trip duplicated successfully!');
  };

  const handleExportText = () => {
    if (!activeTrip) return;
    
    let content = `=============================================\n`;
    content += `         TravixIQ - TRAVEL ITINERARY     \n`;
    content += `=============================================\n\n`;
    content += `Destination: ${activeTrip.destination}\n`;
    content += `Duration: ${activeTrip.durationDays} Days\n`;
    content += `Style: ${activeTrip.style.toUpperCase()}\n`;
    content += `Companion: ${activeTrip.companionMode.toUpperCase()}\n`;
    content += `Budget Tier: ${activeTrip.budgetLevel.toUpperCase()}\n`;
    content += `Total Estimated Cost: ${activeTrip.totalEstimatedCost}\n\n`;
    content += `---------------------------------------------\n`;
    content += `                DAILY TIMELINE               \n`;
    content += `---------------------------------------------\n`;

    (activeTrip.itinerary || []).forEach((day: DailyPlan) => {
      content += `\nDAY ${day.dayNumber} - ${day.theme}\n`;
      (day.activities || []).forEach((act: Activity) => {
        content += `  [${act.time}] ${act.title} (${act.category.toUpperCase()})\n`;
        content += `  Location: ${act.locationName}\n`;
        content += `  Estimate: ${act.costEstimate}\n`;
        content += `  Details: ${act.description}\n\n`;
      });
    });

    content += `---------------------------------------------\n`;
    content += `                HOTEL OPTIONS                \n`;
    content += `---------------------------------------------\n`;
    (activeTrip.hotels || []).forEach(hotel => {
      content += `• ${hotel.name} (${hotel.rating})\n  Est: ${hotel.costPerNight}/night\n  Reason: ${hotel.reason}\n\n`;
    });

    content += `---------------------------------------------\n`;
    content += `                 PACKING LIST                \n`;
    content += `---------------------------------------------\n`;
    (activeTrip.packingList || []).forEach(item => {
      content += `[ ] ${item}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TravixIQ_${activeTrip.destination.replace(/[^a-z0-9]/gi, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (!activeTrip) return;
    const shareUrl = `${window.location.origin}/?trip=${activeTrip.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: 'sightseeing' | 'food' | 'transport' | 'activity') => {
    switch (category) {
      case 'food': return <Utensils className={`w-4 h-4 text-amber-400`} />;
      case 'transport': return <Car className={`w-4 h-4 text-sky-400`} />;
      case 'sightseeing': return <Camera className={`w-4 h-4 text-emerald-400`} />;
      default: return <Compass className={`w-4 h-4 text-cyan-400`} />;
    }
  };

  const getCategoryColor = (category: 'sightseeing' | 'food' | 'transport' | 'activity') => {
    switch (category) {
      case 'food': return 'bg-amber-400/10 border-amber-400/20 text-amber-300';
      case 'transport': return 'bg-sky-400/10 border-sky-400/20 text-sky-300';
      case 'sightseeing': return 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300';
      default: return 'bg-cyan-400/10 border-cyan-400/20 text-cyan-300';
    }
  };

  const randomLoadingTips = [
    "Factoring local sidewalk scores for walkability...",
    "Querying official tourism boards for seasonal events...",
    "Compiling top-tier local street dining recommendations...",
    "Mapping efficient routes to bypass peak-hour congestion...",
    "Reviewing public transport scheduling variables..."
  ];

  return (
    <div id="planner-view" className={`space-y-6 animate-fade-in relative`}>
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5`}>
        <div>
          <h2 className={`text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white flex items-center gap-2`}>
            <Compass className={`w-5 h-5 text-cyan-400 animate-spin-slow`} />
            Trip Planner Cockpit
          </h2>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>Customize your destination, budget, and companion preferences to build high-fidelity itineraries.</p>
        </div>
        
        {activeTrip && (
          <div className={`flex gap-2 flex-wrap`}>
            <button 
              id="plan-share"
              onClick={() => setShowShareModal(true)}
              className={`px-3.5 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1 cursor-pointer`}
            >
              <Share2 className={`w-3.5 h-3.5`} />
              Share
            </button>
            <button 
              id="plan-download"
              onClick={handleExportText}
              className={`px-3.5 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1 cursor-pointer`}
            >
              <Download className={`w-3.5 h-3.5`} />
              Download
            </button>
            <button 
              id="plan-duplicate"
              onClick={handleDuplicate}
              className={`px-3.5 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md hover:bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1 cursor-pointer`}
            >
              <Copy className={`w-3.5 h-3.5`} />
              Duplicate
            </button>
            <button 
              id="plan-regenerate"
              onClick={handleGenerate}
              className={`px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1 shadow-md shadow-cyan-600/15 cursor-pointer`}
            >
              <RefreshCw className={`w-3.5 h-3.5`} />
              Regenerate
            </button>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 items-start`}>
        
        {/* Lefthand side: Parameters input */}
        <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-2xl space-y-5`}>
          <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Sparkles className={`w-4 h-4 text-cyan-400`} />
            Trip Configuration
          </h3>

          <div className={`space-y-4 text-xs`}>
            {/* Destination */}
            <div className={`space-y-2`}>
              <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Destination Spot</label>
              <div className={`flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-2.5 focus-within:border-cyan-500/40 transition-all`}>
                <MapPin className={`w-4 h-4 text-cyan-400 flex-shrink-0`} />
                <input 
                  id="planner-dest-input"
                  type="text" 
                  placeholder="Paris, Tokyo, etc."
                  value={destination}
                  onChange={(e) => onSetDestination(e.target.value)}
                  className={`w-full bg-transparent border-none text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-650`}
                />
              </div>
            </div>

            {/* Duration */}
            <div className={`space-y-2`}>
              <div className={`flex justify-between items-center`}>
                <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Duration (Days)</label>
                <span className={`font-bold text-cyan-300 font-mono`}>{duration} days</span>
              </div>
              <input 
                id="planner-duration-range"
                type="range"
                min="1"
                max="7"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className={`w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500`}
              />
            </div>

            {/* Travel Style */}
            <div className={`space-y-2`}>
              <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Travel Style Theme</label>
              <div className={`grid grid-cols-3 gap-1.5`}>
                {(['adventure', 'luxury', 'business', 'student', 'solo', 'family'] as const).map((styleOpt) => (
                  <button
                    id={`style-opt-${styleOpt}`}
                    key={styleOpt}
                    onClick={() => setStyle(styleOpt)}
                    className={`py-2 rounded-lg text-[10px] font-semibold uppercase border transition-all cursor-pointer ${
                      style === styleOpt 
                        ? 'bg-cyan-600 border-cyan-500 text-zinc-900 dark:text-white' 
                        : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {styleOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion constraint */}
            <div className={`space-y-2`}>
              <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Companion Mode</label>
              <div className={`grid grid-cols-4 gap-1.5`}>
                {(['solo', 'family', 'couple', 'friends'] as const).map((modeOpt) => (
                  <button
                    id={`mode-opt-${modeOpt}`}
                    key={modeOpt}
                    onClick={() => setCompanion(modeOpt)}
                    className={`py-2 rounded-lg text-[10px] font-semibold uppercase border transition-all cursor-pointer ${
                      companion === modeOpt 
                        ? 'bg-emerald-600 border-emerald-500 text-zinc-900 dark:text-white' 
                        : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {modeOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Tier */}
            <div className={`space-y-2`}>
              <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Budget Tier Level</label>
              <div className={`grid grid-cols-3 gap-2`}>
                {(['budget', 'moderate', 'luxury'] as const).map((budgetOpt) => (
                  <button
                    id={`budget-opt-${budgetOpt}`}
                    key={budgetOpt}
                    onClick={() => setBudget(budgetOpt)}
                    className={`py-2 rounded-lg text-[10px] font-semibold uppercase border transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                      budget === budgetOpt 
                        ? 'bg-amber-600 border-amber-500 text-zinc-900 dark:text-white animate-pulse-slow' 
                        : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <DollarSign className={`w-3 h-3`} />
                    {budgetOpt}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className={`text-rose-400 font-medium flex items-center gap-1 py-1`}>
                <AlertCircle className={`w-3.5 h-3.5`} />
                {error}
              </p>
            )}

            <button
              id="planner-generate-btn"
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3.5 bg-gradient-to-tr from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-zinc-900 dark:text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-cyan-600/15 hover:shadow-cyan-600/25 active:scale-[0.99] flex items-center justify-center gap-2 text-xs cursor-pointer`}
            >
              {loading ? (
                <>
                  <Loader2 className={`w-4 h-4 animate-spin`} />
                  Spinning Up Custom Trip...
                </>
              ) : (
                <>
                  <Sparkles className={`w-4 h-4`} />
                  Compile AI Trip
                </>
              )}
            </button>
          </div>
        </div>

        {/* Righthand side: Results & Timelines */}
        <div className={`lg:col-span-2 space-y-6`}>
          {loading ? (
            <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-4 flex flex-col items-center justify-center`}>
              <Loader2 className={`w-10 h-10 text-cyan-400 animate-spin`} />
              <div className={`space-y-1`}>
                <h4 className={`text-base font-bold text-zinc-900 dark:text-white font-display`}>Generating Flight Paths & Itinerary Details</h4>
                <p className={`text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed`}>Gemini AI is currently checking local coordinates, restaurant reviews, and safety alerts...</p>
              </div>
              <div className={`bg-zinc-50/50 dark:bg-zinc-950 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono text-cyan-300`}>
                {randomLoadingTips[Math.floor(Math.random() * randomLoadingTips.length)]}
              </div>
            </div>
          ) : activeTrip ? (
            <div className={`space-y-6`}>
              
              {/* Trip summary overview */}
              <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                <div>
                  <span className={`text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 rounded-full font-bold border border-cyan-500/20`}>Active Pilot</span>
                  <h3 className={`text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 mt-1`}>{activeTrip.destination}</h3>
                  <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>Estimated Cost Total: <span className={`text-emerald-400 font-bold font-mono`}>{activeTrip.totalEstimatedCost}</span></p>
                </div>
                
                {/* Day picker selectors */}
                <div className={`flex gap-1.5 flex-wrap`}>
                  {(activeTrip.itinerary || []).map((day: DailyPlan) => (
                    <button
                      id={`day-select-${day.dayNumber}`}
                      key={day.dayNumber}
                      onClick={() => setSelectedDay(day.dayNumber)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                        selectedDay === day.dayNumber 
                          ? 'bg-cyan-600 border-cyan-500 text-zinc-900 dark:text-white' 
                          : 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      D{day.dayNumber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day theme card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDay}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md/80 border border-zinc-200 dark:border-zinc-850 p-5 rounded-2xl space-y-4`}
                >
                  <div className={`border-b border-zinc-200 dark:border-zinc-800 pb-2.5`}>
                    <p className={`text-xs font-mono font-bold text-cyan-400`}>DAY {selectedDay} SPOTLIGHT</p>
                    <h4 className={`text-base font-bold text-zinc-900 dark:text-white mt-0.5`}>
                      {(activeTrip.itinerary || []).find((d: DailyPlan) => d.dayNumber === selectedDay)?.theme}
                    </h4>
                  </div>



                  {/* Daily Activities List */}
                  <div className={`space-y-4 relative pl-3.5 border-l-2 border-zinc-200 dark:border-zinc-850`}>
                    {(activeTrip.itinerary || [])
                      .find((d: DailyPlan) => d.dayNumber === selectedDay)
                      ?.activities?.map((act: Activity, idx: number) => (
                        <div key={idx} className={`relative space-y-1.5`}>
                          {/* Dot connector */}
                          <span className={`absolute left-[-22px] top-1.5 w-3 h-3 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-2 border-cyan-500 flex items-center justify-center z-10`} />
                          
                          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5`}>
                            <div className={`flex items-center gap-2`}>
                              <span className={`text-xs font-bold font-mono text-cyan-400 bg-cyan-500/5 px-2 py-0.5 rounded-md border border-cyan-500/10`}>{act.time}</span>
                              <span className={`text-[9px] uppercase tracking-wider font-mono border px-2 py-0.5 rounded-full flex items-center gap-1 ${getCategoryColor(act.category)}`}>
                                {getCategoryIcon(act.category)}
                                {act.category}
                              </span>
                            </div>
                            <span className={`text-xs font-semibold text-emerald-400 font-mono`}>{act.costEstimate}</span>
                          </div>

                          <h5 className={`text-sm font-bold text-zinc-100`}>{act.title}</h5>
                          <p className={`text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed`}>{act.description}</p>
                          <div className={`flex items-center justify-between text-[11px] text-zinc-500 pt-1`}>
                            <span className={`flex items-center gap-1`}>
                              <MapPin className={`w-3.5 h-3.5 text-zinc-500`} />
                              {act.locationName}
                            </span>
                            {act.googleMapsUrl && (
                              <a 
                                href={act.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-0.5`}
                              >
                                Google Maps
                                <Eye className={`w-3 h-3`} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Hotels Selection & Restaurants Section */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300`}>
                  <h4 className={`text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono`}>Curated Hotel Stay recommendations</h4>
                  <div className={`space-y-3`}>
                    {(activeTrip.hotels || []).map((hotel, idx) => (
                      <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/65 text-xs space-y-1.5`}>
                        <div className={`flex justify-between items-center`}>
                          <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>{hotel.name}</p>
                          <span className={`text-[10px] font-mono text-amber-400 bg-amber-400/5 px-1.5 rounded`}>{hotel.rating}</span>
                        </div>
                        <p className={`text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed`}>{hotel.reason}</p>
                        <p className={`font-mono text-emerald-400 text-[11px] font-semibold`}>{hotel.costPerNight}/night</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300`}>
                  <h4 className={`text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono`}>Curated Restaurants & Bistros</h4>
                  <div className={`space-y-3`}>
                    {(activeTrip.restaurants || []).map((rest, idx) => (
                      <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/65 text-xs space-y-1`}>
                        <div className={`flex justify-between items-center`}>
                          <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>{rest.name}</p>
                          <span className={`text-[10px] font-mono text-emerald-400`}>{rest.priceRange}</span>
                        </div>
                        <p className={`text-zinc-500 dark:text-zinc-400 text-[11px]`}>Cuisine: {rest.cuisine} • Rating: {rest.rating}</p>
                        <p className={`text-[10px] text-zinc-500 font-mono mt-1`}>{rest.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Curated Packing checklist & transport tips */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300`}>
                  <h4 className={`text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono`}>Packing Recommendations Checklist</h4>
                  <div className={`space-y-1.5 max-h-48 overflow-y-auto`}>
                    {(activeTrip.packingList || []).map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300`}>
                        <input type="checkbox" className={`rounded border-zinc-200 dark:border-zinc-800 text-cyan-500 focus:ring-0 w-3.5 h-3.5 accent-cyan-500 bg-zinc-50/50 dark:bg-zinc-950`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-3 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300`}>
                  <h4 className={`text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono`}>Recommended Transit Pass options</h4>
                  <div className={`space-y-3`}>
                    {(activeTrip.transport || []).map((trans, idx) => (
                      <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/65 text-[11px] space-y-1`}>
                        <div className={`flex justify-between items-center`}>
                          <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>{trans.type}</p>
                          <span className={`font-mono text-emerald-400 font-semibold`}>{trans.averageCost}</span>
                        </div>
                        <p className={`text-zinc-500 dark:text-zinc-400 leading-normal`}><strong className={`text-cyan-400 font-mono text-[9px] uppercase`}>PRO:</strong> {trans.pros}</p>
                        <p className={`text-zinc-500 dark:text-zinc-400 leading-normal`}><strong className={`text-rose-400 font-mono text-[9px] uppercase`}>CON:</strong> {trans.cons}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md/40 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3`}>
              <Compass className={`w-12 h-12 text-zinc-700 mx-auto stroke-[1.25] animate-pulse`} />
              <h4 className={`text-sm font-semibold text-zinc-500 dark:text-zinc-400`}>Trip Presentation Stage</h4>
              <p className={`text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed`}>Customize parameters and compile your trip to visualize your detailed daily itinerary, transport routes, and local hotel guides.</p>
            </div>
          )}
        </div>

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className={`fixed inset-0 bg-zinc-50/50 dark:bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in`}>
          <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 max-w-sm w-full p-6 rounded-2xl space-y-4 shadow-2xl`}>
            <h4 className={`text-base font-bold text-zinc-900 dark:text-white font-display flex items-center gap-1.5`}>
              <Share2 className={`w-4 h-4 text-cyan-400`} />
              Share Trip Parameters
            </h4>
            <p className={`text-xs text-zinc-500 dark:text-zinc-400 leading-normal`}>Generate a copyable share link to synchronize this customized Travel Planner config with your travel companion's devices.</p>
            
            <div className={`flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-xl`}>
              <span className={`text-[10px] text-zinc-500 font-mono truncate select-all`}>{window.location.origin}/?trip={activeTrip?.id}</span>
            </div>

            <div className={`flex gap-2.5 justify-end`}>
              <button 
                id="share-modal-close"
                onClick={() => setShowShareModal(false)}
                className={`px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg text-xs font-semibold cursor-pointer`}
              >
                Close
              </button>
              <button 
                id="share-modal-copy"
                onClick={handleShare}
                className={`px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer`}
              >
                {copied ? <Check className={`w-3.5 h-3.5`} /> : <Copy className={`w-3.5 h-3.5`} />}
                {copied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
