import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";
import { pathToFileURL } from "node:url";

const workspaceDir = "C:\\Users\\Абай\\Downloads\\Egin\\egin-web";
const buildDir = path.join(workspaceDir, ".codex-build", "Egin");
const assetDir = path.join(buildDir, "assets");
const finalPath = path.join(workspaceDir, "artifacts", "EGIN_pitch_2026_v3.pptx");
const renderDir = path.join(buildDir, "rendered");
const W = 1280, H = 720;
const C = {
  bg: "#0B1213", bg2: "#111C1A", green: "#91D59D", green2: "#4EA96B",
  cream: "#F2F1E9", gray: "#A9B6AE", muted: "#708078", gold: "#D9B55F",
  line: "#2B3934", white: "#FFFFFF"
};
const FONT = "Arial";
const deck = Presentation.create({ slideSize: { width: W, height: H } });
const imageBytes = {};
for (const file of ["image1.jpeg", "image2.jpeg", "image3.jpeg", "image4.jpeg", "image5.jpeg", "image6.jpeg"]) {
  imageBytes[file] = new Uint8Array(await fs.readFile(path.join(assetDir, file)));
}

function rect(slide, x, y, w, h, fill, radius) {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: { style: "solid", fill: "none", width: 0 },
    ...(radius ? { borderRadius: radius } : {})
  });
}
function txt(slide, x, y, w, h, value, size, color, bold, align) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 }
  });
  shape.text = value;
  shape.text.style = {
    typeface: FONT,
    fontSize: size,
    color: color || C.cream,
    bold: !!bold,
    alignment: align || "left",
    verticalAlignment: "middle",
    autoFit: "shrinkText",
    wrap: "square"
  };
  shape.text.insets = 0;
  return shape;
}
function img(slide, filename, x, y, w, h, alt, fit) {
  return slide.images.add({
    blob: imageBytes[filename],
    contentType: filename.endsWith(".png") ? "image/png" : "image/jpeg",
    alt,
    fit: fit || "cover",
    geometry: "roundRect",
    borderRadius: "rounded-xl",
    position: { left: x, top: y, width: w, height: h }
  });
}
function newSlide() {
  const slide = deck.slides.add();
  slide.background.fill = C.bg;
  return slide;
}
function heading(slide, title, number) {
  txt(slide, 70, 42, 1100, 58, title, 37, C.cream, true);
  rect(slide, 72, 111, 78, 4, C.green, 2);
  txt(slide, 1090, 665, 120, 22, "EGIN  •  " + String(number).padStart(2, "0"), 13, C.muted, true, "right");
}
function label(slide, x, y, value, width) {
  txt(slide, x, y, width || 300, 30, value.toUpperCase(), 14, C.green, true);
}

const notes = [
  "Источники: Egin.docx, титульный раздел и рис. 2. Изображение робота — концепт-визуализация, не фотография испытаний.",
  "Источник: Egin.docx, таблица паспортизации проекта. Контактные данные в слайд не включены.",
  "Источник: Egin.docx, раздел 2. Оценка 15–25 ч/нед взята из проектного документа и не проверена независимым замером; на слайде обозначена как оценка проекта.",
  "Источники: Egin.docx, разделы 1, 5–7. Функции описывают проектную концепцию и требуют подтверждения испытаниями.",
  "Источники: Egin.docx, разделы 5–7 и рис. 1. 22 степени свободы и подача жидкостей — спецификация проекта, не результат независимых испытаний.",
  "Источники: Egin.docx, разделы 3, 6. Точность диагностики и автоматическое выполнение рекомендаций не заявляются как подтвержденные показатели.",
  "Источник: Egin.docx, раздел 8 и рис. 6. Интерфейс сайта является демонстрацией; статусы роботов симулируются.",
  "Источник цен: src/components/OrderModal.tsx. Базовая цена 2 800 000 ₸; корзина 450 000 ₸; датчики 180 000 ₸; обучение 120 000 ₸. Комплект с корзиной и датчиками: 3 430 000 ₸.",
  "Покупатель: расчет использует целевой показатель 20 ч/нед из Egin.docx и среднемесячную зарплату 365 262 ₸ в сельском хозяйстве, лесном и рыбном хозяйстве во II квартале 2026 года (Бюро национальной статистики РК: https://stat.gov.kz/en/industries/labor-and-venue/stat-wags/publications/514654/). 20 ч/нед приняты за половину стандартной 40-часовой недели. Простая окупаемость базовой цены 2,8 млн ₸: около 1,28 года при круглогодичном использовании или 2,56 года при шестимесячном сезоне. До обслуживания, электроэнергии, ремонтов, простоев и контроля человеком. Продавец: 30% валовой маржи от 2,8 млн ₸ требует себестоимости не выше 1,96 млн ₸; фактическая себестоимость неизвестна. Все оценки — сценарные, не гарантии.",
  "Пятилетний срок — расчетное допущение для предварительной модели, не подтвержденный ресурс и не гарантийный срок. Следующий этап — пилот с измерением времени задач, расхода воды, надежности, циклов аккумулятора, обслуживания и простоев."
];

{
  const s = newSlide();
  txt(s, 74, 112, 520, 30, "AQMOLA POWER  •  2026", 15, C.green, true);
  txt(s, 72, 171, 500, 100, "EGIN", 86, C.cream, true);
  txt(s, 76, 276, 510, 96, "АГРО-РОБОТ\nДЛЯ ТЕПЛИЦЫ", 34, C.cream, true);
  txt(s, 78, 400, 455, 58, "Робототехника  ×  ИИ  ×  агротехнологии", 20, C.gray, false);
  txt(s, 78, 546, 480, 46, "Абай Тлеугалиев  •  Astana IT University / JanaBales", 16, C.gray, false);
  img(s, "image2.jpeg", 610, 78, 600, 560, "Концепт робота EGIN, вид спереди", "contain");
  txt(s, 78, 636, 440, 22, "КОНЦЕПТ ПРОЕКТА  •  КОСШЫ, АКМОЛИНСКАЯ ОБЛАСТЬ", 12, C.muted, true);
  s.speakerNotes.text = notes[0] + "\n" + notes[1];
}

{
  const s = newSlide();
  heading(s, "Автор проекта", 2);
  txt(s, 84, 185, 1100, 90, "Абай Тлеугалиев", 56, C.cream, true);
  txt(s, 86, 282, 1060, 44, "Astana IT University  /  JanaBales", 25, C.green, false);
  rect(s, 86, 365, 1080, 1, C.line);
  txt(s, 86, 420, 1080, 78, "РОБОТОТЕХНИКА     ×     ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ     ×     АГРОТЕХНОЛОГИИ", 21, C.cream, true);
  txt(s, 87, 525, 930, 45, "EGIN — проект для теплиц и небольших хозяйств Акмолинской области", 20, C.gray, false);
  s.speakerNotes.text = notes[1];
}

{
  const s = newSlide();
  heading(s, "Рутинный уход отнимает время", 3);
  const farmer = path.join(workspaceDir, "public", "assets", "farmer_manual_labor.jpg");
  s.images.add({
    blob: new Uint8Array(await fs.readFile(farmer)), contentType: "image/jpeg", alt: "Иллюстрация ручного ухода за грядками", fit: "cover",
    geometry: "roundRect", borderRadius: "rounded-xl",
    position: { left: 72, top: 158, width: 560, height: 430 }
  });
  label(s, 690, 172, "Оценка проекта", 380);
  txt(s, 690, 213, 500, 112, "15–25", 76, C.green, true);
  txt(s, 696, 322, 420, 42, "часов ручной работы в неделю*", 23, C.cream, true);
  txt(s, 696, 405, 430, 98, "Полив  •  прополка  •  осмотр растений", 23, C.gray, false);
  txt(s, 72, 610, 880, 25, "* Оценка из проектного документа; проверяется замерами в пилоте.", 14, C.muted, false);
  s.speakerNotes.text = notes[2];
}

{
  const s = newSlide();
  heading(s, "EGIN — помощник для теплицы", 4);
  label(s, 80, 170, "Проектная концепция", 380);
  txt(s, 80, 215, 500, 120, "Рутина —\nпод контроль", 47, C.cream, true);
  txt(s, 84, 372, 480, 114, "Точечный полив\nМониторинг растений\nПеренос урожая", 24, C.gray, false);
  img(s, "image3.jpeg", 620, 150, 585, 420, "Концептуальная визуализация EGIN в теплице", "cover");
  txt(s, 84, 590, 460, 27, "Задача робота — помогать человеку, а не заменять агронома.", 15, C.green, false);
  s.speakerNotes.text = notes[3];
}

{
  const s = newSlide();
  heading(s, "Конструкция для работы у грядок", 5);
  img(s, "image1.jpeg", 72, 150, 590, 450, "Концепт EGIN сбоку с инструментом", "cover");
  label(s, 730, 170, "Инженерная концепция", 400);
  txt(s, 730, 218, 420, 96, "22", 76, C.green, true);
  txt(s, 738, 308, 450, 46, "степени свободы", 28, C.cream, true);
  rect(s, 735, 378, 440, 1, C.line);
  txt(s, 735, 409, 440, 46, "Ладонный полив", 28, C.cream, true);
  txt(s, 735, 464, 440, 38, "вода  +  жидкая подкормка", 19, C.gray, false);
  txt(s, 735, 533, 440, 46, "Модульная корзина Follow-Me", 23, C.cream, true);
  s.speakerNotes.text = notes[4];
}

{
  const s = newSlide();
  heading(s, "Зрение, AR и ИИ-агроном", 6);
  label(s, 80, 160, "Заложенные функции", 370);
  txt(s, 80, 210, 500, 64, "ИИ-зрение", 35, C.cream, true);
  txt(s, 80, 278, 500, 44, "наблюдение за культурами", 20, C.gray, false);
  txt(s, 80, 350, 500, 64, "AR-разметка", 35, C.cream, true);
  txt(s, 80, 418, 500, 44, "границы и карта грядок", 20, C.gray, false);
  txt(s, 80, 492, 500, 64, "ИИ-агроном", 35, C.cream, true);
  txt(s, 80, 560, 500, 44, "вопросы по уходу за растениями", 20, C.gray, false);
  img(s, "image4.jpeg", 630, 160, 580, 420, "Концепт карты культур и маршрутов EGIN", "cover");
  txt(s, 80, 617, 1060, 22, "Точность распознавания и рекомендации должны быть подтверждены испытаниями.", 14, C.muted, false);
  s.speakerNotes.text = notes[5];
}

{
  const s = newSlide();
  heading(s, "Цифровая часть проекта", 7);
  label(s, 80, 164, "Сайт и Egin App", 350);
  txt(s, 80, 213, 470, 220, "Симуляция\nПанель управления\nМобильный интерфейс\nИИ-чат", 28, C.cream, true);
  txt(s, 82, 496, 470, 70, "Форма заявки —\nдемонстрационная", 20, C.green, true);
  img(s, "image6.jpeg", 625, 144, 585, 430, "Макет мобильного интерфейса Egin App", "cover");
  txt(s, 80, 617, 1080, 22, "Сайт показывает цифровой прототип; телеметрия роботов в симуляции демонстрационная.", 14, C.muted, false);
  s.speakerNotes.text = notes[6];
}

{
  const s = newSlide();
  heading(s, "Цена робота", 8);
  label(s, 78, 160, "Базовая цена", 360);
  txt(s, 78, 200, 510, 92, "2,8 млн ₸", 64, C.green, true);
  txt(s, 82, 302, 470, 38, "Робот EGIN", 24, C.cream, true);
  rect(s, 82, 365, 510, 1, C.line);
  txt(s, 82, 392, 480, 36, "+ 450 тыс. ₸   корзина", 20, C.gray, false);
  txt(s, 82, 438, 480, 36, "+ 180 тыс. ₸   датчики", 20, C.gray, false);
  txt(s, 82, 484, 480, 36, "+ 120 тыс. ₸   обучение", 20, C.gray, false);
  txt(s, 82, 558, 480, 50, "3,43 млн ₸  с корзиной и датчиками", 21, C.cream, true);
  img(s, "image5.jpeg", 640, 158, 565, 420, "Концепт моторизованной корзины Follow-Me", "contain");
  s.speakerNotes.text = notes[7];
}

{
  const s = newSlide();
  heading(s, "Экономика: сценарий, не гарантия", 9);
  rect(s, 72, 160, 550, 430, C.bg2, "rounded-xl");
  rect(s, 660, 160, 548, 430, C.bg2, "rounded-xl");
  label(s, 104, 191, "Покупатель", 220);
  txt(s, 104, 234, 475, 86, "1,3–2,6 года", 51, C.green, true);
  txt(s, 106, 331, 470, 88, "простая окупаемость\nпри экономии 20 ч/нед*", 22, C.cream, false);
  txt(s, 106, 445, 465, 74, "Круглогодично: ~1,3 года\nСезон 6 месяцев: ~2,6 года", 17, C.gray, false);
  label(s, 694, 191, "Продавец", 220);
  txt(s, 694, 234, 470, 84, "≤ 1,96 млн ₸", 48, C.green, true);
  txt(s, 698, 329, 460, 90, "предельная себестоимость\nдля 30% валовой маржи", 21, C.cream, false);
  txt(s, 698, 444, 460, 78, "От базовой цены 2,8 млн ₸;\nдо сервиса и гарантий.", 17, C.gray, false);
  txt(s, 74, 606, 1140, 40, "* По отраслевой средней зарплате 365 262 ₸/мес, II кв. 2026; до расходов на обслуживание.", 13, C.muted, false);
  s.speakerNotes.text = notes[8];
}

{
  const s = newSlide();
  heading(s, "Срок службы проверим пилотом", 10);
  txt(s, 76, 168, 520, 110, "5 лет*", 76, C.green, true);
  txt(s, 82, 284, 500, 68, "сценарий для расчёта,\nне подтверждённый ресурс", 22, C.cream, false);
  rect(s, 690, 165, 1, 420, C.line);
  label(s, 760, 176, "Что измерим в пилоте", 390);
  txt(s, 760, 225, 440, 62, "Наработка и простои", 27, C.cream, true);
  txt(s, 760, 316, 440, 62, "Аккумулятор и ремонт", 27, C.cream, true);
  txt(s, 760, 407, 440, 62, "Время, вода, качество", 27, C.cream, true);
  rect(s, 76, 428, 520, 2, C.green);
  txt(s, 76, 480, 550, 74, "Следующий шаг —\nпилотная теплица в Акмолинской области", 23, C.cream, true);
  txt(s, 76, 594, 1080, 34, "* Расчётное допущение, не срок гарантии.", 15, C.muted, false);
  s.speakerNotes.text = notes[9];
}

await fs.mkdir(path.dirname(finalPath), { recursive: true });
await fs.mkdir(renderDir, { recursive: true });
const draftPath = path.join(buildDir, "EGIN_pitch_candidate.pptx");
await (await PresentationFile.exportPptx(deck)).save(draftPath);

for (const [index, slide] of deck.slides.items.entries()) {
  const png = await deck.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(renderDir, "slide-" + String(index + 1).padStart(2, "0") + ".png"), new Uint8Array(await png.arrayBuffer()));
}

const skillDir = "C:\\Users\\Абай\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.1025.11240\\skills\\Presentations";
const { finalizePresentation } = await import(pathToFileURL(
  path.join(skillDir, "container_tools", "artifact_tool_utils.mjs")
).href);
const requirements = {
  explicitTotalSlideCount: 10,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  fontPolicy: { basis: "design", families: [FONT] }
};
const stagingDir = path.join(buildDir, ".codex-finalizer");
await fs.mkdir(stagingDir, { recursive: true });
const candidatePath = path.join(stagingDir, "candidate.pptx");
await fs.copyFile(draftPath, candidatePath);
process.env.RUNTIME_NODE_MODULES = "C:\\Users\\Абай\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules";
const result = await finalizePresentation({
  ...requirements,
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: "C:\\Users\\Абай\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe",
  integrityValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools", "inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit"],
  requiredNativeTableOwnerSlides: [],
  fontPolicy: { basis: "design", families: [FONT] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "EGIN_pitch_2026_v3.validation.json")
});
console.log(JSON.stringify({ finalPath, result }, null, 2));




