import { useState } from "react"
import { X, Leaf, User, Phone, Mail, MessageCircle, CheckCircle } from "lucide-react"
import { notificar } from "./ContactModal"

const clp = n => "$" + Number(n).toLocaleString("es-CL")

export default function PedidoModal({ productor, onClose }) {
  const disponibles = productor.productos.filter(p => p.disponible)
  const initQty = Object.fromEntries(disponibles.map(p => [p.nombre + "__" + p.variedad, 0]))
  const [qtys, setQtys] = useState(initQty)
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const setQty = (key, val) => setQtys(prev => ({ ...prev, [key]: Math.max(0, parseInt(val) || 0) }))

  const pedido = disponibles.filter(p => (qtys[p.nombre + "__" + p.variedad] || 0) > 0)
  const total = pedido.reduce((a, p) => a + (qtys[p.nombre + "__" + p.variedad] || 0) * p.precioKg, 0)
  const valido = nombre.trim() && telefono.trim() && pedido.length > 0

  const handleEnviar = async () => {
    if (!valido) return
    setEnviando(true)

    // Filas tabla admin (CON precios)
    const filas = pedido.map(p => {
      const qty = qtys[p.nombre + "__" + p.variedad]
      return `<tr><td style="padding:6px 10px;border:1px solid #e5e7eb">${p.nombre} (${p.variedad})</td><td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:center">${qty.toLocaleString("es-CL")} kg</td><td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:right">${clp(p.precioKg)}/kg</td><td style="padding:6px 10px;border:1px solid #e5e7eb;text-align:right;font-weight:bold">${clp(qty * p.precioKg)}</td></tr>`
    }).join("")

    const html = `<h2 style="color:#166534">Pedido desde Tienda AgroHub</h2><p><b>Comprador:</b> ${nombre}</p><p><b>WA:</b> ${telefono}</p>${email ? `<p><b>Email:</b> ${email}</p>` : ""}<p><b>Proveedor:</b> ${productor.nombre} — ${productor.comuna}, ${productor.region}</p><table style="border-collapse:collapse;width:100%;margin-top:10px"><tr style="background:#166534;color:white"><th style="padding:8px">Producto</th><th style="padding:8px">Cantidad</th><th style="padding:8px">Precio/kg</th><th style="padding:8px">Subtotal</th></tr>${filas}<tr style="background:#f0fdf4"><td colspan="3" style="padding:8px;font-weight:bold">TOTAL</td><td style="padding:8px;font-weight:bold;color:#166534">${clp(total)}</td></tr></table>`

    const lineasTg = pedido.map(p => {
      const qty = qtys[p.nombre + "__" + p.variedad]
      return `  - ${p.nombre} (${p.variedad}): ${qty.toLocaleString("es-CL")} kg = ${clp(qty * p.precioKg)}`
    }).join("\n")
    const tg = `Pedido AgroHub\nComprador: ${nombre}\nWA: ${telefono}${email ? `\nEmail: ${email}` : ""}\nProveedor: ${productor.nombre} (${productor.comuna})\n\n${lineasTg}\n\nTOTAL: ${clp(total)}`

    await notificar(`Pedido AgroHub - ${nombre} a ${productor.nombre}`, html, tg)

    // WA al proveedor SIN precios
    const lineasWA = pedido.map(p => `- ${p.nombre} (${p.variedad}): ${qtys[p.nombre + "__" + p.variedad].toLocaleString("es-CL")} kg`).join("\n")
        const msgWA = encodeURIComponent(`Hola! Te contacto desde AgroHub.\n\nSoy ${nombre} y quisiera hacer el siguiente pedido a ${productor.nombre} (${productor.comuna}):\n\n${lineasWA}\n\nMi contacto: ${telefono}${email ? ` / ${email}` : ""}\n\n¿Podemos coordinar?`)
    window.open(`https://wa.me/56987561075?text=${msgWA}`, "_blank")

    setEnviando(false)
    setEnviado(true)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="font-bold text-gray-900">{productor.nombre}</h3>
            <p className="text-xs text-gray-400">{productor.comuna} · {productor.region}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
        </div>

        {enviado ? (
          <div className="text-center py-12 px-6">
            <CheckCircle size={52} className="text-agro-green-500 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 text-lg mb-2">Pedido enviado</h3>
            <p className="text-gray-500 text-sm">Se abrio WhatsApp con el proveedor. AgroHub tambien fue notificado.</p>
            <button onClick={onClose} className="mt-6 bg-agro-green-600 text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-agro-green-700 transition-colors">Cerrar</button>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-5">

            {/* Productos */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Selecciona cantidad por producto</p>
              <div className="flex flex-col gap-3">
                {disponibles.map(p => {
                  const key = p.nombre + "__" + p.variedad
                  const qty = qtys[key] || 0
                  return (
                    <div key={key} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Leaf size={13} className="text-agro-green-600" />
                          <span className="font-semibold text-gray-900 text-sm">{p.nombre}</span>
                          <span className="text-xs text-gray-400">{p.variedad}</span>
                        </div>
                        <span className="text-[10px] bg-agro-green-50 text-agro-green-700 border border-agro-green-100 px-2 py-0.5 rounded-full">
                          Stock: {p.cupoKg.toLocaleString("es-CL")} kg
                        </span>
                      </div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden border border-gray-200 mb-3">
                        <div className="h-full bg-agro-green-400 rounded-full" style={{ width: "65%" }} />
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setQty(key, qty - p.minPedidoKg)} className="w-8 h-8 bg-white border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-100">-</button>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={qty || ""}
                            placeholder={`Min. ${p.minPedidoKg} kg`}
                            onChange={e => setQty(key, e.target.value)}
                            className="w-full text-center border border-gray-200 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-400"
                          />
                        </div>
                        <button onClick={() => setQty(key, qty + p.minPedidoKg)} className="w-8 h-8 bg-white border border-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-100">+</button>
                        <span className="text-xs text-gray-400 w-6">kg</span>
                      </div>
                      {qty > 0 && qty < p.minPedidoKg && (
                        <p className="text-[10px] text-red-500 mt-1">Minimo: {p.minPedidoKg} kg</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

                        {/* Resumen */}
            {pedido.length > 0 && (
              <div className="bg-agro-green-50 border border-agro-green-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-agro-green-800 mb-2">Tu pedido</p>
                {pedido.map(p => (
                  <div key={p.nombre+p.variedad} className="flex justify-between text-sm text-agro-green-900 mb-1">
                    <span>{p.nombre} ({p.variedad})</span>
                    <span className="font-bold">{qtys[p.nombre+"__"+p.variedad].toLocaleString("es-CL")} kg</span>
                  </div>
                ))}
              </div>
            )}

            {/* Datos contacto */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tus datos</p>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo *"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="WhatsApp o teléfono *"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (opcional)" type="email"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
              </div>
            </div>

            <button onClick={handleEnviar} disabled={!valido || enviando}
              className="w-full flex items-center justify-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              <MessageCircle size={15} />{enviando ? "Enviando..." : "Enviar pedido y abrir WhatsApp"}
            </button>
            <p className="text-[10px] text-gray-400 text-center">Se abrirá WhatsApp directo con el proveedor.</p>
          </div>
        )}
      </div>
    </div>
  )
}
