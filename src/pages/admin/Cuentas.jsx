import { useEffect, useState } from "react"
import { Plus, Eye, EyeOff, Copy, Trash2, Save, ExternalLink, KeyRound, Search, X } from "lucide-react"
import { adminApi } from "../../lib/adminApi"

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"
const VACIA = { servicio: "", url: "", usuario: "", clave: "", notas: "" }

function Formulario({ inicial, onGuardar, onCancelar }) {
  const [f, setF] = useState({ ...VACIA, ...inicial })
  const [ver, setVer] = useState(false)
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  return (
    <div className="bg-white border-2 border-agro-green-200 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{inicial?.id ? "Editar cuenta" : "Nueva cuenta"}</h3>
        <button onClick={onCancelar} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={f.servicio} onChange={set("servicio")} placeholder="Servicio * (ej: Vercel, Namecheap, Gmail)" className={inputCls} />
        <input value={f.url} onChange={set("url")} placeholder="URL de acceso" className={inputCls} />
        <input value={f.usuario} onChange={set("usuario")} placeholder="Usuario / email" autoComplete="off" className={inputCls} />
        <div className="relative">
          <input value={f.clave} onChange={set("clave")} type={ver ? "text" : "password"} placeholder="Contraseña" autoComplete="new-password" className={`${inputCls} pr-9`} />
          <button type="button" onClick={() => setVer(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">{ver ? <EyeOff size={15} /> : <Eye size={15} />}</button>
        </div>
      </div>
      <textarea value={f.notas} onChange={set("notas")} rows={4} placeholder="Otros detalles: 2FA, correo de recuperación, plan, fecha de renovación, quién la administra..." className={`${inputCls} resize-y`} />
      <div className="flex justify-end">
        <button onClick={() => onGuardar(f)} disabled={!f.servicio.trim()}
          className="inline-flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Save size={14} /> Guardar
        </button>
      </div>
    </div>
  )
}

function Tarjeta({ c, onEditar, onBorrar, aviso }) {
  const [ver, setVer] = useState(false)
  const copiar = async (t, que) => { try { await navigator.clipboard.writeText(t); aviso(`${que} copiado`) } catch { aviso("No se pudo copiar") } }
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{c.servicio}</p>
          {c.url && <a href={/^https?:\/\//.test(c.url) ? c.url : `https://${c.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-agro-green-700 inline-flex items-center gap-1 hover:underline truncate max-w-full">{c.url} <ExternalLink size={11} /></a>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEditar} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">Editar</button>
          <button onClick={onBorrar} className="p-1.5 text-gray-400 hover:text-red-500" title="Borrar"><Trash2 size={15} /></button>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-1.5 text-sm">
        {c.usuario && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs w-16 shrink-0">Usuario</span>
            <span className="truncate flex-1">{c.usuario}</span>
            <button onClick={() => copiar(c.usuario, "Usuario")} className="text-gray-400 hover:text-gray-700"><Copy size={13} /></button>
          </div>
        )}
        {c.clave && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs w-16 shrink-0">Clave</span>
            <span className="font-mono truncate flex-1">{ver ? c.clave : "••••••••••"}</span>
            <button onClick={() => setVer(v => !v)} className="text-gray-400 hover:text-gray-700">{ver ? <EyeOff size={13} /> : <Eye size={13} />}</button>
            <button onClick={() => copiar(c.clave, "Clave")} className="text-gray-400 hover:text-gray-700"><Copy size={13} /></button>
          </div>
        )}
        {c.notas && <p className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 rounded-lg p-2 mt-1">{c.notas}</p>}
        {c.actualizado && <p className="text-[10px] text-gray-400">Actualizado {new Date(c.actualizado).toLocaleDateString("es-CL")}</p>}
      </div>
    </div>
  )
}

export default function Cuentas({ clave }) {
  const [cuentas, setCuentas] = useState(null)
  const [editando, setEditando] = useState(null)
  const [filtro, setFiltro] = useState("")
  const [error, setError] = useState("")
  const [msg, setMsg] = useState("")
  const aviso = t => { setMsg(t); setTimeout(() => setMsg(""), 2000) }

  useEffect(() => {
    adminApi(clave, "boveda").then(r => setCuentas(r.cuentas)).catch(e => { setError(e.message); setCuentas([]) })
  }, [clave])

  const guardar = async f => {
    try {
      const { cuenta } = await adminApi(clave, "boveda", { method: "POST", body: f })
      setCuentas(prev => [...prev.filter(c => c.id !== cuenta.id), cuenta].sort((a, b) => a.servicio.localeCompare(b.servicio, "es")))
      setEditando(null); aviso("Guardado")
    } catch (e) { aviso(e.message) }
  }
  const borrar = async c => {
    if (!confirm(`¿Borrar la cuenta "${c.servicio}"? No se puede deshacer.`)) return
    try { await adminApi(clave, "boveda", { method: "DELETE", query: { id: c.id } }); setCuentas(prev => prev.filter(x => x.id !== c.id)) }
    catch (e) { aviso(e.message) }
  }

  const q = filtro.toLowerCase()
  const visibles = (cuentas || []).filter(c => !q || `${c.servicio} ${c.usuario} ${c.url} ${c.notas}`.toLowerCase().includes(q))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setEditando({})} className="inline-flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 text-white text-sm font-semibold px-3 py-2 rounded-lg">
          <Plus size={14} /> Nueva cuenta
        </button>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar cuenta..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
        </div>
        {msg && <span className="text-xs text-agro-green-700 font-semibold">{msg}</span>}
      </div>
      <p className="text-[11px] text-gray-400 flex items-center gap-1"><KeyRound size={12} /> Las cuentas se guardan cifradas (AES-256). Solo se ven con la clave del admin.</p>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
      {editando && <Formulario key={editando.id || "nueva"} inicial={editando} onGuardar={guardar} onCancelar={() => setEditando(null)} />}
      {!cuentas ? <p className="text-sm text-gray-400">Cargando...</p> : visibles.length === 0 ? <p className="text-sm text-gray-400">No hay cuentas guardadas.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibles.map(c => <Tarjeta key={c.id} c={c} onEditar={() => setEditando(c)} onBorrar={() => borrar(c)} aviso={aviso} />)}
        </div>
      )}
    </div>
  )
}
