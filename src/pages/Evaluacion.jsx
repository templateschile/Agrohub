import { useState } from "react"
import { Check, ClipboardCheck, ChevronDown, ChevronUp, Info, Lightbulb, ShieldCheck, Clock, Send, CheckCircle, ArrowRight } from "lucide-react"
import { enviarLead, emailValido } from "../lib/lead"
import {
  CULTIVOS, MODELOS_PRODUCTIVOS, APOYOS_PRODUCTORES, TIPOS_RIEGO, PRIORIDADES, REGISTROS,
  SENSORES, SENSOR_DESTACADO, MODULOS, LICENCIAS, ETAPAS, estadoInicial,
  conAsociados, haAsociadas, resumenRespuestas, avance, insights,
} from "../lib/evaluacion"

const MAX_PRIORIDADES = 3
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

function Contador({ val, set, min = 0 }) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => set(Math.max(min, val - 1))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">-</button>
      <input
        type="number"
        value={val}
        onChange={e => set(Math.max(min, parseInt(e.target.value) || 0))}
        className="w-24 text-center border border-gray-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-400"
      />
      <button type="button" onClick={() => set(val + 1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">+</button>
    </div>
  )
}

function Chip({ activo, onClick, children, disabled = false, extra = null }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${activo ? "bg-agro-green-50 border-agro-green-400 text-agro-green-800" : disabled ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300"}`}
    >
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
        {activo && <Check size={9} className="text-white" />}
      </div>
      <span className="flex-1">{children}</span>
      {extra}
    </button>
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
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </button>
  )
}

function Paso({ n, titulo, ayuda, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-agro-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
        <h2 className="font-bold text-gray-900 text-base">{titulo}</h2>
      </div>
      {ayuda ? <p className="text-xs text-gray-400 mb-4 pl-8">{ayuda}</p> : <div className="mb-4" />}
      {children}
    </div>
  )
}

export default function Evaluacion() {
  const [r, setR] = useState(estadoInicial)
  const [contacto, setContacto] = useState({ nombre: "", empresa: "", cargo: "", email: "", telefono: "", mensaje: "", website: "" })
  const [verSensores, setVerSensores] = useState(false)
  const [verAvanzado, setVerAvanzado] = useState(false)
  const [estado, setEstado] = useState("editando")

  const set = k => v => setR(prev => ({ ...prev, [k]: v }))
  const toggle = k => item => setR(prev => ({ ...prev, [k]: prev[k].includes(item) ? prev[k].filter(x => x !== item) : [...prev[k], item] }))
  const togglePrioridad = p => setR(prev => ({
    ...prev,
    prioridades: prev.prioridades.includes(p) ? prev.prioridades.filter(x => x !== p)
      : prev.prioridades.length < MAX_PRIORIDADES ? [...prev.prioridades, p] : prev.prioridades,
  }))
  const setC = k => e => setContacto(prev => ({ ...prev, [k]: e.target.value }))

  const pct = avance(r)
  const recomendaciones = insights(r)
  const contactoValido = contacto.nombre.trim() && emailValido(contacto.email)

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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">¡Recibimos tu evaluación, {contacto.nombre.split(" ")[0]}!</h1>
          <p className="text-gray-500 mb-10">Nuestro equipo la está revisando. Esto es lo que sigue:</p>
          <ol className="text-left flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {[
              ["Revisamos tus respuestas", "Un especialista analiza tu operación y tus prioridades."],
              ["Te contactamos en 24 horas hábiles", "Para conocerte mejor y coordinar la visita de diagnóstico."],
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
      <section className="pt-28 pb-10 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <ClipboardCheck size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Evaluación AgroHub · 3 minutos</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 max-w-3xl">
            Evalúa tu operación, <span className="text-agro-green-300">diseñamos tu AgroHub</span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl leading-relaxed mb-5">
            Responde unas preguntas y verás al instante cómo podemos ayudarte. Con esto preparamos tu diagnóstico previo.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/75 text-sm">
            <span className="flex items-center gap-1.5"><ClipboardCheck size={14} className="text-agro-green-300" /> Sin compromiso</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-agro-green-300" /> Datos confidenciales</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-agro-green-300" /> Respuesta en 24 h hábiles</span>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <form onSubmit={enviar} className="lg:col-span-2 flex flex-col gap-6">

              <Paso n={1} titulo="Elige tu tipo de cultivo" ayuda="Puedes marcar más de uno.">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CULTIVOS.map(c => <Chip key={c} activo={r.cultivos.includes(c)} onClick={() => toggle("cultivos")(c)}>{c}</Chip>)}
                </div>
                <input type="text" value={r.otroCultivo} onChange={e => set("otroCultivo")(e.target.value)}
                  placeholder="Otro cultivo (ej: quínoa, lúpulo, olivos)" className={`${inputCls} mt-3`} />
              </Paso>

              <Paso n={2} titulo="Superficie y modelo productivo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Hectáreas totales</label>
                    <Contador val={r.hectareas} set={set("hectareas")} />
                  </div>
                  <div>
                    <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                      Zonas o predios
                      <Tooltip text="Zonas productivas o predios separados geográficamente." />
                    </label>
                    <Contador val={r.zonas} set={set("zonas")} min={1} />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {MODELOS_PRODUCTIVOS.map(m => (
                    <Radio key={m.id} activo={r.modelo === m.id} onClick={() => set("modelo")(m.id)} titulo={m.label} desc={m.desc} />
                  ))}
                </div>
                {conAsociados(r) && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      {r.modelo === "mixto" && (
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-2 block">Hectáreas propias</label>
                          <Contador val={r.haPropias} set={set("haPropias")} />
                          <p className="text-[10px] text-gray-400 mt-1">{haAsociadas(r).toLocaleString("es-CL")} ha con productores asociados</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-2 block">N° de productores asociados</label>
                        <Contador val={r.productores} set={set("productores")} />
                      </div>
                    </div>
                    <label className="text-xs font-semibold text-gray-700 mb-2 block">¿Qué les entregas a tus productores?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {APOYOS_PRODUCTORES.map(a => <Chip key={a} activo={r.apoyos.includes(a)} onClick={() => toggle("apoyos")(a)}>{a}</Chip>)}
                    </div>
                  </div>
                )}
              </Paso>

              <Paso n={3} titulo="¿Cómo riegas?">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIPOS_RIEGO.map(x => <Chip key={x} activo={r.riegos.includes(x)} onClick={() => toggle("riegos")(x)}>{x}</Chip>)}
                </div>
              </Paso>

              <Paso n={4} titulo="¿Qué quieres mejorar esta temporada?" ayuda={`Elige hasta ${MAX_PRIORIDADES}. ${r.prioridades.length}/${MAX_PRIORIDADES} seleccionadas.`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRIORIDADES.map(p => (
                    <Chip key={p} activo={r.prioridades.includes(p)} onClick={() => togglePrioridad(p)}
                      disabled={!r.prioridades.includes(p) && r.prioridades.length >= MAX_PRIORIDADES}>{p}</Chip>
                  ))}
                </div>
              </Paso>

              <Paso n={5} titulo="¿Cómo registran hoy las labores y datos de campo?">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REGISTROS.map(x => <Chip key={x} activo={r.registros.includes(x)} onClick={() => toggle("registros")(x)}>{x}</Chip>)}
                </div>
              </Paso>

              <Paso n={6} titulo="Gestión de sensores" ayuda="Marca la tecnología que ya usas o que te interesa integrar.">
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${!verSensores ? "max-h-40 overflow-hidden" : ""}`}>
                  {SENSORES.map(s => (
                    <Chip key={s} activo={r.sensores.includes(s)} onClick={() => toggle("sensores")(s)}
                      extra={s === SENSOR_DESTACADO && <span className="text-[10px] bg-agro-green-600 text-white px-2 py-0.5 rounded-full font-semibold">Recomendado</span>}>
                      {s}
                    </Chip>
                  ))}
                </div>
                <button type="button" onClick={() => setVerSensores(v => !v)} className="flex items-center gap-1 text-xs text-agro-green-600 font-semibold mt-3">
                  {verSensores ? "Ver menos" : `Ver las ${SENSORES.length} opciones`} {verSensores ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </Paso>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
                <button type="button" onClick={() => setVerAvanzado(v => !v)} className="w-full flex items-center justify-between p-6 text-left">
                  <div>
                    <h2 className="font-bold text-gray-900 text-base">Configuración de la plataforma <span className="text-gray-400 font-normal text-sm">(opcional)</span></h2>
                    <p className="text-xs text-gray-400 mt-0.5">Módulos, licencia, usuarios y soporte. Si no sabes, lo definimos juntos.</p>
                  </div>
                  {verAvanzado ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                {verAvanzado && (
                  <div className="px-6 pb-6 flex flex-col gap-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-2 block">Módulos de interés</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {MODULOS.map(m => <Chip key={m.id} activo={r.modulos.includes(m.id)} onClick={() => toggle("modulos")(m.id)}>{m.label}</Chip>)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-2 block">Tipo de licencia</label>
                      <div className="flex flex-col gap-3">
                        {LICENCIAS.map(l => <Radio key={l.id} activo={r.licencia === l.id} onClick={() => set("licencia")(l.id)} titulo={l.label} desc={l.desc} badge={l.badge} />)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-2 block">Usuarios estimados</label>
                        <Contador val={r.usuarios} set={set("usuarios")} />
                        <p className="text-[10px] text-gray-400 mt-1">Administradores, técnicos y agricultores</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-2 block">Años de soporte</label>
                        <Contador val={r.soporte} set={set("soporte")} min={1} />
                        <p className="text-[10px] text-gray-400 mt-1">1 año incluido</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div id="datos" className="bg-white border-2 border-agro-green-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-agro-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0">7</span>
                  <h2 className="font-bold text-gray-900 text-base">¿A quién le enviamos tu diagnóstico?</h2>
                </div>
                <p className="text-xs text-gray-400 mb-4 pl-8">Un especialista revisa tus respuestas y te contacta en 24 horas hábiles.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={contacto.nombre} onChange={setC("nombre")} placeholder="Nombre *" className={inputCls} />
                  <input value={contacto.empresa} onChange={setC("empresa")} placeholder="Empresa" className={inputCls} />
                  <input value={contacto.cargo} onChange={setC("cargo")} placeholder="Cargo" className={inputCls} />
                  <input type="email" value={contacto.email} onChange={setC("email")} placeholder="Email *" className={inputCls} />
                  <input value={contacto.telefono} onChange={setC("telefono")} placeholder="Teléfono (opcional)" className={inputCls} />
                </div>
                <textarea value={contacto.mensaje} onChange={setC("mensaje")} rows={3} placeholder="¿Algo más que debamos saber? (opcional)"
                  className={`${inputCls} mt-3 resize-none`} />
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
                  <a href="#datos" className="mt-5 flex items-center justify-center gap-2 w-full bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                    Solicitar diagnóstico previo <ArrowRight size={14} />
                  </a>
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
