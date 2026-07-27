import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, Languages, Coins, Bell, Shield, Sparkles, Database, 
  Trash2, Download, Check, AlertTriangle 
} from 'lucide-react';
import { UserPreferences, UserProfileData } from '../types';

interface SettingsProps {
  isLight: boolean;
  isOfflineMode?: boolean;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onResetApp: () => void;
  profileData: UserProfileData;
}

export default function SettingsComponent({isLight, 
  preferences, 
  onUpdatePreferences, 
  onResetApp, 
  profileData 
}: SettingsProps) {
  const [themeInput, setThemeInput] = useState<'light' | 'dark' | 'emerald' | 'sunset'>(preferences.theme);
  const [languageInput, setLanguageInput] = useState(preferences.language);
  const [currencyInput, setCurrencyInput] = useState(preferences.currency);
  const [ramadanToggle, setRamadanToggle] = useState(preferences.ramadanMode);
  
  // Alert checkboxes
  const [prayerAlerts, setPrayerAlerts] = useState(true);
  const [scamAlerts, setScamAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  
  // AI sliders
  const [aiTemp, setAiTemp] = useState(0.7);

  const handleSave = () => {
    onUpdatePreferences({
      theme: themeInput,
      language: languageInput,
      currency: currencyInput,
      ramadanMode: ramadanToggle,
      budgetPreference: preferences.budgetPreference,
      travelStyles: preferences.travelStyles
    });
    alert('Settings compiled and saved successfully!');
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profileData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TravixIQ_Backup_${profileData.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = () => {
    const doubleCheck = confirm("Are you absolutely sure you want to delete your profile details? This resets all saved trips, unlocked achievement badges, and travel goals back to defaults. This action is irreversible.");
    if (doubleCheck) {
      onResetApp();
    }
  };

  return (
    <div id="settings-view" className={`space-y-6 animate-fade-in max-w-3xl mx-auto`}>
      
      <div className={`border-b border-zinc-200 dark:border-zinc-800 pb-5`}>
        <h2 className={`text-xl font-bold font-display tracking-tight text-zinc-900 dark:text-white flex items-center gap-2`}>
          <Settings className={`w-5 h-5 text-cyan-400`} />
          Settings Cockpit
        </h2>
        <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>Customize default language settings, visual layout presets, AI parameters, and backup archives.</p>
      </div>

      <div className={`space-y-5`}>
        
        {/* Localization Preferences */}
        <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Languages className={`w-4 h-4 text-cyan-400`} />
            Localization & Formats
          </h3>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs`}>
            {/* Preferred Language */}
            <div className={`space-y-2`}>
              <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Default Language</label>
              <select 
                id="language-select"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                className={`w-full bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-zinc-900 dark:text-white focus:outline-none`}
              >
                <option value="en">English (US/UK)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="ms">Bahasa Melayu (Malay)</option>
                <option value="fr">Français (French)</option>
                <option value="ja">日本語 (Japanese)</option>
              </select>
            </div>

            {/* Preferred Currency */}
            <div className={`space-y-2`}>
              <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Preferred Exchange Currency</label>
              <select 
                id="currency-select"
                value={currencyInput}
                onChange={(e) => setCurrencyInput(e.target.value)}
                className={`w-full bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-zinc-900 dark:text-white focus:outline-none`}
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Eurozone Euro</option>
                <option value="GBP">GBP (£) - British Pound Sterling</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="MYR">MYR (RM) - Malaysian Ringgit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Themes selection */}
        <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Sparkles className={`w-4 h-4 text-cyan-400`} />
            Visual Interface Presets
          </h3>

          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs`}>
            {(['light', 'dark', 'emerald', 'sunset'] as const).map((themeOpt) => {
              const bgColors = {
                light: 'bg-zinc-100 border-zinc-300 text-zinc-800',
                dark: 'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200',
                emerald: 'bg-emerald-950 border-emerald-900 text-emerald-100',
                sunset: 'bg-amber-950 border-amber-900 text-amber-100'
              };
              return (
                <button
                  id={`theme-btn-${themeOpt}`}
                  key={themeOpt}
                  onClick={() => setThemeInput(themeOpt)}
                  className={`p-4 rounded-xl border-2 text-left space-y-1 transition-all ${bgColors[themeOpt]} ${
                    themeInput === themeOpt ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-zinc-950 border-transparent' : ''
                  }`}
                >
                  <p className={`font-bold uppercase text-[10px] tracking-wide`}>{themeOpt} Mode</p>
                  <p className={`text-[9px] opacity-75`}>Curated styling layout</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerts & Push notifications */}
        <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Bell className={`w-4 h-4 text-rose-400`} />
            Telemetry Alert Triggers
          </h3>

          <div className={`space-y-3.5 text-xs`}>
            <div className={`flex items-center justify-between p-3 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl`}>
              <div className={`space-y-0.5`}>
                <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>Athan / Prayer Time Notifications</p>
                <p className={`text-[10px] text-zinc-500 leading-none`}>Play simulated alert audios at exact localized schedules.</p>
              </div>
              <input 
                id="alert-prayer"
                type="checkbox" 
                checked={prayerAlerts}
                onChange={(e) => setPrayerAlerts(e.target.checked)}
                className={`rounded border-zinc-200 dark:border-zinc-800 text-cyan-500 focus:ring-0 w-4 h-4 accent-cyan-500 bg-white dark:bg-zinc-900`}
              />
            </div>

            <div className={`flex items-center justify-between p-3 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl`}>
              <div className={`space-y-0.5`}>
                <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>Scam Shield Live Alerts</p>
                <p className={`text-[10px] text-zinc-500 leading-none`}>Trigger warnings when wandering near flagged tourist decoy districts.</p>
              </div>
              <input 
                id="alert-scam"
                type="checkbox" 
                checked={scamAlerts}
                onChange={(e) => setScamAlerts(e.target.checked)}
                className={`rounded border-zinc-200 dark:border-zinc-800 text-cyan-500 focus:ring-0 w-4 h-4 accent-cyan-500 bg-white dark:bg-zinc-900`}
              />
            </div>

            <div className={`flex items-center justify-between p-3 bg-zinc-50/50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl`}>
              <div className={`space-y-0.5`}>
                <p className={`font-bold text-zinc-700 dark:text-zinc-200`}>Atmospheric & Air Quality Alerts</p>
                <p className={`text-[10px] text-zinc-500 leading-none`}>Notify when destination UV scales or AQI elements decline.</p>
              </div>
              <input 
                id="alert-weather"
                type="checkbox" 
                checked={weatherAlerts}
                onChange={(e) => setWeatherAlerts(e.target.checked)}
                className={`rounded border-zinc-200 dark:border-zinc-800 text-cyan-500 focus:ring-0 w-4 h-4 accent-cyan-500 bg-white dark:bg-zinc-900`}
              />
            </div>
          </div>
        </div>

        {/* AI Creative parameters */}
        <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Sparkles className={`w-4 h-4 text-cyan-400`} />
            AI LLM Parameters
          </h3>

          <div className={`space-y-3.5 text-xs`}>
            <div className={`space-y-2`}>
              <div className={`flex justify-between items-center`}>
                <label className={`text-zinc-500 dark:text-zinc-400 font-medium`}>Generation Creativity (Temperature)</label>
                <span className={`font-bold text-cyan-400 font-mono`}>{aiTemp}</span>
              </div>
              <input 
                id="temp-range"
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={aiTemp}
                onChange={(e) => setAiTemp(parseFloat(e.target.value))}
                className={`w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500`}
              />
              <p className={`text-[10px] text-zinc-500 leading-none`}>
                Lower values yield strict factual itineraries. Higher values permit creative adventure highlights.
              </p>
            </div>
          </div>
        </div>

        {/* Backup & Purge Archives */}
        <div className={`bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4`}>
          <h3 className={`text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5`}>
            <Database className={`w-4 h-4 text-rose-400`} />
            Backup & Purge Registry
          </h3>

          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs`}>
            <button 
              id="export-backup-btn"
              onClick={handleExportData}
              className={`p-3.5 bg-zinc-50/50 dark:bg-zinc-950 hover:bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-left font-semibold flex items-center justify-between`}
            >
              <div className={`space-y-0.5`}>
                <p>Backup Profile JSON</p>
                <p className={`text-[10px] text-zinc-500 font-normal`}>Download saved itineraries & goals.</p>
              </div>
              <Download className={`w-4 h-4 text-cyan-400`} />
            </button>

            <button 
              id="delete-backup-btn"
              onClick={handleDeleteAccount}
              className={`p-3.5 bg-zinc-50/50 dark:bg-zinc-950 hover:bg-rose-950/20 border border-zinc-200 dark:border-zinc-800 hover:border-rose-900/30 text-rose-400 rounded-xl text-left font-semibold flex items-center justify-between`}
            >
              <div className={`space-y-0.5`}>
                <p>Purge Local Cache</p>
                <p className={`text-[10px] text-zinc-500 font-normal`}>Wipe history & reset profile.</p>
              </div>
              <Trash2 className={`w-4 h-4 text-rose-400`} />
            </button>
          </div>
        </div>

        {/* Global Save and commit bar */}
        <div className={`flex justify-end gap-2.5 pt-2`}>
          <button 
            id="settings-commit"
            onClick={handleSave}
            className={`px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-zinc-900 dark:text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/10 hover:shadow-cyan-600/25 transition-all flex items-center gap-1.5 active:scale-[0.98]`}
          >
            <Check className={`w-4 h-4`} />
            Commit Configuration
          </button>
        </div>

      </div>

    </div>
  );
}
