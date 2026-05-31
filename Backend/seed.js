const mongoose = require('mongoose');
require('dotenv').config();
const MCQ = require('./src/models/MCQQuestion');

const sampleMCQs = [
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Data Types",
    "difficulty": "easy",
    "question": "Which of the following is NOT a primitive data type in Java?",
    "options": ["int", "boolean", "String", "char"],
    "correctAnswer": "String",
    "explanation": "String is a class in Java, not a primitive data type. The 8 primitive types are byte, short, int, long, float, double, boolean, and char.",
    "marks": 1
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "OOP - Inheritance",
    "difficulty": "medium",
    "question": "Which keyword is used to prevent a class from being subclassed in Java?",
    "options": ["static", "abstract", "final", "sealed"],
    "correctAnswer": "final",
    "explanation": "The 'final' keyword when applied to a class prevents it from being extended by any subclass.",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "OOP - Polymorphism",
    "difficulty": "medium",
    "question": "What type of polymorphism is method overloading in Java?",
    "options": ["Runtime polymorphism", "Compile-time polymorphism", "Dynamic polymorphism", "Interface polymorphism"],
    "correctAnswer": "Compile-time polymorphism",
    "explanation": "Method overloading is resolved at compile time based on the method signature, making it compile-time (static) polymorphism.",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Collections - List",
    "difficulty": "medium",
    "question": "Which collection class allows duplicate elements and maintains insertion order?",
    "options": ["HashSet", "TreeSet", "ArrayList", "HashMap"],
    "correctAnswer": "ArrayList",
    "explanation": "ArrayList implements the List interface, which allows duplicates and maintains the insertion order of elements.",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Collections - Map",
    "difficulty": "hard",
    "question": "What is the default initial capacity and load factor of a HashMap in Java?",
    "options": ["16 and 0.75", "10 and 0.5", "32 and 0.80", "8 and 1.0"],
    "correctAnswer": "16 and 0.75",
    "explanation": "HashMap's default initial capacity is 16 and the default load factor is 0.75, meaning it resizes when 75% full.",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Multithreading",
    "difficulty": "medium",
    "question": "Which method is called by the JVM when a thread is scheduled to run?",
    "options": ["start()", "run()", "execute()", "init()"],
    "correctAnswer": "run()",
    "explanation": "The JVM calls run() internally after start() is invoked. Calling run() directly does NOT create a new thread — it runs on the current thread.",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Exception Handling",
    "difficulty": "medium",
    "question": "Which of the following is a checked exception in Java?",
    "options": ["NullPointerException", "ArrayIndexOutOfBoundsException", "IOException", "ClassCastException"],
    "correctAnswer": "IOException",
    "explanation": "IOException is a checked exception that must be declared or handled. The others listed are unchecked (RuntimeException subclasses).",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Memory Management",
    "difficulty": "hard",
    "question": "Where are objects stored in Java's memory model?",
    "options": ["Stack", "Heap", "Method Area", "Program Counter Register"],
    "correctAnswer": "Heap",
    "explanation": "All Java objects are allocated on the heap memory. The stack stores local variables and method call frames, not objects.",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Interfaces",
    "difficulty": "hard",
    "question": "Which feature introduced in Java 8 allows an interface to have a method with a body?",
    "options": ["Abstract method", "Static method only", "Default method", "Final method"],
    "correctAnswer": "Default method",
    "explanation": "Java 8 introduced default methods (using the 'default' keyword) that allow interfaces to provide a method implementation without breaking existing implementations.",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Stream API",
    "difficulty": "hard",
    "question": "Which of the following is a terminal operation in Java Stream API?",
    "options": ["filter()", "map()", "collect()", "sorted()"],
    "correctAnswer": "collect()",
    "explanation": "collect() is a terminal operation that triggers stream processing and collects results. filter(), map(), and sorted() are intermediate operations.",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "String Handling",
    "difficulty": "medium",
    "question": "What will 'new String(\"hello\") == new String(\"hello\")' evaluate to in Java?",
    "options": ["true", "false", "Compilation error", "Runtime exception"],
    "correctAnswer": "false",
    "explanation": "== compares object references, not content. Two separate 'new' objects have different references. Use .equals() for content comparison.",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Access Modifiers",
    "difficulty": "easy",
    "question": "Which access modifier makes a member accessible only within the same class?",
    "options": ["public", "protected", "private", "default"],
    "correctAnswer": "private",
    "explanation": "The 'private' modifier restricts access to only within the declaring class. It is the most restrictive access level in Java.",
    "marks": 1
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Static Members",
    "difficulty": "medium",
    "question": "Can a static method access a non-static (instance) variable directly?",
    "options": ["Yes, always", "No, never", "Yes, if the class is final", "Yes, using 'this' keyword"],
    "correctAnswer": "No, never",
    "explanation": "Static methods belong to the class, not an instance. They cannot access instance variables directly without an object reference.",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Generics",
    "difficulty": "hard",
    "question": "What does the wildcard '? extends T' mean in Java generics?",
    "options": ["Any type that is a superclass of T", "Any type that is a subclass of T or T itself", "Any type unrelated to T", "Only exactly type T"],
    "correctAnswer": "Any type that is a subclass of T or T itself",
    "explanation": "'? extends T' is an upper-bounded wildcard meaning the type must be T or a subtype of T. It enables covariance (read-only usage).",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Lambda Expressions",
    "difficulty": "medium",
    "question": "Which functional interface does the lambda '(x) -> x * x' best represent?",
    "options": ["Runnable", "Supplier<Integer>", "Function<Integer, Integer>", "Consumer<Integer>"],
    "correctAnswer": "Function<Integer, Integer>",
    "explanation": "Function<T, R> takes one argument and returns a result. Since this lambda takes an integer and returns an integer, Function<Integer, Integer> is correct.",
    "marks": 2
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Serialization",
    "difficulty": "easy",
    "question": "What does the 'transient' keyword do in Java?",
    "options": ["Prevents a variable from being modified", "Excludes a variable from serialization", "Makes a variable thread-safe", "Makes a variable static"],
    "correctAnswer": "Excludes a variable from serialization",
    "explanation": "When a field is marked 'transient', it is skipped during Java object serialization and its value is not saved to a stream.",
    "marks": 1
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Sorting & Comparators",
    "difficulty": "hard",
    "question": "Which interface must a class implement to define its natural ordering in Java?",
    "options": ["Comparator", "Comparable", "Sortable", "Orderable"],
    "correctAnswer": "Comparable",
    "explanation": "Implementing Comparable<T> and overriding compareTo() defines the natural ordering of a class. Comparator is used for external/custom ordering.",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Class Loading",
    "difficulty": "hard",
    "question": "Which classloader loads the core Java API classes (java.lang, java.util, etc.)?",
    "options": ["Application ClassLoader", "Extension ClassLoader", "Bootstrap ClassLoader", "Custom ClassLoader"],
    "correctAnswer": "Bootstrap ClassLoader",
    "explanation": "The Bootstrap ClassLoader (written in native code) loads core Java API classes from the JDK's rt.jar or modules. It is the parent of all classloaders.",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Garbage Collection",
    "difficulty": "hard",
    "question": "Which GC algorithm divides the heap into Eden, Survivor, and Old Generation spaces?",
    "options": ["Mark and Sweep", "Reference Counting", "Generational GC", "G1 GC"],
    "correctAnswer": "Generational GC",
    "explanation": "Generational GC divides heap memory into Young Generation (Eden + Survivor spaces) and Old Generation based on object lifespan to optimize performance.",
    "marks": 3
  },
  {
    "title": "Java Core",
    "category": "Core Java",
    "subcategory": "Design Patterns",
    "difficulty": "hard",
    "question": "Which design pattern ensures only one instance of a class exists throughout the application lifecycle?",
    "options": ["Factory", "Prototype", "Singleton", "Builder"],
    "correctAnswer": "Singleton",
    "explanation": "The Singleton pattern restricts a class to a single instance and provides a global access point to it, often implemented using a private constructor and static method.",
    "marks": 3
  }
]

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
