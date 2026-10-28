import { HubMark } from './HubMark'
import { Partner } from './Confianza'
import { SelectorIdioma } from './Navbar'
import { useIdioma, useApps, Enlace } from '../i18n'

// Pie: la marca, los enlaces del sitio, las apps del ecosistema y el idioma.
// /apis es un directorio estático en español: enlace normal (no del router) y avisado en en/pt.
export default function Footer() {
  const { t, ruta } = useIdioma()
  const apps = useApps().filter(a => a.slug !== 'agrohubs')
  return (
    <footer className="ah-pie">
      <div className="container ah-pie__grid">
        <div>
          <p className="ah-pie__marca">
            <span className="ah-pie__logo"><HubMark className="ah-pie__hub" title={null} /></span>
            AgroHubs
          </p>
          <p className="ah-pie__linea">{t('pie.linea')}</p>
          <Partner variante="linea" />
        </div>

        <div className="ah-pie__navs">
          <nav className="ah-pie__links" aria-label={t('pie.sitio')}>
            <Enlace to="/modulos">{t('pie.modulos')}</Enlace>
            <Enlace to="/dashboard">{t('pie.dashboard')}</Enlace>
            <Enlace to="/ai-chat">{t('pie.aiChat')}</Enlace>
            <Enlace to="/documentos">{t('pie.documentos')}</Enlace>
            <Enlace to="/eventos">{t('pie.eventos')}</Enlace>
            <Enlace to="/tienda">{t('pie.tienda')}</Enlace>
            <Enlace to="/drones">{t('pie.drones')}</Enlace>
            <Enlace to="/evaluacion">{t('pie.evaluacion')}</Enlace>
            <a href="/apis" hrefLang="es">{t('pie.apis')}</a>
            <a href="/apis/cotizar" hrefLang="es">{t('pie.cotizar')}</a>
            <a href={ruta('/#contacto')}>{t('pie.contacto')}</a>
            <Enlace to="/licencias">{t('pie.licencias')}</Enlace>
            <Enlace to="/terminos">{t('pie.terminos')}</Enlace>
          </nav>
          <nav className="ah-pie__apps" aria-labelledby="pie-apps">
            <p id="pie-apps" className="ah-pie__subtitulo">{t('pie.apps')}</p>
            <ul>
              {apps.map(app => <li key={app.slug}><Enlace to={app.ruta}>{app.nombre}</Enlace></li>)}
            </ul>
          </nav>
          <div className="ah-pie__idioma">
            <p className="ah-pie__subtitulo">{t('nav.idioma')}</p>
            <SelectorIdioma />
          </div>
        </div>
      </div>
      <div className="container">
        <p className="ah-pie__legal">&copy; {new Date().getFullYear()} AgroHubs</p>
      </div>
    </footer>
  )
}
