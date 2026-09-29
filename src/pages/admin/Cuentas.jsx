import { useEffect, useState } from "react"
import { Plus, Eye, EyeOff, Copy, Trash2, Save, ExternalLink, KeyRound, Search, X, Mail, PlugZap, ChevronDown, ChevronUp } from "lucide-react"
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

const CASILLAS = ["cristian@agrohubs.cl", "marcos@agrohubs.cl", "contacto@compararepuestos.cl"]

// Casilla que usa el sitio para avisos, agradecimientos y la pestana Correo
function CorreoSitio({ clave }) {
  const [f, setF] = useState(null)
  const [pass, setPass] = useState("")
  const [ver, setVer] = useState(false)
  const [avanzado, setAvanzado] = useState(false)
  const [info, setInfo] = useState({ tieneClave: false, origen: "" })
  const [estado, setEstado] = useState("")
  const [prueba, setPrueba] = useState(null)

  useEffect(() => {
    adminApi(clave, "config").then(r => { setF(r.config); setInfo({ tieneClave: r.tieneClave, origen: r.origen }) })
      .catch(e => setEstado(e.message))
  }, [clave])

  if (!f) return estado ? <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{estado}</p> : null
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const cuerpo = () => ({ ...f, from: f.from || `AgroHub <${f.user}>`, pass })

  const probar = async () => {
    setEstado("Probando conexión..."); setPrueba(null)
    try { const r = await adminApi(clave, "config", { method: "POST", body: cuerpo() }); setPrueba(r.prueba); setEstado("") }
    catch (e) { setEstado(e.message) }
  }
  const guardar = async () => {
    setEstado("Guardando...")
    try {
      const r = await adminApi(clave, "config", { method: "PUT", body: cuerpo() })
      setF(r.config); setInfo({ tieneClave: r.tieneClave, origen: r.tieneClave ? "admin" : info.origen }); setPass(""); setEstado("Guardado ✓")
    } catch (e) { setEstado(e.message) }
  }
  const ok = v => v === "ok"

  return (
    <div className="bg-white border-2 border-agro-green-200 rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Mail size={16} className="text-agro-green-600" /> Correo del sitio</h3>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${info.origen === "admin" ? "bg-agro-green-50 text-agro-green-700" : "bg-amber-50 text-amber-700"}`}>
          {info.origen === "admin" ? "En uso: esta configuración" : "En uso: variables de Vercel"}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-4">Casilla desde la que salen los avisos, el agradecimiento al cliente y los correos de la pestaña Correo. Servidor precargado igual que compararepuestos.cl: solo falta la contraseña.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-gray-600">Casilla (usuario)</label>
          <input list="casillas" value={f.user} onChange={set("user")} className={inputCls} />
          <datalist id="casillas">{CASILLAS.map(c => <option key={c} value={c} />)}</datalist>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-gray-600">Contraseña de la casilla</label>
          <div className="relative">
            <input value={pass} onChange={e => setPass(e.target.value)} type={ver ? "text" : "password"} autoComplete="new-password"
              placeholder={info.tieneClave ? "•••••••• (guardada; escribe para cambiarla)" : "Escribe la contraseña"} className={`${inputCls} pr-9`} />
            <button type="button" onClick={() => setVer(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">{ver ? <EyeOff size={15} /> : <Eye size={15} />}</button>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold text-gray-600">Remitente (cómo lo ve el cliente)</label>
          <input value={f.from} onChange={set("from")} placeholder={`AgroHub <${f.user}>`} className={inputCls} />
        </div>
      </div>
      <button type="button" onClick={() => setAvanzado(v => !v)} className="flex items-center gap-1 text-xs text-gray-500 font-semibold mt-3">
        Servidor {avanzado ? <ChevronUp size={13} /> : <ChevronDown size={13} />} <span className="font-normal text-gray-400">{f.host} · SMTP {f.port} · IMAP {f.imapPort}</span>
      </button>
      {avanzado && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          <input value={f.host} onChange={set("host")} placeholder="Servidor" className={inputCls} />
          <input value={f.port} onChange={set("port")} placeholder="Puerto SMTP" className={inputCls} />
          <input value={f.imapPort} onChange={set("imapPort")} placeholder="Puerto IMAP" className={inputCls} />
        </div>
      )}
      {prueba && (
        <div className="mt-3 text-xs flex flex-col gap-1">
          <span className={ok(prueba.smtp) ? "text-agro-green-700" : "text-red-600"}>{ok(prueba.smtp) ? "✓" : "✗"} Envío (SMTP): {ok(prueba.smtp) ? "conectado" : prueba.smtp}</span>
          <span className={ok(prueba.imap) ? "text-agro-green-700" : "text-red-600"}>{ok(prueba.imap) ? "✓" : "✗"} Bandeja (IMAP): {ok(prueba.imap) ? "conectado" : prueba.imap}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2 mt-4">
        {estado && <span className="text-xs text-gray-500 mr-auto">{estado}</span>}
        <button onClick={probar} disabled={!f.user || (!pass && !info.tieneClave)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
          <PlugZap size={14} /> Probar conexión
        </button>
        <button onClick={guardar} disabled={!f.user}
          className="inline-flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Save size={14} /> Guardar
        </button>
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
      <CorreoSitio clave={clave} />
      <div className="flex flex-wrap items-center gap-3 mt-2">
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
