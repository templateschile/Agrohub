import { useCallback, useEffect, useState } from "react"
import { Inbox, Send, RefreshCw, PenSquare, Reply, Paperclip, X } from "lucide-react"
import { adminApi, FIRMAS_OPCIONES } from "../../lib/adminApi"
import { PLANTILLAS, aplicarPlantilla } from "../../lib/plantillas"
import { firmaHtml } from "../../lib/firmas"

const fecha = iso => iso ? new Date(iso).toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""
const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"
const citar = m => `\n\n\nEl ${fecha(m.fecha)}, ${m.de} escribió:\n` + (m.texto || "").split("\n").map(l => "> " + l).join("\n")

function Redactar({ clave, casillas, casillaId, setCasillaId, inicial, onCerrar, onEnviado }) {
  const casilla = casillas.find(c => c.id === casillaId)
  const [f, setF] = useState({ para: "", cc: "", asunto: "", cuerpo: "", firma: casilla?.firma ?? "marcos", ...inicial })
  const [plantilla, setPlantilla] = useState("")
  const [estado, setEstado] = useState("")
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const vars = inicial?.vars || {}

  // Al cambiar la casilla, la firma pasa a ser la de esa casilla
  const cambiarDesde = id => {
    setCasillaId(id)
    const c = casillas.find(x => x.id === id)
    setF(p => ({ ...p, firma: c?.firma ?? p.firma }))
  }
  const usarPlantilla = id => {
    setPlantilla(id)
    const p = PLANTILLAS.find(x => x.id === id)
    if (!p) return
    if ((f.cuerpo.trim() || f.asunto.trim()) && !inicial?.responderA && !confirm("¿Reemplazar el asunto y el texto actuales por la plantilla?")) return
    const { asunto, cuerpo } = aplicarPlantilla(p, vars)
    // En una respuesta se conserva el asunto "Re:" y la cita del correo original
    setF(prev => inicial?.responderA ? { ...prev, cuerpo: cuerpo + prev.cuerpo } : { ...prev, asunto, cuerpo })
  }

  const enviar = async () => {
    setEstado("Enviando...")
    try {
      await adminApi(clave, "correo", { method: "POST", body: { ...f, casilla: casillaId } })
      onEnviado()
    } catch (e) { setEstado(e.message) }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{inicial?.responderA ? "Responder" : "Nuevo correo"}</h3>
        <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-gray-600">Desde</label>
          <select value={casillaId} onChange={e => cambiarDesde(e.target.value)} className={inputCls}>
            {casillas.map(c => <option key={c.id} value={c.id}>{c.from || c.user}</option>)}
          </select>
          {casillas.length < 2 && <p className="text-[10px] text-gray-400 mt-1">Para enviar desde otra casilla, agrégala en <a href="/admin?tab=cuentas" className="underline">Cuentas</a>.</p>}
        </div>
        <div>
          <label className="text-[11px] font-semibold text-gray-600">Plantilla</label>
          <select value={plantilla} onChange={e => usarPlantilla(e.target.value)} className={inputCls}>
            <option value="">Sin plantilla</option>
            {PLANTILLAS.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
      </div>
      <input value={f.para} onChange={set("para")} placeholder="Para (separa con coma)" className={inputCls} />
      <input value={f.cc} onChange={set("cc")} placeholder="CC (opcional)" className={inputCls} />
      <input value={f.asunto} onChange={set("asunto")} placeholder="Asunto" className={inputCls} />
      <textarea value={f.cuerpo} onChange={set("cuerpo")} rows={12} placeholder="Escribe tu mensaje..." className={`${inputCls} resize-y`} />
      {/\[[^\]]+\]/.test(f.cuerpo + f.asunto) && <p className="text-[11px] text-amber-700">Hay textos entre [corchetes] por completar antes de enviar.</p>}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <label className="text-[11px] font-semibold text-gray-600">Firma</label>
          <select value={f.firma} onChange={set("firma")} className="border border-gray-200 rounded-lg px-2 py-1 text-xs">
            {FIRMAS_OPCIONES.map(([id, n]) => <option key={id} value={id}>{n}</option>)}
          </select>
        </div>
        {f.firma
          ? <div className="border border-dashed border-gray-200 rounded-xl px-4 pb-3 bg-gray-50/50" dangerouslySetInnerHTML={{ __html: firmaHtml(f.firma, window.location.origin) }} />
          : <p className="text-xs text-gray-400">El correo sale sin firma.</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1" />
        {estado && <span className="text-xs text-gray-500">{estado}</span>}
        <button onClick={enviar} disabled={!casillaId || !f.para.trim() || !f.asunto.trim() || estado === "Enviando..."}
          className="inline-flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          <Send size={14} /> Enviar
        </button>
      </div>
    </div>
  )
}

export default function Correo({ clave, nuevoPara, casillaUrl, onCasilla }) {
  const [casillas, setCasillas] = useState(null)
  const [casillaId, setCasillaId] = useState("")
  const [carpetas, setCarpetas] = useState([])
  const [carpeta, setCarpeta] = useState("INBOX")
  const [mensajes, setMensajes] = useState(null)
  const [casillaEmail, setCasillaEmail] = useState("")
  const [abierto, setAbierto] = useState(null)
  const [redactar, setRedactar] = useState(null)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  // Casillas con contraseña guardada; parte en la principal
  useEffect(() => {
    adminApi(clave, "config").then(r => {
      const utiles = r.casillas.filter(c => c.tieneClave || c.usaCompartida)
      setCasillas(utiles)
      // Link directo: /admin?tab=correo&casilla=<email>
      setCasillaId((utiles.find(c => c.user === casillaUrl) || utiles.find(c => c.id === r.principal) || utiles[0])?.id || "")
    }).catch(() => setCasillas([]))
  }, [clave])

  // Abierto desde una evaluacion: redactar dirigido a ese cliente
  useEffect(() => {
    if (nuevoPara?.para) setRedactar({ para: nuevoPara.para, vars: { nombre: nuevoPara.nombre || "", empresa: nuevoPara.empresa || "" } })
  }, [nuevoPara?.para])

  const cargar = useCallback(async () => {
    if (casillas === null) return
    setCargando(true); setError("")
    try {
      const r = await adminApi(clave, "correo", { query: { carpeta, casilla: casillaId } })
      setMensajes(r.mensajes); setCasillaEmail(r.casilla)
    } catch (e) { setError(e.message); setMensajes([]) }
    setCargando(false)
  }, [clave, carpeta, casillaId, casillas])

  useEffect(() => { cargar() }, [cargar])
  useEffect(() => {
    if (casillas === null) return
    adminApi(clave, "correo", { query: { carpetas: 1, casilla: casillaId } }).then(r => setCarpetas(r.carpetas)).catch(() => setCarpetas([]))
  }, [clave, casillaId, casillas])

  const abrir = async m => {
    setRedactar(null)
    setAbierto({ ...m, cargando: true })
    try {
      const r = await adminApi(clave, "correo", { query: { carpeta, uid: m.uid, casilla: casillaId } })
      setAbierto(r.mensaje)
      setMensajes(prev => prev.map(x => x.uid === m.uid ? { ...x, leido: true } : x))
    } catch (e) { setAbierto({ ...m, error: e.message }) }
  }

  const responder = m => setRedactar({
    para: m.deEmail, asunto: /^re:/i.test(m.asunto) ? m.asunto : `Re: ${m.asunto}`,
    cuerpo: citar(m), responderA: m.messageId, referencias: m.referencias,
    vars: { nombre: (m.de || "").replace(/<.*>/, "").replace(/"/g, "").trim() },
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      <aside>
        {casillas?.length > 0 && (
          <select value={casillaId} onChange={e => { setCasillaId(e.target.value); setCarpeta("INBOX"); setAbierto(null); setRedactar(null); onCasilla?.(casillas.find(c => c.id === e.target.value)?.user) }}
            className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white mb-2 font-semibold">
            {casillas.map(c => <option key={c.id} value={c.id}>{c.user}</option>)}
          </select>
        )}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => { setAbierto(null); setRedactar({}) }}
            className="inline-flex items-center gap-1.5 bg-agro-green-600 hover:bg-agro-green-700 text-white text-sm font-semibold px-3 py-2 rounded-lg">
            <PenSquare size={14} /> Redactar
          </button>
          <select value={carpeta} onChange={e => { setCarpeta(e.target.value); setAbierto(null) }} className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white">
            {(carpetas.length ? carpetas : [{ path: "INBOX", nombre: "Bandeja de entrada" }]).map(c => (
              <option key={c.path} value={c.path}>{c.path === "INBOX" ? "Bandeja de entrada" : c.especial === "\\Sent" ? "Enviados" : c.nombre}</option>
            ))}
          </select>
          <button onClick={cargar} className="p-2 text-gray-500 hover:text-gray-800" title="Actualizar"><RefreshCw size={15} className={cargando ? "animate-spin" : ""} /></button>
        </div>
        {casillaEmail && <p className="text-[11px] text-gray-400 mb-2 flex items-center gap-1"><Inbox size={12} /> {casillaEmail}</p>}
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-2">{error}</p>}
        {!mensajes ? <p className="text-sm text-gray-400">Cargando...</p> : mensajes.length === 0 && !error ? <p className="text-sm text-gray-400">No hay correos.</p> : (
          <ul className="flex flex-col gap-1.5 lg:max-h-[calc(100vh-220px)] overflow-y-auto">
            {mensajes.map(m => (
              <li key={m.uid}>
                <button onClick={() => abrir(m)} className={`w-full text-left rounded-xl border p-3 transition-colors ${abierto?.uid === m.uid ? "bg-agro-green-50 border-agro-green-400" : "bg-white border-gray-100 hover:border-gray-300"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${m.leido ? "text-gray-600" : "font-bold text-gray-900"}`}>{carpeta === "INBOX" ? m.de : m.para}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">{fecha(m.fecha)}</span>
                  </div>
                  <p className={`text-xs truncate ${m.leido ? "text-gray-500" : "text-gray-800 font-medium"}`}>{m.asunto}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <main>
        {redactar ? (
          <Redactar key={JSON.stringify(redactar)} clave={clave} casillas={casillas || []} casillaId={casillaId} setCasillaId={setCasillaId} inicial={redactar} onCerrar={() => setRedactar(null)} onEnviado={() => { setRedactar(null); cargar() }} />
        ) : abierto ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-gray-900 text-lg">{abierto.asunto}</h2>
                {!abierto.cargando && !abierto.error && (
                  <button onClick={() => responder(abierto)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 shrink-0">
                    <Reply size={13} /> Responder
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">De: {abierto.de}</p>
              {abierto.para && <p className="text-xs text-gray-500">Para: {abierto.para}{abierto.cc ? ` · CC: ${abierto.cc}` : ""}</p>}
              <p className="text-[11px] text-gray-400">{fecha(abierto.fecha)}</p>
              {abierto.adjuntos?.length > 0 && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 flex-wrap"><Paperclip size={12} /> {abierto.adjuntos.map(a => a.nombre).join(", ")}</p>
              )}
            </div>
            {abierto.cargando ? <p className="p-5 text-sm text-gray-400">Cargando...</p> : abierto.error ? <p className="p-5 text-sm text-red-600">{abierto.error}</p> : abierto.html ? (
              // El HTML del correo va aislado: sin scripts ni acceso a la pagina del admin
              <iframe title="Correo" sandbox="" srcDoc={abierto.html} className="w-full h-[65vh] rounded-b-2xl" />
            ) : (
              <pre className="p-5 text-sm text-gray-800 whitespace-pre-wrap font-sans">{abierto.texto}</pre>
            )}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-sm text-gray-400">
            Selecciona un correo o redacta uno nuevo.
          </div>
        )}
      </main>
    </div>
  )
}
