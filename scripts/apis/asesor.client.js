/* Asesor de integraciones de www.agrohubs.cl/apis — "dime qué quieres y te digo qué APIs ocupar".
 * Pregunta a la API de AgroHubs (Ollama del servidor); si no responde, recomienda con reglas locales.
 * scripts/build-apis.mjs inserta el catálogo, las URLs de la API y el recomendador al generar /apis/asesor.js. */
(function () {
  'use strict';
  var CAT = __CATALOGO__;
  var URLS = __URLS__;
  var COTIZAR = '/apis/cotizar';
  var module = { exports: {} };
  __RECOMENDADOR__
  var recomendar = module.exports.recomendar;

  var porSlug = {};
  var ITEMS = CAT.map(function (c) {
    var i = { slug: c.s, nombre: c.n, resumen: c.r, pais: c.p, categorias: c.c, casos_de_uso: c.u, que_entrega: c.q, ranking: { relevancia: c.k } };
    porSlug[c.s] = i;
    return i;
  });

  var historial = [];
  var ultima = null;
  var panel, log, campo, enviarBtn, abrirBtn;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); }
  function guardar() { try { sessionStorage.setItem('agro-asesor', JSON.stringify({ h: historial, u: ultima })); } catch (e) {} }
  function cargar() { try { var d = JSON.parse(sessionStorage.getItem('agro-asesor') || 'null'); if (d) { historial = d.h || []; ultima = d.u || null; } } catch (e) {} }

  function preguntarApi(mensaje, i) {
    if (i >= URLS.length) return Promise.reject(new Error('sin API'));
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);
    return fetch(URLS[i], {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctrl ? ctrl.signal : undefined,
      body: JSON.stringify({ mensaje: mensaje, historial: historial.slice(-6) })
    }).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).catch(function () { clearTimeout(t); return preguntarApi(mensaje, i + 1); });
  }

  function local(mensaje) {
    var r = recomendar(mensaje, ITEMS, { limite: 6 });
    return {
      fuente: 'reglas',
      respuesta: r.apis.length
        ? 'Según lo que cuentas, estas fuentes son las que mejor encajan. Puedes cotizar la integración con todas juntas y agendar una reunión para afinar el detalle.'
        : 'No logré identificar qué necesitas. Cuéntame qué quieres lograr: por ejemplo riego, heladas, precios, imágenes satelitales, sensores o trazabilidad.',
      apis: r.apis.map(function (a) { return { slug: a.slug, nombre: a.nombre, motivo: porSlug[a.slug].resumen }; })
    };
  }

  // Solo APIs publicadas en el directorio, sin repetir, máximo 6
  function depurar(res, mensaje) {
    var vistos = {};
    var apis = (res.apis || []).filter(function (a) {
      if (!a || !porSlug[a.slug] || vistos[a.slug]) return false;
      vistos[a.slug] = true; return true;
    }).slice(0, 6).map(function (a) { return { slug: a.slug, nombre: porSlug[a.slug].nombre, motivo: a.motivo || porSlug[a.slug].resumen }; });
    if (!apis.length) {
      var l = local(mensaje);
      if (l.apis.length) return { fuente: res.fuente, respuesta: res.respuesta || l.respuesta, apis: l.apis };
    }
    return { fuente: res.fuente || 'reglas', respuesta: res.respuesta || '', apis: apis };
  }

  function linkCotizar(slugs, necesidad) {
    var q = new URLSearchParams();
    if (slugs.length) q.set('apis', slugs.join(','));
    q.set('origen', 'asesor');
    if (necesidad) q.set('necesidad', necesidad.slice(0, 600));
    return COTIZAR + '?' + q.toString();
  }

  function burbuja(rol, html) {
    var d = document.createElement('div');
    d.className = 'as-msg as-' + rol;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function pintarResultado(res, necesidad) {
    var id = 'as-r' + Date.now();
    var html = '<p>' + esc(res.respuesta) + '</p>';
    if (res.apis.length) {
      html += '<ul class="as-apis">' + res.apis.map(function (a) {
        return '<li><label><input type="checkbox" checked value="' + esc(a.slug) + '"> <b>' + esc(a.nombre) + '</b></label>' +
          '<span>' + esc(a.motivo) + '</span> <a href="/apis/' + esc(a.slug) + '">Ver ficha</a></li>';
      }).join('') + '</ul>' +
        '<a class="btn-cta as-ir" id="' + id + '" href="' + esc(linkCotizar(res.apis.map(function (a) { return a.slug; }), necesidad)) + '">Cotizar con estas APIs y agendar reunión</a>';
    }
    html += '<p class="as-fuente">' + (res.fuente === 'ollama' ? 'Respuesta generada con IA. Revisa la selección antes de cotizar.' : 'Recomendación automática según tu descripción.') + '</p>';
    var d = burbuja('bot', html);
    var ir = d.querySelector('.as-ir');
    if (ir) d.querySelector('.as-apis').addEventListener('change', function () {
      var sel = [].slice.call(d.querySelectorAll('.as-apis input:checked')).map(function (x) { return x.value; });
      ir.href = linkCotizar(sel, necesidad);
      ir.textContent = sel.length ? 'Cotizar con ' + (sel.length === 1 ? 'esta API' : 'estas ' + sel.length + ' APIs') + ' y agendar reunión' : 'Cotizar y agendar reunión';
    });
  }

  function preguntar(texto) {
    texto = String(texto || '').trim();
    if (texto.length < 3) { campo.focus(); return; }
    burbuja('user', '<p>' + esc(texto) + '</p>');
    campo.value = '';
    enviarBtn.disabled = true;
    var espera = burbuja('bot as-espera', '<p>Buscando las mejores fuentes para tu caso…</p>');
    preguntarApi(texto, 0).then(function (r) { return depurar(r, texto); }, function () { return local(texto); }).then(function (res) {
      espera.remove();
      historial.push({ role: 'user', content: texto }, { role: 'assistant', content: res.respuesta + (res.apis.length ? ' APIs: ' + res.apis.map(function (a) { return a.slug; }).join(', ') : '') });
      ultima = { necesidad: texto, res: res };
      guardar();
      pintarResultado(res, texto);
      enviarBtn.disabled = false;
      campo.focus();
    });
  }

  var SUGERENCIAS = ['Alertas de heladas para mis huertos', 'Programar el riego con clima y sensores', 'Precios para vender y exportar', 'Ver el vigor de mis cuarteles por satélite', 'Trazabilidad y certificación'];

  function montar() {
    abrirBtn = document.createElement('button');
    abrirBtn.type = 'button';
    abrirBtn.className = 'as-abrir';
    abrirBtn.setAttribute('aria-expanded', 'false');
    abrirBtn.setAttribute('aria-controls', 'asesor');
    abrirBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 6.5a1.5 1.5 0 1 0 0-.01zm5 0a1.5 1.5 0 1 0 0-.01zm5 0a1.5 1.5 0 1 0 0-.01z"/></svg><span>¿Qué APIs necesito?</span>';

    panel = document.createElement('section');
    panel.id = 'asesor';
    panel.className = 'as-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Asesor de integraciones');
    panel.innerHTML =
      '<header class="as-head"><div><b>Asesor de integraciones</b><small>Dime qué quieres y te digo qué APIs ocupar</small></div>' +
      '<button type="button" class="as-cerrar" aria-label="Cerrar asesor">×</button></header>' +
      '<div class="as-log" aria-live="polite"></div>' +
      '<div class="as-sug">' + SUGERENCIAS.map(function (s) { return '<button type="button">' + esc(s) + '</button>'; }).join('') + '</div>' +
      '<form class="as-form"><label class="sr" for="as-campo">Describe lo que necesitas</label>' +
      '<textarea id="as-campo" rows="2" maxlength="1500" placeholder="Ej.: tengo un ERP de packing y quiero sumar clima, precios y certificaciones"></textarea>' +
      '<button type="submit" class="as-enviar">Preguntar</button></form>';
    document.body.appendChild(abrirBtn);
    document.body.appendChild(panel);

    log = panel.querySelector('.as-log');
    campo = panel.querySelector('textarea');
    enviarBtn = panel.querySelector('.as-enviar');
    burbuja('bot', '<p>Hola. Cuéntame qué quieres lograr en tu campo o en tu software y te recomiendo qué fuentes y herramientas conectar. Después puedes cotizar y agendar una reunión.</p>');

    cargar();
    if (ultima && ultima.res) { burbuja('user', '<p>' + esc(ultima.necesidad) + '</p>'); pintarResultado(ultima.res, ultima.necesidad); }

    abrirBtn.addEventListener('click', function () { panel.hidden ? abrir() : cerrar(); });
    panel.querySelector('.as-cerrar').addEventListener('click', cerrar);
    panel.querySelector('.as-sug').addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') preguntar(e.target.textContent); });
    panel.querySelector('.as-form').addEventListener('submit', function (e) { e.preventDefault(); preguntar(campo.value); });
    campo.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); preguntar(campo.value); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) cerrar(); });

    // Disparadores en la página: <button data-asesor> y <form data-asesor-form> con un campo de texto
    [].forEach.call(document.querySelectorAll('[data-asesor]'), function (b) { b.addEventListener('click', function (e) { e.preventDefault(); abrir(); }); });
    [].forEach.call(document.querySelectorAll('form[data-asesor-form]'), function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var t = f.querySelector('input,textarea');
        abrir();
        if (t && t.value.trim()) { preguntar(t.value); t.value = ''; }
      });
    });
  }

  function abrir() { panel.hidden = false; abrirBtn.setAttribute('aria-expanded', 'true'); document.documentElement.classList.add('as-abierto'); campo.focus(); }
  function cerrar() { panel.hidden = true; abrirBtn.setAttribute('aria-expanded', 'false'); document.documentElement.classList.remove('as-abierto'); abrirBtn.focus(); }

  window.AgroAsesor = { abrir: function (t) { abrir(); if (t) preguntar(t); }, recomendar: local };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
