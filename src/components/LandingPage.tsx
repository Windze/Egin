import React, { useState } from 'react';
import { 
  Bot, Droplets, Cpu, ShieldCheck, ArrowRight, Play, CheckCircle2, 
  AlertCircle, Sparkles, ShoppingCart, Video, Compass, ChevronRight 
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { sounds } from '../utils/soundEffects';

interface LandingPageProps {
  onOpenOrder: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onEnterDashboard: () => void;
  lang?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenOrder,
  onOpenAuth,
  onEnterDashboard,
  lang = 'ru'
}) => {
  const tr = translations[lang] || translations.ru;

  // Selected Video Player
  const [selectedVideo, setSelectedVideo] = useState<string>('/assets/video_1.mp4');

  // ROI Calculator State
  const [calcPlotSize, setCalcPlotSize] = useState<number>(10); // in sotka (100 m2)

  // Calculations:
  // Traditional: 2 hrs/sotka/week * 16 weeks = 32 hrs/sotka. With Egin: 90% saved = ~29 hrs/sotka
  const hoursSaved = Math.round(calcPlotSize * 28.5);
  // Water: ~1,500 L per sotka in season. 40% saved = 600 L / sotka
  const waterSavedLiters = Math.round(calcPlotSize * 620);
  // Yield: +35% = ~140 kg / sotka
  const extraYieldKg = Math.round(calcPlotSize * 135);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 select-none overflow-x-hidden w-full">
      
      {/* 1. HERO SECTION (Apple Keynote Style) */}
      <section className="relative pt-8 sm:pt-14 md:pt-20 text-center max-w-5xl mx-auto px-4">
        
        {/* Contest Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-[11px] sm:text-xs tracking-tight">{tr.contestTag}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight sm:leading-none break-words">
          {tr.heroTitle1}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent block mt-1 sm:mt-2">
            {tr.heroTitle2}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {tr.heroSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md sm:max-w-none mx-auto px-2">
          <button
            onClick={() => { sounds.playClick(); onOpenOrder(); }}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{tr.orderRobot}</span>
          </button>

          <button
            onClick={() => { sounds.playClick(); onEnterDashboard(); }}
            className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl border border-slate-700 shadow-xl transition flex items-center justify-center gap-2.5 hover:border-emerald-500/50"
          >
            <span>{tr.toDashboard}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Hero Visual Banner (High-Res 3D Showcase with Kazakh Ornament) */}
        <div className="mt-10 sm:mt-14 max-w-6xl mx-auto relative px-1 sm:px-4">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl group">
            <img
              src="/assets/Example.jpeg"
              alt="EGIN Robot squatting in greenhouse"
              className="w-full h-[320px] sm:h-[480px] md:h-[600px] object-cover object-top transition duration-700 group-hover:scale-105"
            />

            {/* Glowing Tag Overlays */}
            <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs sm:text-sm">
                  AI
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-xs sm:text-sm">
                    {tr.inGreenhouseTag}
                  </div>
                  <div className="text-slate-400 text-[11px] sm:text-xs">
                    {tr.inGreenhouseDesc}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold text-[11px] sm:text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  22 DOF Kinematics
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hidden xs:inline">
                  Palm Spray Tech
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE KEY IMPACT METRICS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/40 transition shadow-xl">
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight">
              {tr.stat1Val}
            </div>
            <div className="text-lg font-bold text-white mt-2">
              {tr.stat1Title}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {tr.stat1Desc}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden group hover:border-sky-500/40 transition shadow-xl">
            <div className="text-4xl sm:text-5xl font-black text-sky-400 font-mono tracking-tight">
              {tr.stat2Val}
            </div>
            <div className="text-lg font-bold text-white mt-2">
              {tr.stat2Title}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {tr.stat2Desc}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden group hover:border-amber-500/40 transition shadow-xl">
            <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
              {tr.stat3Val}
            </div>
            <div className="text-lg font-bold text-white mt-2">
              {tr.stat3Title}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {tr.stat3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM VS SOLUTION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* The Problem */}
          <div className="bg-slate-900/70 border border-red-950/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold font-mono uppercase mb-4">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{tr.problemBadge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {tr.problemTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                {tr.problemDesc}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-52 sm:h-60">
              <img
                src="/assets/farmer_manual_labor.jpg"
                alt="Ручной полив лейкой и тяжелый труд"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* The Solution */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono uppercase mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{tr.solutionBadge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {tr.solutionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {tr.solutionDesc}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 h-52 sm:h-60">
              <img
                src="/assets/gemini_robot_render.jpg"
                alt="Робот EGIN на поле"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. FOUR CORE INNOVATIONS */}
      <section className="max-w-6xl mx-auto px-4 space-y-10 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
            {tr.innovationsTitle}
          </h2>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            {tr.innovationsSubtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Innovation 1: 22 DOF */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-base mb-4 font-mono">
                01
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{tr.inno1Title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                {tr.inno1Desc}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 sm:h-64">
              <img
                src="/assets/I-view.jpeg"
                alt="Профиль EGIN с орнаментом Ою-өрнек"
                className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Innovation 2: Palm Irrigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-base mb-4 font-mono">
                02
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{tr.inno2Title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                {tr.inno2Desc}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 sm:h-64">
              <img
                src="/assets/T-view.jpeg"
                alt="T-pose EGIN с подачей воды из ладони"
                className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Innovation 3: Computer Vision & AR */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-base mb-4 font-mono">
                03
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{tr.inno3Title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                {tr.inno3Desc}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 sm:h-64">
              <img
                src="/assets/robot_view_clean.jpg"
                alt="AR-сканирование параметров моркови с камер робота"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Innovation 4: Follow-Me Basket */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-base mb-4 font-mono">
                04
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{tr.inno4Title}</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                {tr.inno4Desc}
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 sm:h-64">
              <img
                src="/assets/basket_card.jpg"
                alt="Follow-Me Basket моторизованная корзина"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIDEO DEMO PLAYER SECTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Video className="w-4 h-4" />
                <span>{tr.videoTitle}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {tr.videoSubtitle}
              </h3>
            </div>

            {/* Video selector pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
              <button
                onClick={() => { sounds.playClick(); setSelectedVideo('/assets/video_1.mp4'); }}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition font-medium text-center ${
                  selectedVideo === '/assets/video_1.mp4' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tr.vidTab1}
              </button>
              <button
                onClick={() => { sounds.playClick(); setSelectedVideo('/assets/video_3.mp4'); }}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition font-medium text-center ${
                  selectedVideo === '/assets/video_3.mp4' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tr.vidTab2}
              </button>
              <button
                onClick={() => { sounds.playClick(); setSelectedVideo('/assets/video_2.mp4'); }}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition font-medium text-center ${
                  selectedVideo === '/assets/video_2.mp4' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tr.vidTab3}
              </button>
              <button
                onClick={() => { sounds.playClick(); setSelectedVideo('/assets/problem_hard_labor.mp4'); }}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition font-medium text-center ${
                  selectedVideo === '/assets/problem_hard_labor.mp4' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tr.vidTab4}
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border-2 border-slate-800 bg-black aspect-video relative shadow-inner">
            <video
              key={selectedVideo}
              src={selectedVideo}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE ROI CALCULATOR */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {tr.calcTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {tr.calcSubtitle}
            </p>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-xs sm:text-sm font-semibold mb-2">
              <span className="text-slate-300">{tr.calcPlotSize}</span>
              <span className="text-emerald-400 font-mono text-base sm:text-lg">
                {calcPlotSize} {tr.calcSotka} ({calcPlotSize * 100} м²)
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={calcPlotSize}
              onChange={e => setCalcPlotSize(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
              <span>{tr.calcSliderMin}</span>
              <span>{tr.calcSliderMid}</span>
              <span>{tr.calcSliderMax}</span>
            </div>
          </div>

          {/* 3 Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-slate-400 text-xs">{tr.calcHoursSaved}</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
                +{hoursSaved}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{tr.calcHoursUnit}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-slate-400 text-xs">{tr.calcWaterSaved}</div>
              <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono mt-1">
                +{waterSavedLiters.toLocaleString('ru-RU')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{tr.calcWaterUnit}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-slate-400 text-xs">{tr.calcExtraYield}</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
                +{extraYieldKg.toLocaleString('ru-RU')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{tr.calcYieldUnit}</div>
            </div>
          </div>

          {/* Book Button */}
          <div className="text-center">
            <button
              onClick={() => { sounds.playClick(); onOpenOrder(); }}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition"
            >
              {tr.calcBookBtn}
            </button>
          </div>
        </div>
      </section>

      {/* 7. WIDGET PREVIEW SECTION (Smartphone crop preview) */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              {tr.widgetTag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {tr.widgetTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              {tr.widgetDesc}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => { sounds.playClick(); onEnterDashboard(); }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
              >
                {tr.toDashboard}
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto max-w-sm rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <img
              src="/assets/Widget_screen.png"
              alt="Egin Smartphone Widget"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
