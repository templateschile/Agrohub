import { useEffect, useId, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Lightbulb, Send, CheckCircle, ArrowRight, Plus, Trash2, Server } from "lucide-react"
import { enviarLead, emailValido, CORREO_CONTACTO } from "../lib/lead"
import { PRODUCTOS_AGRO } from "../lib/productosAgro"
import MultiSelectBusqueda from "../components/MultiSelectBusqueda"
import AgendarReunion from "../components/AgendarReunion"
import { useIdioma, Enlace } from "../i18n"
import OPCIONES from "../i18n/datos/evaluacion.js"
import {
  OTROS, MODELOS_PRODUCTIVOS, APOYOS_PRODUCTORES, TIPOS_RIEGO, REGISTROS, SI_NO,
  FORMAS_FERTILIZACION, FORMAS_APLICACION, ANALISIS,
  TOMATE_TIPOS, TOMATE_ESTABLECIMIENTO, TOMATE_COSECHA, TOMATE_PROBLEMAS, TOMATE_RECEPCION,
  MARCAS_SENSORES, VARIABLES_SENSORES, VER_DATA, QUIEN_REVISA, CONECTIVIDAD,
  PRIORIDADES, MEDIR, COMO_QUIERE_VER, PLAZOS, INTERES, MODULOS, MODOS_IA, FUENTES_EN_PANTALLA, LICENCIAS, TRASPASO_TI, USUARIOS, ETAPAS,
  estadoInicial, nuevaZona, cultivaTomate, tomateIndustrial, conAsociados, haAsociadas, requiereTraspaso, respondido,
  totalHaZonas, totalAgricultoresZonas, resumenRespuestas, avance, insights, cultivosEnOrden, marcasEnOrden,
} from "../lib/evaluacion"

// Los valores de las opciones se guardan y se envían en español (src/lib/evaluacion.js); aquí solo se
// traduce lo que se ve: op() para las opciones (src/i18n/datos/evaluacion.js) y t() para el resto.
// Los insumos los traduce MultiSelectBusqueda (lib/productosAgro.js).
const CULTIVOS_VISIBLES = 8
const MARCAS_VISIBLES = 6
const N_PASOS = 4
const inputBase = "w-full min-h-[44px] border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"
const inputCls = `${inputBase} border-gray-500`
const ayudaDe = id => `${id}-ayuda`

function useEval() {
  const idioma = useIdioma()
  return useMemo(() => {
    const mapa = OPCIONES[idioma.idioma] || {}
    const op = s => mapa[s] ?? OPCIONES.es[s] ?? s
    const fmt = n => respondido(n) ? Number(n).toLocaleString(idioma.locale) : ""
    return { ...idioma, op, fmt }
  }, [idioma])
}

// Número con botones − y +, agrupados bajo la etiqueta visible del campo (id `${id}-etiqueta`).
// Vacío hasta que la persona lo escribe o usa + / −.
function Contador({ id, val, set, min = 0, paso = 1, describedBy }) {
  const { t, fmt } = useEval()
  const vacio = !respondido(val)
  const boton = "w-11 h-11 shrink-0 bg-gray-100 rounded-lg font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
  return (
    <div role="group" aria-labelledby={`${id}-etiqueta`} className="flex items-center gap-2">
      <button type="button" onClick={() => set(Math.max(min, val - paso))} disabled={vacio || val <= min}
        aria-label={t("eval.contador.restar", { paso: fmt(paso) })} className={boton}><span aria-hidden="true">−</span></button>
      <input id={id} type="number" inputMode="numeric" min={min} value={vacio ? "" : val} aria-describedby={describedBy}
        onChange={e => set(e.target.value === "" ? null : Math.max(min, parseInt(e.target.value, 10) || 0))}
        className="w-28 min-h-[44px] text-center border border-gray-500 rounded-lg py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
      <button type="button" onClick={() => set(vacio ? Math.max(min, paso) : val + paso)}
        aria-label={t("eval.contador.sumar", { paso: fmt(paso) })} className={boton}><span aria-hidden="true">+</span></button>
    </div>
  )
}

// Casilla de selección múltiple (botón que se alterna)
function Chip({ activo, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={activo}
      className={`flex items-center gap-2 min-h-[44px] rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${activo ? "bg-agro-green-50 border-agro-green-400 text-agro-green-800" : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-400"}`}>
      <span aria-hidden="true" className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-500 bg-white"}`}>
        {activo && <Check size={9} className="text-white" />}
      </span>
      <span className="flex-1">{children}</span>
    </button>
  )
}

function CampoOtros({ valor, set, placeholder }) {
  const { t } = useEval()
  const id = useId()
  return (
    <div className="mt-2">
      <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1">{t("eval.otros.etiqueta")}</label>
      <input id={id} type="text" value={valor || ""} onChange={e => set(e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  )
}

// Selección múltiple; al marcar "Otros" aparece un campo de texto
function Chips({ opciones, valor, onToggle, otro, setOtro, cols = "grid-cols-1 sm:grid-cols-2", phOtro }) {
  const { op } = useEval()
  return (
    <>
      <div className={`grid ${cols} gap-2`}>
        {opciones.map(x => <Chip key={x} activo={valor.includes(x)} onClick={() => onToggle(x)}>{op(x)}</Chip>)}
      </div>
      {valor.includes(OTROS) && <CampoOtros valor={otro} set={setOtro} placeholder={phOtro} />}
    </>
  )
}

// Selección única en pastillas (se puede desmarcar); la opción "otro" abre un campo de texto
function Opciones({ opciones, valor, set, otro, setOtro }) {
  const { op } = useEval()
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {opciones.map(o => {
          const id = o.id ?? o
          const activo = valor === id
          return (
            <button key={id} type="button" onClick={() => set(activo ? "" : id)} aria-pressed={activo}
              className={`min-h-[44px] text-xs px-4 py-2 rounded-full border font-semibold transition-all ${activo ? "bg-agro-green-600 border-agro-green-600 text-white" : "bg-white border-gray-300 text-gray-700 hover:border-agro-green-400"}`}>
              {op(o.label ?? o)}
            </button>
          )
        })}
      </div>
      {valor === "otro" && setOtro && <CampoOtros valor={otro} set={setOtro} />}
    </>
  )
}

// Puntaje de 1 a 5 (volver a pulsar el mismo número lo borra)
function Estrellas({ valor = 0, set, etiquetaId, etiqueta }) {
  const { t } = useEval()
  return (
    <div role="group" aria-labelledby={etiquetaId} aria-label={etiquetaId ? undefined : etiqueta} className="flex gap-1 shrink-0">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => set(valor === n ? 0 : n)} aria-pressed={valor === n} aria-label={t("eval.puntaje.n", { n })}
          className={`w-11 h-11 rounded-lg text-xs font-bold border transition-all ${n <= valor ? "bg-agro-green-600 border-agro-green-600 text-white" : "bg-white border-gray-300 text-gray-600 hover:border-agro-green-400"}`}>
          {n}
        </button>
      ))}
    </div>
  )
}

// Lista con puntaje 1-5 por opción + fila "Otro tema" con texto y puntaje
function Puntajes({ opciones, valores, set, otro, setOtro, puntajeOtro, setPuntajeOtro }) {
  const { t, op } = useEval()
  const base = useId()
  return (
    <div className="flex flex-col divide-y divide-gray-100 border border-gray-200 rounded-xl">
      {opciones.map((o, i) => (
        <div key={o} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2">
          <span id={`${base}-${i}`} className={`text-sm ${valores[o] ? "text-gray-900 font-medium" : "text-gray-700"}`}>{op(o)}</span>
          <Estrellas valor={valores[o]} set={v => set({ ...valores, [o]: v })} etiquetaId={`${base}-${i}`} />
        </div>
      ))}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-3 py-2">
        <div className="flex-1">
          <label htmlFor={`${base}-otro`} className="block text-sm text-gray-700 mb-1">{t("eval.puntaje.otro")}</label>
          <input id={`${base}-otro`} type="text" value={otro || ""} onChange={e => setOtro(e.target.value)} placeholder={t("eval.puntaje.otroPh")} className={inputCls} />
        </div>
        <Estrellas valor={puntajeOtro} set={setPuntajeOtro} etiqueta={t("eval.puntaje.otroGrupo")} />
      </div>
    </div>
  )
}

// Tarjeta de selección única con descripción (se puede desmarcar)
function Radio({ activo, onClick, titulo, desc, badge }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={activo}
      className={`flex items-start gap-3 min-h-[44px] rounded-xl border px-4 py-3 text-left transition-all ${activo ? "bg-agro-green-50 border-agro-green-400" : "bg-gray-50 border-gray-200 hover:border-gray-400"}`}>
      <span aria-hidden="true" className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${activo ? "bg-agro-green-600 border-agro-green-600" : "border-gray-500 bg-white"}`}>
        {activo && <span className="w-2 h-2 bg-white rounded-full" />}
      </span>
      <span className="block">
        <span className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{titulo}</span>
          {badge && <span className="text-xs bg-agro-earth-50 text-agro-earth-700 px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        </span>
        {desc && <span className="block text-xs text-gray-600 mt-0.5 leading-relaxed">{desc}</span>}
      </span>
    </button>
  )
}

function Bloque({ id, titulo, ayuda, children }) {
  const propio = useId()
  const idT = id || propio
  return (
    <section aria-labelledby={idT} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h2 id={idT} className="font-bold text-gray-900 text-base">{titulo}</h2>
      {ayuda ? <p className="text-xs text-gray-600 mt-0.5 mb-4">{ayuda}</p> : <div className="mb-4" />}
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}

// Pregunta con etiqueta visible. Con `campo` (id de un solo control) la etiqueta es un <label htmlFor>;
// sin `campo` las opciones van en un grupo nombrado por la etiqueta. La ayuda queda siempre a la vista
// y se asocia con aria-describedby (con `campo`, el control usa ayudaDe(campo)).
function Pregunta({ label, ayuda, campo, children }) {
  const base = useId()
  const idE = campo ? `${campo}-etiqueta` : `${base}e`
  const idA = campo ? ayudaDe(campo) : `${base}a`
  return (
    <div>
      {campo
        ? <label id={idE} htmlFor={campo} className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
        : <p id={idE} className="text-xs font-semibold text-gray-700 mb-1">{label}</p>}
      {ayuda ? <p id={idA} className="text-xs text-gray-600 mb-2">{ayuda}</p> : <div className="mb-1" />}
      {campo ? children : <div role="group" aria-labelledby={idE} aria-describedby={ayuda ? idA : undefined}>{children}</div>}
    </div>
  )
}

function Zonas({ zonas, set }) {
  const { t, fmt } = useEval()
  const base = useId()
  const cambiar = (i, k, v) => set(zonas.map((z, j) => j === i ? { ...z, [k]: v } : z))
  const numero = v => v === "" ? null : Math.max(0, parseInt(v, 10) || 0)
  const agregar = () => {
    set([...zonas, nuevaZona()])
    requestAnimationFrame(() => document.getElementById(`${base}-z${zonas.length}`)?.focus())
  }
  const quitar = i => {
    set(zonas.filter((_, j) => j !== i))
    requestAnimationFrame(() => document.getElementById(`${base}-agregar`)?.focus())
  }
  const ha = totalHaZonas({ zonas }), agricultores = totalAgricultoresZonas({ zonas })
  return (
    <div className="flex flex-col gap-2">
      <div aria-hidden="true" className="hidden sm:grid grid-cols-[1fr_130px_130px_44px] gap-2 text-xs font-semibold text-gray-600 px-1">
        <span>{t("eval.zona.nombre")}</span><span>{t("eval.zona.hectareas")}</span><span>{t("eval.zona.agricultores")}</span><span />
      </div>
      {zonas.map((z, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_44px] sm:grid-cols-[1fr_130px_130px_44px] gap-2 items-center">
          <input id={`${base}-z${i}`} value={z.nombre} onChange={e => cambiar(i, "nombre", e.target.value)}
            aria-label={t("eval.zona.nombreN", { n: i + 1 })} placeholder={t("eval.zona.ph")} className={`${inputCls} col-span-3 sm:col-span-1`} />
          <input type="number" inputMode="numeric" min={0} value={z.hectareas ?? ""} onChange={e => cambiar(i, "hectareas", numero(e.target.value))}
            aria-label={t("eval.zona.hectareasN", { n: i + 1 })} placeholder="ha" className={inputCls} />
          <input type="number" inputMode="numeric" min={0} value={z.agricultores ?? ""} onChange={e => cambiar(i, "agricultores", numero(e.target.value))}
            aria-label={t("eval.zona.agricultoresN", { n: i + 1 })} placeholder={t("eval.zona.agricultores")} className={inputCls} />
          <button type="button" onClick={() => quitar(i)} disabled={zonas.length === 1} aria-label={t("eval.zona.quitar", { n: i + 1 })}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed">
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button id={`${base}-agregar`} type="button" onClick={agregar}
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-agro-green-700 hover:underline">
          <Plus size={14} aria-hidden="true" /> {t("eval.zona.agregar")}
        </button>
        {(ha > 0 || agricultores > 0) && (
          <span className="text-xs text-gray-600">{t("eval.zona.total", { ha: fmt(ha), agricultores: fmt(agricultores) })}</span>
        )}
      </div>
    </div>
  )
}

export default function Evaluacion() {
  const { idioma, locale, t, op, fmt } = useEval()
  const [paso, setPaso] = useState(0)
  const [r, setR] = useState(estadoInicial)
  const [contacto, setContacto] = useState({ nombre: "", empresa: "", cargo: "", email: "", telefono: "", mensaje: "", website: "" })
  const [verMarcas, setVerMarcas] = useState(false)
  const [verCultivos, setVerCultivos] = useState(false)
  const [estado, setEstado] = useState("editando")
  const [revisar, setRevisar] = useState(false)
  const botonesPaso = useRef([])
  const tituloOk = useRef(null)

  const PASOS = [1, 2, 3, 4].map(n => ({ titulo: t(`eval.paso.${n}.titulo`), desc: t(`eval.paso.${n}.desc`) }))
  const cultivos = useMemo(() => cultivosEnOrden(op, locale), [op, locale])
  const marcas = useMemo(() => marcasEnOrden(locale), [locale])

  const set = k => v => setR(prev => ({ ...prev, [k]: v }))
  const toggle = k => item => setR(prev => ({ ...prev, [k]: prev[k].includes(item) ? prev[k].filter(x => x !== item) : [...prev[k], item] }))
  const setOtro = k => v => setR(prev => ({ ...prev, otros: { ...prev.otros, [k]: v } }))
  const setPuntajeOtro = k => v => setR(prev => ({ ...prev, puntajeOtros: { ...prev.puntajeOtros, [k]: v } }))
  const setModulo = (id, v) => setR(prev => ({ ...prev, modulos: { ...prev.modulos, [id]: v || undefined } }))
  const setC = k => e => setContacto(prev => ({ ...prev, [k]: e.target.value }))
  // Atajos para preguntas con "Otros"
  const chips = (k, opciones, cols, phOtro) => <Chips opciones={opciones} valor={r[k]} onToggle={toggle(k)} otro={r.otros[k]} setOtro={setOtro(k)} cols={cols} phOtro={phOtro} />
  const opciones = (k, lista) => <Opciones opciones={lista} valor={r[k]} set={set(k)} otro={r.otros[k]} setOtro={setOtro(k)} />
  const puntaje = (k, lista) => <Puntajes opciones={lista} valores={r[k]} set={set(k)} otro={r.otros[k]} setOtro={setOtro(k)} puntajeOtro={r.puntajeOtros[k]} setPuntajeOtro={setPuntajeOtro(k)} />
  const elegir = (k, id) => set(k)(r[k] === id ? "" : id)

  // Cambia de paso: lleva la vista al inicio del formulario y el foco al paso activo
  const irA = n => {
    setPaso(n)
    document.getElementById("evaluacion-completa")?.scrollIntoView({ block: "start" })
    botonesPaso.current[n]?.focus({ preventScroll: true })
  }
  const pct = avance(r)
  const recomendaciones = insights(r)
  const moduloActivo = id => r.modulos[id] === "si" || r.modulos[id] === "tal"
  const haZonas = totalHaZonas(r)
  const difHa = respondido(r.hectareas) && haZonas > 0 ? haZonas - r.hectareas : 0

  const errores = {
    nombre: !contacto.nombre.trim() && t("eval.c.errNombre"),
    email: !emailValido(contacto.email) && t("eval.c.errEmail"),
  }
  const nErrores = Object.values(errores).filter(Boolean).length
  const error = k => revisar && errores[k]
  const aviso = revisar && nErrores ? t.plural("eval.c.errores", nErrores) : estado === "enviando" ? t("eval.enviando") : ""

  const textoInsight = x => {
    const base = `eval.ins.${x.clave}`
    const vars = Object.fromEntries(Object.entries(x.vars || {}).map(([k, v]) => [k, typeof v === "number" ? fmt(v) : v]))
    return {
      titulo: x.opcion ? op(x.opcion) : t(`${base}.titulo`, vars),
      texto: x.n !== undefined ? t.plural(`${base}.texto`, x.n, { ...vars, n: fmt(x.n) }) : t(`${base}.texto`, vars),
    }
  }

  const enviar = async e => {
    e.preventDefault()
    if (paso !== N_PASOS - 1 || estado === "enviando") return
    if (nErrores) {
      setRevisar(true)
      document.getElementById(errores.nombre ? "eval-c-nombre" : "eval-c-email")?.focus()
      return
    }
    setEstado("enviando")
    const { mensaje, website, ...datos } = contacto
    const respuestas = { ...r, idioma }
    const ok = await enviarLead({ tipo: "evaluacion", contacto: datos, mensaje, website, resumen: resumenRespuestas(respuestas), respuestas })
    setEstado(ok ? "enviado" : "error")
  }

  useEffect(() => {
    if (estado !== "enviado") return
    window.scrollTo({ top: 0 })
    tituloOk.current?.focus({ preventScroll: true })
  }, [estado])

  if (estado === "enviado") {
    const [antes, despues] = t("eval.ok.confirmacion").split("{email}")
    return (
      <section className="pt-32 pb-24 bg-gray-50 min-h-[80vh]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <CheckCircle size={56} className="text-agro-green-500 mx-auto mb-4" aria-hidden="true" />
          <h1 ref={tituloOk} tabIndex={-1} className="text-3xl font-extrabold text-gray-900 mb-3">
            {t("eval.ok.titulo", { nombre: contacto.nombre.trim().split(" ")[0] })}
          </h1>
          <p className="text-gray-600 mb-2">{t("eval.ok.texto")}</p>
          <p className="text-gray-600 text-sm mb-10">{antes}<b className="text-gray-700">{contacto.email.trim()}</b>{despues}</p>
          <ol className="text-left flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            {[1, 2, 3].map(n => (
              <li key={n} className="flex gap-3">
                <span aria-hidden="true" className="w-7 h-7 rounded-full bg-agro-green-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{n}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t(`eval.ok.paso${n}.titulo`)}</p>
                  <p className="text-xs text-gray-600">{t(`eval.ok.paso${n}.texto`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  const campoContacto = (k, { tipo = "text", obligatorio = false, auto, ph, ayuda } = {}) => {
    const id = `eval-c-${k}`
    const err = error(k)
    const desc = [ayuda && ayudaDe(id), err && `${id}-error`].filter(Boolean).join(" ") || undefined
    return (
      <div>
        <label htmlFor={id} className="block text-xs font-semibold text-gray-700 mb-1">
          {t(`eval.c.${k}`)} <span className="font-normal text-gray-600">{t(obligatorio ? "eval.c.obligatorio" : "eval.c.opcional")}</span>
        </label>
        <input id={id} type={tipo} value={contacto[k]} onChange={setC(k)} autoComplete={auto} placeholder={ph}
          aria-required={obligatorio || undefined} aria-invalid={err ? true : undefined} aria-describedby={desc}
          className={`${inputBase} ${err ? "border-red-600" : "border-gray-500"}`} />
        {ayuda && <p id={ayudaDe(id)} className="text-xs text-gray-600 mt-1">{ayuda}</p>}
        {err && <p id={`${id}-error`} className="text-xs text-red-700 mt-1">{err}</p>}
      </div>
    )
  }
  const [errAntes, errDespues] = t("eval.errorEnvio").split("{correo}")

  return (
    <div>
      <section className="ah-eval" aria-labelledby="eval-titulo">
        <div className="container ah-eval__grid">
          <div>
            <h1 id="eval-titulo" className="ah-display">{t("eval.titulo")}</h1>
            <p className="ah-lead">{t("eval.bajada")}</p>
            <ul className="ah-hechos">
              <li><b>{t("eval.hecho1.titulo")}</b>{t("eval.hecho1.texto")}</li>
              <li><b>{t("eval.hecho2.titulo")}</b>{t("eval.hecho2.texto")}</li>
            </ul>
            <a className="ah-btn ah-btn--quieto ah-eval__ir" href="#evaluacion-completa">{t("eval.empezar")}</a>
          </div>
          <div className="ah-eval__corta">
            <h2 className="ah-reunion__titulo">{t("eval.corta.titulo")}</h2>
            <p className="ah-eval__nota">{t("eval.corta.texto")}</p>
            <AgendarReunion origen="evaluacion" compacto />
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50" id="evaluacion-completa">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <nav aria-label={t("eval.pasos")}>
            <ol className="grid grid-cols-4 gap-2 mb-8">
              {PASOS.map((p, i) => (
                <li key={i}>
                  <button ref={el => { botonesPaso.current[i] = el }} type="button" onClick={() => irA(i)}
                    aria-current={i === paso ? "step" : undefined} className="w-full min-h-[44px] text-left group">
                    <span aria-hidden="true" className={`block h-1.5 rounded-full mb-2 transition-colors ${i <= paso ? "bg-agro-green-600" : "bg-gray-200 group-hover:bg-gray-300"}`} />
                    <span className={`block text-xs font-bold ${i === paso ? "text-agro-green-700" : "text-gray-600"}`}>
                      <span className="sr-only sm:not-sr-only">{t("eval.paso.n", { n: i + 1 })} · {p.titulo}</span>
                      <span aria-hidden="true" className="sm:hidden">{i + 1}</span>
                    </span>
                    <span className="hidden md:block text-xs text-gray-600">{p.desc}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <form onSubmit={enviar} noValidate className="lg:col-span-2 flex flex-col gap-6">

              {paso === 0 && <>
                <Bloque titulo={t("eval.b.cultivo")}>
                  <Pregunta label={t("eval.p.cultivos")} ayuda={t("eval.a.cultivos")}>
                    <div id="eval-cultivos" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {cultivos.filter((c, i) => verCultivos || i < CULTIVOS_VISIBLES || r.cultivos.includes(c)).map(c => (
                        <Chip key={c} activo={r.cultivos.includes(c)} onClick={() => toggle("cultivos")(c)}>{op(c)}</Chip>
                      ))}
                    </div>
                    <button type="button" onClick={() => setVerCultivos(v => !v)} aria-expanded={verCultivos} aria-controls="eval-cultivos"
                      className="flex items-center gap-1 min-h-[44px] text-xs text-agro-green-700 font-semibold mt-1">
                      {verCultivos ? t("eval.verMenos") : t("eval.verCultivos", { n: cultivos.length })}
                      {verCultivos ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
                    </button>
                    <label htmlFor="eval-otroCultivo" className="block text-xs font-medium text-gray-700 mt-2 mb-1">{t("eval.p.otroCultivo")}</label>
                    <input id="eval-otroCultivo" type="text" value={r.otroCultivo} onChange={e => set("otroCultivo")(e.target.value)}
                      placeholder={t("eval.ph.otroCultivo")} className={inputCls} />
                  </Pregunta>
                  <Pregunta label={t("eval.p.hectareas")} campo="eval-hectareas">
                    <Contador id="eval-hectareas" val={r.hectareas} set={set("hectareas")} paso={100} />
                  </Pregunta>
                  <Pregunta label={t("eval.p.zonas")} ayuda={t("eval.a.zonas")}>
                    <Zonas zonas={r.zonas} set={set("zonas")} />
                    {difHa !== 0 && (
                      <p className="text-xs text-amber-800 mt-1">
                        {t(difHa > 0 ? "eval.zona.supera" : "eval.zona.menor", { zonas: fmt(haZonas), total: fmt(r.hectareas) })}
                      </p>
                    )}
                  </Pregunta>
                </Bloque>

                {cultivaTomate(r) && (
                  <Bloque titulo={t("eval.b.tomate")} ayuda={t("eval.b.tomate.ayuda")}>
                    <Pregunta label={t("eval.p.tomateTipos")}>{chips("tomateTipos", TOMATE_TIPOS, "grid-cols-1 sm:grid-cols-2")}</Pregunta>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Pregunta label={t("eval.p.tomateEstablecimiento")}>{opciones("tomateEstablecimiento", TOMATE_ESTABLECIMIENTO)}</Pregunta>
                      <Pregunta label={t("eval.p.tomateCosecha")}>{opciones("tomateCosecha", TOMATE_COSECHA)}</Pregunta>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Pregunta label={t("eval.p.tomateDensidad")} ayuda={t("eval.a.tomateDensidad")} campo="eval-tomateDensidad">
                        <Contador id="eval-tomateDensidad" val={r.tomateDensidad} set={set("tomateDensidad")} paso={1000}
                          describedBy={ayudaDe("eval-tomateDensidad")} />
                      </Pregunta>
                      <Pregunta label={t("eval.p.tomateVariedad")} campo="eval-tomateVariedad">
                        <input id="eval-tomateVariedad" type="text" value={r.tomateVariedad} onChange={e => set("tomateVariedad")(e.target.value)}
                          placeholder={t("eval.ph.tomateVariedad")} className={inputCls} />
                      </Pregunta>
                    </div>
                    <Pregunta label={t("eval.p.tomateProblemas")}>{chips("tomateProblemas", TOMATE_PROBLEMAS)}</Pregunta>
                    {tomateIndustrial(r) && (
                      <Pregunta label={t("eval.p.tomateRecepcion")}>{chips("tomateRecepcion", TOMATE_RECEPCION, "grid-cols-2 sm:grid-cols-3")}</Pregunta>
                    )}
                  </Bloque>
                )}

                <Bloque id="eval-b-modelo" titulo={t("eval.b.modelo")}>
                  <div role="group" aria-labelledby="eval-b-modelo" className="flex flex-col gap-3">
                    {MODELOS_PRODUCTIVOS.map(m => (
                      <Radio key={m.id} activo={r.modelo === m.id} onClick={() => elegir("modelo", m.id)} titulo={op(m.label)} desc={op(m.desc)} />
                    ))}
                  </div>
                  {conAsociados(r) && <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {r.modelo === "mixto" && (
                        <Pregunta label={t("eval.p.haPropias")} campo="eval-haPropias">
                          <Contador id="eval-haPropias" val={r.haPropias} set={set("haPropias")} paso={100}
                            describedBy={respondido(r.hectareas) ? ayudaDe("eval-haPropias") : undefined} />
                          {respondido(r.hectareas) && (
                            <p id={ayudaDe("eval-haPropias")} className="text-xs text-gray-600 mt-1">{t("eval.haAsociadas", { ha: fmt(haAsociadas(r)) })}</p>
                          )}
                        </Pregunta>
                      )}
                      <Pregunta label={t("eval.p.productores")} campo="eval-productores">
                        <Contador id="eval-productores" val={r.productores} set={set("productores")} />
                      </Pregunta>
                    </div>
                    <Pregunta label={t("eval.p.apoyos")}>{chips("apoyos", APOYOS_PRODUCTORES)}</Pregunta>
                  </>}
                </Bloque>

                <Bloque titulo={t("eval.b.manejo")}>
                  <Pregunta label={t("eval.p.riegos")}>{chips("riegos", TIPOS_RIEGO, "grid-cols-2 sm:grid-cols-3")}</Pregunta>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Pregunta label={t("eval.p.programadorRiego")} campo="eval-programadorRiego">
                      <input id="eval-programadorRiego" type="text" value={r.programadorRiego} onChange={e => set("programadorRiego")(e.target.value)}
                        placeholder={t("eval.ph.programadorRiego")} className={inputCls} />
                    </Pregunta>
                    <Pregunta label={t("eval.p.programadorFerti")} campo="eval-programadorFerti">
                      <input id="eval-programadorFerti" type="text" value={r.programadorFerti} onChange={e => set("programadorFerti")(e.target.value)}
                        placeholder={t("eval.ph.programadorFerti")} className={inputCls} />
                    </Pregunta>
                  </div>
                  <Pregunta label={t("eval.p.fertilizacion")}>{chips("fertilizacion", FORMAS_FERTILIZACION, "grid-cols-1 sm:grid-cols-3")}</Pregunta>
                  <Pregunta label={t("eval.p.aplicacion")}>{chips("aplicacion", FORMAS_APLICACION, "grid-cols-2 sm:grid-cols-3")}</Pregunta>
                  <Pregunta label={t("eval.p.productos")} ayuda={t("eval.a.productos")} campo="eval-productos">
                    <MultiSelectBusqueda id="eval-productos" grupos={PRODUCTOS_AGRO} valor={r.productos} onChange={set("productos")}
                      placeholder={t("eval.ph.productos")} />
                  </Pregunta>
                  <Pregunta label={t("eval.p.analisis")}>{chips("analisis", ANALISIS, "grid-cols-2 sm:grid-cols-4")}</Pregunta>
                  <Pregunta label={t("eval.p.registros")}>{chips("registros", REGISTROS)}</Pregunta>
                </Bloque>

                <Bloque titulo={t("eval.b.sensores")} ayuda={t("eval.b.sensores.ayuda")}>
                  <Pregunta label={t("eval.p.tieneSensores")}>{opciones("tieneSensores", SI_NO)}</Pregunta>
                  {r.tieneSensores === "si" && <>
                    <Pregunta label={t("eval.p.marcas")}>
                      <div id="eval-marcas" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {marcas.filter((s, i) => verMarcas || i < MARCAS_VISIBLES || r.marcas.includes(s)).map(s => (
                          <Chip key={s} activo={r.marcas.includes(s)} onClick={() => toggle("marcas")(s)}>{s}</Chip>
                        ))}
                      </div>
                      <button type="button" onClick={() => setVerMarcas(v => !v)} aria-expanded={verMarcas} aria-controls="eval-marcas"
                        className="flex items-center gap-1 min-h-[44px] text-xs text-agro-green-700 font-semibold mt-1">
                        {verMarcas ? t("eval.verMenos") : t("eval.verMarcas", { n: MARCAS_SENSORES.length })}
                        {verMarcas ? <ChevronUp size={13} aria-hidden="true" /> : <ChevronDown size={13} aria-hidden="true" />}
                      </button>
                      <label htmlFor="eval-otraMarca" className="block text-xs font-medium text-gray-700 mt-2 mb-1">{t("eval.p.otraMarca")}</label>
                      <input id="eval-otraMarca" type="text" value={r.otraMarca} onChange={e => set("otraMarca")(e.target.value)} className={inputCls} />
                    </Pregunta>
                    <Pregunta label={t("eval.p.cantidadSensores")} campo="eval-cantidadSensores">
                      <Contador id="eval-cantidadSensores" val={r.cantidadSensores} set={set("cantidadSensores")} />
                    </Pregunta>
                    <Pregunta label={t("eval.p.variables")}>{chips("variables", VARIABLES_SENSORES)}</Pregunta>
                    <Pregunta label={t("eval.p.verData")}>{chips("verData", VER_DATA)}</Pregunta>
                    <Pregunta label={t("eval.p.quienRevisa")}>{opciones("quienRevisa", QUIEN_REVISA)}</Pregunta>
                  </>}
                  <Pregunta label={t("eval.p.conectividad")}>{opciones("conectividad", CONECTIVIDAD)}</Pregunta>
                </Bloque>
              </>}

              {paso === 1 && <>
                <Bloque id="eval-b-prioridades" titulo={t("eval.b.prioridades")} ayuda={t("eval.b.prioridades.ayuda")}>
                  <div role="group" aria-labelledby="eval-b-prioridades">{puntaje("prioridades", PRIORIDADES)}</div>
                </Bloque>

                <Bloque titulo={t("eval.b.datos")}>
                  <Pregunta label={t(r.tieneSensores === "si" ? "eval.p.masSensores" : "eval.p.instalarSensores")}>{opciones("masSensores", SI_NO)}</Pregunta>
                  {r.masSensores !== "no" && (
                    <Pregunta label={t("eval.p.medir")}>{puntaje("medir", MEDIR)}</Pregunta>
                  )}
                  <Pregunta label={t("eval.p.comoVer")}>{puntaje("comoVer", COMO_QUIERE_VER)}</Pregunta>
                </Bloque>

                <Bloque titulo={t("eval.b.plazo")}>
                  <Pregunta label={t("eval.p.plazo")}>{opciones("plazo", PLAZOS)}</Pregunta>
                  <Pregunta label={t("eval.p.capacitacion")} ayuda={t("eval.a.capacitacion")}>{opciones("capacitacion", SI_NO)}</Pregunta>
                </Bloque>
              </>}

              {paso === 2 && <>
                <Bloque titulo={t("eval.b.modulos")} ayuda={t("eval.b.modulos.ayuda")}>
                  {MODULOS.map(m => {
                    const idM = `eval-mod-${m.id}`
                    return (
                      <div key={m.id} className={`rounded-xl border p-4 transition-colors ${r.modulos[m.id] === "si" ? "border-agro-green-400 bg-agro-green-50/50" : r.modulos[m.id] === "tal" ? "border-agro-green-200 bg-agro-green-50/20" : "border-gray-200"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <h3 id={idM} className="text-sm font-bold text-gray-900">{op(m.label)}</h3>
                            <p id={`${idM}-desc`} className="text-xs text-gray-600 leading-relaxed mt-0.5">{op(m.desc)}</p>
                          </div>
                          <div role="group" aria-labelledby={idM} aria-describedby={`${idM}-desc`} className="shrink-0">
                            <Opciones opciones={INTERES} valor={r.modulos[m.id] || ""} set={v => setModulo(m.id, v)} />
                          </div>
                        </div>

                        {(m.id === "ai" || m.id === "docs") && moduloActivo(m.id) && (() => {
                          const k = m.id === "ai" ? "modoAi" : "modoDocs"
                          return (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <Pregunta label={t("eval.p.modo")}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {MODOS_IA.map(o => <Radio key={o.id} activo={r[k] === o.id} onClick={() => elegir(k, o.id)} titulo={op(o.id)} desc={op(o.desc)} />)}
                                </div>
                                {r[k] === OTROS && <CampoOtros valor={r.otros[k]} set={setOtro(k)} />}
                              </Pregunta>
                            </div>
                          )
                        })()}
                        {m.id === "fuentes" && moduloActivo(m.id) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <Pregunta label={t("eval.p.fuentes")} ayuda={t("eval.a.fuentes")}>
                              {chips("fuentes", FUENTES_EN_PANTALLA, "grid-cols-2 sm:grid-cols-4", t("eval.ph.fuentes"))}
                            </Pregunta>
                          </div>
                        )}
                        {m.id === "dashboard" && moduloActivo(m.id) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <Pregunta label={t("eval.p.vistasKpi")} ayuda={t("eval.a.vistasKpi")} campo="eval-vistasKpi">
                              <Contador id="eval-vistasKpi" val={r.vistasKpi} set={set("vistasKpi")} min={1}
                                describedBy={ayudaDe("eval-vistasKpi")} />
                            </Pregunta>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </Bloque>

                <Bloque titulo={t("eval.b.implementacion")}>
                  <Pregunta label={t("eval.p.licencia")} ayuda={t("eval.a.licencia")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {LICENCIAS.map(l => (
                        <Radio key={l.id} activo={r.licencia === l.id} onClick={() => elegir("licencia", l.id)}
                          titulo={op(l.label)} desc={op(l.desc)} badge={l.badge && op(l.badge)} />
                      ))}
                    </div>
                    {r.licencia === "otro" && <CampoOtros valor={r.otros.licencia} set={setOtro("licencia")} />}
                    {requiereTraspaso(r) && (
                      <div className="mt-3 rounded-xl border border-agro-blue-200 bg-agro-blue-50/60 p-4">
                        <p className="flex items-center gap-2 text-xs font-bold text-agro-blue-800 mb-2"><Server size={14} aria-hidden="true" /> {t("eval.traspaso")}</p>
                        <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                          {TRASPASO_TI.map(x => <li key={x}>{op(x)}</li>)}
                        </ul>
                      </div>
                    )}
                  </Pregunta>
                  <Pregunta label={t("eval.p.usuarios")}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {USUARIOS.map(u => {
                        const id = `eval-u-${u.id}`
                        return (
                          <div key={u.id}>
                            <label id={`${id}-etiqueta`} htmlFor={id} className="block text-xs font-semibold text-gray-700">{op(u.label)}</label>
                            <p id={ayudaDe(id)} className="text-xs text-gray-600 mb-1.5">{op(u.hint)}</p>
                            <Contador id={id} val={r[u.id]} set={set(u.id)} describedBy={ayudaDe(id)} />
                          </div>
                        )
                      })}
                    </div>
                    {totalAgricultoresZonas(r) > 0 && (
                      <p className="text-xs text-gray-600 mt-2">{t("eval.agricultoresZonas", { n: fmt(totalAgricultoresZonas(r)) })}</p>
                    )}
                  </Pregunta>
                  <Pregunta label={t("eval.p.soporte")} campo="eval-soporte">
                    <Contador id="eval-soporte" val={r.soporte} set={set("soporte")} min={1} />
                  </Pregunta>
                </Bloque>
              </>}

              {paso === 3 && (
                <section aria-labelledby="eval-contacto" className="bg-white border-2 border-agro-green-200 rounded-2xl p-6 shadow-sm">
                  <h2 id="eval-contacto" className="font-bold text-gray-900 text-base">{t("eval.contacto.titulo")}</h2>
                  <p className="text-xs text-gray-600 mb-4">{t("eval.contacto.texto")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {campoContacto("nombre", { obligatorio: true, auto: "name" })}
                    {campoContacto("empresa", { auto: "organization" })}
                    {campoContacto("cargo", { auto: "organization-title" })}
                    {campoContacto("email", { tipo: "email", obligatorio: true, auto: "email", ph: t("eval.c.phEmail") })}
                    {campoContacto("telefono", { tipo: "tel", auto: "tel", ayuda: t("eval.c.ayudaTelefono") })}
                  </div>
                  <label htmlFor="eval-c-mensaje" className="block text-xs font-semibold text-gray-700 mt-3 mb-1">
                    {t("eval.c.mensaje")} <span className="font-normal text-gray-600">{t("eval.c.opcional")}</span>
                  </label>
                  <textarea id="eval-c-mensaje" value={contacto.mensaje} onChange={setC("mensaje")} rows={3} className={`${inputCls} resize-none`} />
                  <input value={contacto.website} onChange={setC("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                  <p aria-live="polite" className={`text-xs mt-3 ${revisar && nErrores ? "text-red-700 font-semibold" : "sr-only"}`}>{aviso}</p>
                  {estado === "error" && (
                    <p role="alert" className="text-xs text-red-700 mt-3">
                      {errAntes}<a href={`mailto:${CORREO_CONTACTO}`} className="underline font-semibold">{CORREO_CONTACTO}</a>{errDespues}
                    </p>
                  )}
                  <button type="submit" disabled={estado === "enviando"}
                    className="mt-4 w-full min-h-[44px] flex items-center justify-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                    <Send size={15} aria-hidden="true" /> {estado === "enviando" ? t("eval.enviando") : t("eval.enviar")}
                  </button>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    {t("eval.legal")} <Enlace to="/terminos" className="underline">{t("eval.terminos")}</Enlace>.
                  </p>
                </section>
              )}

              <div className="flex items-center justify-between gap-3">
                {paso > 0 ? (
                  <button type="button" onClick={() => irA(paso - 1)} className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2.5">
                    <ChevronLeft size={16} aria-hidden="true" /> {t("eval.volver")}
                  </button>
                ) : <span />}
                {paso < N_PASOS - 1 && (
                  <button type="button" onClick={() => irA(paso + 1)} className="inline-flex items-center gap-1.5 min-h-[44px] bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors">
                    {t("eval.siguiente", { titulo: PASOS[paso + 1].titulo })} <ChevronRight size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 flex flex-col gap-4">
                <section aria-labelledby="eval-diag" className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h2 id="eval-diag" className="font-bold text-gray-900 text-base flex items-center gap-2">
                      <Lightbulb size={16} className="text-agro-green-600" aria-hidden="true" /> {t("eval.diag.titulo")}
                    </h2>
                    <span aria-hidden="true" className="text-xs font-bold text-agro-green-700">{pct}%</span>
                  </div>
                  <div role="progressbar" aria-label={t("eval.diag.avance")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
                    className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-agro-green-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  {recomendaciones.length === 0 ? (
                    <p className="text-sm text-gray-600 leading-relaxed">{t("eval.diag.vacio")}</p>
                  ) : (
                    <ul className="flex flex-col gap-3 max-h-[46vh] overflow-y-auto pr-1">
                      {recomendaciones.map(x => {
                        const { titulo, texto } = textoInsight(x)
                        return (
                          <li key={x.clave} className="border-l-2 border-agro-green-400 pl-3">
                            <p className="text-xs font-bold text-gray-900">{titulo}</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{texto}</p>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                  {paso < N_PASOS - 1 && (
                    <button type="button" onClick={() => irA(N_PASOS - 1)} className="mt-5 flex items-center justify-center gap-2 w-full min-h-[44px] bg-agro-green-600 hover:bg-agro-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                      {t("eval.enviar")} <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  )}
                </section>

                <section aria-labelledby="eval-etapas" className="bg-agro-green-900 rounded-2xl p-6 text-white">
                  <h2 id="eval-etapas" className="font-bold text-sm mb-4">{t("eval.etapas.titulo")}</h2>
                  <ol className="flex flex-col gap-3">
                    {ETAPAS.map((e, i) => (
                      <li key={e.titulo} className="flex gap-3">
                        <span aria-hidden="true" className="w-5 h-5 rounded-full bg-agro-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <div>
                          <p className="text-xs font-semibold">{op(e.titulo)}</p>
                          <p className="text-xs text-white/75 leading-relaxed">{op(e.texto)}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
