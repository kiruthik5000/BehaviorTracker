const DailyLog = require('../models/DailyLog');
const { modifyScheduleWithAI } = require('../services/llmService');

exports.modifySchedule = async (req, res) => {
  try {
    const { date, userPrompt, clientApiKey } = req.body;
    
    if (!date || !userPrompt) {
      return res.status(400).json({ message: 'Date and userPrompt are required.' });
    }

    let log = await DailyLog.findOne({ date });
    if (!log) {
      return res.status(404).json({ message: 'No schedule found for this date. Please fetch the date first to initialize the template.' });
    }

    // Call LLM Service with current sessions
    const aiSessions = await modifyScheduleWithAI(log.sessions, userPrompt, clientApiKey);

    // Apply the new mutated sessions
    log.sessions = aiSessions;
    log.aiModifications += 1;
    
    // Recalculate progress across sessions
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
    console.error(error);
    res.status(500).json({ error: error.message || 'Error executing AI mutation.' });
  }
};
