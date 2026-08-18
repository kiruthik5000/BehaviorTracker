import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Settings, Code2 } from 'lucide-react';
import AICopilotWidget from './AICopilotWidget';

export default function Sidebar({ onMutateSchedule, isMutating, showCopilot = true }) {
  return (
    <div className="w-[320px] shrink-0 h-screen bg-[#0f172a] border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 overflow-y-auto z-50">
      {/* Brand header */}
      <div className="flex flex-col mb-12 mt-4">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
          NeuroTracker
        </h1>
        <span className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">High-Intensity</span>
      </div>

      {/* Nav */}
      <nav className="flex-grow space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" />
        <NavItem to="/dsa" icon={<Code2 size={20}/>} label="DSA Revision" />
        <NavItem to="/analytics" icon={<BarChart2 size={20}/>} label="Analytics" />
        <NavItem to="/settings" icon={<Settings size={20}/>} label="Settings" />
      </nav>

      {/* AI Copilot Widget pinned to bottom */}
      {showCopilot && (
        <div className="mt-auto pt-8">
          <AICopilotWidget onMutateSchedule={onMutateSchedule} isLoading={isMutating} />
        </div>
      )}
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
    >
      {({ isActive }) => (
        <>
          <span className={`${isActive ? 'text-blue-400' : 'group-hover:text-slate-300'}`}>
            {icon}
          </span>
          <span className="font-semibold">{label}</span>
        </>
      )}
    </NavLink>
  );
}
