const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timeStart: { type: String, required: true },
  timeEnd: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['routine', 'deep-work', 'dsa', 'break', 'flex'], required: true },
  isCompleted: { type: Boolean, default: false }
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., session uuid to track
  title: { type: String, required: true }, // e.g., "Morning Session"
  tasks: [TaskSchema] // Precise events under this session
}, { _id: false });

const DailyLogSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  dayOfWeek: { type: String, required: true },
  sessions: [SessionSchema], 
  progressPercentage: { type: Number, default: 0 },
  aiModifications: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DailyLog', DailyLogSchema);
