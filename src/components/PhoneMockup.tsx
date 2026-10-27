import React, { useState } from 'react';
import { 
  Wifi, Signal, Home, Bot, Map, User, Bell, Cloud, 
  Droplets, Scan, Sprout, ClipboardList, BatteryCharging, 
  ChevronRight, AlertTriangle, Radio, Video, Sliders, ExternalLink,
  Layers, Smartphone, Check
} from 'lucide-react';
import type { Robot, FieldProfile, ActivityLog, Language } from '../types';
import { translations } from '../i18n/translations';
import { sounds } from '../utils/soundEffects';

interface PhoneMockupProps {
  robots: Robot[];
  fields: FieldProfile[];
  activityLogs: ActivityLog[];
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  lang?: Language;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  robots,
  fields,
  activityLogs,
  activeTab,
  onNavigateTab,
  lang = 'ru'
}) => {
  const tr = translations[lang] || translations.ru;
  const [mobileTab, setMobileTab] = useState<'home' | 'robots' | 'fields' | 'profile'>('home');
  const [activeActionModal, setActiveActionModal] = useState<string | null>(null);

  // Sync external tab with internal mobile tab if changed from outside
  React.useEffect(() => {
    if (activeTab === 'home' || activeTab === 'robots' || activeTab === 'fields' || activeTab === 'profile') {
      setMobileTab(activeTab as any);
    }
  }, [activeTab]);

  const handleTabClick = (t: 'home' | 'robots' | 'fields' | 'profile') => {
    sounds.playClick();
    setMobileTab(t);
    onNavigateTab(t);
  };

  return (
    <div className="flex flex-col justify-center items-center py-4 px-2 select-none">
      
      {/* Phone Case (Titanium border with subtle reflection) */}
      <div className="relative w-full max-w-[390px] rounded-[50px] p-3.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_80px_rgba(0,0,0,0.9)] border-4 border-slate-700 ring-1 ring-slate-600/60">
        
        {/* Inner Phone Screen Container */}
        <div className="relative bg-slate-950 rounded-[40px] overflow-hidden border border-slate-800 flex flex-col h-[740px] text-slate-100 font-sans">
          
          {/* Status Bar (9:41) */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-white z-30 bg-slate-950">
            <span className="font-semibold tracking-tight text-[13px]">9:41</span>
            
            {/* Dynamic Island pill */}
            <div className="w-24 h-5 bg-black rounded-full border border-slate-800/80 flex items-center justify-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-mono font-bold text-emerald-400">EGIN OS</span>
            </div>

            {/* Signal & Battery */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="w-5 h-2.5 rounded-sm border border-slate-300 p-0.5 flex items-center">
                <div className="h-full bg-emerald-400 rounded-2xs w-[85%]"></div>
              </div>
            </div>
          </div>

          {/* Top Brand Bar */}
          <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-900 bg-slate-950/95 z-20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="font-black tracking-wider text-base text-white font-mono">
                EGIN
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Cloud className="w-4 h-4 text-slate-400" />
              <Bell className="w-4 h-4 text-slate-400" />
              <img
                src="/assets/abay_avatar.jpg"
                alt="Abay"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/40"
              />
            </div>
          </div>

          {/* INTERACTIVE LIVE MODE */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-none">
              
              {/* 1. MOBILE HOME TAB */}
              {mobileTab === 'home' && (
                <div className="space-y-4">
                  {/* Greeting */}
                  <div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">
                      {tr.goodDay}
                    </h2>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span className="font-bold text-slate-300">{tr.yourRobots}</span>
                      <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {tr.syncStatus}
                      </span>
                    </div>
                  </div>

                  {/* Robot Cards Carousel */}
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                    {robots.slice(0, 2).map((bot, idx) => (
                      <div
                        key={bot.id}
                        className="min-w-[220px] bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-lg relative flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {tr.robotPrefix} 0{idx + 1}
                            </div>
                            <div className="text-sm font-bold text-white">{bot.name}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                            {tr.statusOnline}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 my-2.5">
                          <img
                            src={bot.image}
                            alt={bot.name}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-slate-800"
                          />
                          <div>
                            <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                              <BatteryCharging className="w-3.5 h-3.5" />
                              <span>{bot.battery}%</span>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                              {bot.location}
                            </div>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 truncate">
                          {tr.currentTask}: {bot.currentTask.title}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 4 Quick Actions */}
                  <div>
                    <div className="text-xs font-bold text-white mb-2">{tr.quickActions}</div>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => { sounds.playClick(); setActiveActionModal(tr.actionWater); }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-1.5 active:bg-slate-800 transition"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">{tr.actionWater}</span>
                      </button>

                      <button
                        onClick={() => { sounds.playClick(); setActiveActionModal(tr.actionScan); }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-1.5 active:bg-slate-800 transition"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                          <Scan className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">{tr.actionScan}</span>
                      </button>

                      <button
                        onClick={() => { sounds.playClick(); setActiveActionModal(tr.actionSoil); }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-1.5 active:bg-slate-800 transition"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">{tr.actionSoil}</span>
                      </button>

                      <button
                        onClick={() => { sounds.playClick(); handleTabClick('robots'); }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-1.5 active:bg-slate-800 transition"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-200">{tr.actionTasks}</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <div className="text-xs font-bold text-white mb-2">{tr.recentActivity}</div>
                    <div className="space-y-2">
                      {activityLogs.slice(0, 3).map((log) => {
                        const actionText = lang === 'kz' ? log.actionKz : lang === 'en' ? log.actionEn : log.actionRu;
                        return (
                          <div
                            key={log.id}
                            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] flex items-start gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0"></span>
                            <div className="flex-1 leading-snug">
                              <strong className="text-white">{log.robotName}</strong> | {actionText}
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              {log.timestamp}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MOBILE ROBOTS TAB */}
              {mobileTab === 'robots' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">{tr.allRobotsTitle}</h3>
                    <span className="text-xs text-emerald-400 font-mono font-bold">2 {tr.robotsOnlineCount}</span>
                  </div>

                  {robots.slice(0, 2).map((r, i) => (
                    <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={r.image}
                            alt={r.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800"
                          />
                          <div>
                            <div className="text-[10px] text-slate-400 font-mono">{tr.robotPrefix} {i + 1}</div>
                            <div className="text-sm font-bold text-white">{r.name}</div>
                            <div className="text-[10px] text-slate-400">{r.location}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          {r.battery}%
                        </span>
                      </div>

                      <div className="text-[11px] bg-slate-950 p-2 rounded-xl text-slate-300">
                        <span className="text-slate-500 block text-[10px]">{tr.currentTask}:</span>
                        {r.currentTask.title}
                      </div>

                      <button
                        onClick={() => { sounds.playClick(); alert(`${tr.currentTask}: ${r.currentTask.title} (${r.currentTask.progress}%)`); }}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                      >
                        {tr.viewTaskDetails}
                      </button>
                    </div>
                  ))}

                  {/* Maintenance Alert */}
                  <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-xl text-[11px] text-amber-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{tr.maintenanceTitle}</span>
                    </div>
                    <p className="text-[10px] text-amber-400/80 leading-tight">
                      {tr.maintenanceDesc}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. MOBILE FIELDS TAB */}
              {mobileTab === 'fields' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">{tr.fieldControlTitle}</h3>
                    <span className="text-xs text-emerald-400 font-mono font-bold">{fields.length} {tr.activeUnitsLabel}</span>
                  </div>

                  {fields.slice(0, 2).map((f) => (
                    <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">{f.sectionCode}</div>
                          <div className="text-sm font-bold text-white">{f.name}</div>
                          <div className="text-xs text-emerald-400 font-medium">
                            {lang === 'kz' ? f.cropKz : f.crop}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300">
                          {f.areaHa} Га
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                        <div className="bg-slate-950 p-1.5 rounded-lg">
                          <span className="text-[9px] text-slate-500 block">{tr.fieldMoisture}</span>
                          <span className="font-mono font-bold text-emerald-400">{f.soilMoisture}%</span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-lg">
                          <span className="text-[9px] text-slate-500 block">{tr.fieldPh}</span>
                          <span className="font-mono font-bold text-sky-400">{f.ph}</span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-lg">
                          <span className="text-[9px] text-slate-500 block">{tr.fieldNitrogen}</span>
                          <span className="font-mono font-bold text-amber-400">{f.nitrogenPpm} ppm</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-800">
                        <span>{tr.fieldIrrigationSchedule}: {f.nextWatering}</span>
                        <span className="text-white font-mono">{f.routeProgress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. MOBILE PROFILE TAB */}
              {mobileTab === 'profile' && (
                <div className="space-y-3 text-xs">
                  {/* User Info */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
                    <img
                      src="/assets/abay_avatar.jpg"
                      alt="Abay"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50"
                    />
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Абай</h4>
                      <p className="text-[11px] text-slate-400">{tr.farmManagerRole}</p>
                    </div>
                  </div>

                  {/* Device Summary */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{tr.devicesActiveBadge}</span>
                      <span className="text-emerald-400 text-[10px] font-normal">Сводка</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map(n => (
                        <div key={n} className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-emerald-400">
                          <Bot className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings list */}
                  <div className="space-y-1.5">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-200">{tr.autonomousMode}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-200">{tr.arQuality}</span>
                      <span className="text-sky-400 font-mono font-bold text-[10px]">4K 60FPS</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-200">{tr.cloudSync}</span>
                      <span className="text-emerald-400 font-bold text-[10px]">ONLINE</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-200">{tr.firmware}</span>
                      <button
                        onClick={() => { sounds.playClick(); alert(tr.firmwareDesc); }}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        {tr.checkFirmwareBtn}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          {/* Quick Action Confirmation Modal in Phone Mode */}
          {activeActionModal && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full p-4 text-center animate-scaleUp">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{tr.confirmActionTitle} {activeActionModal}</h4>
                <p className="text-xs text-slate-400 mb-4">{tr.actionDispatchedSuccess}</p>
                <button
                  onClick={() => setActiveActionModal(null)}
                  className="w-full py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  {tr.cancelBtn}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Native Navigation Bar (Home, Robots, Fields, Profile) */}
          <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-900 flex items-center justify-around z-20">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex flex-col items-center gap-1 transition ${mobileTab === 'home' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tr.navHome}</span>
            </button>

            <button
              onClick={() => handleTabClick('robots')}
              className={`flex flex-col items-center gap-1 transition ${mobileTab === 'robots' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Bot className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tr.navRobots}</span>
            </button>

            <button
              onClick={() => handleTabClick('fields')}
              className={`flex flex-col items-center gap-1 transition ${mobileTab === 'fields' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Map className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tr.navFields}</span>
            </button>

            <button
              onClick={() => handleTabClick('profile')}
              className={`flex flex-col items-center gap-1 transition ${mobileTab === 'profile' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tr.navProfile}</span>
            </button>
          </div>

          {/* Bottom Home Indicator Bar (iPhone gesture bar) */}
          <div className="pb-1.5 pt-0.5 flex justify-center bg-slate-950">
            <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
};
