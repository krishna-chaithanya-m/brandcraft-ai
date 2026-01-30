
import React, { useState } from 'react';
import { BrandProject, User } from '../types';
import { generateMarketingCopy, TextEngine } from '../services/gemini';
import Loader from '../components/Loader';
import { Send, Instagram, Mail, Quote, Copy, Check, Cpu, RefreshCw } from 'lucide-react';

interface ContentStudioProps {
  project: BrandProject | null;
  currentUser: User | null;
  onAuthRequired: () => void;
}

const ContentStudio: React.FC<ContentStudioProps> = ({ project, currentUser, onAuthRequired }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState<TextEngine>('gemini');
  const [copy, setCopy] = useState<{ slogans: string[], socialPosts: string[], email: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!project || !topic) return;
    if (!currentUser) return onAuthRequired();

    setLoading(true);
    try {
      const result = await generateMarketingCopy(project.name, topic, tone, engine);
      setCopy(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const inputClassName = "w-full px-5 py-4 rounded-xl bg-indigo-50/30 border-2 border-indigo-100/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-sm";

  return (
    <div className="space-y-8">
      <section className="section-card p-8 md:p-12 animate-fadeInUp">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">Marketing Content Generator</h2>
            <p className="text-slate-500">Automate your brand's voice and copywriting strategy.</p>
          </div>
          <div className="flex bg-slate-100/50 p-1.5 rounded-xl border border-indigo-50 w-full md:w-auto">
            <button onClick={() => setEngine('gemini')} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${engine === 'gemini' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-400'}`}>Gemini</button>
            <button onClick={() => setEngine('granite')} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${engine === 'granite' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-blue-400'}`}>IBM Granite</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
           <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Campaign Topic</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                placeholder="Describe your brand, product, or service..."
                className={`${inputClassName} resize-none`}
              />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Tone</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className={inputClassName}
              >
                <option value="Professional">Professional</option>
                <option value="Playful">Playful</option>
                <option value="Modern">Modern</option>
                <option value="Luxury">Luxury</option>
              </select>
           </div>
        </div>

        <div className="flex justify-center">
           <button 
             onClick={handleGenerate}
             disabled={loading || !topic || !project}
             className="w-full max-w-md btn-brand-gradient text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all"
           >
             {loading ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} />}
             Generate Marketing Content
           </button>
        </div>
      </section>

      {loading ? (
        <Loader message="Crafting high-conversion copy..." />
      ) : copy && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeInUp">
           <div className="space-y-8">
              <div className="section-card p-6">
                 <h3 className="font-bold text-indigo-600 mb-4 flex items-center gap-2"><Quote size={20} /> Slogans</h3>
                 <div className="space-y-3">
                   {copy.slogans.map((s, i) => (
                     <div key={i} className="bg-indigo-50/30 p-4 rounded-xl flex justify-between items-center group border border-indigo-100/50">
                        <span className="font-semibold text-slate-700 italic">"{s}"</span>
                        <button onClick={() => copyToClipboard(s, `s-${i}`)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                           {copiedId === `s-${i}` ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="section-card p-6">
                 <h3 className="font-bold text-indigo-600 mb-4 flex items-center gap-2"><Instagram size={20} /> Social Posts</h3>
                 <div className="space-y-4">
                   {copy.socialPosts.map((p, i) => (
                     <div key={i} className="bg-indigo-50/30 p-5 rounded-xl text-sm text-slate-600 leading-relaxed relative group border border-indigo-100/50">
                        <p>{p}</p>
                        <button onClick={() => copyToClipboard(p, `sp-${i}`)} className="absolute top-2 right-2 text-slate-400 hover:text-indigo-600 transition-colors">
                           {copiedId === `sp-${i}` ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                     </div>
                   ))}
                 </div>
              </div>
           </div>

           <div className="section-card p-8 h-fit">
              <h3 className="font-bold text-indigo-600 mb-6 flex items-center gap-2"><Mail size={20} /> Email Campaign</h3>
              <div className="bg-indigo-50/30 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap text-sm relative border border-indigo-100/50">
                 {copy.email}
                 <button onClick={() => copyToClipboard(copy.email, 'email')} className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 transition-colors border border-indigo-50">
                    {copiedId === 'email' ? <Check size={20} /> : <Copy size={20} />}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentStudio;
