import React, { useState } from 'react';
import { Bot, Check, X, Shield, Sparkles, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, lang = 'ru' }) => {
  const tr = translations[lang] || translations.ru;

  const [includeBasket, setIncludeBasket] = useState(true);
  const [includeSensors, setIncludeSensors] = useState(true);
  const [includeTraining, setIncludeTraining] = useState(false);
  const [robotCount, setRobotCount] = useState<number>(1);

  const [formData, setFormData] = useState({
    name: 'Абай Тлеугалыев',
    phone: '+7 (747) 829-05-80',
    email: 'abaikryt@gmail.com',
    location: 'г. Косшы, Акмолинская область',
    plotArea: '10 соток'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const basePricePerRobot = 2800000;
  const basketPrice = includeBasket ? 450000 : 0;
  const sensorsPrice = includeSensors ? 180000 : 0;
  const trainingPrice = includeTraining ? 120000 : 0;
  const totalPrice = (basePricePerRobot * robotCount) + basketPrice + sensorsPrice + trainingPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playHarvest();
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-7 text-slate-100 shadow-2xl animate-scaleUp my-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {tr.orderTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {tr.orderSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">{tr.orderSuccessMsg}</h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Рахмет, <span className="text-emerald-400 font-semibold">{formData.name}</span>! Номер заявки: <strong className="font-mono text-white">#EGIN-2026-7842</strong>.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition"
            >
              {tr.toLanding}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            {/* Robot Count */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">
                {tr.orderRobotsCount}
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 5].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => { sounds.playClick(); setRobotCount(cnt); }}
                    className={`flex-1 py-2 rounded-xl font-mono font-bold transition border ${
                      robotCount === cnt
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cnt} шт.
                  </button>
                ))}
              </div>
            </div>

            {/* Options Checkboxes */}
            <div className="space-y-2">
              <label
                onClick={() => setIncludeBasket(!includeBasket)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  includeBasket ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="text-xs text-slate-300">{tr.orderIncludeBasket}</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                  includeBasket ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                }`}>
                  {includeBasket && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </label>

              <label
                onClick={() => setIncludeSensors(!includeSensors)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  includeSensors ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="text-xs text-slate-300">{tr.orderIncludeSensors}</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                  includeSensors ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                }`}>
                  {includeSensors && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </label>

              <label
                onClick={() => setIncludeTraining(!includeTraining)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  includeTraining ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <span className="text-xs text-slate-300">{tr.orderIncludeTraining}</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                  includeTraining ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                }`}>
                  {includeTraining && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </label>
            </div>

            {/* Total Price Display */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">{tr.orderPriceEstimate}</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                {totalPrice.toLocaleString('ru-RU')} ₸
              </span>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {tr.orderNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {tr.orderPhoneLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  {tr.orderLocationLabel}
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition"
            >
              {tr.orderSubmitBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
