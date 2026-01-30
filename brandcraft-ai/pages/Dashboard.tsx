
import React from 'react';
import { BrandProject, AppTab } from '../types';
import { Plus, ArrowRight, Wand2, Image as ImageIcon, Send, MessageSquareText, Sparkles } from 'lucide-react';

interface DashboardProps {
  project: BrandProject | null;
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ project, onNavigate }) => {
  return (
    <div className="space-y-12 animate-fadeInUp">
      {/* Hero Section */}
      <section className="text-center text-white py-12 md:py-20 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">
          Build Your Brand with AI
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
          Generate brand names, logos, marketing content, and strategy using the world's most advanced Generative AI.
        </p>
        <div className="pt-4">
          <button 
            onClick={() => onNavigate(AppTab.IDENTITY)}
            className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 transition-all active:scale-95"
          >
            Get Started
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {/* Project Card or CTA */}
        {project ? (
          <div className="section-card lg:col-span-2 p-8 flex flex-col sm:flex-row gap-8 items-start">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-center p-4 overflow-hidden shadow-inner shrink-0">
              {project.logoUrl ? (
                <img src={project.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain drop-shadow-sm" />
              ) : (
                <span className="text-4xl font-black text-indigo-600 uppercase tracking-tighter">{project.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-3xl font-bold text-indigo-600">{project.name}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">{project.industry}</p>
              <p className="text-slate-600 line-clamp-2 font-medium leading-relaxed">{project.description}</p>
              <div className="pt-2">
                <button 
                   onClick={() => onNavigate(AppTab.IDENTITY)}
                   className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all group"
                >
                  Manage Brand <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="section-card lg:col-span-2 p-12 text-center flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-indigo-200 bg-white/80">
             <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                <Plus size={32} />
             </div>
             <h3 className="text-2xl font-bold text-slate-800">Create New Brand</h3>
             <p className="text-slate-500 max-w-sm font-medium">Define your identity and keywords to let AI generate your complete brand kit.</p>
             <button 
                onClick={() => onNavigate(AppTab.IDENTITY)}
                className="btn-brand-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
             >
                Launch Identity Builder
             </button>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="space-y-6">
          <div 
            onClick={() => onNavigate(AppTab.CONTENT)}
            className="section-card p-6 cursor-pointer group hover:bg-indigo-50/30 border border-transparent hover:border-indigo-100"
          >
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <Send size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800">Content Studio</h4>
                  <p className="text-sm text-slate-500 font-medium">Copywriting & Slogans</p>
               </div>
            </div>
          </div>
          <div 
            onClick={() => onNavigate(AppTab.VISUALS)}
            className="section-card p-6 cursor-pointer group hover:bg-indigo-50/30 border border-transparent hover:border-indigo-100"
          >
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <ImageIcon size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800">Visual Lab</h4>
                  <p className="text-sm text-slate-500 font-medium">Logo & Asset Design</p>
               </div>
            </div>
          </div>
          <div 
            onClick={() => onNavigate(AppTab.SENTIMENT)}
            className="section-card p-6 cursor-pointer group hover:bg-indigo-50/30 border border-transparent hover:border-indigo-100"
          >
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <MessageSquareText size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-slate-800">Sentiment Hub</h4>
                  <p className="text-sm text-slate-500 font-medium">Pulse Analysis</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
