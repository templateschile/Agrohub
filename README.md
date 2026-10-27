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

## Apps del ecosistema (`/apps/<slug>`) y diagrama de la portada

- Menú **Apps** y páginas de AgroCiclo, DronX y AgroSeller desde `src/lib/apps.js`, con una plantilla
  común (`src/pages/AppPagina.jsx`). AgroHubs es la portada (`/`).
- Video de cada app: `public/videos/<slug>.mp4` y su portada `public/videos/<slug>.jpg`. Si el archivo no
  está, la página muestra «Video próximamente» (`src/components/AppVideo.jsx`).
- «Confían en nosotros» y partner: `src/lib/confianza.js`. Para pasar de texto a logo, poner la ruta
  del archivo en `logo` (p. ej. `/marcas/uc.svg`, en `public/marcas/`).
- Diagrama del ecosistema (`src/components/EcosystemDiagram.jsx`): módulos de `src/lib/modulos.js`,
  integraciones por categoría desde `data/apis/destacadas.json` (lo genera `npm run apis` a partir del
  catálogo) y sistemas generales de `src/lib/ecosistema.js`.

## Pruebas

`npm test` (node:test, sin dependencias): datos de las apps, confianza, video, módulos con página,
resumen del catálogo por categoría y que los textos del diagrama no se pisen.
