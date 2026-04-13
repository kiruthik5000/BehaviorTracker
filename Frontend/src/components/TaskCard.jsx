import React from 'react';
import { CheckCircle2, Circle, AlertCircle, PlayCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args) {
  return twMerge(clsx(args));
}

const typeMap = {
  'routine': { bg: 'bg-[#10b981]/10', border: 'border-[#10b981]', text: 'text-[#10b981]' },
  'deep-work': { bg: 'bg-[#ef4444]/10', border: 'border-[#ef4444]', text: 'text-[#ef4444]' },
  'dsa': { bg: 'bg-[#3b82f6]/10', border: 'border-[#3b82f6]', text: 'text-[#3b82f6]' },
  'break': { bg: 'bg-[#f59e0b]/10', border: 'border-[#f59e0b]', text: 'text-[#f59e0b]' },
  'flex': { bg: 'bg-[#a855f7]/10', border: 'border-[#a855f7]', text: 'text-[#a855f7]' },
};

export default function TaskCard({ task, onToggleCompletion }) {
  const styles = typeMap[task.type] || typeMap['routine'];

  return (
    <div 
      className={cx(
        "flex w-full items-center rounded-xl p-3 bg-[#1e293b]/50 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-[#1e293b] group cursor-pointer",
        task.isMissed ? "border-red-500/30" : task.isOngoing ? "border-green-500/30" : "border-white/5",
        task.isCompleted && "opacity-50 grayscale hover:grayscale-0"
      )}
      onClick={onToggleCompletion}
    >
      <div className={cx(
        "w-1 h-10 rounded-full mr-4 transition-colors duration-300", 
        styles.bg.replace('/10', ''), // fallback 
        styles.border
      )} />
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-0.5">
          <span className="text-sm font-medium text-slate-400 min-w-[110px]">
            {task.timeStart} - {task.timeEnd}
          </span>
          <span className={cx("text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-black/20", styles.text)}>
            {task.type.replace('-', ' ')}
          </span>
          {task.isMissed && !task.isCompleted && (
            <span className="text-[10px] font-bold text-red-400 flex items-center gap-1 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" /> Missed
            </span>
          )}
          {task.isOngoing && !task.isCompleted && (
            <span className="text-[10px] font-bold text-green-400 flex items-center gap-1 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full">
              <PlayCircle className="w-3 h-3" /> Ongoing
            </span>
          )}
        </div>
        
        <h3 className={cx(
          "text-base font-bold transition-colors", 
          task.isCompleted ? "line-through text-slate-500" : task.isMissed ? "text-red-200" : task.isOngoing ? "text-green-50" : "text-slate-200"
        )}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {task.description}
          </p>
        )}
      </div>

      <div className="ml-4 flex items-center justify-center pr-2">
        <button className="text-slate-500 hover:text-white transition-colors focus:outline-none">
          {task.isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
          ) : (
            <Circle className="w-6 h-6 group-hover:text-slate-300" />
          )}
        </button>
      </div>
    </div>
  );
}
