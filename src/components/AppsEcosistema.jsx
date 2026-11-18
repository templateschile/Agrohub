import { ArrowRight, Recycle, Store, BookOpenText } from "lucide-react"
import IconoDron from "./IconoDron"
import { HubMark } from "./HubMark"
import Foto from "./Foto"
import CreditoFoto from "./CreditoFoto"
import { Enlace, useApps, useIdioma } from "../i18n"
import { FOTOS } from "../lib/fotos"
import { estiloAcento } from "../lib/apps"

// Las apps del ecosistema en fichas con foto, ícono y color propio, en el orden de lib/apps.js: AgroHubs.cl
// (multi integración, con su `tarjeta`), Fisaro, AgroCiclo, DronX y AgroSeller. DronX y AgroSeller llevan
// su etiqueta «En desarrollo». En la portada: <AppsEcosistema /> (id="apps"), con AgroHubs.cl más ancha.
// En la página de una app: las demás, con <AppsEcosistema excluir="dronx" id="otras-apps" titulo={t("apps.otras")} bajada={null} />.
// Toda la ficha es clicable (el enlace del nombre la cubre); el crédito de la foto queda encima y se puede usar.

// El logo trae aire alrededor del anillo: un poco más grande para pesar lo mismo que los íconos de las otras apps
const Hub = ({ size = 24, ...rest }) => <HubMark title={null} className="" width={Math.round(size * 1.35)} height={Math.round(size * 1.35)} {...rest} />
const ICONOS = { dron: IconoDron, reciclaje: Recycle, feria: Store, biblioteca: BookOpenText, hub: Hub }

export function IconoApp({ icono, size = 24, ...rest }) {
  const Icono = ICONOS[icono]
  return Icono ? <Icono size={size} aria-hidden="true" {...rest} /> : null
}

// Foto de la app (lib/apps.js: `foto`, con `fotoRespaldo` mientras la propia no esté en lib/fotos.js)
export const fotoDe = (app) => FOTOS[app.foto] || FOTOS[app.fotoRespaldo] || FOTOS.hortalizas

// Ficha de cada app. AgroHubs usa su `tarjeta` (nombre AgroHubs.cl, etiqueta y enlace a /integraciones).
const ficha = (app) => app.tarjeta
  ? { slug: app.slug, nombre: app.tarjeta.nombre, etiqueta: app.tarjeta.etiqueta, texto: app.tarjeta.texto, ruta: app.tarjeta.ruta, icono: "hub", foto: FOTOS[app.tarjeta.foto], principal: true }
  : { slug: app.slug, nombre: app.nombre, etiqueta: app.estado, texto: app.promesa, ruta: app.ruta, icono: app.icono, foto: fotoDe(app) }

export default function AppsEcosistema({ excluir, titulo, bajada, id = "apps", children }) {
  const { t } = useIdioma()
  const apps = useApps().filter((a) => (a.tarjeta || a.ruta.startsWith("/apps/")) && a.slug !== excluir).map(ficha)
  const texto = bajada === undefined ? t("apps.portada.bajada") : bajada

  return (
    <section className={`ah-ecoapps${excluir ? " ah-ecoapps--otras" : ""}`} id={id} aria-labelledby={`${id}-titulo`}>
      <div className="container">
        <div className="ah-ecoapps__cabeza">
          <h2 id={`${id}-titulo`} className="ah-seccion">{titulo || t("apps.portada.titulo")}</h2>
          {texto && <p className="ah-lead">{texto}</p>}
        </div>
        <ul className="ah-ecoapps__lista">
          {apps.map((app) => (
            <li key={app.slug} className={`ah-ecoapp${app.principal && !excluir ? " ah-ecoapp--principal" : ""}`} style={estiloAcento(app.slug)}>
              <div className="ah-appf ah-ecoapp__foto">
                <Foto foto={app.foto} proporcion={3 / 2} sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 30vw" />
                <CreditoFoto foto={app.foto} />
              </div>
              <div className="ah-ecoapp__cuerpo">
                <span className="ah-ecoapp__icono"><IconoApp icono={app.icono} size={22} /></span>
                <h3 className="ah-ecoapp__nombre">
                  <Enlace to={app.ruta} className="ah-ecoapp__enlace">{app.nombre}</Enlace>
                  {app.etiqueta && <span className="ah-appx-estado">{app.etiqueta}</span>}
                </h3>
                <p className="ah-ecoapp__promesa">{app.texto}</p>
                <span className="ah-ecoapp__ver" aria-hidden="true">
                  {t("apps.ver", { app: app.nombre })}<ArrowRight size={16} />
                </span>
              </div>
            </li>
          ))}
        </ul>
        {children}
      </div>
    </section>
  )
}
