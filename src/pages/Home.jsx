import AppModulos from "../components/AppModulos"
import AgendarReunion from "../components/AgendarReunion"
import Integraciones from "../components/Integraciones"
import Ecosistema from "../components/Ecosistema"
import AppsEcosistema from "../components/AppsEcosistema"
import MarcaPropia from "../components/MarcaPropia"
import AppVideo from "../components/AppVideo"
import Pasos from "../components/Pasos"
import Foto from "../components/Foto"
import CreditoFoto from "../components/CreditoFoto"
import { ConfianStrip, Partner } from "../components/Confianza"
import { useIdioma, Enlace } from "../i18n"
import { resumen } from "../lib/ecosistema"
import { FOTOS } from "../lib/fotos"

const { activas } = resumen()
// Gente del campo (lib/fotos.js): personas trabajando, de varios países, sin preferir ninguno
const GENTE = ["cosechaManos", "familiaCampo", "riegoPersona", "ganaderoCampo", "feriaVendedor", "vinas"].filter(k => FOTOS[k])

// Portada: la app con sus módulos y los tres pasos, el ecosistema interactivo (lo principal) con las
// integraciones de la región que siguen su filtro, las apps del ecosistema, los cultivos, el video,
// quiénes confían, agendar la reunión y, si se quiere, la evaluación.
export default function Home() {
  const { t } = useIdioma()
  return (
    <>
      <section className="ah-hero" id="modulos" aria-labelledby="hero-titulo">
        <div className="ah-hero__foto">
          <Foto foto={FOTOS.agricultorTablet} prioridad sizes="100vw" />
          <CreditoFoto foto={FOTOS.agricultorTablet} />
        </div>
        <div className="container ah-hero__grid">
          <div className="ah-hero__texto">
            <p className="ah-eyebrow">{t("hero.eyebrow", { activas })}</p>
            <h1 id="hero-titulo" className="ah-display">{t("hero.titulo")}</h1>
            <p className="ah-lead ah-hero__bajada">{t("hero.bajada")}</p>
            <p className="ah-hero__bajada2">{t("hero.bajada2")}</p>
            <div className="ah-acciones">
              <a className="ah-btn" href="#contacto">{t("hero.agendar")}</a>
              <Enlace className="ah-btn ah-btn--quieto" to="/evaluacion">{t("hero.evaluar")}</Enlace>
            </div>
          </div>
          <div className="ah-hero__app">
            <Pasos />
            <AppModulos />
          </div>
        </div>
      </section>

      <Ecosistema />

      <Integraciones />

      <AppsEcosistema />

      <MarcaPropia />

      <section className="ah-cultivos" aria-labelledby="cultivos-titulo">
        <div className="container">
          <div className="ah-cultivos__cabeza">
            <h2 id="cultivos-titulo" className="ah-seccion">{t("cultivos.titulo")}</h2>
            <p className="ah-lead">{t("cultivos.bajada")}</p>
          </div>
          <ul className="ah-cultivos__grilla">
            {GENTE.map((k, i) => (
              <li key={k} className={`ah-cultivo${i === 0 ? " ah-cultivo--grande" : ""}`}>
                <Foto foto={FOTOS[k]} proporcion={i === 0 ? 3 / 2 : 4 / 3} sizes="(min-width: 72rem) 30vw, (min-width: 40rem) 45vw, 100vw" />
                <p className="ah-cultivo__nombre">{t(`cultivos.${k}`)}</p>
                <CreditoFoto foto={FOTOS[k]} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ah-bloque" aria-labelledby="video-titulo">
        <div className="container ah-video-portada">
          <div>
            <h2 id="video-titulo" className="ah-seccion">{t("video.titulo")}</h2>
            <p className="ah-lead">{t("video.bajada")}</p>
          </div>
          <AppVideo app="agrohubs" nombre="AgroHubs" />
        </div>
      </section>

      <ConfianStrip />

      <Partner />

      <section className="ah-agenda" id="contacto" aria-labelledby="agenda-titulo">
        <div className="container ah-agenda__grid">
          <div className="ah-agenda__texto">
            <h2 id="agenda-titulo" className="ah-seccion">{t("agenda.titulo")}</h2>
            <p className="ah-lead">{t("agenda.bajada")}</p>
            <ul className="ah-hechos">
              <li><b>{t("agenda.hecho1.b")}</b>{t("agenda.hecho1.t")}</li>
              <li><b>{t("agenda.hecho2.b")}</b>{t("agenda.hecho2.t")}</li>
            </ul>
          </div>
          <AgendarReunion origen="portada" />
        </div>
      </section>

      <section className="ah-cierre" aria-labelledby="cierre-titulo">
        <div className="ah-cierre__foto">
          <Foto foto={FOTOS.asesorCampo} sizes="100vw" />
          <CreditoFoto foto={FOTOS.asesorCampo} />
        </div>
        <div className="container ah-cierre__grid">
          <div className="ah-cierre__caja">
            <h2 id="cierre-titulo" className="ah-banda__frase">{t("cierre.titulo")}</h2>
            <p>{t("cierre.texto")}</p>
            <div className="ah-acciones">
              <a className="ah-btn" href="#contacto">{t("hero.agendar")}</a>
              <Enlace className="ah-btn ah-btn--quieto" to="/evaluacion">{t("banda.cta")}</Enlace>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
