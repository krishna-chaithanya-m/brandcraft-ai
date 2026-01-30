
import React, { useState } from 'react';
import { analyzeSentiment } from '../services/gemini';
import Loader from '../components/Loader';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { MessageSquareText, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { User } from '../types';

interface SentimentHubProps {
  currentUser: User | null;
  onAuthRequired: () => void;
}

const SentimentHub: React.FC<SentimentHubProps> = ({ currentUser, onAuthRequired }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!feedback) return;
    if (!currentUser) return onAuthRequired();

    setLoading(true);
    try {
      const res = await analyzeSentiment(feedback);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRadarData = () => {
    if (!result?.breakdown) return [];
    return Object.entries(result.breakdown).map(([key, val]) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      A: val,
      fullMark: 100
    }));
  };

  const inputClassName = "w-full px-5 py-4 rounded-xl bg-indigo-50/30 border-2 border-indigo-100/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700 shadow-sm";

  return (
    <div className="space-y-8 animate-fadeInUp">
      <section className="section-card p-8 md:p-12">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">Sentiment Analysis</h2>
        <p className="text-slate-500 mb-10">Paste customer feedback to analyze brand perception and emotions.</p>

        <div className="space-y-6">
           <div>
              <label className="block text-sm font-bold text-slate-600 mb-2 ml-1">Customer Feedback</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                placeholder="Paste customer review or feedback here..."
                className={`${inputClassName} resize-none`}
              />
           </div>
           <button 
             onClick={handleAnalyze}
             disabled={loading || !feedback}
             className="btn-brand-gradient text-white px-10 py-4 rounded-xl font-bold shadow-xl flex items-center gap-3 disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all"
           >
             {loading ? <RefreshCw className="animate-spin" size={24} /> : <TrendingUp size={24} />}
             Analyze Sentiment
           </button>
        </div>

        {loading ? (
          <div className="mt-12"><Loader message="Decoding brand emotions..." /></div>
        ) : result && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fadeInUp">
             <div className="space-y-6">
                <div className={`p-8 rounded-2xl border-l-8 flex flex-col gap-2 transition-all shadow-md ${
                  result.label === 'Positive' ? 'bg-emerald-50/50 border-emerald-500 text-emerald-800' : 
                  result.label === 'Negative' ? 'bg-rose-50/50 border-rose-500 text-rose-800' : 'bg-amber-50/50 border-amber-500 text-amber-800'
                }`}>
                   <span className="uppercase tracking-widest text-[10px] font-black opacity-60">Overall Sentiment</span>
                   <h3 className="text-4xl font-black">{result.label}</h3>
                   <p className="text-sm font-bold opacity-80">Confidence Score: {Math.round(result.score * 100)}%</p>
                </div>

                <div className="bg-white border border-indigo-50 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                   <h4 className="font-bold text-slate-800 flex items-center gap-2"><AlertCircle size={18} className="text-indigo-600" /> Strategic Insight</h4>
                   <p className="text-sm text-slate-600 leading-relaxed font-medium">AI suggests doubling down on the positive emotional markers identified in this feedback to strengthen brand loyalty.</p>
                </div>
             </div>

             <div className="h-[350px] bg-white rounded-3xl p-6 border border-indigo-50 shadow-sm flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData()}>
                    <PolarGrid stroke="#eef2ff" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6366f1', fontSize: 11, fontWeight: 800 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Sentiment"
                      dataKey="A"
                      stroke="#4f46e5"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SentimentHub;
