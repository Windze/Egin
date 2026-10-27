import React, { useState } from 'react';
import { 
  Bot, BatteryCharging, Droplets, MapPin, AlertTriangle, 
  ArrowRight, ShieldCheck, Sparkles, X, Pause, RotateCcw, CheckCircle2 
} from 'lucide-react';
import type { Robot, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { sounds } from '../../utils/soundEffects';

interface RobotsPageProps {
  robots: Robot[];
  onUpdateRobot?: (updated: Robot) => void;
  lang?: Language;
}

export const RobotsPage: React.FC<RobotsPageProps> = ({ robots, lang = 'ru' }) => {
  const tr = translations[lang] || translations.ru;
  const [selectedRobotForDetails, setSelectedRobotForDetails] = useState<Robot | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [maintenanceDismissed, setMaintenanceDismissed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredRobots = robots.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {tr.allRobotsTitle}
            </h1>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
              {tr.activeCountLabel}: {robots.filter(r => r.status === 'online' || r.status === 'working').length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {lang === 'kz' 
              ? '22 еркіндік дәрежесі, алақаннан нүктелі суаруы және Follow-Me себеті бар EGIN дербес агро-гуманоидтары.' 
              : lang === 'en' 
              ? 'Fleet of autonomous EGIN humanoids with 22 DOF, palm micro-irrigation, and Follow-Me baskets.' 
              : 'Парк автономных гуманоидов EGIN с 22 степенями свободы, ладонным микрополивом и корзинами Follow-Me.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
          {[
            { id: 'all', label: tr.filterAll },
            { id: 'online', label: tr.filterOnline },
            { id: 'working', label: tr.filterWorking },
            { id: 'charging', label: tr.filterCharging }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { sounds.playClick(); setFilterStatus(f.id); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-medium transition text-center ${
                filterStatus === f.id ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Robot Cards List */}
      <div className="space-y-4">
        {filteredRobots.map(robot => (
          <div
            key={robot.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl transition relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
              
              {/* Left Column: Image & Identification */}
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950 border border-slate-800 p-1.5 shrink-0 overflow-hidden shadow-inner">
                  <img
                    src={robot.image}
                    alt={robot.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 font-mono">
                      {robot.dof} DOF
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 font-mono">{tr.robotPrefix}</div>
                  <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{robot.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{robot.location}</span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {robot.firmware}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Ою-өрнек Edition
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column: Telemetry Specs */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full lg:w-auto text-xs">
                <div className="p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-center">
                  <div className="text-slate-400 text-[10px] sm:text-[11px] flex items-center justify-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{tr.batteryLabel}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-1">
                    {robot.battery}%
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-center">
                  <div className="text-slate-400 text-[10px] sm:text-[11px] flex items-center justify-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>{tr.waterTankLabel}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold font-mono text-sky-400 mt-1">
                    {robot.waterLevel}%
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-center">
                  <div className="text-slate-400 text-[10px] sm:text-[11px] flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tr.fertilizerLabel}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold font-mono text-amber-400 mt-1">
                    {robot.fertilizerLevel}%
                  </div>
                </div>
              </div>

              {/* Right Column: Status & Current Task Action */}
              <div className="flex flex-col items-start lg:items-end w-full lg:w-64 gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {tr.statusOnline}
                </span>

                <div className="text-xs text-slate-300 text-left lg:text-right mt-1 w-full truncate">
                  <span className="text-slate-500">{tr.currentTask}:</span>
                  <div className="font-semibold text-white mt-0.5 truncate">{robot.currentTask.title}</div>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedRobotForDetails(robot);
                  }}
                  className="w-full lg:w-auto px-4 py-2 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 hover:border-emerald-500 transition flex items-center justify-center gap-1.5 shadow-md mt-1"
                >
                  <span>{tr.viewTaskDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Maintenance Alerts */}
      {!maintenanceDismissed && (
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-200">
                {tr.maintenanceTitle}
              </h2>
              <p className="text-xs text-amber-300/80 mt-1">
                {tr.maintenanceDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => { 
                sounds.playHarvest(); 
                showToast(
                  lang === 'kz' ? 'Ауа сүзгісіне тапсырыс қабылданды' : 
                  lang === 'en' ? 'Filter order submitted' : 
                  'Заказ оригинального сменного HEPA-фильтра для EGIN 02 оформлен!'
                ); 
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition shadow-md shadow-amber-500/20"
            >
              {tr.orderFilterBtn}
            </button>
            <button
              onClick={() => setMaintenanceDismissed(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
            >
              {tr.cancelBtn}
            </button>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedRobotForDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 text-slate-100 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {tr.currentTask}: {selectedRobotForDetails.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedRobotForDetails.model}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRobotForDetails(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">{tr.currentTask}:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    Прогресс: {selectedRobotForDetails.currentTask.progress}%
                  </span>
                </div>
                <div className="text-sm font-bold text-white mb-2">
                  {selectedRobotForDetails.currentTask.title}
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${selectedRobotForDetails.currentTask.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">{tr.fieldCrop}:</span>
                  <span className="font-semibold text-white">{selectedRobotForDetails.currentTask.crop}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Операция:</span>
                  <span className="font-semibold text-white">{selectedRobotForDetails.currentTask.action}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">ETA:</span>
                  <span className="font-semibold text-emerald-400 font-mono">{selectedRobotForDetails.currentTask.eta}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">RTK Точность:</span>
                  <span className="font-semibold text-sky-400 font-mono">±1.5 см</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { 
                      sounds.playClick(); 
                      showToast(`Робот ${selectedRobotForDetails.name} приостановлен`); 
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    <span>Пауза</span>
                  </button>
                  <button
                    onClick={() => { 
                      sounds.playClick(); 
                      showToast(`Робот ${selectedRobotForDetails.name} направлен на док-станцию`); 
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>На док</span>
                  </button>
                </div>

                <button
                  onClick={() => setSelectedRobotForDetails(null)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                >
                  {tr.cancelBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
