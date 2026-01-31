
import React, { useState, useEffect } from 'react';
import { BrandProject, AppTab, User } from '../types';
import { generateBrandNames, generateBrandStrategy, TextEngine } from '../services/gemini';
import Loader from '../components/Loader';
import { Check, Wand2, RefreshCw, Target, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface IdentityBuilderProps {
  project: BrandProject | null;
  currentUser: User | null;
  onAuthRequired: () => void;
  onUpdate: (project: BrandProject) => void;
  onNavigate: (tab: AppTab) => void;
}

const IdentityBuilder: React.FC<IdentityBuilderProps> = ({ project, currentUser, onAuthRequired, onUpdate, onNavigate }) => {
  const [industry, setIndustry] = useState(project?.industry || '');
  const [keywords, setKeywords] = useState(project?.keywords || '');
  const [loading, setLoading] = useState(false);
  const [strategyLoading, setStrategyLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ name: string; meaning: string }[]>([]);
  const [selectedName, setSelectedName] = useState(project?.name || '');
  const [engine, setEngine] = useState<TextEngine>('gemini');

  // Sync state when the project prop updates (e.g. after auth or session restore)
  useEffect(() => {
    if (project) {
      if (project.industry && project.industry !== industry) {
        setIndustry(project.industry);
      }
      if (project.keywords && project.keywords !== keywords) {
        setKeywords(project.keywords);
      }
      if (project.name && project.name !== selectedName) {
        setSelectedName(project.name);
      }
    }
  }, [project?.id, project?.userId]); // Only sync when the project identity itself changes

  const handleGenerateNames = async () => {
    if (!industry || !keywords) return;
    
    // If visitor types data but isn't logged in, save context to "scratchpad" first
    if (!currentUser) {
      onUpdate({
        id: project?.id || Date.now().toString(),
        userId: 'temp',
        name: selectedName,
        industry,
        keywords,
        description: project?.description || `Brand in ${industry} characterized by ${keywords}.`
      });
      return onAuthRequired();
    }
    
    setLoading(true);
    try {
      const results = await generateBrandNames(industry, keywords, engine);
      setSuggestions(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStrategy = async () => {
    if (!project) return;
    if (!currentUser) return onAuthRequired();

    setStrategyLoading(true);
    try {
      const strategy = await generateBrandStrategy(project.name, project.industry, project.description, engine);
      onUpdate({ ...project, strategy });
    } catch (error) {
      console.error(error);
    } finally {
      setStrategyLoading(false);
    }
  };

  const finalizeIdentity = (name: string) => {
    if (!currentUser) {
      // Allow name selection even if not logged in, but save it to scratchpad
      setSelectedName(name);
      onUpdate({
        id: project?.id || Date.now().toString(),
        userId: 'temp',
        name,
        industry,
        keywords,
        description: `Brand in ${industry} characterized by ${keywords}.`
      });
      return onAuthRequired();
    }

    const newProject: BrandProject = {
      id: project?.id || Date.now().toString(),
      userId: currentUser.id, 
      name,
      industry,
      keywords,
      description: `A forward-thinking brand in the ${industry} space, characterized by ${keywords}.`,
      logoUrl: project?.logoUrl,
      strategy: project?.strategy
    };
    onUpdate(newProject);
    setSelectedName(name);
  };

  const inputClassName = "w-full px-5 py-4 rounded-xl bg-indigo-50/30 border-2 border-indigo-100/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-sm";

  return (
    <div className="space-y-8">
      <section className="section-card p-8 md:p-12 animate-fadeInUp">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-indigo-600 mb-2 font-brand">Brand Name Generator</h2>
            <p className="text-slate-500">Define your industry and keywords to find the perfect name.</p>
          </div>
          <div className="flex bg-slate-100/50 p-1.5 rounded-xl border border-indigo-50 w-full md:w-auto">
            <button 
              onClick={() => setEngine('gemini')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${engine === 'gemini' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              Gemini
            </button>
            <button 
              onClick={() => setEngine('granite')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all ${engine === 'granite' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-blue-400'}`}
            >
              IBM Granite
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Industry</label>
              <input 
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Technology, Fashion, Food"
                className={inputClassName}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Keywords</label>
              <input 
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. innovative, eco-friendly, premium"
                className={inputClassName}
              />
            </div>
            <button 
              onClick={handleGenerateNames}
              disabled={loading || !industry || !keywords}
              className="w-full btn-brand-gradient text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? <RefreshCw className="animate-spin" size={24} /> : <Wand2 size={24} />}
              Generate Brand Names
            </button>
          </div>

          <div className="bg-slate-50/50 rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-indigo-100/50">
             {loading ? (
               <Loader message="Consulting AI branding experts..." />
             ) : suggestions.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-fit">
                 {suggestions.map((s, i) => (
                   <div 
                     key={i}
                     onClick={() => finalizeIdentity(s.name)}
                     className={`p-5 rounded-xl border-2 transition-all cursor-pointer animate-popIn ${
                       selectedName === s.name 
                         ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' 
                         : 'bg-white border-white hover:border-indigo-200 hover:scale-105 shadow-sm'
                     }`}
                   >
                     <div className="flex justify-between items-center mb-1">
                       <span className="font-bold text-lg">{s.name}</span>
                       {selectedName === s.name && <Check size={18} />}
                     </div>
                     <p className={`text-xs ${selectedName === s.name ? 'opacity-80' : 'text-slate-500'}`}>
                       {s.meaning}
                     </p>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-slate-400 font-medium italic">Names will appear here after generation.</p>
             )}

             {selectedName && (
               <div className="mt-8 w-full animate-fadeInUp">
                 <button 
                   onClick={() => onNavigate(AppTab.VISUALS)}
                   className="w-full bg-white text-indigo-600 border-2 border-indigo-100 py-4 rounded-xl font-bold shadow-md hover:shadow-lg hover:border-indigo-600 transition-all flex items-center justify-center gap-3 group"
                 >
                   <Sparkles size={20} className="text-indigo-500" />
                   Go to Logo Generator
                   <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             )}
          </div>
        </div>
      </section>

      {project && (
        <section className="section-card p-8 md:p-12 animate-fadeInUp">
          <div className="flex justify-between items-center mb-10">
             <h2 className="text-3xl font-bold text-indigo-600">Brand Strategy</h2>
             <button 
                onClick={handleGenerateStrategy}
                disabled={strategyLoading}
                className="text-sm font-bold bg-indigo-50 text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
             >
                {strategyLoading ? 'Thinking...' : 'Refresh Strategy'}
             </button>
          </div>

          {strategyLoading ? (
            <Loader message="Analyzing market landscape..." />
          ) : project.strategy ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 text-indigo-600">
                     <Target size={24} />
                     <h4 className="font-bold uppercase tracking-widest text-xs">Mission</h4>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed font-medium">"{project.strategy.mission}"</p>
               </div>
               <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 text-blue-600">
                     <RefreshCw size={24} />
                     <h4 className="font-bold uppercase tracking-widest text-xs">Vision</h4>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed font-medium">"{project.strategy.vision}"</p>
               </div>
               <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 text-purple-600">
                     <ShieldCheck size={24} />
                     <h4 className="font-bold uppercase tracking-widest text-xs">Values</h4>
                  </div>
                  <ul className="space-y-2">
                    {project.strategy.values.map((v, i) => (
                      <li key={i} className="text-slate-700 text-sm font-bold flex items-center gap-2">• {v}</li>
                    ))}
                  </ul>
               </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-indigo-50/20 rounded-2xl border-2 border-dashed border-indigo-100/50">
               <p className="text-slate-400 font-medium">Strategy will be generated based on your brand description.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default IdentityBuilder;
