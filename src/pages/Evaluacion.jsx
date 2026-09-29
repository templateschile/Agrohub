import { useState } from "react"
import { Check, ClipboardCheck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Info, Lightbulb, ShieldCheck, Clock, Send, CheckCircle, ArrowRight } from "lucide-react"
import { enviarLead, emailValido } from "../lib/lead"
import {
  NO_SE, CULTIVOS, MODELOS_PRODUCTIVOS, APOYOS_PRODUCTORES, TIPOS_RIEGO, REGISTROS, SI_NO,
  MARCAS_SENSORES, VARIABLES_SENSORES, VER_DATA, QUIEN_REVISA, CONECTIVIDAD,
  PRIORIDADES, COMO_QUIERE_VER, PLAZOS, INTERES, MODULOS, MODOS_IA, FUENTES, LICENCIAS, ETAPAS,
  estadoInicial, conAsociados, haAsociadas, resumenRespuestas, puntosNoSabe, avance, insights,
} from "../lib/evaluacion"

const MAX_PRIORIDADES = 3
const MARCAS = [...MARCAS_SENSORES, "No sé la marca"]
const PASOS = [
  { titulo: "Estado actual", desc: "Qué tienes hoy" },
  { titulo: "Qué buscas",    desc: "Qué quieres lograr" },
  { titulo: "Módulos",       desc: "Qué te serviría" },
  { titulo: "Tus datos",     desc: "A quién escribimos" },
]
const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"

function Tooltip({ text }) {
  return (
    <span className="group relative inline-flex">
      <Info size={13} className="text-gray-400 cursor-help ml-1" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-gray-900 text-white text-xs rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
        {text}
      </span>
    </span>
  )
}

// Contador numerico con opcion "No sé" (valor null)
function Contador({ val, set, min = 0, conNoSe = true }) {
  const nose = val == null
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button type="button" disabled={nose} onClick={() => set(Math.max(min, val - 1))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors">-</button>
      <input
        type="number"
        disabled={nose}
        value={nose ? "" : val}
        placeholder={nose ? "—" : ""}
        onChange={e => set(Math.max(min, parseInt(e.target.value) || 0))}
        className="w-24 text-center border border-gray-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-400 disabled:bg-gray-50"
      />
      <button type="button" disabled={nose} onClick={() => set(val + 1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors">+</button>
      {conNoSe && (
        <button type="button" onClick={() => set(nose ? Math.max(min, 1) : null)}
          className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${nose ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
          {NO_SE}
        </button>
      )}
    </div>
  )
}

function Chip({ activo, onClick, children, disabled = false }) {
  const noSe = children === NO_SE || children === "No sé la marca"
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${activo ? (noSe ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-agro-green-50 border-agro-green-400 text-agro-green-800") : disabled ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" : `bg-gray-50 border-gray-100 hover:border-gray-300 ${noSe ? "text-gray-500 italic" : "text-gray-600"}`}`}>
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${activo ? (noSe ? "bg-amber-500 border-amber-500" : "bg-agro-green-600 border-agro-green-600") : "border-gray-300"}`}>
        {activo && <Check size={9} className="text-white" />}
      </div>
      <span className="flex-1">{children}</span>
    </button>
  )
}

// Seleccion unica en forma de pastillas
function Opciones({ opciones, valor, set }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map(o => {
        const id = o.id ?? o
        const label = o.label ?? o
        const activo = valor === id
        const noSe = label === NO_SE
        return (
          <button key={id} type="button" onClick={() => set(activo ? "" : id)}
            className={`text-xs px-3.5 py-2 rounded-full border font-semibold transition-all ${activo ? (noSe ? "bg-amber-500 border-amber-500 text-white" : "bg-agro-green-600 border-agro-green-600 text-white") : "bg-white border-gray-200 text-gray-600 hover:border-agro-green-400"}`}>
            {label}
          </button>
        )
      })}
    </div>
  )
}

function Radio({ activo, onClick, titulo, desc, badge }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${activo ? "bg-agro-green-50 border-agro-green-400" : "bg-gray-50 border-gray-100 hover:border-gray-300"}`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
        {activo && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{titulo}</span>
          {badge && <span className="text-[10px] bg-agro-earth-50 text-agro-earth-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </div>
        {desc && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </button>
  )
}

function Bloque({ titulo, ayuda, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 className="font-bold text-gray-900 text-base">{titulo}</h2>
      {ayuda ? <p className="text-xs text-gray-400 mt-0.5 mb-4">{ayuda}</p> : <div className="mb-4" />}
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  )
}

function Pregunta({ label, tooltip, children }) {
  return (
    <div>
      <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">{label}{tooltip && <Tooltip text={tooltip} />}</label>
      {children}
    </div>
  )
}

export default function Evaluacion() {
  const [paso, setPaso] = useState(0)
  const [r, setR] = useState(estadoInicial)
  const [contacto, setContacto] = useState({ nombre: "", empresa: "", cargo: "", email: "", telefono: "", mensaje: "", website: "" })
  const [verMarcas, setVerMarcas] = useState(false)
  const [estado, setEstado] = useState("editando")

  const set = k => v => setR(prev => ({ ...prev, [k]: v }))
  // En listas multiples, "No sé" es excluyente con las demas opciones
  const toggle = k => item => setR(prev => {
    const actual = prev[k]
    if (actual.includes(item)) return { ...prev, [k]: actual.filter(x => x !== item) }
    const exclusivo = [NO_SE, "No sé la marca", "Aún no lo tengo claro"]
    const siguiente = exclusivo.includes(item) ? [item] : [...actual.filter(x => !exclusivo.includes(x)), item]
    return { ...prev, [k]: siguiente }
  })
  const togglePrioridad = p => setR(prev => {
    if (prev.prioridades.includes(p)) return { ...prev, prioridades: prev.prioridades.filter(x => x !== p) }
    if (p === "Aún no lo tengo claro") return { ...prev, prioridades: [p] }
    const sinDuda = prev.prioridades.filter(x => x !== "Aún no lo tengo claro")
    return sinDuda.length < MAX_PRIORIDADES ? { ...prev, prioridades: [...sinDuda, p] } : prev
  })
  const setModulo = (id, v) => setR(prev => ({ ...prev, modulos: { ...prev.modulos, [id]: prev.modulos[id] === v ? undefined : v } }))
  const setC = k => e => setContacto(prev => ({ ...prev, [k]: e.target.value }))

  const irA = n => { setPaso(n); window.scrollTo({ top: 0, behavior: "smooth" }) }
  const pct = avance(r)
  const recomendaciones = insights(r)
  const noSabe = puntosNoSabe(r)
  const contactoValido = contacto.nombre.trim() && emailValido(contacto.email)
  const moduloActivo = id => r.modulos[id] === "si" || r.modulos[id] === "nose"

  const enviar = async e => {
    e.preventDefault()
    if (!contactoValido) return
    setEstado("enviando")
    const { mensaje, website, ...datos } = contacto
    const resumen = [...resumenRespuestas(r), ...(noSabe.length ? [`Por definir en diagnóstico (No sé): ${noSabe.join(", ")}`] : [])]
    const ok = await enviarLead({ tipo: "evaluacion", contacto: datos, mensaje, website, resumen, respuestas: r })
    setEstado(ok ? "enviado" : "error")
    if (ok) window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (estado === "enviado") {
    return (
      <section className="pt-32 pb-24 bg-gray-50 min-h-[80vh]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <CheckCircle size={56} className="text-agro-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">¡Recibimos tu evaluación, {contacto.nombre.trim().split(" ")[0]}!</h1>
          <p className="text-gray-500 mb-10">Nuestro equipo la está revisando. Esto es lo que sigue:</p>
          <ol className="text-left flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {[
              ["Revisamos tus respuestas", "Un especialista analiza tu operación y tus prioridades."],
              ["Te contactamos en 24 horas hábiles", "Para conocerte mejor y coordinar la visita de diagnóstico."],
              ["Recibes tu propuesta de diagnóstico previo", `Con el alcance de la visita, entregables y próximos pasos${noSabe.length ? `, incluyendo los ${noSabe.length} puntos que marcaste como “No sé”` : ""}.`],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-agro-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div><p className="font-semibold text-gray-900 text-sm">{t}</p><p className="text-xs text-gray-500">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <div>
      <section className="pt-28 pb-8 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <ClipboardCheck size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Evaluación AgroHub · 5 minutos</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 max-w-3xl">
            Evalúa tu operación, <span className="text-agro-green-300">diseñamos tu AgroHub</span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl leading-relaxed mb-5">
            Cuéntanos qué tienes y qué buscas. Si no sabes algo, marca <b className="text-white/85">“No sé”</b>: lo resolvemos juntos en el diagnóstico.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/75 text-sm">
            <span className="flex items-center gap-1.5"><ClipboardCheck size={14} className="text-agro-green-300" /> Sin compromiso</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-agro-green-300" /> Datos confidenciales</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-agro-green-300" /> Respuesta en 24 h hábiles</span>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">

          {/* Pasos */}
          <ol className="grid grid-cols-4 gap-2 mb-8">
            {PASOS.map((p, i) => (
              <li key={p.titulo}>
                <button type="button" onClick={() => irA(i)} className="w-full text-left group">
                  <div className={`h-1.5 rounded-full mb-2 transition-colors ${i <= paso ? "bg-agro-green-600" : "bg-gray-200 group-hover:bg-gray-300"}`} />
                  <p className={`text-xs font-bold ${i === paso ? "text-agro-green-700" : "text-gray-400"}`}><span className="hidden sm:inline">Paso </span>{i + 1}<span className="hidden sm:inline"> · {p.titulo}</span></p>
                  <p className="text-[11px] text-gray-400 hidden md:block">{p.desc}</p>
                </button>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={enviar} className="lg:col-span-2 flex flex-col gap-6">

              {paso === 0 && <>
                <Bloque titulo="Tu cultivo y superficie">
                  <Pregunta label="Elige tu tipo de cultivo (puedes marcar varios)">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CULTIVOS.map(c => <Chip key={c} activo={r.cultivos.includes(c)} onClick={() => toggle("cultivos")(c)}>{c}</Chip>)}
                    </div>
                    <input type="text" value={r.otroCultivo} onChange={e => set("otroCultivo")(e.target.value)}
                      placeholder="Otro cultivo (ej: quínoa, lúpulo, olivos)" className={`${inputCls} mt-3`} />
                  </Pregunta>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Pregunta label="Hectáreas totales"><Contador val={r.hectareas} set={set("hectareas")} /></Pregunta>
                    <Pregunta label="Zonas o predios" tooltip="Zonas productivas o predios separados geográficamente."><Contador val={r.zonas} set={set("zonas")} min={1} /></Pregunta>
                  </div>
                </Bloque>

                <Bloque titulo="Modelo productivo">
                  <div className="flex flex-col gap-3">
                    {MODELOS_PRODUCTIVOS.map(m => <Radio key={m.id} activo={r.modelo === m.id} onClick={() => set("modelo")(m.id)} titulo={m.label} desc={m.desc} />)}
                  </div>
                  {conAsociados(r) && <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {r.modelo === "mixto" && (
                        <Pregunta label="Hectáreas propias">
                          <Contador val={r.haPropias} set={set("haPropias")} />
                          <p className="text-[10px] text-gray-400 mt-1">{r.hectareas == null || r.haPropias == null ? "" : `${haAsociadas(r).toLocaleString("es-CL")} ha con productores asociados`}</p>
                        </Pregunta>
                      )}
                      <Pregunta label="N° de productores asociados"><Contador val={r.productores} set={set("productores")} /></Pregunta>
                    </div>
                    <Pregunta label="¿Qué les entregas a tus productores?">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {APOYOS_PRODUCTORES.map(a => <Chip key={a} activo={r.apoyos.includes(a)} onClick={() => toggle("apoyos")(a)}>{a}</Chip>)}
                      </div>
                    </Pregunta>
                  </>}
                </Bloque>

                <Bloque titulo="Riego y registros">
                  <Pregunta label="¿Cómo riegas?">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIPOS_RIEGO.map(x => <Chip key={x} activo={r.riegos.includes(x)} onClick={() => toggle("riegos")(x)}>{x}</Chip>)}
                    </div>
                  </Pregunta>
                  <Pregunta label="¿Cómo registran hoy las labores y datos de campo?">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {REGISTROS.map(x => <Chip key={x} activo={r.registros.includes(x)} onClick={() => toggle("registros")(x)}>{x}</Chip>)}
                    </div>
                  </Pregunta>
                </Bloque>

                <Bloque titulo="Tus sensores hoy" ayuda="Nos ayuda a aprovechar lo que ya tienes antes de proponer algo nuevo.">
                  <Pregunta label="¿Tienes sensores instalados?"><Opciones opciones={SI_NO} valor={r.tieneSensores} set={set("tieneSensores")} /></Pregunta>
                  {r.tieneSensores === "si" && <>
                    <Pregunta label="¿De qué marcas?">
                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${!verMarcas ? "max-h-40 overflow-hidden" : ""}`}>
                        {MARCAS.map(s => <Chip key={s} activo={r.marcas.includes(s)} onClick={() => toggle("marcas")(s)}>{s}</Chip>)}
                      </div>
                      <button type="button" onClick={() => setVerMarcas(v => !v)} className="flex items-center gap-1 text-xs text-agro-green-600 font-semibold mt-2">
                        {verMarcas ? "Ver menos" : `Ver las ${MARCAS.length} opciones`} {verMarcas ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                      <input type="text" value={r.otraMarca} onChange={e => set("otraMarca")(e.target.value)} placeholder="Otra marca" className={`${inputCls} mt-2`} />
                    </Pregunta>
                    <Pregunta label="¿Cuántos sensores tienes, aproximadamente?"><Contador val={r.cantidadSensores} set={set("cantidadSensores")} /></Pregunta>
                    <Pregunta label="¿Qué miden?">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {VARIABLES_SENSORES.map(x => <Chip key={x} activo={r.variables.includes(x)} onClick={() => toggle("variables")(x)}>{x}</Chip>)}
                      </div>
                    </Pregunta>
                    <Pregunta label="¿Cómo ves hoy la data de tus sensores?">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {VER_DATA.map(x => <Chip key={x} activo={r.verData.includes(x)} onClick={() => toggle("verData")(x)}>{x}</Chip>)}
                      </div>
                    </Pregunta>
                    <Pregunta label="¿Quién revisa esa data?"><Opciones opciones={QUIEN_REVISA} valor={r.quienRevisa} set={set("quienRevisa")} /></Pregunta>
                  </>}
                  <Pregunta label="¿Cómo es la señal de celular o internet en el campo?"><Opciones opciones={CONECTIVIDAD} valor={r.conectividad} set={set("conectividad")} /></Pregunta>
                </Bloque>
              </>}

              {paso === 1 && <>
                <Bloque titulo="¿Qué quieres mejorar esta temporada?" ayuda={`Elige hasta ${MAX_PRIORIDADES}.`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRIORIDADES.map(p => {
                      const bloqueado = !r.prioridades.includes(p) && p !== "Aún no lo tengo claro" && r.prioridades.filter(x => x !== "Aún no lo tengo claro").length >= MAX_PRIORIDADES
                      return <Chip key={p} activo={r.prioridades.includes(p)} onClick={() => togglePrioridad(p)} disabled={bloqueado}>{p}</Chip>
                    })}
                  </div>
                </Bloque>

                <Bloque titulo="Sensores y datos">
                  <Pregunta label={r.tieneSensores === "si" ? "¿Quieres sumar más sensores?" : "¿Te interesa instalar sensores?"}>
                    <Opciones opciones={SI_NO} valor={r.masSensores} set={set("masSensores")} />
                  </Pregunta>
                  {r.masSensores === "si" && (
                    <Pregunta label="¿Qué te gustaría medir?">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {VARIABLES_SENSORES.map(x => <Chip key={x} activo={r.medirMas.includes(x)} onClick={() => toggle("medirMas")(x)}>{x}</Chip>)}
                      </div>
                    </Pregunta>
                  )}
                  <Pregunta label="¿Cómo te gustaría ver la información?">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {COMO_QUIERE_VER.map(x => <Chip key={x} activo={r.comoVer.includes(x)} onClick={() => toggle("comoVer")(x)}>{x}</Chip>)}
                    </div>
                  </Pregunta>
                </Bloque>

                <Bloque titulo="Plazo y equipo">
                  <Pregunta label="¿Cuándo te gustaría partir?"><Opciones opciones={PLAZOS} valor={r.plazo} set={set("plazo")} /></Pregunta>
                  <Pregunta label="¿Quieres que formemos a tu equipo como extensionistas?" tooltip="Técnicos o trabajadores que aprenden a usar la tecnología y acompañan a otros.">
                    <Opciones opciones={SI_NO} valor={r.capacitacion} set={set("capacitacion")} />
                  </Pregunta>
                </Bloque>
              </>}

              {paso === 2 && <>
                <Bloque titulo="¿Qué módulos te darían más utilidad?" ayuda="Lee la descripción de cada uno y marca si te sirve. Si no estás seguro, marca “No sé”.">
                  {MODULOS.map(m => (
                    <div key={m.id} className={`rounded-xl border p-4 transition-colors ${r.modulos[m.id] === "si" ? "border-agro-green-400 bg-agro-green-50/50" : r.modulos[m.id] === "nose" ? "border-amber-200 bg-amber-50/40" : "border-gray-100"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{m.label}</p>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{m.desc}</p>
                        </div>
                        <div className="shrink-0"><Opciones opciones={INTERES} valor={r.modulos[m.id] || ""} set={v => setModulo(m.id, v || r.modulos[m.id])} /></div>
                      </div>

                      {(m.id === "ai" || m.id === "docs") && moduloActivo(m.id) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-700 mb-2">¿Cómo prefieres que funcione?</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {MODOS_IA.map(o => {
                              const k = m.id === "ai" ? "modoAi" : "modoDocs"
                              return <Radio key={o.id} activo={r[k] === o.id} onClick={() => set(k)(o.id)} titulo={o.id} desc={o.desc} />
                            })}
                          </div>
                        </div>
                      )}
                      {m.id === "fuentes" && moduloActivo(m.id) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="flex items-center text-xs font-semibold text-gray-700 mb-2">¿Qué fuentes te interesan?<Tooltip text="Algunas tienen integración estándar (API); otras requieren un conector a medida, lo que suma desarrollo." /></p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {FUENTES.map(x => <Chip key={x} activo={r.fuentes.includes(x)} onClick={() => toggle("fuentes")(x)}>{x}</Chip>)}
                          </div>
                          <input type="text" value={r.otrasFuentes} onChange={e => set("otrasFuentes")(e.target.value)} placeholder="Otras fuentes (ej: exportadora, laboratorio)" className={`${inputCls} mt-2`} />
                        </div>
                      )}
                      {m.id === "dashboard" && moduloActivo(m.id) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="flex items-center text-xs font-semibold text-gray-700 mb-2">¿Cuántas vistas de indicadores (KPI) necesitas?<Tooltip text="Cada vista es un panel en tiempo real: humedad, temperatura, alerta de riego, etc." /></p>
                          <Contador val={r.vistasKpi} set={set("vistasKpi")} min={1} />
                        </div>
                      )}
                    </div>
                  ))}
                </Bloque>

                <Bloque titulo="¿Cómo lo implementarías?" ayuda="Si no lo tienes claro, marca “No sé” y te explicamos las alternativas.">
                  <Pregunta label="Tipo de licencia" tooltip="Define cómo contratas y qué propiedad obtienes sobre el código.">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {LICENCIAS.map(l => <Radio key={l.id} activo={r.licencia === l.id} onClick={() => set("licencia")(l.id)} titulo={l.label} desc={l.desc} badge={l.badge} />)}
                    </div>
                  </Pregunta>
                  <Pregunta label="¿Cuántas personas usarían la plataforma?">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[["admins", "Administradores", "Gestionan la plataforma"], ["agricultores", "Agricultores", "Usan la app en terreno"], ["asesores", "Asesores / técnicos", "Acompañan a productores"]].map(([k, t, h]) => (
                        <div key={k}>
                          <p className="text-xs font-semibold text-gray-700">{t}</p>
                          <p className="text-[10px] text-gray-400 mb-1.5">{h}</p>
                          <Contador val={r[k]} set={set(k)} />
                        </div>
                      ))}
                    </div>
                  </Pregunta>
                  <Pregunta label="Años de soporte (1 año incluido)"><Contador val={r.soporte} set={set("soporte")} min={1} /></Pregunta>
                </Bloque>
              </>}

              {paso === 3 && (
                <div className="bg-white border-2 border-agro-green-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base">¿A quién le enviamos tu diagnóstico?</h2>
                  <p className="text-xs text-gray-400 mb-4">Un especialista revisa tus respuestas y te contacta en 24 horas hábiles.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={contacto.nombre} onChange={setC("nombre")} placeholder="Nombre *" className={inputCls} />
                    <input value={contacto.empresa} onChange={setC("empresa")} placeholder="Empresa" className={inputCls} />
                    <input value={contacto.cargo} onChange={setC("cargo")} placeholder="Cargo" className={inputCls} />
                    <input type="email" value={contacto.email} onChange={setC("email")} placeholder="Email *" className={inputCls} />
                    <input value={contacto.telefono} onChange={setC("telefono")} placeholder="Teléfono (opcional)" className={inputCls} />
                  </div>
                  <textarea value={contacto.mensaje} onChange={setC("mensaje")} rows={3} placeholder="¿Algo más que debamos saber? (opcional)" className={`${inputCls} mt-3 resize-none`} />
                  <input value={contacto.website} onChange={setC("website")} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                  {noSabe.length > 0 && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-amber-800 mb-1">Lo revisaremos juntos en el diagnóstico ({noSabe.length}):</p>
                      <p className="text-xs text-amber-700">{noSabe.join(" · ")}</p>
                    </div>
                  )}
                  {estado === "error" && <p className="text-xs text-red-600 mt-3">No pudimos enviar tu evaluación. Inténtalo nuevamente en unos minutos.</p>}
                  <button type="submit" disabled={!contactoValido || estado === "enviando"}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                    <Send size={15} /> {estado === "enviando" ? "Enviando..." : "Solicitar diagnóstico previo"}
                  </button>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Sin compromiso. Tus datos solo se usan para preparar tu diagnóstico. <a href="/terminos" className="underline">Ver términos</a>.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                {paso > 0 ? (
                  <button type="button" onClick={() => irA(paso - 1)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2.5">
                    <ChevronLeft size={16} /> Volver
                  </button>
                ) : <span />}
                {paso < PASOS.length - 1 && (
                  <button type="button" onClick={() => irA(paso + 1)} className="inline-flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors">
                    Siguiente: {PASOS[paso + 1].titulo} <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </form>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-gray-900 text-base flex items-center gap-2"><Lightbulb size={16} className="text-agro-green-600" /> Tu diagnóstico preliminar</h2>
                    <span className="text-xs font-bold text-agro-green-700">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-agro-green-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  {recomendaciones.length === 0 ? (
                    <p className="text-sm text-gray-500 leading-relaxed">A medida que respondas, aquí verás cómo AgroHub puede ayudar a tu operación.</p>
                  ) : (
                    <ul className="flex flex-col gap-3 max-h-[46vh] overflow-y-auto pr-1">
                      {recomendaciones.map(x => (
                        <li key={x.titulo} className="border-l-2 border-agro-green-400 pl-3">
                          <p className="text-xs font-bold text-gray-900">{x.titulo}</p>
                          <p className="text-xs text-gray-600 leading-relaxed">{x.texto}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {paso < 3 && (
                    <button type="button" onClick={() => irA(3)} className="mt-5 flex items-center justify-center gap-2 w-full bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                      Solicitar diagnóstico previo <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                <div className="bg-agro-green-900 rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-sm mb-4">Cómo trabajamos</h3>
                  <ol className="flex flex-col gap-3">
                    {ETAPAS.map((e, i) => (
                      <li key={e.titulo} className="flex gap-3">
                        <span className="w-5 h-5 rounded-full bg-agro-green-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <div>
                          <p className="text-xs font-semibold">{e.titulo}</p>
                          <p className="text-[11px] text-white/60 leading-relaxed">{e.texto}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
