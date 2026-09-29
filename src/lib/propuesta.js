// Genera el borrador editable de la "Propuesta de Diagnóstico Previo" a partir de un lead.
// Los textos entre [corchetes] resaltados son para completar en el admin.
import { MODULOS, LICENCIAS, ETAPAS, listaCultivos, conAsociados, haAsociadas, modeloLabel } from "./evaluacion"

const esc = s => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const completar = t => `<mark>[${esc(t)}]</mark>`
const fmt = n => Number(n || 0).toLocaleString("es-CL")

export function generarPropuesta(lead) {
  const c = lead.contacto || {}
  const r = lead.respuestas
  const empresa = c.empresa || c.nombre
  const fecha = new Date().toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })

  const antecedentes = []
  if (r) {
    const cultivos = listaCultivos(r)
    antecedentes.push(`<li><b>Cultivos:</b> ${cultivos.length ? esc(cultivos.join(", ")) : completar("cultivos")}</li>`)
    antecedentes.push(`<li><b>Superficie:</b> ${fmt(r.hectareas)} ha, distribuidas en ${fmt(r.zonas)} zona(s) o predio(s): ${completar("nombres de las zonas")}</li>`)
    antecedentes.push(`<li><b>Modelo productivo:</b> ${esc(modeloLabel(r))}${r.modelo === "mixto" ? ` (${fmt(r.haPropias)} ha propias y ${fmt(haAsociadas(r))} ha con productores)` : ""}</li>`)
    if (conAsociados(r)) {
      antecedentes.push(`<li><b>Productores asociados:</b> ${fmt(r.productores)}${r.apoyos?.length ? `, a quienes se entrega: ${esc(r.apoyos.join(", ").toLowerCase())}` : ""}</li>`)
    }
    if (r.riegos?.length) antecedentes.push(`<li><b>Riego:</b> ${esc(r.riegos.join(", "))}</li>`)
    if (r.registros?.length) antecedentes.push(`<li><b>Registro actual de labores:</b> ${esc(r.registros.join(", "))}</li>`)
    if (r.sensores?.length) antecedentes.push(`<li><b>Tecnología de sensores de interés:</b> ${esc(r.sensores.join(", "))}</li>`)
  } else {
    antecedentes.push(`<li>${completar("antecedentes de la operación")}</li>`)
  }
  if (lead.mensaje) antecedentes.push(`<li><b>Comentario del cliente:</b> ${esc(lead.mensaje)}</li>`)

  const prioridades = r?.prioridades?.length
    ? r.prioridades.map(p => `<li>${esc(p)}</li>`).join("")
    : `<li>${completar("objetivos acordados con el cliente")}</li>`

  const modulos = r?.modulos?.length
    ? r.modulos.map(id => MODULOS.find(m => m.id === id)?.label).filter(Boolean).join(", ")
    : ""
  const licencia = LICENCIAS.find(l => l.id === r?.licencia)?.label

  return `
<h1>Propuesta de Diagnóstico Previo</h1>
<p><b>${esc(empresa)}</b><br>${esc(fecha)}</p>
<p><b>Preparado para:</b> ${esc(c.nombre)}${c.cargo ? `, ${esc(c.cargo)}` : ""}${c.empresa ? ` · ${esc(c.empresa)}` : ""}<br>
<b>Preparado por:</b> AgroHub · Marcos Contreras y Cristián Betteley</p>

<h2>1. Antecedentes</h2>
<p>Según la información entregada en la evaluación AgroHub:</p>
<ul>${antecedentes.join("")}</ul>

<h2>2. Objetivos</h2>
<p>El diagnóstico se enfocará en las prioridades definidas por ${esc(empresa)}:</p>
<ul>${prioridades}</ul>

<h2>3. Alcance del diagnóstico previo</h2>
<p>Se incluye una visita a terreno de ${completar("N° de días")} a ${completar("zonas / predios a visitar")}, con:</p>
<ul>
  <li>Marcos Contreras — Agricultura digital y transferencia tecnológica</li>
  <li>Cristián Betteley — ${completar("rol")}</li>
  <li>${completar("especialista adicional, ej. riego / sensores HSTI")}</li>
</ul>
<p>Durante la visita se realizará:</p>
<ul>
  <li>Levantamiento del nivel tecnológico de la empresa, sus trabajadores${r && conAsociados(r) ? " y sus productores asociados" : ""}.</li>
  <li>Inventario de infraestructura existente: riego, energía, conectividad, sensores y equipos.</li>
  <li>Entrevistas con el equipo técnico${r && conAsociados(r) ? " y productores referentes" : ""}.</li>
  <li>Revisión de registros y datos actuales (labores, insumos, cosecha, calidad).</li>
  <li>Espacio para conocer qué tecnologías les interesan, cuáles no y qué más necesitan.</li>
</ul>

<h2>4. Entregables</h2>
<ul>
  <li>Informe de diagnóstico con brechas y oportunidades priorizadas.</li>
  <li>Propuesta modular: kit tecnológico (sensores y herramientas)${modulos ? ` y módulos de plataforma (${esc(modulos)})` : " y módulos de plataforma"}.</li>
  <li>Diseño de un piloto con sitios representativos, línea base y métricas de éxito.</li>
  <li>Plan de capacitación y formación de extensionistas.</li>
</ul>

<h2>5. Etapas posteriores (referenciales)</h2>
<ol>${ETAPAS.slice(1).map(e => `<li><b>${esc(e.titulo)}:</b> ${esc(e.texto)}</li>`).join("")}</ol>

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
  <li>Designar una contraparte${r?.zonas > 1 ? " por zona" : ""}.</li>
  <li>Compartir información previa: mapa o listado de predios, inventario tecnológico y ejemplos de registros.</li>
</ol>

<p>Quedamos atentos a sus comentarios.</p>
<p><b>Equipo AgroHub</b><br>www.agrohubs.cl</p>
`.trim()
}
