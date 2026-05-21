import { Link } from "react-router-dom"
import { useInView } from "../hooks/useInView"
import { BarChart2, MessageSquare, FolderOpen, Calendar, ShoppingBag, DollarSign } from "lucide-react"

const modules = [
  {
    icon: BarChart2,
    color: "text-agro-blue-600",
    bg: "bg-agro-blue-50",
    border: "border-agro-blue-100",
    title: "Dashboard y Sensores",
    desc: "Monitoreo en tiempo real de humedad, clima y variables de riego desde cualquier dispositivo.",
    href: "/dashboard",
  },
  {
    icon: MessageSquare,
    color: "text-agro-green-600",
    bg: "bg-agro-green-50",
    border: "border-agro-green-100",
    title: "AI Chat",
    desc: "Pregunta en lenguaje natural y recibe recomendaciones tecnicas basadas en tus datos del predio.",
    href: "/ai-chat",
  },
  {
    icon: FolderOpen,
    color: "text-agro-earth-600",
    bg: "bg-agro-earth-50",
    border: "border-agro-earth-100",
    title: "Documentos",
    desc: "Centralizacion y busqueda de protocolos, guias tecnicas e historiales del campo.",
    href: "/documentos",
  },
  {
    icon: Calendar,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    title: "Eventos y Capacitaciones",
    desc: "Agenda de talleres, demostraciones en terreno y capacitaciones para tu equipo agricola.",
    href: "/eventos",
  },
  {
    icon: ShoppingBag,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    title: "Mercado de Cosecha",
    desc: "Conecta con productores por comuna, revisa cupos disponibles y haz pedidos de cosecha B2B.",
    href: "/tienda",
  },
  {
    icon: DollarSign,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "Precios y Cotizador",
    desc: "Conoce los planes disponibles y cotiza tu AgroHub personalizado segun tus necesidades.",
    href: "/precios",
  },
]

export default function ModulesPreview() {
  const [ref, visible] = useInView({ threshold: 0.15 })

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <div
          ref={ref}
          className={`max-w-xl mx-auto text-center mb-12 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-agro-green-700 text-sm font-medium">Modulos de la plataforma</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Un hub. Multiples herramientas.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Cada modulo resuelve una necesidad concreta. Activa los que necesitas
            y escala cuando estes listo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => {
            const Icon = m.icon
            return (
              <Link
                key={m.title}
                to={m.href}
                className={`group bg-white border ${m.border} rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl ${m.bg} flex items-center justify-center`}>
                  <Icon size={20} className={m.color} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-agro-green-700 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                </div>
                <span className={`text-sm font-semibold ${m.color} flex items-center gap-1 mt-auto`}>
                  Ver modulo <span className="group-hover:translate-x-1 transition-transform inline-block">-&gt;</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}