import { useEffect, useMemo, useRef, useState } from "react"
import { Search, X, Plus, Check } from "lucide-react"

// Normaliza para buscar sin tildes ni mayusculas
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

// Selector multiple con busqueda. `grupos`: [{ categoria, items: [string] }]
export default function MultiSelectBusqueda({ grupos, valor, onChange, placeholder = "Buscar...", max = 60 }) {
  const [q, setQ] = useState("")
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const cerrar = e => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false) }
    document.addEventListener("mousedown", cerrar)
    return () => document.removeEventListener("mousedown", cerrar)
  }, [])

  const filtrados = useMemo(() => {
    const t = norm(q.trim())
    return grupos
      .map(g => ({ ...g, items: g.items.filter(i => !t || norm(i).includes(t) || norm(g.categoria).includes(t)) }))
      .filter(g => g.items.length)
  }, [grupos, q])

  const todos = useMemo(() => new Set(grupos.flatMap(g => g.items.map(norm))), [grupos])
  const texto = q.trim()
  const puedeAgregar = texto && !todos.has(norm(texto)) && !valor.some(v => norm(v) === norm(texto))

  const toggle = item => onChange(valor.includes(item) ? valor.filter(v => v !== item) : valor.length < max ? [...valor, item] : valor)
  const agregar = () => { if (puedeAgregar) { onChange([...valor, texto]); setQ("") } }

  return (
    <div ref={ref} className="relative">
      {valor.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {valor.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-agro-green-50 border border-agro-green-300 text-agro-green-800 text-xs font-medium pl-2.5 pr-1 py-1 rounded-full">
              {v}
              <button type="button" onClick={() => toggle(v)} className="p-0.5 rounded-full hover:bg-agro-green-100" aria-label={`Quitar ${v}`}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setAbierto(true) }}
          onFocus={() => setAbierto(true)}
          onKeyDown={e => {
            if (e.key === "Enter") { e.preventDefault(); if (filtrados.length === 1 && filtrados[0].items.length === 1) { toggle(filtrados[0].items[0]); setQ("") } else agregar() }
            if (e.key === "Escape") setAbierto(false)
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"
        />
      </div>
      {abierto && (
        <div className="absolute z-30 mt-1 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl py-1">
          {puedeAgregar && (
            <button type="button" onClick={agregar} className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-agro-green-700 hover:bg-agro-green-50">
              <Plus size={14} /> Agregar “{texto}”
            </button>
          )}
          {filtrados.length === 0 && !puedeAgregar && <p className="px-3 py-2 text-sm text-gray-400">Sin resultados</p>}
          {filtrados.map(g => (
            <div key={g.categoria}>
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{g.categoria}</p>
              {g.items.map(i => {
                const activo = valor.includes(i)
                return (
                  <button type="button" key={i} onClick={() => toggle(i)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-gray-50 ${activo ? "text-agro-green-800 font-medium" : "text-gray-700"}`}>
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-300"}`}>
                      {activo && <Check size={9} className="text-white" />}
                    </span>
                    {i}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
