const Groq = require('groq-sdk');

const modifyScheduleWithAI = async (currentSessions, userPrompt, clientApiKey) => {
  try {
    const apiKey = clientApiKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('No Groq API key configured. Please set it in Settings or your .env file.');
    }
    
    const groq = new Groq({ apiKey });
    
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

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemInstruction,
        }
      ],
      model: "llama-3.3-70b-versatile",
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

module.exports = {
  modifyScheduleWithAI
};
