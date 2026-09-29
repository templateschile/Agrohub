import { useState } from "react"
import { Check, ClipboardCheck, ChevronDown, ChevronUp, Info, Lock, MessageCircle } from "lucide-react"
import ContactModal from "../components/ContactModal"

const CULTIVOS = [
  "Tomate industrial", "Hortalizas", "Frutales de carozo", "Frutales de pepita",
  "Cerezos", "Nogales y almendros", "Berries", "Vides / Viñas",
  "Cítricos y paltos", "Remolacha", "Cereales y granos", "Semilleros",
  "Praderas y forrajes", "Flores / Viveros",
]

const MODELOS_PRODUCTIVOS = [
  { id: "propio",   label: "Solo campos propios",          desc: "Producimos toda la superficie con equipo propio" },
  { id: "asociado", label: "Productores asociados",        desc: "Entregamos insumos o apoyo y compramos su producción" },
  { id: "mixto",    label: "Mixto: propios + asociados",   desc: "Parte propia y parte con productores bajo contrato" },
]

const APOYOS_PRODUCTORES = [
  "Semillas / plantines", "Fertilizantes y fitosanitarios", "Equipos de riego",
  "Financiamiento / anticipos", "Maquinaria y cosecha", "Asistencia técnica",
]

const TIPOS_RIEGO = ["Goteo", "Surco / tendido", "Aspersión / pivote", "Microaspersión", "Secano"]

const PRIORIDADES = [
  "Rendimiento (t/ha)", "Calidad (Brix, calibre, pH)", "Ahorro de agua",
  "Reducir costos", "Trazabilidad campo a planta", "Coordinación de cosecha",
  "Sanidad y alertas tempranas", "Adopción tecnológica de productores",
]

const REGISTROS = ["WhatsApp", "Planillas Excel", "Cuaderno de campo", "Software / ERP agrícola", "No llevamos registros"]

const MAX_PRIORIDADES = 3

const MODULOS = [
  { id: "dashboard", label: "Dashboard y Sensores" },
  { id: "eventos",   label: "Eventos y Capacitaciones" },
  { id: "tienda",    label: "Tienda / Ecommerce" },
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

const SENSOR_DESTACADO = "HSTI (Francia)"

const SENSORES = [
  SENSOR_DESTACADO, "WiseConn / DropControl","CropX","METER Group / ZENTRA Cloud","Sencrop",
  "Pessl Instruments / METOS","Davis Instruments / WeatherLink","Sensoterr",
  "Sentek / IrriMAX Live","Arable","xFarm Technologies","SupPlant","Doktar",
  "EOS Data Analytics","GeoPard Agriculture","Teralytic","AgriWebb",
  "John Deere Operations Center","Trimble Agriculture","Ranch Systems","Hortau",
]

const SOPORTE_OPCIONES = [1,2,3,4,5]

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
      <button onClick={() => set(v => Math.max(min, v - 1))} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">-</button>
      <input
        type="number"
        value={val}
        onChange={e => set(Math.max(min, parseInt(e.target.value) || 0))}
        className="w-20 text-center border border-gray-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-400"
      />
      <button onClick={() => set(v => v + 1)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 transition-colors">+</button>
    </div>
  )
}

function Chip({ activo, onClick, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${activo ? "bg-agro-green-50 border-agro-green-400 text-agro-green-800" : disabled ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-300"}`}
    >
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
        {activo && <Check size={9} className="text-white" />}
      </div>
      {children}
    </button>
  )
}

const toggleEn = set => item => set(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item])

export default function Evaluacion() {
  const [cultivos, setCultivos] = useState([])
  const [otroCultivo, setOtroCultivo] = useState("")
  const [hectareas, setHectareas] = useState(100)
  const [zonas, setZonas] = useState(1)
  const [modelo, setModelo] = useState("propio")
  const [haPropias, setHaPropias] = useState(50)
  const [productores, setProductores] = useState(10)
  const [apoyos, setApoyos] = useState([])
  const [riegos, setRiegos] = useState([])
  const [prioridades, setPrioridades] = useState([])
  const [registros, setRegistros] = useState([])

  const [modulos, setModulos] = useState(["dashboard", "eventos", "tienda"])
  const [aiActivo,   setAiActivo]   = useState(true)
  const [modoAi,     setModoAi]     = useState("Hibrida")
  const [docsActivo, setDocsActivo] = useState(true)
  const [modoDocs,   setModoDocs]   = useState("Hibrida")
  const [licencia,   setLicencia]   = useState("self")
  const [fuentesApi, setFuentesApi] = useState(5)
  const [fuentesSinApi, setFuentesSinApi] = useState(1)
  const [sensores, setSensores] = useState([SENSOR_DESTACADO])
  const [vistasKpi, setVistasKpi] = useState(7)
  const [soporte, setSoporte] = useState(1)
  const [admins, setAdmins] = useState(1)
  const [agricultores, setAgricultores] = useState(20)
  const [asesores, setAsesores] = useState(5)
  const [showModal, setShowModal] = useState(false)
  const [sensoresExpanded, setSensoresExpanded] = useState(false)

    const toggleModulo = id => setModulos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleSensor  = s  => setSensores(prev => prev.includes(s)  ? prev.filter(x => x !== s)  : [...prev, s])
  const togglePrioridad = p => setPrioridades(prev =>
    prev.includes(p) ? prev.filter(x => x !== p) : prev.length < MAX_PRIORIDADES ? [...prev, p] : prev)

  const conAsociados = modelo !== "propio"
  const haAsociadas = modelo === "asociado" ? hectareas : Math.max(0, hectareas - haPropias)
  const listaCultivos = [...cultivos, ...(otroCultivo.trim() ? [otroCultivo.trim()] : [])]
  const modeloLabel = MODELOS_PRODUCTIVOS.find(m => m.id === modelo)?.label

  const lineasOperacion = () => {
    const l = []
    l.push(`Cultivos: ${listaCultivos.length ? listaCultivos.join(", ") : "sin especificar"}`)
    l.push(`Superficie: ${hectareas} ha en ${zonas} zona${zonas !== 1 ? "s" : ""}/predio${zonas !== 1 ? "s" : ""}`)
    l.push(`Modelo: ${modeloLabel}`)
    if (modelo === "mixto") l.push(`Hectáreas: ${haPropias} ha propias + ${haAsociadas} ha de productores`)
    if (conAsociados) {
      l.push(`Productores asociados: ${productores}`)
      if (apoyos.length) l.push(`Apoyo a productores: ${apoyos.join(", ")}`)
    }
    if (riegos.length) l.push(`Riego: ${riegos.join(", ")}`)
    if (prioridades.length) l.push(`Prioridades: ${prioridades.join(", ")}`)
    if (registros.length) l.push(`Registros actuales: ${registros.join(", ")}`)
    return l
  }

    return (
    <div>
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <ClipboardCheck size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Evaluación AgroHub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Evalúa tu operación, <span className="text-agro-green-300">diseñamos tu AgroHub</span>
          </h1>
          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            Cuéntanos qué cultivas, cómo produces y qué quieres mejorar.
            Con eso preparamos un diagnóstico y una propuesta modular a tu medida.
          </p>
        </div>
      </section>

            <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ---- FORMULARIO EVALUACION ---- */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                <p className="text-xs font-bold uppercase tracking-wider text-agro-green-700">Tu operación</p>

                {/* 1. Cultivos */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-bold text-gray-900 text-base">1. Elige tu tipo de cultivo</h2>
                    <Tooltip text="Puedes marcar más de uno. Si no aparece, escríbelo en 'Otro cultivo'." />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CULTIVOS.map(c => (
                      <Chip key={c} activo={cultivos.includes(c)} onClick={() => toggleEn(setCultivos)(c)}>{c}</Chip>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={otroCultivo}
                    onChange={e => setOtroCultivo(e.target.value)}
                    placeholder="Otro cultivo (ej: quínoa, lúpulo, olivos)"
                    className="mt-3 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"
                  />
                </div>

                {/* 2. Superficie y modelo productivo */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">2. Superficie y modelo productivo</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-2 block">Hectáreas totales</label>
                      <Contador val={hectareas} set={setHectareas} />
                    </div>
                    <div>
                      <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                        Zonas o predios
                        <Tooltip text="Zonas productivas o predios separados geográficamente (ej: Quinta de Tilcoco, Rengo, Talca)." />
                      </label>
                      <Contador val={zonas} set={setZonas} min={1} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {MODELOS_PRODUCTIVOS.map(m => (
                      <button key={m.id} onClick={() => setModelo(m.id)}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${modelo === m.id ? "bg-agro-green-50 border-agro-green-400" : "bg-gray-50 border-gray-100 hover:border-gray-300"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${modelo === m.id ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                          {modelo === m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900">{m.label}</span>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{m.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {conAsociados && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        {modelo === "mixto" && (
                          <div>
                            <label className="text-xs font-semibold text-gray-700 mb-2 block">Hectáreas propias</label>
                            <Contador val={haPropias} set={setHaPropias} />
                            <p className="text-[10px] text-gray-400 mt-1">{haAsociadas} ha con productores asociados</p>
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-semibold text-gray-700 mb-2 block">N° de productores asociados</label>
                          <Contador val={productores} set={setProductores} />
                        </div>
                      </div>
                      <label className="text-xs font-semibold text-gray-700 mb-2 block">¿Qué les entregas a tus productores?</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {APOYOS_PRODUCTORES.map(a => (
                          <Chip key={a} activo={apoyos.includes(a)} onClick={() => toggleEn(setApoyos)(a)}>{a}</Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Riego */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">3. ¿Cómo riegas?</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIPOS_RIEGO.map(r => (
                      <Chip key={r} activo={riegos.includes(r)} onClick={() => toggleEn(setRiegos)(r)}>{r}</Chip>
                    ))}
                  </div>
                </div>

                {/* 4. Prioridades */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-gray-900 text-base">4. ¿Qué quieres mejorar esta temporada?</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">Elige hasta {MAX_PRIORIDADES}. {prioridades.length}/{MAX_PRIORIDADES} seleccionadas.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRIORIDADES.map(p => (
                      <Chip key={p} activo={prioridades.includes(p)} onClick={() => togglePrioridad(p)}
                        disabled={!prioridades.includes(p) && prioridades.length >= MAX_PRIORIDADES}>{p}</Chip>
                    ))}
                  </div>
                </div>

                {/* 5. Registros */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">5. ¿Cómo registran hoy las labores y datos de campo?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {REGISTROS.map(r => (
                      <Chip key={r} activo={registros.includes(r)} onClick={() => toggleEn(setRegistros)(r)}>{r}</Chip>
                    ))}
                  </div>
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-agro-green-700 mt-4">Tu plataforma</p>

                                {/* 6. Modulos */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-bold text-gray-900 text-base">6. Módulos</h2>
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
                    <h2 className="font-bold text-gray-900 text-base">7. Código y licencia</h2>
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

                {/* 3. Fuentes externas */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">8. Fuentes externas de información</h2>
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
                      <p className="text-xs text-gray-400 mt-1">Según integración</p>
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
                      <p className="text-xs text-gray-400 mt-1">Según desarrollo</p>
                    </div>
                  </div>
                </div>

                                {/* 4. Sensores */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900 text-base">9. Gestión de sensores a través de:</h2>
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
                        <span className="flex-1">{s}</span>
                        {s === SENSOR_DESTACADO && (
                          <span className="text-[10px] bg-agro-green-600 text-white px-2 py-0.5 rounded-full font-semibold">Recomendado</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                                {/* 5. Vistas KPI */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-gray-900 text-base">10. Vistas KPI por sensor</h2>
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

                {/* 6. Soporte */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">11. Años de soporte incluido</h2>
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
                  <h2 className="font-bold text-gray-900 text-base mb-4">12. Usuarios estimados</h2>
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
                  <h2 className="font-bold text-gray-900 text-base mb-4">Tu evaluación</h2>

                                    <div className="flex flex-col gap-1.5 text-sm mb-5">
                                      <div className="flex justify-between gap-3">
                                        <span className="text-gray-500 text-xs">Cultivos</span>
                                        <span className="font-medium text-agro-green-700 text-xs text-right">{listaCultivos.length ? listaCultivos.join(", ") : "Sin elegir"}</span>
                                      </div>
                                      <div className="flex justify-between gap-3">
                                        <span className="text-gray-500 text-xs">Superficie</span>
                                        <span className="font-medium text-gray-700 text-xs">{hectareas} ha · {zonas} zona{zonas !== 1 ? "s" : ""}</span>
                                      </div>
                                      <div className="flex justify-between gap-3">
                                        <span className="text-gray-500 text-xs">Modelo</span>
                                        <span className="font-medium text-gray-700 text-xs text-right">{modeloLabel}</span>
                                      </div>
                                      {conAsociados && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">Productores</span>
                                          <span className="font-medium text-gray-700 text-xs">{productores}</span>
                                        </div>
                                      )}
                                      {prioridades.length > 0 && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">Prioridades</span>
                                          <span className="font-medium text-gray-700 text-xs text-right">{prioridades.join(", ")}</span>
                                        </div>
                                      )}
                                      <div className="border-t border-gray-100 my-1.5" />
                                      {modulos.map(id => {
                                        const m = MODULOS.find(x => x.id === id)
                                        return m ? (
                                          <div key={id} className="flex justify-between gap-3">
                                            <span className="text-gray-500 text-xs">{m.label}</span>
                                            <span className="font-medium text-gray-700 text-xs">Seleccionado</span>
                                          </div>
                                        ) : null
                                      })}
                                      {aiActivo && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">AI Chat</span>
                                          <span className="font-medium text-gray-700 text-xs">{modoAi}</span>
                                        </div>
                                      )}
                                      {docsActivo && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">Docs</span>
                                          <span className="font-medium text-gray-700 text-xs">{modoDocs}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between gap-3">
                                        <span className="text-gray-500 text-xs">Licencia</span>
                                        <span className="font-medium text-agro-green-700 text-xs">{LICENCIAS.find(l=>l.id===licencia)?.label}</span>
                                      </div>
                                      {fuentesApi > 0 && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">APIs</span>
                                          <span className="font-medium text-gray-700 text-xs">{fuentesApi} fuente{fuentesApi>1?"s":""}</span>
                                        </div>
                                      )}
                                      {fuentesSinApi > 0 && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">Custom</span>
                                          <span className="font-medium text-gray-700 text-xs">{fuentesSinApi} fuente{fuentesSinApi>1?"s":""}</span>
                                        </div>
                                      )}
                                      {sensores.length > 0 && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">Gestores</span>
                                          <span className="font-medium text-gray-700 text-xs">{sensores.length} seleccionado{sensores.length>1?"s":""}</span>
                                        </div>
                                      )}
                                      {vistasKpi > 0 && (
                                        <div className="flex justify-between gap-3">
                                          <span className="text-gray-500 text-xs">KPI</span>
                                          <span className="font-medium text-gray-700 text-xs">{vistasKpi} vistas</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between gap-3">
                                        <span className="text-gray-500 text-xs">Soporte</span>
                                        <span className="font-medium text-gray-700 text-xs">{soporte} año{soporte>1?"s":""}</span>
                                      </div>
                                      <div className="flex justify-between gap-3">
                                        <span className="text-gray-500 text-xs">Usuarios</span>
                                        <span className="font-medium text-gray-700 text-xs">{admins+agricultores+asesores}</span>
                                      </div>
                                    </div>

                  <div className="border-t border-gray-100 pt-4 mb-5 text-center">
                    <p className="text-xs text-gray-400 mb-1">Propuesta estimada disponible</p>
                    <div className="flex items-center justify-center gap-2 text-agro-green-700 font-bold text-lg">
                      <Lock size={16}/> Solo en propuesta formal
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Te lo enviamos al mail + WhatsApp</p>
                  </div>

                  <button onClick={() => setShowModal(true)} className="block w-full text-center bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mb-3">
                    Solicitar evaluación
                  </button>
                  <a href="https://wa.me/56987561075" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm border border-gray-200">
                    <MessageCircle size={14}/> Hablamos por WhatsApp
                  </a>
                  <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                    La propuesta final se confirma tras diagnóstico técnico.
                  </p>
                </div>
              </div>
                      </div>
        </div>
      </section>

            {showModal && (
        <ContactModal
          onClose={() => setShowModal(false)}
          titulo="Solicitar evaluación"
          subtitulo="Revisamos tus respuestas y te contactamos para coordinar el diagnóstico."
          origen={(() => {
            const lineas = lineasOperacion().map(x => `🌱 ${x}`)
            modulos.forEach(id => {
              const m = MODULOS.find(x => x.id === id)
              if (m) lineas.push(`✅ ${m.label}`)
            })
            if (aiActivo)   lineas.push(`✅ AI Chat agricola (${modoAi})`)
            if (docsActivo) lineas.push(`✅ Docs Improvements (${modoDocs})`)
            const lic = LICENCIAS.find(l => l.id === licencia)
            lineas.push(`📄 Licencia: ${lic?.label}`)
            if (fuentesApi > 0)    lineas.push(`🔗 Fuentes API REST: ${fuentesApi}`)
            if (fuentesSinApi > 0) lineas.push(`🔧 Fuentes sin API custom: ${fuentesSinApi}`)
            if (sensores.length > 0) lineas.push(`📡 Gestores sensores: ${sensores.join(', ')}`)
            if (vistasKpi > 0) lineas.push(`📊 Vistas KPI: ${vistasKpi}`)
            lineas.push(`🛠 Soporte: ${soporte} año${soporte>1?'s':''}`)
            const u = admins + agricultores + asesores
            lineas.push(`👥 Usuarios: ${u} (${admins} admins, ${agricultores} agricultores, ${asesores} asesores)`)
            return lineas.join(' | ')
          })()}
          whatsappMsg={(() => {
            const lineas = []
            modulos.forEach(id => {
              const m = MODULOS.find(x => x.id === id)
              if (m) lineas.push(`- ${m.label}`)
            })
            if (aiActivo)   lineas.push(`- AI Chat agricola (${modoAi})`)
            if (docsActivo) lineas.push(`- Docs Improvements (${modoDocs})`)
            const lic = LICENCIAS.find(l => l.id === licencia)
            if (fuentesApi > 0)    lineas.push(`- ${fuentesApi} fuente${fuentesApi>1?'s':''} con API REST`)
            if (fuentesSinApi > 0) lineas.push(`- ${fuentesSinApi} fuente${fuentesSinApi>1?'s':''} sin API (custom)`)
            if (sensores.length > 0) lineas.push(`- Gestores: ${sensores.join(', ')}`)
            if (vistasKpi > 0) lineas.push(`- ${vistasKpi} vistas KPI`)
            const u = admins + agricultores + asesores
            return `Hola AgroHub! Soy [NOMBRE] ([TEL]).\n\nQuiero una evaluacion para un AgroHub.\n\nMI OPERACION:\n${lineasOperacion().map(x => `- ${x}`).join('\n')}\n\nMODULOS Y FUNCIONES:\n${lineas.join('\n')}\n\nLICENCIA: ${lic?.label}\nSOPORTE: ${soporte} año${soporte>1?'s':''}\nUSUARIOS: ${u} (${admins} admins, ${agricultores} agricultores, ${asesores} asesores)\n\nMi email: [EMAIL]\n\nQuedo atento a la propuesta.`
          })()}
        />
      )}
    </div>
  )
}



