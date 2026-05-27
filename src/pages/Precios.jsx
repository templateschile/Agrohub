import { useState, useMemo } from "react"
import { Check, DollarSign, ChevronDown, ChevronUp, Info, Lock, MessageCircle } from "lucide-react"
import ContactModal from "../components/ContactModal"

const PRECIO_API      = 900000
const PRECIO_NO_API   = 1200000
const PRECIO_SENSOR   = 200000
const PRECIO_VISTA    = 100000
const PRECIO_SOPORTE  = 5000000

const MODULOS = [
  { id: "dashboard", label: "Dashboard y Sensores",   precio: 2000000 },
  { id: "eventos",   label: "Eventos y Capacitaciones",precio: 2000000 },
  { id: "tienda",    label: "Tienda / Ecommerce",       precio: 5000000 },
]

const MODOS_AI   = ["SLM (local)", "Cloud (API)", "Hibrida"]
const MODOS_DOCS = ["SLM (local)", "Cloud (API)", "Hibrida"]

const LICENCIAS = [
  {
    id: "self",
    label: "Self Hosted",
    desc: "Licencia compartida + soporte + source admin + source app",
    badge: "Codigo abierto compartido",
  },
  {
    id: "full",
    label: "Full Hosted",
    desc: "Codigo full, licencia propia, 1 solo pago, documentacion completa",
    badge: "Licencia exclusiva",
  },
  {
    id: "saas",
    label: "Mes a mes (SaaS)",
    desc: "Usuario a app AgroHub compartida, sin app propia, sin codigos fuente",
    badge: "Sin inversion inicial",
  },
]

const SENSORES = [
  "WiseConn / DropControl","CropX","METER Group / ZENTRA Cloud","Sencrop",
  "Pessl Instruments / METOS","Davis Instruments / WeatherLink","Sensoterr",
  "Sentek / IrriMAX Live","Arable","xFarm Technologies","SupPlant","Doktar",
  "EOS Data Analytics","GeoPard Agriculture","Teralytic","AgriWebb",
  "John Deere Operations Center","Trimble Agriculture","Ranch Systems","Hortau",
]

const SOPORTE_OPCIONES = [1,2,3,4,5]

function CLP(n) {
  return "$" + n.toLocaleString("es-CL")
}

function calcularPrecio(modulos, aiActivo, docsActivo, fuentesApi, fuentesSinApi, sensores, vistasKpi, soporte, admins, agricultores, asesores) {
  let total = 0
  modulos.forEach(id => {
    const m = MODULOS.find(x => x.id === id)
    if (m) total += m.precio
  })
  if (aiActivo)   total += 2000000
  if (docsActivo) total += 2000000
  total += fuentesApi    * PRECIO_API
  total += fuentesSinApi * PRECIO_NO_API
  total += sensores.length * PRECIO_SENSOR
  total += vistasKpi     * PRECIO_VISTA
  if (soporte > 1) total += (soporte - 1) * PRECIO_SOPORTE
  const u = admins + agricultores + asesores
  if (u > 50)  total += 800000
  if (u > 100) total += 800000
  if (u > 200) total += 1500000
  return Math.round(total)
}

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

export default function Precios() {
  const [modulos, setModulos] = useState(["dashboard", "eventos", "tienda"])
  const [aiActivo,   setAiActivo]   = useState(true)
  const [modoAi,     setModoAi]     = useState("Hibrida")
  const [docsActivo, setDocsActivo] = useState(true)
  const [modoDocs,   setModoDocs]   = useState("Hibrida")
  const [licencia,   setLicencia]   = useState("self")
  const [fuentesApi, setFuentesApi] = useState(5)
  const [fuentesSinApi, setFuentesSinApi] = useState(1)
  const [sensores, setSensores] = useState(["WiseConn / DropControl"])
  const [vistasKpi, setVistasKpi] = useState(7)
  const [soporte, setSoporte] = useState(1)
  const [admins, setAdmins] = useState(1)
  const [agricultores, setAgricultores] = useState(20)
  const [asesores, setAsesores] = useState(5)
  const [showModal, setShowModal] = useState(false)
  const [sensoresExpanded, setSensoresExpanded] = useState(false)

    const precio = useMemo(
    () => calcularPrecio(modulos, aiActivo, docsActivo, fuentesApi, fuentesSinApi, sensores, vistasKpi, soporte, admins, agricultores, asesores),
    [modulos, aiActivo, docsActivo, fuentesApi, fuentesSinApi, sensores, vistasKpi, soporte, admins, agricultores, asesores]
  )

    const toggleModulo = id => setModulos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleSensor  = s  => setSensores(prev => prev.includes(s)  ? prev.filter(x => x !== s)  : [...prev, s])

  const descModulo = null

    return (
    <div>
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <DollarSign size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Precios y Cotizador</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Tu AgroHub, <span className="text-agro-green-300">a tu medida</span>
          </h1>
          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            Selecciona los módulos, sensores y usuarios que necesitas.
            El precio se calcula en tiempo real.
          </p>
        </div>
      </section>

            <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ---- FORMULARIO COTIZADOR ---- */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                                {/* 1. Modulos */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-bold text-gray-900 text-base">1. Modulos</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MODULOS.map(m => (
                      <button key={m.id} onClick={() => toggleModulo(m.id)}
                        className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition-all ${modulos.includes(m.id) ? "bg-agro-green-50 border-agro-green-400 text-agro-green-800" : "bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300"}`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${modulos.includes(m.id) ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                          {modulos.includes(m.id) && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium">{m.label}</span>
                      </button>
                    ))}

                    {/* AI Chat */}
                    <div className={`rounded-xl border px-4 py-3 transition-all ${aiActivo ? "bg-agro-green-50 border-agro-green-400" : "bg-gray-50 border-gray-100"}`}>
                      <button onClick={() => setAiActivo(v => !v)} className="flex items-center gap-2.5 w-full text-left mb-2">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${aiActivo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                          {aiActivo && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">AI Chat agricola</span>
                      </button>
                      {aiActivo && (
                        <div className="flex gap-1.5 flex-wrap pl-7">
                          {MODOS_AI.map(m => (
                            <button key={m} onClick={() => setModoAi(m)}
                              className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-all ${modoAi === m ? "bg-agro-green-600 text-white border-agro-green-600" : "bg-white text-gray-500 border-gray-200 hover:border-agro-green-400"}`}>
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Docs */}
                    <div className={`rounded-xl border px-4 py-3 transition-all ${docsActivo ? "bg-agro-green-50 border-agro-green-400" : "bg-gray-50 border-gray-100"}`}>
                      <button onClick={() => setDocsActivo(v => !v)} className="flex items-center gap-2.5 w-full text-left mb-2">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${docsActivo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                          {docsActivo && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">Docs Improvements</span>
                      </button>
                      {docsActivo && (
                        <div className="flex gap-1.5 flex-wrap pl-7">
                          {MODOS_DOCS.map(m => (
                            <button key={m} onClick={() => setModoDocs(m)}
                              className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-all ${modoDocs === m ? "bg-agro-green-600 text-white border-agro-green-600" : "bg-white text-gray-500 border-gray-200 hover:border-agro-green-400"}`}>
                              {m}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 1b. Tipo de licencia */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-bold text-gray-900 text-base">2. Codigo y Licencia</h2>
                    <Tooltip text="Define como contratas y que propiedad obtienes sobre el codigo." />
                  </div>
                  <div className="flex flex-col gap-3">
                    {LICENCIAS.map(l => (
                      <button key={l.id} onClick={() => setLicencia(l.id)}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${licencia === l.id ? "bg-agro-green-50 border-agro-green-400" : "bg-gray-50 border-gray-100 hover:border-gray-300"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${licencia === l.id ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                          {licencia === l.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{l.label}</span>
                            <span className="text-[10px] bg-agro-earth-50 text-agro-earth-700 px-2 py-0.5 rounded-full font-medium">{l.badge}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{l.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Fuentes externas */}}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">3. Fuentes externas de informacion</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Fuentes con API REST
                        <Tooltip text="Fuentes que ya tienen API disponible (ej: INIA, datos públicos, meteo). Integración estándar." />
                      </label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setFuentesApi(v => Math.max(0,v-1))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">-</button>
                        <span className="w-8 text-center font-bold text-gray-900">{fuentesApi}</span>
                        <button onClick={() => setFuentesApi(v => v+1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">+</button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Precio según integración</p>
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        Fuentes sin API (extracción custom)
                        <Tooltip text="Fuentes que requieren fabricar el conector desde cero (scraping, PDF, etc). Mayor costo de desarrollo." />
                      </label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setFuentesSinApi(v => Math.max(0,v-1))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">-</button>
                        <span className="w-8 text-center font-bold text-gray-900">{fuentesSinApi}</span>
                        <button onClick={() => setFuentesSinApi(v => v+1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">+</button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Precio según desarrollo</p>
                    </div>
                  </div>
                </div>

                                {/* 4. Sensores */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900 text-base">4. Gestion de sensores a traves de:</h2>
                      <Tooltip text="Selecciona los gestores de sensores que ya usas o planeas integrar. El hub se conecta con cada plataforma." />
                    </div>
                    <button onClick={() => setSensoresExpanded(v => !v)} className="flex items-center gap-1 text-xs text-agro-green-600 font-semibold">
                      {sensoresExpanded ? "Colapsar" : "Ver todos"} {sensoresExpanded ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                    </button>
                  </div>
                                    {sensores.length > 0 && (
                    <p className="text-xs text-agro-green-600 font-semibold mb-3">{sensores.length} sensor{sensores.length !== 1 ? "es" : ""} seleccionado{sensores.length !== 1 ? "s" : ""}</p>
                  )}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 ${!sensoresExpanded ? "max-h-48 overflow-hidden" : ""}`}>
                    {SENSORES.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSensor(s)}
                        className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-all ${sensores.includes(s) ? "bg-agro-blue-50 border-agro-blue-300 text-agro-blue-800" : "bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300"}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${sensores.includes(s) ? "bg-agro-blue-600 border-agro-blue-600" : "border-gray-300"}`}>
                          {sensores.includes(s) && <Check size={9} className="text-white"/>}
                        </div>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                                {/* 5. Vistas KPI */}}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-gray-900 text-base">5. Vistas KPI por sensor</h2>
                    <Tooltip text="Paneles KPI activos por sensor. Ej: humedad, temperatura, alerta de riego, etc." />
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Cada vista es un panel de datos en tiempo real en el dashboard.</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setVistasKpi(v => Math.max(1, v - 1))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">-</button>
                    <span className="w-8 text-center font-bold text-gray-900 text-lg">{vistasKpi}</span>
                    <button onClick={() => setVistasKpi(v => v + 1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">+</button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{vistasKpi} vistas activas</p>
                </div>

                {/* 6. Soporte */}}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">6. Anos de soporte incluido</h2>
                  <div className="flex gap-3 flex-wrap">
                    {SOPORTE_OPCIONES.map(n => (
                      <button
                        key={n}
                        onClick={() => setSoporte(n)}
                        className={`w-14 h-14 rounded-xl border-2 font-bold text-lg transition-all ${soporte === n ? "bg-agro-green-600 border-agro-green-600 text-white" : "bg-white border-gray-200 text-gray-700 hover:border-agro-green-400"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">1 año incluido sin costo extra. Años adicionales con costo.</p>
                </div>

                {/* 7. Usuarios */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">7. Usuarios estimados</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      { label: "Admins / Hub managers", val: admins,       set: setAdmins,       hint: "Gestionan la plataforma" },
                      { label: "Agricultores",           val: agricultores,  set: setAgricultores, hint: "Usan la app en terreno" },
                      { label: "Asesores agrícolas",     val: asesores,     set: setAsesores,     hint: "Técnicos y consultores" },
                    ].map(u => (
                      <div key={u.label}>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">{u.label}</label>
                        <p className="text-[10px] text-gray-400 mb-2">{u.hint}</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => u.set(v => Math.max(0,v-1))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">-</button>
                          <input
                            type="number"
                            value={u.val}
                            onChange={e => u.set(Math.max(0, parseInt(e.target.value)||0))}
                            className="w-16 text-center border border-gray-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-400"
                          />
                          <button onClick={() => u.set(v => v+1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-4">Total: <strong className="text-gray-700">{admins+agricultores+asesores} usuarios</strong>. Tarifa adicional a partir de 50, 100 y 200 usuarios.</p>
                </div>
              </div>

                            {/* ---- PANEL PRECIO (sticky) ---- */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 bg-white border border-gray-100 rounded-2xl p-6 shadow-lg">
                  <h2 className="font-bold text-gray-900 text-base mb-4">Tu configuracion</h2>

                                    <div className="flex flex-col gap-1.5 text-sm mb-5">
                                      {modulos.map(id => {
                                        const m = MODULOS.find(x => x.id === id)
                                        return m ? (
                                          <div key={id} className="flex justify-between">
                                            <span className="text-gray-500 text-xs">{m.label}</span>
                                            <span className="font-medium text-gray-700 text-xs">{CLP(m.precio)}</span>
                                          </div>
                                        ) : null
                                      })}
                                      {aiActivo && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-500 text-xs">AI Chat ({modoAi})</span>
                                          <span className="font-medium text-gray-700 text-xs">{CLP(2000000)}</span>
                                        </div>
                                      )}
                                      {docsActivo && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-500 text-xs">Docs ({modoDocs})</span>
                                          <span className="font-medium text-gray-700 text-xs">{CLP(2000000)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-500 text-xs">Licencia</span>
                                        <span className="font-medium text-agro-green-700 text-xs">{LICENCIAS.find(l=>l.id===licencia)?.label}</span>
                                      </div>
                                      {fuentesApi > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-500 text-xs">APIs ({fuentesApi})</span>
                                          <span className="font-medium text-gray-700 text-xs">{CLP(fuentesApi*PRECIO_API)}</span>
                                        </div>
                                      )}
                                      {fuentesSinApi > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-500 text-xs">Custom ({fuentesSinApi})</span>
                                          <span className="font-medium text-gray-700 text-xs">{CLP(fuentesSinApi*PRECIO_NO_API)}</span>
                                        </div>
                                      )}
                                      {sensores.length > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-500 text-xs">Gestores ({sensores.length})</span>
                                          <span className="font-medium text-gray-700 text-xs">{CLP(sensores.length*PRECIO_SENSOR)}</span>
                                        </div>
                                      )}
                                      {vistasKpi > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-500 text-xs">KPI ({vistasKpi} vistas)</span>
                                          <span className="font-medium text-gray-700 text-xs">{CLP(vistasKpi*PRECIO_VISTA)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="text-gray-500 text-xs">Soporte {soporte} ano{soporte>1?"s":""}</span>
                                        <span className="font-medium text-gray-700 text-xs">{soporte===1?"Incluido":CLP((soporte-1)*PRECIO_SOPORTE)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500 text-xs">Usuarios ({admins+agricultores+asesores})</span>
                                        <span className="font-medium text-gray-700 text-xs">{admins+agricultores+asesores>200?CLP(3100000):admins+agricultores+asesores>100?CLP(1600000):admins+agricultores+asesores>50?CLP(800000):"Incluidos"}</span>
                                      </div>
                                    </div>

                  <div className="border-t border-gray-100 pt-4 mb-5 text-center">
                    <p className="text-xs text-gray-400 mb-1">Precio estimado disponible</p>
                    <div className="flex items-center justify-center gap-2 text-agro-green-700 font-bold text-lg">
                      <Lock size={16}/> Solo en propuesta formal
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Te lo enviamos al mail + WhatsApp</p>
                  </div>

                  <button onClick={() => setShowModal(true)} className="block w-full text-center bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mb-3">
                    Solicitar propuesta con precio
                  </button>
                  <a href="https://wa.me/56987561075" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm border border-gray-200">
                    <MessageCircle size={14}/> Hablamos por WhatsApp
                  </a>
                  <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                    El precio final se confirma tras diagnostico tecnico.
                  </p>
                </div>
              </div>
                      </div>
        </div>
      </section>

      {showModal && (
        <ContactModal
          onClose={() => setShowModal(false)}
          titulo="Solicitar propuesta con precio"
          subtitulo="Te enviamos el detalle completo con precio al mail y WhatsApp."
          origen={(() => {
            const lineas = []
            // Modulos
            modulos.forEach(id => {
              const m = MODULOS.find(x => x.id === id)
              if (m) lineas.push(`✅ ${m.label}: ${CLP(m.precio)}`)
            })
            if (aiActivo)   lineas.push(`✅ AI Chat agricola (${modoAi}): ${CLP(2000000)}`)
            if (docsActivo) lineas.push(`✅ Docs Improvements (${modoDocs}): ${CLP(2000000)}`)
            // Licencia
            const lic = LICENCIAS.find(l => l.id === licencia)
            lineas.push(`📄 Licencia: ${lic?.label} — ${lic?.desc}`)
            // Fuentes
            if (fuentesApi > 0)    lineas.push(`🔗 Fuentes API REST (${fuentesApi}): ${CLP(fuentesApi * PRECIO_API)}`)
            if (fuentesSinApi > 0) lineas.push(`🔧 Fuentes sin API custom (${fuentesSinApi}): ${CLP(fuentesSinApi * PRECIO_NO_API)}`)
            // Sensores
            if (sensores.length > 0) lineas.push(`📡 Gestores de sensores (${sensores.length}): ${sensores.join(', ')} — ${CLP(sensores.length * PRECIO_SENSOR)}`)
            // KPI
            if (vistasKpi > 0) lineas.push(`📊 Vistas KPI (${vistasKpi}): ${CLP(vistasKpi * PRECIO_VISTA)}`)
            // Soporte
            lineas.push(`🛠 Soporte ${soporte} año${soporte>1?'s':''}: ${soporte === 1 ? 'Incluido' : CLP((soporte-1)*PRECIO_SOPORTE) + ' extra'}`)
            // Usuarios
            const u = admins + agricultores + asesores
            lineas.push(`👥 Usuarios: ${u} (${admins} admins, ${agricultores} agricultores, ${asesores} asesores)${u>200?' +$1.500.000':u>100?' +$800.000 x2':u>50?' +$800.000':''}`)
            lineas.push(`💰 TOTAL ESTIMADO: ${CLP(precio)}`)
            return lineas.join(' | ')
          })()}
        />
      )}
    </div>
  )
}



