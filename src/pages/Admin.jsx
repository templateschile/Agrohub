import { useEffect, useRef, useState, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { Lock, LogOut, RefreshCw, Save, Printer, Copy, RotateCcw, Bold, Italic, Heading2, List, Highlighter, Search, Mail } from "lucide-react"
import { generarPropuesta } from "../lib/propuesta"
import Correo from "./admin/Correo"
import Cuentas from "./admin/Cuentas"
import Seguimiento from "./admin/Seguimiento"

const ESTADOS = ["nueva", "en revisión", "propuesta enviada", "ganada", "descartada"]
const COLOR_ESTADO = {
  "nueva": "bg-blue-50 text-blue-700",
  "en revisión": "bg-amber-50 text-amber-700",
  "propuesta enviada": "bg-purple-50 text-purple-700",
  "ganada": "bg-agro-green-50 text-agro-green-700",
  "descartada": "bg-gray-100 text-gray-500",
}
const TIPO = { evaluacion: "Evaluación", contacto: "Contacto", pedido: "Pedido" }
const CLAVE_SESION = "agrohub_admin"
const PESTANAS = [["evaluaciones", "Evaluaciones"], ["correo", "Correo"], ["seguimiento", "Seguimiento"], ["cuentas", "Cuentas"]]

const leerClave = () => { try { return sessionStorage.getItem(CLAVE_SESION) || "" } catch { return "" } }
const guardarClave = v => { try { v ? sessionStorage.setItem(CLAVE_SESION, v) : sessionStorage.removeItem(CLAVE_SESION) } catch { /* sin storage */ } }
const fecha = iso => new Date(iso).toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })

async function api(clave, { method = "GET", id, body } = {}) {
  const res = await fetch(`/api/admin${id ? `?id=${encodeURIComponent(id)}` : ""}`, {
    method,
    headers: { Authorization: `Bearer ${clave}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(json.error || `Error ${res.status}`), { status: res.status })
  return json
}

function Login({ onLogin, error }) {
  const [clave, setClave] = useState("")
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={e => { e.preventDefault(); onLogin(clave) }} className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="w-11 h-11 rounded-xl bg-agro-green-600 flex items-center justify-center mb-4"><Lock size={18} className="text-white" /></div>
        <h1 className="font-bold text-gray-900 text-xl mb-1">Admin AgroHubs</h1>
        <p className="text-sm text-gray-500 mb-5">Evaluaciones, contactos y propuestas.</p>
        <input type="password" value={clave} onChange={e => setClave(e.target.value)} placeholder="Clave de administrador" autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        <button className="mt-4 w-full bg-agro-green-600 hover:bg-agro-green-700 text-white font-semibold py-2.5 rounded-xl text-sm">Entrar</button>
      </form>
    </div>
  )
}

function Editor({ lead, clave, onGuardado, onEscribir }) {
  const docRef = useRef(null)
  const [estado, setEstado] = useState(lead.estado)
  const [notas, setNotas] = useState(lead.notas || "")
  const [msg, setMsg] = useState("")
  const [guardando, setGuardando] = useState(false)

  // Solo al abrir otra evaluacion (Editor va con key={id}); guardar no recarga el documento
  useEffect(() => {
    if (docRef.current) docRef.current.innerHTML = lead.propuestaHtml || generarPropuesta(lead)
  }, [lead.id])

  const cmd = (c, v) => { document.execCommand(c, false, v); docRef.current?.focus() }
  const aviso = t => { setMsg(t); setTimeout(() => setMsg(""), 2500) }

  const guardar = async () => {
    setGuardando(true)
    try {
      const { lead: nuevo } = await api(clave, { method: "PUT", body: { id: lead.id, propuestaHtml: docRef.current.innerHTML, estado, notas } })
      onGuardado(nuevo)
      aviso("Guardado ✓")
    } catch (e) { aviso(e.message) }
    setGuardando(false)
  }

  const regenerar = () => {
    if (confirm("¿Reemplazar el documento por uno nuevo generado desde las respuestas? Se pierden los cambios no guardados.")) {
      docRef.current.innerHTML = generarPropuesta(lead)
    }
  }

  const copiar = async () => {
    const html = docRef.current.innerHTML.replace(/<\/?mark>/g, "")
    try {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([docRef.current.innerText], { type: "text/plain" }),
      })])
      aviso("Copiado: pégalo en tu correo ✓")
    } catch { aviso("No se pudo copiar") }
  }

  const c = lead.contacto || {}
  const btn = "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
  const tool = "p-2 rounded-lg hover:bg-gray-100 text-gray-600"

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm no-print">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">{TIPO[lead.tipo]} · {fecha(lead.creado)}</p>
            <h2 className="font-bold text-gray-900 text-lg">{c.nombre}{c.empresa ? ` · ${c.empresa}` : ""}</h2>
            <p className="text-sm text-gray-600">
              {[c.cargo, c.email && <a key="e" href={`mailto:${c.email}`} className="text-agro-green-700 underline">{c.email}</a>, c.telefono].filter(Boolean).reduce((a, x, i) => i ? [...a, " · ", x] : [x], [])}
            </p>
          </div>
          <div className="flex items-center gap-2">
          {c.email && (
            <button onClick={() => onEscribir(c)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg bg-agro-green-600 hover:bg-agro-green-700 text-white">
              <Mail size={14} /> Escribir correo
            </button>
          )}
          <select value={estado} onChange={e => setEstado(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            {ESTADOS.map(s => <option key={s}>{s}</option>)}
          </select>
          </div>
        </div>
        {lead.mensaje && <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">{lead.mensaje}</p>}
        {lead.resumen?.length > 0 && (
          <ul className="mt-3 text-xs text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            {lead.resumen.map(l => <li key={l}>• {l}</li>)}
          </ul>
        )}
        <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={2} placeholder="Notas internas (no salen en la propuesta)"
          className="mt-3 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-3 no-print">
          <button type="button" className={tool} title="Negrita" onClick={() => cmd("bold")}><Bold size={15} /></button>
          <button type="button" className={tool} title="Cursiva" onClick={() => cmd("italic")}><Italic size={15} /></button>
          <button type="button" className={tool} title="Título" onClick={() => cmd("formatBlock", "h2")}><Heading2 size={15} /></button>
          <button type="button" className={tool} title="Lista" onClick={() => cmd("insertUnorderedList")}><List size={15} /></button>
          <button type="button" className={tool} title="Quitar resaltado" onClick={() => cmd("hiliteColor", "transparent")}><Highlighter size={15} /></button>
          <div className="flex-1" />
          {msg && <span className="text-xs text-agro-green-700 font-semibold">{msg}</span>}
          <button type="button" className={btn} onClick={regenerar}><RotateCcw size={13} /> Regenerar</button>
          <button type="button" className={btn} onClick={copiar}><Copy size={13} /> Copiar para email</button>
          <button type="button" className={btn} onClick={() => window.print()}><Printer size={13} /> PDF</button>
          <button type="button" onClick={guardar} disabled={guardando}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-agro-green-600 hover:bg-agro-green-700 text-white disabled:opacity-50">
            <Save size={13} /> {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 px-6 pt-3 no-print">Haz clic en el documento para editarlo. Lo resaltado en amarillo es para completar.</p>
        <div ref={docRef} contentEditable suppressContentEditableWarning className="propuesta-doc print-area p-6 md:p-10 outline-none" />
      </div>
    </div>
  )
}

export default function Admin() {
  const [clave, setClave] = useState(leerClave)
  const [leads, setLeads] = useState(null)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [filtro, setFiltro] = useState("")
  const [params, setParams] = useSearchParams()
  const idSel = params.get("id")
  const tab = params.get("tab") || "evaluaciones"

  const cargar = useCallback(async (k = clave) => {
    if (!k) return
    setCargando(true)
    try {
      const { leads } = await api(k, {})
      setLeads(leads)
      setError("")
      guardarClave(k)
    } catch (e) {
      if (e.status === 401) { setClave(""); guardarClave("") }
      setError(e.message)
    }
    setCargando(false)
  }, [clave])

  useEffect(() => { document.title = "Admin · AgroHubs" }, [])
  useEffect(() => { if (clave && !leads) cargar() }, [clave, leads, cargar])

  if (!clave || (!leads && error)) {
    return <Login error={error} onLogin={k => { setClave(k); cargar(k) }} />
  }

  const seleccionado = leads?.find(l => l.id === idSel)
  const q = filtro.toLowerCase()
  const visibles = (leads || []).filter(l => !q || JSON.stringify(l.contacto).toLowerCase().includes(q) || l.estado.includes(q) || (TIPO[l.tipo] || "").toLowerCase().includes(q))
  const actualizar = nuevo => setLeads(prev => prev.map(l => l.id === nuevo.id ? nuevo : l))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-agro-green-900 text-white no-print">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="font-bold">AgroHubs · Admin</span>
            <nav className="flex gap-1 text-sm">
              {PESTANAS.map(([id, label]) => (
                <button key={id} onClick={() => setParams(id === "evaluaciones" ? {} : { tab: id })}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${tab === id ? "bg-white/15 text-white font-semibold" : "text-white/70 hover:text-white"}`}>{label}</button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {tab === "evaluaciones" && <button onClick={() => cargar()} className="flex items-center gap-1.5 text-white/80 hover:text-white"><RefreshCw size={14} className={cargando ? "animate-spin" : ""} /> Actualizar</button>}
            <button onClick={() => { guardarClave(""); setClave(""); setLeads(null) }} className="flex items-center gap-1.5 text-white/80 hover:text-white"><LogOut size={14} /> Salir</button>
          </div>
        </div>
      </header>

      {tab === "correo" && <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <Correo clave={clave} casillaUrl={params.get("casilla")} onCasilla={email => setParams({ tab: "correo", casilla: email }, { replace: true })}
          nuevoPara={params.get("para") ? { para: params.get("para"), nombre: params.get("nombre"), empresa: params.get("empresa") } : null} />
      </div>}
      {tab === "seguimiento" && <div className="max-w-7xl mx-auto px-4 md:px-6 py-6"><Seguimiento clave={clave} /></div>}
      {tab === "cuentas" && <div className="max-w-7xl mx-auto px-4 md:px-6 py-6"><Cuentas clave={clave} /></div>}
      {tab === "evaluaciones" && <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="no-print">
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Buscar nombre, empresa, estado..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
          </div>
          {!leads ? <p className="text-sm text-gray-400">Cargando...</p> : visibles.length === 0 ? (
            <p className="text-sm text-gray-400">Aún no hay registros.</p>
          ) : (
            <ul className="flex flex-col gap-2 lg:max-h-[calc(100vh-150px)] overflow-y-auto">
              {visibles.map(l => (
                <li key={l.id}>
                  <button onClick={() => setParams({ id: l.id })}
                    className={`w-full text-left rounded-xl border p-3 transition-colors ${l.id === idSel ? "bg-agro-green-50 border-agro-green-400" : "bg-white border-gray-100 hover:border-gray-300"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-gray-900 truncate">{l.contacto?.empresa || l.contacto?.nombre}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${COLOR_ESTADO[l.estado] || ""}`}>{l.estado}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{l.contacto?.nombre} · {TIPO[l.tipo]}</p>
                    <p className="text-[10px] text-gray-400">{fecha(l.creado)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main>
          {seleccionado ? (
            <Editor key={seleccionado.id} lead={seleccionado} clave={clave} onGuardado={actualizar}
              onEscribir={c => setParams({ tab: "correo", para: c.email, nombre: c.nombre || "", empresa: c.empresa || "" })} />
          ) : (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-400 no-print">
              Selecciona una evaluación para ver sus respuestas y editar la propuesta de diagnóstico previo.
            </div>
          )}
        </main>
      </div>}
    </div>
  )
}
