import fs from 'node:fs/promises';
import path from 'node:path';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';
import { pathToFileURL } from 'node:url';
const workspaceDir='C:/Users/Абай/Downloads/Egin/egin-web';
const skillDir='C:/Users/Абай/.codex/plugins/cache/openai-primary-runtime/presentations/26.1025.11240/skills/Presentations';
const sourcePath='C:/Users/Абай/Downloads/Дизайн без названия.pptx';
const finalPath=path.join(workspaceDir,'artifacts','EGIN_pitch_template.pptx');
const buildDir=path.join(workspaceDir,'.codex-build','EGIN-template');
const renderDir=path.join(buildDir,'rendered');
await fs.mkdir(renderDir,{recursive:true});
const deck=await PresentationFile.importPptx(await FileBlob.load(sourcePath));
const changes={
'sh/k3yl0zql':'Проект EGIN',
'sh/7qp4be9c':'АГРО-РОБОТ EGIN',
'sh/x4r21kru':'Абай Тлеугалиев',
'sh/w3i1sfa9':'01',
'sh/r65knqtk':'Astana IT University • JanaBales\nПроект робототехники и агротехнологий для теплиц Акмолинской области.',
'sh/obq90bml':'Рутина отнимает время',
'sh/pcjqtg36':'15–25 часов в неделю*',
'sh/ql8jytsj':'Робот EGIN',
'sh/doj29oba':'01',
'sh/z2tcnm5s':'Помощник для теплицы',
'sh/yhg7epsj':'Задачи робота',
'sh/98rqt4r6':'Точечный полив',
'sh/ml07i9sv':'Подача воды и жидкой подкормки к растениям.',
'sh/oryp8fah':'Мониторинг',
'sh/pc76hkr2':'Наблюдение за состоянием культур и грядок.',
'sh/w32twb6l':'Перенос урожая',
'sh/v2tcn650':'Модульная корзина Follow-Me — концепция проекта.',
'sh/ydkbm5sv':'ИИ-агроном',
'sh/kzmdova1':'ИИ-чат отвечает на вопросы по уходу за растениями. Рекомендации требуют проверки специалистом.',
'sh/g72x4zyd':'ИИ-зрение и AR-разметка',
'sh/6h0fypgb':'Камера',
'sh/tkby9kzm':'Наблюдение за культурами.',
'sh/je9g3ahk':'AR-разметка',
'sh/id0fu50z':'Карта грядок и ориентиры для работы.',
'sh/98rehwve':'Диагностика',
'sh/m5gvmhwn':'Подсказки по симптомам растений — проектная функция.',
'sh/9gzml0nq':'22 степени свободы',
'sh/ofq5svm5':'02',
'sh/bih4na5w':'Манипулятор и ладонная подача воды и жидкой подкормки — проектная концепция.',
'sh/cbu58j2h':'Сайт и Egin App',
'sh/zelojyl8':'Симуляция робота • панель управления • мобильная версия • ИИ-чат.\n\nСтатусы в симуляции демонстрационные.',
'sh/xcryxg7y':'Цифровой прототип',
'sh/wbih4b6d':'На сайте доступны симуляция, интерфейс управления и ИИ-чат. Мобильная версия адаптирована под телефон. Данные роботов в демо не поступают с реальных сенсоров.',
'sh/dcbm583y':'Бронирование\nEGIN',
'sh/sb2lcnmd':'Форма заявки демонстрационная. Реальное бронирование пока не оформляется.',
'sh/p4r6p8by':'Цена EGIN',
'sh/32ponyts':'Базовая комплектация — робот EGIN.',
'sh/gzy5s3a1':'2,8',
'sh/hcfy9k3u':'Комплект с корзиной и датчиками, млн ₸.',
'sh/gb6x0zm9':'3,43',
'sh/idgvmx8r':'Срок службы и экономика',
'sh/5grehs7i':'03',
'sh/kfidonqx':'Покупатель: окупаемость около 1,3–2,6 года* при экономии 20 часов работы в неделю.',
'sh/zi5c3y98':'Продавец: при цене 2,8 млн ₸ себестоимость до 1,96 млн ₸ соответствует 30% валовой марже.',
'sh/na5476l8':'Пять лет — сценарий для расчёта, не подтверждённый срок службы.',
'sh/m9c3e1kn':'Следующий шаг — пилот и замеры ресурса робота.'
};
for(const [id,value] of Object.entries(changes)){
 const shape=deck.resolve(id);
 if(!shape) throw new Error(`Missing shape ${id}`);
 const previous=shape.text?.toString?.() ?? String(shape.text ?? '');
 shape.text.replace(previous,value);
}
// Remove the template's stock photographs while preserving its colored organic shapes.
for(const id of ['sh/xc3mho32','sh/n69grmpw']) deck.resolve(id)?.delete();
for(const id of ['im/ed4n6p8j','im/dcvmdk7y']) deck.resolve(id)?.delete();
for(let i=0;i<deck.slides.count;i++){
 const slide=deck.slides.getItem(i);
 if(i===2) slide.speakerNotes.text='Источник: Egin.docx. Оценка 15–25 часов в неделю приведена в проектном документе и требует проверки замерами.';
 if(i===8) slide.speakerNotes.text='Источник: Egin.docx. 22 степени свободы — параметр проектной концепции.';
 if(i===12) slide.speakerNotes.text='Источник цен: форма бронирования на сайте EGIN. Базовая цена 2 800 000 ₸; комплект с корзиной и датчиками — 3 430 000 ₸.';
 if(i===13) slide.speakerNotes.text='Сценарная оценка, не гарантия. Расчет покупателя основан на среднемесячной зарплате в агросекторе и целевой экономии 20 часов работы в неделю. Реальные расходы на обслуживание не учтены. Пятилетний срок службы — допущение для модели, подтвержденного ресурса нет.';
 const png=await deck.export({slide,format:'png',scale:1});
 await fs.writeFile(path.join(renderDir,`slide-${String(i+1).padStart(2,'0')}.png`),Buffer.from(await png.arrayBuffer()));
}
const candidatePath=path.join(buildDir,'candidate.pptx');
await fs.mkdir(buildDir,{recursive:true});
await (await PresentationFile.exportPptx(deck)).save(candidatePath);
process.env.RUNTIME_NODE_MODULES='C:/Users/Абай/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation}=await import(pathToFileURL(path.join(skillDir,'container_tools','artifact_tool_utils.mjs')).href);
const receiptPath=path.join(buildDir,'EGIN_pitch_template.validation.json');
const result=await finalizePresentation({
 explicitTotalSlideCount:15,
 workspaceDir,candidatePath,finalPath,
 pythonExecutable:'C:/Users/Абай/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',
 integrityValidatorPath:path.join(skillDir,'container_tools','inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(skillDir,'container_tools','inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','18288000,10287000','--validate-bullet-geometry','--validate-heading-fit'],
 fontPolicy:{basis:'reference',families:['HK Grotesk Bold','HK Grotesk Medium','Noto Sans JP','Vollkorn','Vollkorn Italics'],referencePath:sourcePath,referenceSha256:(await import('node:crypto')).createHash('sha256').update(await fs.readFile(sourcePath)).digest('hex')},
 verifyArtifactToolImport:true,receiptPath
});
console.log(JSON.stringify({finalPath,receiptPath,slides:deck.slides.count,result},null,2));



