import React, { useState } from 'react';
import api from '../api';

export default function Chatbot({ questionContext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your AI tutor. Need a hint or explanation for this question?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      // Use standard conversational format for history (ignoring the first hardcoded greeting)
      const conversationHistory = newMessages.slice(1, -1).map(m => ({ role: m.role, content: m.content }));

      const response = await api.post('/mcqs/chat', {
        questionContext,
        conversationHistory,
        userPrompt: userMessage
      });
      
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b1120] border-l border-white/5 w-80 shrink-0 shadow-2xl">
      <div className="p-4 border-b border-white/5 shrink-0">
        <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ✨ AI Assistant
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Ask for hints or concepts</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-[13px] leading-relaxed shadow-lg ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20' 
                : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/5 shrink-0 bg-[#0b1120]/80 backdrop-blur">
        <div className="flex items-center bg-white/5 rounded-xl overflow-hidden border border-white/10 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..." 
            className="flex-1 bg-transparent border-none text-sm text-slate-200 px-4 py-3 focus:outline-none placeholder:text-slate-600"
          />
          <button 
            onClick={send} 
            disabled={!input.trim()}
            className="px-4 text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
