import fs from 'node:fs/promises';
import { FileBlob, PresentationFile } from '@oai/artifact-tool';
const p=await PresentationFile.importPptx(await FileBlob.load('C:/Users/Абай/Downloads/Дизайн без названия.pptx'));
console.log('slides',p.slides.count);
const i=await p.inspect({kind:'slide,textbox,shape,image,table,chart,layout',max_chars:200000});
await fs.writeFile('.codex-build/template-inspect/inspect.ndjson',i.ndjson||'','utf8');
for(let n=0;n<p.slides.count;n++){
 const s=p.slides.getItem(n); const b=await p.export({slide:s,format:'png',scale:1}); await fs.writeFile(`.codex-build/template-inspect/slide-${String(n+1).padStart(2,'0')}.png`,Buffer.from(await b.arrayBuffer()));
 const l=await p.export({slide:s,format:'layout'}); await fs.writeFile(`.codex-build/template-inspect/slide-${String(n+1).padStart(2,'0')}.json`,Buffer.from(await l.arrayBuffer()));
}
