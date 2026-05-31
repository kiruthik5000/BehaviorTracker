const { OpenAI } = require('openai');

const modifyScheduleWithAI = async (currentSessions, userPrompt, clientApiKey) => {
  try {
    const apiKey = clientApiKey || process.env.HF_API_KEY || process.env.HF_TOKEN;
    if (!apiKey) {
        throw new Error('No Hugging Face API key configured. Please set it in Settings or your .env file.');
    }
    
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: apiKey,
    });
    
    const systemInstruction = `
You are an expert scheduling assistant. Your job is to modify an existing daily schedule based on a user's prompt.
The schedule is now structured into "sessions", where each session contains a sub-list of specific task events.
The output MUST be returned strictly as a JSON object containing a "sessions" array of session objects.

Session Schema Requirements:
- id: A unique string ID (generate new if adding, keep existing if modifying).
- title: String (e.g., "Morning Session", "Afternoon Session", "Evening Routine").
- tasks: An array of Event objects belonging to this session.

Task/Event Schema Requirements:
- id: A unique string ID.
- timeStart: String (format 'hh:mm AM/PM').
- timeEnd: String (format 'hh:mm AM/PM').
- title: String.
- description: String (optional).
- type: String, must be one of ['routine', 'deep-work', 'dsa', 'break', 'flex'].
- isCompleted: Boolean, preserve existing completion status unless asked otherwise.

Input Schedule (Current Sessions JSON array):
${JSON.stringify(currentSessions, null, 2)}

User Request: "${userPrompt}"

Ensure output is ONLY a valid JSON object with the "sessions" key. Do not include markdown formatting, just the raw JSON object.
    `;

    const response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct:groq",
      messages: [
        {
          role: "system",
          content: systemInstruction,
        }
      ],
      response_format: { type: "json_object" },
    });

    const outputText = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(outputText);
    const newSessions = result.sessions;

    if (!Array.isArray(newSessions)) {
      throw new Error('AI returned non-array structure for sessions');
    }

    return newSessions;
  } catch (error) {
    console.error('LLM Service Error:', error);
    throw new Error('Failed to modify schedule via AI.');
  }
};

const askMCQChatbot = async (questionContext, conversationHistory, userPrompt, clientApiKey) => {
  try {
    const apiKey = clientApiKey || process.env.HF_API_KEY || process.env.HF_TOKEN;
    if (!apiKey) {
      throw new Error('No Hugging Face API key configured.');
    }
    
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: apiKey,
    });

    const systemInstruction = `
You are an expert tutor guiding a student through a coding/technical Multiple Choice Question.
The student might ask for a hint, an explanation, or clarification about an option.
Provide helpful, concise hints WITHOUT giving away the correct answer directly unless explicitly asked.
Here is the context of the question:
Title: ${questionContext?.title || 'N/A'}
Question: ${questionContext?.question || 'N/A'}
Options: ${questionContext?.options ? questionContext.options.map((opt, i) => `${String.fromCharCode(65 + i)}: ${opt}`).join(' | ') : 'N/A'}
Category: ${questionContext?.category || 'N/A'}
`;

    const messages = [
      { role: "system", content: systemInstruction },
      ...(conversationHistory || []),
      { role: "user", content: userPrompt }
    ];

    const response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct:groq",
      messages: messages,
    });

    return response.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error('LLM MCQ Chatbot Error:', error);
    throw new Error('Failed to get response from AI.');
  }
};

module.exports = {
  modifyScheduleWithAI,
  askMCQChatbot
};
