// Genera el borrador editable de la "Propuesta de Diagnóstico Previo" a partir de un lead.
// Los textos entre [corchetes] resaltados son para completar en el admin.
import { ETAPAS, LICENCIAS, NO_SE, TOMATE_ESTABLECIMIENTO, TOMATE_COSECHA, cultivaTomate, tomateIndustrial, listaCultivos, listaMarcas, conAsociados, haAsociadas, modeloLabel, modulosPorInteres, puntosNoSabe } from "./evaluacion"

const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const completar = t => `<mark>[${esc(t)}]</mark>`
const fmt = n => n == null ? NO_SE : Number(n).toLocaleString("es-CL")
const item = (titulo, valor) => valor ? `<li><b>${esc(titulo)}:</b> ${esc(valor)}</li>` : ""
const lista = a => a?.length ? a.join(", ") : ""

export function generarPropuesta(lead) {
  const c = lead.contacto || {}
  const r = lead.respuestas
  const empresa = c.empresa || c.nombre
  const fecha = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
  const asociados = r ? conAsociados(r) : false

  let situacion = `<li>${completar("antecedentes de la operación")}</li>`
  let sensores = ""
  let tomate = ""
  let objetivos = `<li>${completar("objetivos acordados con el cliente")}</li>`
  let modulosSi = [], modulosNoSe = [], noSabe = []
  let licencia = ""

  if (r) {
    situacion = [
      item("Cultivos", lista(listaCultivos(r)) || "sin especificar"),
      `<li><b>Superficie:</b> ${fmt(r.hectareas)} ha, en ${fmt(r.zonas)} zona(s) o predio(s): ${completar("nombres de las zonas")}</li>`,
      item("Modelo productivo", `${modeloLabel(r)}${r.modelo === "mixto" ? ` (${fmt(r.haPropias)} ha propias y ${fmt(haAsociadas(r))} ha con productores)` : ""}`),
      asociados ? item("Productores asociados", `${fmt(r.productores)}${r.apoyos?.length ? `, a quienes se entrega: ${r.apoyos.join(", ").toLowerCase()}` : ""}`) : "",
      item("Riego", lista(r.riegos)),
      item("Fertilización", lista(r.fertilizacion)),
      item("Aplicación de fitosanitarios", lista(r.aplicacion)),
      item("Análisis que realiza", lista(r.analisis)),
      item("Productos que utiliza", lista(r.productos)),
      item("Registro actual de labores", lista(r.registros)),
      item("Conectividad en campo", { buena: "buena en todo el campo", parcial: "solo en algunos sectores", sin: "sin señal en el campo", nose: NO_SE }[r.conectividad]),
    ].join("")

    if (cultivaTomate(r)) {
      tomate = [
        item("Tipo", lista(r.tomateTipos)),
        item("Establecimiento", TOMATE_ESTABLECIMIENTO.find(x => x.id === r.tomateEstablecimiento)?.label),
        item("Densidad", r.tomateDensidad == null ? NO_SE : `${fmt(r.tomateDensidad)} plantas/ha`),
        item("Cosecha", TOMATE_COSECHA.find(x => x.id === r.tomateCosecha)?.label),
        item("Híbrido / variedad", r.tomateVariedad?.trim()),
        item("Problemas principales", lista(r.tomateProblemas)),
        tomateIndustrial(r) ? item("Descuentos en recepción", lista(r.tomateRecepcion)) : "",
      ].join("")
    }

    if (r.tieneSensores === "si") {
      sensores = [
        item("Marcas", lista(listaMarcas(r))),
        item("Cantidad aproximada", fmt(r.cantidadSensores)),
        item("Variables que miden", lista(r.variables)),
        item("Cómo se ve la data hoy", lista(r.verData)),
        item("Quién la revisa", r.quienRevisa),
      ].join("")
    } else if (r.tieneSensores === "no") {
      sensores = "<li>No cuenta con sensores instalados.</li>"
    } else if (r.tieneSensores === "nose") {
      sensores = "<li>No tiene certeza de si existen sensores instalados; se verificará en la visita.</li>"
    }

    const obj = r.prioridades?.filter(p => p !== "Aún no lo tengo claro") || []
    const extras = [
      r.masSensores === "si" && `Ampliar la red de sensores${r.medirMas?.length ? ` para medir: ${r.medirMas.join(", ").toLowerCase()}` : ""}`,
      r.comoVer?.length && !r.comoVer.includes(NO_SE) && `Ver la información como: ${r.comoVer.join(", ").toLowerCase()}`,
      r.capacitacion === "si" && "Formar a su equipo como extensionistas",
    ].filter(Boolean)
    if (obj.length || extras.length) objetivos = [...obj, ...extras].map(o => `<li>${esc(o)}</li>`).join("")
    if (r.plazo) objetivos += item("Plazo esperado", { temporada: "esta temporada", proxima: "próxima temporada", explorando: "en exploración", nose: NO_SE }[r.plazo])

    modulosSi = modulosPorInteres(r, "si").map(m => m.label)
    modulosNoSe = modulosPorInteres(r, "nose").map(m => m.label)
    noSabe = puntosNoSabe(r)
    licencia = LICENCIAS.find(l => l.id === r.licencia && l.id !== "nose")?.label || ""
  }

  return `
<h1>Propuesta de Diagnóstico Previo</h1>
<p><b>${esc(empresa)}</b><br>${esc(fecha)}</p>
<p><b>Preparado para:</b> ${esc(c.nombre)}${c.cargo ? `, ${esc(c.cargo)}` : ""}${c.empresa ? ` · ${esc(c.empresa)}` : ""}<br>
<b>Preparado por:</b> AgroHub · Marcos Contreras y Cristián Betteley</p>

<h2>1. Situación actual</h2>
<p>Según la información entregada en la evaluación AgroHub:</p>
<ul>${situacion}</ul>
${tomate ? `<p><b>Cultivo de tomate:</b></p><ul>${tomate}</ul>` : ""}
${sensores ? `<p><b>Sensores y datos:</b></p><ul>${sensores}</ul>` : ""}
${lead.mensaje ? `<p><b>Comentario del cliente:</b> ${esc(lead.mensaje)}</p>` : ""}

<h2>2. Qué busca ${esc(empresa)}</h2>
<ul>${objetivos}</ul>
${modulosSi.length ? `<p><b>Módulos que considera útiles:</b> ${esc(modulosSi.join(", "))}.</p>` : ""}

<h2>3. Puntos a definir en el diagnóstico</h2>
${noSabe.length || modulosNoSe.length
    ? `<p>Durante la evaluación, el cliente indicó no tener certeza sobre los siguientes puntos. Los resolveremos en la visita:</p><ul>${noSabe.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`
    : `<p>${completar("puntos que quedaron abiertos tras la conversación")}</p>`}

<h2>4. Alcance del diagnóstico previo</h2>
<p>Se incluye una visita a terreno de ${completar("N° de días")} a ${completar("zonas / predios a visitar")}, con:</p>
<ul>
  <li>Marcos Contreras — Agricultura digital y transferencia tecnológica</li>
  <li>Cristián Betteley — ${completar("rol")}</li>
  <li>${completar("especialista adicional, ej. riego / sensores")}</li>
</ul>
<p>Durante la visita se realizará:</p>
<ul>
  <li>Levantamiento del nivel tecnológico de la empresa, sus trabajadores${asociados ? " y sus productores asociados" : ""}.</li>
  <li>Inventario de infraestructura existente: riego, energía, conectividad, sensores y equipos${r?.tieneSensores === "si" ? ", incluyendo el estado y la integración de los sensores actuales" : ""}.</li>
  <li>Entrevistas con el equipo técnico${asociados ? " y productores referentes" : ""}.</li>
  <li>Revisión de registros y datos actuales (labores, insumos, cosecha, calidad).</li>
  <li>Espacio para conocer qué tecnologías les interesan, cuáles no y qué más necesitan.</li>
</ul>

<h2>5. Entregables</h2>
<ul>
  <li>Informe de diagnóstico con brechas y oportunidades priorizadas.</li>
  <li>Propuesta modular: kit tecnológico (sensores y herramientas)${modulosSi.length ? ` y módulos de plataforma (${esc(modulosSi.join(", "))})` : " y módulos de plataforma"}.</li>
  <li>Diseño de un piloto con sitios representativos, línea base y métricas de éxito.</li>
  <li>Plan de capacitación y formación de extensionistas.</li>
</ul>

<h2>6. Etapas posteriores (referenciales)</h2>
<ol>${ETAPAS.slice(1).map(e => `<li><b>${esc(e.titulo)}:</b> ${esc(e.texto)}</li>`).join("")}</ol>

<h2>7. Plazo y valor</h2>
<ul>
  <li><b>Fecha propuesta de visita:</b> ${completar("fecha")}</li>
  <li><b>Duración total del diagnóstico:</b> ${completar("N° semanas")}</li>
  <li><b>Valor del diagnóstico previo:</b> ${completar("valor + IVA")}</li>
  <li><b>Condiciones:</b> ${completar("forma de pago; descuento del diagnóstico si se contrata la implementación, etc.")}</li>
  ${licencia ? `<li><b>Licencia de plataforma de interés:</b> ${esc(licencia)} (se cotiza tras el diagnóstico)</li>` : ""}
</ul>

<h2>8. Próximos pasos</h2>
<ol>
  <li>Confirmar el alcance y la fecha de la visita.</li>
  <li>Designar una contraparte${r?.zonas > 1 ? " por zona" : ""}.</li>
  <li>Compartir información previa: mapa o listado de predios, inventario tecnológico y ejemplos de registros.</li>
</ol>

<p>Quedamos atentos a sus comentarios.</p>
<p><b>Equipo AgroHub</b><br>www.agrohubs.cl</p>
`.trim()
}
