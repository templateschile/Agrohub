import { useEffect, useId, useRef, useState } from "react"
import { X, Leaf, Send, CheckCircle } from "lucide-react"
import { enviarLead, CORREO_CONTACTO } from "../lib/lead"
import { enfocables, focoAtrapado } from "../lib/foco"
import { useIdioma, textosDe } from "../i18n"

// Formatos que comparten la Tienda y el pedido. Los precios de ejemplo van en dólares (USD), una moneda de
// referencia común en la región, para no privilegiar la de un país.
export const nombrePais = (codigo, locale) => {
  try { return new Intl.DisplayNames([locale], { type: "region" }).of(codigo) || codigo } catch { return codigo }
}
export const formatoUSD = (locale) => {
  const f = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" })
  return (n) => f.format(n)
}
export const claveProducto = (p) => `${p.clave}__${p.variedad}`

const inputCls = "w-full min-h-[44px] px-3 border border-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-500"

// Pedido a un productor de ejemplo de la Tienda. Lo que se envía al API (resumen) va en español, con el
// idioma del sitio, para que el equipo lo lea igual venga de donde venga.
export default function PedidoModal({ productor, onClose }) {
  const { t, locale, idioma } = useIdioma()
  const usd = formatoUSD(locale)
  const n = (x) => Number(x).toLocaleString(locale)
  const disponibles = productor.productos.filter(p => p.disponible)
  const [qtys, setQtys] = useState(() => Object.fromEntries(disponibles.map(p => [claveProducto(p), 0])))
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(false)

  const setQty = (key, val) => setQtys(prev => ({ ...prev, [key]: Math.max(0, parseInt(val, 10) || 0) }))

  const problema = p => {
    const q = qtys[claveProducto(p)] || 0
    if (q > 0 && q < p.minPedidoKg) return t("mod.pedido.minimo", { n: n(p.minPedidoKg) })
    if (q > p.cupoKg) return t("mod.pedido.maximo", { n: n(p.cupoKg) })
    return null
  }
  const pedido = disponibles.filter(p => (qtys[claveProducto(p)] || 0) > 0)
  const total = pedido.reduce((a, p) => a + qtys[claveProducto(p)] * p.precioKg, 0)
  const valido = nombre.trim() && telefono.trim() && pedido.length > 0 && !pedido.some(problema)

  // Diálogo accesible (igual que ContactModal): foco adentro al abrir, Tab y Shift+Tab no salen,
  // Escape cierra y el foco vuelve al botón que lo abrió
  const tituloId = useId()
  const ids = useId()
  const caja = useRef(null)
  const botonListo = useRef(null)
  const cerrar = useRef(onClose)
  cerrar.current = onClose
  useEffect(() => {
    const previo = document.activeElement
    caja.current?.querySelector("input")?.focus()
    const tecla = e => {
      if (e.key === "Escape") return cerrar.current()
      if (e.key !== "Tab") return
      const destino = focoAtrapado(enfocables(caja.current), document.activeElement, e.shiftKey)
      if (destino) { e.preventDefault(); destino.focus() }
    }
    document.addEventListener("keydown", tecla)
    return () => { document.removeEventListener("keydown", tecla); if (previo?.isConnected) previo.focus?.() }
  }, [])
  useEffect(() => { if (enviado) botonListo.current?.focus() }, [enviado])

  const handleEnviar = async () => {
    if (!valido) return
    setEnviando(true)
    setError(false)
    // Resumen para el equipo, siempre en español
    const es = textosDe("es")
    const usdEs = formatoUSD("es")
    const resumen = [
      `Proveedor (ejemplo del sitio): ${productor.nombre} (${productor.zona}, ${nombrePais(productor.pais, "es")})`,
      ...pedido.map(p => {
        const qty = qtys[claveProducto(p)]
        return `${es(`mod.prod.${p.clave}`)} (${p.variedad}): ${qty.toLocaleString("es")} kg x ${usdEs(p.precioKg)}/kg = ${usdEs(qty * p.precioKg)}`
      }),
      `TOTAL: ${usdEs(total)}`,
      `Idioma del sitio: ${idioma}`,
    ]
    const ok = await enviarLead({ tipo: "pedido", contacto: { nombre, telefono, email }, resumen, idioma })
    setEnviando(false)
    if (ok) setEnviado(true)
    else setError(true)
  }

  // z-[400] (--z-modal): sobre el menú fijo, que está en --z-sticky-nav (300)
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div ref={caja} role="dialog" aria-modal="true" aria-labelledby={tituloId} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Cabecera */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-3 flex items-center justify-between gap-3 z-10">
          <div className="min-w-0">
            <h2 id={tituloId} className="font-bold text-gray-900">{productor.nombre}</h2>
            <p className="text-xs text-gray-600">
              {productor.zona} · {nombrePais(productor.pais, locale)} · {t("mod.pedido.ejemplo")}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("mod.pedido.cerrar")}
            className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {enviado ? (
          <div className="text-center py-12 px-6" role="status">
            <CheckCircle size={52} className="text-agro-green-500 mx-auto mb-4" aria-hidden="true" />
            <h3 className="font-bold text-gray-900 text-lg mb-2">{t("mod.pedido.enviado.titulo")}</h3>
            <p className="text-gray-600 text-sm">{t("mod.pedido.enviado.texto")}</p>
            <button ref={botonListo} type="button" onClick={onClose} className="mt-6 min-h-[44px] bg-agro-green-600 text-white font-semibold px-8 rounded-full text-sm hover:bg-agro-green-700 transition-colors">
              {t("mod.pedido.cerrar")}
            </button>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-5">

            {/* Productos */}
            <fieldset>
              <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{t("mod.pedido.selecciona")}</legend>
              <div className="flex flex-col gap-3">
                {disponibles.map((p, i) => {
                  const key = claveProducto(p)
                  const qty = qtys[key] || 0
                  const producto = t(`mod.prod.${p.clave}`)
                  const idCampo = `${ids}-q${i}`
                  const aviso = problema(p)
                  return (
                    <div key={key} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Leaf size={13} className="text-agro-green-600 shrink-0" aria-hidden="true" />
                          <span className="font-semibold text-gray-900 text-sm">{producto}</span>
                          <span className="text-xs text-gray-600">{p.variedad}</span>
                        </div>
                        <span className="text-[11px] bg-agro-green-50 text-agro-green-800 border border-agro-green-100 px-2 py-0.5 rounded-full shrink-0">
                          {t("mod.pedido.disponible", { n: n(p.cupoKg) })}
                        </span>
                      </div>
                      <label htmlFor={idCampo} className="sr-only">{t("mod.pedido.cantidad", { producto })}</label>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setQty(key, qty - p.minPedidoKg)} aria-label={t("mod.pedido.menos", { n: n(p.minPedidoKg) })}
                          className="w-11 h-11 shrink-0 bg-white border border-gray-300 rounded-lg font-bold text-gray-800 hover:bg-gray-100">−</button>
                        <input
                          id={idCampo}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={p.cupoKg}
                          value={qty || ""}
                          placeholder={t("mod.pedido.min", { n: n(p.minPedidoKg) })}
                          onChange={e => setQty(key, e.target.value)}
                          aria-invalid={aviso ? true : undefined}
                          aria-describedby={aviso ? `${idCampo}-aviso` : undefined}
                          className="flex-1 min-w-0 min-h-[44px] text-center border border-gray-400 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-500"
                        />
                        <button type="button" onClick={() => setQty(key, Math.min(p.cupoKg, Math.max(qty, 0) + p.minPedidoKg))} aria-label={t("mod.pedido.mas", { n: n(p.minPedidoKg) })}
                          className="w-11 h-11 shrink-0 bg-white border border-gray-300 rounded-lg font-bold text-gray-800 hover:bg-gray-100">+</button>
                        <span className="text-xs text-gray-600 w-6" aria-hidden="true">kg</span>
                      </div>
                      {aviso && <p id={`${idCampo}-aviso`} className="text-xs text-red-700 mt-1.5">{aviso}</p>}
                    </div>
                  )
                })}
              </div>
            </fieldset>

            {/* Resumen */}
            {pedido.length > 0 && (
              <div className="bg-agro-green-50 border border-agro-green-100 rounded-xl p-4" aria-live="polite">
                <h3 className="text-xs font-semibold text-agro-green-800 mb-2">{t("mod.pedido.tuPedido")}</h3>
                <ul>
                  {pedido.map(p => (
                    <li key={claveProducto(p)} className="flex justify-between gap-3 text-sm text-agro-green-900 mb-1">
                      <span>{t(`mod.prod.${p.clave}`)} ({p.variedad})</span>
                      <span className="font-bold">{n(qtys[claveProducto(p)])} kg</span>
                    </li>
                  ))}
                </ul>
                <p className="flex justify-between gap-3 text-sm text-agro-green-900 border-t border-agro-green-100 pt-2 mt-2">
                  <span>{t("mod.pedido.total")}</span>
                  <span className="font-bold">{usd(total)}</span>
                </p>
              </div>
            )}

            {/* Datos de contacto */}
            <fieldset className="flex flex-col gap-3">
              <legend className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{t("mod.pedido.tusDatos")}</legend>
              <div>
                <label htmlFor={`${ids}-nombre`} className="block text-sm font-medium text-gray-800 mb-1">
                  {t("mod.pedido.nombre")} <span aria-hidden="true" className="text-red-700">*</span>
                </label>
                <input id={`${ids}-nombre`} value={nombre} onChange={e => setNombre(e.target.value)} required autoComplete="name" className={inputCls} />
              </div>
              <div>
                <label htmlFor={`${ids}-telefono`} className="block text-sm font-medium text-gray-800 mb-1">
                  {t("mod.pedido.telefono")} <span aria-hidden="true" className="text-red-700">*</span>
                </label>
                <input id={`${ids}-telefono`} value={telefono} onChange={e => setTelefono(e.target.value)} required type="tel" autoComplete="tel" className={inputCls} />
              </div>
              <div>
                <label htmlFor={`${ids}-email`} className="block text-sm font-medium text-gray-800 mb-1">{t("mod.pedido.email")}</label>
                <input id={`${ids}-email`} value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" className={inputCls} />
              </div>
              <p className="text-xs text-gray-600"><span aria-hidden="true" className="text-red-700">*</span> {t("mod.pedido.obligatorio")}</p>
            </fieldset>

            {error && (
              <p role="alert" className="text-xs text-red-700">
                {t("mod.pedido.error")}{" "}
                <a href={`mailto:${CORREO_CONTACTO}`} className="underline font-semibold">{CORREO_CONTACTO}</a>.
              </p>
            )}
            <button type="button" onClick={handleEnviar} disabled={!valido || enviando}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors">
              <Send size={15} aria-hidden="true" />{enviando ? t("mod.pedido.enviando") : t("mod.pedido.enviar")}
            </button>
            <p className="text-xs text-gray-600 text-center">{t("mod.pedido.nota")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
