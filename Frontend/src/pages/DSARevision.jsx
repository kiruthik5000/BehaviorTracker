import React, { useState, useEffect } from 'react';
import { Database, Plus, CheckCircle2, Circle, ExternalLink, Code2, ChevronDown, ChevronRight } from 'lucide-react';
import api from '../api';

export default function DSARevision() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProb, setNewProb] = useState({ title: '', link: '', difficulty: 'Medium', pattern: 'General' });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await api.get('/dsa');
      setProblems(res.data);
    } catch (err) {
      console.error('Failed to fetch DSA problems:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      setProblems(probs => probs.map(p => p._id === id ? { ...p, status: p.status === 'to-revise' ? 'completed' : 'to-revise' } : p));
      await api.patch(`/dsa/${id}`);
    } catch (err) {
      console.error('Status toggle failed:', err);
      fetchProblems();
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!newProb.title || !newProb.link) return;
    
    try {
      const res = await api.post('/dsa', newProb);
      setProblems([res.data, ...problems]);
      setNewProb({ title: '', link: '', difficulty: 'Medium', pattern: 'General' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add problem:', err);
    }
  };

  const groupedProblems = problems.reduce((group, prob) => {
    const pattern = prob.pattern || 'Uncategorized';
    if (!group[pattern]) group[pattern] = [];
    group[pattern].push(prob);
    return group;
  }, {});

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#3b82f6] uppercase mb-2">Knowledge Base</h2>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            DSA Revision Hub
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-bold rounded-full border border-purple-500/20">
              {problems.filter(p => p.status === 'completed').length} / {problems.length}
            </span>
          </h1>
          <p className="text-slate-400 mt-2">Your synchronized local problem sheet pulling directly from the algorithm database.</p>
        </div>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Problem
        </button>
      </header>

      {/* Add Form */}
      <div className={`overflow-hidden transition-all duration-500 ${showAddForm ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
        <form onSubmit={handleAddProblem} className="bg-[#0f172a] border border-white/10 p-6 rounded-2xl shadow-xl flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Problem Title</label>
            <input type="text" value={newProb.title} onChange={e => setNewProb({...newProb, title: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g. Two Sum" />
          </div>
          <div className="flex-1 min-w-[300px]">
             <label className="block text-xs font-bold text-slate-400 uppercase mb-2">LeetCode URL</label>
             <input type="url" value={newProb.link} onChange={e => setNewProb({...newProb, link: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-blue-500/50 outline-none transition-colors" placeholder="https://leetcode.com/..." />
          </div>
          <div className="w-32">
             <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Difficulty</label>
             <select value={newProb.difficulty} onChange={e => setNewProb({...newProb, difficulty: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-blue-500/50 outline-none transition-colors">
               <option>Easy</option>
               <option>Medium</option>
               <option>Hard</option>
             </select>
          </div>
          <div className="w-48">
             <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pattern Tag</label>
             <input type="text" value={newProb.pattern} onChange={e => setNewProb({...newProb, pattern: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-blue-500/50 outline-none transition-colors" placeholder="e.g. Sliding Window" />
          </div>
          <button type="submit" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors h-[50px]">
            Save
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex gap-2 items-center justify-center h-64">
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
           <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedProblems).map(pattern => (
            <PatternAccordion
               key={pattern}
               pattern={pattern}
               patternProblems={groupedProblems[pattern]}
               toggleStatus={toggleStatus}
            />
          ))}

          {problems.length === 0 && (
            <div className="text-center p-12 bg-[#0f172a] rounded-2xl border border-white/5 border-dashed mt-12">
              <Code2 className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No problems stored yet</h3>
              <p className="text-slate-500 text-sm">Use the "Add Problem" button above or let the backend seeder sync your Excel sheet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PatternAccordion({ pattern, patternProblems, toggleStatus }) {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default for cleaner bulk viewing

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const completedCount = patternProblems.filter(p => p.status === 'completed').length;

  return (
    <div className={`bg-[#0f172a]/60 rounded-3xl border border-white/5 relative overflow-hidden backdrop-blur-xl shadow-xl transition-all duration-300 ${isOpen ? 'pb-8' : ''}`}>
      
      {/* Clickable Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 md:p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
            <Database className="w-5 h-5" />
          </div>
          <h3 className={`text-xl font-bold transition-colors ${isOpen ? 'text-slate-100' : 'text-slate-300'}`}>
            {pattern}
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
            {completedCount} / {patternProblems.length} completed
          </span>
        </div>

        <div className="text-slate-500 mr-2">
          {isOpen ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
      </button>

      {/* Accordion Body */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-8 transition-all duration-500 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100 max-h-[5000px] mt-2' : 'opacity-0 scale-y-0 max-h-0 m-0'}`}>
        {patternProblems.map(prob => (
          <div key={prob._id} className={`group flex flex-col p-5 rounded-2xl border transition-all duration-300 ${prob.status === 'completed' ? 'bg-[#0f172a]/40 border-white/5 opacity-60' : 'bg-[#1e293b]/50 border-white/10 hover:border-slate-500 hover:bg-[#1e293b]'}`}>
            
            <div className="flex items-start justify-between mb-4">
              <a href={prob.link} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-200 hover:text-white transition-colors flex items-start gap-2 max-w-[80%] leading-tight group-hover:underline">
                <span>{prob.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <button 
                onClick={() => toggleStatus(prob._id)}
                className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                title={prob.status === 'completed' ? "Mark to revise" : "Mark completed"}
              >
                {prob.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
              </button>
            </div>

            <div className="mt-auto flex items-center gap-2">
               <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${getDifficultyColor(prob.difficulty)}`}>
                 {prob.difficulty}
               </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
