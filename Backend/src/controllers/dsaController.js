const DSAProblem = require('../models/DSAProblem');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

exports.getAllProblems = async (req, res) => {
  try {
    // Check if empty, if so, seed from Excel
    let problems = await DSAProblem.find({});
    
    if (problems.length === 0) {
      console.log('DSA DB empty, attempting to seed from Excel...');
      const excelPath = path.resolve(__dirname, '../../../LeetCode_DSA_Sheet.xlsx');
      
      if (fs.existsSync(excelPath)) {
        const workbook = xlsx.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        // Skip header rows (index 0 and 1 generally are titles/headers in our test script)
        // Let's filter out row chunks that don't have valid links
        const formattedProblems = [];
        data.forEach(row => {
          const title = row.__EMPTY; // "Problem Name"
          const link = row.__EMPTY_1; // "LeetCode Link"
          const difficulty = row.__EMPTY_2; // "Difficulty"
          const pattern = row.__EMPTY_3; // "Pattern"

          if (link && typeof link === 'string' && link.startsWith('http')) {
            formattedProblems.push({
              title: title || 'Unknown Problem',
              link: link,
              difficulty: difficulty || 'Medium',
              pattern: pattern || 'General',
              status: 'to-revise'
            });
          }
        });

        if (formattedProblems.length > 0) {
          await DSAProblem.insertMany(formattedProblems);
          problems = await DSAProblem.find({});
          console.log(`Successfully seeded ${formattedProblems.length} problems!`);
        }
      } else {
        console.warn(`Excel file not found at ${excelPath}`);
      }
    }

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProblem = async (req, res) => {
  try {
    const { title, link, difficulty, pattern } = req.body;
    const newProb = new DSAProblem({
      title,
      link,
      difficulty: difficulty || 'Medium',
      pattern: pattern || 'General',
      status: 'to-revise'
    });
    await newProb.save();
    res.status(201).json(newProb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const prob = await DSAProblem.findById(id);
    if (!prob) return res.status(404).json({ message: 'Problem not found' });
    
    prob.status = prob.status === 'to-revise' ? 'completed' : 'to-revise';
    await prob.save();
    
    res.status(200).json(prob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
