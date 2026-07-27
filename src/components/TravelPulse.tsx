import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Sun, Shield, Users, Compass, HelpCircle, Info, Calendar, 
  TrendingUp, MapPin, Loader2, Sparkles, AlertCircle, CloudSun, Droplets, Wind, ThermometerSun, Phone, X 
} from 'lucide-react';
import { TravelPulseData, ScoreItem } from '../types';

interface TravelPulseProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  destination: string;
  pulseData: TravelPulseData | null;
  onSetPulseData: (data: TravelPulseData | null) => void;
}

export default function TravelPulse({isLight, isOfflineMode = false, destination, pulseData, onSetPulseData }: TravelPulseProps) {
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosData, setSosData] = useState<any>(null);
  const [sosLoading, setSosLoading] = useState(false);
  
  const handleSOSClick = async () => {
    setSosModalOpen(true);
    if (sosData || !destination) return; // already fetched or no destination
    
    setSosLoading(true);
    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination })
      });
      if (!response.ok) throw new Error('Failed to fetch emergency contacts');
      const data = await response.json();
      setSosData(data);
    } catch (err) {
      console.error(err);
      // fallback
      setSosData({
        police: "112 / 911",
        ambulance: "112 / 911",
        fire: "112 / 911",
        general: "112 / 911",
        note: "Could not fetch local numbers. Standard emergency numbers listed."
      });
    } finally {
      setSosLoading(false);
    }
  };

  
  // Real-time weather states
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Clear';
    if (code >= 1 && code <= 3) return 'Cloudy';
    if (code === 45 || code === 48) return 'Fog';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain';
    if ((code >= 71 && code <= 77) || (code === 85 || code === 86)) return 'Snow';
    if (code >= 95) return 'Storm';
    return 'Clear';
  };

  const fetchRealTimeWeather = async (targetDest: string) => {
    setWeatherLoading(true);
    setWeatherError('');
    setWeatherData(null);
    try {
      if (isOfflineMode) {
        const cached = localStorage.getItem(`weather_${targetDest.trim().toLowerCase()}`);
        if (cached) {
          setWeatherData(JSON.parse(cached));
          setWeatherLoading(false);
          return;
        } else {
          throw new Error('No offline weather cache available');
        }
      }
      
      // 1. Get coordinates
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(targetDest)}&count=1&language=en&format=json`);
      if (!geoRes.ok) throw new Error('Geocoding failed');
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Location not found');
      }
      
      const { latitude, longitude } = geoData.results[0];
      
      // 2. Get weather
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max&timezone=auto`);
      if (!weatherRes.ok) throw new Error('Weather fetch failed');
      const data = await weatherRes.json();
      
      // Parse data
      const current = data.current;
      const daily = data.daily;
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      const forecast = daily.time.slice(1, 6).map((timeStr: string, idx: number) => {
        const date = new Date(timeStr);
        return {
          day: days[date.getDay()],
          temp: Math.round(daily.temperature_2m_max[idx + 1]),
          condition: getWeatherCondition(daily.weather_code[idx + 1])
        };
      });
      
      const weatherObj = {
        temperatureCelsius: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windKph: Math.round(current.wind_speed_10m),
        condition: getWeatherCondition(current.weather_code),
        forecast
      };
      setWeatherData(weatherObj);
      localStorage.setItem(`weather_${targetDest.trim().toLowerCase()}`, JSON.stringify(weatherObj));
      
    } catch (err) {
      console.error(err);
      setWeatherError('Weather unavailable');
    } finally {
      setWeatherLoading(false);
    }
  };


  const fetchPulse = async (targetDest: string) => {
    if (!targetDest.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (isOfflineMode) {
        const cached = localStorage.getItem(`pulse_${targetDest.trim().toLowerCase()}`);
        if (cached) {
          onSetPulseData(JSON.parse(cached));
          setLoading(false);
          return;
        } else {
          throw new Error('No offline pulse cache available');
        }
      }

      const response = await fetch('/api/travel-pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: targetDest.trim() })
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server. Could not connect to the AI engine. Please check your local server.");
      }
      const data = await response.json();
      onSetPulseData(data);
      localStorage.setItem(`pulse_${targetDest.trim().toLowerCase()}`, JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to the AI engine. Please check your local server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destination && (!pulseData || pulseData.destination !== destination)) {
      fetchPulse(destination);
      fetchRealTimeWeather(destination);
    }
  }, [destination]);

  // Compute standard scores array
  const scoreItems: ScoreItem[] = pulseData ? [
    { label: "Weather Index", score: pulseData.scores.weather, color: "stroke-amber-400 text-amber-400", description: "Average rainfall, pleasant sunshine levels & seasonal temperatures." },
    { label: "Safety Rating", score: pulseData.scores.safety, color: "stroke-rose-400 text-rose-400", description: "Low crime index, safe pedestrian zones & active security presences." },
    { label: "Crowd Status", score: pulseData.scores.crowd, color: "stroke-purple-400 text-purple-400", description: "Tourist density peaks, attraction waiting lines & local holidays." },
    { label: "Walkability Score", score: pulseData.scores.walking, color: "stroke-emerald-400 text-emerald-400", description: "Sidewalk availability, pedestrian lights, crossings & close-by attractions." },
    { label: "Public Transit", score: pulseData.scores.transport, color: "stroke-sky-400 text-sky-400", description: "Metro networks, bus frequency, ease of ticketing & fare structure." },
    { label: "Visa Simplicity", score: pulseData.scores.visa, color: "stroke-cyan-400 text-cyan-400", description: "Visa free entry ratios, rapid eVisa processing, fees & documentation." },
    { label: "Cost Efficiency", score: pulseData.scores.cost, color: "stroke-teal-400 text-teal-400", description: "Value for local accommodations, eating out, public transports & activities." }
  ] : [];

  return (
    <div id="pulse-view" className={`space-y-6 animate-fade-in`}>
      
      {/* Header and Input proxy */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5`}>
        <div>
          <h2 className={`text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white flex items-center gap-2`}>
            <Activity className={`w-5 h-5 text-cyan-400 animate-pulse`} />
            Travel Pulse telemetry
          </h2>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>Real-time indicators evaluating security, atmospheric conditions, and accessibility variables.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2.5 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs`}>
            <span className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Spotlight:</span>
            <strong className={`text-zinc-900 dark:text-white font-mono`}>{destination || "Specify a spot"}</strong>
          </div>
          {destination && (
            <button
              onClick={handleSOSClick}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all animate-pulse"
            >
              <Phone className="w-3.5 h-3.5" />
              SOS
            </button>
          )}
        </div>

      </div>

      {loading ? (
        <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3 flex flex-col items-center justify-center`}>
          <Loader2 className={`w-10 h-10 text-cyan-400 animate-spin`} />
          <h4 className={`text-base font-bold text-zinc-900 dark:text-white font-display`}>Sensing Destination Pulse Rates</h4>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 max-w-sm`}>Gathering meteorological data, pedestrian indexes, and seasonal local tourist volumes...</p>
        </div>
      ) : pulseData ? (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 items-start`}>
          
          {/* Main Scores & Pulse meter */}
          <div className={`lg:col-span-2 space-y-6`}>
            
            {/* Overall Pulse Score Banner */}
            <div className={`bg-gradient-to-tr from-zinc-900 to-cyan-950/40 border border-zinc-805 p-6 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6`}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl`} />
              
              {/* Radial Meter */}
              <div className={`relative w-28 h-28 flex items-center justify-center flex-shrink-0`}>
                <svg className={`w-full h-full transform -rotate-90`}>
                  <circle cx="56" cy="56" r="48" className={`stroke-zinc-800 fill-none`} strokeWidth="6" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    className={`stroke-cyan-500 fill-none transition-all duration-1000`} 
                    strokeWidth="7" 
                    strokeDasharray={2 * Math.PI * 48} 
                    strokeDashoffset={2 * Math.PI * 48 * (1 - pulseData.overallScore / 100)} 
                    strokeLinecap="round"
                  />
                </svg>
                <div className={`absolute text-center`}>
                  <p className={`text-2xl font-extrabold text-zinc-900 dark:text-white font-mono`}>{pulseData.overallScore}</p>
                  <p className={`text-[9px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-mono`}>PULSE</p>
                </div>
              </div>

              <div className={`space-y-2 text-center sm:text-left`}>
                <h3 className={`text-base font-bold text-zinc-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5`}>
                  <Sparkles className={`w-4 h-4 text-amber-400`} />
                  Current Safe-to-Explore Index
                </h3>
                <p className={`text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium`}>"{pulseData.pulseAnalysis}"</p>
                <div className={`flex flex-wrap justify-center sm:justify-start gap-2.5 pt-1`}>
                  <span className={`text-[10px] font-mono bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/20 font-bold uppercase`}>
                    Visa: {pulseData.visaDifficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Weather Widget (Real-time via Open-Meteo) */}
            <div className={`bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-200 dark:from-sky-950/40 dark:to-indigo-950/40 dark:border-sky-900/50 border p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 min-h-[140px]`}>
              {weatherLoading ? (
                <div className="w-full flex flex-col items-center justify-center gap-2 text-sky-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className={`text-xs text-sky-700 dark:text-sky-300 font-mono`}>Fetching atmospheric telemetry...</span>
                </div>
              ) : weatherError ? (
                <div className="w-full flex flex-col items-center justify-center gap-2 text-amber-500">
                  <AlertCircle className="w-6 h-6" />
                  <span className={`text-xs text-amber-700 dark:text-amber-400 font-mono`}>{weatherError}</span>
                </div>
              ) : weatherData ? (
                <>
                  <div className={`flex items-center gap-5`}>
                    <div className={`bg-sky-100 border-sky-200 dark:bg-sky-900/40 dark:border-sky-500/20 p-4 rounded-full border`}>
                      <CloudSun className={`w-10 h-10 text-sky-600 dark:text-sky-400`} />
                    </div>
                    <div>
                      <h3 className={`text-3xl font-display font-bold text-zinc-900 dark:text-white flex items-center gap-2`}>
                        {weatherData.temperatureCelsius}°C
                        <span className={`text-base font-medium text-sky-700 dark:text-sky-200`}>{weatherData.condition}</span>
                      </h3>
                      <div className={`flex gap-4 mt-2 text-xs font-mono text-sky-800 dark:text-sky-300/80`}>
                        <span className={`flex items-center gap-1.5`}><Droplets className={`w-3.5 h-3.5`} /> {weatherData.humidity}% Hum</span>
                        <span className={`flex items-center gap-1.5`}><Wind className={`w-3.5 h-3.5`} /> {weatherData.windKph} km/h</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Micro Forecast */}
                  <div className={`flex gap-3 bg-white/80 dark:bg-zinc-950/40 p-3 rounded-xl border border-sky-200 dark:border-sky-900/30 w-full sm:w-auto overflow-x-auto`}>
                    {weatherData.forecast.map((fc: any, idx: number) => (
                      <div key={idx} className={`text-center px-3 min-w-[70px]`}>
                        <p className={`text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400/80 tracking-wider mb-1`}>{fc.day}</p>
                        <ThermometerSun className={`w-4 h-4 text-sky-500 dark:text-sky-300 mx-auto mb-1`} />
                        <p className={`text-xs font-bold text-zinc-900 dark:text-white font-mono`}>{fc.temp}°C</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full flex flex-col items-center justify-center text-zinc-500">
                  <span className="text-xs font-mono">Weather telemetry unavailable</span>
                </div>
              )}
            </div>

            {/* Individual Telemetries breakdown */}
            <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white`}>Itemized Category Telemetry</h3>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                {scoreItems.map((item, idx) => (
                  <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800/60 rounded-xl space-y-2.5 hover:border-zinc-700 transition-colors`}>
                    <div className={`flex justify-between items-center`}>
                      <p className={`text-xs font-semibold text-zinc-700 dark:text-zinc-200`}>{item.label}</p>
                      <span className={`text-xs font-bold font-mono text-zinc-900 dark:text-white`}>{item.score}/100</span>
                    </div>
                    {/* Linear Progress bar */}
                    <div className={`w-full bg-zinc-200 dark:bg-zinc-850 h-2 rounded-full overflow-hidden border border-zinc-900`}>
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          item.score > 75 ? 'bg-cyan-500' : item.score > 50 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} 
                        style={{ width: `${item.score}%` }} 
                      />
                    </div>
                    <p className={`text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal`}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Righthand side: Historical Trends & Visa/Events */}
          <div className={`space-y-6`}>
            
            {/* Historical monthly trends SVG Chart */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <TrendingUp className={`w-4 h-4 text-emerald-400`} />
                Historical Seasonal Trends
              </h3>
              
              <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4`}>
                <div className={`flex justify-between items-center text-[10px] font-mono text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800/60 pb-2`}>
                  <span className={`flex items-center gap-1`}><span className={`w-2 h-2 bg-cyan-500 rounded-full`} /> Temp (°C)</span>
                  <span className={`flex items-center gap-1`}><span className={`w-2 h-2 bg-emerald-500 rounded-full`} /> Crowd density</span>
                </div>

                {/* SVG Visual Bars / Curves */}
                <div className={`h-40 w-full relative flex items-end justify-between pt-4 pb-2 px-1`}>
                  {(pulseData.historicalTrends || []).map((trend, idx) => {
                    const tempHeight = Math.min(100, Math.max(10, trend.temp * 3));
                    const crowdHeight = trend.crowd;
                    return (
                      <div key={idx} className={`flex flex-col items-center h-full justify-end w-8 group relative`}>
                        {/* Tooltip */}
                        <div className={`absolute bottom-full mb-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-[8px] font-mono text-zinc-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 space-y-0.5 text-center min-w-16`}>
                          <p>Temp: {trend.temp}°C</p>
                          <p>Crowd: {trend.crowd}%</p>
                        </div>

                        {/* Combined dual-colored visual tracks */}
                        <div className={`w-4 h-full flex items-end justify-center gap-0.5`}>
                          {/* Temp track bar */}
                          <div 
                            className={`w-1.5 bg-cyan-500 rounded-t transition-all duration-1000 group-hover:bg-cyan-400`} 
                            style={{ height: `${tempHeight}%` }} 
                          />
                          {/* Crowd track bar */}
                          <div 
                            className={`w-1.5 bg-emerald-500 rounded-t transition-all duration-1000 group-hover:bg-emerald-400`} 
                            style={{ height: `${crowdHeight}%` }} 
                          />
                        </div>

                        <span className={`text-[9px] font-mono text-zinc-500 font-bold mt-2`}>{trend.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Local Events & Festivals calendar */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <Calendar className={`w-4 h-4 text-cyan-400`} />
                Upcoming Cultural Events
              </h3>
              
              <div className={`space-y-3`}>
                {(pulseData.localEvents || []).map((event, idx) => (
                  <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-3.5 border border-zinc-200 dark:border-zinc-800/60 rounded-xl space-y-1.5`}>
                    <div className={`flex justify-between items-start gap-2`}>
                      <p className={`text-xs font-bold text-zinc-700 dark:text-zinc-200`}>{event.name}</p>
                      <span className={`text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded flex-shrink-0`}>
                        {event.date}
                      </span>
                    </div>
                    <p className={`text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed`}>{event.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visa requirements copy */}
            <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-3 text-xs leading-relaxed`}>
              <h4 className={`font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5 font-display text-xs`}>
                <Info className={`w-4 h-4 text-cyan-400`} />
                Entry Visa Guidance
              </h4>
              <p className={`text-zinc-500 dark:text-zinc-400`}>{pulseData.visaDetails}</p>
            </div>

          </div>

        </div>
      ) : (
        <div className={`bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3`}>
          <Activity className={`w-12 h-12 text-zinc-700 mx-auto stroke-[1.25] animate-pulse`} />
          <h4 className={`text-sm font-semibold text-zinc-500 dark:text-zinc-400`}>Pulse Status Offline</h4>
          <p className={`text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed`}>Ensure a destination is selected in the Planner or search cockpit to synchronize current weather parameters and local security statuses.</p>
        </div>
      )}


      {/* SOS Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSosModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-rose-500 p-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-bold tracking-wide">Emergency Contacts</h3>
              </div>
              <button onClick={() => setSosModalOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {sosLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                  <p className="text-xs text-zinc-500">Retrieving local emergency numbers...</p>
                </div>
              ) : sosData ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-lg text-sky-600 dark:text-sky-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Police</span>
                    </div>
                    <a href={`tel:${sosData.police}`} className="font-mono font-bold text-rose-600 dark:text-rose-400 text-lg hover:underline">{sosData.police}</a>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Ambulance</span>
                    </div>
                    <a href={`tel:${sosData.ambulance}`} className="font-mono font-bold text-rose-600 dark:text-rose-400 text-lg hover:underline">{sosData.ambulance}</a>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                        <ThermometerSun className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Fire</span>
                    </div>
                    <a href={`tel:${sosData.fire}`} className="font-mono font-bold text-rose-600 dark:text-rose-400 text-lg hover:underline">{sosData.fire}</a>
                  </div>
                  
                  {sosData.note && (
                    <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
                      <p className="text-xs text-rose-600 dark:text-rose-400 flex gap-2">
                        <Info className="w-4 h-4 shrink-0" />
                        <span>{sosData.note}</span>
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
