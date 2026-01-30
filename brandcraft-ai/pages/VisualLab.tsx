
import React, { useState, useEffect } from 'react';
import { BrandProject, User } from '../types';
import { generateLogo, refineLogoColors, ImageEngine } from '../services/gemini';
import Loader from '../components/Loader';
import { 
  Download, 
  Palette, 
  RefreshCcw, 
  Wand2, 
  Key, 
  Image as ImageIcon, 
  Paintbrush, 
  Zap,
  ArrowRight,
  Hash,
  Layout
} from 'lucide-react';

const getAistudio = () => (window as any).aistudio;

interface VisualLabProps {
  project: BrandProject | null;
  currentUser: User | null;
  onAuthRequired: () => void;
  onUpdate: (project: BrandProject) => void;
}

const STYLE_PRESETS = [
  { id: 'modern', label: 'Modern Minimalist', prompt: 'Modern, Minimalist, Vector, Clean' },
  { id: 'abstract', label: 'Abstract', prompt: 'Abstract, conceptual, symbolic' },
  { id: 'geometric', label: 'Geometric', prompt: 'Geometric, mathematical, grid-based' },
  { id: 'hand-drawn', label: 'Hand-drawn', prompt: 'Hand-drawn, sketchy, organic, artisanal' },
  { id: '3d', label: '3D Render', prompt: '3D, isometric, claymorphism, rendered' },
  { id: 'vintage', label: 'Vintage', prompt: 'Vintage, retro, heritage, classic' },
  { id: 'futuristic', label: 'Futuristic', prompt: 'Futuristic, tech, sci-fi, neon' },
];

const VisualLab: React.FC<VisualLabProps> = ({ project, currentUser, onAuthRequired, onUpdate }) => {
  const [style, setStyle] = useState('Professional vector design');
  const [activePreset, setActivePreset] = useState(STYLE_PRESETS[0]);
  const [colorInstruction, setColorInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [engine, setEngine] = useState<ImageEngine>('gemini-image');
  const [hasProKey, setHasProKey] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(project?.logoUrl || null);
  
  const [brandColors, setBrandColors] = useState<string[]>(
    project?.colors || ['#6366f1', '#8b5cf6', '#a1c4fd']
  );

  const moodPresets = [
    { label: 'Sunset Vibes', instruction: 'Apply a warm gradient of orange, pink, and purple.' },
    { label: 'Cyberpunk', instruction: 'Use high-contrast neon cyan and magenta.' },
    { label: 'Earthly', instruction: 'Convert all elements to natural forest greens and browns.' },
    { label: 'Monochrome', instruction: 'Make the logo entirely black and white with gray accents.' },
    { label: 'Vibrant', instruction: 'Increase saturation and use primary bold colors.' },
  ];

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    const aistudio = getAistudio();
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      setHasProKey(hasKey);
    }
  };

  const handleSelectKey = async () => {
    const aistudio = getAistudio();
    if (aistudio) {
      await aistudio.openSelectKey();
      setHasProKey(true);
    }
  };

  const updateColor = (idx: number, newColor: string) => {
    const newColors = [...brandColors];
    newColors[idx] = newColor;
    setBrandColors(newColors);
    if (project && currentUser) {
      onUpdate({ ...project, colors: newColors });
    }
  };

  const handleGenerate = async () => {
    if (!project) return;
    if (!currentUser) return onAuthRequired();
    
    if (engine === 'stable-diffusion' && !hasProKey) {
      await handleSelectKey();
    }

    setLoading(true);
    try {
      const combinedStyle = `${activePreset.prompt}. ${style}`;
      const result = await generateLogo(combinedStyle, project.industry, project.name, brandColors, engine);
      if (result) {
        setGeneratedLogo(result);
        onUpdate({ ...project, logoUrl: result, colors: brandColors });
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        setHasProKey(false);
        await handleSelectKey();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (instruction?: string) => {
    if (!project || !generatedLogo) return;
    if (!currentUser) return onAuthRequired();
    
    setRefining(true);
    try {
      const result = await refineLogoColors(generatedLogo, brandColors, instruction || colorInstruction, engine);
      if (result) {
        setGeneratedLogo(result);
        onUpdate({ ...project, logoUrl: result, colors: brandColors });
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
        setHasProKey(false);
        await handleSelectKey();
      }
    } finally {
      setRefining(false);
      setColorInstruction('');
    }
  };

  const downloadLogo = () => {
    if (!generatedLogo) return;
    const link = document.createElement('a');
    link.href = generatedLogo;
    link.download = `${project?.name || 'brand'}-logo.png`;
    link.click();
  };

  const inputClassName = "w-full px-5 py-4 rounded-xl bg-indigo-50/30 border-2 border-indigo-100/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-sm";

  return (
    <div className="space-y-8 animate-fadeInUp">
      <section className="section-card p-8 md:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">Visual Lab</h2>
            <p className="text-slate-500">Design your brand's visual identity with AI-powered logo generation.</p>
          </div>
          <div className="flex bg-slate-100/50 p-1.5 rounded-xl border border-indigo-50 w-full md:w-auto overflow-x-auto">
            <button 
              onClick={() => setEngine('gemini-image')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${engine === 'gemini-image' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              Gemini Flash
            </button>
            <button 
              onClick={() => setEngine('stable-diffusion')}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${engine === 'stable-diffusion' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-400'}`}
            >
              Gemini Pro
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1 flex items-center gap-2">
                <Layout size={18} className="text-indigo-600" /> Choose Style Inspiration
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setActivePreset(preset)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                      activePreset.id === preset.id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                        : 'bg-white border-indigo-50 text-slate-500 hover:border-indigo-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <textarea 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                rows={2}
                className={`${inputClassName} resize-none`}
                placeholder="Add custom descriptive style details..."
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-600 mb-4 ml-1 flex items-center gap-2">
                <Palette size={18} className="text-indigo-600" /> Brand Palette
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {brandColors.map((color, idx) => (
                  <div key={idx} className="space-y-3 p-4 bg-indigo-50/20 rounded-2xl border border-indigo-100/50">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">{idx === 0 ? 'Primary' : idx === 1 ? 'Secondary' : 'Accent'}</p>
                    <div className="flex flex-col gap-2">
                      <div className="relative group">
                        <input 
                          type="color" 
                          value={color}
                          onChange={(e) => updateColor(idx, e.target.value)}
                          className="w-full h-12 rounded-xl cursor-pointer border-2 border-white shadow-sm appearance-none bg-transparent overflow-hidden"
                        />
                        <div className="absolute inset-0 rounded-xl pointer-events-none border border-indigo-100" />
                      </div>
                      <div className="relative">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text"
                          value={color.replace('#', '')}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                            updateColor(idx, `#${val}`);
                          }}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-indigo-100 text-xs font-mono font-bold text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all uppercase"
                          placeholder="FFFFFF"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !project}
              className="w-full btn-brand-gradient text-white py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? <RefreshCcw className="animate-spin" size={24} /> : <Wand2 size={24} />}
              {engine === 'stable-diffusion' && !hasProKey ? 'Select Pro Key to Generate' : 'Generate Brand Logo'}
            </button>

            {engine === 'stable-diffusion' && (
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-4">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Key size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-indigo-900">Pro Features Enabled</p>
                  <p className="text-xs text-indigo-600/80">Gemini Pro Image requires a paid API key for high-quality generation.</p>
                </div>
                {!hasProKey && (
                  <button onClick={handleSelectKey} className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
                    Select Key
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Preview & Refinement */}
          <div className="space-y-8">
            <div className="relative aspect-square bg-slate-50 rounded-3xl border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
               {loading ? (
                 <Loader message="Designing your identity..." />
               ) : generatedLogo ? (
                 <div className="relative group w-full h-full">
                   <img src={generatedLogo} alt="Generated Logo" className="w-full h-full object-contain p-8" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={downloadLogo}
                        className="p-4 bg-white text-indigo-600 rounded-full hover:scale-110 transition-transform shadow-xl"
                      >
                        <Download size={24} />
                      </button>
                   </div>
                 </div>
               ) : (
                 <div className="text-center p-12 space-y-4">
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                       <ImageIcon size={40} />
                    </div>
                    <p className="text-slate-400 font-medium italic">Logo preview will appear here.</p>
                 </div>
               )}
            </div>

            {generatedLogo && (
              <div className="section-card p-6 bg-indigo-50/30 border border-indigo-100/50 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                   <Paintbrush size={20} className="text-indigo-600" />
                   <h3 className="font-bold text-slate-800">Quick Refinements</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {moodPresets.map((preset, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleRefine(preset.instruction)}
                      disabled={refining}
                      className="px-4 py-2 bg-white border border-indigo-100 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                   <input 
                     type="text"
                     value={colorInstruction}
                     onChange={(e) => setColorInstruction(e.target.value)}
                     placeholder="Or custom instruction (e.g., Make it darker)..."
                     className="flex-1 px-4 py-3 rounded-xl bg-white border border-indigo-100 text-sm outline-none focus:border-indigo-600"
                   />
                   <button 
                     onClick={() => handleRefine()}
                     disabled={refining || !colorInstruction}
                     className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                   >
                     {refining ? <RefreshCcw size={20} className="animate-spin" /> : <Zap size={20} />}
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {generatedLogo && (
        <div className="flex justify-center pb-12">
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all"
           >
             Finish Design <ArrowRight size={20} />
           </button>
        </div>
      )}
    </div>
  );
};

export default VisualLab;
