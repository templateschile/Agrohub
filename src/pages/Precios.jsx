import { useState, useMemo } from "react"
import { useInView } from "../hooks/useInView"
import { Check, DollarSign, ChevronDown, ChevronUp, Info } from "lucide-react"

const MODULOS = [
  { id: "dashboard", label: "Dashboard y Sensores",     precio: 1600000 },
  { id: "ai",        label: "AI Chat agricola",          precio: 1600000 },
  { id: "docs",      label: "Documentos",                precio: 1600000 },
  { id: "eventos",   label: "Eventos y Capacitaciones",  precio: 1600000 },
  { id: "tienda",    label: "Tienda B2B",                precio: 1600000 },
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

function calcularPrecio(modulos, fuentesApi, fuentesSinApi, sensores, soporte, licencia, admins, agricultores, asesores) {
  let base = 0

  const numModulos = modulos.length
  const descModulo = numModulos >= 4 ? 0.20 : numModulos === 3 ? 0.12 : numModulos === 2 ? 0.06 : 0
  modulos.forEach(id => {
    const m = MODULOS.find(x => x.id === id)
    if (m) base += m.precio * (1 - descModulo)
  })

  base += fuentesApi * 800000
  base += fuentesSinApi * 1200000
  base += sensores.length * 700000

  const costoPorAnio = base * 0.18
  base += costoPorAnio * soporte

  if (licencia) base += 10000000

  const totalUsuarios = admins + agricultores + asesores
  if (totalUsuarios > 50)  base += 800000
  if (totalUsuarios > 100) base += 800000
  if (totalUsuarios > 200) base += 1500000

  return Math.round(base)
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
  const [modulos, setModulos] = useState(["dashboard", "ai", "docs", "eventos", "tienda"])
  const [fuentesApi, setFuentesApi] = useState(5)
  const [fuentesSinApi, setFuentesSinApi] = useState(1)
  const [sensores, setSensores] = useState(["WiseConn / DropControl"])
  const [soporte, setSoporte] = useState(1)
  const [licencia, setLicencia] = useState(true)
  const [admins, setAdmins] = useState(1)
  const [agricultores, setAgricultores] = useState(20)
  const [asesores, setAsesores] = useState(5)
  const [sensoresExpanded, setSensoresExpanded] = useState(false)

  const precio = useMemo(
    () => calcularPrecio(modulos, fuentesApi, fuentesSinApi, sensores, soporte, licencia, admins, agricultores, asesores),
    [modulos, fuentesApi, fuentesSinApi, sensores, soporte, licencia, admins, agricultores, asesores]
  )

  const toggleModulo = id => setModulos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const toggleSensor = s  => setSensores(prev => prev.includes(s)  ? prev.filter(x => x !== s)  : [...prev, s])

  const descModulo = modulos.length >= 4 ? "20%" : modulos.length === 3 ? "12%" : modulos.length === 2 ? "6%" : null

  const [titleRef, titleVisible] = useInView({ threshold: 0.1 })

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
          <div
            ref={titleRef}
            className={`transition-all duration-700 ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ---- FORMULARIO COTIZADOR ---- */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* 1. Modulos */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-gray-900 text-base">1. Módulos</h2>
                    <Tooltip text="Más módulos activos = mayor descuento por módulo. Con 4 o más módulos: 20% off." />
                  </div>
                  {descModulo && (
                    <p className="text-xs text-agro-green-600 font-semibold mb-3">Descuento por volumen: {descModulo}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {MODULOS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => toggleModulo(m.id)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${modulos.includes(m.id) ? "bg-agro-green-50 border-agro-green-400 text-agro-green-800" : "bg-gray-50 border-gray-100 text-gray-700 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${modulos.includes(m.id) ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                            {modulos.includes(m.id) && <Check size={11} className="text-white" />}
                          </div>
                          <span className="text-sm font-medium">{m.label}</span>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{CLP(m.precio)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fuentes externas */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">2. Fuentes externas de información</h2>
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
                      <p className="text-xs text-gray-400 mt-1">{CLP(800000)} por fuente</p>
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
                      <p className="text-xs text-gray-400 mt-1">{CLP(1200000)} por fuente</p>
                    </div>
                  </div>
                </div>

                {/* 3. Sensores */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-900 text-base">3. Sensores compatibles</h2>
                      <Tooltip text="Selecciona los sensores que ya tienes o planeas adquirir. El hub se integra con cada uno." />
                    </div>
                    <button onClick={() => setSensoresExpanded(v => !v)} className="flex items-center gap-1 text-xs text-agro-green-600 font-semibold">
                      {sensoresExpanded ? "Colapsar" : "Ver todos"} {sensoresExpanded ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
                    </button>
                  </div>
                  {sensores.length > 0 && (
                    <p className="text-xs text-agro-green-600 font-semibold mb-3">{sensores.length} sensor{sensores.length !== 1 ? "es" : ""} seleccionado{sensores.length !== 1 ? "s" : ""} &middot; {CLP(sensores.length * 700000)}</p>
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

                {/* 4. Soporte */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">4. Años de soporte incluido</h2>
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
                  <p className="text-xs text-gray-400 mt-3">Mínimo 1 año. Soporte activo, mejoras iterativas y seguimiento mensual.</p>
                </div>

                {/* 5. Licencia */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <button
                    onClick={() => setLicencia(v => !v)}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-4 text-left transition-all ${licencia ? "bg-agro-green-50 border-agro-green-400" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${licencia ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                          {licencia && <Check size={11} className="text-white"/>}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">5. Licencia compartida del código</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 ml-7">Incluye acceso al código fuente del front-end, panel de administración y documentación técnica.</p>
                    </div>
                    <span className="text-sm font-bold text-gray-700 ml-4 shrink-0">{CLP(10000000)}</span>
                  </button>
                </div>

                {/* 6. Usuarios */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 text-base mb-4">6. Usuarios estimados</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      { label: "Admins / Hub managers", val: admins,      set: setAdmins,      hint: "Gestionan la plataforma" },
                      { label: "Agricultores",           val: agricultores, set: setAgricultores, hint: "Usan la app en terreno" },
                      { label: "Asesores agrícolas",     val: asesores,    set: setAsesores,    hint: "Técnicos y consultores" },
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
                  <h2 className="font-bold text-gray-900 text-base mb-4">Resumen del cotizador</h2>

                  <div className="flex flex-col gap-2 text-sm mb-5">
                    {modulos.length > 0 && (
                      <div className="flex justify-between"><span className="text-gray-500">Modulos ({modulos.length})</span><span className="font-medium text-gray-800">{descModulo ? `con ${descModulo} off` : ""}</span></div>
                    )}
                    {fuentesApi > 0 && <div className="flex justify-between"><span className="text-gray-500">Fuentes API ({fuentesApi})</span><span className="font-medium text-gray-800">{CLP(fuentesApi*800000)}</span></div>}
                    {fuentesSinApi > 0 && <div className="flex justify-between"><span className="text-gray-500">Fuentes custom ({fuentesSinApi})</span><span className="font-medium text-gray-800">{CLP(fuentesSinApi*1200000)}</span></div>}
                    {sensores.length > 0 && <div className="flex justify-between"><span className="text-gray-500">Sensores ({sensores.length})</span><span className="font-medium text-gray-800">{CLP(sensores.length*700000)}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-500">Soporte {soporte} año{soporte>1?"s":""}</span><span className="font-medium text-gray-800">incluido</span></div>
                    {licencia && <div className="flex justify-between"><span className="text-gray-500">Licencia compartida</span><span className="font-medium text-gray-800">{CLP(10000000)}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-500">Usuarios ({admins+agricultores+asesores})</span><span className="font-medium text-gray-800">incluido</span></div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-5">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-500 text-sm">Estimado total</span>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-agro-green-700">{CLP(precio)}</div>
                        <div className="text-xs text-gray-400">CLP + IVA &middot; unico</div>
                      </div>
                    </div>
                  </div>

                  <a href="#contacto" className="block w-full text-center bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm mb-3">
                    Solicitar propuesta formal
                  </a>
                  <a href="https://wa.me/56987561075" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm border border-gray-200">
                    Hablamos
                  </a>
                  <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                    El cotizador es referencial. El precio final se confirma en propuesta formal tras diagnóstico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}