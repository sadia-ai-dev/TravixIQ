import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldAlert, AlertTriangle, MessageSquare, Info, Phone, Compass, 
  MapPin, Loader2, Sparkles, Check, CheckCircle2, ChevronRight, X 
} from 'lucide-react';
import { ScamShieldData, ScamVerifyResult, ScamInfo } from '../types';

interface ScamShieldProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  destination: string;
  scamData: ScamShieldData | null;
  onSetScamData: (data: ScamShieldData | null) => void;
}

export default function ScamShield({isLight, isOfflineMode = false, destination, scamData, onSetScamData }: ScamShieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [scanningScenario, setScanningScenario] = useState(false);
  const [scanResult, setScanResult] = useState<ScamVerifyResult | null>(null);

  const fetchScamData = async (targetDest: string) => {
    if (!targetDest.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (isOfflineMode) {
        const cached = localStorage.getItem(`scam_${targetDest.trim().toLowerCase()}`);
        if (cached) {
          onSetScamData(JSON.parse(cached));
          setLoading(false);
          return;
        } else {
          throw new Error('No offline scam shield data available for this destination.');
        }
      }

      const response = await fetch('/api/scam-shield', {
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
      onSetScamData(data);
      localStorage.setItem(`scam_${targetDest.trim().toLowerCase()}`, JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to the AI engine. Please check your local server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destination && (!scamData || scamData.destination !== destination)) {
      fetchScamData(destination);
    }
  }, [destination]);

  const handleScanScenario = async () => {
    if (!customScenario.trim()) return;
    setScanningScenario(true);
    setScanResult(null);

    try {
      const response = await fetch('/api/scam-shield/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: customScenario.trim(),
          location: destination || 'General Tourist Spot'
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
      setScanResult(data);
    } catch (err: any) {
      console.error(err);
      alert('Scanning engine is temporarily overloaded. Please try again.');
    } finally {
      setScanningScenario(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-rose-500 border-rose-500/20 bg-rose-500/5';
    if (score >= 5) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 8) return 'Critical Risk';
    if (score >= 5) return 'Moderate Alert';
    return 'Low Risk Profile';
  };

  return (
    <div id="scam-shield-view" className={`space-y-6 animate-fade-in`}>
      
      {/* Header section */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5`}>
        <div>
          <h2 className={`text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white flex items-center gap-2`}>
            <Shield className={`w-5 h-5 text-rose-500 animate-pulse`} />
            Scam Shield Security Deck
          </h2>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>Live regional fraud alerts, safe pedestrian zones, taxi precaution sheets, and emergency service dials.</p>
        </div>
        <div className={`flex items-center gap-2.5 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs`}>
          <span className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Telemetry Area:</span>
          <strong className={`text-zinc-900 dark:text-white font-mono`}>{destination || "Specify a spot"}</strong>
        </div>
      </div>

      {loading ? (
        <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3 flex flex-col items-center justify-center`}>
          <Loader2 className={`w-10 h-10 text-rose-500 animate-spin`} />
          <h4 className={`text-base font-bold text-zinc-900 dark:text-white font-display`}>Parsing Security Databases</h4>
          <p className={`text-xs text-zinc-500 dark:text-zinc-400 max-w-sm`}>Gathering municipal crime registries, travel board advisory notices, and street fraud alerts indices...</p>
        </div>
      ) : scamData ? (
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 items-start`}>
          
          {/* Left / Center sections: AI scanner & Common Scams database */}
          <div className={`lg:col-span-2 space-y-6`}>
            
            {/* Real-time AI Scam Scenario Scanner */}
            <div className={`bg-gradient-to-tr from-zinc-900 via-zinc-900 to-rose-950/15 border border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <div className={`flex items-center gap-2 border-b border-zinc-800/80 pb-3`}>
                <Sparkles className={`w-4 h-4 text-rose-400`} />
                <h3 className={`text-sm font-semibold tracking-wide text-white`}>AI Scam Verification Scanner</h3>
              </div>

              <div className={`space-y-3`}>
                <p className={`text-xs text-zinc-300 leading-normal`}>
                  Experiencing a suspicious interaction right now? (e.g. "A friendly monk gave me a gold card and asked for donation", "Taxi driver claims my hotel is burned down"). Describe it below:
                </p>

                <div className={`bg-zinc-950/50 rounded-xl border border-zinc-800 p-3.5 focus-within:border-rose-500/30 transition-all space-y-2`}>
                  <textarea 
                    id="scenario-input"
                    rows={3}
                    placeholder="Describe what is happening in detail..."
                    value={customScenario}
                    onChange={(e) => setCustomScenario(e.target.value)}
                    className={`w-full bg-transparent border-none text-xs text-white placeholder-zinc-500 focus:outline-none resize-none`}
                  />
                  
                  <div className={`flex justify-between items-center pt-2 border-t border-zinc-800/50`}>
                    <span className={`text-[10px] text-zinc-500 font-mono`}>Input: English • Destination: {destination}</span>
                    <button 
                      id="scenario-verify-btn"
                      onClick={handleScanScenario}
                      disabled={scanningScenario || !customScenario.trim()}
                      className={`px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold rounded-lg text-[11px] transition-all flex items-center gap-1 active:scale-[0.98]`}
                    >
                      {scanningScenario ? (
                        <>
                          <Loader2 className={`w-3.5 h-3.5 animate-spin`} />
                          Auditing Interaction...
                        </>
                      ) : (
                        <>
                          <ShieldAlert className={`w-3.5 h-3.5`} />
                          Verify Scenario
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Scan Scenario Result Box */}
              <AnimatePresence>
                {scanResult && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`bg-zinc-950/80 p-4 border border-zinc-800 rounded-xl space-y-3.5`}
                  >
                    <div className={`flex justify-between items-center border-b border-zinc-800 pb-2`}>
                      <div className={`flex items-center gap-1.5`}>
                        <AlertTriangle className={`w-4 h-4 ${scanResult.isScam === 'likely' ? 'text-rose-400 animate-pulse' : scanResult.isScam === 'possible' ? 'text-amber-400' : 'text-emerald-400'}`} />
                        <h4 className={`text-xs font-bold text-white font-mono`}>Scan Results: {scanResult.isScam.toUpperCase()}</h4>
                      </div>
                      <span className={`text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded`}>
                        Confidence: {scanResult.confidence}%
                      </span>
                    </div>

                    <div className={`space-y-1`}>
                      <p className={`text-[10px] font-bold text-cyan-400 uppercase tracking-wide font-mono`}>Analysis</p>
                      <p className={`text-xs text-zinc-300 leading-relaxed font-medium`}>{scanResult.analysis}</p>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-zinc-800/80 text-xs`}>
                      <div className={`space-y-1.5`}>
                        <p className={`text-[10px] font-bold text-emerald-400 uppercase tracking-wide font-mono`}>Smart Precautions</p>
                        <ul className={`space-y-1 list-disc list-inside text-zinc-400 leading-relaxed text-[11px]`}>
                          {(scanResult.precautionTips || []).map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={`space-y-1 bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-850`}>
                        <p className={`text-[10px] font-bold text-rose-400 uppercase tracking-wide font-mono`}>Recommended Action</p>
                        <p className={`text-[11px] text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed`}>{scanResult.recommendedAction}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Tourist Scam Database */}
            <div className={`bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white`}>Curated Street Scam Database</h3>
              <div className={`space-y-4`}>
                {(scamData.commonScams || []).map((scam, idx) => (
                  <div key={idx} className={`bg-zinc-50/50 dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800/60 rounded-xl space-y-2 hover:border-zinc-700 transition-colors`}>
                    <div className={`flex justify-between items-start gap-2`}>
                      <h4 className={`text-xs font-bold text-zinc-900 dark:text-white font-display flex items-center gap-1.5`}>
                        <AlertTriangle className={`w-3.5 h-3.5 text-amber-500`} />
                        {scam.title}
                      </h4>
                      <span className={`text-[9px] font-mono text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded`}>
                        Trap ID #0{idx+1}
                      </span>
                    </div>
                    <p className={`text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed`}>{scam.description}</p>
                    <div className={`pt-2 border-t border-zinc-900 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-zinc-500 dark:text-zinc-400`}>
                      <p><strong className={`text-cyan-400 font-mono text-[9px] uppercase`}>Locations:</strong> {scam.commonLocations}</p>
                      <p className={`bg-white dark:bg-zinc-900 p-1.5 rounded border border-zinc-200 dark:border-zinc-850`}><strong className={`text-emerald-400 font-mono text-[9px] uppercase`}>Avoid:</strong> {scam.howToAvoid}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar: Safety score meter, Safe/Unsafe zones, Taxi, Emergencies */}
          <div className={`space-y-6`}>
            
            {/* Safety Score Card */}
            <div className={`p-5 rounded-2xl border ${getRiskColor(scamData.riskScore)} flex items-center justify-between gap-4`}>
              <div className={`space-y-1`}>
                <p className={`text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400`}>Risk Assessment</p>
                <h4 className={`text-base font-bold text-zinc-900 dark:text-white`}>{getRiskLabel(scamData.riskScore)}</h4>
                <p className={`text-[10px] text-zinc-500 leading-normal`}>
                  Calculated based on active tourist fraud metrics and walkability alerts.
                </p>
              </div>
              
              <div className={`w-14 h-14 rounded-full border-2 border-zinc-200 dark:border-zinc-850 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/80`}>
                <p className={`text-lg font-extrabold font-mono text-zinc-900 dark:text-white`}>{scamData.riskScore}/10</p>
              </div>
            </div>

            {/* Pedestrian Safe Zones vs Unsafe districts */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white`}>Sovereignty & Pedestrian zones</h3>
              
              <div className={`space-y-3.5 text-xs`}>
                {/* Safe Zones */}
                <div className={`space-y-1.5`}>
                  <p className={`text-[10px] font-bold text-emerald-400 uppercase tracking-wide font-mono`}>Highly Recommended Zones</p>
                  <div className={`space-y-1`}>
                    {(scamData.safeZones || []).map((zone, idx) => (
                      <div key={idx} className={`flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 bg-zinc-50/50 dark:bg-zinc-950 p-2 border border-zinc-200 dark:border-zinc-850 rounded-lg text-[11px]`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 text-emerald-400 flex-shrink-0`} />
                        <span>{zone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unsafe Zones */}
                <div className={`space-y-1.5`}>
                  <p className={`text-[10px] font-bold text-rose-400 uppercase tracking-wide font-mono`}>Advisory Caution Districts</p>
                  <div className={`space-y-1`}>
                    {(scamData.unsafeZones || []).map((zone, idx) => (
                      <div key={idx} className={`flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 bg-zinc-50/50 dark:bg-zinc-950 p-2 border border-zinc-200 dark:border-zinc-850 rounded-lg text-[11px]`}>
                        <AlertTriangle className={`w-3.5 h-3.5 text-rose-400 flex-shrink-0`} />
                        <span>{zone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Taxi precaution checks */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white`}>Transit safety guidelines</h3>
              
              <div className={`space-y-3`}>
                {(scamData.taxiPrecautions || []).map((tip, idx) => (
                  <div key={idx} className={`flex gap-2.5 bg-zinc-50/50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300 leading-normal`}>
                    <span className={`text-rose-400 font-mono font-bold`}>#0{idx+1}</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Hotline services */}
            <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
              <h3 className={`text-sm font-semibold tracking-wide text-zinc-900 dark:text-white flex items-center gap-1.5`}>
                <Phone className={`w-4 h-4 text-rose-500 animate-pulse`} />
                Emergency Hotline numbers
              </h3>

              <div className={`space-y-2 text-xs`}>
                <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between`}>
                  <span className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Municipal Police</span>
                  <strong className={`text-zinc-900 dark:text-white font-mono text-xs`}>{scamData.emergencyNumbers.police}</strong>
                </div>
                <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between`}>
                  <span className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Medical Dispatch</span>
                  <strong className={`text-zinc-900 dark:text-white font-mono text-xs`}>{scamData.emergencyNumbers.ambulance}</strong>
                </div>
                <div className={`bg-zinc-50/50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between`}>
                  <span className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Tourist Safety Police</span>
                  <strong className={`text-rose-400 font-mono text-xs`}>{scamData.emergencyNumbers.touristPolice}</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className={`bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 p-8 rounded-2xl text-center py-24 space-y-3`}>
          <Shield className={`w-12 h-12 text-zinc-700 mx-auto stroke-[1.25] animate-pulse`} />
          <h4 className={`text-sm font-semibold text-zinc-500 dark:text-zinc-400`}>Scam Shield Offline</h4>
          <p className={`text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed`}>Ensure a destination is selected in the Planner cockpit to initialize regional safety ratings, common street scams registries, and emergency numbers.</p>
        </div>
      )}

    </div>
  );
}
