// Genera el directorio estático de APIs agro de www.agrohubs.cl en public/ (Vite lo copia a dist/).
// HTML puro (sin JS obligatorio) para buscadores y motores de IA, más llms.txt, Markdown por API,
// catálogo JSON, sitemap.xml y robots.txt.  Uso: node scripts/build-apis.mjs
// Público objetivo: quien quiere integrar su software con fuentes de datos agro.
import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  ROOT, SITE, UPDATED, APIS, CATEGORIAS, CASOS, bySlug, cat, caso, PAIS, ESTADO, ESTADO_TXT, TIPO, MODELO, VERIF_COSTO, VERIF,
  ANILLO, ANILLO_TXT, CUADRANTES, cuad, RANKINGS, esc, usd, total, page, fechaLarga, breadcrumbLd, faqLd, orgLd,
  crumbs, chipEstado, chipAnillo, costoCelda, sortedBy, faqs, costoFrase, nivel, accesibilidad, cta, COTIZAR
} from './apis/lib.mjs'
import { techRadarSvg, scoreRadarSvg, RADAR_ITEMS, radarNum } from './apis/charts.mjs'
import { partesNombre, resumenPorCategoria } from './apis/ecosistema.mjs'

const PUB = join(ROOT, 'public')
const OUT = join(PUB, 'apis')
rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'categoria'), { recursive: true })
mkdirSync(join(OUT, 'caso-de-uso'), { recursive: true })
const write = (rel, text) => writeFileSync(join(PUB, rel), text)
const files = []
const html = (path, doc) => { write(path.slice(1) + '.html', doc); files.push(path) }

// Control de calidad: los textos públicos no deben traer jerga interna
const JERGA = /Fisaro|HubRecord|scheduler|\/hub\/|proyecto FIA|vencida|heredad|data_|tipo_doc|Hub de AgroHubs/i
const conJerga = APIS.flatMap((a) => [a.resumen, ...a.descripcion, ...a.que_entrega, ...a.faq.map((f) => f.a)].filter((t) => JERGA.test(t)).map((t) => `${a.key}: ${t.slice(0, 90)}`))
if (conJerga.length) { console.error('Textos públicos con jerga interna:\n' + conJerga.join('\n')); process.exit(1) }

// ── Cifras globales ──
const gratis = APIS.filter((a) => a.costos.mensual_usd === 0).length
const sinPrecio = APIS.filter((a) => a.costos.mensual_usd == null).length
const chile = APIS.filter((a) => a.pais === 'CL').length
const conectadas = APIS.filter((a) => ['integrada', 'proxy', 'scheduler'].includes(a.estado_agrohubs)).length
const listas = APIS.filter((a) => a.radar.anillo === 'adoptar' || a.radar.anillo === 'probar')
const listasMes = listas.reduce((s, a) => s + (a.costos.mensual_usd || 0), 0)

const NIVELES = ['adoptar', 'probar', 'evaluar', 'resistir']

// ── Bloques reutilizables ──
const precioCorto = (a) => a.costos.mensual_usd == null ? 'Precio a pedido' : a.costos.mensual_usd === 0 ? 'Gratis' : `${usd(a.costos.mensual_usd)} al mes`
const card = (a) => `<li class="card api-card">
  <div class="chips">${chipEstado(a)}<span class="chip">${esc(PAIS[a.pais] || a.pais)}</span></div>
  <h3><a href="/apis/${a.slug}">${esc(a.nombre)}</a></h3>
  <p class="muted small">${esc(a.proveedor)}</p>
  <p>${esc(a.resumen)}</p>
  <p class="small"><b>${precioCorto(a)}</b> · Recomendación ${a.ranking.relevancia}/100</p>
</li>`

const topList = (dim, k = 10) => `<ol class="top">${sortedBy(dim).slice(0, k).map((a) => `<li><a href="/apis/${a.slug}">${esc(a.nombre)}</a><span class="score">${a.ranking[dim]}</span></li>`).join('')}</ol>`

const costTable = (list, id = 'tabla-costos') => `<div class="table-wrap"><table id="${id}" class="sortable">
<caption class="sr">Costo mensual y anual de cada fuente en dólares</caption>
<thead><tr>
<th scope="col" data-type="text">Fuente o herramienta</th><th scope="col" data-type="text">País</th><th scope="col" data-type="text">Forma de pago</th>
<th scope="col" class="num" data-type="num">Al mes (US$)</th><th scope="col" class="num" data-type="num">Al año (US$)</th>
<th scope="col" class="num" data-type="num">Recomendación</th><th scope="col" class="num" data-type="num">Lugar en Chile</th>
<th scope="col" data-type="text">Disponibilidad</th></tr></thead>
<tbody>${list.map((a) => `<tr>
<td><a href="/apis/${a.slug}">${esc(a.nombre)}</a></td><td>${esc(PAIS[a.pais] || a.pais)}</td><td>${esc(MODELO[a.costos.modelo])}</td>
<td class="num" data-v="${a.costos.mensual_usd ?? ''}">${costoCelda(a, 'mensual_usd')}</td><td class="num" data-v="${a.costos.anual_usd ?? ''}">${costoCelda(a, 'anual_usd')}</td>
<td class="num">${a.ranking.relevancia}</td><td class="num">${a.ranking.pos_chile}</td>
<td><span class="chip ring-${a.radar.anillo}">${ANILLO[a.radar.anillo]}</span></td></tr>`).join('')}</tbody></table></div>`

const comoLeerMapa = `<ul class="niveles">${NIVELES.map((r) => `<li><span class="chip ring-${r}">${ANILLO[r]}</span> ${esc(ANILLO_TXT[r].charAt(0).toUpperCase() + ANILLO_TXT[r].slice(1))}.</li>`).join('')}</ul>`

const radarLegend = () => `<div class="legend">${CUADRANTES.map((q, qi) => `<section><h3><span class="dot" style="background:${q.color}"></span>${esc(q.nombre)}</h3>
${NIVELES.map((r) => {
  const items = RADAR_ITEMS.filter((it) => it.q === qi && it.a.radar.anillo === r)
  return items.length ? `<h4>${ANILLO[r]}</h4><ol>${items.map((it) => `<li><span class="num">${it.n}</span><a href="/apis/${it.a.slug}">${esc(it.a.nombre)}</a></li>`).join('')}</ol>` : ''
}).join('')}</section>`).join('')}</div>`

const pasos = `<ol class="pasos">
  <li><b>Elige las fuentes.</b> Revisa este directorio y marca las que tu sistema necesita: clima, satélite, sensores, riego, precios u otras.</li>
  <li><b>AgroHubs las conecta.</b> Tramitamos los accesos, unificamos los formatos y mantenemos cada conexión funcionando.</li>
  <li><b>Tu sistema usa una sola API.</b> Recibes todos los datos con el mismo formato, sin integrar proveedor por proveedor.</li>
</ol>`

const SORT_JS = `<script>
document.querySelectorAll('table.sortable').forEach(function(t){
  var tb=t.tBodies[0];
  t.querySelectorAll('th').forEach(function(th,i){
    th.tabIndex=0; th.setAttribute('aria-sort','none');
    var go=function(){
      var asc=th.getAttribute('aria-sort')!=='ascending';
      t.querySelectorAll('th').forEach(function(x){x.setAttribute('aria-sort','none')});
      th.setAttribute('aria-sort',asc?'ascending':'descending');
      var num=th.dataset.type==='num';
      var rows=[].slice.call(tb.rows).sort(function(a,b){
        var x=a.cells[i],y=b.cells[i];
        if(num){var p=x.dataset.v!==undefined?x.dataset.v:x.textContent,q=y.dataset.v!==undefined?y.dataset.v:y.textContent;
          var u=p===''?Infinity:parseFloat(p),v=q===''?Infinity:parseFloat(q);return asc?u-v:(v===Infinity?-1:u===Infinity?1:v-u)}
        return asc?x.textContent.localeCompare(y.textContent,'es'):y.textContent.localeCompare(x.textContent,'es')});
      rows.forEach(function(r){tb.appendChild(r)});
    };
    th.addEventListener('click',go); th.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
  });
});
var q=document.getElementById('filtro');
if(q){q.addEventListener('input',function(){var s=q.value.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');
  document.querySelectorAll('#tabla-costos tbody tr').forEach(function(r){r.hidden=s&&r.textContent.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').indexOf(s)<0})})}
</script>`

const datasetLd = {
  '@context': 'https://schema.org', '@type': 'Dataset',
  name: 'Directorio de APIs y fuentes de datos agrícolas de AgroHubs',
  description: `${total} APIs y fuentes de datos agrícolas (clima, satélite, suelo, riego, sensores, precios, trazabilidad) con costo mensual y anual en dólares, recomendaciones para Chile y Latinoamérica y disponibilidad para integrarlas.`,
  url: SITE + '/apis', inLanguage: 'es-CL', dateModified: UPDATED, creator: orgLd, license: 'https://creativecommons.org/licenses/by/4.0/',
  spatialCoverage: [{ '@type': 'Country', name: 'Chile' }, { '@type': 'Place', name: 'Latinoamérica' }],
  distribution: [
    { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: SITE + '/apis/catalogo.json' },
    { '@type': 'DataDownload', encodingFormat: 'text/markdown', contentUrl: SITE + '/llms-full.txt' }
  ]
}
const serviceLd = {
  '@context': 'https://schema.org', '@type': 'Service', name: 'Integración de datos agrícolas AgroHubs', provider: orgLd,
  serviceType: 'Integración de APIs y fuentes de datos agrícolas', areaServed: [{ '@type': 'Country', name: 'Chile' }, { '@type': 'Place', name: 'Latinoamérica' }],
  description: 'AgroHubs conecta tu software con clima, satélite, sensores, riego, precios y otras fuentes agrícolas en una sola API.',
  url: SITE + COTIZAR
}

// ── /apis (landing) ──
{
  const faqLanding = [
    { q: '¿Qué es AgroHubs y cómo me ayuda a integrar datos agrícolas?', a: 'AgroHubs conecta tu software con muchas fuentes de datos del agro (clima, satélite, sensores, riego, precios y más) y te las entrega en una sola API con un formato común. Así no tienes que integrar ni mantener cada proveedor por separado.' },
    { q: '¿Cuáles son las mejores fuentes de datos agrícolas para Chile?', a: `Según AgroHubs: ${sortedBy('chile').slice(0, 5).map((a) => a.nombre).join(', ')}. INIA Agromet, ODEPA, CIREN y la Dirección Meteorológica son fuentes públicas chilenas de acceso gratuito.` },
    { q: '¿Qué fuentes de datos agrícolas son gratuitas?', a: `${gratis} de las ${total} fuentes del directorio se pueden usar gratis, entre ellas INIA Agromet, ODEPA, CIREN, CONAF, Copernicus y NASA Earthdata.` },
    { q: '¿Cuánto cuestan las fuentes que AgroHubs recomienda?', a: `Las ${listas.length} fuentes listas para usar o próximas a conectarse suman cerca de ${usd(listasMes)} al mes (${usd(listasMes * 12)} al año) en precios publicados. Las de sensores, riego y maquinaria de marca se cotizan con cada proveedor.` },
    { q: '¿Cuánto cuesta integrar mi sistema con AgroHubs?', a: 'Depende de cuántas fuentes y sistemas quieras conectar. Completa el formulario de cotización con tu caso y te enviamos una propuesta.' },
    { q: '¿Qué significa cada nivel del mapa de APIs?', a: 'Lista para usar: está conectada en AgroHubs o lista para conectarse hoy. Próxima a conectarse: AgroHubs la sumará en los próximos meses. Disponible a pedido: AgroHubs puede conectarla si tu proyecto la necesita. No recomendada: existen alternativas mejores.' }
  ]
  const body = `
<section class="hero"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis']])}
  <p class="eyebrow">Integraciones · Chile y Latinoamérica</p>
  <h1>Conecta tu software con las fuentes de datos del agro</h1>
  <p class="lead">${total} APIs y herramientas explicadas en simple: clima, satélite, suelo, riego, sensores, precios y trazabilidad. Para cada una te contamos qué entrega, cuánto cuesta y cómo conectarla. AgroHubs las une en una sola API.</p>
  <p class="hero-ctas"><a class="btn btn-cta" href="${COTIZAR}">Cotiza tu integración</a><a class="btn btn-onink" href="#asesor-ia" data-asesor>Pregúntale al asesor</a></p>
  <dl class="kpis">
    <div><dt>Fuentes y herramientas</dt><dd>${total}</dd></div>
    <div><dt>Gratuitas</dt><dd>${gratis}</dd></div>
    <div><dt>De Chile</dt><dd>${chile}</dd></div>
    <div><dt>Ya conectadas en AgroHubs</dt><dd>${conectadas}</dd></div>
  </dl>
</div></section>

<section class="wrap block asesor-home" id="asesor-ia" aria-labelledby="asesor-ia-t">
  <h2 id="asesor-ia-t">Dime qué quieres y te digo qué APIs ocupar</h2>
  <p class="muted">Describe tu proyecto en una frase. El asesor te recomienda las fuentes y te deja la cotización lista para agendar una reunión.</p>
  <form class="asesor-inline" data-asesor-form><label class="sr" for="asesor-home-campo">Qué necesitas</label>
    <input id="asesor-home-campo" maxlength="1500" placeholder="Ej.: quiero alertas de heladas y programar el riego de mis paltos">
    <button class="btn-cta" type="submit">Recomiéndame APIs</button></form>
</section>

<section class="wrap block" id="como-funciona">
  <h2>Cómo funciona</h2>
  ${pasos}
  <div class="tldr"><h2>En resumen</h2><ul>
    <li>Chile tiene cinco fuentes públicas con conexión directa y gratuita: INIA Agromet, la Dirección Meteorológica, ODEPA, CIREN y CONAF.</li>
    <li>${gratis} de ${total} fuentes se pueden usar gratis; ${sinPrecio} no publican precio y se cotizan con el proveedor.</li>
    <li>Las fuentes que AgroHubs recomienda suman cerca de ${usd(listasMes)} al mes en precios publicados.</li>
    <li>Cada ficha explica la fuente en simple, su costo y cómo conectarla.</li>
  </ul><p class="muted small">Actualizado el ${fechaLarga(UPDATED)}. Las recomendaciones son una evaluación del equipo AgroHubs; cada ficha indica de dónde sale el precio.</p></div>
</section>

${cta('', 'inline')}

<section class="wrap block" id="recomendadas">
  <h2>Las más recomendadas</h2>
  <p class="muted">Cuatro formas de mirar las mismas ${total} fuentes, con un puntaje de 0 a 100. <a href="/apis/ranking">Ver las listas completas</a>.</p>
  <div class="grid4">${RANKINGS.map((r) => `<section class="card"><h3>${r.nombre}</h3><p class="muted small">${esc(r.txt.charAt(0).toUpperCase() + r.txt.slice(1))}.</p>${topList(r.dim)}</section>`).join('')}</div>
</section>

<section class="wrap block" id="mapa">
  <h2>Mapa de APIs agro</h2>
  <p class="muted">Cada punto es una fuente. Mientras más cerca del centro, más lista está para usar. El color indica el tipo de dato. Haz clic en un punto para ver su ficha. <a href="/apis/radar">Abrir el mapa completo</a>.</p>
  ${comoLeerMapa}
  <div class="radar-box">${techRadarSvg()}</div>
</section>

<section class="wrap block" id="fuentes">
  <h2>Todas las fuentes, con su costo mensual y anual</h2>
  <p class="muted">Precio del plan de entrada en dólares. El costo anual es el mensual por 12, sin descuentos. Haz clic en un encabezado para ordenar.</p>
  <label class="filter"><span class="sr">Filtrar fuentes</span><input id="filtro" type="search" placeholder="Busca por nombre, país o forma de pago"></label>
  ${costTable(sortedBy('relevancia'))}
</section>

<section class="wrap block" id="categorias">
  <h2>Buscar por tipo de dato</h2>
  <ul class="links">${CATEGORIAS.map((c) => ({ c, n: APIS.filter((a) => a.categorias.includes(c.slug)).length })).filter((x) => x.n).map(({ c, n }) => `<li><a href="/apis/categoria/${c.slug}">${esc(c.nombre)}</a> <span class="muted">${n}</span></li>`).join('')}</ul>
  <h2>Buscar por necesidad</h2>
  <ul class="links">${CASOS.map((c) => ({ c, n: APIS.filter((a) => a.casos_de_uso.includes(c.slug)).length })).filter((x) => x.n).map(({ c, n }) => `<li><a href="/apis/caso-de-uso/${c.slug}">${esc(c.nombre)}</a> <span class="muted">${n}</span></li>`).join('')}</ul>
</section>

<section class="wrap block" id="preguntas">
  <h2>Preguntas frecuentes</h2>
  <dl class="faq">${faqLanding.map((f) => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl>
</section>

${cta()}`
  html('/apis', page({
    path: '/apis', title: 'APIs agrícolas para Chile y Latinoamérica: costos y cómo integrarlas | AgroHubs',
    description: `${total} APIs y fuentes de datos agro explicadas en simple: qué entregan, costo mensual y anual, las mejores para Chile y cómo conectarlas a tu software en una sola API.`,
    body, script: SORT_JS,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'APIs agrícolas para Chile y Latinoamérica', url: SITE + '/apis', inLanguage: 'es-CL', dateModified: UPDATED, publisher: orgLd, about: 'APIs y fuentes de datos agrícolas',
        mainEntity: { '@type': 'ItemList', numberOfItems: total, itemListOrder: 'https://schema.org/ItemListOrderDescending', itemListElement: sortedBy('relevancia').map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/apis/${a.slug}`, name: a.nombre })) } },
      datasetLd, serviceLd, breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis']]), faqLd(faqLanding)
    ]
  }))
}

// ── /apis/ranking ──
{
  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], ['Ranking y costos', '/apis/ranking']])}
  <h1>Las mejores APIs agrícolas para Chile y Latinoamérica</h1>
  <p class="lead">Las ${total} fuentes del directorio ordenadas de cuatro formas, con su costo mensual y anual en dólares.</p>
</div></section>
<section class="wrap block">
  <div class="tldr"><h2>En resumen</h2><ul>${RANKINGS.map((r) => { const t = sortedBy(r.dim).slice(0, 3); return `<li><b>${r.nombre}:</b> ${t.map((a) => esc(a.nombre)).join(', ')}.</li>` }).join('')}</ul></div>
  <h2>Cómo se elaboran estas listas</h2>
  <ul>${RANKINGS.map((r) => `<li><b>${r.nombre}</b>: ${esc(r.txt)}.</li>`).join('')}</ul>
  <p class="muted small">Puntajes de 0 a 100 asignados por el equipo de AgroHubs según su experiencia e investigación de octubre de 2026. No son mediciones de tráfico ni encuestas.</p>
</section>
${RANKINGS.map((r) => `<section class="wrap block" id="${r.dim}"><h2>${r.nombre}</h2>
<div class="table-wrap"><table><thead><tr><th scope="col" class="num">Lugar</th><th scope="col">Fuente o herramienta</th><th scope="col">País</th><th scope="col" class="num">Puntaje</th><th scope="col" class="num">Al mes (US$)</th><th scope="col" class="num">Al año (US$)</th></tr></thead>
<tbody>${sortedBy(r.dim).map((a) => `<tr><td class="num">${a.ranking['pos_' + r.dim]}</td><td><a href="/apis/${a.slug}">${esc(a.nombre)}</a></td><td>${esc(PAIS[a.pais] || a.pais)}</td><td class="num"><span class="meter" style="--v:${a.ranking[r.dim]}"></span>${a.ranking[r.dim]}</td><td class="num">${costoCelda(a, 'mensual_usd')}</td><td class="num">${costoCelda(a, 'anual_usd')}</td></tr>`).join('')}</tbody></table></div></section>`).join('')}
${cta()}`
  html('/apis/ranking', page({
    path: '/apis/ranking', title: 'Las mejores APIs agrícolas para Chile y Latinoamérica, con costos | AgroHubs',
    description: `${total} APIs agro ordenadas por recomendación, uso mundial, utilidad en Chile y en Latinoamérica, con costo mensual y anual en dólares.`,
    body,
    jsonld: [
      ...RANKINGS.map((r) => ({ '@context': 'https://schema.org', '@type': 'ItemList', name: `${r.nombre}: APIs agrícolas`, itemListOrder: 'https://schema.org/ItemListOrderAscending', numberOfItems: total,
        itemListElement: sortedBy(r.dim).slice(0, 20).map((a) => ({ '@type': 'ListItem', position: a.ranking['pos_' + r.dim], url: `${SITE}/apis/${a.slug}`, name: a.nombre })) })),
      breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], ['Ranking y costos', '/apis/ranking']])
    ]
  }))
}

// ── /apis/radar (mapa) ──
{
  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], ['Mapa de APIs', '/apis/radar']])}
  <h1>Mapa de APIs agro: cuáles puedes usar hoy</h1>
  <p class="lead">Todas las fuentes del directorio en un solo mapa, según qué tan listas están para conectarse a tu sistema y qué tipo de datos entregan.</p>
</div></section>
<section class="wrap block">
  <h2>Cómo leer el mapa</h2>
  <p>El mapa tiene cuatro zonas de color, una por tipo de dato, y cuatro niveles. Mientras más cerca del centro está un punto, más lista está la fuente para usarse:</p>
  ${comoLeerMapa}
  <div class="tldr"><h2>En resumen</h2><ul>
  ${NIVELES.map((r) => { const l = APIS.filter((a) => a.radar.anillo === r); return `<li><b>${ANILLO[r]} (${l.length}):</b> por ejemplo ${l.sort((x, y) => y.ranking.relevancia - x.ranking.relevancia).slice(0, 4).map((a) => esc(a.nombre)).join(', ')}.</li>` }).join('')}
  </ul></div>
  <div class="radar-box">${techRadarSvg({ size: 760 })}</div>
  <h2>Qué hay en cada zona</h2>
  <p class="muted">El número coincide con el punto del mapa.</p>
  ${radarLegend()}
</section>
${cta()}`
  html('/apis/radar', page({
    path: '/apis/radar', title: 'Mapa de APIs agrícolas: cuáles están listas para usar | AgroHubs',
    description: `Mapa de ${total} APIs agro para Chile y Latinoamérica según si están listas para usar, próximas a conectarse, disponibles a pedido o no recomendadas.`,
    body,
    jsonld: [breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], ['Mapa de APIs', '/apis/radar']])]
  }))
}

// ── /apis/cotizar ──
// Feriados de Chile (para proponer la reunión en días hábiles); los usa también el sitio (src/lib/reunion.js)
const FERIADOS_CL = JSON.parse(readFileSync(join(ROOT, 'data', 'feriados-cl.json'), 'utf8'))
{
  const opciones = sortedBy('relevancia').map((a) => `<option value="${esc(a.slug)}">${esc(a.nombre)}</option>`).join('')
  const nombres = JSON.stringify(Object.fromEntries(APIS.map((a) => [a.slug, a.nombre]))).replace(/</g, '\\u003c')
  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], ['Cotiza tu integración', COTIZAR]])}
  <h1>Cotiza la integración de tu software</h1>
  <p class="lead">Cuéntanos qué sistema tienes y qué fuentes quieres conectar. Te respondemos con una propuesta a la medida y conversamos en una reunión corta.</p>
</div></section>
<section class="wrap block cols">
  <div class="main">
    <p id="f-aviso" class="aviso" hidden></p>
    <form id="cotizar" class="form" novalidate>
      <div class="row2">
        <label>Nombre<span aria-hidden="true"> *</span><input id="f-nombre" name="nombre" autocomplete="name" required></label>
        <label>Empresa<input id="f-empresa" name="empresa" autocomplete="organization"></label>
      </div>
      <div class="row2">
        <label>Email<span aria-hidden="true"> *</span><input id="f-email" name="email" type="email" autocomplete="email" required></label>
        <label>Teléfono o WhatsApp<input id="f-telefono" name="telefono" type="tel" autocomplete="tel"></label>
      </div>
      <label>Cargo<input id="f-cargo" name="cargo" autocomplete="organization-title"></label>
      <label>¿Qué software o sistema quieres conectar?<input id="f-software" name="software" placeholder="Por ejemplo: ERP propio, app de riego, plataforma de trazabilidad"></label>
      <div class="elegidas" id="f-elegidas" hidden><span class="lbl">APIs seleccionadas</span><ul></ul></div>
      <label>Fuentes que te interesan<select id="f-fuentes" name="fuentes" multiple size="8">${opciones}</select><span class="hint">Mantén presionado Ctrl (o Cmd en Mac) para elegir varias. ¿No sabes cuáles? <a href="#asesor" data-asesor>Pregúntale al asesor</a>.</span></label>
      <label>Cuéntanos tu caso<textarea id="f-mensaje" name="mensaje" rows="5" placeholder="Qué datos necesitas, para cuántos predios o usuarios, y cómo los usarías"></textarea></label>
      <label>¿Para cuándo lo necesitas?<select id="f-plazo" name="plazo"><option value="">Elige una opción</option><option>Lo antes posible</option><option>En 1 a 3 meses</option><option>En 3 a 6 meses</option><option>Estoy explorando</option></select></label>
      <fieldset class="reunion" id="f-reunion">
        <legend>Agenda una reunión de 30 minutos</legend>
        <p class="hint">Te proponemos el primer horario disponible (hora de Chile). Lo confirmamos por correo.</p>
        <div id="f-slots" class="slots"><noscript><p class="hint">Activa JavaScript para elegir horario, o indícalo en el mensaje.</p></noscript></div>
        <label class="slot"><input type="radio" name="reunion" value="otra"> Prefiero otro día</label>
        <div class="row2" id="f-otra" hidden>
          <label>Día<input id="f-otra-dia" type="date"></label>
          <label>Hora<select id="f-otra-hora"><option>08:15</option><option>13:00</option></select></label>
        </div>
        <label class="slot"><input type="radio" name="reunion" value="no"> Por ahora no, solo quiero la cotización</label>
      </fieldset>
      <label class="hp" aria-hidden="true">Sitio web<input id="f-website" name="website" tabindex="-1" autocomplete="off"></label>
      <button class="btn btn-cta" type="submit" id="f-enviar">Enviar y agendar reunión</button>
      <p id="f-estado" class="estado" role="status" aria-live="polite"></p>
    </form>
  </div>
  <aside class="side"><div class="card sticky">
    <h2 class="h3">¿No sabes qué fuentes elegir?</h2>
    <p class="small">Cuéntale al asesor qué quieres lograr y te deja las APIs seleccionadas en este formulario.</p>
    <button type="button" class="btn-ghost as-lanzar" data-asesor>Pregúntale al asesor</button>
    <h2 class="h3">Qué incluye la integración</h2>
    <ul class="check"><li>Conexión con las fuentes que elijas</li><li>Datos en un solo formato y una sola API</li><li>Gestión de accesos y claves con cada proveedor</li><li>Mantenimiento cuando un proveedor cambia</li></ul>
    <h2 class="h3">¿Prefieres escribirnos?</h2>
    <p class="small">Correo: <b>cotizaciones@agrohubs.cl</b></p>
  </div></aside>
</section>`
  const script = `<script>
(function(){
  var NOMBRES=${nombres};
  var FERIADOS=${JSON.stringify(FERIADOS_CL)};
  var HORAS=['08:15','13:00'];
  var f=document.getElementById('cotizar'), est=document.getElementById('f-estado'), sel=document.getElementById('f-fuentes');
  var qs=new URLSearchParams(location.search);
  var pedidas=(qs.get('apis')||qs.get('api')||'').split(',').map(function(s){return s.trim()}).filter(function(s){return NOMBRES[s]});
  var origen=qs.get('origen')==='asesor'?'asesor':(qs.get('api')?'ficha':'directorio');
  var necesidad=(qs.get('necesidad')||'').slice(0,600);

  // ── APIs preseleccionadas ──
  var caja=document.getElementById('f-elegidas'), lista=caja.querySelector('ul');
  function marcadas(){return [].filter.call(sel.options,function(o){return o.selected}).map(function(o){return o.value})}
  function pintar(){
    var m=marcadas();caja.hidden=!m.length;
    lista.innerHTML=m.map(function(s){return '<li>'+NOMBRES[s].replace(/[&<>]/g,'')+' <button type="button" data-quitar="'+s+'" aria-label="Quitar '+NOMBRES[s].replace(/["&<>]/g,'')+'">×</button></li>'}).join('');
  }
  [].forEach.call(sel.options,function(o){if(pedidas.indexOf(o.value)>=0)o.selected=true});
  // las elegidas primero, para que se vean sin desplazarse
  pedidas.slice().reverse().forEach(function(s){var o=[].find.call(sel.options,function(x){return x.value===s});if(o)sel.insertBefore(o,sel.firstChild)});
  sel.addEventListener('change',pintar);
  lista.addEventListener('click',function(e){var s=e.target.getAttribute('data-quitar');if(!s)return;[].forEach.call(sel.options,function(o){if(o.value===s)o.selected=false});pintar()});
  pintar();
  if(necesidad){document.getElementById('f-mensaje').value='Lo que necesito: '+necesidad+'\\n\\n'}
  if(origen==='asesor'&&pedidas.length){var av=document.getElementById('f-aviso');av.hidden=false;av.textContent='Te dejamos seleccionadas las '+pedidas.length+' APIs que recomendó el asesor. Completa tus datos y elige el horario de la reunión.'}

  // ── Reunión: 2 días hábiles después de hoy (hora de Chile), a las 08:15 o 13:00 ──
  function hoyCL(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}
  function iso(d){return d.toISOString().slice(0,10)}
  function habil(s){var d=new Date(s+'T12:00:00Z').getUTCDay();return d!==0&&d!==6&&FERIADOS.indexOf(s)<0}
  function sumarHabiles(s,n){var d=new Date(s+'T12:00:00Z');while(n>0){d.setUTCDate(d.getUTCDate()+1);if(habil(iso(d)))n--}return iso(d)}
  var DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  function larga(s){var d=new Date(s+'T12:00:00Z');return DIAS[d.getUTCDay()]+' '+d.getUTCDate()+' de '+MESES[d.getUTCMonth()]}
  var dia=sumarHabiles(hoyCL(),2), azar=HORAS[Math.floor(Math.random()*HORAS.length)];
  document.getElementById('f-slots').innerHTML=HORAS.map(function(h){return '<label class="slot"><input type="radio" name="reunion" value="'+dia+' '+h+'"'+(h===azar?' checked':'')+'> <b>'+larga(dia)+'</b>, '+h+' hrs <span class="disp">Disponible</span></label>'}).join('');
  var otra=document.getElementById('f-otra'), otraDia=document.getElementById('f-otra-dia');
  otraDia.min=dia;otraDia.value=sumarHabiles(dia,1);
  f.addEventListener('change',function(e){if(e.target.name==='reunion')otra.hidden=e.target.value!=='otra'});
  function reunion(){
    var r=(f.querySelector('input[name=reunion]:checked')||{}).value||'no';
    if(r==='no')return null;
    if(r==='otra')return {fecha:otraDia.value,hora:document.getElementById('f-otra-hora').value,propuesta:false};
    var p=r.split(' ');return {fecha:p[0],hora:p[1],propuesta:true};
  }

  // Se envía al API de la plataforma y solo cuenta como enviado si responde { ok: true }
  var LEADS_URL='https://api.agrohubs.cl/api/v1/site/leads';
  function enviar(datos){
    return fetch(LEADS_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)})
      .then(function(r){return r.json().catch(function(){return null}).then(function(j){return r.ok&&!!j&&j.ok===true})})
      .catch(function(){return false});
  }
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(id){return document.getElementById(id).value.trim()};
    var email=v('f-email');
    if(!v('f-nombre')||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)){est.className='estado error';est.textContent='Escribe tu nombre y un email válido para poder responderte.';return}
    var rn=reunion();
    if(rn&&(!rn.fecha||rn.fecha<dia||!habil(rn.fecha))){est.className='estado error';est.textContent='Elige un día hábil desde el '+larga(dia)+' (no fines de semana ni feriados).';return}
    var slugs=marcadas(), fuentes=slugs.map(function(s){return NOMBRES[s]||s});
    var resumen=['Origen: '+(origen==='asesor'?'asesor IA del directorio de APIs':'directorio de APIs ('+(pedidas.length===1?'/apis/'+pedidas[0]:'/apis/cotizar')+')')];
    if(v('f-software'))resumen.push('Software: '+v('f-software'));
    if(fuentes.length)resumen.push('Fuentes: '+fuentes.join(', '));
    if(v('f-plazo'))resumen.push('Plazo: '+v('f-plazo'));
    resumen.push(rn?'Reunión: '+larga(rn.fecha)+' de '+rn.fecha.slice(0,4)+' a las '+rn.hora+' (hora de Chile), por confirmar':'Reunión: no por ahora');
    var datos={tipo:'contacto',website:v('f-website'),contacto:{nombre:v('f-nombre'),empresa:v('f-empresa'),cargo:v('f-cargo'),email:email,telefono:v('f-telefono')},
      mensaje:'Cotización de integración de software.\\n'+resumen.join('\\n')+(v('f-mensaje')?'\\n\\n'+v('f-mensaje'):''),resumen:resumen,
      respuestas:{origen:origen,apis:slugs,necesidad:necesidad||null,reunion:rn?{fecha:rn.fecha,hora:rn.hora,zona:'America/Santiago',duracion_min:30}:null}};
    var b=document.getElementById('f-enviar');b.disabled=true;est.className='estado';est.textContent='Enviando…';
    enviar(datos).then(function(ok){
      b.disabled=false;
      if(ok){f.reset();pintar();est.className='estado ok';est.textContent='¡Listo! Recibimos tu solicitud. '+(rn?'Te escribiremos a '+email+' para confirmar la reunión del '+larga(rn.fecha)+' a las '+rn.hora+'.':'Te escribiremos pronto a '+email+'.')}
      else{est.className='estado error';est.textContent='No pudimos enviar el formulario. Inténtalo de nuevo en unos minutos o escríbenos a cotizaciones@agrohubs.cl y te respondemos.'}
    });
  });
})();
</script>`
  html(COTIZAR, page({
    path: COTIZAR, title: 'Cotiza la integración de tu software con datos agrícolas | AgroHubs',
    description: 'Conecta tu sistema con clima, satélite, sensores, riego, precios y más fuentes agrícolas en una sola API. Cuéntanos tu caso, agenda una reunión y te enviamos una propuesta.',
    body, script, jsonld: [serviceLd, breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], ['Cotiza tu integración', COTIZAR]])]
  }))
}

// ── Fichas por API ──
for (const a of APIS) {
  const path = `/apis/${a.slug}`
  const cats = a.categorias.map((s) => cat[s]).filter(Boolean)
  const casos = a.casos_de_uso.map((s) => caso[s]).filter(Boolean)
  const rel = a.relacionadas.map((s) => bySlug[s]).filter(Boolean)
  const mismaCat = APIS.filter((x) => x.slug !== a.slug && x.categorias[0] === a.categorias[0] && !a.relacionadas.includes(x.slug)).sort((x, y) => y.ranking.relevancia - x.ranking.relevancia).slice(0, 3)
  const alternativas = [...rel, ...mismaCat]
  const FAQ = faqs(a)
  const q = cuad[a.radar.cuadrante]
  const c = a.costos
  const getHub = a.endpoints_agrohubs.filter((e) => /^(GET|POST) \/hub/.test(e)).map((e) => e.replace(/ \(.*\)$/, ''))
  const curl = getHub[0] && getHub[0].startsWith('GET') ? `curl "https://api.agrohubs.cl/api/v1${getHub[0].replace(/^GET /, '')}" \\\n  -H "Authorization: Bearer TU_TOKEN_AGROHUBS"` : null
  const registro = a.acceso.registro && !/^(no requiere|n\/a|n\/d|interno)$/i.test(a.acceso.registro) ? a.acceso.registro : null

  const offers = c.mensual_usd == null
    ? { '@type': 'Offer', priceCurrency: 'USD', description: MODELO[c.modelo] }
    : { '@type': 'Offer', price: c.mensual_usd, priceCurrency: 'USD', description: c.plan, priceSpecification: { '@type': 'UnitPriceSpecification', price: c.mensual_usd, priceCurrency: 'USD', unitText: 'MON' } }

  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], [cats[0]?.nombre || 'API', `/apis/categoria/${cats[0]?.slug || ''}`], [a.nombre, path]])}
  <p class="eyebrow">${esc(PAIS[a.pais] || a.pais)} · ${esc(TIPO[a.tipo] || a.tipo)}</p>
  <h1>${esc(a.nombre)}: qué es, cuánto cuesta y cómo conectarla</h1>
  <p class="lead">${esc(a.resumen)}</p>
  <div class="chips">${chipEstado(a)}${chipAnillo(a)}</div>
  <p class="hero-ctas"><a class="btn btn-cta" href="${COTIZAR}?api=${a.slug}">Cotiza su integración</a></p>
</div></section>

<article class="wrap block cols">
<div class="main">
  <div class="tldr" id="resumen"><h2>En resumen</h2><ul>
    <li><b>Qué es:</b> ${esc(a.resumen)}</li>
    <li><b>Cuánto cuesta:</b> ${esc(costoFrase(a))}</li>
    <li><b>Dónde funciona:</b> ${esc(a.alcance)}. Utilidad en Chile ${nivel(a.ranking.chile)} y en Latinoamérica ${nivel(a.ranking.latam)}.</li>
    <li><b>Con AgroHubs:</b> ${esc(ESTADO[a.estado_agrohubs])}.</li>
  </ul></div>

  <section id="que-es"><h2>Qué es ${esc(a.nombre)}</h2>${a.descripcion.map((p) => `<p>${esc(p)}</p>`).join('')}</section>

  ${casos.length ? `<section id="para-que"><h2>Para qué te sirve</h2><ul class="tags big">${casos.map((x) => `<li><a href="/apis/caso-de-uso/${x.slug}">${esc(x.nombre)}</a></li>`).join('')}</ul></section>` : ''}

  <section id="datos"><h2>Qué datos entrega</h2><ul class="check">${a.que_entrega.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>

  <section id="costos"><h2>Cuánto cuesta</h2>
  <div class="table-wrap"><table><tbody>
    <tr><th scope="row">Forma de pago</th><td>${esc(MODELO[c.modelo])}</td></tr>
    <tr><th scope="row">Costo mensual</th><td>${c.mensual_usd == null ? 'No publicado: se cotiza con el proveedor' : c.mensual_usd === 0 ? 'Gratis' : esc(usd(c.mensual_usd))}</td></tr>
    <tr><th scope="row">Costo anual</th><td>${c.anual_usd == null ? 'No publicado: se cotiza con el proveedor' : c.anual_usd === 0 ? 'Gratis' : esc(usd(c.anual_usd))}</td></tr>
    <tr><th scope="row">Plan de referencia</th><td>${esc(c.plan)}</td></tr>
    <tr><th scope="row">De dónde sale el precio</th><td>${esc(VERIF_COSTO[c.verificacion].charAt(0).toUpperCase() + VERIF_COSTO[c.verificacion].slice(1))}</td></tr>
  </tbody></table></div>
  <p class="muted small">Precios en dólares al ${fechaLarga(c.fecha)}. Los valores en libras, euros o reales se convierten a 1,27, 1,08 y 0,18 dólares. El anual es el mensual por 12, sin descuentos. Confirma con el proveedor antes de presupuestar.</p></section>

  <section id="conectar"><h2>Cómo conectarla a tu sistema</h2>
  <h3>Con AgroHubs</h3>
  <p>${esc(ESTADO_TXT[a.estado_agrohubs])}</p>
  <p><a class="btn btn-cta inline" href="${COTIZAR}?api=${a.slug}">Cotiza la integración</a></p>
  <h3>Por tu cuenta</h3>
  <ul>
    <li><b>Acceso:</b> ${esc(a.acceso.auth)}.</li>
    ${registro ? `<li><b>Registro:</b> ${esc(registro)}.</li>` : ''}
    <li><b>Formatos de los datos:</b> ${esc(a.formatos.length ? a.formatos.join(', ') : 'no documentados')}.</li>
    <li><b>Condiciones de uso:</b> ${esc(a.acceso.licencia)}.</li>
    <li><b>Documentación del proveedor:</b> <a href="${esc(a.docs_url)}" rel="noopener" target="_blank">${esc(a.docs_url.replace(/^https?:\/\//, ''))}</a></li>
  </ul>
  ${getHub.length ? `<details class="dev"><summary>Para desarrolladores: cómo se consulta en la API de AgroHubs</summary>
  <ul>${getHub.map((e) => `<li><code>${esc(e)}</code></li>`).join('')}</ul>
  ${curl ? `<pre><code>${esc(curl)}</code></pre>` : ''}
  <p class="small">Documentación completa de la API: <a href="https://api.agrohubs.cl/api-docs" rel="noopener" target="_blank">api.agrohubs.cl/api-docs</a></p></details>` : ''}
  </section>

  <section id="recomendacion"><h2>Qué tan recomendable es</h2>
  <div class="split"><div class="table-wrap"><table><thead><tr><th scope="col">Lista</th><th scope="col" class="num">Puntaje</th><th scope="col" class="num">Lugar</th></tr></thead><tbody>
  ${RANKINGS.map((r) => `<tr><td><a href="/apis/ranking#${r.dim}">${r.nombre}</a></td><td class="num"><span class="meter" style="--v:${a.ranking[r.dim]}"></span>${a.ranking[r.dim]}</td><td class="num">${a.ranking['pos_' + r.dim]} de ${total}</td></tr>`).join('')}
  <tr><td>Precio accesible</td><td class="num"><span class="meter" style="--v:${accesibilidad(a)}"></span>${accesibilidad(a)}</td><td class="num">—</td></tr>
  </tbody></table></div>
  <figure class="spider-box">${scoreRadarSvg(a)}<figcaption class="muted small">Puntajes de ${esc(a.nombre)}, de 0 a 100. Evaluación del equipo AgroHubs.</figcaption></figure></div>
  <p>En el <a href="/apis/radar">mapa de APIs</a> está en la zona <b style="color:${q.color}">${esc(q.nombre)}</b>, nivel <b>${ANILLO[a.radar.anillo]}</b> (punto ${radarNum[a.slug]}): ${esc(ANILLO_TXT[a.radar.anillo])}.</p>
  <div class="radar-box small-radar">${techRadarSvg({ size: 520, highlight: a.slug })}</div></section>

  ${alternativas.length ? `<section id="alternativas"><h2>Alternativas y complementos</h2><ul class="cards">${alternativas.map(card).join('')}</ul></section>` : ''}

  <section id="preguntas"><h2>Preguntas frecuentes sobre ${esc(a.nombre)}</h2>
  <dl class="faq">${FAQ.map((f) => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl></section>

  <p class="muted small">Información ${esc(VERIF[a.verificacion.nivel].toLowerCase())}, revisada el ${fechaLarga(a.verificacion.fecha)}. Sitio del proveedor: <a href="${esc(a.sitio_url)}" rel="noopener" target="_blank">${esc(a.sitio_url.replace(/^https?:\/\//, ''))}</a>.</p>
</div>

<aside class="side">
  <div class="card sticky"><h2 class="h3">Ficha rápida</h2><dl class="facts">
    <div><dt>Proveedor</dt><dd>${esc(a.proveedor)}</dd></div>
    <div><dt>País</dt><dd>${esc(PAIS[a.pais] || a.pais)}</dd></div>
    <div><dt>Funciona en</dt><dd>${esc(a.alcance)}</dd></div>
    <div><dt>Tipo</dt><dd>${esc(TIPO[a.tipo] || a.tipo)}</dd></div>
    <div><dt>Al mes</dt><dd>${c.mensual_usd == null ? 'A pedido' : c.mensual_usd === 0 ? 'Gratis' : esc(usd(c.mensual_usd))}</dd></div>
    <div><dt>Al año</dt><dd>${c.anual_usd == null ? 'A pedido' : c.anual_usd === 0 ? 'Gratis' : esc(usd(c.anual_usd))}</dd></div>
    <div><dt>Con AgroHubs</dt><dd>${esc(ESTADO[a.estado_agrohubs])}</dd></div>
    <div><dt>En Chile</dt><dd>Lugar ${a.ranking.pos_chile} de ${total}</dd></div>
    <div><dt>Actualizado</dt><dd><time datetime="${a.verificacion.fecha}">${fechaLarga(a.verificacion.fecha)}</time></dd></div>
  </dl>
  <a class="btn btn-cta" href="${COTIZAR}?api=${a.slug}">Cotiza su integración</a>
  <a class="btn btn-ghost" href="${esc(a.docs_url)}" rel="noopener" target="_blank">Documentación del proveedor</a>
  <h2 class="h3">Tipo de dato</h2><ul class="tags">${cats.map((x) => `<li><a href="/apis/categoria/${x.slug}">${esc(x.nombre)}</a></li>`).join('')}</ul>
  </div>
</aside>
</article>
${cta(a.slug)}`

  html(path, page({
    path, md: `/apis/${a.slug}.md`, ogType: 'article',
    title: `${a.nombre}: qué es, costo y cómo integrarla | AgroHubs`,
    description: `${a.resumen.slice(0, 125).replace(/\s+\S*$/, '')}… ${c.mensual_usd == null ? 'Precio a pedido.' : c.mensual_usd === 0 ? 'Gratis.' : usd(c.mensual_usd) + ' al mes.'} Cómo conectarla a tu software.`,
    body,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'WebAPI', name: a.nombre, description: a.resumen, url: a.sitio_url, documentation: a.docs_url,
        provider: { '@type': 'Organization', name: a.proveedor }, termsOfService: a.acceso.licencia, areaServed: a.pais === 'GLOBAL' ? 'Mundial' : { '@type': 'Country', name: PAIS[a.pais] },
        offers, audience: { '@type': 'Audience', audienceType: 'Empresas y desarrolladores que integran software agrícola', geographicArea: { '@type': 'Country', name: 'Chile' } },
        additionalProperty: [
          ...RANKINGS.map((r) => ({ '@type': 'PropertyValue', name: r.nombre, value: a.ranking[r.dim], maxValue: 100 })),
          { '@type': 'PropertyValue', name: 'Disponibilidad', value: ANILLO[a.radar.anillo] },
          { '@type': 'PropertyValue', name: 'Costo anual (USD)', value: c.anual_usd ?? 'A pedido' }
        ] },
      { '@context': 'https://schema.org', '@type': 'TechArticle', headline: `${a.nombre}: qué es, cuánto cuesta y cómo conectarla`, description: a.resumen, inLanguage: 'es-CL',
        datePublished: '2026-10-20', dateModified: a.verificacion.fecha, author: orgLd, publisher: orgLd, mainEntityOfPage: SITE + path, about: a.nombre,
        keywords: [a.nombre, a.proveedor, ...cats.map((x) => x.nombre), ...casos.map((x) => x.nombre), 'API agrícola', 'integración', 'Chile'].join(', ') },
      breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], [cats[0]?.nombre || 'API', `/apis/categoria/${cats[0]?.slug || ''}`], [a.nombre, path]]),
      faqLd(FAQ)
    ]
  }))

  // Markdown para motores de IA
  const md = `# ${a.nombre}

> ${a.resumen}

- Proveedor: ${a.proveedor}
- País: ${PAIS[a.pais] || a.pais} · Funciona en: ${a.alcance}
- Tipo: ${TIPO[a.tipo] || a.tipo}
- Costo mensual: ${c.mensual_usd == null ? 'a pedido' : c.mensual_usd === 0 ? 'gratis' : usd(c.mensual_usd)} · Costo anual: ${c.anual_usd == null ? 'a pedido' : c.anual_usd === 0 ? 'gratis' : usd(c.anual_usd)} (${c.plan}; ${VERIF_COSTO[c.verificacion]})
- Forma de pago: ${MODELO[c.modelo]}
- Acceso: ${a.acceso.auth} · Condiciones de uso: ${a.acceso.licencia}
- Evaluación AgroHubs (0–100): ${RANKINGS.map((r) => `${r.nombre.toLowerCase()} ${a.ranking[r.dim]} (lugar ${a.ranking['pos_' + r.dim]} de ${total})`).join('; ')}
- Disponibilidad: ${ANILLO[a.radar.anillo]} (${ANILLO_TXT[a.radar.anillo]}) · Zona: ${q.nombre}
- Con AgroHubs: ${ESTADO[a.estado_agrohubs]}. ${ESTADO_TXT[a.estado_agrohubs]}
- Documentación: ${a.docs_url}
- Ficha: ${SITE}${path}
- Cotizar integración: ${SITE}${COTIZAR}?api=${a.slug}
- Actualizado: ${a.verificacion.fecha}

## Qué es

${a.descripcion.join('\n\n')}

## Para qué sirve

${casos.map((x) => `- ${x.nombre}`).join('\n') || '- —'}

## Qué datos entrega

${a.que_entrega.map((x) => `- ${x}`).join('\n')}

## Preguntas frecuentes

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Alternativas

${alternativas.map((x) => `- [${x.nombre}](${SITE}/apis/${x.slug}): ${x.resumen}`).join('\n') || '- —'}
`
  write(`apis/${a.slug}.md`, md)
}

// ── Tipos de dato y necesidades ──
const listPage = (kind, t) => {
  const base = kind === 'categoria' ? '/apis/categoria/' : '/apis/caso-de-uso/'
  const path = base + t.slug
  const items = APIS.filter((a) => (kind === 'categoria' ? a.categorias : a.casos_de_uso).includes(t.slug)).sort((x, y) => y.ranking.relevancia - x.ranking.relevancia)
  if (!items.length) return
  const cl = items.filter((a) => a.pais === 'CL'), la = items.filter((a) => a.pais !== 'CL' && a.pais !== 'GLOBAL'), gl = items.filter((a) => a.pais === 'GLOBAL')
  const libres = items.filter((a) => a.costos.mensual_usd === 0).length
  const titulo = kind === 'categoria' ? `APIs de ${t.nombre.toLowerCase()} para agricultura` : `${t.nombre}: APIs y fuentes de datos`
  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], [t.nombre, path]])}
  <p class="eyebrow">${kind === 'categoria' ? 'Tipo de dato' : 'Necesidad'}</p>
  <h1>${esc(titulo)}</h1>
  <p class="lead">${esc(t.descripcion)}</p>
</div></section>
<section class="wrap block">
  <div class="tldr"><h2>En resumen</h2><ul>
    <li>${items.length} fuentes: ${cl.length} de Chile, ${la.length} del resto de Latinoamérica y ${gl.length} de alcance mundial.</li>
    <li>${libres} se pueden usar gratis.</li>
    <li>La más recomendada por AgroHubs es ${esc(items[0].nombre)} (${items[0].ranking.relevancia}/100).</li>
  </ul></div>
  ${[['Chile', cl], ['Latinoamérica', la], ['Alcance mundial', gl]].filter(([, l]) => l.length).map(([h, l]) => `<h2>${h}</h2><ul class="cards">${l.map(card).join('')}</ul>`).join('')}
  <h2>Comparación de costos</h2>${costTable(items, 'tabla-' + t.slug)}
</section>
${cta()}`
  html(path, page({
    path, title: `${titulo} (${items.length}) | AgroHubs`, description: `${t.descripcion} ${items.length} fuentes con costo mensual y anual y cómo conectarlas a tu software.`, body, script: SORT_JS,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'ItemList', name: titulo, numberOfItems: items.length, itemListElement: items.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/apis/${a.slug}`, name: a.nombre })) },
      breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], [t.nombre, path]])
    ]
  }))
}
CATEGORIAS.forEach((t) => listPage('categoria', t))
CASOS.forEach((t) => listPage('caso', t))

// ── Integraciones destacadas para la portada del sitio (src/components/Integraciones.jsx) ──
// Las más importantes de Chile y luego de Latinoamérica, según el ranking del catálogo, y el
// resumen por categoría para el diagrama del ecosistema (src/components/EcosystemDiagram.jsx).
{
  const ESTADO_CORTO = { integrada: 'Conectada', proxy: 'Conectada', scheduler: 'Conectada', plataforma: 'Conectada', planificada: 'Próximamente', evaluacion: 'A pedido', enlace: 'Enlace' }
  // "ODEPA — Datos Abiertos" → nombre "ODEPA", detalle "Datos Abiertos" (sin rayas en la portada)
  const fila = (a) => { const [nombre, detalle] = partesNombre(a.nombre); return { slug: a.slug, nombre, detalle, pais: PAIS[a.pais] || a.pais, estado: ESTADO_CORTO[a.estado_agrohubs] || 'A pedido' } }
  const top = (lista, campo) => lista.slice().sort((x, y) => y.ranking[campo] - x.ranking[campo] || x.nombre.localeCompare(y.nombre)).slice(0, 6).map(fila)
  writeFileSync(join(ROOT, 'data', 'apis', 'destacadas.json'), JSON.stringify({
    _nota: 'Generado por scripts/build-apis.mjs (npm run apis): no editar a mano.',
    total_directorio: total,
    chile: top(APIS.filter((a) => a.pais === 'CL'), 'chile'),
    latam: top(APIS.filter((a) => !['CL', 'GLOBAL'].includes(a.pais)), 'latam'),
    categorias: resumenPorCategoria(APIS, CATEGORIAS)
  }, null, 2) + '\n')
}

// ── Catálogo JSON, llms.txt, llms-full.txt ──
write('apis/catalogo.json', JSON.stringify({
  fuente: SITE + '/apis', actualizado: UPDATED, moneda: 'USD', licencia: 'CC BY 4.0 (AgroHubs)', total, cotizar: SITE + COTIZAR,
  niveles: ANILLO,
  // Campos originales (tipo, costos, ranking, radar, estado_agrohubs) se mantienen por compatibilidad;
  // los textos en lenguaje simple van en campos aparte.
  apis: APIS.map((a) => ({
    slug: a.slug, nombre: a.nombre, proveedor: a.proveedor, pais: a.pais, alcance: a.alcance, tipo: a.tipo, categorias: a.categorias, casos_de_uso: a.casos_de_uso, resumen: a.resumen,
    costos: a.costos, ranking: a.ranking, radar: a.radar, estado_agrohubs: a.estado_agrohubs, docs_url: a.docs_url, ficha: `${SITE}/apis/${a.slug}`,
    tipo_texto: TIPO[a.tipo] || a.tipo,
    precio: { forma_de_pago: MODELO[a.costos.modelo], mensual_usd: a.costos.mensual_usd, anual_usd: a.costos.anual_usd, plan: a.costos.plan, origen_del_precio: VERIF_COSTO[a.costos.verificacion] },
    evaluacion: { recomendacion: a.ranking.relevancia, uso_mundial: a.ranking.popularidad, chile: a.ranking.chile, latinoamerica: a.ranking.latam },
    disponibilidad: ANILLO[a.radar.anillo], con_agrohubs: ESTADO[a.estado_agrohubs]
  }))
}, null, 1))

const llms = `# AgroHubs — Directorio de APIs agrícolas

> AgroHubs (www.agrohubs.cl) conecta software con fuentes de datos agrícolas (clima, satélite, suelo, riego, sensores, maquinaria, precios, trazabilidad) en una sola API. Este directorio explica en simple ${total} APIs y herramientas para Chile y Latinoamérica: qué entregan, su costo mensual y anual en dólares, qué tan recomendables son y cómo conectarlas. Actualizado el ${UPDATED}.

Datos clave:
- ${gratis} de ${total} fuentes se pueden usar gratis; ${sinPrecio} no publican precio.
- Fuentes públicas chilenas con conexión directa: INIA Agromet, Dirección Meteorológica de Chile, ODEPA, CIREN/IDE MINAGRI y CONAF.
- Niveles de disponibilidad: ${Object.values(ANILLO).join(', ')}.
- Las recomendaciones (0–100) son una evaluación del equipo AgroHubs.
- Cotizar una integración: ${SITE}${COTIZAR}

## Páginas principales

- [Directorio de APIs agro](${SITE}/apis)
- [Las mejores APIs para Chile y Latinoamérica](${SITE}/apis/ranking)
- [Mapa de APIs](${SITE}/apis/radar)
- [Cotiza tu integración](${SITE}${COTIZAR})
- [Catálogo en JSON](${SITE}/apis/catalogo.json)
- [Texto completo para LLM](${SITE}/llms-full.txt)

## Mejores para Chile

${sortedBy('chile').slice(0, 10).map((a) => `- [${a.nombre}](${SITE}/apis/${a.slug}.md): ${a.resumen}`).join('\n')}

## Todas las fuentes

${sortedBy('relevancia').map((a) => `- [${a.nombre}](${SITE}/apis/${a.slug}.md): ${PAIS[a.pais] || a.pais}; ${a.costos.mensual_usd == null ? 'precio a pedido' : a.costos.mensual_usd === 0 ? 'gratis' : usd(a.costos.mensual_usd) + ' al mes'}; ${ANILLO[a.radar.anillo].toLowerCase()}`).join('\n')}

## Por tipo de dato

${CATEGORIAS.filter((c) => APIS.some((a) => a.categorias.includes(c.slug))).map((c) => `- [${c.nombre}](${SITE}/apis/categoria/${c.slug}): ${c.descripcion}`).join('\n')}

## Por necesidad

${CASOS.filter((c) => APIS.some((a) => a.casos_de_uso.includes(c.slug))).map((c) => `- [${c.nombre}](${SITE}/apis/caso-de-uso/${c.slug}): ${c.descripcion}`).join('\n')}
`
write('llms.txt', llms)
write('llms-full.txt', [llms, ...sortedBy('relevancia').map((a) => readFileSync(join(OUT, a.slug + '.md'), 'utf8'))].join('\n\n---\n\n'))

// ── CSS ──
write('apis/apis.css', readFileSync(join(ROOT, 'scripts', 'apis', 'apis.css'), 'utf8'))

// ── Asesor (chat): catálogo compacto + recomendador por reglas de respaldo ──
{
  const ASESOR_URLS = (process.env.APIS_ASESOR_URL || 'https://api.agrohubs.cl/api/v1/hub/asesor,https://app.agrohubs.cl/api/v1/hub/asesor').split(',').map((u) => u.trim()).filter(Boolean)
  const compacto = APIS.map((a) => ({ s: a.slug, n: a.nombre, r: a.resumen, p: a.pais, c: a.categorias, u: a.casos_de_uso, q: (a.que_entrega || []).slice(0, 4), k: a.ranking.relevancia }))
  const reco = readFileSync(join(ROOT, 'scripts', 'apis', 'recomendador.cjs'), 'utf8')
  const js = readFileSync(join(ROOT, 'scripts', 'apis', 'asesor.client.js'), 'utf8')
    .replace('__CATALOGO__', () => JSON.stringify(compacto).replace(/</g, '\\u003c'))
    .replace('__URLS__', () => JSON.stringify(ASESOR_URLS))
    .replace('__RECOMENDADOR__', () => reco)
  write('apis/asesor.js', js)
}

// ── sitemap.xml y robots.txt ──
const spa = ['/', '/dashboard', '/ai-chat', '/documentos', '/eventos', '/tienda', '/evaluacion', '/terminos']
const urls = [...spa, ...files]
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc><lastmod>${UPDATED}</lastmod><changefreq>${u.startsWith('/apis') ? 'monthly' : 'weekly'}</changefreq><priority>${u === '/' ? '1.0' : u === '/apis' ? '0.9' : u.startsWith('/apis/') ? '0.7' : '0.6'}</priority></url>`).join('\n')}
</urlset>
`)
write('robots.txt', `# www.agrohubs.cl
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

# Buscadores con IA: bienvenidos al directorio de APIs
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE}/sitemap.xml
`)

console.log(`✓ ${files.length} páginas HTML · ${APIS.length} Markdown · llms.txt · llms-full.txt · catalogo.json · sitemap (${urls.length} URLs) · robots.txt`)
