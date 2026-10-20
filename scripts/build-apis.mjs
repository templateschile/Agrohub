// Genera el directorio estático de APIs agro de www.agrohubs.cl en public/ (Vite lo copia a dist/).
// HTML puro (sin JS obligatorio) para buscadores y motores de IA, más llms.txt, Markdown por API,
// catálogo JSON, sitemap.xml y robots.txt.  Uso: node scripts/build-apis.mjs
import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  ROOT, SITE, UPDATED, APIS, CATEGORIAS, CASOS, bySlug, cat, caso, PAIS, ESTADO, TIPO, MODELO, VERIF_COSTO, VERIF,
  ANILLO, ANILLO_TXT, CUADRANTES, cuad, RANKINGS, esc, usd, n, total, page, fechaLarga, breadcrumbLd, faqLd, orgLd,
  crumbs, chipEstado, chipAnillo, costoCelda, sortedBy, faqs, costoFrase, nivel, accesibilidad
} from './apis/lib.mjs'
import { techRadarSvg, scoreRadarSvg, RADAR_ITEMS, radarNum } from './apis/charts.mjs'

const PUB = join(ROOT, 'public')
const OUT = join(PUB, 'apis')
rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'categoria'), { recursive: true })
mkdirSync(join(OUT, 'caso-de-uso'), { recursive: true })
const write = (rel, text) => writeFileSync(join(PUB, rel), text)
const files = []
const html = (path, doc) => { write(path.slice(1) + '.html', doc); files.push(path) }

// ── Cifras globales ──
const gratis = APIS.filter((a) => a.costos.mensual_usd === 0).length
const sinPrecio = APIS.filter((a) => a.costos.mensual_usd == null).length
const chile = APIS.filter((a) => a.pais === 'CL').length
const latam = APIS.filter((a) => a.pais !== 'CL' && a.pais !== 'GLOBAL').length
const stack = APIS.filter((a) => ['adoptar', 'probar'].includes(a.radar.anillo))
const stackMes = stack.reduce((s, a) => s + (a.costos.mensual_usd || 0), 0)
const activas = APIS.filter((a) => ['integrada', 'proxy', 'scheduler', 'plataforma'].includes(a.estado_agrohubs)).length

// ── Bloques reutilizables ──
const card = (a) => `<li class="card api-card">
  <div class="chips">${chipEstado(a)}<span class="chip">${esc(PAIS[a.pais] || a.pais)}</span></div>
  <h3><a href="/apis/${a.slug}">${esc(a.nombre)}</a></h3>
  <p class="muted small">${esc(a.proveedor)}</p>
  <p>${esc(a.resumen)}</p>
  <p class="small"><b>${a.costos.mensual_usd == null ? 'Sin precio público' : a.costos.mensual_usd === 0 ? 'Gratis' : usd(a.costos.mensual_usd) + '/mes'}</b> · Relevancia ${a.ranking.relevancia}/100 · Chile #${a.ranking.pos_chile}</p>
</li>`

const topList = (dim, k = 10) => `<ol class="top">${sortedBy(dim).slice(0, k).map((a) => `<li><a href="/apis/${a.slug}">${esc(a.nombre)}</a><span class="score">${a.ranking[dim]}</span></li>`).join('')}</ol>`

const costTable = (list, id = 'tabla-costos') => `<div class="table-wrap"><table id="${id}" class="sortable">
<caption class="sr">Costo mensual y anual de cada API en dólares</caption>
<thead><tr>
<th scope="col" data-type="text">API</th><th scope="col" data-type="text">País</th><th scope="col" data-type="text">Modelo</th>
<th scope="col" class="num" data-type="num">US$/mes</th><th scope="col" class="num" data-type="num">US$/año</th>
<th scope="col" class="num" data-type="num">Relevancia</th><th scope="col" class="num" data-type="num">#Chile</th><th scope="col" class="num" data-type="num">#LatAm</th>
<th scope="col" data-type="text">Radar</th></tr></thead>
<tbody>${list.map((a) => `<tr>
<td><a href="/apis/${a.slug}">${esc(a.nombre)}</a></td><td>${esc(PAIS[a.pais] || a.pais)}</td><td>${esc(MODELO[a.costos.modelo])}</td>
<td class="num" data-v="${a.costos.mensual_usd ?? ''}">${costoCelda(a, 'mensual_usd')}</td><td class="num" data-v="${a.costos.anual_usd ?? ''}">${costoCelda(a, 'anual_usd')}</td>
<td class="num">${a.ranking.relevancia}</td><td class="num">${a.ranking.pos_chile}</td><td class="num">${a.ranking.pos_latam}</td>
<td><span class="chip ring-${a.radar.anillo}">${ANILLO[a.radar.anillo]}</span></td></tr>`).join('')}</tbody></table></div>`

const radarLegend = () => `<div class="legend">${CUADRANTES.map((q, qi) => `<section><h3><span class="dot" style="background:${q.color}"></span>${esc(q.nombre)}</h3>
${['adoptar', 'probar', 'evaluar', 'resistir'].map((r) => {
  const items = RADAR_ITEMS.filter((it) => it.q === qi && it.a.radar.anillo === r)
  return items.length ? `<h4>${ANILLO[r]}</h4><ol>${items.map((it) => `<li><span class="num">${it.n}</span><a href="/apis/${it.a.slug}">${esc(it.a.nombre)}</a></li>`).join('')}</ol>` : ''
}).join('')}</section>`).join('')}</div>`

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
  name: 'Catálogo de APIs agrícolas de AgroHubs',
  description: `Catálogo de ${total} APIs y fuentes de datos agrícolas (clima, satélite, suelo, riego, sensores, precios, trazabilidad) con costo mensual y anual en dólares, rankings de relevancia, popularidad, Chile y Latinoamérica, y posición en el radar tecnológico.`,
  url: SITE + '/apis', inLanguage: 'es-CL', dateModified: UPDATED, creator: orgLd, license: 'https://creativecommons.org/licenses/by/4.0/',
  spatialCoverage: [{ '@type': 'Country', name: 'Chile' }, { '@type': 'Place', name: 'Latinoamérica' }],
  distribution: [
    { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: SITE + '/apis/catalogo.json' },
    { '@type': 'DataDownload', encodingFormat: 'text/markdown', contentUrl: SITE + '/llms-full.txt' }
  ]
}

// ── /apis (landing) ──
{
  const faqLanding = [
    { q: '¿Cuáles son las mejores APIs agrícolas para Chile?', a: `Según el ranking Chile de AgroHubs: ${sortedBy('chile').slice(0, 5).map((a) => a.nombre).join(', ')}. INIA Agromet, ODEPA, CIREN y la DMC son fuentes públicas chilenas con acceso gratuito.` },
    { q: '¿Qué APIs agrícolas son gratuitas?', a: `${gratis} de las ${total} APIs del directorio cuestan US$0 al mes para el uso que necesita un hub agrícola, entre ellas INIA Agromet, ODEPA, CIREN, CONAF, Copernicus Data Space y NASA Earthdata.` },
    { q: '¿Cuánto cuesta un stack de APIs para una plataforma agrícola?', a: `El stack que AgroHubs usa o pilotea (anillos Adoptar y Probar del radar, ${stack.length} APIs) cuesta ${usd(stackMes)} al mes y ${usd(stackMes * 12)} al año en las APIs con precio publicado. Las APIs de maquinaria, riego y sensores de marca se cotizan aparte.` },
    { q: '¿Qué es el radar de APIs de AgroHubs?', a: 'Es una clasificación de cada API en cuatro anillos: Adoptar (en uso o lista para producción), Probar (piloto próximo), Evaluar (seguir de cerca) y Resistir (evitar o reemplazar), repartidos en cuatro cuadrantes temáticos.' },
    { q: '¿Cómo se usan estas APIs desde AgroHubs?', a: 'La API central de AgroHubs (Hub de Integraciones) traduce cada proveedor a un formato común: pronósticos, estaciones, observaciones, precios y geodatos se consultan con un solo endpoint por tipo de dato, sin exponer credenciales.' }
  ]
  const body = `
<section class="hero"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis']])}
  <p class="eyebrow">Directorio · Chile y Latinoamérica</p>
  <h1>APIs agrícolas para Chile y Latinoamérica: costos, rankings y radar</h1>
  <p class="lead">${total} APIs y fuentes de datos para el agro explicadas en simple: qué entregan, cuánto cuestan al mes y al año, qué tan relevantes son en Chile y en la región, y si ya están conectadas a la plataforma AgroHubs.</p>
  <dl class="kpis">
    <div><dt>APIs documentadas</dt><dd>${total}</dd></div>
    <div><dt>Gratuitas</dt><dd>${gratis}</dd></div>
    <div><dt>Fuentes chilenas</dt><dd>${chile}</dd></div>
    <div><dt>Stack recomendado</dt><dd>${usd(stackMes)}<small>/mes</small></dd></div>
  </dl>
</div></section>

<section class="wrap block" id="resumen">
  <div class="tldr"><h2>En resumen</h2><ul>
    <li>Chile tiene cinco fuentes públicas con API real y gratuita: INIA Agromet, la Dirección Meteorológica, ODEPA, CIREN/IDE MINAGRI y CONAF.</li>
    <li>${gratis} de ${total} APIs cuestan US$0; ${sinPrecio} no publican precio (maquinaria, riego y sensores de marca se negocian por convenio).</li>
    <li>El stack que AgroHubs usa o pilotea cuesta ${usd(stackMes)} al mes (${usd(stackMes * 12)} al año) en precios publicados.</li>
    <li>${activas} integraciones ya funcionan dentro de la plataforma AgroHubs.</li>
  </ul><p class="muted small">Actualizado el ${fechaLarga(UPDATED)}. Puntajes estimados por AgroHubs a partir de su investigación; cada ficha indica de dónde sale su precio.</p></div>
</section>

<section class="wrap block" id="rankings">
  <h2>Rankings</h2>
  <p class="muted">Cuatro miradas sobre las mismas ${total} APIs. Puntaje de 0 a 100. <a href="/apis/ranking">Ver los rankings completos</a>.</p>
  <div class="grid4">${RANKINGS.map((r) => `<section class="card"><h3>${r.nombre}</h3><p class="muted small">${esc(r.txt.charAt(0).toUpperCase() + r.txt.slice(1))}.</p>${topList(r.dim)}</section>`).join('')}</div>
</section>

<section class="wrap block" id="radar">
  <h2>Radar de APIs agro</h2>
  <p class="muted">Cada punto es una API. El anillo indica qué hacer con ella; el color, su cuadrante. Haz clic en un punto para abrir su ficha. <a href="/apis/radar">Abrir el radar completo con su leyenda</a>.</p>
  <div class="radar-box">${techRadarSvg()}</div>
</section>

<section class="wrap block" id="costos">
  <h2>Costo mensual y anual de cada API</h2>
  <p class="muted">Plan de entrada recomendado para AgroHubs, en dólares. El costo anual es el mensual por 12, sin descuentos. Haz clic en un encabezado para ordenar.</p>
  <label class="filter"><span class="sr">Filtrar APIs</span><input id="filtro" type="search" placeholder="Filtrar por nombre, país o modelo"></label>
  ${costTable(sortedBy('relevancia'))}
</section>

<section class="wrap block" id="categorias">
  <h2>APIs por categoría</h2>
  <ul class="links">${CATEGORIAS.map((c) => `<li><a href="/apis/categoria/${c.slug}">${esc(c.nombre)}</a> <span class="muted">${APIS.filter((a) => a.categorias.includes(c.slug)).length}</span></li>`).join('')}</ul>
  <h2>APIs por caso de uso</h2>
  <ul class="links">${CASOS.map((c) => `<li><a href="/apis/caso-de-uso/${c.slug}">${esc(c.nombre)}</a> <span class="muted">${APIS.filter((a) => a.casos_de_uso.includes(c.slug)).length}</span></li>`).join('')}</ul>
</section>

<section class="wrap block" id="preguntas">
  <h2>Preguntas frecuentes</h2>
  <dl class="faq">${faqLanding.map((f) => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl>
  <p class="muted small">Para asistentes de IA y buscadores: <a href="/llms.txt">llms.txt</a>, <a href="/llms-full.txt">llms-full.txt</a> y <a href="/apis/catalogo.json">catálogo en JSON</a>.</p>
</section>`
  html('/apis', page({
    path: '/apis', title: 'APIs agrícolas para Chile y Latinoamérica: costos, ranking y radar | AgroHubs',
    description: `Directorio de ${total} APIs agro con costo mensual y anual, ranking Chile y LatAm, más populares y radar tecnológico. Clima, satélite, suelo, riego, sensores y precios.`,
    body, script: SORT_JS,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'APIs agrícolas para Chile y Latinoamérica', url: SITE + '/apis', inLanguage: 'es-CL', dateModified: UPDATED, publisher: orgLd, about: 'APIs y fuentes de datos agrícolas',
        mainEntity: { '@type': 'ItemList', numberOfItems: total, itemListOrder: 'https://schema.org/ItemListOrderDescending', itemListElement: sortedBy('relevancia').map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/apis/${a.slug}`, name: a.nombre })) } },
      datasetLd, breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis']]), faqLd(faqLanding)
    ]
  }))
}

// ── /apis/ranking ──
{
  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], ['Ranking y costos', '/apis/ranking']])}
  <h1>Ranking de APIs agrícolas: relevancia, popularidad, Chile y Latinoamérica</h1>
  <p class="lead">Las ${total} APIs del directorio ordenadas de cuatro formas, con su costo mensual y anual en dólares.</p>
</div></section>
<section class="wrap block">
  <div class="tldr"><h2>En resumen</h2><ul>${RANKINGS.map((r) => { const t = sortedBy(r.dim).slice(0, 3); return `<li><b>${r.nombre}:</b> ${t.map((a) => esc(a.nombre)).join(', ')}.</li>` }).join('')}</ul></div>
  <h2>Cómo se puntúa</h2>
  <ul>${RANKINGS.map((r) => `<li><b>${r.nombre}</b>: ${esc(r.txt)}.</li>`).join('')}</ul>
  <p class="muted small">Puntajes de 0 a 100 estimados por el equipo de AgroHubs con la investigación de octubre de 2026. No son mediciones de tráfico ni encuestas.</p>
</section>
${RANKINGS.map((r) => `<section class="wrap block" id="${r.dim}"><h2>${r.nombre}</h2>
<div class="table-wrap"><table><thead><tr><th scope="col" class="num">#</th><th scope="col">API</th><th scope="col">País</th><th scope="col" class="num">Puntaje</th><th scope="col" class="num">US$/mes</th><th scope="col" class="num">US$/año</th></tr></thead>
<tbody>${sortedBy(r.dim).map((a) => `<tr><td class="num">${a.ranking['pos_' + r.dim]}</td><td><a href="/apis/${a.slug}">${esc(a.nombre)}</a></td><td>${esc(PAIS[a.pais] || a.pais)}</td><td class="num"><span class="meter" style="--v:${a.ranking[r.dim]}"></span>${a.ranking[r.dim]}</td><td class="num">${costoCelda(a, 'mensual_usd')}</td><td class="num">${costoCelda(a, 'anual_usd')}</td></tr>`).join('')}</tbody></table></div></section>`).join('')}`
  html('/apis/ranking', page({
    path: '/apis/ranking', title: 'Ranking de APIs agrícolas en Chile y Latinoamérica | AgroHubs',
    description: `Ranking de ${total} APIs agro por relevancia de servicio, popularidad, Chile y Latinoamérica, con costo mensual y anual en dólares.`,
    body,
    jsonld: [
      ...RANKINGS.map((r) => ({ '@context': 'https://schema.org', '@type': 'ItemList', name: `${r.nombre} de APIs agrícolas`, itemListOrder: 'https://schema.org/ItemListOrderAscending', numberOfItems: total,
        itemListElement: sortedBy(r.dim).slice(0, 20).map((a) => ({ '@type': 'ListItem', position: a.ranking['pos_' + r.dim], url: `${SITE}/apis/${a.slug}`, name: a.nombre })) })),
      breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], ['Ranking y costos', '/apis/ranking']])
    ]
  }))
}

// ── /apis/radar ──
{
  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], ['Radar', '/apis/radar']])}
  <h1>Radar tecnológico de APIs agro</h1>
  <p class="lead">Qué APIs adoptar, probar, evaluar o evitar para una plataforma agrícola en Chile, en cuatro cuadrantes: clima, suelo y agua; satélite y territorio; campo conectado; mercados, datos y plataforma.</p>
</div></section>
<section class="wrap block">
  <div class="tldr"><h2>En resumen</h2><ul>
  ${['adoptar', 'probar', 'evaluar', 'resistir'].map((r) => { const l = APIS.filter((a) => a.radar.anillo === r); return `<li><b>${ANILLO[r]} (${l.length}):</b> ${esc(ANILLO_TXT[r])}. Ejemplos: ${l.sort((x, y) => y.ranking.relevancia - x.ranking.relevancia).slice(0, 4).map((a) => esc(a.nombre)).join(', ')}.</li>` }).join('')}
  </ul></div>
  <div class="radar-box">${techRadarSvg({ size: 760 })}</div>
  <h2>Leyenda</h2>
  <p class="muted">El número coincide con el punto del radar.</p>
  ${radarLegend()}
</section>`
  html('/apis/radar', page({
    path: '/apis/radar', title: 'Radar tecnológico de APIs agrícolas: adoptar, probar, evaluar, resistir | AgroHubs',
    description: `Radar de ${total} APIs agro para Chile y Latinoamérica clasificadas en Adoptar, Probar, Evaluar y Resistir, por cuadrante temático.`,
    body,
    jsonld: [breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], ['Radar', '/apis/radar']])]
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
  const cuandoUsar = casos.map((x) => x.nombre.toLowerCase()).join(', ')
  const firstGet = a.endpoints_agrohubs.find((e) => e.startsWith('GET /hub'))
  const curl = firstGet ? `curl "https://app.agrohubs.cl/api/v1${firstGet.replace(/^GET /, '').replace(/ \(.*\)$/, '')}" \\\n  -H "Authorization: Bearer $TOKEN_AGROHUBS"` : null

  const offers = c.mensual_usd == null
    ? { '@type': 'Offer', priceCurrency: 'USD', description: c.plan, availability: 'https://schema.org/InStock' }
    : { '@type': 'Offer', price: c.mensual_usd, priceCurrency: 'USD', description: c.plan, priceSpecification: { '@type': 'UnitPriceSpecification', price: c.mensual_usd, priceCurrency: 'USD', unitText: 'MON' } }

  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], [cats[0]?.nombre || 'API', `/apis/categoria/${cats[0]?.slug || ''}`], [a.nombre, path]])}
  <p class="eyebrow">${esc(PAIS[a.pais] || a.pais)} · ${esc(TIPO[a.tipo] || a.tipo)}</p>
  <h1>${esc(a.nombre)}: qué es, cuánto cuesta y cómo usarla</h1>
  <p class="lead">${esc(a.resumen)}</p>
  <div class="chips">${chipEstado(a)}${chipAnillo(a)}<span class="chip">${esc(VERIF[a.verificacion.nivel])}</span></div>
</div></section>

<article class="wrap block cols">
<div class="main">
  <div class="tldr" id="resumen"><h2>En resumen</h2><ul>
    <li><b>Qué es:</b> ${esc(a.resumen)}</li>
    <li><b>Costo:</b> ${esc(costoFrase(a))}</li>
    <li><b>Cobertura:</b> ${esc(a.alcance)}. Relevancia en Chile ${nivel(a.ranking.chile)} (#${a.ranking.pos_chile} de ${total}) y en Latinoamérica ${nivel(a.ranking.latam)} (#${a.ranking.pos_latam}).</li>
    <li><b>En AgroHubs:</b> ${esc(ESTADO[a.estado_agrohubs])}. En el radar está en <b>${ANILLO[a.radar.anillo]}</b>: ${esc(ANILLO_TXT[a.radar.anillo])}.</li>
  </ul></div>

  <section id="que-es"><h2>Qué es ${esc(a.nombre)} y para qué sirve</h2>${a.descripcion.map((p) => `<p>${esc(p)}</p>`).join('')}
  ${cuandoUsar ? `<p>Se usa principalmente para ${esc(cuandoUsar)}.</p>` : ''}</section>

  <section id="datos"><h2>Qué datos entrega</h2><ul class="check">${a.que_entrega.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>

  <section id="costos"><h2>Cuánto cuesta ${esc(a.nombre)}</h2>
  <div class="table-wrap"><table><thead><tr><th scope="col">Concepto</th><th scope="col">Valor</th></tr></thead><tbody>
    <tr><td>Modelo de cobro</td><td>${esc(MODELO[c.modelo])}</td></tr>
    <tr><td>Costo mensual</td><td>${c.mensual_usd == null ? 'Sin precio público' : esc(usd(c.mensual_usd))}</td></tr>
    <tr><td>Costo anual</td><td>${c.anual_usd == null ? 'Sin precio público' : esc(usd(c.anual_usd))}</td></tr>
    <tr><td>Plan de referencia</td><td>${esc(c.plan)}</td></tr>
    <tr><td>Origen del precio</td><td>${esc(VERIF_COSTO[c.verificacion])}</td></tr>
    <tr><td>Precio publicado por el proveedor</td><td>${esc(a.acceso.costo)}</td></tr>
  </tbody></table></div>
  <p class="muted small">Costos en dólares al ${fechaLarga(c.fecha)}. Precios en libras, euros o reales se convierten a 1,27, 1,08 y 0,18 US$ respectivamente. El anual es el mensual por 12, sin descuentos. Verifica en el sitio del proveedor antes de presupuestar.</p></section>

  <section id="ranking"><h2>Posición en los rankings de AgroHubs</h2>
  <div class="split"><div class="table-wrap"><table><thead><tr><th scope="col">Ranking</th><th scope="col" class="num">Puntaje</th><th scope="col" class="num">Lugar</th></tr></thead><tbody>
  ${RANKINGS.map((r) => `<tr><td><a href="/apis/ranking#${r.dim}">${r.nombre}</a></td><td class="num"><span class="meter" style="--v:${a.ranking[r.dim]}"></span>${a.ranking[r.dim]}</td><td class="num">${a.ranking['pos_' + r.dim]} de ${total}</td></tr>`).join('')}
  <tr><td>Accesibilidad de costo</td><td class="num"><span class="meter" style="--v:${accesibilidad(a)}"></span>${accesibilidad(a)}</td><td class="num">—</td></tr>
  </tbody></table></div>
  <figure class="spider-box">${scoreRadarSvg(a)}<figcaption class="muted small">Radar de puntajes de ${esc(a.nombre)} (0 a 100).</figcaption></figure></div></section>

  <section id="radar"><h2>Dónde está en el radar de APIs</h2>
  <p>${esc(a.nombre)} está en el cuadrante <b style="color:${q.color}">${esc(q.nombre)}</b>, anillo <b>${ANILLO[a.radar.anillo]}</b> (punto ${radarNum[a.slug]}): ${esc(ANILLO_TXT[a.radar.anillo])}.</p>
  <div class="radar-box small-radar">${techRadarSvg({ size: 520, highlight: a.slug })}</div>
  <p><a href="/apis/radar">Ver el radar completo</a></p></section>

  <section id="integrar"><h2>Cómo integrar ${esc(a.nombre)}</h2>
  <ol class="steps">
    <li><b>Acceso:</b> ${esc(a.acceso.auth)}. ${esc(a.acceso.registro && a.acceso.registro !== 'No requiere' ? 'Registro: ' + a.acceso.registro + '.' : 'No requiere registro.')}</li>
    <li><b>Formatos:</b> ${esc(a.formatos.length ? a.formatos.join(', ') : 'no documentados')}.</li>
    ${a.endpoints_agrohubs.length ? `<li><b>Desde AgroHubs:</b> la API central ya la expone con un formato común:<ul>${a.endpoints_agrohubs.map((e) => `<li><code>${esc(e)}</code></li>`).join('')}</ul></li>` : `<li><b>Desde AgroHubs:</b> aún no tiene endpoint propio. Estado: ${esc(ESTADO[a.estado_agrohubs].toLowerCase())}.</li>`}
    ${a.env.length ? `<li><b>Configuración del servidor:</b> ${a.env.map((v) => `<code>${esc(v)}</code>`).join(', ')}.</li>` : ''}
  </ol>
  ${curl ? `<pre><code>${esc(curl)}</code></pre>` : ''}
  <p class="muted small">Licencia o términos de uso: ${esc(a.acceso.licencia)}.</p></section>

  ${alternativas.length ? `<section id="alternativas"><h2>Alternativas y complementos</h2><ul class="cards">${alternativas.map(card).join('')}</ul></section>` : ''}

  <section id="preguntas"><h2>Preguntas frecuentes sobre ${esc(a.nombre)}</h2>
  <dl class="faq">${FAQ.map((f) => `<div><dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd></div>`).join('')}</dl></section>

  <section id="fuentes"><h2>Fuentes y verificación</h2>
  <ul><li>Documentación oficial: <a href="${esc(a.docs_url)}" rel="noopener" target="_blank">${esc(a.docs_url)}</a></li>
  <li>Sitio del proveedor: <a href="${esc(a.sitio_url)}" rel="noopener" target="_blank">${esc(a.sitio_url)}</a></li>
  <li>Estado de verificación: ${esc(VERIF[a.verificacion.nivel])} (${fechaLarga(a.verificacion.fecha)}). ${esc(a.verificacion.nota)}</li>
  <li>Versión para motores de IA: <a href="/apis/${a.slug}.md">${a.slug}.md</a></li></ul></section>
</div>

<aside class="side">
  <div class="card sticky"><h2 class="h3">Ficha técnica</h2><dl class="facts">
    <div><dt>Proveedor</dt><dd>${esc(a.proveedor)}</dd></div>
    <div><dt>País</dt><dd>${esc(PAIS[a.pais] || a.pais)}</dd></div>
    <div><dt>Cobertura</dt><dd>${esc(a.alcance)}</dd></div>
    <div><dt>Tipo</dt><dd>${esc(TIPO[a.tipo] || a.tipo)}</dd></div>
    <div><dt>US$/mes</dt><dd>${c.mensual_usd == null ? 'Sin precio público' : esc(usd(c.mensual_usd))}</dd></div>
    <div><dt>US$/año</dt><dd>${c.anual_usd == null ? 'Sin precio público' : esc(usd(c.anual_usd))}</dd></div>
    <div><dt>Autenticación</dt><dd>${esc(a.acceso.auth)}</dd></div>
    <div><dt>Licencia</dt><dd>${esc(a.acceso.licencia)}</dd></div>
    <div><dt>Ranking Chile</dt><dd>#${a.ranking.pos_chile} de ${total}</dd></div>
    <div><dt>Ranking LatAm</dt><dd>#${a.ranking.pos_latam} de ${total}</dd></div>
    <div><dt>Actualizado</dt><dd><time datetime="${a.verificacion.fecha}">${fechaLarga(a.verificacion.fecha)}</time></dd></div>
  </dl>
  <a class="btn" href="${esc(a.docs_url)}" rel="noopener" target="_blank">Documentación oficial</a>
  <h2 class="h3">Categorías</h2><ul class="tags">${cats.map((x) => `<li><a href="/apis/categoria/${x.slug}">${esc(x.nombre)}</a></li>`).join('')}</ul>
  <h2 class="h3">Casos de uso</h2><ul class="tags">${casos.map((x) => `<li><a href="/apis/caso-de-uso/${x.slug}">${esc(x.nombre)}</a></li>`).join('')}</ul>
  </div>
</aside>
</article>`

  html(path, page({
    path, md: `/apis/${a.slug}.md`, ogType: 'article',
    title: `${a.nombre}: qué es, costo y cómo usarla en Chile | AgroHubs`,
    description: `${a.resumen.slice(0, 120).replace(/\s+\S*$/, '')}… ${c.mensual_usd == null ? 'Sin precio público.' : c.mensual_usd === 0 ? 'Gratis.' : usd(c.mensual_usd) + '/mes.'} Ranking Chile #${a.ranking.pos_chile}.`,
    body,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'WebAPI', name: a.nombre, description: a.resumen, url: a.sitio_url, documentation: a.docs_url,
        provider: { '@type': 'Organization', name: a.proveedor }, termsOfService: a.acceso.licencia, areaServed: a.pais === 'GLOBAL' ? 'Mundial' : { '@type': 'Country', name: PAIS[a.pais] },
        offers, audience: { '@type': 'Audience', audienceType: 'Agricultores, asesores y desarrolladores agtech', geographicArea: { '@type': 'Country', name: 'Chile' } },
        additionalProperty: [
          ...RANKINGS.map((r) => ({ '@type': 'PropertyValue', name: `Puntaje ${r.corto}`, value: a.ranking[r.dim], maxValue: 100 })),
          { '@type': 'PropertyValue', name: 'Anillo del radar', value: ANILLO[a.radar.anillo] },
          { '@type': 'PropertyValue', name: 'Costo anual (USD)', value: c.anual_usd ?? 'Sin precio público' }
        ] },
      { '@context': 'https://schema.org', '@type': 'TechArticle', headline: `${a.nombre}: qué es, cuánto cuesta y cómo usarla`, description: a.resumen, inLanguage: 'es-CL',
        datePublished: '2026-10-20', dateModified: a.verificacion.fecha, author: orgLd, publisher: orgLd, mainEntityOfPage: SITE + path, about: a.nombre,
        keywords: [a.nombre, a.proveedor, ...cats.map((x) => x.nombre), ...casos.map((x) => x.nombre), 'API agrícola', 'Chile'].join(', ') },
      breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], [cats[0]?.nombre || 'API', `/apis/categoria/${cats[0]?.slug || ''}`], [a.nombre, path]]),
      faqLd(FAQ)
    ]
  }))

  // Markdown para motores de IA
  const md = `# ${a.nombre}

> ${a.resumen}

- Proveedor: ${a.proveedor}
- País: ${PAIS[a.pais] || a.pais} · Cobertura: ${a.alcance}
- Tipo: ${TIPO[a.tipo] || a.tipo}
- Costo mensual: ${c.mensual_usd == null ? 'sin precio público' : usd(c.mensual_usd)} · Costo anual: ${c.anual_usd == null ? 'sin precio público' : usd(c.anual_usd)} (${c.plan}; ${VERIF_COSTO[c.verificacion]})
- Modelo de cobro: ${MODELO[c.modelo]}
- Autenticación: ${a.acceso.auth} · Licencia: ${a.acceso.licencia}
- Rankings AgroHubs (0–100): relevancia ${a.ranking.relevancia} (#${a.ranking.pos_relevancia}), popularidad ${a.ranking.popularidad} (#${a.ranking.pos_popularidad}), Chile ${a.ranking.chile} (#${a.ranking.pos_chile}), Latinoamérica ${a.ranking.latam} (#${a.ranking.pos_latam}) de ${total}
- Radar: ${ANILLO[a.radar.anillo]} · cuadrante ${q.nombre}
- Estado en AgroHubs: ${ESTADO[a.estado_agrohubs]}
- Documentación: ${a.docs_url}
- Ficha: ${SITE}${path}
- Actualizado: ${a.verificacion.fecha} (${VERIF[a.verificacion.nivel]}: ${a.verificacion.nota})

## Qué es

${a.descripcion.join('\n\n')}

## Qué datos entrega

${a.que_entrega.map((x) => `- ${x}`).join('\n')}

## Endpoints en AgroHubs

${a.endpoints_agrohubs.length ? a.endpoints_agrohubs.map((e) => `- \`${e}\``).join('\n') : '- Sin endpoint propio todavía.'}

## Preguntas frecuentes

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Alternativas

${alternativas.map((x) => `- [${x.nombre}](${SITE}/apis/${x.slug}): ${x.resumen}`).join('\n') || '- —'}
`
  write(`apis/${a.slug}.md`, md)
}

// ── Categorías y casos de uso ──
const listPage = (kind, t) => {
  const base = kind === 'categoria' ? '/apis/categoria/' : '/apis/caso-de-uso/'
  const path = base + t.slug
  const items = APIS.filter((a) => (kind === 'categoria' ? a.categorias : a.casos_de_uso).includes(t.slug)).sort((x, y) => y.ranking.relevancia - x.ranking.relevancia)
  const cl = items.filter((a) => a.pais === 'CL'), la = items.filter((a) => a.pais !== 'CL' && a.pais !== 'GLOBAL'), gl = items.filter((a) => a.pais === 'GLOBAL')
  const mes = items.filter((a) => a.costos.mensual_usd === 0).length
  const titulo = kind === 'categoria' ? `APIs de ${t.nombre.toLowerCase()} para agricultura` : `${t.nombre}: APIs y fuentes de datos agrícolas`
  const body = `<section class="hero slim"><div class="wrap">
  ${crumbs([['Inicio', '/'], ['APIs agro', '/apis'], [t.nombre, path]])}
  <p class="eyebrow">${kind === 'categoria' ? 'Categoría' : 'Caso de uso'}</p>
  <h1>${esc(titulo)}</h1>
  <p class="lead">${esc(t.descripcion)}</p>
</div></section>
<section class="wrap block">
  <div class="tldr"><h2>En resumen</h2><ul>
    <li>${items.length} APIs en el directorio; ${cl.length} de Chile, ${la.length} del resto de Latinoamérica y ${gl.length} globales.</li>
    <li>${mes} son gratuitas para el uso de un hub agrícola.</li>
    ${items[0] ? `<li>La más relevante para AgroHubs es ${esc(items[0].nombre)} (${items[0].ranking.relevancia}/100).</li>` : ''}
  </ul></div>
  ${[['Chile', cl], ['Latinoamérica', la], ['Global', gl]].filter(([, l]) => l.length).map(([h, l]) => `<h2>${h}</h2><ul class="cards">${l.map(card).join('')}</ul>`).join('')}
  <h2>Comparación de costos</h2>${costTable(items, 'tabla-' + t.slug)}
</section>`
  html(path, page({
    path, title: `${titulo} (${items.length}) | AgroHubs`, description: `${t.descripcion} ${items.length} APIs con costo mensual y anual, ranking Chile y LatAm.`, body, script: SORT_JS,
    jsonld: [
      { '@context': 'https://schema.org', '@type': 'ItemList', name: titulo, numberOfItems: items.length, itemListElement: items.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/apis/${a.slug}`, name: a.nombre })) },
      breadcrumbLd([['Inicio', '/'], ['APIs agro', '/apis'], [t.nombre, path]])
    ]
  }))
}
CATEGORIAS.forEach((t) => listPage('categoria', t))
CASOS.forEach((t) => listPage('caso', t))

// ── Catálogo JSON, llms.txt, llms-full.txt ──
write('apis/catalogo.json', JSON.stringify({
  fuente: SITE + '/apis', actualizado: UPDATED, moneda: 'USD', licencia: 'CC BY 4.0 (AgroHubs)', total,
  apis: APIS.map((a) => ({ slug: a.slug, nombre: a.nombre, proveedor: a.proveedor, pais: a.pais, alcance: a.alcance, tipo: a.tipo, categorias: a.categorias, casos_de_uso: a.casos_de_uso, resumen: a.resumen, costos: a.costos, ranking: a.ranking, radar: a.radar, estado_agrohubs: a.estado_agrohubs, docs_url: a.docs_url, ficha: `${SITE}/apis/${a.slug}` }))
}, null, 1))

const llms = `# AgroHubs — Directorio de APIs agrícolas

> AgroHubs (www.agrohubs.cl) es la red chilena de hubs tecnológicos agrícolas. Este directorio documenta ${total} APIs y fuentes de datos para el agro de Chile y Latinoamérica (clima, satélite, suelo, riego, sensores, maquinaria, precios, trazabilidad), con costo mensual y anual en dólares, rankings de relevancia, popularidad, Chile y Latinoamérica, y un radar tecnológico (Adoptar, Probar, Evaluar, Resistir). Actualizado el ${UPDATED}.

Datos clave:
- ${gratis} de ${total} APIs cuestan US$0 al mes; ${sinPrecio} no publican precio.
- Fuentes públicas chilenas con API: INIA Agromet, Dirección Meteorológica de Chile, ODEPA, CIREN/IDE MINAGRI y CONAF-GEPRIF.
- Stack recomendado por AgroHubs (anillos Adoptar y Probar): ${usd(stackMes)} al mes, ${usd(stackMes * 12)} al año en precios publicados.
- Los puntajes (0–100) son estimaciones del equipo AgroHubs; cada ficha indica el origen del precio.

## Páginas principales

- [Directorio de APIs agro](${SITE}/apis): costos, rankings y radar en una página
- [Ranking y costos](${SITE}/apis/ranking): las ${total} APIs en cuatro rankings
- [Radar tecnológico](${SITE}/apis/radar): Adoptar, Probar, Evaluar, Resistir
- [Catálogo en JSON](${SITE}/apis/catalogo.json)
- [Texto completo para LLM](${SITE}/llms-full.txt)

## Top 10 Chile

${sortedBy('chile').slice(0, 10).map((a) => `- [${a.nombre}](${SITE}/apis/${a.slug}.md): ${a.resumen}`).join('\n')}

## Todas las APIs

${sortedBy('relevancia').map((a) => `- [${a.nombre}](${SITE}/apis/${a.slug}.md): ${PAIS[a.pais] || a.pais}; ${a.costos.mensual_usd == null ? 'sin precio público' : a.costos.mensual_usd === 0 ? 'gratis' : usd(a.costos.mensual_usd) + '/mes'}; radar ${ANILLO[a.radar.anillo]}`).join('\n')}

## Categorías

${CATEGORIAS.map((c) => `- [${c.nombre}](${SITE}/apis/categoria/${c.slug}): ${c.descripcion}`).join('\n')}

## Casos de uso

${CASOS.map((c) => `- [${c.nombre}](${SITE}/apis/caso-de-uso/${c.slug}): ${c.descripcion}`).join('\n')}
`
write('llms.txt', llms)
const full = [llms, ...sortedBy('relevancia').map((a) => readFileSync(join(OUT, a.slug + '.md'), 'utf8'))].join('\n\n---\n\n')
write('llms-full.txt', full)

// ── CSS ──
write('apis/apis.css', readFileSync(join(ROOT, 'scripts', 'apis', 'apis.css'), 'utf8'))

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
