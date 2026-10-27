import { FileBlob, PresentationFile } from '@oai/artifact-tool';
const p=await PresentationFile.importPptx(await FileBlob.load('C:/Users/Абай/Downloads/Дизайн без названия.pptx'));
for(const id of ['sh/cbu58j2h','sh/xc3mho32','im/ed4n6p8j']) {const o=p.resolve(id); console.log(id, Object.keys(o||{}),Object.getOwnPropertyNames(Object.getPrototypeOf(o||{})));}
const sl=p.slides.getItem(0);console.log('slides collection',Object.keys(p.slides),Object.getOwnPropertyNames(Object.getPrototypeOf(p.slides)));console.log('slide',Object.keys(sl),Object.getOwnPropertyNames(Object.getPrototypeOf(sl)));console.log('images collection',Object.keys(p.slides.getItem(12).images),Object.getOwnPropertyNames(Object.getPrototypeOf(p.slides.getItem(12).images)));
