import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';

export default function AICopilotWidget({ onMutateSchedule, isLoading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    onMutateSchedule(prompt);
    setPrompt('');
  }

  return (
    <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-slate-200">AI Copilot</h3>
      </div>
      
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Describe how your day changed, and the AI will perfectly rewrite your schedule.
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. I woke up 2 hours late, shift everything and shorten lunch..."
          className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-3 pr-10 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 resize-none h-24 transition-all"
        />
        <button 
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="absolute bottom-3 right-3 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
