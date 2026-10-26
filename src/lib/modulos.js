// Los 12 módulos de la app AgroHubs, tal como los ofrece la plataforma
// (templateschile/agrohubs-app: api/src/predios/catalogo.js, MODULOS). Mismas `key`, nombres y textos.
// `ruta`: página de demostración del módulo en este sitio, cuando existe.
// `corto`, `linea` y `color`: para la portada (ícono con nombre corto y una línea de lectura rápida).
import {
  Radio, NotebookPen, Sparkles, FolderOpen, Globe, Sun,
  Lightbulb, Flower2, Calculator, CalendarDays, Store, PlaneTakeoff,
} from "lucide-react"

export const MODULOS = [
  { key: "dashboard_sensores", corto: "Sensores", linea: "Tus sensores y alertas en un panel", color: "bosque", icono: Radio, ruta: "/dashboard", nombre: "Dashboard y sensores", descripcion: "Tus estaciones y sensores en un solo panel, con lecturas, gráficos y alertas. Se conecta con las marcas que ya usas." },
  { key: "bitacora", corto: "Bitácora", linea: "Labores, insumos y cosecha desde el celular", color: "tierra", icono: NotebookPen, nombre: "Bitácora y trazabilidad", descripcion: "Registro de labores, insumos y cosecha desde el celular, por cuartel." },
  { key: "chat_ia", corto: "AI Chat", linea: "Respuestas técnicas en lenguaje simple", color: "cielo", icono: Sparkles, ruta: "/ai-chat", nombre: "AI Chat agrícola", descripcion: "Asistente que responde consultas técnicas en lenguaje simple, apoyado en documentos confiables." },
  { key: "documentos", corto: "Biblioteca", linea: "Fichas y documentos técnicos ordenados", color: "ciruela", icono: FolderOpen, ruta: "/documentos", nombre: "Biblioteca técnica", descripcion: "Documentos y fichas técnicas organizados y buscables. Sube los tuyos y decide si son públicos o privados." },
  { key: "fuentes", corto: "Fuentes", linea: "MODAG, Kadi e INIA junto a tus datos", color: "cielo", icono: Globe, nombre: "Fuentes externas", descripcion: "Información de fuentes externas (MODAG, Kadi, INIA y otras) junto a tus datos." },
  { key: "clima", corto: "Clima", linea: "Pronóstico y estaciones de tu zona", color: "ambar", icono: Sun, nombre: "Clima y agrometeorología", descripcion: "Pronóstico y datos agrometeorológicos para tu zona." },
  { key: "recomendaciones", corto: "Avisos", linea: "Alertas de helada, calor, lluvia y riego", color: "ambar", icono: Lightbulb, nombre: "Recomendaciones por clima", descripcion: "Avisos agronómicos según el pronóstico de tu predio: heladas, calor, lluvia, viento, riego y ventanas para aplicar." },
  { key: "fenologia", corto: "Fenología", linea: "Fases del cultivo y su manejo", color: "bosque", icono: Flower2, nombre: "Fases fenológicas", descripcion: "Fases fenológicas por cultivo con sus recomendaciones de manejo." },
  { key: "calculadoras", corto: "Calculadoras", linea: "Dosis y costos agronómicos", color: "ciruela", icono: Calculator, nombre: "Calculadoras", descripcion: "Calculadoras agronómicas de dosis y costos." },
  { key: "eventos", corto: "Eventos", linea: "Días de campo y capacitaciones", color: "tierra", icono: CalendarDays, ruta: "/eventos", nombre: "Capacitaciones y eventos", descripcion: "Días de campo, capacitaciones y eventos de tu hub." },
  { key: "tienda", corto: "Mercado", linea: "Insumos y venta de cosecha en la red", color: "bosque", icono: Store, ruta: "/tienda", nombre: "Mercado de cosecha / tienda", descripcion: "Catálogo de productos e insumos y venta de cosecha entre productores de la red." },
  { key: "drones", corto: "Drones", linea: "Aplicación, NDVI y mapeo con DronX", color: "cielo", icono: PlaneTakeoff, nombre: "Solicitar drones (DronX)", descripcion: "Pide servicios con dron (aplicación, NDVI, mapeo, conteo) a operadores de DronX." },
]
