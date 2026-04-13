import { useEffect, useRef } from 'react';
import { parse, differenceInMilliseconds } from 'date-fns';

const playAlarm = () => {
  const enabled = localStorage.getItem('neurotracker_alarm_enabled') !== 'false';
  if (!enabled) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    
    const playBeep = (startTime) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, startTime); // A5 note
      
      // Envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.2);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    };

    const now = ctx.currentTime;
    playBeep(now);       // Beep 1
    playBeep(now + 0.3); // Beep 2
    playBeep(now + 0.6); // Beep 3
  } catch (err) {
    console.error('AudioContext fail', err);
  }
};

export default function useScheduleMonitor(scheduleData) {
  // We keep a ref to queued task IDs so we don't alarm twice for the same task
  const alarmedTasks = useRef(new Set());

  useEffect(() => {
    if (!scheduleData || !scheduleData.sessions) return;

    const checkSchedule = () => {
      const now = new Date();
      
      scheduleData.sessions.forEach(session => {
        session.tasks.forEach(task => {
          if (alarmedTasks.current.has(task.id)) return;

          // Parse e.g., "05:45 AM" into today's datetime
          const taskStart = parse(task.timeStart, 'hh:mm a', new Date());
          const diffMs = differenceInMilliseconds(taskStart, now);

          // If the task starts anywhere from right now up to exactly 5 minutes from now
          // (The requested 5-minute heartbeat listening window)
          if (diffMs >= 0 && diffMs <= 300000) {
            
            // Queue the alarm precisely
            setTimeout(() => {
              playAlarm();
            }, diffMs);
            
            alarmedTasks.current.add(task.id);
          }
        });
      });
    };

    // Run the check immediately on mount/update
    checkSchedule();

    // Loop exactly every 5 minutes (300,000 ms) as specified
    const interval = setInterval(() => {
      checkSchedule();
    }, 300000);

    return () => clearInterval(interval);
  }, [scheduleData]);
}
