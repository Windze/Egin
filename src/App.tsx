import React, { useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { HomePage } from './components/dashboard/HomePage';
import { RobotsPage } from './components/dashboard/RobotsPage';
import { FieldsPage } from './components/dashboard/FieldsPage';
import { PixelSimulation } from './components/dashboard/PixelSimulation';
import { AiAgroChat } from './components/dashboard/AiAgroChat';
import { ProfilePage } from './components/dashboard/ProfilePage';
import { OrderModal } from './components/OrderModal';
import { AuthModal } from './components/AuthModal';
import { PhoneMockup } from './components/PhoneMockup';
import { INITIAL_ROBOTS, INITIAL_FIELDS, INITIAL_ACTIVITY_LOGS } from './data/robotsData';
import type { Robot, FieldProfile, ActivityLog, Language } from './types';
import { translations } from './i18n/translations';

export function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('ru');
  const [phoneMode, setPhoneMode] = useState<boolean>(false);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<{ name: string; role: string }>({
    name: 'Абай',
    role: 'Управляющий фермой'
  });

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; tab: 'login' | 'register' }>({
    isOpen: false,
    tab: 'login'
  });

  // Live Data State
  const [robots, setRobots] = useState<Robot[]>(INITIAL_ROBOTS);
  const [fields, setFields] = useState<FieldProfile[]>(INITIAL_FIELDS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Trigger quick action from dashboard
  const handleTriggerQuickAction = (actionType: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      robotId: 'egin-01',
      robotName: 'EGIN 01',
      timestamp: 'Только что',
      actionRu: `${actionType} выполнен по расписанию`,
      actionKz: `${actionType} кесте бойынша орындалды`,
      actionEn: `${actionType} completed on schedule`,
      severity: 'success'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    setRobots(prev =>
      prev.map(r => {
        if (r.id === 'egin-01') {
          return {
            ...r,
            waterLevel: Math.max(10, r.waterLevel - 5),
            lastSync: 'Только что'
          };
        }
        return r;
      })
    );
  };

  const handleDispatchTaskFromAi = (taskDescription: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      robotId: 'egin-01',
      robotName: 'EGIN 01',
      timestamp: 'Только что',
      actionRu: taskDescription,
      actionKz: taskDescription,
      actionEn: taskDescription,
      severity: 'info'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const renderDashboardContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomePage
            robots={robots}
            activityLogs={activityLogs}
            onNavigateTab={setCurrentTab}
            onTriggerQuickAction={handleTriggerQuickAction}
            lang={language}
          />
        );
      case 'robots':
        return <RobotsPage robots={robots} lang={language} />;
      case 'fields':
        return <FieldsPage fields={fields} lang={language} />;
      case 'sim':
        return <PixelSimulation lang={language} />;
      case 'ai-agro':
        return <AiAgroChat onDispatchTask={handleDispatchTaskFromAi} lang={language} />;
      case 'profile':
        return (
          <ProfilePage
            onLogout={() => {
              setIsLoggedIn(false);
              setCurrentView('landing');
            }}
            lang={language}
          />
        );
      default:
        return (
          <HomePage
            robots={robots}
            activityLogs={activityLogs}
            onNavigateTab={setCurrentTab}
            onTriggerQuickAction={handleTriggerQuickAction}
            lang={language}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-x-hidden w-full max-w-full">
      {/* Top Header */}
      <Header
        currentView={currentView}
        currentTab={currentTab}
        isLoggedIn={isLoggedIn}
        user={user}
        language={language}
        phoneMode={phoneMode}
        onSetLanguage={setLanguage}
        onNavigateTab={setCurrentTab}
        onSwitchView={setCurrentView}
        onTogglePhoneMode={() => setPhoneMode(!phoneMode)}
        onOpenOrder={() => setIsOrderModalOpen(true)}
        onOpenAuth={tab => setAuthModal({ isOpen: true, tab })}
        onLogout={() => {
          setIsLoggedIn(false);
          setCurrentView('landing');
        }}
      />

      {/* Main Content View */}
      <main className="flex-1 w-full max-w-full">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenOrder={() => setIsOrderModalOpen(true)}
            onOpenAuth={tab => setAuthModal({ isOpen: true, tab })}
            onEnterDashboard={() => {
              setCurrentView('dashboard');
              setCurrentTab('home');
            }}
            lang={language}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8 w-full max-w-full">
            {phoneMode ? (
              <PhoneMockup
                robots={robots}
                fields={fields}
                activityLogs={activityLogs}
                activeTab={currentTab}
                onNavigateTab={setCurrentTab}
                lang={language}
              />
            ) : (
              renderDashboardContent()
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 sm:py-10 px-4 text-xs text-slate-500 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-white text-base">EGIN</span>
            <div>
              <div className="font-bold text-slate-300">
                {language === 'kz' ? 'ЖИ-мен жабдықталған дербес агро-гуманоидты робот' : 
                 language === 'en' ? 'Autonomous AI Agro-Humanoid Robot' : 
                 'Автономный агро-робот-гуманоид с ИИ'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {language === 'kz' ? '«AQMOLA POWER 2026» байқауы • Көкшетау / Қосшы' : 
                 language === 'en' ? 'AQMOLA POWER 2026 Competition • Kokshetau / Kosshy' : 
                 'Конкурс «AQMOLA POWER 2026» • Кокшетау / Косшы'}
              </div>
            </div>
          </div>

          <div className="text-slate-400">
            {language === 'kz' ? 'Жоба авторы:' : language === 'en' ? 'Project author:' : 'Автор:'}{' '}
            <strong className="text-slate-200">Тлеугалыев Абай</strong> (Astana IT University / JanaBales)
            <br />
            {language === 'kz' ? 'Байланыс:' : language === 'en' ? 'Contacts:' : 'Контакты:'}{' '}
            <span className="font-mono text-emerald-400">+7 (747) 829-05-80</span> | <span className="font-mono text-slate-300">abaikryt@gmail.com</span>
          </div>
        </div>
      </footer>

      {/* Pre-order Configurator Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        lang={language}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ isOpen: false, tab: 'login' })}
        onLoginSuccess={loggedInUser => {
          setIsLoggedIn(true);
          setUser(loggedInUser);
          setCurrentView('dashboard');
        }}
        lang={language}
      />
    </div>
  );
}

export default App;
