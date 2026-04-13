import React from 'react';

export default function ProgressBar({ progress }) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-300">Daily Progress</span>
        <span className="text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded-md">
          {clampedProgress}%
        </span>
      </div>
      <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1000 ease-out relative"
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 blur-sm transform -skew-x-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
