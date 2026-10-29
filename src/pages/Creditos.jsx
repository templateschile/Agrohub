import { useIdioma } from "../i18n"
import { FOTOS, urlFoto } from "../lib/fotos"

// Créditos de las fotos: todas las de Unsplash que usa el sitio, con su autor y el enlace a la foto y al
// perfil del autor (lo que pide la licencia de Unsplash). Enlazada desde el pie y desde cada crédito.
const UTM = "?utm_source=agrohubs&utm_medium=referral"

export default function Creditos() {
  const { t, idioma } = useIdioma()
  const fotos = Object.values(FOTOS)
  return (
    <>
      <section className="ah-lic-cabeza" aria-labelledby="cred-titulo">
        <div className="container">
          <h1 id="cred-titulo" className="ah-display">{t("cred.titulo")}</h1>
          <p className="ah-lead">{t("cred.bajada")}</p>
        </div>
      </section>
      <section className="ah-creditos">
        <div className="container">
          <ul className="ah-creditos__lista">
            {fotos.map(f => (
              <li key={f.id} className="ah-creditos__foto">
                <img src={urlFoto(f, 320, { alto: 213 })} width={320} height={213} alt={f.alt?.[idioma] || f.alt?.es || ""} loading="lazy" decoding="async" />
                <p>
                  <a href={`https://unsplash.com/photos/${f.id}${UTM}`} target="_blank" rel="noopener noreferrer">{t("cred.foto")}</a>
                  {" · "}
                  <a href={`https://unsplash.com/@${f.perfil}${UTM}`} target="_blank" rel="noopener noreferrer">{f.autor}</a>
                </p>
              </li>
            ))}
          </ul>
          <p className="ah-lic__nota">{t("cred.licencia")}</p>
        </div>
      </section>
    </>
  )
}
