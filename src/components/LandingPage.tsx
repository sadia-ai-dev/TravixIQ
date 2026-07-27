import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, MapPin, Sparkles, Shield, Sun, 
  ArrowRight, MessageSquareWarning, DollarSign, Heart, Activity
} from 'lucide-react';

interface LandingPageProps {
  onStartApp: (destination: string, initialTab: string) => void;
}

export default function LandingPage({ onStartApp }: LandingPageProps) {
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');

  const handleLaunch = (tab: string) => {
    if (!destination.trim()) {
      setError('Please enter a destination to initialize telemetry.');
      return;
    }
    setError('');
    onStartApp(destination, tab);
  };

  const featureCards = [
    { title: "Smart Planner", desc: "AI-generated itineraries with dynamic budget routing.", icon: <Sparkles className="w-4 h-4 text-cyan-500" />, tab: "planner" },
    { title: "Scam Shield", desc: "Real-time threat detection for common tourist traps.", icon: <Shield className="w-4 h-4 text-rose-500" />, tab: "scam-shield" },
    { title: "Travel Pulse", desc: "Live weather, security indexes, and crowd density.", icon: <Activity className="w-4 h-4 text-emerald-500" />, tab: "pulse" },
    { title: "Budget Optimizer", desc: "Local cost analysis and spending guardrails.", icon: <DollarSign className="w-4 h-4 text-amber-500" />, tab: "budget" },
    { title: "Halal Helper", desc: "Prayer times, Qibla, and verified halal eateries.", icon: <Heart className="w-4 h-4 text-purple-500" />, tab: "muslim" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-500 font-sans overflow-x-hidden relative">
      
      {/* Decorative gradient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/50 dark:bg-cyan-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-200/50 dark:bg-teal-950/10 blur-[120px] pointer-events-none" />
      
      {/* Top Navigation / Brand (Glass Effect) */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Compass className="w-5 h-5 text-white dark:text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                TravixIQ
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-mono">Travel Intel Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-mono hidden sm:inline bg-gray-100 dark:bg-zinc-900/80 px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-800">
              v1.2.0-stable
            </span>
          </div>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="w-full max-w-5xl mx-auto px-6 pt-32 pb-16 flex flex-col items-center text-center relative z-10 flex-grow justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 px-4 py-2 rounded-full text-cyan-700 dark:text-cyan-300 text-xs font-medium mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
          Powered by Gemini 3.1 AI & Real-time Web Grounding
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white max-w-3xl leading-[1.1] mb-6"
        >
          Travel Smarter.<br />
          <span className="bg-gradient-to-r from-cyan-600 to-teal-500 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Explore Better.
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 dark:text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-12"
        >
          TravixIQ is an AI-powered travel intelligence platform that helps users plan smarter trips, optimise travel budgets, discover personalised itineraries, detect travel scams, analyse destinations, and access intelligent travel assistance through one unified platform.
        </motion.p>
        
        {/* Input Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl bg-white dark:bg-zinc-900/90 border border-gray-200 dark:border-zinc-800 rounded-2xl p-2.5 shadow-xl shadow-gray-200/50 dark:shadow-cyan-950/20 backdrop-blur-xl mb-4 relative group focus-within:border-cyan-500/40 transition-all"
        >
          <div className="flex items-center gap-3 px-4">
            <MapPin className="w-5 h-5 text-cyan-500 flex-shrink-0" />
            <input 
              id="destination-input"
              type="text"
              placeholder="Where are we exploring? (e.g. Tokyo, Rome, Cairo)"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLaunch('planner');
              }}
              className="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none text-base py-3.5"
            />
          </div>
          
          {/* Quick Actions Container inside input */}
          <div className="border-t border-gray-100 dark:border-zinc-800/85 mt-2 pt-2.5 flex flex-wrap gap-2 justify-end">
            <button 
              id="btn-safety"
              onClick={() => handleLaunch('pulse')}
              className="text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-all flex items-center gap-1.5"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              Check Pulse
            </button>
            <button 
              id="btn-scams"
              onClick={() => handleLaunch('scam-shield')}
              className="text-xs font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800/60 transition-all flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-rose-500" />
              Scan Scams
            </button>
            <button 
              id="btn-plan"
              onClick={() => handleLaunch('planner')}
              className="text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/30 active:scale-[0.98]"
            >
              Build Smart Trip
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-500 dark:text-rose-400 text-sm font-medium flex items-center gap-1.5 mb-8"
          >
            <MessageSquareWarning className="w-4 h-4" />
            {error}
          </motion.p>
        )}
        
        {/* Feature quick links preview */}
        <div className="w-full mt-20">
          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-zinc-500 font-mono mb-8">Explore Key Security & Planning Capabilities</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {featureCards.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + idx * 0.08 }}
                onClick={() => {
                  setDestination("Universal Spot");
                  onStartApp("Tokyo", card.tab);
                }}
                className="bg-white dark:bg-zinc-900/50 hover:bg-gray-50 dark:hover:bg-zinc-900 border border-gray-200 dark:border-zinc-800/85 dark:hover:border-zinc-700/80 p-5 rounded-2xl text-left cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-cyan-950/5 group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="p-2.5 w-fit bg-gray-100 dark:bg-zinc-800/80 rounded-xl group-hover:bg-gray-200 dark:group-hover:bg-zinc-800 transition-colors mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{card.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">{card.desc}</p>
                </div>
                <div className="text-cyan-600 dark:text-cyan-400 text-[11px] font-semibold font-mono mt-5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0">
                  Launch Demo
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
