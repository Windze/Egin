import React, { useState } from 'react';
import { 
  Eye, Droplets, Sprout, Crosshair, Radio, Scan,
  Sparkles, CheckCircle2, AlertTriangle, Layers, Video, Compass, Zap
} from 'lucide-react';
import type { FieldProfile, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { sounds } from '../../utils/soundEffects';

interface FieldsPageProps {
  fields: FieldProfile[];
  lang?: Language;
}

export const FieldsPage: React.FC<FieldsPageProps> = ({ fields, lang = 'ru' }) => {
  const tr = translations[lang] || translations.ru;

  const [selectedFieldId, setSelectedFieldId] = useState<string>('field-a12');
  const [filterMode, setFilterMode] = useState<'rgb' | 'ndvi' | 'thermal' | 'lidar'>('rgb');
  const [cameraSource, setCameraSource] = useState<'field_photo' | 'robot_pov'>('field_photo');
  const [activeCropTarget, setActiveCropTarget] = useState<string>('carrot');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const targets = [
    {
      id: 'cabbage',
      nameRu: 'Секция А-1: Капуста (Слава 1305)',
      nameKz: 'А-1 секциясы: Қырыққабат (Слава 1305)',
      nameEn: 'Section A-1: Cabbage (Slava 1305)',
      x: '14%',
      y: '62%',
      moisture: 62,
      ndvi: 0.95,
      nitrogen: '95 ppm',
      ph: 6.8,
      taskRu: 'Контроль кочанов',
      taskKz: 'Қауданды бақылау',
      taskEn: 'Head inspection',
      statusRu: 'Норма',
      statusKz: 'Қалыпты',
      statusEn: 'Normal'
    },
    {
      id: 'carrot',
      nameRu: 'Секция А-12: Морковь (Нантская 4)',
      nameKz: 'А-12 секциясы: Сәбіз (Нант 4)',
      nameEn: 'Section A-12: Carrot (Nantes 4)',
      x: '32%',
      y: '58%',
      moisture: 38,
      ndvi: 0.94,
      nitrogen: '85 ppm',
      ph: 6.4,
      taskRu: 'Точечный полив',
      taskKz: 'Нүктелік суару',
      taskEn: 'Precision Irrigation',
      statusRu: 'Норма',
      statusKz: 'Қалыпты',
      statusEn: 'Normal'
    },
    {
      id: 'potato',
      nameRu: 'Секция Б-2: Картофель цветущий',
      nameKz: 'Б-2 секциясы: Гүлдеген картоп',
      nameEn: 'Section B-2: Flowering Potato',
      x: '52%',
      y: '54%',
      moisture: 45,
      ndvi: 0.92,
      nitrogen: '90 ppm',
      ph: 6.2,
      taskRu: 'Фитомониторинг ботвы',
      taskKz: 'Жапырақ мониторингі',
      taskEn: 'Foliage monitoring',
      statusRu: 'Здоров',
      statusKz: 'Сау',
      statusEn: 'Healthy'
    },
    {
      id: 'pumpkin',
      nameRu: 'Секция В-3: Тыква созревающая',
      nameKz: 'В-3 секциясы: Пісіп келе жатқан асқабақ',
      nameEn: 'Section C-3: Ripening Pumpkin',
      x: '75%',
      y: '68%',
      moisture: 52,
      ndvi: 0.89,
      nitrogen: '75 ppm',
      ph: 6.7,
      taskRu: 'Оценка сахаристости',
      taskKz: 'Қанттылықты бағалау',
      taskEn: 'Sugar estimation',
      statusRu: 'Норма',
      statusKz: 'Қалыпты',
      statusEn: 'Normal'
    },
    {
      id: 'corn',
      nameRu: 'Секция Г-4: Сахарная кукуруза',
      nameKz: 'Г-4 секциясы: Сахарлы жүгері',
      nameEn: 'Section D-4: Sweet Corn (Bonus F1)',
      x: '88%',
      y: '32%',
      moisture: 35,
      ndvi: 0.86,
      nitrogen: '60 ppm',
      ph: 6.9,
      taskRu: 'Внесение азота',
      taskKz: 'Азот енгізу',
      taskEn: 'Nitrogen Application',
      statusRu: 'Дефицит N',
      statusKz: 'N тапшылығы',
      statusEn: 'N Deficit'
    }
  ];

  const currentTargetObj = targets.find(t => t.id === activeCropTarget) || targets[0];

  const handleWaterCrop = () => {
    sounds.playWater();
    setActionFeedback(
      lang === 'kz' 
        ? 'Алақаннан 150 мл микросуару жүргізілді' 
        : lang === 'en' 
        ? '150 ml palm micro-irrigation applied' 
        : 'Ладонный микрополив 150 мл выполнен'
    );
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleScanCrop = () => {
    sounds.playHarvest();
    setActionFeedback(
      lang === 'kz'
        ? 'NDVI мен N-P-K спектрлік талдауы аяқталды'
        : lang === 'en'
        ? 'NDVI & N-P-K spectral scan complete'
        : 'Спектральный анализ NDVI и N-P-K завершен'
    );
    setTimeout(() => setActionFeedback(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {tr.fieldControlTitle}
            </h1>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
              {tr.activeUnitsLabel}: {fields.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {tr.fieldSubtitle}
          </p>
        </div>

        {/* Camera Source Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs w-full sm:w-auto">
          <button
            onClick={() => { sounds.playClick(); setCameraSource('field_photo'); }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${cameraSource === 'field_photo' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tr.camSourceField}</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setCameraSource('robot_pov'); }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${cameraSource === 'robot_pov' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>{tr.camSourcePov}</span>
          </button>
        </div>
      </div>

      {/* Interactive AR Scanner HUD */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl">
        <div className="relative h-[420px] sm:h-[500px] md:h-[580px] w-full overflow-hidden select-none bg-black">
          
          {/* Active Camera Feed */}
          <img
            src={cameraSource === 'robot_pov' ? '/assets/robot_view_clean.jpg' : '/assets/ar_field_crops.jpg'}
            alt="AR Field Feed"
            className={`w-full h-full object-cover transition-all duration-700 ${
              filterMode === 'thermal' ? 'filter hue-rotate-180 contrast-125' : ''
            } ${filterMode === 'ndvi' ? 'filter saturate-200 hue-rotate-90' : ''}`}
          />

          {/* Radar Scanner Line */}
          <div className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scanLine pointer-events-none"></div>

          {/* Thermal / NDVI / LiDAR Grids */}
          {filterMode === 'lidar' && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.3)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
          )}

          {/* Top Telemetry HUD Bar */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-wrap items-center justify-between gap-2 text-xs pointer-events-none z-10">
            <div className="bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-mono text-emerald-300 shadow-xl flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-[11px] sm:text-xs">{tr.arVisionOnline}</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-300 text-[11px] hidden sm:inline">{tr.arFpsLabel}</span>
            </div>

            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-mono text-slate-300 shadow-xl flex items-center gap-2.5 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-sky-400 hidden sm:block" />
              <span>51.0264° N, 71.4093° E</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-emerald-400 font-bold hidden sm:inline">{tr.arAltitudeLabel}</span>
            </div>
          </div>

          {/* Interactive Bounding Box Reticles on the Crops */}
          {targets.map(tgt => {
            const isSelected = activeCropTarget === tgt.id;
            const title = lang === 'kz' ? tgt.nameKz : lang === 'en' ? tgt.nameEn : tgt.nameRu;

            return (
              <div
                key={tgt.id}
                style={{ left: tgt.x, top: tgt.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                {/* Crosshair Button */}
                <button
                  onClick={() => { sounds.playClick(); setActiveCropTarget(tgt.id); }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-emerald-500 text-slate-950 scale-125 shadow-[0_0_20px_#10b981] ring-2 ring-white/50' 
                      : 'bg-slate-950/80 text-emerald-400 border border-emerald-500/60 hover:scale-110 hover:border-emerald-400'
                  }`}
                  title={title}
                >
                  <Crosshair className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'animate-spin' : ''}`} />
                </button>

                {/* Reticle Info Popover */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-12 w-48 sm:w-56 bg-slate-950/95 backdrop-blur-md border rounded-xl p-2.5 sm:p-3 text-[11px] shadow-2xl transition-all ${
                    isSelected 
                      ? 'border-emerald-500 ring-1 ring-emerald-500/30 opacity-100 scale-100' 
                      : 'border-slate-800 opacity-0 group-hover:opacity-100 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="font-bold text-white tracking-tight text-xs">{title}</div>
                  <div className="grid grid-cols-2 gap-1 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px]">
                    <span className="text-slate-400">{tr.fieldMoisture}:</span>
                    <span className="text-emerald-400 text-right font-bold">{tgt.moisture}%</span>
                    <span className="text-slate-400">NDVI:</span>
                    <span className="text-sky-400 text-right font-bold">{tgt.ndvi}</span>
                    <span className="text-slate-400">{tr.fieldNitrogen}:</span>
                    <span className="text-amber-400 text-right font-bold">{tgt.nitrogen}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Action Feedback Toast */}
          {actionFeedback && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-emerald-950/95 border border-emerald-500 text-emerald-300 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Bottom Interactive HUD Bar (Mode Switcher + Direct Action Controls) */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col gap-2.5 z-10">
            
            {/* Direct Crop Actions Pill for Active Target */}
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2 sm:p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-emerald-400 font-bold uppercase text-[11px]">
                  {lang === 'kz' ? currentTargetObj.nameKz : lang === 'en' ? currentTargetObj.nameEn : currentTargetObj.nameRu}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleWaterCrop}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow transition"
                >
                  <Droplets className="w-3.5 h-3.5 text-sky-200" />
                  <span>{tr.arDirectWaterBtn}</span>
                </button>
                <button
                  onClick={handleScanCrop}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Scan className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{tr.arDirectScanBtn}</span>
                </button>
              </div>
            </div>

            {/* Filter Modes Row */}
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">{tr.simOptics}:</span>
                {[
                  { id: 'rgb', label: tr.arFilterRgb },
                  { id: 'ndvi', label: tr.arFilterNdvi },
                  { id: 'thermal', label: tr.arFilterThermal },
                  { id: 'lidar', label: tr.arFilterLidar }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => { sounds.playClick(); setFilterMode(f.id as any); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      filterMode === f.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>RTK: <strong className="text-sky-400 font-bold">±1.2 см</strong></span>
                <span>Latency: <strong className="text-emerald-400 font-bold">12 ms</strong></span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Field Telemetry Cards (Matching RUS_Fields_page.jpeg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div
            key={field.id}
            onClick={() => { sounds.playClick(); setSelectedFieldId(field.id); }}
            className={`cursor-pointer bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all duration-200 ${
              selectedFieldId === field.id ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs text-slate-400 font-mono">{field.sectionCode}</div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">{field.name}</h3>
                <div className="text-xs text-emerald-400 mt-1">
                  {tr.fieldCrop}: {lang === 'kz' ? field.cropKz : field.crop}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800">
                {field.areaHa} Га
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 my-4 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">{tr.fieldMoisture}</span>
                <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">{field.soilMoisture}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">{tr.fieldPh}</span>
                <span className="text-sm font-bold font-mono text-sky-400 mt-0.5 block">{field.ph}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">{tr.fieldNitrogen}</span>
                <span className="text-sm font-bold font-mono text-amber-400 mt-0.5 block">{field.nitrogenPpm} ppm</span>
              </div>
            </div>

            {/* Additional info matching RUS_Fields_page.jpeg */}
            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">{tr.fieldIrrigationSchedule}:</span>
                <span className="font-medium text-emerald-400">{field.nextWatering}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{tr.fieldRouteProgress}:</span>
                <span className="font-mono text-white">{field.routeProgress}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${field.routeProgress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
