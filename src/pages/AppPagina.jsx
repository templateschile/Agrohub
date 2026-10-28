import { useEffect, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { ArrowUpRight, Check } from "lucide-react"
import AppVideo from "../components/AppVideo"
import ContactModal from "../components/ContactModal"
import { ConfianStrip } from "../components/Confianza"
import { appPorSlug } from "../lib/apps"
import { moduloPorSlug } from "../lib/modulos"

// Plantilla común de las páginas de app (/apps/<slug>), con los datos de lib/apps.js:
// 1 hero · 2 video · 3 problemas → soluciones · 4 cómo funciona · (qué incluye) · 5 para quién es ·
// 6 cómo se conecta con AgroHubs · 7 preguntas frecuentes · 8 cierre · y la franja "Confían en nosotros".
// Las apps con sitio propio lo abren en otra pestaña; las que aún no existen abren el contacto.

function BotonPrincipal({ app, onContacto, claro = false }) {
  const clase = `ah-btn${claro ? " ah-btn--invertido" : ""}`
  if (app.sitio) {
    return (
      <a className={clase} href={app.sitio} target="_blank" rel="noopener noreferrer">
        {app.cta}<span className="visually-hidden"> (se abre en otra pestaña)</span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    )
  }
  return <button type="button" className={clase} onClick={onContacto}>{app.cta}</button>
}

export default function AppPagina() {
  const { slug } = useParams()
  const app = appPorSlug(slug)
  const [contacto, setContacto] = useState(false)

  useEffect(() => {
    if (!app?.bajada) return
    const antes = document.title
    document.title = `${app.nombre} · ${app.promesa} | AgroHubs`
    return () => { document.title = antes }
  }, [app])

  // AgroHubs es el sitio completo; un slug desconocido vuelve a la portada
  if (!app || !app.bajada) return <Navigate to="/" replace />

  const modulo = app.modulo ? moduloPorSlug(app.modulo) : null
  const incluyeModulo = modulo?.pagina?.features
  const abrirContacto = () => setContacto(true)
  const id = k => `app-${app.slug}-${k}`

  return (
    <div className="ah-app-pagina">
      {/* 1 · Hero */}
      <section className="ah-apph" aria-labelledby={id("titulo")}>
        <div className="container ah-apph__grid">
          <div>
            <p className="ah-eyebrow">
              App del ecosistema AgroHubs
              {app.nuevo && <span className="ah-insignia">Nuevo</span>}
            </p>
            <h1 id={id("titulo")} className="ah-display">{app.nombre}</h1>
            <p className="ah-apph__promesa">{app.promesa}</p>
            <p className="ah-lead">{app.bajada}</p>
            <div className="ah-acciones">
              <BotonPrincipal app={app} onContacto={abrirContacto} />
              {modulo
                ? <Link className="ah-btn ah-btn--quieto" to={modulo.ruta}>Ver el módulo {modulo.corto}</Link>
                : <a className="ah-btn ah-btn--quieto" href="#como-funciona">Cómo funciona</a>}
            </div>
          </div>
          {/* 2 · Video */}
          <AppVideo app={app.slug} nombre={app.nombre} />
        </div>
      </section>

      {/* 3 · Problemas → soluciones */}
      <section className="ah-bloque" aria-labelledby={id("problemas")}>
        <div className="container">
          <h2 id={id("problemas")} className="ah-seccion">Lo que resuelve</h2>
          <ul className="ah-problemas">
            {app.problemas.map(p => (
              <li key={p.problema} className="ah-problema">
                <p className="ah-problema__antes"><span className="ah-etiqueta">Hoy</span>{p.problema}</p>
                <p className="ah-problema__despues"><span className="ah-etiqueta ah-etiqueta--si">Con {app.nombre}</span>{p.solucion}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 · Cómo funciona */}
      <section className="ah-bloque ah-bloque--tinte" id="como-funciona" aria-labelledby={id("pasos")}>
        <div className="container">
          <h2 id={id("pasos")} className="ah-seccion">Cómo funciona</h2>
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
            <h2 id={id("incluye")} className="ah-seccion">{app.incluye?.titulo || "Qué puedes pedir"}</h2>
            {app.incluye?.jerarquia && (
              <ol className="ah-jerarquia" aria-label="Cada lote se ordena por">
                {app.incluye.jerarquia.map(n => <li key={n}>{n}</li>)}
              </ol>
            )}
            <div className="ah-incluye">
              {app.incluye
                ? app.incluye.grupos.map(g => (
                  <div key={g.titulo} className="ah-incluye__grupo">
                    <h3 className="ah-incluye__titulo">{g.titulo}</h3>
                    <ul className="ah-checks">{g.items.map(t => <li key={t}><Check size={18} aria-hidden="true" />{t}</li>)}</ul>
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

      {/* 5 · Para quién es · 6 · Cómo se conecta con AgroHubs */}
      <section className="ah-bloque ah-bloque--tinte" aria-labelledby={id("para")}>
        <div className="container ah-dos">
          <div>
            <h2 id={id("para")} className="ah-seccion">Para quién es</h2>
            <ul className="ah-para">
              {app.paraQuien.map(p => <li key={p.titulo}><b>{p.titulo}</b>{p.texto}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="ah-seccion">Cómo se conecta con AgroHubs</h2>
            <ul className="ah-checks">
              {app.conexion.map(t => <li key={t}><Check size={18} aria-hidden="true" />{t}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 7 · Preguntas frecuentes */}
      <section className="ah-bloque" aria-labelledby={id("faq")}>
        <div className="container ah-faq__grid">
          <h2 id={id("faq")} className="ah-seccion">Preguntas frecuentes</h2>
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

      {/* 8 · Cierre */}
      <section className="ah-banda" aria-labelledby={id("cierre")}>
        <div className="container ah-banda__grid">
          <div>
            <h2 id={id("cierre")} className="ah-banda__frase">{app.cierre.titulo}</h2>
            <p className="ah-banda__texto">{app.cierre.texto}</p>
          </div>
          <div className="ah-acciones">
            <BotonPrincipal app={app} onContacto={abrirContacto} claro />
            <Link className="ah-btn ah-btn--claro" to="/">Conoce AgroHubs</Link>
          </div>
        </div>
      </section>

      <ConfianStrip id={id("confian")} />

      {contacto && (
        <ContactModal
          onClose={() => setContacto(false)}
          titulo={`Quiero ser parte de ${app.nombre}`}
          subtitulo="Déjanos tus datos y te contamos cuándo empiezan las primeras pruebas."
          resumen={[`Origen: página de la app ${app.nombre} (${app.ruta})`, "Interés: quiere ser parte"]}
        />
      )}
    </div>
  )
}
