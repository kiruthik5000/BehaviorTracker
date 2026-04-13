const DailyLog = require('../models/DailyLog');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find().sort({ date: -1 }); // newest first
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLogByDate = async (req, res) => {
  try {
    const { date } = req.params;
    let log = await DailyLog.findOne({ date });

    // Handle legacy data or missing data
    if (!log || (log && !log.sessions)) {
      if (log) {
        await DailyLog.deleteOne({ date }); // Clear legacy format
      }

      const dateObj = new Date(date);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      const defaultSessions = [
        {
          id: 's1',
          title: 'Morning Session',
          tasks: [
            { id: '1', timeStart: '05:45 AM', timeEnd: '06:00 AM', title: 'Wake Up', type: 'routine', description: 'Immediately out of bed. No phone. Splash water, light movement.' },
            { id: '2', timeStart: '06:00 AM', timeEnd: '06:40 AM', title: 'Physical Training', type: 'routine', description: 'Push-ups, squats, core, light cardio. End with cold/warm shower.' },
            { id: '3', timeStart: '07:00 AM', timeEnd: '10:00 AM', title: 'Deep Work Block 1', type: 'deep-work', description: 'Exam Subject - HARD topics! 50m focus + 10m break cycles. Walk/stretch only.' },
            { id: '4', timeStart: '10:00 AM', timeEnd: '10:30 AM', title: 'Breakfast', type: 'routine', description: 'Refuel and hydrate.' }
          ]
        },
        {
          id: 's2',
          title: 'Midday Mastery',
          tasks: [
            { id: '5', timeStart: '10:30 AM', timeEnd: '01:30 PM', title: 'Deep Work Block 2', type: 'deep-work', description: 'Exam Subject - Problem Solving and Practice.' },
            { id: '6', timeStart: '01:30 PM', timeEnd: '02:00 PM', title: 'Power Nap', type: 'break', description: '20-30m maximum to refresh the mind.' },
            { id: '7', timeStart: '02:00 PM', timeEnd: '03:30 PM', title: 'DSA Block', type: 'dsa', description: '1-2 solid problems. Focus on patterns and revision of old concepts.' },
            { id: '8', timeStart: '03:30 PM', timeEnd: '04:00 PM', title: 'Controlled Break', type: 'break', description: 'Step away from screens.' }
          ]
        },
        {
          id: 's3',
          title: 'Evening Grind',
          tasks: [
            { id: '9', timeStart: '04:00 PM', timeEnd: '06:00 PM', title: 'Deep Work Block 3', type: 'deep-work', description: 'Exam Revision & Weak Areas.' },
            { id: '10', timeStart: '06:00 PM', timeEnd: '06:45 PM', title: 'Walk / Light Activity', type: 'flex', description: 'No phone or minimal use. Reset dopamine.' },
            { id: '11', timeStart: '07:00 PM', timeEnd: '08:30 PM', title: 'Light Study', type: 'deep-work', description: 'Revision, flashcards, formulas.' },
            { id: '12', timeStart: '08:30 PM', timeEnd: '09:00 PM', title: 'Dinner', type: 'routine' }
          ]
        },
        {
          id: 's4',
          title: 'Night Closing',
          tasks: [
            { id: '13', timeStart: '09:00 PM', timeEnd: '09:45 PM', title: 'Optional Focus Block', type: 'flex', description: 'Only if energy is there. Otherwise skip without guilt.' },
            { id: '14', timeStart: '10:30 PM', timeEnd: '10:30 PM', title: 'Sleep', type: 'routine', description: 'Wind down and sleep.' }
          ]
        }
      ];

      log = new DailyLog({
        date,
        dayOfWeek: days[dateObj.getDay()],
        sessions: defaultSessions,
        progressPercentage: 0
      });
      await log.save();
    }
    
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { date, sessionId, taskId } = req.params;
    const log = await DailyLog.findOne({ date });
    
    if (!log) return res.status(404).json({ message: 'Log not found' });

    const session = log.sessions.find(s => s.id === sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const task = session.tasks.find(t => t.id === taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.isCompleted = !task.isCompleted;

    // Recalculate progress across all sessions
    let totalTasks = 0;
    let completedTasks = 0;

    log.sessions.forEach(s => {
      s.tasks.forEach(t => {
        totalTasks++;
        if (t.isCompleted) completedTasks++;
      });
    });

    log.progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    await log.save();
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
