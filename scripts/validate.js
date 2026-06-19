// Validación de build: corre en el GitHub Action (y local con `npm run validate`).
// 1) Compila el/los <script> de index.html y kiosk.html (sintaxis, sin ejecutar).
// 2) Verifica que data/proyectos.json parsea y tiene la forma esperada.
// Sale con código !=0 si algo falla (así el Action marca el check en rojo y NO deploya).
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let errors = 0;

function checkHtmlJS(file) {
  let html;
  try { html = fs.readFileSync(path.join(ROOT, file), 'utf8'); }
  catch (e) { console.error('✗ ' + file + ': no se pudo leer (' + e.message + ')'); errors++; return; }
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  if (!blocks.length) { console.error('✗ ' + file + ': sin bloque <script>'); errors++; return; }
  blocks.forEach((m, i) => {
    try {
      new vm.Script(m[1], { filename: file + ' #script' + (i + 1) });
      console.log('✓ ' + file + ' (script ' + (i + 1) + '/' + blocks.length + '): sintaxis JS OK');
    } catch (e) {
      console.error('✗ ' + file + ' (script ' + (i + 1) + '): ' + e.message);
      errors++;
    }
  });
}

['index.html', 'kiosk.html'].forEach(checkHtmlJS);

// data/proyectos.json
try {
  const raw = fs.readFileSync(path.join(ROOT, 'data', 'proyectos.json'), 'utf8');
  const d = JSON.parse(raw);
  if (!Array.isArray(d.proyectos) || d.proyectos.length === 0) throw new Error('"proyectos" debe ser un array no vacío');
  if (!d.logos || typeof d.logos !== 'object') throw new Error('"logos" debe ser un objeto');
  if (!Array.isArray(d.gantt)) throw new Error('"gantt" debe ser un array');
  if (!Array.isArray(d.predicciones)) throw new Error('"predicciones" debe ser un array');
  const sinEtapa = d.proyectos.filter(p => !p.nombre || !p.etapa || !p.hora);
  if (sinEtapa.length) throw new Error(sinEtapa.length + ' proyecto(s) sin nombre/etapa/hora');
  console.log('✓ data/proyectos.json: OK (' + d.proyectos.length + ' proyectos, ' +
    Object.keys(d.logos).length + ' logos, ' + d.gantt.length + ' gantt, ' + d.predicciones.length + ' predicciones)');
} catch (e) {
  console.error('✗ data/proyectos.json: ' + e.message);
  errors++;
}

if (errors) {
  console.error('\n✗ ' + errors + ' error(es) de validación. Build inválido — no se publica.');
  process.exit(1);
}
console.log('\n✓ Validación OK — listo para publicar.');
