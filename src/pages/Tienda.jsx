import { useState } from "react"
import { useInView } from "../hooks/useInView"
import { ShoppingBag, MapPin, Search, Package, Leaf, AlertCircle, Filter, X, MessageCircle } from "lucide-react"

const COMUNAS = [
  "Todas las comunas",
  "Curico","Talca","Linares","Cauquenes",
  "Rancagua","San Fernando","Santa Cruz","Chimbarongo",
  "Chillan","San Carlos","Bulnes","Quillon",
  "Los Angeles","Mulchen","Nacimiento","Santa Barbara",
  "Temuco","Villarrica","Loncoche","Pitrufquen",
  "Osorno","Rio Negro","Purranque","La Union",
  "Ovalle","Illapel","Salamanca","Combarbala",
  "La Serena","Coquimbo","Vicuna","Paihuano",
  "Melipilla","Buin","Paine","Talagante",
]

const PRODUCTOS = [
  "Todos los productos",
  "Arandanos","Cerezas","Uvas","Manzanas","Peras",
  "Ciruelas","Paltas","Kiwis","Fresas","Frambuesas",
  "Tomates","Cebollas","Papas","Zanahorias","Lechugas",
  "Ajo","Choclo","Poroto","Espinaca","Brocoli",
]

const productores = [
  {
    id: 1,
    nombre: "Agricola Los Boldos",
    comuna: "Curico",
    region: "Maule",
    productos: [
      { nombre: "Arandanos", variedad: "Biloxi", temporada: "Dic - Feb", cupoKg: 2000, minPedidoKg: 100, precioKg: 2800, disponible: true },
      { nombre: "Cerezas", variedad: "Bing", temporada: "Nov - Ene", cupoKg: 500, minPedidoKg: 50, precioKg: 4500, disponible: false },
    ],
    certificaciones: ["GlobalGAP","SAG"],
    contacto: "+56 9 1234 5678",
  },
  {
    id: 2,
    nombre: "Campo Verde Rancagua",
    comuna: "Rancagua",
    region: "O'Higgins",
    productos: [
      { nombre: "Uvas", variedad: "Thompson Seedless", temporada: "Ene - Mar", cupoKg: 8000, minPedidoKg: 500, precioKg: 1200, disponible: true },
      { nombre: "Ciruelas", variedad: "D'Agen", temporada: "Ene - Feb", cupoKg: 3000, minPedidoKg: 200, precioKg: 900, disponible: true },
    ],
    certificaciones: ["GlobalGAP"],
    contacto: "+56 9 2345 6789",
  },
  {
    id: 3,
    nombre: "Fundo La Esperanza",
    comuna: "Chillan",
    region: "Nuble",
    productos: [
      { nombre: "Arandanos", variedad: "Duke", temporada: "Nov - Ene", cupoKg: 4000, minPedidoKg: 200, precioKg: 2600, disponible: true },
      { nombre: "Frambuesas", variedad: "Heritage", temporada: "Nov - Dic", cupoKg: 1500, minPedidoKg: 100, precioKg: 3200, disponible: true },
    ],
    certificaciones: ["Organico","SAG"],
    contacto: "+56 9 3456 7890",
  },
  {
    id: 4,
    nombre: "Huertos del Sur",
    comuna: "Temuco",
    region: "Araucania",
    productos: [
      { nombre: "Manzanas", variedad: "Fuji", temporada: "Mar - May", cupoKg: 12000, minPedidoKg: 1000, precioKg: 380, disponible: true },
      { nombre: "Peras", variedad: "Packham", temporada: "Feb - Abr", cupoKg: 6000, minPedidoKg: 500, precioKg: 520, disponible: false },
    ],
    certificaciones: ["GlobalGAP","Primus"],
    contacto: "+56 9 4567 8901",
  },
  {
    id: 5,
    nombre: "Agricola El Olivar",
    comuna: "Ovalle",
    region: "Coquimbo",
    productos: [
      { nombre: "Paltas", variedad: "Hass", temporada: "Sep - Dic", cupoKg: 5000, minPedidoKg: 200, precioKg: 1800, disponible: true },
      { nombre: "Uvas", variedad: "Red Globe", temporada: "Dic - Feb", cupoKg: 7000, minPedidoKg: 500, precioKg: 1100, disponible: true },
    ],
    certificaciones: ["GlobalGAP","SAG"],
    contacto: "+56 9 5678 9012",
  },
  {
    id: 6,
    nombre: "Cooperativa Valle Sur",
    comuna: "Osorno",
    region: "Los Lagos",
    productos: [
      { nombre: "Papas", variedad: "Dessiree", temporada: "Mar - Jun", cupoKg: 20000, minPedidoKg: 1000, precioKg: 280, disponible: true },
      { nombre: "Cebollas", variedad: "Valenciana", temporada: "Ene - Mar", cupoKg: 10000, minPedidoKg: 500, precioKg: 220, disponible: true },
    ],
    certificaciones: ["SAG"],
    contacto: "+56 9 6789 0123",
  },
]

function waLink(telefono, nombreProductor, nombreProducto, cupoKg) {
  const num = telefono.replace(/\D/g, '')
  const msg = encodeURIComponent(
    `Hola! Te contacto desde AgroHub. Estoy interesado en ${nombreProducto} de ${nombreProductor}. ¿Tienen disponibilidad del cupo (${cupoKg.toLocaleString('es-CL')} kg)?`
  )
  return `https://wa.me/${num}?text=${msg}`
}

function ProductorCard({ p }) {
  const [ref, visible] = useInView({ threshold: 0.05 })
  const [expanded, setExpanded] = useState(false)
  const disponibles = p.productos.filter(pr => pr.disponible)
  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{p.nombre}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">{p.comuna} &middot; {p.region}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {disponibles.length > 0
              ? <span className="text-[10px] bg-agro-green-50 text-agro-green-700 font-semibold px-2 py-0.5 rounded-full border border-agro-green-100">Con cupos</span>
              : <span className="text-[10px] bg-gray-50 text-gray-400 font-semibold px-2 py-0.5 rounded-full border border-gray-100">Sin cupos</span>
            }
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.certificaciones.map(c => (
            <span key={c} className="text-[10px] bg-agro-earth-50 text-agro-earth-700 px-2 py-0.5 rounded-full font-medium">{c}</span>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {p.productos.map(pr => (
            <div key={pr.nombre} className={`rounded-xl p-3 border ${pr.disponible ? "bg-agro-green-50 border-agro-green-100" : "bg-gray-50 border-gray-100 opacity-60"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Leaf size={12} className={pr.disponible ? "text-agro-green-600" : "text-gray-400"} />
                  <span className="font-semibold text-gray-900 text-sm">{pr.nombre}</span>
                  <span className="text-xs text-gray-400">{pr.variedad}</span>
                </div>
                {!pr.disponible && <span className="text-[10px] text-gray-400 flex items-center gap-1"><AlertCircle size={10}/>Agotado</span>}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><div className="text-gray-400">Temporada</div><div className="font-medium text-gray-700">{pr.temporada}</div></div>
                <div><div className="text-gray-400">Pedido min.</div><div className="font-medium text-gray-700">{pr.minPedidoKg} kg</div></div>
                <div><div className="text-gray-400">Precio/kg</div><div className="font-bold text-agro-green-700">${pr.precioKg.toLocaleString("es-CL")}</div></div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Cupo disponible</span>
                  <span>{pr.cupoKg.toLocaleString("es-CL")} kg</span>
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-agro-green-400 rounded-full" style={{width: pr.disponible ? "65%" : "0%"}} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between">
        <a
          href={`https://wa.me/${p.contacto.replace(/\D/g,'')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-agro-green-600 transition-colors"
        >
          {p.contacto}
        </a>
        <a
          href={waLink(p.contacto, p.nombre, p.productos[0]?.nombre || 'cosecha', p.productos[0]?.cupoKg || 0)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
        >
          <MessageCircle size={12}/> WhatsApp
        </a>
      </div>
    </div>
  )
}

export default function Tienda() {
  const [comuna, setComuna] = useState("Todas las comunas")
  const [producto, setProducto] = useState("Todos los productos")
  const [busqueda, setBusqueda] = useState("")
  const [soloDisponibles, setSoloDisponibles] = useState(false)
  const [filtroAbierto, setFiltroAbierto] = useState(false)

  const filtrados = productores.filter(p => {
    const matchComuna = comuna === "Todas las comunas" || p.comuna === comuna
    const matchProducto = producto === "Todos los productos" || p.productos.some(pr => pr.nombre === producto)
    const matchBusqueda = busqueda === "" || p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.comuna.toLowerCase().includes(busqueda.toLowerCase())
    const matchDisp = !soloDisponibles || p.productos.some(pr => pr.disponible)
    return matchComuna && matchProducto && matchBusqueda && matchDisp
  })

  const [headerRef, headerVisible] = useInView({ threshold: 0.1 })

  return (
    <div>
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <ShoppingBag size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Mercado de Cosecha B2B</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Encuentra productores <span className="text-agro-green-300">cerca de ti</span>
          </h1>
          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            Busca por comuna, filtra por producto y conecta directamente con agricultores
            que tienen cupos disponibles de su cosecha.
          </p>
        </div>
      </section>

      {/* FILTROS DESKTOP: sticky bar */}
      <section className="py-4 bg-gray-50 border-b border-gray-100 sticky top-16 md:top-20 z-30 hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="flex flex-row gap-3">
            <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-2.5 shadow-sm">
              <Search size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar productor o comuna..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>
            <select value={comuna} onChange={e => setComuna(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400 cursor-pointer">
              {COMUNAS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={producto} onChange={e => setProducto(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400 cursor-pointer">
              {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
            </select>
            <button onClick={() => setSoloDisponibles(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${soloDisponibles ? "bg-agro-green-600 text-white border-agro-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-agro-green-400"}`}>
              <Package size={14}/>Con cupos
            </button>
          </div>
        </div>
      </section>

      {/* FILTROS MOBILE: botón flotante + sheet */}
      <div className="sm:hidden">
        {/* Botón flotante */}
        <button
          onClick={() => setFiltroAbierto(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-agro-green-700 text-white font-semibold text-sm px-5 py-3 rounded-full shadow-xl shadow-agro-green-900/40"
        >
          <Filter size={15}/>
          Filtrar
          {(comuna !== 'Todas las comunas' || producto !== 'Todos los productos' || soloDisponibles || busqueda) &&
            <span className="w-2 h-2 bg-agro-green-300 rounded-full animate-pulse" />
          }
        </button>

        {/* Sheet overlay */}
        {filtroAbierto && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltroAbierto(false)} />
            <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900">Filtros</span>
                <button onClick={() => setFiltroAbierto(false)} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <X size={15} className="text-gray-600" />
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl flex items-center gap-3 px-4 py-2.5">
                <Search size={15} className="text-gray-400 shrink-0" />
                <input type="text" placeholder="Buscar productor o comuna..." value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none" />
              </div>
              <select value={comuna} onChange={e => setComuna(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none">
                {COMUNAS.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={producto} onChange={e => setProducto(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none">
                {PRODUCTOS.map(p => <option key={p}>{p}</option>)}
              </select>
              <button onClick={() => setSoloDisponibles(v => !v)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${soloDisponibles ? "bg-agro-green-600 text-white border-agro-green-600" : "bg-white text-gray-600 border-gray-200"}`}>
                <Package size={14}/>Solo con cupos disponibles
              </button>
              <button onClick={() => { setComuna('Todas las comunas'); setProducto('Todos los productos'); setBusqueda(''); setSoloDisponibles(false) }}
                className="text-xs text-gray-400 text-center mt-1 hover:underline">
                Limpiar filtros
              </button>
              <button onClick={() => setFiltroAbierto(false)}
                className="w-full bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
                Ver {filtrados.length} productor{filtrados.length !== 1 ? 'es' : ''}
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{filtrados.length}</span> productor{filtrados.length !== 1 ? "es" : ""} encontrado{filtrados.length !== 1 ? "s" : ""}
            </p>
          </div>
          {filtrados.length === 0
            ? <div className="text-center py-16 text-gray-400">
                <Package size={40} className="mx-auto mb-3 opacity-30"/>
                <p className="text-sm">No hay productores para ese filtro.</p>
                <button onClick={() => { setComuna("Todas las comunas"); setProducto("Todos los productos"); setBusqueda(""); setSoloDisponibles(false) }} className="mt-4 text-agro-green-600 text-sm font-semibold hover:underline">Limpiar filtros</button>
              </div>
            : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtrados.map(p => <ProductorCard key={p.id} p={p}/>)}
              </div>
          }
        </div>
      </section>
    </div>
  )
}