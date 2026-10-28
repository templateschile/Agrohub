import { useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { ArrowRight, ArrowUpRight, ArrowLeftRight, Check } from "lucide-react"
import Foto from "../components/Foto"
import CreditoFoto from "../components/CreditoFoto"
import ContactModal from "../components/ContactModal"
import FormInteres from "../components/FormInteres"
import AppsEcosistema, { IconoApp, fotoDe } from "../components/AppsEcosistema"
import { ConfianStrip } from "../components/Confianza"
import { HubMark } from "../components/HubMark"
import { Enlace, useApps, useIdioma, useModulos } from "../i18n"
import { estiloAcento } from "../lib/apps"
import { hayVideo } from "../lib/video"
import Captura from "../components/Captura"
import { capturasDeModulo } from "../lib/capturas"

// Plantilla común de las páginas de app (/apps/<slug>), con los datos de lib/apps.js ya traducidos:
// 1 hero con foto · 2 problemas → soluciones · 3 cómo funciona · (qué incluye) · (video, si existe
// /videos/<slug>.mp4) · 4 para quién es y cómo se conecta con AgroHubs · 5 preguntas frecuentes ·
// 6 cierre con sus botones, o el formulario de interés si la app aún no existe · 7 las otras apps ·
// y la franja "Confían en nosotros". Cada app pinta sus acentos con su color (lib/apps.js, ACENTOS).

// Un botón hacia el destino de la app: sitio externo (otra pestaña), página de este sitio o sección
function Accion({ destino, children, clase = "" }) {
  const { t } = useIdioma()
  const cls = `ah-btn ${clase}`.trim()
  if (destino.url) {
    return (
      <a className={cls} href={destino.url} target="_blank" rel="noopener noreferrer">
        {children}<span className="visually-hidden"> ({t("comun.otraPestana")})</span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    )
  }
  if (destino.ruta) {
    return <Enlace className={cls} to={destino.ruta}>{children}<ArrowRight size={18} aria-hidden="true" /></Enlace>
  }
  return <a className={cls} href={`#${destino.ancla}`}>{children}</a>
}

// Video de la app, solo si existe el archivo (sin recuadro "próximamente" que ocupe la página)
function VideoApp({ app }) {
  const { t } = useIdioma()
  const src = `/videos/${app.slug}.mp4`
  const [hay, setHay] = useState(false)
  useEffect(() => {
    let vigente = true
    setHay(false)
    hayVideo(src).then(ok => { if (vigente) setHay(ok) })
    return () => { vigente = false }
  }, [src])
  if (!hay) return null
  const titulo = t("apps.video", { app: app.nombre })
  return (
    <section className="ah-bloque" aria-labelledby={`app-${app.slug}-video`}>
      <div className="container ah-video-portada">
        <h2 id={`app-${app.slug}-video`} className="ah-seccion">{titulo}</h2>
        <div className="ah-video">
          <video className="ah-video__medio" src={src} poster={`/videos/${app.slug}.jpg`} controls muted playsInline
            preload="metadata" aria-label={titulo} onError={() => setHay(false)} />
        </div>
      </div>
    </section>
  )
}

export default function AppPagina() {
  const { slug } = useParams()
  const { t, ruta } = useIdioma()
  const app = useApps().find(a => a.slug === slug)
  const modulos = useModulos()
  const [contacto, setContacto] = useState(false)

  // AgroHubs es el sitio completo; un slug desconocido vuelve a la portada (en el mismo idioma)
  if (!app || !app.bajada) return <Navigate to={ruta("/")} replace />

  const foto = fotoDe(app)
  const incluyeModulo = app.modulo ? modulos.find(m => m.slug === app.modulo)?.pagina?.features : null
  const id = k => `app-${app.slug}-${k}`
  // En el cierre: el botón principal, el secundario si lleva a otro lugar (no a una sección de arriba)
  // y "Hablar con el equipo", que abre el contacto
  const otraEnCierre = app.otra && !app.otra.destino.ancla

  return (
    <div className="ah-appx" style={estiloAcento(app.slug)}>
      {/* 1 · Hero */}
      <section className="ah-appx-hero" aria-labelledby={id("titulo")}>
        <div className="container ah-appx-hero__grid">
          <div className="ah-appx-hero__texto">
            <p className="ah-appx-eyebrow">
              <span className="ah-appx-eyebrow__icono"><IconoApp icono={app.icono} size={18} /></span>
              {t("apps.eyebrow")}
              {app.estado && <span className="ah-appx-estado">{app.estado}</span>}
            </p>
            <h1 id={id("titulo")} className="ah-display">{app.nombre}</h1>
            <p className="ah-appx-hero__promesa">{app.promesa}</p>
            <p className="ah-appx-hero__bajada">{app.bajada}</p>
            <div className="ah-acciones">
              <Accion destino={app.destino} clase="ah-btn--app">{app.cta}</Accion>
              {app.otra && <Accion destino={app.otra.destino} clase="ah-btn--quieto">{app.otra.texto}</Accion>}
            </div>
          </div>
          <div className="ah-appx-hero__visual">
            <div className="ah-appf ah-appx-hero__foto">
              <Foto foto={foto} proporcion={4 / 3} prioridad sizes="(max-width: 60rem) 100vw, 46vw" />
              <CreditoFoto foto={foto} />
            </div>
            <span className="ah-appx-hero__sello" aria-hidden="true"><IconoApp icono={app.icono} size={28} /></span>
          </div>
        </div>
      </section>

      {/* Capturas reales: las apps que reutilizan un módulo de AgroHubs (DronX → Drones) muestran sus pantallas */}
      {app.modulo && (capturasDeModulo(app.modulo).escritorio || capturasDeModulo(app.modulo).movil) && (
        <section className="ah-bloque ah-appcap" aria-labelledby={id("capturas")}>
          <div className="container">
            <h2 id={id("capturas")} className="ah-seccion">{t("apps.capturas.titulo")}</h2>
            <div className="ah-modcap ah-modcap--claro">
              <Captura captura={capturasDeModulo(app.modulo).escritorio} vista="escritorio" className="ah-modcap__escritorio" />
              <Captura captura={capturasDeModulo(app.modulo).movil} vista="movil" className="ah-modcap__movil" />
            </div>
          </div>
        </section>
      )}

      {/* 2 · Problemas → soluciones */}
      <section className="ah-bloque" aria-labelledby={id("problemas")}>
        <div className="container">
          <h2 id={id("problemas")} className="ah-seccion">{t("apps.resuelve")}</h2>
          <ul className="ah-problemas">
            {app.problemas.map(p => (
              <li key={p.problema} className="ah-problema">
                <p className="ah-problema__antes"><span className="ah-etiqueta">{t("apps.hoy")}</span>{p.problema}</p>
                <p className="ah-problema__despues"><span className="ah-etiqueta ah-etiqueta--si">{t("apps.con", { app: app.nombre })}</span>{p.solucion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 · Cómo funciona */}
      <section className="ah-bloque ah-bloque--tinte" id="como-funciona" aria-labelledby={id("pasos")}>
        <div className="container">
          <h2 id={id("pasos")} className="ah-seccion">{t("apps.comoFunciona")}</h2>
          <ol className="ah-pasos">
            {app.pasos.map((p, i) => (
              <li key={p.titulo} className="ah-paso">
                <span className="ah-paso__num" aria-hidden="true">{i + 1}</span>
                <h3 className="ah-paso__titulo">{p.titulo}</h3>
                <p className="ah-paso__texto">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Qué incluye (opcional): el detalle de la app o, si reutiliza un módulo, sus servicios */}
      {(app.incluye || incluyeModulo) && (
        <section className="ah-bloque" aria-labelledby={id("incluye")}>
          <div className="container">
            <h2 id={id("incluye")} className="ah-seccion">{app.incluye?.titulo || t("apps.queIncluye")}</h2>
            {app.incluye?.jerarquia && (
              <ol className="ah-jerarquia" aria-label={app.incluye.etiqueta}>
                {app.incluye.jerarquia.map(n => <li key={n}>{n}</li>)}
              </ol>
            )}
            <div className="ah-incluye">
              {app.incluye
                ? app.incluye.grupos.map(g => (
                  <div key={g.titulo} className="ah-incluye__grupo">
                    <h3 className="ah-incluye__titulo">{g.titulo}</h3>
                    <ul className="ah-checks">{g.items.map(x => <li key={x}><Check size={18} aria-hidden="true" />{x}</li>)}</ul>
                  </div>
                ))
                : (
                  <ul className="ah-checks ah-checks--grilla">
                    {incluyeModulo.map(f => <li key={f.titulo}><Check size={18} aria-hidden="true" /><span><b>{f.titulo}.</b> {f.desc}</span></li>)}
                  </ul>
                )}
            </div>
          </div>
        </section>
      )}

      <VideoApp app={app} />

      {/* 4 · Para quién es · Cómo se conecta con AgroHubs */}
      <section className="ah-bloque ah-bloque--tinte" aria-labelledby={id("para")}>
        <div className="container ah-dos">
          <div>
            <h2 id={id("para")} className="ah-seccion">{t("apps.paraQuien")}</h2>
            <ul className="ah-para">
              {app.paraQuien.map(p => <li key={p.titulo}><b>{p.titulo}</b>{p.texto}</li>)}
            </ul>
          </div>
          <div className="ah-appx-conexion">
            <h2 id={id("conexion")} className="ah-seccion">{t("apps.conexion")}</h2>
            <p className="ah-appx-conexion__par" aria-hidden="true">
              <span className="ah-appx-chip ah-appx-chip--hub"><HubMark className="ah-appx-chip__marca" title={null} />AgroHubs</span>
              <ArrowLeftRight size={18} className="ah-appx-conexion__flecha" />
              <span className="ah-appx-chip ah-appx-chip--app"><IconoApp icono={app.icono} size={18} />{app.nombre}</span>
            </p>
            <ul className="ah-checks">
              {app.conexion.map(x => <li key={x}><Check size={18} aria-hidden="true" />{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 5 · Preguntas frecuentes */}
      <section className="ah-bloque" aria-labelledby={id("faq")}>
        <div className="container ah-faq__grid">
          <h2 id={id("faq")} className="ah-seccion">{t("apps.faq")}</h2>
          <div className="ah-faq">
            {app.faq.map(f => (
              <details key={f.q} className="ah-faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · Cierre: formulario de interés (app en desarrollo) o los botones de la app */}
      {app.interes ? (
        <section className="ah-bloque ah-bloque--tinte ah-appx-interes" id="interes" aria-labelledby={id("cierre")}>
          <div className="container ah-appx-interes__grid">
            <div>
              {app.estado && <p className="ah-appx-eyebrow"><span className="ah-appx-estado">{app.estado}</span></p>}
              <h2 id={id("cierre")} className="ah-seccion">{app.cierre.titulo}</h2>
              <p className="ah-lead">{app.cierre.texto}</p>
            </div>
            <FormInteres app={app} />
          </div>
        </section>
      ) : (
        <section className="ah-banda ah-appx-banda" aria-labelledby={id("cierre")}>
          <div className="container ah-banda__grid">
            <div>
              <h2 id={id("cierre")} className="ah-banda__frase">{app.cierre.titulo}</h2>
              <p className="ah-banda__texto">{app.cierre.texto}</p>
            </div>
            <div className="ah-acciones">
              <Accion destino={app.destino} clase="ah-btn--invertido">{app.cta}</Accion>
              {otraEnCierre && <Accion destino={app.otra.destino} clase="ah-btn--claro">{app.otra.texto}</Accion>}
              <button type="button" className={otraEnCierre ? "ah-appx-texto-boton" : "ah-btn ah-btn--claro"} onClick={() => setContacto(true)}>
                {t("apps.hablar")}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 7 · Las otras apps del ecosistema */}
      <AppsEcosistema excluir={app.slug} id="otras-apps" titulo={t("apps.otras")} bajada={null} />

      <ConfianStrip id={id("confian")} />

      {contacto && (
        <ContactModal
          onClose={() => setContacto(false)}
          titulo={t("apps.hablar.titulo", { app: app.nombre })}
          subtitulo={t("apps.hablar.subtitulo")}
          origen={`app-${app.slug}`}
          resumen={[`Origen: página de la app ${app.nombre} (${app.ruta})`, "Interés: hablar con el equipo"]}
        />
      )}
    </div>
  )
}
