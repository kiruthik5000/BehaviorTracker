const mongoose = require('mongoose');

const DSAProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  difficulty: { type: String, default: 'Medium' },
  pattern: { type: String, default: 'General' },
  status: { type: String, enum: ['to-revise', 'completed'], default: 'to-revise' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DSAProblem', DSAProblemSchema);
