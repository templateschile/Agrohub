# Agrohub

## Directorio de APIs agro (`/apis`)

Páginas HTML estáticas para SEO y motores de IA, generadas en el build desde `data/apis/*.json`
(copia del catálogo de la API central de AgroHubs, `agrohubs-app/api/src/hub/catalog/`).

- `npm run apis` genera en `public/`: `/apis` (landing con costos, rankings y radar), `/apis/ranking`,
  `/apis/radar`, una ficha por API (`/apis/<slug>`), categorías, casos de uso, `/apis/<slug>.md`,
  `/apis/catalogo.json`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml` y `/robots.txt`.
- `npm run build` lo ejecuta antes de `vite build`; los archivos generados no se versionan.
- Vercel sirve `/apis/<slug>` desde `<slug>.html` con `cleanUrls`; el resto sigue en la SPA.
- Enlazado desde el footer (`src/components/Footer.jsx`). Para actualizar datos: copiar los JSON
  del catálogo a `data/apis/` y volver a construir.
