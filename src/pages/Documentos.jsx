import { useInView } from '../hooks/useInView'
import { FolderOpen, Search, Share2, Star, BookOpen, FileText, UploadCloud, Users } from 'lucide-react'

const docs = [
  { name: 'Protocolo Riego Tomate 2024',       category: 'Riego',        uses: '34 consultas', starred: true },
  { name: 'Guía Micorrizas para Hortalizas',   category: 'Nutrición',    uses: '18 consultas', starred: true },
  { name: 'Plan Fitosanitario Vid Temporada',   category: 'Sanidad',      uses: '27 consultas', starred: false },
  { name: 'Historial Hídrico Sector Norte',     category: 'Datos',        uses: 'Actualizado hoy', starred: false },
  { name: 'Manual Sensor WiseConn',             category: 'Tecnología',   uses: '9 consultas',  starred: true },
  { name: 'Reglamento Agua INDAP 2024',         category: 'Normativa',    uses: '15 consultas', starred: false },
]

const features = [
  { icon: Search,      title: 'Búsqueda inteligente',  desc: 'Encuentra cualquier documento por palabras clave o categoría.' },
  { icon: Share2,      title: 'Compatibilidad total', desc: 'Comparte documentos con todo tu equipo o con asesores externos.' },
  { icon: UploadCloud, title: 'Carga fácil',            desc: 'Sube PDFs, Excel o imágenes. El sistema los indexa automáticamente.' },
  { icon: Users,       title: 'Control de acceso',     desc: 'Define quién puede ver, editar o comentar cada documento.' },
]

export default function Documentos() {
  const [ref, visible] = useInView({ threshold: 0.15 })
  const [docsRef, docsVisible] = useInView({ threshold: 0.1 })

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <FolderOpen size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Buscador y centralizador de documentos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Todo el conocimiento agrícola, <span className="text-agro-green-300">en un solo lugar</span>
          </h1>
          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            Protocolos, guías, historiales e informes. Accesibles para todo el equipo,
            siempre actualizados, siempre citables.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div
            ref={ref}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700`}
          >
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-agro-earth-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-agro-earth-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Document list mockup */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-14">
          <div
            ref={docsRef}
            className={`transition-all duration-700`}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Base de conocimiento centralizada</h2>
              <p className="text-gray-500 text-sm">Ejemplo de documentos disponibles en el hub</p>
            </div>

            {/* Search bar mockup */}
            <div className="bg-white border border-gray-200 rounded-2xl flex items-center gap-3 px-5 py-3.5 mb-5 shadow-sm">
              <Search size={16} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Buscar protocolos, guías, historiales...</span>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen size={14} className="text-agro-earth-600" />
                  <span className="text-xs font-semibold text-gray-800">Documentos del hub</span>
                </div>
                <span className="text-[10px] bg-agro-green-50 text-agro-green-700 font-semibold px-2 py-0.5 rounded-full">
                  {docs.length} archivos
                </span>
              </div>
              {docs.map((d, i) => (
                <div
                  key={d.name}
                  className="px-5 py-3.5 flex items-center gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className="w-9 h-9 bg-agro-earth-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-agro-earth-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{d.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{d.category}</span>
                      <span className="text-[10px] text-agro-green-600">{d.uses}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Star size={12} className={d.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                    <Share2 size={12} className="text-gray-300 hover:text-agro-green-500 transition-colors cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
