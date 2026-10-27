import React, { useState, useEffect } from 'react';
import { 
  Bot, Wifi, WifiOff, Send, Search, Plus, Sparkles, 
  CheckCircle2, AlertTriangle, Droplets, Sprout, ChevronDown, ChevronUp, Key, Cpu 
} from 'lucide-react';
import { INITIAL_PLANTS_DATABASE } from '../../data/plantsData';
import type { PlantInfo, ChatMessage, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { sounds } from '../../utils/soundEffects';

interface AiAgroChatProps {
  onDispatchTask?: (taskText: string) => void;
  lang?: Language;
}

const renderInlineMarkdown = (text: string): React.ReactNode[] => {
  const parts = text.split(/(<br\s*\/?>|&lt;br\s*\/?&gt;|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`)/gi);

  return parts.map((part, index) => {
    if (/^(?:<br\s*\/?>|&lt;br\s*\/?&gt;)$/i.test(part)) return <br key={index} />;
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-slate-800 px-1 py-0.5 text-emerald-200">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const parseMarkdownTableRow = (line: string): string[] =>
  line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());

const isMarkdownTableSeparator = (line: string): boolean =>
  parseMarkdownTableRow(line).every(cell => /^:?-{3,}:?$/.test(cell.replace(/\s/g, '')));

const ChatMessageContent: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        const tableLine = lines[index].trim();
        if (!isMarkdownTableSeparator(tableLine)) rows.push(parseMarkdownTableRow(tableLine));
        index += 1;
      }
      if (rows.length) {
        const [header, ...body] = rows;
        blocks.push(
          <div key={`table-${index}`} className="my-3 max-w-full overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full min-w-max border-collapse text-left text-xs">
              <thead className="bg-slate-800 text-slate-100">
                <tr>{header.map((cell, cellIndex) => <th key={cellIndex} className="border-b border-slate-700 px-3 py-2 font-semibold">{renderInlineMarkdown(cell)}</th>)}</tr>
              </thead>
              <tbody>{body.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-slate-800/40">
                  {header.map((_, cellIndex) => <td key={cellIndex} className="border-b border-slate-800 px-3 py-2 align-top text-slate-300">{renderInlineMarkdown(row[cellIndex] || '')}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const HeadingTag = heading[1].length <= 2 ? 'h3' : 'h4';
      blocks.push(<HeadingTag key={`heading-${index}`} className="mb-2 mt-3 font-semibold text-white">{renderInlineMarkdown(heading[2])}</HeadingTag>);
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, '').trim());
        index += 1;
      }
      blocks.push(<ul key={`ul-${index}`} className="my-2 list-disc space-y-1 pl-5">{items.map((item, itemIndex) => <li key={itemIndex}>{renderInlineMarkdown(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+[.)]\s+/, '').trim());
        index += 1;
      }
      blocks.push(<ol key={`ol-${index}`} className="my-2 list-decimal space-y-1 pl-5">{items.map((item, itemIndex) => <li key={itemIndex}>{renderInlineMarkdown(item)}</li>)}</ol>);
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index].trim() && !lines[index].trim().startsWith('|') && !/^(#{1,6})\s|^[-*]\s+|^\d+[.)]\s+/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`p-${index}`} className="my-1">{paragraph.map((part, partIndex) => <React.Fragment key={partIndex}>{partIndex > 0 && <br />}{renderInlineMarkdown(part)}</React.Fragment>)}</p>);
  }

  return <div className="space-y-1">{blocks}</div>;
};

export const AiAgroChat: React.FC<AiAgroChatProps> = ({ onDispatchTask, lang = 'ru' }) => {
  const tr = translations[lang] || translations.ru;
  const [mode, setMode] = useState<'online' | 'offline'>('online');

  // Plant Database with persistence
  const [plants, setPlants] = useState<PlantInfo[]>(() => {
    try {
      const saved = localStorage.getItem('egin_plant_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PLANTS_DATABASE;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedPlantId, setExpandedPlantId] = useState<string | null>('plant_carrot');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newPlant, setNewPlant] = useState<Partial<PlantInfo>>({
    nameRu: '',
    nameKz: '',
    nameEn: '',
    category: 'vegetable',
    idealPh: '6.0 – 7.0',
    moisturePercent: '40% – 50%',
    wateringFrequency: 'Каждые 2 дня',
    waterPerDayLiters: 1.5,
    npkRatio: '1 : 1 : 2',
    growthDays: 75,
    icon: 'seedling',
    akmolaRegionTip: 'Адаптировано для климата Акмолинской области.'
  });

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm1',
      sender: 'assistant',
      text: tr.chatWelcomeMsg,
      timestamp: '09:41'
    }
  ]);

  // Update initial message when language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'm1') {
        return [{
          id: 'm1',
          sender: 'assistant',
          text: tr.chatWelcomeMsg,
          timestamp: '09:41'
        }];
      }
      return prev;
    });
  }, [lang, tr.chatWelcomeMsg]);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    return import.meta.env.VITE_GROQ_API_KEY || localStorage.getItem('egin_groq_api_key') || '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('egin_plant_db', JSON.stringify(plants));
    } catch (e) {
      console.error(e);
    }
  }, [plants]);

  // Clean quick prompts without emojis
  const quickPromptsByLang: Record<Language, string[]> = {
    ru: [
      'Почему желтеют листья у огурцов в теплице?',
      'Норма точечного ладонного полива моркови в Акмолинской области?',
      'Как распознать колорадского жука на ранней стадии?',
      'Оптимальный pH и уровень азота для картофеля?',
      'Отправить EGIN 01 на полив секции А-12'
    ],
    kz: [
      'Жылыжайда қияр жапырақтары неге сарғаяды?',
      'Ақмола облысында сәбізді алақаннан суару нормасы қандай?',
      'Колорадо қоңызын ерте кезеңде қалай анықтауға болады?',
      'Картоп үшін оңтайлы pH және азот деңгейі?',
      'EGIN 01 роботын А-12 секциясын суаруға жіберу'
    ],
    en: [
      'Why do cucumber leaves turn yellow in the greenhouse?',
      'Targeted palm irrigation quota for carrots in Akmola region?',
      'How to detect Colorado potato beetle at stage 1?',
      'Optimal soil pH and nitrogen balance for potatoes?',
      'Dispatch EGIN 01 to irrigate section A-12'
    ]
  };

  const quickPrompts = quickPromptsByLang[lang] || quickPromptsByLang.ru;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    sounds.playClick();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsAiThinking(true);

    // Try Groq API if key is present
    const apiKey = groqApiKey.trim();
    if (apiKey) {
      try {
        const systemPrompt = `You are the on-board AI Agronomist of the EGIN humanoid agricultural robotics complex (AQMOLA POWER 2026 competition, developed by Abay/JanaBales, Akmola region, Kazakhstan).
Language to reply in: ${lang === 'kz' ? 'Kazakh' : lang === 'en' ? 'English' : 'Russian'}.
You are an expert in agronomy, greenhouse management, crop diseases, soil pH, N-P-K fertilizers, and robotics telemetry.
Tone: Professional, helpful, practical, with specific agricultural metrics and advice adapted to Northern Kazakhstan (Akmola region) climate. Keep answer concise and structured.`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        };
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers,
            signal: controller.signal,
            body: JSON.stringify({
              model: 'openai/gpt-oss-20b',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text }
              ]
            })
          });

          if (response.ok) {
            const data = await response.json();
            const aiReply = data?.choices?.[0]?.message?.content;
            if (aiReply) {
              const botMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: 'assistant',
                text: aiReply,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              setMessages(prev => [...prev, botMsg]);
              setIsAiThinking(false);
              sounds.playClick();
              return;
            }
          } else {
            console.warn(`Groq API returned ${response.status}; using local expert engine.`);
          }
        } finally {
          window.clearTimeout(timeoutId);
        }
      } catch (err) {
        console.warn('Groq API call failed, falling back to local expert engine:', err);
      }
    }

    // Fallback: Enhanced Local Expert Agronomy Engine
    setTimeout(() => {
      let replyText = '';
      let suggestedAction: any = null;
      const lower = text.toLowerCase();

      const isGreeting = /^(привет|здравствуй|салем|сәлем|hello|hi|hey|добрый\s*(день|вечер|утро))/i.test(lower.trim());
      const isDispatch = /(?:отправить|отправь|направить|запусти|запустить|dispatch|send|жібер)/i.test(lower) && /(?:робот|egin|robot)/i.test(lower);

      if (isGreeting) {
        if (lang === 'kz') {
          replyText = `Сәлеметсіз бе! Мен — EGIN кешенінің борттық ЖИ-Агрономымын. Далалық роботтардың сенсорлары қалыпты режимде (топырақ ылғалдылығы 38-42%, pH 6.6).\n\nСізге қандай дақыл бойынша ақпарат қажет? Мысалы: сәбізді суару нормасы, қиярдың жапырақтары неге сарғаяды, немесе роботты А-12 алқабына жіберу?`;
        } else if (lang === 'en') {
          replyText = `Hello! I am the on-board AI Agronomist for the EGIN robotic system. Field sensors are operating normally (soil moisture 38-42%, pH 6.6).\n\nHow can I help you today? You can ask about irrigation quotas, tomato or carrot diseases, pest management, or dispatching robots to a field section.`;
        } else {
          replyText = `Здравствуйте! Я — бортовой ИИ-Агроном роботизированного комплекса EGIN. Сенсоры на полях показывают норму (влажность 38–42%, pH 6.6, RTK-связь ±1.2 см).\n\nЧем могу помочь по участку? Вы можете спросить о нормах полива моркови или томатов, лечении болезней листьев, или отправить робота на делянку.`;
        }
      } else if (isDispatch) {
        if (lang === 'kz') {
          replyText = `Пәрмен қабылданды. «А-12 секциясын точечный суару (Сәбіз)» тапсырмасы EGIN 01 роботының борттық жүйесіне жіберілді. Су багы: 92%, батарея: 87%. Есептік орындау уақыты: 14 минут.`;
        } else if (lang === 'en') {
          replyText = `Command confirmed. Task "Section A-12 Precision Micro-irrigation (Carrot)" dispatched to EGIN 01 on-board computer. Water tank: 92%, battery: 87%. Estimated duration: 14 minutes.`;
        } else {
          replyText = `Команда принята. Задача «Точечный полив секции А-12 (Морковь)» передана бортовому компьютеру EGIN 01. Уровень воды: 92%, заряд: 87%. Расчетное время работы: 14 минут.`;
        }
        if (onDispatchTask) onDispatchTask(lang === 'kz' ? 'А-12 секциясын суару іске қосылды' : lang === 'en' ? 'Section A-12 irrigation dispatched' : 'Полив секции А-12 запущен через ИИ-Агроном');
      } else {
        // Find relevant plant in codex
        const matchedPlant = plants.find(p => {
          const nRu = p.nameRu.toLowerCase();
          const nKz = p.nameKz.toLowerCase();
          const nEn = p.nameEn.toLowerCase();
          return lower.includes(nRu.split(' ')[0]) || 
                 lower.includes(nKz.split(' ')[0]) || 
                 lower.includes(nEn.split(' ')[0]) ||
                 (lower.includes('огур') && p.id === 'plant_cucumber') ||
                 (lower.includes('қияр') && p.id === 'plant_cucumber') ||
                 (lower.includes('томат') && p.id === 'plant_tomato') ||
                 (lower.includes('помидор') && p.id === 'plant_tomato') ||
                 (lower.includes('қызанақ') && p.id === 'plant_tomato') ||
                 (lower.includes('сәбіз') && p.id === 'plant_carrot') ||
                 (lower.includes('морков') && p.id === 'plant_carrot') ||
                 (lower.includes('карто') && p.id === 'plant_potato') ||
                 (lower.includes('бидай') && p.id === 'plant_wheat') ||
                 (lower.includes('пшениц') && p.id === 'plant_wheat') ||
                 (lower.includes('құлпынай') && p.id === 'plant_strawberry') ||
                 (lower.includes('клубник') && p.id === 'plant_strawberry') ||
                 (lower.includes('жүгері') && p.id === 'plant_corn') ||
                 (lower.includes('кукуруз') && p.id === 'plant_corn') ||
                 (lower.includes('қырыққабат') && p.id === 'plant_cabbage') ||
                 (lower.includes('капуст') && p.id === 'plant_cabbage');
        });

        // Find relevant pest/disease match
        let matchedPest: any = null;
        if (matchedPlant) {
          matchedPest = matchedPlant.pestsAndDiseases.find(pest => 
            lower.includes(pest.name.toLowerCase().split(' ')[0]) ||
            lower.includes('болезн') || lower.includes('вредител') || lower.includes('желт') || 
            lower.includes('ауру') || lower.includes('зиянкес') || lower.includes('сарға') ||
            lower.includes('жук') || lower.includes('клещ') || lower.includes('гниль')
          ) || matchedPlant.pestsAndDiseases[0];
        }

        if (matchedPlant) {
          const plantName = lang === 'kz' ? matchedPlant.nameKz : lang === 'en' ? matchedPlant.nameEn : matchedPlant.nameRu;
          
          if (lang === 'kz') {
            replyText = `EGIN Агрономиялық талдауы: ${plantName}\n\n` +
              `• Ылғалдылық және суару нормасы: ${matchedPlant.moisturePercent}, ${matchedPlant.wateringFrequency}. Тәуліктік ладондық суару көлемі: ${matchedPlant.waterPerDayLiters} л/түп.\n` +
              `• Оңтайлы топырақ pH: ${matchedPlant.idealPh}.\n` +
              `• Тыңайтқыш құрамы (N-P-K): ${matchedPlant.npkRatio}.\n` +
              `• Ақмола облысы бойынша ұсыныс: ${matchedPlant.akmolaRegionTip}`;
            if (matchedPest) {
              replyText += `\n\nФитосанитарлық бақылау (${matchedPest.name}):\nБелгілері: ${matchedPest.symptoms}\nEGIN шешімі: ${matchedPest.remedy}`;
            }
          } else if (lang === 'en') {
            replyText = `EGIN Agronomy Telemetry Protocol: ${plantName}\n\n` +
              `• Target Soil Moisture: ${matchedPlant.moisturePercent}, ${matchedPlant.wateringFrequency}. Palm micro-irrigation rate: ${matchedPlant.waterPerDayLiters} L/day.\n` +
              `• Optimal Soil pH: ${matchedPlant.idealPh}.\n` +
              `• Fertilizer Balance (N-P-K): ${matchedPlant.npkRatio}.\n` +
              `• Akmola Regional Agronomy Note: ${matchedPlant.akmolaRegionTip}`;
            if (matchedPest) {
              replyText += `\n\nPhytosanitary Defense (${matchedPest.name}):\nSymptoms: ${matchedPest.symptoms}\nEGIN Protocol: ${matchedPest.remedy}`;
            }
          } else {
            replyText = `Агрономический протокол EGIN: ${plantName}\n\n` +
              `• Целевая влажность почвы: ${matchedPlant.moisturePercent}, режим полива: ${matchedPlant.wateringFrequency}. Норма ладонной подачи: ${matchedPlant.waterPerDayLiters} л/сутки.\n` +
              `• Оптимальный pH почвы: ${matchedPlant.idealPh}.\n` +
              `• Баланс элементов (N-P-K): ${matchedPlant.npkRatio}.\n` +
              `• Рекомендация для Акмолинской области: ${matchedPlant.akmolaRegionTip}`;
            if (matchedPest) {
              replyText += `\n\nФитосанитарная диагностика (${matchedPest.name}):\nСимптомы: ${matchedPest.symptoms}\nПротокол робота: ${matchedPest.remedy}`;
            }
          }

          suggestedAction = {
            type: 'view_plant',
            label: lang === 'kz' ? `${plantName} толық картасын ашу` : lang === 'en' ? `Open full datasheet for ${plantName}` : `Открыть технологическую карту: ${plantName}`
          };
        } else {
          // General intelligent agronomy answer tailored to query
          if (lang === 'kz') {
            replyText = `Агрономиялық талдау («${text}»):\n\n` +
              `1. Далалық сенсорлар көрсеткіші: Топырақ ылғалдылығы 38-42% аралығында, pH 6.6 (бейтарап), RTK навигациясы белсенді.\n` +
              `2. Сараптама: Ақмола облысының құрғақ далалық агроклиматында өсімдіктердің жапырақ бетінен булануын азайту үшін түнгі және таңғы ладондық тамшылатып суару тиімділігі 40%-ға жоғары.\n` +
              `3. Ұсыныс: Роботтардың мультиспектрлік NDVI камерасы арқылы стресс ошақтарын ерте анықтау режимін қосуға болады.`;
          } else if (lang === 'en') {
            replyText = `Agronomic Assessment on "${text}":\n\n` +
              `1. Active Field Telemetry: Root zone soil moisture 38-42%, pH 6.6 (optimal), RTK positioning ±1.2 cm.\n` +
              `2. Agronomic Diagnosis: In the steppe microclimate of Akmola region, targeted sub-canopy palm micro-irrigation minimizes evaporation and prevents leaf burn.\n` +
              `3. Operational Action: You can dispatch EGIN robots for high-resolution multispectral NDVI scanning to map crop stress zones before visible symptoms emerge.`;
          } else {
            replyText = `Агрономический анализ по запросу «${text}»:\n\n` +
              `1. Показания полевых датчиков: Влажность прикорневой зоны 38–42%, pH 6.6 (оптимально), RTK-позиционирование стабильно (±1.2 см).\n` +
              `2. Агрономический анализ: Для сухостепной зоны Акмолинской области критичен точечный подкоренной полив из ладонного дозатора EGIN — он исключает испарение влаги и не размывает структуру почвы.\n` +
              `3. Рекомендация комплекса: При необходимости роботизированный манипулятор проведет локальный N-P-K спектральный экспресс-тест участка за 90 секунд.`;
          }
        }
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction
      };

      setMessages(prev => [...prev, botMsg]);
      setIsAiThinking(false);
      sounds.playClick();
    }, 850);
  };

  const handleAddPlantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlant.nameRu) return;

    const created: PlantInfo = {
      id: `custom_${Date.now()}`,
      nameRu: newPlant.nameRu || 'Новая культура',
      nameKz: newPlant.nameKz || newPlant.nameRu || 'Жаңа дақыл',
      nameEn: newPlant.nameEn || newPlant.nameRu || 'New Crop',
      category: (newPlant.category as any) || 'vegetable',
      idealPh: newPlant.idealPh || '6.0 – 7.0',
      moisturePercent: newPlant.moisturePercent || '40% – 50%',
      wateringFrequency: newPlant.wateringFrequency || 'Каждые 2 дня',
      waterPerDayLiters: Number(newPlant.waterPerDayLiters) || 1.5,
      npkRatio: newPlant.npkRatio || '1 : 1 : 2',
      growthDays: Number(newPlant.growthDays) || 80,
      icon: 'sprout',
      akmolaRegionTip: newPlant.akmolaRegionTip || 'Адаптировано для местного климата.',
      stages: [
        { name: 'Посев', durationDays: 14, desc: 'Первичный уход и полив.' },
        { name: 'Вегетация', durationDays: 40, desc: 'Активный рост и подкормка.' },
        { name: 'Урожай', durationDays: 20, desc: 'Сбор роботом EGIN.' }
      ],
      pestsAndDiseases: [
        { name: 'Профилактика', symptoms: 'Периодический осмотр роботом.', remedy: 'Био-защита.' }
      ],
      isCustom: true
    };

    setPlants(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setExpandedPlantId(created.id);
    sounds.playPlant();
  };

  const filteredPlants = plants.filter(p => {
    const matchesSearch =
      p.nameRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl text-slate-100">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {tr.chatPageTitle}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {tr.chatPageSubtitle}
          </p>
        </div>

        {/* Dual Mode Toggle Button */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => { sounds.playClick(); setMode('online'); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${mode === 'online' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-400 hover:text-white'}`}
          >
            <Wifi className="w-4 h-4 text-emerald-300" />
            <span>{tr.chatOnlineTab}</span>
          </button>
          <button
            onClick={() => { sounds.playClick(); setMode('offline'); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${mode === 'offline' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'text-slate-400 hover:text-white'}`}
          >
            <WifiOff className="w-4 h-4 text-sky-300" />
            <span>{tr.chatOfflineTab}</span>
          </button>
        </div>
      </div>

      {/* ONLINE CHAT MODE */}
      {mode === 'online' && (
        <div className="flex flex-col h-[650px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          {/* Chat Header Status */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-semibold text-white">EGIN AI Agronomist v2.4</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-mono">{tr.chatConnectedStatus}</span>
              {groqApiKey && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/30 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Groq API
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setKeyInput(groqApiKey);
                  setShowKeyModal(true);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition ${
                  groqApiKey 
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 hover:bg-slate-700' 
                    : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30'
                }`}
                title="Настроить Groq API ключ для работы настоящей нейросети"
              >
                <Key className="w-3 h-3" />
                <span>{groqApiKey ? 'API подключен' : '+ Добавить Groq API'}</span>
              </button>
              <div className="text-slate-400 hidden sm:block">
                {tr.chatLocationLabel}
              </div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-900/30' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'}`}>
                  {msg.sender === 'assistant' ? <ChatMessageContent text={msg.text} /> : <div className="whitespace-pre-line">{msg.text}</div>}

                  {msg.suggestedAction && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          if (msg.suggestedAction?.type === 'view_plant') {
                            setMode('offline');
                          } else {
                            handleSendMessage(msg.suggestedAction?.label);
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{msg.suggestedAction.label}</span>
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex gap-3 items-center text-slate-400 text-xs italic">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>ИИ-Агроном анализирует данные с камер робота и базу знаний...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Pills (Clean, no emojis) */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
            <span className="text-slate-400 text-[11px] font-medium shrink-0">{tr.quickPromptTitle}</span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/60 transition text-xs shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              placeholder={tr.chatPlaceholder}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{tr.chatSendBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* OFFLINE DATABASE MODE */}
      {mode === 'offline' && (
        <div className="space-y-6">
          {/* Offline Notice Badge & Controls */}
          <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-sky-300">
              <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <span className="font-bold">Автономная локальная база данных (Offline Codex)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Работает без интернета. Все агрономические карты культур хранятся в памяти устройства.
                </p>
              </div>
            </div>

            <button
              onClick={() => { sounds.playClick(); setIsAddModalOpen(true); }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition shadow-md shadow-emerald-900/30 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить культуру в БД</span>
            </button>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={tr.codexSearchPlaceholder}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'all', label: tr.catAll },
                { id: 'vegetable', label: tr.catVegetable },
                { id: 'grain', label: tr.catGrain },
                { id: 'berry', label: tr.catBerry }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { sounds.playClick(); setSelectedCategory(cat.id); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${selectedCategory === cat.id ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlants.map(plant => {
              const isExpanded = expandedPlantId === plant.id;

              return (
                <div
                  key={plant.id}
                  className={`bg-slate-950 border rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'border-emerald-500/50 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/20' : 'border-slate-800 hover:border-slate-700'}`}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => {
                      sounds.playClick();
                      setExpandedPlantId(isExpanded ? null : plant.id);
                    }}
                    className="p-4 cursor-pointer flex items-center justify-between gap-3 bg-slate-900/70 hover:bg-slate-900 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-sm border border-slate-700">
                        <Sprout className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-base flex items-center gap-2">
                          {plant.nameRu}
                          {plant.isCustom && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Пользовательская
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-emerald-400 font-medium">
                          {plant.nameKz} • <span className="text-slate-400">{plant.nameEn}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {plant.growthDays} дней
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 border-t border-b border-slate-800 text-xs">
                    <div className="text-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">{tr.codexIdealPh}</div>
                      <div className="font-mono font-bold text-sky-400 mt-0.5">{plant.idealPh}</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">{tr.codexSoilMoisture}</div>
                      <div className="font-mono font-bold text-emerald-400 mt-0.5">{plant.moisturePercent}</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">{tr.codexWaterRate}</div>
                      <div className="font-mono font-bold text-amber-400 mt-0.5">{plant.waterPerDayLiters} л/день</div>
                    </div>
                  </div>

                  {/* Expanded Detailed Agronomy Card */}
                  {isExpanded && (
                    <div className="p-4 space-y-4 text-xs text-slate-300 bg-slate-950/90 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                            <Droplets className="w-3.5 h-3.5 text-sky-400" />
                            <span>{tr.codexSchedule}:</span>
                          </div>
                          <div className="text-slate-200">{plant.wateringFrequency}</div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                          <div className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{tr.codexNpk}:</span>
                          </div>
                          <div className="text-slate-200">{plant.npkRatio}</div>
                        </div>
                      </div>

                      {/* Growth Stages */}
                      <div>
                        <div className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Стадии вегетации и задачи EGIN:</span>
                        </div>
                        <div className="space-y-2">
                          {plant.stages.map((stage, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-2">
                              <div>
                                <span className="font-semibold text-emerald-300">{stage.name}</span>
                                <p className="text-slate-400 text-[11px] mt-0.5">{stage.desc}</p>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                                {stage.durationDays} дн.
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pests & Diseases */}
                      {plant.pestsAndDiseases.length > 0 && (
                        <div>
                          <div className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span>Фитосанитарный контроль роботом:</span>
                          </div>
                          <div className="space-y-2">
                            {plant.pestsAndDiseases.map((pest, idx) => (
                              <div key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40">
                                <div className="font-semibold text-amber-300">{pest.name}</div>
                                <div className="text-[11px] text-slate-400 mt-1">
                                  <strong className="text-slate-300">Симптом:</strong> {pest.symptoms}
                                </div>
                                <div className="text-[11px] text-emerald-400 mt-1">
                                  <strong className="text-emerald-300">Действие EGIN:</strong> {pest.remedy}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regional Note */}
                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-200">
                        <strong>Агроклимат Акмолинской области:</strong> {plant.akmolaRegionTip}
                      </div>

                      {/* Action: Send to Online Chat */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            sounds.playClick();
                            setMode('online');
                            handleSendMessage(`Расскажи подробнее про агротехнику культуры ${plant.nameRu} для робота Egin`);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Обсудить с ИИ-Агрономом</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Plant to Local DB */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Добавить культуру в оффлайн-базу
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPlantSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Название (Русский)*</label>
                <input
                  type="text"
                  required
                  value={newPlant.nameRu}
                  onChange={e => setNewPlant({ ...newPlant, nameRu: e.target.value })}
                  placeholder="Например: Болгарский перец"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Атауы (Қазақша)</label>
                  <input
                    type="text"
                    value={newPlant.nameKz}
                    onChange={e => setNewPlant({ ...newPlant, nameKz: e.target.value })}
                    placeholder="Мысалы: Тәтті бұрыш"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Name (English)</label>
                  <input
                    type="text"
                    value={newPlant.nameEn}
                    onChange={e => setNewPlant({ ...newPlant, nameEn: e.target.value })}
                    placeholder="e.g. Bell Pepper"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Идеальный pH</label>
                  <input
                    type="text"
                    value={newPlant.idealPh}
                    onChange={e => setNewPlant({ ...newPlant, idealPh: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Влажность почвы</label>
                  <input
                    type="text"
                    value={newPlant.moisturePercent}
                    onChange={e => setNewPlant({ ...newPlant, moisturePercent: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Дней до урожая</label>
                  <input
                    type="number"
                    value={newPlant.growthDays}
                    onChange={e => setNewPlant({ ...newPlant, growthDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Совет для условий Акмолинской области</label>
                <textarea
                  rows={2}
                  value={newPlant.akmolaRegionTip}
                  onChange={e => setNewPlant({ ...newPlant, akmolaRegionTip: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20"
                >
                  Сохранить в базу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Key Settings Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Подключение Groq API</h3>
                <p className="text-xs text-slate-400">Прямое подключение к моделям Groq</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Вставьте API-ключ Groq. После этого ИИ-Агроном начнёт генерировать ответы в реальном времени.
            </p>

            <div className="mb-4">
              <label className="text-xs text-slate-400 block mb-1.5 font-mono">Groq API Key (gsk_...):</label>
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="gsk_..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                Ключ сохраняется только локально в браузере (localStorage).
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setGroqApiKey('');
                  setKeyInput('');
                  localStorage.removeItem('egin_groq_api_key');
                  setShowKeyModal(false);
                  sounds.playClick();
                }}
                className="text-xs text-red-400 hover:text-red-300 underline"
              >
                Сбросить ключ
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl text-slate-300"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGroqApiKey(keyInput.trim());
                    localStorage.setItem('egin_groq_api_key', keyInput.trim());
                    setShowKeyModal(false);
                    sounds.playPlant();
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
