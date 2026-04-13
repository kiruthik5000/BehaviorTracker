import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';
import TaskCard from './TaskCard';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

export default function SessionAccordion({ session, onToggleCompletion }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!session) return null;

  const totalTasks = session.tasks?.length || 0;
  const completedTasks = session.tasks?.filter(t => t.isCompleted).length || 0;
  const isFullyCompleted = totalTasks > 0 && totalTasks === completedTasks;

  return (
    <div className="bg-[#1e293b]/50 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
      {/* Accordion Header */}
      <button 
        className="w-full flex items-center justify-between p-5 bg-[#0f172a] hover:bg-[#1e293b] transition-colors group cursor-pointer focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className={cx(
            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
            isFullyCompleted ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
          )}>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className={cx(
              "text-lg font-bold transition-colors",
              isFullyCompleted ? "text-slate-400 line-through" : "text-slate-200 group-hover:text-white"
            )}>
              {session.title}
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {completedTasks} / {totalTasks} events completed
            </span>
          </div>
        </div>

        <div className="text-slate-500 group-hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </button>

      {/* Accordion Body */}
      <div 
        className={cx(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 space-y-3 bg-[#0f172a]/50">
            {session.tasks && session.tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleCompletion={() => onToggleCompletion(session.id, task.id)} 
              />
            ))}
            {totalTasks === 0 && (
              <div className="text-center py-4 text-sm text-slate-500">
                No events in this session.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
