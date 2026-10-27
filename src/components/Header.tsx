import React from 'react';
import { 
  Bot, Globe, Smartphone, Monitor, ShoppingCart, 
  LogIn, UserPlus, LogOut, Sparkles, Sprout, Home, Map, MessageSquare, User, Cpu 
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  currentView: 'landing' | 'dashboard';
  currentTab: string;
  isLoggedIn: boolean;
  user: { name: string; role: string } | null;
  language: Language;
  phoneMode: boolean;
  onSetLanguage: (lang: Language) => void;
  onNavigateTab: (tab: string) => void;
  onSwitchView: (view: 'landing' | 'dashboard') => void;
  onTogglePhoneMode: () => void;
  onOpenOrder: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentTab,
  isLoggedIn,
  user,
  language,
  phoneMode,
  onSetLanguage,
  onNavigateTab,
  onSwitchView,
  onTogglePhoneMode,
  onOpenOrder,
  onOpenAuth,
  onLogout
}) => {
  const tr = translations[language] || translations.ru;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 select-none w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div
          onClick={() => { sounds.playClick(); onSwitchView('landing'); }}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black tracking-wider text-white flex items-center gap-1.5 font-mono">
              EGIN
              <span className="text-emerald-400 text-[9px] sm:text-[10px] font-sans font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 hidden xs:inline">
                AI AGRO
              </span>
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 hidden md:block tracking-tight font-medium">
              AQMOLA POWER 2026
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        {currentView === 'landing' ? (
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onSwitchView('landing')}
              className="hover:text-emerald-400 transition"
            >
              {tr.navAbout}
            </button>
            <button
              onClick={() => { sounds.playClick(); onSwitchView('dashboard'); onNavigateTab('sim'); }}
              className="hover:text-emerald-400 transition"
            >
              {tr.navSim}
            </button>
            <button
              onClick={() => { sounds.playClick(); onSwitchView('dashboard'); onNavigateTab('ai-agro'); }}
              className="hover:text-emerald-400 transition"
            >
              {tr.navAiAgro}
            </button>
            <button
              onClick={() => { sounds.playClick(); onSwitchView('dashboard'); onNavigateTab('fields'); }}
              className="hover:text-emerald-400 transition"
            >
              {tr.navFields}
            </button>
            <button
              onClick={() => { sounds.playClick(); onOpenOrder(); }}
              className="text-emerald-400 font-bold hover:text-emerald-300 transition"
            >
              {tr.navPreorder}
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
            {[
              { id: 'home', label: tr.navHome, icon: Home },
              { id: 'robots', label: tr.navRobots, icon: Bot },
              { id: 'fields', label: tr.navFields, icon: Map },
              { id: 'sim', label: tr.navSim, icon: Sprout },
              { id: 'ai-agro', label: tr.navAiAgro, icon: MessageSquare },
              { id: 'profile', label: tr.navProfile, icon: User }
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { sounds.playClick(); onNavigateTab(tab.id); }}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                    currentTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Controls: Language Switcher + Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Reactive Language Switcher (RU / KZ / EN) */}
          <div className="flex items-center bg-slate-900 rounded-xl p-0.5 sm:p-1 border border-slate-800 text-[11px] sm:text-xs font-mono font-bold">
            {(['ru', 'kz', 'en'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => { sounds.playClick(); onSetLanguage(l); }}
                className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg uppercase transition ${
                  language === l 
                    ? 'bg-emerald-500 text-slate-950 font-black shadow' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Switch language to ${l.toUpperCase()}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Toggle Phone Frame Preview (Desktop only) */}
          <button
            onClick={() => { sounds.playClick(); onTogglePhoneMode(); }}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs font-medium transition hidden sm:flex items-center gap-1.5 ${
              phoneMode 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Переключить рамку смартфона"
          >
            {phoneMode ? <Smartphone className="w-4 h-4 text-emerald-400" /> : <Monitor className="w-4 h-4" />}
            <span className="hidden lg:inline">{phoneMode ? tr.phoneView : tr.desktopView}</span>
          </button>

          {/* Main Action or Auth Buttons */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => { sounds.playClick(); onOpenAuth('login'); }}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-slate-300 hover:text-white transition"
              >
                {tr.login}
              </button>
              <button
                onClick={() => { sounds.playClick(); onOpenAuth('register'); }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
              >
                {tr.register}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {currentView === 'landing' ? (
                <button
                  onClick={() => { sounds.playClick(); onSwitchView('dashboard'); }}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {tr.toDashboard}
                </button>
              ) : (
                <button
                  onClick={() => { sounds.playClick(); onSwitchView('landing'); }}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium rounded-xl transition"
                >
                  {tr.toLanding}
                </button>
              )}

              {/* User Avatar Chip */}
              <div
                onClick={() => { sounds.playClick(); onSwitchView('dashboard'); onNavigateTab('profile'); }}
                className="flex items-center gap-1.5 bg-slate-900 p-1 sm:p-1.5 sm:pr-2.5 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700 transition"
                title="Профиль Абай"
              >
                <img
                  src="/assets/abay_avatar.jpg"
                  alt="Avatar"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover ring-1 ring-emerald-500/40"
                />
                <span className="text-xs font-semibold text-white hidden md:inline">
                  {user?.name || 'Абай'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Tab Navigation Bar for Dashboard (Scrollable with active indicators) */}
      {currentView === 'dashboard' && (
        <div className="md:hidden flex items-center gap-1 bg-slate-900/95 border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto scrollbar-none text-[11px] font-medium text-slate-400">
          {[
            { id: 'home', label: tr.navHome, icon: Home },
            { id: 'robots', label: tr.navRobots, icon: Bot },
            { id: 'fields', label: tr.navFields, icon: Map },
            { id: 'sim', label: tr.navSim, icon: Sprout },
            { id: 'ai-agro', label: tr.navAiAgro, icon: MessageSquare },
            { id: 'profile', label: tr.navProfile, icon: User }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { sounds.playClick(); onNavigateTab(tab.id); }}
                className={`flex-1 min-w-[58px] py-1 px-1.5 rounded-xl flex flex-col items-center justify-center transition shrink-0 ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'hover:text-white'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 mb-0.5" />
                <span className="truncate max-w-[62px] text-[10px] leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
