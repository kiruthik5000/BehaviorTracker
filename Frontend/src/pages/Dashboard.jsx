import React, { useState, useEffect } from 'react';
import { format, parse, isBefore, isValid } from 'date-fns';
import api from '../api';
import ProgressBar from '../components/ProgressBar';
import SessionAccordion from '../components/SessionAccordion';
import Sidebar from '../components/Sidebar';
import useScheduleMonitor from '../hooks/useScheduleMonitor';

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());

  const formattedDate = format(currentDate, 'yyyy-MM-dd');
  const displayDate = format(currentDate, 'EEEE, MMMM do');

  // Activate our 5-minute background time monitor hook
  useScheduleMonitor(scheduleData);

  useEffect(() => {
    fetchSchedule(formattedDate);
  }, [formattedDate]);

  // Update 'now' every minute so tasks dynamically become 'missed' or 'ongoing'
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchSchedule = async (dateStr) => {
    try {
      setIsLoading(true);
      setError('');
      const res = await api.get(`/logs/${dateStr}`);
      setScheduleData(res.data);
    } catch (err) {
      setError('Failed to load schedule.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCompletion = async (sessionId, taskId) => {
    // Optimistic UI update
    setScheduleData(prev => {
      if (!prev) return prev;
      
      let totalTasks = 0;
      let completedCount = 0;
      
      const newSessions = prev.sessions.map(s => {
        if (s.id !== sessionId) {
          s.tasks.forEach(t => {
            totalTasks++;
            if (t.isCompleted) completedCount++;
          });
          return s;
        }
        
        const newTasks = s.tasks.map(t => {
          const isCompleted = t.id === taskId ? !t.isCompleted : t.isCompleted;
          totalTasks++;
          if (isCompleted) completedCount++;
          return { ...t, isCompleted };
        });
        
        return { ...s, tasks: newTasks };
      });

      const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);
      return { ...prev, sessions: newSessions, progressPercentage };
    });

    try {
      await api.patch(`/logs/${formattedDate}/session/${sessionId}/task/${taskId}`);
    } catch (err) {
      console.error('Failed to toggle task', err);
      fetchSchedule(formattedDate); // Re-sync manually
    }
  };

  const handleMutateSchedule = async (userPrompt) => {
    try {
      setIsMutating(true);
      setError('');
      
      const clientApiKey = localStorage.getItem('neurotracker_gemini_key') || undefined;

      const res = await api.post('/ai/modify-schedule', {
        date: formattedDate,
        userPrompt,
        clientApiKey
      });
      setScheduleData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'AI failed to modify schedule. Please try a different prompt.');
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  };

  // Group sessions functionally
  let ongoingSessions = [];
  let upcomingSessions = [];
  let finishedSessions = [];

  if (scheduleData && scheduleData.sessions) {
    scheduleData.sessions.forEach(session => {
      
      const tasksWithState = session.tasks.map(t => {
        let isMissed = false;
        let isOngoing = false;
        if (!t.isCompleted) {
          const taskEnd = parse(t.timeEnd, 'hh:mm a', currentDate);
          const taskStart = parse(t.timeStart, 'hh:mm a', currentDate);
          if (isValid(taskEnd) && isBefore(taskEnd, now)) {
            isMissed = true;
          } else if (isValid(taskStart) && isValid(taskEnd) && 
                    (isBefore(taskStart, now) || taskStart.getTime() === now.getTime()) && 
                    !isBefore(taskEnd, now)) {
            isOngoing = true;
          }
        }
        return { ...t, isMissed, isOngoing };
      });

      const updatedSession = { ...session, tasks: tasksWithState };
      const totalTasks = tasksWithState.length;
      const completedTasks = tasksWithState.filter(t => t.isCompleted).length;
      
      if (totalTasks > 0 && completedTasks === totalTasks) {
        finishedSessions.push(updatedSession);
      } else if (tasksWithState.some(t => t.isOngoing)) {
        ongoingSessions.push(updatedSession);
      } else {
        upcomingSessions.push(updatedSession);
      }
    });
  }

  const sortedSessions = [
    ...ongoingSessions,
    ...upcomingSessions,
    ...finishedSessions
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <Sidebar onMutateSchedule={handleMutateSchedule} isMutating={isMutating} />
      
      <main className="flex-1 ml-[320px] p-10 max-w-5xl mx-auto w-full">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">Today's Protocol</h2>
            <h1 className="text-4xl font-black text-white tracking-tight">{displayDate}</h1>
          </div>
          
          <div className="bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-semibold mr-2">AI Mutations:</span>
            <span className="text-sm font-bold text-purple-400">{scheduleData?.aiModifications || 0}</span>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex gap-2 items-center justify-center h-64">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <section className="bg-[#0f172a] p-6 rounded-2xl border border-white/5 shadow-2xl">
              <ProgressBar progress={scheduleData?.progressPercentage || 0} />
            </section>
            
            <section className="space-y-6">
              {sortedSessions.length === 0 ? (
                 <div className="flex items-center justify-center h-64 text-slate-400 italic bg-[#0f172a] rounded-2xl border border-white/5">
                   No sessions for today. Let the AI generate your schedule!
                 </div>
              ) : (
                sortedSessions.map((session) => (
                  <SessionAccordion 
                    key={session.id} 
                    session={session} 
                    onToggleCompletion={handleToggleCompletion} 
                  />
                ))
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
