// ¿Existe el video? Se revisa con un HEAD: en Vercel una ruta inexistente responde el index.html
// de la SPA (200, text/html), por eso se exige un content-type de video. Se prueba en scripts/tests.
export async function hayVideo(src, pedir = fetch) {
  try {
    const r = await pedir(src, { method: "HEAD" })
    return r.ok && (r.headers.get("content-type") || "").startsWith("video/")
  } catch {
    return false
  }
}
