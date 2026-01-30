
import React, { useState, useRef, useEffect } from 'react';
import { BrandProject, User } from '../types';
import { createBrandAssistant } from '../services/gemini';
import { Send, User as UserIcon, Bot, Sparkles, RefreshCw, Info } from 'lucide-react';

interface AssistantProps {
  project: BrandProject | null;
  currentUser: User | null;
  onAuthRequired: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Assistant: React.FC<AssistantProps> = ({ project, currentUser, onAuthRequired }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your BrandCraft Assistant. Ready to build a legacy for ${project?.name || 'your brand'}?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const projectKeyRef = useRef<string>('');

  useEffect(() => {
    const currentProjectKey = project ? `${project.name}-${project.industry}` : 'new-session';
    
    if (projectKeyRef.current !== currentProjectKey) {
      const sysMsg = project 
        ? `The active brand is "${project.name}" operating in the "${project.industry}" industry. 
           Core Description: "${project.description}". 
           ${project.strategy ? `Current Strategy: ${project.strategy.mission}.` : ''}`
        : "The user is currently in a brainstorming phase with no fixed brand name or industry yet.";
      
      chatRef.current = createBrandAssistant(sysMsg);
      projectKeyRef.current = currentProjectKey;
      
      if (messages.length > 1 && project) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Context updated: We are now focusing on the brand "${project.name}".` }]);
      }
    }
  }, [project?.name, project?.industry]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!currentUser) return onAuthRequired();

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      const fullResponse = response.text || "I'm sorry, I couldn't generate a response at this time.";

      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered an issue connecting to the branding core. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "flex-1 px-6 py-4 bg-indigo-50/30 border-2 border-indigo-100/50 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-sm";

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6 animate-fadeInUp">
      <section className="flex-1 section-card p-0 flex flex-col overflow-hidden">
        <header className="p-8 border-b border-indigo-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center animate-glow shadow-inner">
                <Bot size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-indigo-600 mb-0.5">BrandCraft AI Consultant</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Online & Context Aware</p>
                </div>
              </div>
           </div>
           {project && (
             <div className="hidden md:flex items-center gap-2 bg-indigo-50/50 px-4 py-2 rounded-xl border border-indigo-100">
               <span className="text-[10px] font-black text-indigo-900 uppercase tracking-tighter">Project: {project.name}</span>
             </div>
           )}
        </header>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20 custom-scrollbar">
           {messages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-popIn`}>
                <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
                     msg.role === 'user' ? 'bg-slate-800' : 'btn-brand-gradient'
                   }`}>
                     {msg.role === 'user' ? <UserIcon size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
                   </div>
                   <div className={`p-5 rounded-2xl leading-relaxed shadow-sm whitespace-pre-wrap ${
                     msg.role === 'user' 
                       ? 'bg-slate-800 text-white rounded-tr-none' 
                       : 'bg-white text-slate-700 border border-indigo-50 rounded-tl-none font-medium'
                   }`}>
                     {msg.content}
                   </div>
                </div>
             </div>
           ))}
           
           {loading && (
             <div className="flex justify-start animate-fadeInUp">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl btn-brand-gradient flex items-center justify-center animate-pulse shadow-lg">
                      <Bot size={20} className="text-white" />
                   </div>
                   <div className="p-5 bg-white border border-indigo-50 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-indigo-50">
           <div className="max-w-4xl mx-auto flex gap-4">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask for branding advice or strategy..."
                className={inputClassName}
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="btn-brand-gradient text-white p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex-shrink-0 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} />}
              </button>
           </div>
        </div>
      </section>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default Assistant;
