
import React, { useState, useEffect } from 'react';
import { AppTab, BrandProject, User } from './types';
import Dashboard from './pages/Dashboard';
import IdentityBuilder from './pages/IdentityBuilder';
import VisualLab from './pages/VisualLab';
import ContentStudio from './pages/ContentStudio';
import SentimentHub from './pages/SentimentHub';
import Assistant from './pages/Assistant';
import Auth from './pages/Auth';
import { Menu, X, Zap, LogOut, User as UserIcon, LogIn } from 'lucide-react';
import { getCurrentSession, logout } from './services/auth';
import { getLatestUserProject, saveProject } from './services/projectService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [activeProject, setActiveProject] = useState<BrandProject | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initial load check for existing session
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      const lastProject = getLatestUserProject(session.id);
      if (lastProject) {
        setActiveProject(lastProject);
      }
    }
    setIsInitializing(false);
  }, []);

  const handleUpdateProject = (project: BrandProject) => {
    // Update the local state (scratchpad) immediately
    setActiveProject(project);
    
    // Persist to storage only if a session exists
    if (currentUser) {
      const projectWithUser = { ...project, userId: currentUser.id };
      saveProject(projectWithUser);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setActiveProject(null);
    setActiveTab(AppTab.DASHBOARD);
    setIsMenuOpen(false);
  };

  const syncUserSession = (user: User) => {
    const historicalProject = getLatestUserProject(user.id);
    
    // CRITICAL: Merge current scratchpad with history instead of overwriting
    if (activeProject) {
      const mergedProject: BrandProject = {
        ...(historicalProject || {}), // Start with history if it exists
        ...activeProject,            // Overlay with what the user JUST typed
        id: activeProject.id || historicalProject?.id || Date.now().toString(),
        userId: user.id              // Assign to the new user ID
      };
      setActiveProject(mergedProject);
      saveProject(mergedProject);
    } else if (historicalProject) {
      setActiveProject(historicalProject);
    }

    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleAuthSuccess = (user: User) => {
    syncUserSession(user);
  };

  const handleGuestMode = () => {
    const guest: User = { id: 'guest', email: 'guest@brandcraft.ai', username: 'Guest' };
    localStorage.setItem('brandcraft_current_session', JSON.stringify(guest));
    syncUserSession(guest);
  };

  const onAuthRequired = () => {
    setShowAuth(true);
  };

  const navLinks = [
    { id: AppTab.DASHBOARD, label: 'Home' },
    { id: AppTab.IDENTITY, label: 'Brand Names' },
    { id: AppTab.VISUALS, label: 'Logo Generator' },
    { id: AppTab.CONTENT, label: 'Marketing Content' },
    { id: AppTab.SENTIMENT, label: 'Sentiment Analysis' },
    { id: AppTab.ASSISTANT, label: 'Branding Chat' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard project={activeProject} onNavigate={setActiveTab} />;
      case AppTab.IDENTITY:
        return <IdentityBuilder project={activeProject} currentUser={currentUser} onAuthRequired={onAuthRequired} onUpdate={handleUpdateProject} onNavigate={setActiveTab} />;
      case AppTab.VISUALS:
        return <VisualLab project={activeProject} currentUser={currentUser} onAuthRequired={onAuthRequired} onUpdate={handleUpdateProject} />;
      case AppTab.CONTENT:
        return <ContentStudio project={activeProject} currentUser={currentUser} onAuthRequired={onAuthRequired} />;
      case AppTab.SENTIMENT:
        return <SentimentHub currentUser={currentUser} onAuthRequired={onAuthRequired} />;
      case AppTab.ASSISTANT:
        return <Assistant project={activeProject} currentUser={currentUser} onAuthRequired={onAuthRequired} />;
      default:
        return <Dashboard project={activeProject} onNavigate={setActiveTab} />;
    }
  };

  if (isInitializing) return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600">
      <div className="text-white flex flex-col items-center gap-4">
        <Zap className="animate-glow" size={64} />
        <h1 className="text-2xl font-bold font-brand">Initializing BrandCraft...</h1>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Auth Modal Overlay - Preservation logic: keeps background mounted and state alive */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <Auth 
            onAuthSuccess={handleAuthSuccess} 
            onGuest={handleGuestMode} 
            onCancel={() => setShowAuth(false)} 
          />
        </div>
      )}

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { setActiveTab(AppTab.DASHBOARD); setShowAuth(false); }}
          >
            <div className="animate-glow">
              <Zap className="text-indigo-600" size={32} />
            </div>
            <span className="text-2xl font-bold brand-logo">BrandCraft</span>
          </div>

          <ul className="hidden lg:flex gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => { setActiveTab(link.id); setShowAuth(false); }}
                  className={`text-sm font-semibold transition-all relative py-1 ${
                    activeTab === link.id && !showAuth ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-500'
                  }`}
                >
                  {link.label}
                  {activeTab === link.id && !showAuth && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="hidden lg:flex items-center gap-6 border-l border-slate-100 pl-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                    {currentUser.username}
                  </span>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-2" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden lg:block border-l border-slate-100 pl-6">
                <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                  <LogIn size={20} /> Sign In
                </button>
              </div>
            )}

            <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 animate-fadeInUp">
            {currentUser && (
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl mb-2">
                <UserIcon size={20} className="text-indigo-600" />
                <span className="font-bold text-indigo-900">{currentUser.username}</span>
              </div>
            )}
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setShowAuth(false); setIsMenuOpen(false); }}
                className={`text-left text-lg font-bold py-2 ${activeTab === link.id && !showAuth ? 'text-indigo-600' : 'text-slate-600'}`}
              >
                {link.label}
              </button>
            ))}
            {currentUser ? (
              <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-rose-500 font-bold py-2 border-t border-slate-100">
                <LogOut size={20} /> Logout
              </button>
            ) : (
              <button onClick={() => { setShowAuth(true); setIsMenuOpen(false); }} className="mt-4 flex items-center gap-2 text-indigo-600 font-bold py-2 border-t border-slate-100">
                <LogIn size={20} /> Sign In
              </button>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {renderTabContent()}
      </main>

      <footer className="w-full py-8 text-center text-white/70 text-sm">
        <p>&copy; 2025 BrandCraft AI. Built with Gemini & Stable Diffusion.</p>
      </footer>
    </div>
  );
};

export default App;
