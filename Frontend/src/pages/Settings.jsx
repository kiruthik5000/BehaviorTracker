import React, { useState, useEffect } from 'react';
import { Key, Save, Shield, CheckCircle2, Bell, Moon, Sun, Monitor, HardDrive, Trash2, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(() => {
    return localStorage.getItem('neurotracker_alarm_enabled') !== 'false';
  });
  const [themeOption, setThemeOption] = useState('dark'); // 'dark', 'light', 'system'

  useEffect(() => {
    localStorage.setItem('neurotracker_alarm_enabled', pushEnabled);
  }, [pushEnabled]);

  useEffect(() => {
    const key = localStorage.getItem('neurotracker_gemini_key');
    if (key) {
      setApiKey(key);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('neurotracker_gemini_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto pb-20">
      <header className="mb-12">
        <h2 className="text-sm font-bold tracking-widest text-[#3b82f6] uppercase mb-2">Configuration</h2>
        <h1 className="text-4xl font-black text-white tracking-tight">Preferences</h1>
        <p className="text-slate-400 mt-2">Manage your AI integrations, UI themes, and local datasets.</p>
      </header>

      <div className="space-y-8 relative">
        {/* Glow effect behind the main card */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* --- AI Integration Section --- */}
        <section className="bg-[#0f172a]/90 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative z-10">
          <div className="p-8 border-b border-white/5 bg-gradient-to-r from-transparent via-[#1e293b]/30 to-transparent">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/10 text-purple-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">AI Integration Engine</h3>
                <p className="text-sm text-slate-400 mt-1">Configure your local API connection for the AI Copilot.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="md:w-1/2">
                <label className="block text-sm font-bold text-slate-300 mb-2">Google Gemini API Key</label>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Stored securely via DOM Local Storage. Data never touches our proprietary databases. The AI Copilot uses this dedicated key to orchestrate your daily session generation.
                </p>
              </div>

              <div className="md:w-1/2 w-full">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400">
                    <Key className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    autoComplete="off"
                    placeholder="AIzaSy..."
                    spellCheck="false"
                    className="block w-full pl-11 bg-[#020617] border border-slate-800 text-slate-200 rounded-xl py-3.5 px-4 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all font-mono text-sm tracking-widest shadow-inner placeholder-slate-700 hover:border-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-6">
              <div className={cx(
                "flex items-center gap-2 transition-all duration-500 overflow-hidden",
                saved ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
              )}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400 whitespace-nowrap">Secured locally</span>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                <Save className="w-4 h-4" />
                Update Key
              </button>
            </div>
          </form>
        </section>

        {/* --- UI & Experience Options --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
          
          <section className="bg-[#0f172a]/90 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-6">Experience</h3>
            
            <div className="space-y-8">
              {/* Push Notifications Toggle */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Push Notifications</h4>
                    <p className="text-xs text-slate-500">Alerts for upcoming Deep Work.</p>
                  </div>
                </div>
                
                {/* Switch Component */}
                <button 
                  type="button" 
                  role="switch" 
                  aria-checked={pushEnabled}
                  onClick={() => setPushEnabled(!pushEnabled)}
                  className={cx(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]",
                    pushEnabled ? "bg-emerald-500" : "bg-slate-700"
                  )}
                >
                  <span className={cx(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    pushEnabled ? "translate-x-5" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Theme Selection */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10">
                    {themeOption === 'dark' ? <Moon className="w-5 h-5" /> : themeOption === 'light' ? <Sun className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">System Theme</h4>
                    <p className="text-xs text-slate-500">Force visual styling mode.</p>
                  </div>
                </div>

                <div className="flex bg-[#020617] rounded-lg p-1 border border-slate-800">
                  {['light', 'dark', 'system'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setThemeOption(theme)}
                      className={cx(
                        "px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all",
                        themeOption === theme 
                          ? "bg-[#1e293b] text-white shadow-sm border border-white/5" 
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- Data Management --- */}
          <section className="bg-[#0f172a]/90 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-6">Data Management</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-slate-800 text-slate-400 border border-white/5 group-hover:bg-slate-700 transition-colors">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Export Timeline</h4>
                    <p className="text-xs text-slate-500">Download history as .CSV</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg transition-colors border border-white/5">
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/10 group-hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400">Clear Records</h4>
                    <p className="text-xs text-red-500/70">Permanently delete all sessions.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold rounded-lg transition-colors border border-red-500/20">
                  Reset
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
