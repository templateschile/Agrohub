import { useCallback, useEffect, useState } from "react"
import { RefreshCw, Eye, MousePointerClick, ChevronDown, ChevronUp, Info } from "lucide-react"
import { adminApi } from "../../lib/adminApi"

const fecha = iso => iso ? new Date(iso).toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""

// Nombre legible del programa que abrio el correo, a partir del user-agent
function programa(ua = "") {
  if (/GoogleImageProxy|ggpht/i.test(ua)) return "Gmail"
  if (/YahooMailProxy/i.test(ua)) return "Yahoo Mail"
  if (/Outlook|Microsoft Office|ms-office/i.test(ua)) return "Outlook"
  if (/iPhone|iPad/i.test(ua)) return "iPhone / iPad"
  if (/Macintosh/i.test(ua)) return "Mac"
  if (/Android/i.test(ua)) return "Android"
  if (/Windows/i.test(ua)) return "Windows"
  return ua ? "Otro" : "Desconocido"
}

function Fila({ e }) {
  const [abierto, setAbierto] = useState(false)
  const n = e.aperturas.length
  const ultima = e.aperturas[n - 1]
  return (
    <li className="bg-white border border-gray-100 rounded-xl">
      <button onClick={() => setAbierto(v => !v)} className="w-full text-left p-3 grid grid-cols-1 md:grid-cols-[1fr_1.4fr_auto] gap-2 items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{e.para}</p>
          <p className="text-[11px] text-gray-400 truncate">desde {e.casilla} · {fecha(e.enviado)}</p>
        </div>
        <p className="text-sm text-gray-700 truncate">{e.asunto}</p>
        <div className="flex items-center gap-2 justify-start md:justify-end">
          {n > 0
            ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-agro-green-50 text-agro-green-700"><Eye size={12} /> Abierto {n}× · {fecha(ultima.t)}</span>
            : <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">No abierto</span>}
          {e.clics.length > 0 && <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-agro-blue-50 text-agro-blue-800"><MousePointerClick size={12} /> {e.clics.length} clic{e.clics.length > 1 ? "s" : ""}</span>}
          {abierto ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>
      {abierto && (
        <div className="border-t border-gray-100 p-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Aperturas</p>
            {n === 0 ? <p className="text-gray-400">Aún no lo abren (o su programa bloquea imágenes).</p> : (
              <ul className="flex flex-col gap-0.5">{[...e.aperturas].reverse().map((a, i) => <li key={i} className="text-gray-600">{fecha(a.t)} · {programa(a.ua)}</li>)}</ul>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Clics en links</p>
            {e.clics.length === 0 ? <p className="text-gray-400">Sin clics.</p> : (
              <ul className="flex flex-col gap-0.5">{[...e.clics].reverse().map((c, i) => <li key={i} className="text-gray-600 truncate">{fecha(c.t)} · <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-agro-green-700 underline">{c.url}</a></li>)}</ul>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

export default function Seguimiento({ clave }) {
  const [envios, setEnvios] = useState(null)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [filtro, setFiltro] = useState("todos")

  const cargar = useCallback(async () => {
    setCargando(true); setError("")
    try { setEnvios((await adminApi(clave, "correo", { query: { seguimiento: 1 } })).envios) }
    catch (e) { setError(e.message); setEnvios([]) }
    setCargando(false)
  }, [clave])
  useEffect(() => { cargar() }, [cargar])

  const visibles = (envios || []).filter(e => filtro === "todos" || (filtro === "abiertos" ? e.aperturas.length : !e.aperturas.length))
  const abiertos = (envios || []).filter(e => e.aperturas.length).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-bold text-gray-900">Seguimiento de correos</h2>
        {envios && <span className="text-xs text-gray-500">{abiertos} de {envios.length} abiertos</span>}
        <div className="flex-1" />
        <select value={filtro} onChange={e => setFiltro(e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white">
          <option value="todos">Todos</option>
          <option value="abiertos">Abiertos</option>
          <option value="no">No abiertos</option>
        </select>
        <button onClick={cargar} className="p-2 text-gray-500 hover:text-gray-800" title="Actualizar"><RefreshCw size={15} className={cargando ? "animate-spin" : ""} /></button>
      </div>
      <p className="text-[11px] text-gray-400 flex items-start gap-1"><Info size={12} className="shrink-0 mt-0.5" />
        Una apertura se registra cuando el programa del destinatario carga las imágenes. Apple Mail puede marcar “abierto” aunque no lo lean, y Outlook u otros que bloquean imágenes pueden no registrarla. La copia oculta y tus propias vistas no cuentan.
      </p>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}
      {!envios ? <p className="text-sm text-gray-400">Cargando...</p> : visibles.length === 0 ? (
        <p className="text-sm text-gray-400">Aún no hay correos con seguimiento. Los que envíes desde Correo con “Rastrear” activado aparecerán aquí.</p>
      ) : (
        <ul className="flex flex-col gap-2">{visibles.map(e => <Fila key={e.id} e={e} />)}</ul>
      )}
    </div>
  )
}
