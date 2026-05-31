import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Chatbot({ questionContext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: { type: 'text', explanation: 'Hi! I am your AI tutor. Need a hint or explanation for this question?' } }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;
    
    const handleMouseMove = (e) => {
      // Calculate new width based on mouse position from the right edge
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 250 && newWidth < 800) {
        setWidth(newWidth);
      }
    };
    
    const handleMouseUp = () => setIsResizing(false);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      // Use standard conversational format for history (ignoring the first hardcoded greeting)
      const conversationHistory = newMessages.slice(1, -1).map(m => ({ 
        role: m.role, 
        content: typeof m.content === 'object' ? JSON.stringify(m.content) : m.content 
      }));

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
    <div 
      className="relative flex flex-col h-full bg-[#0b1120] border-l border-white/5 shrink-0 shadow-2xl"
      style={{ width: `${width}px` }}
    >
      {/* Resizer Handle */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-500 transition-colors z-50"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
      />
      
      <div className="p-4 border-b border-white/5 shrink-0">
        <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ✨ AI Assistant
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">Ask for hints or concepts</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((m, i) => {
          if (m.role === 'user') {
            return (
              <div key={i} className="flex justify-end">
                <div className="px-4 py-2.5 rounded-2xl max-w-[85%] text-[13px] leading-relaxed shadow-lg bg-blue-600 text-white rounded-br-none shadow-blue-500/20">
                  {m.content}
                </div>
              </div>
            );
          }

          const data = typeof m.content === 'string' ? { type: 'text', explanation: m.content } : m.content;

          if (data.type === 'text' && !data.title && !data.steps && !data.code) {
            return (
              <div key={i} className="flex justify-start">
                <div className="px-4 py-2.5 rounded-2xl max-w-[85%] text-[13px] leading-relaxed shadow-lg bg-white/5 border border-white/10 text-slate-300 rounded-tl-none">
                  {data.explanation || JSON.stringify(data)}
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="flex justify-start">
              <div className="rounded-2xl overflow-hidden bg-[#111827] border border-white/10 shadow-xl w-[95%] text-left rounded-tl-none">
                {data.title && (
                  <div className="px-4 py-3 bg-[#1f2937] border-b border-white/5 flex items-center justify-between">
                    <span className="font-bold text-sm text-blue-400">{data.title}</span>
                    {data.difficulty && (
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                        data.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        data.difficulty.toLowerCase() === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>{data.difficulty}</span>
                    )}
                  </div>
                )}
                <div className="p-4 space-y-4">
                  {data.explanation && (
                    <p className="text-[13px] text-slate-300 leading-relaxed">{data.explanation}</p>
                  )}
                  
                  {data.steps && data.steps.length > 0 && (
                    <div className="space-y-1.5">
                      {data.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2 text-[13px] text-slate-400">
                          <span className="text-blue-500 font-bold">{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.code && data.code.content && (
                    <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0b1120]">
                      <div className="bg-white/5 px-3 py-1.5 flex justify-between items-center text-[10px] uppercase font-mono text-slate-500 border-b border-white/5">
                        <span>{data.code.language || 'code'}</span>
                      </div>
                      <pre className="p-3 text-[12px] text-emerald-400 font-mono overflow-x-auto">
                        <code>{data.code.content}</code>
                      </pre>
                    </div>
                  )}

                  {(data.timeComplexity || data.spaceComplexity) && (
                    <div className="flex gap-3 pt-2 border-t border-white/5">
                      {data.timeComplexity && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 text-[10px] uppercase tracking-widest">Time</span>
                          <span className="font-mono text-xs text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">{data.timeComplexity}</span>
                        </div>
                      )}
                      {data.spaceComplexity && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 text-[10px] uppercase tracking-widest">Space</span>
                          <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">{data.spaceComplexity}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
