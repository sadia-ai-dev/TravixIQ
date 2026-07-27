import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, TrendingUp, Info, HelpCircle, ArrowRight, RefreshCw, 
  MapPin, Coins, Sparkles, Loader2, AlertCircle, Percent 
} from 'lucide-react';
import { BudgetOptimizerData } from '../types';

interface BudgetOptimizerProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  destination: string;
  budgetData: BudgetOptimizerData | null;
  onSetBudgetData: (data: BudgetOptimizerData | null) => void;
}

export default function BudgetOptimizer({isLight, isOfflineMode = false, destination, budgetData, onSetBudgetData }: BudgetOptimizerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [usdInput, setUsdInput] = useState('500');
  const [convertedResult, setConvertedResult] = useState<number | null>(null);

  // Simple hardcoded currency codes mapping based on destination keyword
  const getCurrencyMapping = (dest: string) => {
    const d = dest.toLowerCase();
    if (d.includes('tokyo') || d.includes('japan')) return { code: 'JPY', rate: 154.5, symbol: '¥' };
    if (d.includes('london') || d.includes('uk') || d.includes('england')) return { code: 'GBP', rate: 0.79, symbol: '£' };
    if (d.includes('paris') || d.includes('rome') || d.includes('europe') || d.includes('italy') || d.includes('france')) return { code: 'EUR', rate: 0.92, symbol: '€' };
    if (d.includes('cairo') || d.includes('egypt')) return { code: 'EGP', rate: 48.2, symbol: 'E£' };
    if (d.includes('kuala') || d.includes('malaysia')) return { code: 'MYR', rate: 4.42, symbol: 'RM' };
    return { code: 'EUR', rate: 0.92, symbol: '€' }; // default to Euro
  };

  const curr = getCurrencyMapping(destination || 'Europe');

  const fetchBudget = async (targetDest: string, style: string) => {
    if (!targetDest.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (isOfflineMode) {
        const cached = localStorage.getItem(`budget_${targetDest.trim().toLowerCase()}_${style}`);
        if (cached) {
          onSetBudgetData(JSON.parse(cached));
          setLoading(false);
          return;
        } else {
          throw new Error('No offline budget data available for this destination and style.');
        }
      }

      const response = await fetch('/api/budget-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: targetDest.trim(), budgetStyle: style })
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server. Could not connect to the AI engine. Please check your local server.");
      }
      const data = await response.json();
      onSetBudgetData(data);
      localStorage.setItem(`budget_${targetDest.trim().toLowerCase()}_${style}`, JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to the AI engine. Please check your local server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destination) {
      fetchBudget(destination, selectedStyle);
    }
  }, [destination, selectedStyle]);

  useEffect(() => {
    const val = parseFloat(usdInput);
    if (!isNaN(val)) {
      setConvertedResult(val * curr.rate);
    } else {
      setConvertedResult(null);
    }
  }, [usdInput, curr.rate]);

  return (
    <div id="budget-view" className={`space-y-6 animate-fade-in`}>
      
      {/* Header section */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5`}>
        <div>
          <h2 className={`text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white flex items-center gap-2`}>
            <DollarSign className={`w-5 h-5 text-cyan-400`} />
            Budget Optimizer Cockpit
          </h2>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>Itemized regional averages, emergency savings allocations, and smart money-saving actions.</p>
        </div>
        
        {/* Style selection buttons */}
        <div className={`flex bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 gap-1 text-xs`}>
          {(['budget', 'moderate', 'luxury'] as const).map((styleOpt) => (
            <button
              id={`budget-style-${styleOpt}`}
              key={styleOpt}
              onClick={() => setSelectedStyle(styleOpt)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition-all duration-250 ${
                selectedStyle === styleOpt 
                  ? 'bg-cyan-600 text-zinc-900 dark:text-white shadow-md shadow-cyan-600/10' 
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white'
              }`}
            >
              {styleOpt}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3 flex flex-col items-center justify-center`}>
          <Loader2 className={`w-10 h-10 text-cyan-400 animate-spin`} />
          <h4 className={`text-base font-bold text-zinc-900 dark:text-white font-display`}>Optimizing Exchange Variables</h4>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 max-w-sm`}>Generating regional accommodation values, averaging ticket tariffs, and compiling food markets indexes...</p>
        </div>
      ) : budgetData ? (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 items-start`}>
          
          {/* Main cost distribution lists and horizontal bar charts */}
          <div className={`lg:col-span-2 space-y-6`}>
            
            {/* Top-level Cost Summary Box */}
            <div className={`bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-900/50 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
              <div>
                <h3 className={`text-[10px] uppercase font-bold text-emerald-400 tracking-wider`}>Estimated Total Structure</h3>
                <p className={`text-3xl font-display font-bold text-zinc-900 dark:text-white mt-1`}>{budgetData.totalEstimatedCost || "N/A"}</p>
              </div>
              <div className={`text-left sm:text-right`}>
                <h3 className={`text-[10px] uppercase font-bold text-cyan-400 tracking-wider`}>Average Daily Cost</h3>
                <p className={`text-2xl font-mono font-bold text-zinc-100 mt-1`}>{budgetData.dailyAverageCost || "N/A"}</p>
              </div>
            </div>

            {/* Horizontal Distribution bars summary */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <Percent className={`w-4 h-4 text-cyan-400`} />
                Cost Distribution Ratios
              </h3>
              
              {/* Stacked single bar breakdown */}
              <div className={`w-full bg-zinc-100 dark:bg-zinc-800 h-5 rounded-full overflow-hidden flex border border-zinc-950`}>
                {(budgetData.estimates || []).map((item, idx) => {
                  const colors = ["bg-cyan-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500"];
                  return (
                    <div 
                      key={idx} 
                      className={`h-full ${colors[idx % colors.length]} transition-all duration-1000`} 
                      style={{ width: `${item.percentage}%` }}
                      title={`${item.category}: ${item.percentage}%`}
                    />
                  );
                })}
              </div>

              {/* Legend with matching colors */}
              <div className={`grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2`}>
                {(budgetData.estimates || []).map((item, idx) => {
                  const colors = ["bg-cyan-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500"];
                  return (
                    <div key={idx} className={`space-y-0.5 text-center sm:text-left`}>
                      <div className={`flex items-center gap-1.5 justify-center sm:justify-start`}>
                        <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                        <span className={`text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300`}>{item.percentage}%</span>
                      </div>
                      <p className={`text-[10px] text-zinc-500 dark:text-zinc-400 leading-none font-medium truncate`}>{item.category}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List breakdown cards */}
            <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white`}>Curated Cost Categories</h3>
              <div className={`space-y-3`}>
                {(budgetData.estimates || []).map((item, idx) => (
                  <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800/60 rounded-xl space-y-2 hover:border-zinc-700 transition-colors`}>
                    <div className={`flex justify-between items-center`}>
                      <h4 className={`text-xs font-bold text-zinc-900 dark:text-white font-display`}>{item.category}</h4>
                      <span className={`text-xs font-mono font-bold text-cyan-400`}>{item.estimate}</span>
                    </div>
                    <p className={`text-xs text-zinc-500 dark:text-zinc-400 leading-normal`}>{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar: Currency Exchange & Money Saving tips */}
          <div className={`space-y-6`}>
            
            {/* Interactive Currency Conversion widget */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <Coins className={`w-4 h-4 text-cyan-400`} />
                Live Currency Exchange
              </h3>

              <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4`}>
                <div className={`flex justify-between items-center text-[10px] font-mono text-zinc-500`}>
                  <span>BASE CURRENCY</span>
                  <span>TARGET CONVERSION</span>
                </div>

                <div className={`grid grid-cols-2 gap-4`}>
                  {/* USD Input field */}
                  <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg text-xs space-y-1`}>
                    <span className={`text-[9px] text-zinc-500 font-mono`}>USD ($)</span>
                    <input 
                      id="usd-input"
                      type="number"
                      value={usdInput}
                      onChange={(e) => setUsdInput(e.target.value)}
                      className={`w-full bg-transparent text-sm font-bold text-zinc-900 dark:text-white focus:outline-none border-none p-0 font-mono`}
                    />
                  </div>

                  {/* Converted Output field */}
                  <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg text-xs space-y-1 flex flex-col justify-center`}>
                    <span className={`text-[9px] text-zinc-500 font-mono`}>{curr.code} ({curr.symbol})</span>
                    <p className={`text-sm font-extrabold text-cyan-400 font-mono leading-none py-1`}>
                      {convertedResult !== null ? `${curr.symbol}${convertedResult.toLocaleString(undefined, { maximumFractionDigits: 1 })}` : '---'}
                    </p>
                  </div>
                </div>

                <div className={`border-t border-zinc-200 dark:border-zinc-800/60 pt-2.5 text-center`}>
                  <p className={`text-[10px] font-mono text-zinc-500 dark:text-zinc-400`}>
                    Live rates: <strong className={`text-zinc-700 dark:text-zinc-200`}>1 USD = {curr.rate} {curr.code}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Reserve suggestions */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-3`}>
              <h4 className={`text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono`}>Recommended Reserve Pool</h4>
              <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between`}>
                <span className={`text-xs text-zinc-600 dark:text-zinc-300`}>Unallocated Safety Cash</span>
                <span className={`text-sm font-bold text-rose-400 font-mono`}>{budgetData.emergencyReserve}</span>
              </div>
              <p className={`text-[10px] text-zinc-500 leading-normal`}>
                Always set aside these specific emergency funds to offset any unexpected transit disruptions, medical costs, or sudden visa updates.
              </p>
            </div>

            {/* Money Savings checklist */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <TrendingUp className={`w-4 h-4 text-cyan-400`} />
                Regional savings recommendations
              </h3>
              
              <div className={`space-y-3`}>
                {(budgetData.savingsSuggestions || []).map((tip, idx) => (
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
          <DollarSign className={`w-12 h-12 text-zinc-700 mx-auto stroke-[1.25] animate-pulse`} />
          <h4 className={`text-sm font-semibold text-zinc-500 dark:text-zinc-400`}>Budget Simulator Offline</h4>
          <p className={`text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed`}>Select a destination and load your details in the planner to activate high-fidelity localized cost breakdowns.</p>
        </div>
      )}

    </div>
  );
}
