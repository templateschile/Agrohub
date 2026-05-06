import { useInView } from '../hooks/useInView'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export default function Marketplace() {
  const [ref, visible] = useInView({ threshold: 0.2 })

  return (
    <section id="marketplace" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={ref}
          className={`max-w-4xl mx-auto bg-gray-50 border border-gray-100 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
            <ShoppingBag size={26} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Componente adicional</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Marketplace agrícola integrado</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              La mejora productiva también tiene una salida económica. Una vez que el agricultor
              produce mejor, AgroHub ofrece un canal digital sencillo para publicar cosechas,
              servicios e insumos — conectando directamente con compradores dentro del mismo ecosistema.
            </p>
          </div>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors shrink-0"
          >
            Más información <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
