import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useInView } from "../hooks/useInView"
import { useIdioma } from "../i18n"
import { HeroModulo } from "./ModuloPagina"
import { ShoppingBag, MapPin, Search, Package, Leaf, AlertCircle, Filter, X, Info } from "lucide-react"
import PedidoModal, { nombrePais, formatoUSD } from "../components/PedidoModal"
import { enfocables, focoAtrapado } from "../lib/foco"

// Productores DE EJEMPLO, de varios países de la región, para mostrar cómo funciona el mercado: nombres
// ficticios, cupos y precios ilustrativos en USD. Productos por `clave` (nombre en src/i18n/textos/modulos.js),
// `meses`: [inicio, fin] de la temporada (1 = enero; [1, 12] = todo el año). Certificaciones: nombres
// propios, salvo "organico", que se traduce.
const PRODUCTORES = [
  {
    id: 1, nombre: "Finca Los Álamos", pais: "AR", zona: "Mendoza",
    certificaciones: ["GlobalG.A.P."],
    productos: [
      { clave: "ciruelas", variedad: "D'Agen", meses: [1, 3], cupoKg: 3000, minPedidoKg: 200, precioKg: 1.1, disponible: true },
      { clave: "uvas", variedad: "Red Globe", meses: [2, 4], cupoKg: 6000, minPedidoKg: 500, precioKg: 1.3, disponible: true },
    ],
  },
  {
    id: 2, nombre: "Sítio Boa Vista", pais: "BR", zona: "Petrolina, Pernambuco",
    certificaciones: ["GlobalG.A.P."],
    productos: [
      { clave: "mangos", variedad: "Palmer", meses: [9, 12], cupoKg: 8000, minPedidoKg: 500, precioKg: 1.2, disponible: true },
      { clave: "uvas", variedad: "BRS Vitória", meses: [10, 12], cupoKg: 5000, minPedidoKg: 300, precioKg: 1.8, disponible: false },
    ],
  },
  {
    id: 3, nombre: "Huertos del Maule", pais: "CL", zona: "Maule",
    certificaciones: ["GlobalG.A.P.", "organico"],
    productos: [
      { clave: "arandanos", variedad: "Duke", meses: [11, 1], cupoKg: 4000, minPedidoKg: 200, precioKg: 5.5, disponible: true },
      { clave: "cerezas", variedad: "Lapins", meses: [11, 1], cupoKg: 1500, minPedidoKg: 100, precioKg: 7, disponible: false },
    ],
  },
  {
    id: 4, nombre: "Finca La Esperanza", pais: "CO", zona: "Antioquia",
    certificaciones: ["Rainforest Alliance", "GlobalG.A.P."],
    productos: [
      { clave: "aguacates", variedad: "Hass", meses: [10, 1], cupoKg: 10000, minPedidoKg: 1000, precioKg: 2.1, disponible: true },
      { clave: "fresas", variedad: "Albion", meses: [1, 12], cupoKg: 2000, minPedidoKg: 100, precioKg: 2.6, disponible: true },
    ],
  },
  {
    id: 5, nombre: "Campos del Valle", pais: "MX", zona: "Sinaloa",
    certificaciones: ["PrimusGFS"],
    productos: [
      { clave: "tomates", variedad: "Saladette", meses: [12, 4], cupoKg: 20000, minPedidoKg: 1000, precioKg: 0.9, disponible: true },
      { clave: "mangos", variedad: "Ataulfo", meses: [3, 6], cupoKg: 6000, minPedidoKg: 500, precioKg: 1, disponible: false },
    ],
  },
  {
    id: 6, nombre: "Agrícola Santa Rosa", pais: "PE", zona: "La Libertad",
    certificaciones: ["GlobalG.A.P.", "organico"],
    productos: [
      { clave: "arandanos", variedad: "Biloxi", meses: [8, 11], cupoKg: 8000, minPedidoKg: 300, precioKg: 5, disponible: true },
      { clave: "esparragos", variedad: "UC-157", meses: [1, 12], cupoKg: 12000, minPedidoKg: 500, precioKg: 2.4, disponible: true },
    ],
  },
]

// Para buscar sin tildes ni mayúsculas
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
const ordenar = (lista, locale) => [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, locale))

function ProductorCard({ p, onPedido }) {
  const { t, locale } = useIdioma()
  const [ref, visible] = useInView({ threshold: 0.05 })
  const usd = formatoUSD(locale)
  const mes = new Intl.DateTimeFormat(locale, { month: "short" })
  const nombreMes = m => { const s = mes.format(new Date(2026, m - 1, 15)).replace(".", ""); return s.charAt(0).toUpperCase() + s.slice(1) }
  const temporada = ([a, b]) => (a === 1 && b === 12 ? t("mod.tienda.todoElAno") : `${nombreMes(a)}–${nombreMes(b)}`)
  const disponibles = p.productos.filter(pr => pr.disponible)
  return (
    <li
      ref={ref}
      className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 flex flex-col ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base">{p.nombre}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-gray-500 shrink-0" aria-hidden="true" />
              <span className="text-xs text-gray-600">{p.zona} · {p.paisNombre}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[11px] bg-gray-50 text-gray-700 font-semibold px-2 py-0.5 rounded-full border border-gray-200">{t("mod.ejemplo")}</span>
            {disponibles.length > 0
              ? <span className="text-[11px] bg-agro-green-50 text-agro-green-800 font-semibold px-2 py-0.5 rounded-full border border-agro-green-100">{t("mod.tienda.conCupos")}</span>
              : <span className="text-[11px] bg-gray-50 text-gray-600 font-semibold px-2 py-0.5 rounded-full border border-gray-100">{t("mod.tienda.sinCupos")}</span>
            }
          </div>
        </div>
        <ul className="flex flex-wrap gap-1.5 mb-4">
          {p.certificaciones.map(c => (
            <li key={c} className="text-[11px] bg-agro-earth-50 text-agro-earth-800 px-2 py-0.5 rounded-full font-medium">
              {c === "organico" ? t("mod.tienda.cert.organico") : c}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2">
          {p.productos.map(pr => (
            <li key={pr.clave + pr.variedad} className={`rounded-xl p-3 border ${pr.disponible ? "bg-agro-green-50 border-agro-green-100" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <Leaf size={12} className={pr.disponible ? "text-agro-green-600 shrink-0" : "text-gray-400 shrink-0"} aria-hidden="true" />
                  <span className="font-semibold text-gray-900 text-sm">{t(`mod.prod.${pr.clave}`)}</span>
                  <span className="text-xs text-gray-600">{pr.variedad}</span>
                </div>
                {!pr.disponible && <span className="text-[11px] text-gray-600 flex items-center gap-1 shrink-0"><AlertCircle size={11} aria-hidden="true" />{t("mod.tienda.agotado")}</span>}
              </div>
              <dl className="grid grid-cols-3 gap-2 text-xs">
                <div><dt className="text-gray-600">{t("mod.tienda.temporada")}</dt><dd className="font-medium text-gray-800">{temporada(pr.meses)}</dd></div>
                <div><dt className="text-gray-600">{t("mod.tienda.pedidoMin")}</dt><dd className="font-medium text-gray-800">{pr.minPedidoKg.toLocaleString(locale)} kg</dd></div>
                <div><dt className="text-gray-600">{t("mod.tienda.precioKg")}</dt><dd className="font-bold text-agro-green-800">{usd(pr.precioKg)}</dd></div>
              </dl>
              {pr.disponible && (
                <p className="flex justify-between text-[11px] text-gray-600 mt-2">
                  <span>{t("mod.tienda.cupo")}</span>
                  <span>{pr.cupoKg.toLocaleString(locale)} kg</span>
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onPedido(p)}
          disabled={disponibles.length === 0}
          aria-label={t("mod.tienda.hacerPedidoA", { nombre: p.nombre })}
          className="min-h-[44px] flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 rounded-full transition-colors">
          <ShoppingBag size={14} aria-hidden="true" /> {t("mod.tienda.hacerPedido")}
        </button>
      </div>
    </li>
  )
}

// Campos de filtro: los mismos en la barra de escritorio y en la hoja del celular (con otros id)
function CamposFiltro({ f, set, paises, productos, movil }) {
  const { t } = useIdioma()
  const id = useId()
  const campo = movil ? "min-h-[48px]" : "min-h-[44px]"
  return (
    <>
      <label htmlFor={`${id}-q`} className="sr-only">{t("mod.tienda.buscar.label")}</label>
      <div className={`${movil ? "" : "flex-1"} bg-white border border-gray-300 rounded-xl flex items-center gap-3 px-4 shadow-sm focus-within:ring-2 focus-within:ring-agro-green-500`}>
        <Search size={15} className="text-gray-500 shrink-0" aria-hidden="true" />
        <input
          id={`${id}-q`}
          type="search"
          placeholder={t("mod.tienda.buscar.placeholder")}
          value={f.busqueda}
          onChange={e => set({ busqueda: e.target.value })}
          className={`flex-1 min-w-0 ${campo} text-sm text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none`}
        />
      </div>
      <label htmlFor={`${id}-pais`} className="sr-only">{t("mod.tienda.pais.label")}</label>
      <select id={`${id}-pais`} value={f.pais} onChange={e => set({ pais: e.target.value })}
        className={`${campo} bg-white border border-gray-300 rounded-xl px-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-agro-green-500 cursor-pointer`}>
        <option value="">{t("mod.tienda.pais.todos")}</option>
        {paises.map(p => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}
      </select>
      <label htmlFor={`${id}-prod`} className="sr-only">{t("mod.tienda.producto.label")}</label>
      <select id={`${id}-prod`} value={f.producto} onChange={e => set({ producto: e.target.value })}
        className={`${campo} bg-white border border-gray-300 rounded-xl px-4 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-agro-green-500 cursor-pointer`}>
        <option value="">{t("mod.tienda.producto.todos")}</option>
        {productos.map(p => <option key={p.clave} value={p.clave}>{p.nombre}</option>)}
      </select>
      <button type="button" aria-pressed={f.soloDisponibles} onClick={() => set({ soloDisponibles: !f.soloDisponibles })}
        className={`${campo} flex items-center gap-2 px-4 rounded-xl border text-sm font-medium transition-colors ${f.soloDisponibles ? "bg-agro-green-700 text-white border-agro-green-700" : "bg-white text-gray-700 border-gray-300 hover:border-agro-green-500"}`}>
        <Package size={14} aria-hidden="true" />{movil ? t("mod.tienda.soloConCupos") : t("mod.tienda.conCupos")}
      </button>
    </>
  )
}

const SIN_FILTROS = { busqueda: "", pais: "", producto: "", soloDisponibles: false }

export default function Tienda() {
  const { t, locale } = useIdioma()
  const [f, setF] = useState(SIN_FILTROS)
  const set = cambio => setF(prev => ({ ...prev, ...cambio }))
  const [filtroAbierto, setFiltroAbierto] = useState(false)
  const [pedidoProductor, setPedidoProductor] = useState(null)

  // Países y productos con nombre en el idioma activo, en orden alfabético
  const productores = useMemo(() => PRODUCTORES.map(p => ({ ...p, paisNombre: nombrePais(p.pais, locale) })), [locale])
  const paises = useMemo(() => ordenar([...new Set(PRODUCTORES.map(p => p.pais))].map(codigo => ({ codigo, nombre: nombrePais(codigo, locale) })), locale), [locale])
  const productos = useMemo(() => ordenar([...new Set(PRODUCTORES.flatMap(p => p.productos.map(pr => pr.clave)))].map(clave => ({ clave, nombre: t(`mod.prod.${clave}`) })), locale), [locale, t])

  const q = norm(f.busqueda.trim())
  const filtrados = productores.filter(p =>
    (!f.pais || p.pais === f.pais) &&
    (!f.producto || p.productos.some(pr => pr.clave === f.producto)) &&
    (!q || norm(`${p.nombre} ${p.zona} ${p.paisNombre}`).includes(q)) &&
    (!f.soloDisponibles || p.productos.some(pr => pr.disponible)))
  const hayFiltros = f.busqueda || f.pais || f.producto || f.soloDisponibles

  // Hoja de filtros en el celular: diálogo con foco atrapado, Escape cierra y el foco vuelve al botón
  const hoja = useRef(null)
  const tituloHoja = useId()
  useEffect(() => {
    if (!filtroAbierto) return
    const previo = document.activeElement
    hoja.current?.querySelector("input")?.focus()
    const tecla = e => {
      if (e.key === "Escape") return setFiltroAbierto(false)
      if (e.key !== "Tab") return
      const destino = focoAtrapado(enfocables(hoja.current), document.activeElement, e.shiftKey)
      if (destino) { e.preventDefault(); destino.focus() }
    }
    document.addEventListener("keydown", tecla)
    return () => { document.removeEventListener("keydown", tecla); if (previo?.isConnected) previo.focus?.() }
  }, [filtroAbierto])

  return (
    <div>
      <HeroModulo moduloKey="tienda" titulo={t("mod.tienda.titulo")} destacado={t("mod.tienda.destacado")} bajada={t("mod.tienda.bajada")} />

      {/* Filtros en escritorio: barra fija */}
      <section className="py-4 bg-gray-50 border-b border-gray-100 sticky top-16 md:top-20 z-30 hidden sm:block" aria-label={t("mod.tienda.filtros")}>
        <div className="max-w-7xl mx-auto px-6 lg:px-14 flex flex-row gap-3">
          <CamposFiltro f={f} set={set} paises={paises} productos={productos} />
        </div>
      </section>

      {/* Filtros en el celular: botón flotante y hoja */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setFiltroAbierto(true)}
          aria-haspopup="dialog"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 min-h-[48px] flex items-center gap-2 bg-agro-green-700 text-white font-semibold text-sm px-5 rounded-full shadow-xl shadow-agro-green-900/40"
        >
          <Filter size={15} aria-hidden="true" />
          {t("mod.tienda.filtrar")}
          {hayFiltros && <><span className="w-2 h-2 bg-agro-green-300 rounded-full" aria-hidden="true" /><span className="sr-only">({t("mod.tienda.filtrosActivos")})</span></>}
        </button>

        {filtroAbierto && (
          <div className="fixed inset-0 z-[400] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltroAbierto(false)} />
            <div ref={hoja} role="dialog" aria-modal="true" aria-labelledby={tituloHoja} className="relative bg-white rounded-t-3xl px-5 pt-4 pb-8 flex flex-col gap-3 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 id={tituloHoja} className="font-bold text-gray-900">{t("mod.tienda.filtros")}</h2>
                <button type="button" onClick={() => setFiltroAbierto(false)} aria-label={t("mod.tienda.cerrarFiltros")}
                  className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
                  <X size={16} className="text-gray-700" aria-hidden="true" />
                </button>
              </div>
              <CamposFiltro f={f} set={set} paises={paises} productos={productos} movil />
              <button type="button" onClick={() => setF(SIN_FILTROS)}
                className="min-h-[44px] text-sm text-gray-700 underline underline-offset-4">
                {t("mod.tienda.limpiar")}
              </button>
              <button type="button" onClick={() => setFiltroAbierto(false)}
                className="w-full min-h-[48px] bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold rounded-xl text-sm transition-colors">
                {t.plural("mod.tienda.ver", filtrados.length)}
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="py-10 pb-24 sm:pb-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="sr-only">{t("mod.tienda.lista.titulo")}</h2>
          <p className="flex items-start gap-2 text-sm text-gray-700 mb-4">
            <Info size={16} className="text-agro-green-700 shrink-0 mt-0.5" aria-hidden="true" />
            {t("mod.tienda.aviso")}
          </p>
          <p className="text-sm text-gray-700 mb-6" aria-live="polite">{t.plural("mod.tienda.encontrados", filtrados.length)}</p>
          {filtrados.length === 0
            ? <div className="text-center py-16 text-gray-600">
                <Package size={40} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
                <p className="text-sm">{t("mod.tienda.vacio")}</p>
                <button type="button" onClick={() => setF(SIN_FILTROS)} className="mt-2 min-h-[44px] px-3 text-agro-green-700 text-sm font-semibold underline underline-offset-4">{t("mod.tienda.limpiar")}</button>
              </div>
            : <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtrados.map(p => <ProductorCard key={p.id} p={p} onPedido={setPedidoProductor} />)}
              </ul>
          }
        </div>
      </section>

      {pedidoProductor && (
        <PedidoModal productor={pedidoProductor} onClose={() => setPedidoProductor(null)} />
      )}
    </div>
  )
}
