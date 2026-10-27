import React, { useState } from 'react';
import { 
  User, Settings, Bot, Radio, Video, Cloud, CloudOff, 
  Cpu, Shield, Check, Award, TrendingUp, Clock, Droplets, CheckCircle2 
} from 'lucide-react';
import type { Language } from '../../types';
import { translations } from '../../i18n/translations';
import { sounds } from '../../utils/soundEffects';

interface ProfilePageProps {
  onLogout?: () => void;
  lang?: Language;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout, lang = 'ru' }) => {
  const tr = translations[lang] || translations.ru;
  const [autonomousMode, setAutonomousMode] = useState<boolean>(true);
  const [arQuality, setArQuality] = useState<'4K' | '1080p'>('4K');
  const [cloudOffline, setCloudOffline] = useState<boolean>(false);
  const [firmwareChecked, setFirmwareChecked] = useState<boolean>(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Subtle Kazakh Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <img
                src="/assets/abay_avatar.jpg"
                alt="Абай"
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-2xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-slate-950">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Абай</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  PRO Фермер
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                {tr.farmManagerRole} • г. Косшы
              </p>
              <div className="text-xs text-slate-500 font-mono mt-1">
                Astana IT University / JanaBales • ID: EGIN-KZ-0091
              </div>
            </div>
          </div>

          <button
            onClick={() => { sounds.playClick(); alert('Настройки аккаунта обновлены'); }}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Настройки"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Devices Summary Banner */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/70 p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{tr.devicesActiveBadge}</div>
              <div className="text-xs text-slate-400">2 EGIN Mark II, 1 Reserve, 1 Follow-Me Cart</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <div
                key={num}
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shadow hover:border-emerald-500/50 transition cursor-pointer"
                title={`Робот 0${num}`}
              >
                0{num}
              </div>
            ))}
            <span className="text-xs text-emerald-400 font-medium ml-2">Сводка</span>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight mb-2">
          {tr.profileTitle}
        </h2>

        {/* Option 1: Автономный режим */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{tr.autonomousMode}</div>
              <div className="text-xs text-slate-400">
                {tr.autonomousModeDesc}
              </div>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); setAutonomousMode(!autonomousMode); }}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${autonomousMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${autonomousMode ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </button>
        </div>

        {/* Option 2: Качество AR-трансляции */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{tr.arQuality}</div>
              <div className="text-xs text-slate-400">
                {tr.arQualityDesc}
              </div>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); setArQuality(arQuality === '4K' ? '1080p' : '4K'); }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-sky-400 hover:border-sky-500 transition"
          >
            {arQuality} 60 FPS
          </button>
        </div>

        {/* Option 3: Синхр. с облаком */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center">
              {cloudOffline ? <CloudOff className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{tr.cloudSync}</div>
              <div className="text-xs text-amber-400/90 font-medium">
                {cloudOffline ? tr.cloudOfflineLabel : tr.cloudOnlineLabel}
              </div>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); setCloudOffline(!cloudOffline); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${cloudOffline ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}
          >
            {cloudOffline ? 'Включить Онлайн' : 'Включить Оффлайн'}
          </button>
        </div>

        {/* Option 4: Прошивка */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
              CS
            </div>
            <div>
              <div className="text-sm font-bold text-white">{tr.firmware}</div>
              <div className="text-xs text-slate-400">
                {tr.firmwareDesc}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              setFirmwareChecked(true);
              alert('Проверка завершена: Прошивка EGIN OS v2.4 актуальна!');
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition"
          >
            {firmwareChecked ? 'Актуально' : tr.checkFirmwareBtn}
          </button>
        </div>
      </div>

      {/* Economic Impact Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Экономический эффект на вашем участке (AQMOLA POWER 2026)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">-90%</div>
            <div className="text-xs text-slate-300 font-bold mt-1">Экономия времени</div>
            <div className="text-[11px] text-slate-500 mt-0.5">30 мин/неделю вместо 20 ч.</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 mx-auto flex items-center justify-center mb-2">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-sky-400 font-mono">-40%</div>
            <div className="text-xs text-slate-300 font-bold mt-1">Сбережение воды</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Точечный микрокапельный полив</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-2">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">+35%</div>
            <div className="text-xs text-slate-300 font-bold mt-1">Прирост урожая</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Научная точность N-P-K дозирования</div>
          </div>
        </div>

        {onLogout && (
          <div className="mt-6 pt-6 border-t border-slate-800 flex justify-end">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold rounded-xl transition"
            >
              {tr.logout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
