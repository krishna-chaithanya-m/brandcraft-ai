
import React, { useState } from 'react';
import { Zap, Mail, Lock, User as UserIcon, ArrowRight, Loader2, X } from 'lucide-react';
import { loginUser, registerUser } from '../services/auth';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onGuest?: () => void;
  onCancel?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onGuest, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Artificial delay for "database" processing feel
    await new Promise(r => setTimeout(r, 800));

    if (isLogin) {
      const result = loginUser(email, password);
      if (result.success && result.user) {
        onAuthSuccess(result.user);
      } else {
        setError(result.message);
      }
    } else {
      const result = registerUser({ email, username, password });
      if (result.success && result.user) {
        onAuthSuccess(result.user);
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  const inputContainerClass = "relative flex items-center";
  const iconClass = "absolute left-4 text-slate-400";
  const inputClass = "w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700";

  return (
    <div className="w-full max-w-md section-card p-8 md:p-10 animate-popIn relative shadow-2xl">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      )}

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-4 animate-glow">
          <Zap size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-slate-500 font-medium">
          {isLogin ? 'Sign in to manage your brand empire' : 'Start your generative branding journey'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold animate-fadeInUp">
            {error}
          </div>
        )}

        {!isLogin && (
          <div className={inputContainerClass}>
            <UserIcon size={20} className={iconClass} />
            <input
              type="text"
              required
              placeholder="Full Name"
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}

        <div className={inputContainerClass}>
          <Mail size={20} className={iconClass} />
          <input
            type="email"
            required
            placeholder="Email Address"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={inputContainerClass}>
          <Lock size={20} className={iconClass} />
          <input
            type="password"
            required
            placeholder="Password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-brand-gradient text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              {isLogin ? 'Sign In' : 'Register Now'}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-slate-500 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-indigo-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
        {onGuest && (
          <button
            onClick={onGuest}
            className="mt-4 text-xs text-slate-400 hover:text-indigo-600 underline font-medium"
          >
            Continue as Guest
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
