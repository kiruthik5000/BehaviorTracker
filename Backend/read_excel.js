const xlsx = require('xlsx');

const workbook = xlsx.readFile('E:\\PROJECTS\\BehaviourTracker\\LeetCode_DSA_Sheet.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

console.log("Total rows:", data.length);
console.log("Sample 3 rows:");
console.log(JSON.stringify(data.slice(0, 3), null, 2));
