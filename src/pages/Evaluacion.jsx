import { useState } from "react"
import { Check, ClipboardCheck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Info, Lightbulb, ShieldCheck, Clock, Send, CheckCircle, ArrowRight, Plus, Trash2, Server } from "lucide-react"
import { enviarLead, emailValido } from "../lib/lead"
import { PRODUCTOS_AGRO } from "../lib/productosAgro"
import MultiSelectBusqueda from "../components/MultiSelectBusqueda"
import {
  OTROS, CULTIVOS, MODELOS_PRODUCTIVOS, APOYOS_PRODUCTORES, TIPOS_RIEGO, REGISTROS, SI_NO,
  FORMAS_FERTILIZACION, FORMAS_APLICACION, ANALISIS,
  TOMATE_TIPOS, TOMATE_ESTABLECIMIENTO, TOMATE_COSECHA, TOMATE_PROBLEMAS, TOMATE_RECEPCION,
  MARCAS_SENSORES, VARIABLES_SENSORES, VER_DATA, QUIEN_REVISA, CONECTIVIDAD,
  PRIORIDADES, MEDIR, COMO_QUIERE_VER, PLAZOS, INTERES, MODULOS, MODOS_IA, FUENTES, LICENCIAS, TRASPASO_TI, USUARIOS, ETAPAS,
  estadoInicial, nuevaZona, cultivaTomate, tomateIndustrial, conAsociados, haAsociadas, requiereTraspaso,
  totalHaZonas, totalAgricultoresZonas, resumenRespuestas, avance, insights,
} from "../lib/evaluacion"

const CULTIVOS_VISIBLES = 8
const PASOS = [
  { titulo: "Estado actual", desc: "Qué tienes hoy" },
  { titulo: "Qué buscas",    desc: "Qué quieres lograr" },
  { titulo: "Módulos",       desc: "Qué te serviría" },
  { titulo: "Tus datos",     desc: "A quién escribimos" },
]
const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"
const fmt = n => Number(n || 0).toLocaleString("es-CL")

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

function Contador({ val, set, min = 0, paso = 1 }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => set(Math.max(min, val - paso))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">-</button>
      <input type="number" value={val} onChange={e => set(Math.max(min, parseInt(e.target.value) || 0))}
        className="w-24 text-center border border-gray-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
      <button type="button" onClick={() => set(val + paso)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">+</button>
    </div>
  )
}

function Chip({ activo, onClick, children, disabled = false }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${activo ? "bg-agro-green-50 border-agro-green-400 text-agro-green-800" : disabled ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300"}`}>
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
        {activo && <Check size={9} className="text-white" />}
      </div>
      <span className="flex-1">{children}</span>
    </button>
  )
}

function CampoOtros({ valor, set, placeholder = "Cuéntanos cuál" }) {
  return <input type="text" value={valor || ""} onChange={e => set(e.target.value)} placeholder={placeholder} className={`${inputCls} mt-2`} />
}

// Seleccion multiple; al marcar "Otros" aparece un campo de texto
function Chips({ opciones, valor, onToggle, otro, setOtro, cols = "grid-cols-1 sm:grid-cols-2" }) {
  return (
    <>
      <div className={`grid ${cols} gap-2`}>
        {opciones.map(x => <Chip key={x} activo={valor.includes(x)} onClick={() => onToggle(x)}>{x}</Chip>)}
      </div>
      {valor.includes(OTROS) && <CampoOtros valor={otro} set={setOtro} />}
    </>
  )
}

// Seleccion unica en pastillas; la opcion "otro" abre un campo de texto
function Opciones({ opciones, valor, set, otro, setOtro }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {opciones.map(o => {
          const id = o.id ?? o
          const activo = valor === id
          return (
            <button key={id} type="button" onClick={() => set(activo ? "" : id)}
              className={`text-xs px-3.5 py-2 rounded-full border font-semibold transition-all ${activo ? "bg-agro-green-600 border-agro-green-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-agro-green-400"}`}>
              {o.label ?? o}
            </button>
          )
        })}
      </div>
      {valor === "otro" && setOtro && <CampoOtros valor={otro} set={setOtro} />}
    </>
  )
}

function Estrellas({ valor = 0, set }) {
  return (
    <div className="flex gap-1 shrink-0">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => set(valor === n ? 0 : n)} aria-label={`${n} de 5`}
          className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${n <= valor ? "bg-agro-green-600 border-agro-green-600 text-white" : "bg-white border-gray-200 text-gray-400 hover:border-agro-green-400"}`}>
          {n}
        </button>
      ))}
    </div>
  )
}

// Lista con puntaje 1-5 por opcion + fila "Otros" con texto y puntaje
function Puntajes({ opciones, valores, set, otro, setOtro, puntajeOtro, setPuntajeOtro }) {
  return (
    <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-xl">
      {opciones.map(o => (
        <div key={o} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2">
          <span className={`text-sm ${valores[o] ? "text-gray-900 font-medium" : "text-gray-600"}`}>{o}</span>
          <Estrellas valor={valores[o]} set={v => set({ ...valores, [o]: v })} />
        </div>
      ))}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2">
        <input type="text" value={otro || ""} onChange={e => setOtro(e.target.value)} placeholder="Otros (escribe cuál)"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
        <Estrellas valor={puntajeOtro} set={setPuntajeOtro} />
      </div>
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

function Zonas({ zonas, set }) {
  const cambiar = (i, k, v) => set(zonas.map((z, j) => j === i ? { ...z, [k]: v } : z))
  return (
    <div className="flex flex-col gap-2">
      <div className="hidden sm:grid grid-cols-[1fr_130px_130px_32px] gap-2 text-[11px] font-semibold text-gray-500 px-1">
        <span>Zona o predio</span><span>Hectáreas</span><span>Agricultores</span><span />
      </div>
      {zonas.map((z, i) => (
        <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_130px_130px_32px] gap-2 items-center">
          <input value={z.nombre} onChange={e => cambiar(i, "nombre", e.target.value)} placeholder="Ej: Quinta de Tilcoco" className={`${inputCls} col-span-2 sm:col-span-1`} />
          <input type="number" min={0} value={z.hectareas} onChange={e => cambiar(i, "hectareas", Math.max(0, parseInt(e.target.value) || 0))} placeholder="ha" aria-label="Hectáreas" className={inputCls} />
          <input type="number" min={0} value={z.agricultores} onChange={e => cambiar(i, "agricultores", Math.max(0, parseInt(e.target.value) || 0))} placeholder="agricultores" aria-label="Agricultores" className={inputCls} />
          <button type="button" onClick={() => set(zonas.filter((_, j) => j !== i))} disabled={zonas.length === 1}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30" aria-label="Quitar zona"><Trash2 size={15} /></button>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button type="button" onClick={() => set([...zonas, nuevaZona(zonas.length + 1)])}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-agro-green-700 hover:underline"><Plus size={14} /> Agregar zona</button>
        <span className="text-[11px] text-gray-400">Total zonas: {fmt(zonas.reduce((a, z) => a + z.hectareas, 0))} ha · {fmt(zonas.reduce((a, z) => a + z.agricultores, 0))} agricultores</span>
      </div>
    </div>
  )
}

export default function Evaluacion() {
  const [paso, setPaso] = useState(0)
  const [r, setR] = useState(estadoInicial)
  const [contacto, setContacto] = useState({ nombre: "", empresa: "", cargo: "", email: "", telefono: "", mensaje: "", website: "" })
  const [verMarcas, setVerMarcas] = useState(false)
  const [verCultivos, setVerCultivos] = useState(false)
  const [estado, setEstado] = useState("editando")

  const set = k => v => setR(prev => ({ ...prev, [k]: v }))
  const toggle = k => item => setR(prev => ({ ...prev, [k]: prev[k].includes(item) ? prev[k].filter(x => x !== item) : [...prev[k], item] }))
  const setOtro = k => v => setR(prev => ({ ...prev, otros: { ...prev.otros, [k]: v } }))
  const setPuntajeOtro = k => v => setR(prev => ({ ...prev, puntajeOtros: { ...prev.puntajeOtros, [k]: v } }))
  const setModulo = (id, v) => setR(prev => ({ ...prev, modulos: { ...prev.modulos, [id]: v || undefined } }))
  const setC = k => e => setContacto(prev => ({ ...prev, [k]: e.target.value }))
  // Atajos para preguntas con "Otros"
  const chips = (k, opciones, cols) => <Chips opciones={opciones} valor={r[k]} onToggle={toggle(k)} otro={r.otros[k]} setOtro={setOtro(k)} cols={cols} />
  const opciones = (k, lista) => <Opciones opciones={lista} valor={r[k]} set={set(k)} otro={r.otros[k]} setOtro={setOtro(k)} />
  const puntaje = (k, lista) => <Puntajes opciones={lista} valores={r[k]} set={set(k)} otro={r.otros[k]} setOtro={setOtro(k)} puntajeOtro={r.puntajeOtros[k]} setPuntajeOtro={setPuntajeOtro(k)} />

  const irA = n => { setPaso(n); window.scrollTo({ top: 0, behavior: "smooth" }) }
  const pct = avance(r)
  const recomendaciones = insights(r)
  const contactoValido = contacto.nombre.trim() && emailValido(contacto.email)
  const moduloActivo = id => r.modulos[id] === "si" || r.modulos[id] === "tal"
  const difHa = totalHaZonas(r) - r.hectareas

  const enviar = async e => {
    e.preventDefault()
    if (!contactoValido) return
    setEstado("enviando")
    const { mensaje, website, ...datos } = contacto
    const ok = await enviarLead({ tipo: "evaluacion", contacto: datos, mensaje, website, resumen: resumenRespuestas(r), respuestas: r })
    setEstado(ok ? "enviado" : "error")
    if (ok) window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (estado === "enviado") {
    return (
      <section className="pt-32 pb-24 bg-gray-50 min-h-[80vh]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <CheckCircle size={56} className="text-agro-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">¡Gracias, {contacto.nombre.trim().split(" ")[0]}!</h1>
          <p className="text-gray-500 mb-2">Recibimos tu evaluación. Prontamente nos contactaremos con tu equipo.</p>
          <p className="text-gray-400 text-sm mb-10">Te enviamos una confirmación a <b className="text-gray-600">{contacto.email}</b>.</p>
          <ol className="text-left flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {[
              ["Revisamos tus respuestas", "Un especialista analiza tu operación y tus prioridades."],
              ["Te contactamos", "Para conocerte mejor y coordinar la visita de diagnóstico."],
              ["Recibes tu propuesta de diagnóstico previo", "Con el alcance de la visita, entregables y próximos pasos."],
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
            Cuéntanos qué tienes y qué buscas. Si tu caso no calza con las opciones, marca <b className="text-white/85">“Otros”</b> y escríbelo.
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CULTIVOS.filter((c, i) => verCultivos || i < CULTIVOS_VISIBLES || r.cultivos.includes(c)).map(c => (
                        <Chip key={c} activo={r.cultivos.includes(c)} onClick={() => toggle("cultivos")(c)}>{c}</Chip>
                      ))}
                    </div>
                    <button type="button" onClick={() => setVerCultivos(v => !v)} className="flex items-center gap-1 text-xs text-agro-green-600 font-semibold mt-2">
                      {verCultivos ? "Ver menos" : `Ver los ${CULTIVOS.length} cultivos`} {verCultivos ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    <input type="text" value={r.otroCultivo} onChange={e => set("otroCultivo")(e.target.value)}
                      placeholder="Otros cultivos (ej: quínoa, lúpulo, pistacho)" className={`${inputCls} mt-3`} />
                  </Pregunta>
                  <Pregunta label="Hectáreas totales"><Contador val={r.hectareas} set={set("hectareas")} paso={100} /></Pregunta>
                  <Pregunta label="¿Cuántas hectáreas y agricultores tienes por zona?" tooltip="Una fila por zona productiva o predio.">
                    <Zonas zonas={r.zonas} set={set("zonas")} />
                    {totalHaZonas(r) > 0 && difHa !== 0 && (
                      <p className="text-[11px] text-amber-700 mt-1">La suma por zonas ({fmt(totalHaZonas(r))} ha) {difHa > 0 ? "supera" : "es menor que"} el total indicado ({fmt(r.hectareas)} ha).</p>
                    )}
                  </Pregunta>
                </Bloque>

                {cultivaTomate(r) && (
                  <Bloque titulo="Tu tomate" ayuda="Unas preguntas específicas para entender tu ciclo de tomate.">
                    <Pregunta label="¿Qué tipo de tomate produces?">{chips("tomateTipos", TOMATE_TIPOS, "grid-cols-1 sm:grid-cols-2")}</Pregunta>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Pregunta label="Establecimiento">{opciones("tomateEstablecimiento", TOMATE_ESTABLECIMIENTO)}</Pregunta>
                      <Pregunta label="Cosecha">{opciones("tomateCosecha", TOMATE_COSECHA)}</Pregunta>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Pregunta label="Densidad de plantación (plantas/ha)" tooltip="Aproximada. Si varía entre campos, pon la más común.">
                        <Contador val={r.tomateDensidad} set={set("tomateDensidad")} paso={1000} />
                      </Pregunta>
                      <Pregunta label="Híbrido o variedad principal">
                        <input type="text" value={r.tomateVariedad} onChange={e => set("tomateVariedad")(e.target.value)} placeholder="Ej: H3402, H1015" className={inputCls} />
                      </Pregunta>
                    </div>
                    <Pregunta label="¿Qué problemas te han costado más en las últimas temporadas?">{chips("tomateProblemas", TOMATE_PROBLEMAS)}</Pregunta>
                    {tomateIndustrial(r) && (
                      <Pregunta label="En la recepción de la planta, ¿qué te genera más descuentos?">{chips("tomateRecepcion", TOMATE_RECEPCION, "grid-cols-2 sm:grid-cols-3")}</Pregunta>
                    )}
                  </Bloque>
                )}

                <Bloque titulo="Modelo productivo">
                  <div className="flex flex-col gap-3">
                    {MODELOS_PRODUCTIVOS.map(m => <Radio key={m.id} activo={r.modelo === m.id} onClick={() => set("modelo")(m.id)} titulo={m.label} desc={m.desc} />)}
                  </div>
                  {conAsociados(r) && <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {r.modelo === "mixto" && (
                        <Pregunta label="Hectáreas propias">
                          <Contador val={r.haPropias} set={set("haPropias")} paso={100} />
                          <p className="text-[10px] text-gray-400 mt-1">{fmt(haAsociadas(r))} ha con productores asociados</p>
                        </Pregunta>
                      )}
                      <Pregunta label="N° de productores asociados"><Contador val={r.productores} set={set("productores")} /></Pregunta>
                    </div>
                    <Pregunta label="¿Qué les entregas a tus productores?">{chips("apoyos", APOYOS_PRODUCTORES)}</Pregunta>
                  </>}
                </Bloque>

                <Bloque titulo="Manejo del cultivo">
                  <Pregunta label="¿Cómo riegas?">{chips("riegos", TIPOS_RIEGO, "grid-cols-2 sm:grid-cols-3")}</Pregunta>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Pregunta label="¿Qué marca y modelo de programador de riego tienes?">
                      <input type="text" value={r.programadorRiego} onChange={e => set("programadorRiego")(e.target.value)} placeholder="Ej: Netafim NMC-Pro, Galcon, Rain Bird" className={inputCls} />
                    </Pregunta>
                    <Pregunta label="¿Qué marca y modelo de programador de fertirriego tienes?">
                      <input type="text" value={r.programadorFerti} onChange={e => set("programadorFerti")(e.target.value)} placeholder="Ej: Netafim NetaJet, Galcon, Talgil" className={inputCls} />
                    </Pregunta>
                  </div>
                  <Pregunta label="¿Cómo fertilizas?">{chips("fertilizacion", FORMAS_FERTILIZACION, "grid-cols-1 sm:grid-cols-3")}</Pregunta>
                  <Pregunta label="¿Cómo aplicas fitosanitarios?">{chips("aplicacion", FORMAS_APLICACION, "grid-cols-2 sm:grid-cols-3")}</Pregunta>
                  <Pregunta label="¿Qué productos usas?" tooltip="Fertilizantes, enmiendas y fitosanitarios por ingrediente activo. Si no está en la lista, escríbelo y agrégalo.">
                    <MultiSelectBusqueda grupos={PRODUCTOS_AGRO} valor={r.productos} onChange={set("productos")}
                      placeholder="Busca por nombre o tipo: urea, nitrato, mancozeb, herbicida..." />
                  </Pregunta>
                  <Pregunta label="¿Qué análisis haces durante la temporada?">{chips("analisis", ANALISIS, "grid-cols-2 sm:grid-cols-4")}</Pregunta>
                  <Pregunta label="¿Cómo registran hoy las labores y datos de campo?">{chips("registros", REGISTROS)}</Pregunta>
                </Bloque>

                <Bloque titulo="Tus sensores hoy" ayuda="Nos ayuda a aprovechar lo que ya tienes antes de proponer algo nuevo.">
                  <Pregunta label="¿Tienes sensores instalados?">{opciones("tieneSensores", SI_NO)}</Pregunta>
                  {r.tieneSensores === "si" && <>
                    <Pregunta label="¿De qué marcas?">
                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${!verMarcas ? "max-h-40 overflow-hidden" : ""}`}>
                        {MARCAS_SENSORES.map(s => <Chip key={s} activo={r.marcas.includes(s)} onClick={() => toggle("marcas")(s)}>{s}</Chip>)}
                      </div>
                      <button type="button" onClick={() => setVerMarcas(v => !v)} className="flex items-center gap-1 text-xs text-agro-green-600 font-semibold mt-2">
                        {verMarcas ? "Ver menos" : `Ver las ${MARCAS_SENSORES.length} marcas`} {verMarcas ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                      <input type="text" value={r.otraMarca} onChange={e => set("otraMarca")(e.target.value)} placeholder="Otras marcas" className={`${inputCls} mt-2`} />
                    </Pregunta>
                    <Pregunta label="¿Cuántos sensores tienes, aproximadamente?"><Contador val={r.cantidadSensores} set={set("cantidadSensores")} /></Pregunta>
                    <Pregunta label="¿Qué miden?">{chips("variables", VARIABLES_SENSORES)}</Pregunta>
                    <Pregunta label="¿Cómo ves hoy la data de tus sensores?">{chips("verData", VER_DATA)}</Pregunta>
                    <Pregunta label="¿Quién revisa esa data?">{opciones("quienRevisa", QUIEN_REVISA)}</Pregunta>
                  </>}
                  <Pregunta label="¿Cómo es la señal de celular o internet en el campo?">{opciones("conectividad", CONECTIVIDAD)}</Pregunta>
                </Bloque>
              </>}

              {paso === 1 && <>
                <Bloque titulo="¿Qué quieres mejorar esta temporada?" ayuda="Puntúa del 1 al 5 cada tema (5 = muy importante). Puedes puntuarlos todos.">
                  {puntaje("prioridades", PRIORIDADES)}
                </Bloque>

                <Bloque titulo="Sensores y datos">
                  <Pregunta label={r.tieneSensores === "si" ? "¿Quieres sumar más sensores?" : "¿Te interesa instalar sensores?"}>{opciones("masSensores", SI_NO)}</Pregunta>
                  {r.masSensores !== "no" && (
                    <Pregunta label="¿Qué te gustaría medir? (1 a 5)">{puntaje("medir", MEDIR)}</Pregunta>
                  )}
                  <Pregunta label="¿Cómo te gustaría ver la información? (1 a 5)">{puntaje("comoVer", COMO_QUIERE_VER)}</Pregunta>
                </Bloque>

                <Bloque titulo="Plazo y equipo">
                  <Pregunta label="¿Cuándo te gustaría partir?">{opciones("plazo", PLAZOS)}</Pregunta>
                  <Pregunta label="¿Quieres que formemos a tu equipo como extensionistas?" tooltip="Técnicos o trabajadores que aprenden a usar la tecnología y acompañan a otros.">
                    {opciones("capacitacion", SI_NO)}
                  </Pregunta>
                </Bloque>
              </>}

              {paso === 2 && <>
                <Bloque titulo="¿Qué módulos te darían más utilidad?" ayuda="Lee la descripción de cada uno y marca si te sirve.">
                  {MODULOS.map(m => (
                    <div key={m.id} className={`rounded-xl border p-4 transition-colors ${r.modulos[m.id] === "si" ? "border-agro-green-400 bg-agro-green-50/50" : r.modulos[m.id] === "tal" ? "border-agro-green-200 bg-agro-green-50/20" : "border-gray-100"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{m.label}</p>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{m.desc}</p>
                        </div>
                        <div className="shrink-0"><Opciones opciones={INTERES} valor={r.modulos[m.id] || ""} set={v => setModulo(m.id, v)} /></div>
                      </div>

                      {(m.id === "ai" || m.id === "docs") && moduloActivo(m.id) && (() => {
                        const k = m.id === "ai" ? "modoAi" : "modoDocs"
                        return (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-700 mb-2">¿Cómo prefieres que funcione?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {MODOS_IA.map(o => <Radio key={o.id} activo={r[k] === o.id} onClick={() => set(k)(o.id)} titulo={o.id} desc={o.desc} />)}
                            </div>
                            {r[k] === OTROS && <CampoOtros valor={r.otros[k]} set={setOtro(k)} />}
                          </div>
                        )
                      })()}
                      {m.id === "fuentes" && moduloActivo(m.id) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="flex items-center text-xs font-semibold text-gray-700 mb-2">¿Qué fuentes te interesan?<Tooltip text="Algunas tienen integración estándar (API); otras requieren un conector a medida, lo que suma desarrollo." /></p>
                          {chips("fuentes", FUENTES, "grid-cols-2 sm:grid-cols-4")}
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

                <Bloque titulo="¿Cómo lo implementarías?">
                  <Pregunta label="Tipo de licencia" tooltip="Define cómo contratas y qué propiedad obtienes sobre el código.">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {LICENCIAS.map(l => <Radio key={l.id} activo={r.licencia === l.id} onClick={() => set("licencia")(l.id)} titulo={l.label} desc={l.desc} badge={l.badge} />)}
                    </div>
                    {r.licencia === "otro" && <CampoOtros valor={r.otros.licencia} set={setOtro("licencia")} />}
                    {requiereTraspaso(r) && (
                      <div className="mt-3 rounded-xl border border-agro-blue-200 bg-agro-blue-50/60 p-4">
                        <p className="flex items-center gap-2 text-xs font-bold text-agro-blue-800 mb-2"><Server size={14} /> Incluye capacitación para migración y traspaso técnico de fuentes</p>
                        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                          {TRASPASO_TI.map(t => <li key={t}>{t}</li>)}
                        </ul>
                      </div>
                    )}
                  </Pregunta>
                  <Pregunta label="¿Cuántas personas usarían la plataforma?">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {USUARIOS.map(u => (
                        <div key={u.id}>
                          <p className="text-xs font-semibold text-gray-700">{u.label}</p>
                          <p className="text-[10px] text-gray-400 mb-1.5">{u.hint}</p>
                          <Contador val={r[u.id]} set={set(u.id)} />
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">Agricultores declarados por zona: {fmt(totalAgricultoresZonas(r))}</p>
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
