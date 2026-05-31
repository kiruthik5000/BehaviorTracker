const MCQ = require("../models/MCQQuestion");

// Get all MCQs
exports.getAllMCQs = async (req, res) => {
  try {
    const mcqs = await MCQ.find();
    res.status(200).json(mcqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single MCQ by ID
exports.getMCQById = async (req, res) => {
  try {
    const mcq = await MCQ.findById(req.params.id);
    if (!mcq) return res.status(404).json({ message: 'MCQ not found' });
    res.status(200).json(mcq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new MCQ
exports.createMCQ = async (req, res) => {
  const mcq = new MCQ(req.body);
  try {
    const newMCQ = await mcq.save();
    res.status(201).json(newMCQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an MCQ
exports.updateMCQ = async (req, res) => {
  try {
    const mcq = await MCQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!mcq) return res.status(404).json({ message: 'MCQ not found' });
    res.status(200).json(mcq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an MCQ
exports.deleteMCQ = async (req, res) => {
  try {
    const mcq = await MCQ.findByIdAndDelete(req.params.id);
    if (!mcq) return res.status(404).json({ message: 'MCQ not found' });
    res.status(200).json({ message: 'MCQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
