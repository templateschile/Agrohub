// Módulos anunciados que la plataforma todavía no tiene (no están en api/src/predios/catalogo.js).
// Se muestran como "Próximamente": en el ecosistema, en el índice de módulos y en ningún otro lado como
// si existieran. Sin página propia ni funciones inventadas. Textos en src/i18n/datos/modulos-base.js.
import { Package } from "lucide-react"

export const MODULOS_PROXIMOS = [
  { key: "insumos", slug: "insumos", icono: Package, proximamente: true },
]
