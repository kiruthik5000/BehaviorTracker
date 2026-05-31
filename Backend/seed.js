const mongoose = require('mongoose');
require('dotenv').config();
const MCQ = require('./src/models/MCQQuestion');

const sampleMCQs = [
  {
    title: 'JavaScript Basics',
    category: 'JavaScript',
    subcategory: 'Variables',
    difficulty: 'easy',
    question: 'Which keyword is used to declare a block-scoped variable in JavaScript?',
    options: ['var', 'let', 'const', 'Both let and const'],
    correctAnswer: 'Both let and const',
    explanation: '`let` and `const` are both block-scoped. `var` is function-scoped. `const` also prevents reassignment.',
    marks: 1,
  },
  {
    title: 'JavaScript Basics',
    category: 'JavaScript',
    subcategory: 'Functions',
    difficulty: 'easy',
    question: 'What does the `typeof` operator return for an array in JavaScript?',
    options: ['array', 'object', 'list', 'undefined'],
    correctAnswer: 'object',
    explanation: 'Arrays in JavaScript are objects. `typeof []` returns "object". Use `Array.isArray()` to check for arrays.',
    marks: 1,
  },
  {
    title: 'Data Structures',
    category: 'DSA',
    subcategory: 'Arrays',
    difficulty: 'medium',
    question: 'What is the time complexity of accessing an element by index in an array?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctAnswer: 'O(1)',
    explanation: 'Array elements are stored contiguously in memory. Direct index access computes the memory address in constant time: address = base + index * element_size.',
    marks: 2,
  },
  {
    title: 'Data Structures',
    category: 'DSA',
    subcategory: 'Linked Lists',
    difficulty: 'medium',
    question: 'What is the time complexity of inserting an element at the beginning of a singly linked list?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctAnswer: 'O(1)',
    explanation: 'Inserting at the head only requires creating a new node and updating the head pointer — no traversal needed.',
    marks: 2,
  },
  {
    title: 'Algorithms',
    category: 'DSA',
    subcategory: 'Sorting',
    difficulty: 'hard',
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Merge Sort', 'Quick Sort', 'Selection Sort'],
    correctAnswer: 'Merge Sort',
    explanation: 'Merge Sort guarantees O(n log n) in all cases. Quick Sort averages O(n log n) but degrades to O(n²) in worst case. Bubble and Selection Sort are O(n²).',
    marks: 3,
  },
  {
    title: 'React Fundamentals',
    category: 'React',
    subcategory: 'Hooks',
    difficulty: 'medium',
    question: 'Which React hook is used to perform side effects in a functional component?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 'useEffect',
    explanation: '`useEffect` runs after render and is used for side effects like data fetching, subscriptions, or DOM mutations.',
    marks: 2,
  },
  {
    title: 'Node.js',
    category: 'Backend',
    subcategory: 'Express',
    difficulty: 'easy',
    question: 'Which method in Express.js is used to handle GET requests?',
    options: ['app.post()', 'app.get()', 'app.put()', 'app.fetch()'],
    correctAnswer: 'app.get()',
    explanation: 'Express provides HTTP method helpers: app.get(), app.post(), app.put(), app.delete() etc., corresponding to HTTP verbs.',
    marks: 1,
  },
  {
    title: 'Databases',
    category: 'MongoDB',
    subcategory: 'Queries',
    difficulty: 'medium',
    question: 'Which MongoDB operator is used to find documents where a field value is greater than a specified value?',
    options: ['$eq', '$gt', '$in', '$gte'],
    correctAnswer: '$gt',
    explanation: '$gt means "greater than". $gte means "greater than or equal". Use them in query conditions like { age: { $gt: 18 } }.',
    marks: 2,
  },
  {
    title: 'CSS Basics',
    category: 'Frontend',
    subcategory: 'Flexbox',
    difficulty: 'easy',
    question: 'Which CSS property is used to align flex items along the cross axis?',
    options: ['justify-content', 'align-items', 'flex-direction', 'flex-wrap'],
    correctAnswer: 'align-items',
    explanation: '`align-items` controls alignment on the cross axis (vertical by default). `justify-content` handles the main axis.',
    marks: 1,
  },
  {
    title: 'System Design',
    category: 'Architecture',
    subcategory: 'REST',
    difficulty: 'hard',
    question: 'Which HTTP status code should be returned when a resource is successfully created?',
    options: ['200 OK', '201 Created', '204 No Content', '202 Accepted'],
    correctAnswer: '201 Created',
    explanation: '201 Created is the correct response for POST requests that result in resource creation. The response should include the new resource or a Location header.',
    marks: 3,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-tracker');
  console.log('Connected to MongoDB');

  await MCQ.deleteMany({});
  console.log('Cleared existing MCQs');

  const inserted = await MCQ.insertMany(sampleMCQs);
  console.log(`✅ Seeded ${inserted.length} MCQ documents`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(e => { console.error(e); process.exit(1); });
