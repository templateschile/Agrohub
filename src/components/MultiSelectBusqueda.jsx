import { useEffect, useMemo, useRef, useState } from "react"
import { Search, X, Plus, Check } from "lucide-react"
import { useIdioma } from "../i18n"
import { etiquetaProductoAgro } from "../lib/productosAgro"

// Normaliza para buscar sin tildes ni mayúsculas
const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

// Selector múltiple con búsqueda. `grupos`: [{ categoria, items: [string] }].
// Los valores (lo que entra en `valor` y se envía) no cambian con el idioma; lo que se muestra pasa por
// `etiqueta` (por omisión, la traducción de los insumos de lib/productosAgro.js, que deja igual lo que no
// conoce). `id`: para asociar un <label htmlFor> externo; `ariaLabel` si no hay label visible.
export default function MultiSelectBusqueda({ grupos, valor, onChange, placeholder, max = 60, id, ariaLabel, etiqueta }) {
  const { t, idioma } = useIdioma()
  const nombre = etiqueta || (s => etiquetaProductoAgro(s, idioma))
  const [q, setQ] = useState("")
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const cerrar = e => { if (ref.current && !ref.current.contains(e.target)) setAbierto(false) }
    document.addEventListener("mousedown", cerrar)
    return () => document.removeEventListener("mousedown", cerrar)
  }, [])

  const filtrados = useMemo(() => {
    const b = norm(q.trim())
    return grupos
      .map(g => ({ ...g, items: g.items.filter(i => !b || norm(`${i} ${nombre(i)} ${g.categoria} ${nombre(g.categoria)}`).includes(b)) }))
      .filter(g => g.items.length)
  }, [grupos, q, idioma]) // eslint-disable-line react-hooks/exhaustive-deps

  // Lo que ya existe (valor o nombre traducido) no se ofrece como nuevo
  const todos = useMemo(() => new Set(grupos.flatMap(g => g.items.flatMap(i => [norm(i), norm(nombre(i))]))), [grupos, idioma]) // eslint-disable-line react-hooks/exhaustive-deps
  const texto = q.trim()
  const puedeAgregar = texto && !todos.has(norm(texto)) && !valor.some(v => norm(v) === norm(texto))

  const toggle = item => onChange(valor.includes(item) ? valor.filter(v => v !== item) : valor.length < max ? [...valor, item] : valor)
  const agregar = () => { if (puedeAgregar) { onChange([...valor, texto]); setQ("") } }

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={e => { if (ref.current && !ref.current.contains(e.relatedTarget)) setAbierto(false) }}
    >
      {valor.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mb-2">
          {valor.map(v => (
            <li key={v}>
              <button type="button" onClick={() => toggle(v)} aria-label={t("mod.multi.quitar", { v: nombre(v) })}
                className="inline-flex items-center gap-1.5 min-h-[44px] bg-agro-green-50 border border-agro-green-300 text-agro-green-800 text-xs font-medium pl-3 pr-2 rounded-full hover:bg-agro-green-100">
                {nombre(v)} <X size={12} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
        <input
          id={id}
          type="search"
          aria-label={ariaLabel}
          value={q}
          onChange={e => { setQ(e.target.value); setAbierto(true) }}
          onFocus={() => setAbierto(true)}
          onKeyDown={e => {
            if (e.key === "Enter") { e.preventDefault(); if (filtrados.length === 1 && filtrados[0].items.length === 1) { toggle(filtrados[0].items[0]); setQ("") } else agregar() }
            if (e.key === "Escape") setAbierto(false)
          }}
          placeholder={placeholder || t("mod.multi.buscar")}
          className="w-full min-h-[44px] pl-9 pr-3 border border-gray-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"
        />
      </div>
      {abierto && (
        // mousedown sin foco: el campo no pierde el foco al hacer clic en una opción (Safari no enfoca botones)
        <div onMouseDown={e => e.preventDefault()} className="absolute z-30 mt-1 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl py-1">
          {puedeAgregar && (
            <button type="button" onClick={agregar} className="w-full min-h-[44px] flex items-center gap-2 px-3 text-left text-sm text-agro-green-700 hover:bg-agro-green-50">
              <Plus size={14} aria-hidden="true" /> {t("mod.multi.agregar", { texto })}
            </button>
          )}
          {filtrados.length === 0 && !puedeAgregar && <p className="px-3 py-2 text-sm text-gray-600">{t("mod.multi.sinResultados")}</p>}
          {filtrados.map(g => (
            <div key={g.categoria} role="group" aria-label={nombre(g.categoria)}>
              <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-600" aria-hidden="true">{nombre(g.categoria)}</p>
              {g.items.map(i => {
                const activo = valor.includes(i)
                return (
                  <button type="button" key={i} onClick={() => toggle(i)} aria-pressed={activo}
                    className={`w-full min-h-[44px] flex items-center gap-2 px-3 text-left text-sm hover:bg-gray-50 ${activo ? "text-agro-green-800 font-medium" : "text-gray-700"}`}>
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-400"}`} aria-hidden="true">
                      {activo && <Check size={9} className="text-white" />}
                    </span>
                    {nombre(i)}
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
