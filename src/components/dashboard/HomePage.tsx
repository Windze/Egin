import React, { useState } from 'react';
import { 
  Droplets, Scan, Sprout, ClipboardList, BatteryCharging, 
  RefreshCw, ArrowUpRight, Check, CheckCircle2 
} from 'lucide-react';
import type { Robot, ActivityLog, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { sounds } from '../../utils/soundEffects';

interface HomePageProps {
  robots: Robot[];
  activityLogs: ActivityLog[];
  onNavigateTab: (tab: string) => void;
  onTriggerQuickAction: (actionType: string) => void;
  lang?: Language;
}

export const HomePage: React.FC<HomePageProps> = ({
  robots,
  activityLogs,
  onNavigateTab,
  onTriggerQuickAction,
  lang = 'ru'
}) => {
  const tr = translations[lang] || translations.ru;
  const [activeModalAction, setActiveModalAction] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleActionClick = (actionName: string) => {
    sounds.playClick();
    setActiveModalAction(actionName);
  };

  const handleExecuteAction = () => {
    sounds.playWater();
    onTriggerQuickAction(activeModalAction || '');
    setActionSuccess(tr.actionDispatchedSuccess);
    setTimeout(() => {
      setActiveModalAction(null);
      setActionSuccess(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative shrink-0">
            <img
              src="/assets/abay_avatar.jpg"
              alt="Абай"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {tr.goodDay}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span>{tr.farmManagerRole}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 hidden sm:inline"></span>
              <span className="text-emerald-400 font-medium hidden sm:inline">{tr.systemOnline}</span>
            </p>
          </div>
        </div>

        {/* Sync Status Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] sm:text-xs font-mono text-slate-300">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>{tr.syncStatus}</span>
          </div>
        </div>
      </div>

      {/* Robot Cards Grid (Matching RUS_Home_page.jpeg) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {tr.yourRobots}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
              2 {tr.robotsOnlineCount}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('robots')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
          >
            <span>{tr.allRobotsLink} ({robots.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {robots.slice(0, 2).map((robot, index) => (
            <div
              key={robot.id}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-200 relative overflow-hidden group"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img
                      src={robot.image}
                      alt={robot.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {tr.robotPrefix} 0{index + 1}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white tracking-tight">{robot.name}</div>
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{robot.location}</div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {tr.statusOnline}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono text-slate-300 mt-0.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{robot.battery}%</span>
                  </div>
                </div>
              </div>

              {/* Current Task Progress */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{tr.currentTask}:</span>
                  <span className="text-emerald-400 font-medium font-mono">{robot.currentTask.eta}</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mb-2 truncate">
                  {robot.currentTask.title}
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${robot.currentTask.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 truncate max-w-[180px]">
                  {robot.currentTask.action}
                </span>
                <button
                  onClick={() => onNavigateTab('robots')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  {tr.viewTaskDetails}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Quick Actions (Exact 4 buttons from RUS_Home_page.jpeg) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mb-4">
          {tr.quickActions}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {/* Action 1: Вода */}
          <button
            onClick={() => handleActionClick(tr.actionWater)}
            className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/50 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white">{tr.actionWater}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 text-center">{tr.actionWaterSub}</span>
          </button>

          {/* Action 2: Сканирование */}
          <button
            onClick={() => handleActionClick(tr.actionScan)}
            className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Scan className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white">{tr.actionScan}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 text-center">{tr.actionScanSub}</span>
          </button>

          {/* Action 3: Почва */}
          <button
            onClick={() => handleActionClick(tr.actionSoil)}
            className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white">{tr.actionSoil}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 text-center">{tr.actionSoilSub}</span>
          </button>

          {/* Action 4: Задачи */}
          <button
            onClick={() => onNavigateTab('robots')}
            className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition group"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white">{tr.actionTasks}</span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 text-center">{tr.actionTasksSub}</span>
          </button>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mb-4 flex items-center justify-between">
          <span>{tr.recentActivity}</span>
          <span className="text-xs text-slate-400 font-normal hidden sm:inline">{tr.activityLogSubtitle}</span>
        </h2>

        <div className="space-y-2.5">
          {activityLogs.map((log) => {
            const actionText = lang === 'kz' ? log.actionKz : lang === 'en' ? log.actionEn : log.actionRu;

            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-sm shadow-emerald-400/50"></div>
                <div className="flex-1 text-xs sm:text-sm">
                  <span className="font-bold text-white mr-1.5">{log.robotName}</span>
                  <span className="text-slate-300">| {actionText}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-mono shrink-0">
                  {log.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl animate-scaleUp">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span>{tr.confirmActionTitle} {activeModalAction}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {tr.confirmActionDesc}
            </p>

            {actionSuccess ? (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{actionSuccess}</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModalAction(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
                >
                  {tr.cancelBtn}
                </button>
                <button
                  onClick={handleExecuteAction}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20"
                >
                  {tr.confirmActionBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
