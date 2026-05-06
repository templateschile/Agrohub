import { useInView } from '../hooks/useInView'
import { ShoppingBag, Eye, Wrench, Package, MessageCircle, LayoutGrid, ArrowRight } from 'lucide-react'

const MARKET_IMAGE = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80&auto=format'

const functions_ = [
  {
    icon: Eye,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Publicación de productos',
    desc: 'Da visibilidad a cosechas y producción local.',
  },
  {
    icon: Wrench,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    title: 'Servicios agrícolas',
    desc: 'Ofrece capacidades, maquinaria, asesorías o labores.',
  },
  {
    icon: Package,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    title: 'Publicación de insumos',
    desc: 'Facilita acceso y conexión con proveedores o terceros.',
  },
  {
    icon: MessageCircle,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    title: 'Contacto directo',
    desc: 'Reduce fricción entre productor, comprador y red de apoyo.',
  },
  {
    icon: LayoutGrid,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    title: 'Vitrina digital',
    desc: 'Profesionaliza la oferta agrícola del territorio.',
  },
  {
    icon: LayoutGrid,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    title: 'Información centralizada',
    desc: 'Ordena disponibilidad, producto, zona y datos comerciales.',
  },
]

function MockMarketplace() {
  const listings = [
    { name: 'Tomates Cherry', qty: '500 kg disponibles', zone: 'Sector El Molino', price: '$850/kg', tag: 'Fresco', color: 'bg-rose-100 text-rose-700' },
    { name: 'Servicio de riego', qty: 'Disponible lun–vie', zone: 'Valle de Choapa', price: 'Consultar', tag: 'Servicio', color: 'bg-agro-blue-100 text-agro-blue-700' },
    { name: 'Micorrizas arbusculares', qty: '20 kg en stock', zone: 'Proveedor local', price: '$3.200/kg', tag: 'Insumo', color: 'bg-agro-green-100 text-agro-green-700' },
    { name: 'Paltas Hass', qty: '1.200 kg disponibles', zone: 'Sector Los Molles', price: '$1.400/kg', tag: 'Fresco', color: 'bg-amber-100 text-amber-700' },
  ]
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-sm w-full">
      <div className="bg-agro-green-700 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} className="text-white" />
          <span className="text-white text-sm font-semibold">Marketplace AgroHub UC</span>
        </div>
        <span className="text-white/60 text-xs">Valle de Choapa</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {listings.map(item => (
          <div key={item.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-agro-green-100 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-base">🌿</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-gray-800 truncate">{item.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.color}`}>{item.tag}</span>
              </div>
              <div className="text-[10px] text-gray-500">{item.qty} · {item.zone}</div>
            </div>
            <div className="text-xs font-bold text-agro-green-700 shrink-0">{item.price}</div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <button className="w-full bg-agro-green-600 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
          Publicar mi producto <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="marketplace" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-5">
            <ShoppingBag size={14} className="text-purple-600" />
            <span className="text-purple-700 text-sm font-medium">Comercialización integrada</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            La mejora productiva también tiene una salida económica
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            El marketplace es parte esencial de la solución. Porque producir mejor tiene que traducirse
            también en vender mejor. AgroHub UC conecta la producción con el mercado.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: functions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {functions_.map((fn, i) => {
              const [ref, visible] = useInView({ threshold: 0.1 })
              const Icon = fn.icon
              return (
                <div
                  key={fn.title}
                  ref={ref}
                  className={`card-hover bg-gray-50 border border-gray-100 rounded-xl p-5 flex gap-4 items-start transition-all duration-500 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className={`w-9 h-9 rounded-lg ${fn.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className={fn.color} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{fn.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{fn.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: mockup */}
          <div className="flex flex-col items-center gap-6">
            <MockMarketplace />
            <div className="bg-agro-green-50 border border-agro-green-100 rounded-2xl p-5 max-w-sm w-full">
              <p className="text-agro-green-800 text-sm font-medium text-center leading-relaxed">
                "Observa su cultivo → Entiende qué ocurre → Mejora su manejo → Organiza su información → <strong>Ofrece su producción → Conecta con compradores</strong>"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
