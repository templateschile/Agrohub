// Genera el borrador editable de la "Propuesta de Diagnóstico Previo" a partir de un lead.
// Los textos entre [corchetes] resaltados son para completar en el admin.
import {
  ETAPAS, LICENCIAS, TRASPASO_TI, USUARIOS, SI_NO, PLAZOS, CONECTIVIDAD, QUIEN_REVISA, TOMATE_ESTABLECIMIENTO, TOMATE_COSECHA,
  cultivaTomate, tomateIndustrial, requiereTraspaso, listaCultivos, listaMarcas, conAsociados, haAsociadas, modeloLabel,
  modulosPorInteres, conOtros, unica, puntajes,
} from "./evaluacion"

const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const completar = t => `<mark>[${esc(t)}]</mark>`
const fmt = n => Number(n || 0).toLocaleString("es-CL")
const item = (titulo, valor) => valor ? `<li><b>${esc(titulo)}:</b> ${esc(valor)}</li>` : ""
const lista = a => a?.length ? a.join(", ") : ""
const listaPuntajes = (r, k) => puntajes(r, k).map(([n, v]) => `<li>${esc(n)} <b>(${v}/5)</b></li>`).join("")

export function generarPropuesta(lead) {
  const c = lead.contacto || {}
  const r = lead.respuestas
  const empresa = c.empresa || c.nombre
  const fecha = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
  const asociados = r ? conAsociados(r) : false
  const zonas = r?.zonas || []

  let situacion = `<li>${completar("antecedentes de la operación")}</li>`
  let tablaZonas = "", tomate = "", manejo = "", sensores = "", licencia = "", traspaso = ""
  let objetivos = `<li>${completar("objetivos acordados con el cliente")}</li>`
  let medir = "", ver = "", modulosSi = [], modulosTal = []

  if (r) {
    situacion = [
      item("Cultivos", lista(listaCultivos(r)) || "sin especificar"),
      item("Superficie total", `${fmt(r.hectareas)} ha`),
      item("Modelo productivo", `${modeloLabel(r)}${r.modelo === "mixto" ? ` (${fmt(r.haPropias)} ha propias y ${fmt(haAsociadas(r))} ha con productores)` : ""}`),
      asociados ? item("Productores asociados", `${fmt(r.productores)}${r.apoyos?.length ? `, a quienes se entrega: ${conOtros(r, "apoyos").join(", ").toLowerCase()}` : ""}`) : "",
      item("Conectividad en campo", unica(r, "conectividad", CONECTIVIDAD)),
    ].join("")

    if (zonas.length) {
      tablaZonas = `<table style="border-collapse:collapse;width:100%;margin:8px 0">
        <tr style="background:#f0f7ee"><th style="text-align:left;padding:6px;border:1px solid #dcefd8">Zona</th><th style="padding:6px;border:1px solid #dcefd8">Hectáreas</th><th style="padding:6px;border:1px solid #dcefd8">Agricultores</th></tr>
        ${zonas.map(z => `<tr><td style="padding:6px;border:1px solid #e5e7eb">${esc(z.nombre)}</td><td style="padding:6px;border:1px solid #e5e7eb;text-align:right">${fmt(z.hectareas)}</td><td style="padding:6px;border:1px solid #e5e7eb;text-align:right">${fmt(z.agricultores)}</td></tr>`).join("")}
      </table>`
    }

    if (cultivaTomate(r)) {
      tomate = [
        item("Tipo", lista(conOtros(r, "tomateTipos"))),
        item("Establecimiento", unica(r, "tomateEstablecimiento", TOMATE_ESTABLECIMIENTO)),
        item("Densidad", `${fmt(r.tomateDensidad)} plantas/ha`),
        item("Cosecha", unica(r, "tomateCosecha", TOMATE_COSECHA)),
        item("Híbrido / variedad", r.tomateVariedad?.trim()),
        item("Problemas principales", lista(conOtros(r, "tomateProblemas"))),
        tomateIndustrial(r) ? item("Descuentos en recepción", lista(conOtros(r, "tomateRecepcion"))) : "",
      ].join("")
    }

    manejo = [
      item("Riego", lista(conOtros(r, "riegos"))),
      item("Programador de riego", r.programadorRiego?.trim()),
      item("Programador de fertirriego", r.programadorFerti?.trim()),
      item("Fertilización", lista(conOtros(r, "fertilizacion"))),
      item("Aplicación de fitosanitarios", lista(conOtros(r, "aplicacion"))),
      item("Análisis que realiza", lista(conOtros(r, "analisis"))),
      item("Productos que utiliza", lista(r.productos)),
      item("Registro actual de labores", lista(conOtros(r, "registros"))),
    ].join("")

    if (r.tieneSensores === "si") {
      sensores = [
        item("Marcas", lista(listaMarcas(r))),
        item("Cantidad aproximada", fmt(r.cantidadSensores)),
        item("Variables que miden", lista(conOtros(r, "variables"))),
        item("Cómo se ve la data hoy", lista(conOtros(r, "verData"))),
        item("Quién la revisa", unica(r, "quienRevisa", QUIEN_REVISA)),
      ].join("")
    } else if (r.tieneSensores) {
      sensores = item("¿Tiene sensores?", unica(r, "tieneSensores", SI_NO))
    }

    const obj = listaPuntajes(r, "prioridades")
    if (obj) objetivos = obj
    objetivos += item("Plazo esperado", unica(r, "plazo", PLAZOS))
    objetivos += item("Formar extensionistas", unica(r, "capacitacion", SI_NO))
    medir = listaPuntajes(r, "medir")
    ver = listaPuntajes(r, "comoVer")

    modulosSi = modulosPorInteres(r, "si").map(m => m.label)
    modulosTal = modulosPorInteres(r, "tal").map(m => m.label)
    licencia = r.licencia ? unica(r, "licencia", LICENCIAS) : ""
    if (requiereTraspaso(r)) traspaso = `<ul>${TRASPASO_TI.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`
  }

  const usuarios = r ? USUARIOS.map(u => `${fmt(r[u.id])} ${u.label.toLowerCase()}`).join(", ") : ""

  return `
<h1>Propuesta de Diagnóstico Previo</h1>
<p><b>${esc(empresa)}</b><br>${esc(fecha)}</p>
<p><b>Preparado para:</b> ${esc(c.nombre)}${c.cargo ? `, ${esc(c.cargo)}` : ""}${c.empresa ? ` · ${esc(c.empresa)}` : ""}<br>
<b>Preparado por:</b> AgroHub · Marcos Contreras y Cristián Betteley</p>

<h2>1. Situación actual</h2>
<p>Según la información entregada en la evaluación AgroHub:</p>
<ul>${situacion}</ul>
${tablaZonas}
${tomate ? `<p><b>Cultivo de tomate:</b></p><ul>${tomate}</ul>` : ""}
${manejo ? `<p><b>Manejo del cultivo:</b></p><ul>${manejo}</ul>` : ""}
${sensores ? `<p><b>Sensores y datos:</b></p><ul>${sensores}</ul>` : ""}
${lead.mensaje ? `<p><b>Comentario del cliente:</b> ${esc(lead.mensaje)}</p>` : ""}

<h2>2. Qué busca ${esc(empresa)}</h2>
<p>Prioridades según el puntaje asignado por el cliente (1 a 5):</p>
<ul>${objetivos}</ul>
${medir ? `<p><b>Variables que quiere medir:</b></p><ul>${medir}</ul>` : ""}
${ver ? `<p><b>Cómo quiere ver la información:</b></p><ul>${ver}</ul>` : ""}
${modulosSi.length ? `<p><b>Módulos que considera útiles:</b> ${esc(modulosSi.join(", "))}.</p>` : ""}
${modulosTal.length ? `<p><b>Módulos a evaluar en conjunto:</b> ${esc(modulosTal.join(", "))}.</p>` : ""}

<h2>3. Alcance del diagnóstico previo</h2>
<p>Se incluye una visita a terreno de ${completar("N° de días")} a ${zonas.length ? esc(zonas.map(z => z.nombre).join(", ")) : completar("zonas / predios a visitar")}, con:</p>
<ul>
  <li>Marcos Contreras — Agricultura digital y transferencia tecnológica</li>
  <li>Cristián Betteley — Tech Lead · Plataforma y Datos</li>
  <li>${completar("especialista adicional, ej. riego / sensores")}</li>
</ul>
<p>Durante la visita se realizará:</p>
<ul>
  <li>Levantamiento del nivel tecnológico de la empresa, sus trabajadores${asociados ? " y sus productores asociados" : ""}.</li>
  <li>Inventario de infraestructura existente: riego, programadores, energía, conectividad, sensores y equipos${r?.tieneSensores === "si" ? ", incluyendo el estado y la integración de los sensores actuales" : ""}.</li>
  <li>Entrevistas con el equipo técnico${asociados ? " y productores referentes" : ""}.</li>
  <li>Revisión de registros y datos actuales (labores, insumos, cosecha, calidad).</li>
  <li>Espacio para conocer qué tecnologías les interesan, cuáles no y qué más necesitan.</li>
</ul>

<h2>4. Entregables</h2>
<ul>
  <li>Informe de diagnóstico con brechas y oportunidades priorizadas.</li>
  <li>Propuesta modular: kit tecnológico (sensores y herramientas)${modulosSi.length ? ` y módulos de plataforma (${esc(modulosSi.join(", "))})` : " y módulos de plataforma"}.</li>
  <li>Diseño de un piloto con sitios representativos, línea base y métricas de éxito.</li>
  <li>Plan de capacitación y formación de extensionistas y capacitadores por zona.</li>
</ul>
${usuarios ? `<p><b>Usuarios estimados de la plataforma:</b> ${esc(usuarios)}.</p>` : ""}

<h2>5. Etapas posteriores (referenciales)</h2>
<ol>${ETAPAS.slice(1).map(e => `<li><b>${esc(e.titulo)}:</b> ${esc(e.texto)}</li>`).join("")}</ol>
${traspaso ? `<p><b>Traspaso técnico (licencia ${esc(licencia)}):</b> incluye capacitación para migración y traspaso técnico de fuentes:</p>${traspaso}` : ""}

<h2>6. Plazo y valor</h2>
<ul>
  <li><b>Fecha propuesta de visita:</b> ${completar("fecha")}</li>
  <li><b>Duración total del diagnóstico:</b> ${completar("N° semanas")}</li>
  <li><b>Valor del diagnóstico previo:</b> ${completar("valor + IVA")}</li>
  <li><b>Condiciones:</b> ${completar("forma de pago; descuento del diagnóstico si se contrata la implementación, etc.")}</li>
  ${licencia ? `<li><b>Licencia de plataforma de interés:</b> ${esc(licencia)} (se cotiza tras el diagnóstico)</li>` : ""}
</ul>

<h2>7. Próximos pasos</h2>
<ol>
  <li>Confirmar el alcance y la fecha de la visita.</li>
  <li>Designar una contraparte${zonas.length > 1 ? " por zona" : ""}.</li>
  <li>Compartir información previa: mapa o listado de predios, inventario tecnológico y ejemplos de registros.</li>
</ol>

<p>Quedamos atentos a sus comentarios.</p>
<p><b>Equipo AgroHub</b><br>www.agrohubs.cl</p>
`.trim()
}
