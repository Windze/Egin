import React, { useState } from 'react';
import { Bot, Mail, Lock, User, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string }) => void;
  lang?: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onLoginSuccess,
  lang = 'ru'
}) => {
  const tr = translations[lang] || translations.ru;
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('abaikryt@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Абай Тлеугалыев');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    onLoginSuccess({
      name: tab === 'login' ? 'Абай' : name,
      role: tr.authRoleManager
    });
    onClose();
  };

  const handleDemoLogin = () => {
    sounds.playClick();
    onLoginSuccess({
      name: 'Абай',
      role: tr.authRoleManager
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-5 sm:p-7 text-slate-100 shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {tab === 'login' ? tr.authLoginTab : tr.authRegisterTab}
              </h3>
              <p className="text-xs text-slate-400">EGIN OS v2.4 • AQMOLA POWER 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-semibold">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              tab === 'login' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tr.login}
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              tab === 'register' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tr.register}
          </button>
        </div>

        {/* Quick Demo One-Click Access Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition group shadow-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span>{tr.authQuickDemo}</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-500 text-[10px] uppercase font-mono tracking-wider">
            или вручную
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {tab === 'register' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">{tr.authFullName}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">{tr.authEmail}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1 font-medium">{tr.authPassword}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition mt-2"
          >
            {tab === 'login' ? tr.authSubmitLogin : tr.authSubmitRegister}
          </button>
        </form>
      </div>
    </div>
  );
};
