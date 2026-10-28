import { ArrowRight, Recycle, Store } from "lucide-react"
import IconoDron from "./IconoDron"
import Foto from "./Foto"
import CreditoFoto from "./CreditoFoto"
import { Enlace, useApps, useIdioma } from "../i18n"
import { FOTOS } from "../lib/fotos"
import { estiloAcento } from "../lib/apps"

// Las apps del ecosistema (DronX, AgroCiclo, AgroSeller) en fichas con foto, ícono y color propio.
// En la portada: <AppsEcosistema /> (id="apps"). En la página de una app: las otras dos, con
// <AppsEcosistema excluir="dronx" id="otras-apps" titulo={t("apps.otras")} bajada={null} />.
// Toda la ficha es clicable (el enlace del nombre la cubre); el crédito de la foto queda encima y se puede usar.

const ICONOS = { dron: IconoDron, reciclaje: Recycle, feria: Store }

export function IconoApp({ icono, size = 24, ...rest }) {
  const Icono = ICONOS[icono]
  return Icono ? <Icono size={size} aria-hidden="true" {...rest} /> : null
}

// Foto de la app (lib/apps.js: `foto`, con `fotoRespaldo` mientras la propia no esté en lib/fotos.js)
export const fotoDe = (app) => FOTOS[app.foto] || FOTOS[app.fotoRespaldo] || FOTOS.hortalizas

export default function AppsEcosistema({ excluir, titulo, bajada, id = "apps" }) {
  const { t } = useIdioma()
  const apps = useApps().filter((a) => a.ruta.startsWith("/apps/") && a.slug !== excluir)
  const texto = bajada === undefined ? t("apps.portada.bajada") : bajada

  return (
    <section className={`ah-ecoapps${excluir ? " ah-ecoapps--otras" : ""}`} id={id} aria-labelledby={`${id}-titulo`}>
      <div className="container">
        <div className="ah-ecoapps__cabeza">
          <h2 id={`${id}-titulo`} className="ah-seccion">{titulo || t("apps.portada.titulo")}</h2>
          {texto && <p className="ah-lead">{texto}</p>}
        </div>
        <ul className="ah-ecoapps__lista">
          {apps.map((app) => {
            const foto = fotoDe(app)
            return (
              <li key={app.slug} className="ah-ecoapp" style={estiloAcento(app.slug)}>
                <div className="ah-appf ah-ecoapp__foto">
                  <Foto foto={foto} proporcion={3 / 2} sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 30vw" />
                  <CreditoFoto foto={foto} />
                </div>
                <div className="ah-ecoapp__cuerpo">
                  <span className="ah-ecoapp__icono"><IconoApp icono={app.icono} size={22} /></span>
                  <h3 className="ah-ecoapp__nombre">
                    <Enlace to={app.ruta} className="ah-ecoapp__enlace">{app.nombre}</Enlace>
                    {app.estado && <span className="ah-appx-estado">{app.estado}</span>}
                  </h3>
                  <p className="ah-ecoapp__promesa">{app.promesa}</p>
                  <span className="ah-ecoapp__ver" aria-hidden="true">
                    {t("apps.ver", { app: app.nombre })}<ArrowRight size={16} />
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
