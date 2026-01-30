
import React from 'react';
import { LayoutDashboard, Sparkles, Image, FileText, BarChart3, MessageSquare, Zap, X } from 'lucide-react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: AppTab.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { id: AppTab.IDENTITY, icon: Sparkles, label: 'Identity Builder' },
    { id: AppTab.VISUALS, icon: Image, label: 'Visual Lab' },
    { id: AppTab.CONTENT, icon: FileText, label: 'Content Studio' },
    { id: AppTab.SENTIMENT, icon: BarChart3, label: 'Sentiment Hub' },
    { id: AppTab.ASSISTANT, icon: MessageSquare, label: 'AI Assistant' },
  ];

  const handleTabClick = (id: AppTab) => {
    setActiveTab(id);
    setIsOpen(false); // Close drawer on selection (mobile)
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-full bg-slate-900 text-white z-50 flex flex-col p-4 transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-2 py-6 mb-8 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Zap className="text-indigo-400" size={28} />
            <h1 className="text-xl font-bold tracking-tight">BrandCraft AI</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-slate-800 rounded-xl hidden lg:block">
          <p className="text-xs text-slate-400 mb-1">Active Engine</p>
          <p className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Gemini 3 Pro
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
