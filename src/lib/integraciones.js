// Integraciones de AgroHubs con fuentes externas. Fuente única para el índice /integraciones, la página de
// cada integración (/integraciones/<slug>), la sección de la portada, llms.txt, llms-full.txt y sitemap.xml
// (scripts/build-apis.mjs) y el HTML previo de cada página (scripts/prerender-integraciones.mjs).
// Datos puros, sin JSX ni íconos, para probarlos en scripts/tests.
//
// Lista verificada con la documentación oficial de cada fuente (nov. 2026). Para agregar una integración:
// sumar un objeto aquí, en el grupo que corresponda, y su traducción en src/i18n/datos/integraciones.js.
// No se agregan fuentes que no estén verificadas ni se promete lo que la documentación no dice. Sin precios.
//
// Campos:
// - `grupo`: sección del índice. Los grupos van en el orden de GRUPOS.
// - `estado`: "disponible" (funciona sin clave o ya está en AgroHubs) o "cuenta" (se activa cuando el cliente
//   carga en el panel de AgroHubs su credencial del proveedor).
// - `enlace` y `tipoEnlace`: documentación oficial ("documentacion") o sitio oficial ("sitio").
// - `tema`: completa el título de la página: «<nombre> en AgroHubs: <tema>».
// - `resumen`: bajada de la página y meta description (155 caracteres o menos).
// - `datos`: qué datos trae. `usos`: para qué le sirve al agricultor. `como`: cómo se conecta, sin claves.
// - `cobertura`: zona que cubre, cuando la fuente la acota.
// Agrometeorología INIA no tiene API pública: AgroHubs lee la Red Agroclimática Nacional en agrometeorologia.cl.

export const GRUPOS = ["chile", "clima", "satelite", "estaciones"]
export const ESTADOS_INTEGRACION = ["disponible", "cuenta"]

export const INTEGRACIONES = [
  // ── Chile ──
  {
    slug: "agrometeorologia-inia",
    nombre: "Agrometeorología INIA",
    organizacion: "INIA, Red Agroclimática Nacional",
    grupo: "chile", estado: "disponible",
    enlace: "https://agrometeorologia.cl", tipoEnlace: "sitio",
    cobertura: "Todo Chile",
    tema: "estaciones agroclimáticas de todo Chile",
    resumen: "Temperatura, humedad, lluvia, viento, radiación, horas frío y grados día de la Red Agroclimática Nacional, junto a los datos de tu predio.",
    datos: ["Temperatura", "Humedad relativa", "Lluvia", "Viento", "Radiación solar", "Horas frío", "Grados día"],
    usos: [
      "Seguir las heladas con la estación más cercana a tu predio.",
      "Decidir el riego con datos de tu zona.",
      "Llevar la cuenta de horas frío y grados día de la temporada.",
    ],
    como: "AgroHubs lee la Red Agroclimática Nacional en agrometeorologia.cl, con unas 486 estaciones de INIA, CEAZA, la Dirección Meteorológica de Chile y otras instituciones, y muestra sus datos junto a los de tu predio.",
  },
  {
    slug: "ceaza-met",
    nombre: "CEAZA-Met",
    organizacion: "CEAZA, Centro de Estudios Avanzados en Zonas Áridas",
    grupo: "chile", estado: "disponible",
    enlace: "https://www.ceazamet.cl/ws/pop_ws_doc.php", tipoEnlace: "documentacion",
    cobertura: "Atacama y Coquimbo, más algunas estaciones del sur y Rapa Nui",
    tema: "estaciones meteorológicas del Norte Chico",
    resumen: "Series horarias, diarias y mensuales de las estaciones CEAZA-Met en Atacama y Coquimbo, con registros desde 2004, junto a los datos de tu predio.",
    datos: ["Temperatura", "Humedad relativa", "Viento", "Lluvia", "Series horarias, diarias y mensuales por sensor", "Registros desde 2004"],
    usos: [
      "Seguir las heladas en el Norte Chico.",
      "Calcular horas frío y grados día.",
      "Planificar el riego con estaciones cercanas a tu predio.",
    ],
    como: "AgroHubs consulta el servicio web de CEAZA-Met y trae las series de las estaciones cercanas a tu predio.",
  },
  {
    slug: "dmc-meteochile",
    nombre: "Dirección Meteorológica de Chile",
    organizacion: "Dirección Meteorológica de Chile (DMC)",
    grupo: "chile", estado: "cuenta",
    enlace: "https://climatologia.meteochile.gob.cl/application/documentacion/getDocumento/2", tipoEnlace: "documentacion",
    tema: "estaciones automáticas y pronóstico",
    resumen: "Estaciones automáticas de la DMC con históricos, índice UV, olas de calor y frío y pronóstico regional, junto a los datos de tu predio.",
    datos: [
      "Temperatura, mínima y máxima", "Punto de rocío", "Humedad relativa", "Radiación", "Presión", "Lluvia", "Viento",
      "Históricos", "Índice UV", "Olas de calor y de frío", "Pronóstico regional WRF",
    ],
    usos: [
      "Ver una helada mientras ocurre.",
      "Seguir la lluvia en tu zona.",
      "Planificar la semana con el pronóstico regional.",
    ],
    como: "AgroHubs trae los datos de las estaciones automáticas de la DMC y su pronóstico regional.",
  },
  {
    slug: "odepa-precios",
    nombre: "ODEPA",
    organizacion: "Oficina de Estudios y Políticas Agrarias (ODEPA), Ministerio de Agricultura",
    grupo: "chile", estado: "disponible",
    enlace: "https://datos.odepa.gob.cl", tipoEnlace: "sitio",
    tema: "precios mayoristas y mercados agrícolas",
    resumen: "Precios mayoristas diarios de frutas y hortalizas por mercado, región, variedad y calidad, precios al consumidor y comercio exterior agrícola.",
    datos: [
      "Precios mayoristas diarios de frutas y hortalizas", "Por mercado, región, variedad y calidad", "Precios al consumidor",
      "Comercio exterior", "Catastro frutícola",
    ],
    usos: [
      "Decidir cuándo y dónde vender.",
      "Comparar tu precio con el del mercado mayorista.",
    ],
    como: "AgroHubs consulta el portal de datos abiertos de ODEPA.",
  },
  {
    slug: "ide-minagri",
    nombre: "IDE Minagri",
    organizacion: "IDE Minagri y CIREN, con capas de CONAF",
    grupo: "chile", estado: "disponible",
    enlace: "https://ide.minagri.gob.cl/geoweb/directorio-de-servicios/", tipoEnlace: "documentacion",
    tema: "suelos, riego y plagas sobre el mapa de tu predio",
    resumen: "Catastro frutícola, capacidad de uso y análisis de suelos, trampas de plagas, uso de la tierra, infraestructura de riego e incendios.",
    datos: [
      "Catastro frutícola", "Capacidad de uso de suelos", "Análisis de suelos", "Trampas de plagas", "Uso de la tierra",
      "Infraestructura de riego", "Incendios",
    ],
    usos: [
      "Conocer el suelo de tu predio antes de plantar o fertilizar.",
      "Ver la infraestructura de riego y las trampas de plagas de tu zona.",
    ],
    como: "AgroHubs consulta los servicios de mapas del directorio de IDE Minagri y los cruza con la ubicación de tu predio.",
  },
  {
    slug: "arclim",
    nombre: "ARClim",
    organizacion: "Ministerio del Medio Ambiente",
    grupo: "chile", estado: "disponible",
    enlace: "https://arclim.mma.gob.cl/api/", tipoEnlace: "documentacion",
    tema: "riesgo climático por comuna",
    resumen: "Indicadores de riesgo climático por comuna, escenarios 2035 a 2065 y series de precipitación, temperatura, humedad, radiación y viento.",
    datos: [
      "Indicadores de riesgo climático por comuna", "Escenarios 2035 a 2065",
      "Series de precipitación, temperatura, humedad, radiación y viento",
    ],
    usos: [
      "Planificar a largo plazo con el riesgo climático de tu comuna.",
      "Sumar el riesgo climático a la planificación de instituciones y centros demostrativos.",
    ],
    como: "AgroHubs consulta la API de ARClim con la comuna de tu predio.",
  },
  {
    slug: "datos-gob-cl",
    nombre: "datos.gob.cl",
    organizacion: "Gobierno Digital",
    grupo: "chile", estado: "disponible",
    enlace: "https://datos.gob.cl", tipoEnlace: "sitio",
    tema: "plaguicidas autorizados del SAG y datos de riego",
    resumen: "El catálogo nacional de datos abiertos: plaguicidas autorizados del SAG, proyectos de la Ley de Riego de la CNR y derechos de agua de la DGA.",
    datos: ["Plaguicidas autorizados del SAG", "Proyectos de la Ley de Riego (CNR)", "Derechos de agua de la DGA"],
    usos: [
      "Revisar si un plaguicida está autorizado por el SAG.",
      "Consultar proyectos de riego y derechos de agua de tu zona.",
    ],
    como: "AgroHubs lee los conjuntos de datos del catálogo nacional datos.gob.cl.",
  },
  {
    slug: "banco-central",
    nombre: "Banco Central de Chile",
    organizacion: "Banco Central de Chile",
    grupo: "chile", estado: "cuenta",
    enlace: "https://si3.bcentral.cl/estadisticas/Principal1/Web_Services/acceso_api.html", tipoEnlace: "documentacion",
    tema: "dólar observado, UF e IPC",
    resumen: "Dólar observado, UF, IPC y tasas del Banco Central de Chile, para exportar y convertir precios.",
    datos: ["Dólar observado", "UF", "IPC", "Tasas"],
    usos: [
      "Convertir precios de exportación a pesos.",
      "Llevar precios y costos en UF.",
    ],
    como: "AgroHubs consulta los servicios web estadísticos del Banco Central.",
  },
  {
    slug: "cmf",
    nombre: "CMF",
    organizacion: "Comisión para el Mercado Financiero (CMF)",
    grupo: "chile", estado: "cuenta",
    enlace: "https://api.cmfchile.cl/documentacion/index.html", tipoEnlace: "documentacion",
    tema: "dólar, euro, UF, UTM e IPC",
    resumen: "Valores del dólar, el euro, la UF, la UTM y el IPC que publica la CMF, para créditos y cotizaciones.",
    datos: ["Dólar", "Euro", "UF", "UTM", "IPC"],
    usos: [
      "Calcular las cuotas de un crédito.",
      "Preparar cotizaciones con los valores del día.",
    ],
    como: "AgroHubs consulta la API de la CMF.",
  },
  {
    slug: "mercado-publico",
    nombre: "Mercado Público",
    organizacion: "ChileCompra",
    grupo: "chile", estado: "cuenta",
    enlace: "https://www.chilecompra.cl/api/", tipoEnlace: "documentacion",
    tema: "licitaciones y compras del Estado",
    resumen: "Licitaciones, órdenes de compra, compradores y proveedores de Mercado Público, para vender al Estado.",
    datos: ["Licitaciones", "Órdenes de compra", "Compradores", "Proveedores"],
    usos: [
      "Encontrar licitaciones de alimentos e insumos agrícolas.",
      "Revisar qué compra el Estado y a quién.",
    ],
    como: "AgroHubs consulta la API de Mercado Público.",
  },
  {
    slug: "cne-combustibles",
    nombre: "Combustibles CNE",
    organizacion: "Comisión Nacional de Energía (CNE)",
    grupo: "chile", estado: "cuenta",
    enlace: "https://apidocs.cne.cl/", tipoEnlace: "documentacion",
    tema: "precio del diésel por estación de servicio",
    resumen: "Precios de combustibles por estación de servicio, para calcular el costo del diésel de la maquinaria y del bombeo.",
    datos: ["Precios de combustibles por estación de servicio"],
    usos: [
      "Calcular el costo del diésel para maquinaria y bombeo.",
      "Comparar precios en las estaciones de servicio cercanas al predio.",
    ],
    como: "AgroHubs consulta la API de la CNE.",
  },

  // ── Heladas, frío y clima ──
  {
    slug: "open-meteo",
    nombre: "Open-Meteo",
    organizacion: "Open-Meteo",
    grupo: "clima", estado: "disponible",
    enlace: "https://open-meteo.com/en/docs", tipoEnlace: "documentacion",
    tema: "pronóstico a 16 días para heladas y riego",
    resumen: "Pronóstico hasta 16 días con temperatura mínima, punto de rocío, suelo, evapotranspiración ET0 y probabilidad de lluvia para tu predio.",
    datos: [
      "Temperatura mínima", "Punto de rocío", "Temperatura y humedad del suelo", "Evapotranspiración ET0",
      "Déficit de presión de vapor", "Radiación", "Probabilidad de lluvia", "Pronóstico hasta 16 días",
    ],
    usos: [
      "Recibir alertas de helada.",
      "Calcular el riego con la ET0.",
      "Llevar las horas frío.",
    ],
    como: "AgroHubs consulta el pronóstico de Open-Meteo con las coordenadas de tu predio.",
  },
  {
    slug: "meteoblue",
    nombre: "meteoblue",
    organizacion: "meteoblue",
    grupo: "clima", estado: "cuenta",
    enlace: "https://business.meteoblue.com/products/weather-apis/free-weather-api", tipoEnlace: "documentacion",
    tema: "pronóstico agrícola y mojamiento foliar",
    resumen: "Paquete agro de meteoblue: evapotranspiración, temperatura y humedad del suelo, punto de rocío, mojamiento foliar y tendencia a 14 días.",
    datos: ["Evapotranspiración", "Temperatura y humedad del suelo", "Punto de rocío", "Mojamiento foliar", "Tendencia a 14 días"],
    usos: [
      "Estimar el riesgo de enfermedades por mojamiento foliar.",
      "Planificar el riego con la evapotranspiración.",
    ],
    como: "AgroHubs consulta la API de meteoblue con las coordenadas de tu predio.",
  },
  {
    slug: "tomorrow-io",
    nombre: "Tomorrow.io",
    organizacion: "Tomorrow.io",
    grupo: "clima", estado: "cuenta",
    enlace: "https://docs.tomorrow.io/reference/data-layers-core", tipoEnlace: "documentacion",
    tema: "grados día y riesgo de hielo",
    resumen: "Punto de rocío, evapotranspiración, hielo y lluvia engelante, grados día y suelo, con pronóstico a 14 días para tu predio.",
    datos: [
      "Punto de rocío", "Evapotranspiración", "Hielo y lluvia engelante", "Grados día", "Temperatura y humedad del suelo",
      "Pronóstico a 14 días",
    ],
    usos: [
      "Seguir los grados día del cultivo.",
      "Anticipar el riesgo de hielo.",
    ],
    como: "AgroHubs consulta la API de Tomorrow.io con las coordenadas de tu predio.",
  },
  {
    slug: "nasa-power",
    nombre: "NASA POWER",
    organizacion: "NASA Langley",
    grupo: "clima", estado: "disponible",
    enlace: "https://power.larc.nasa.gov/docs/services/api/temporal/daily/", tipoEnlace: "documentacion",
    tema: "series climáticas históricas de tu predio",
    resumen: "Series diarias de varias décadas con temperatura mínima, lluvia, humedad de la zona de raíces y radiación para la ubicación de tu predio.",
    datos: ["Temperatura mínima", "Lluvia", "Humedad del suelo en la zona de raíces", "Radiación", "Series diarias de varias décadas"],
    usos: [
      "Calcular horas frío y grados día de temporadas pasadas.",
      "Comparar esta temporada con años anteriores.",
    ],
    como: "AgroHubs consulta la API diaria de NASA POWER con las coordenadas de tu predio.",
  },
  {
    slug: "visual-crossing",
    nombre: "Visual Crossing",
    organizacion: "Visual Crossing",
    grupo: "clima", estado: "cuenta",
    enlace: "https://www.visualcrossing.com/resources/documentation/weather-api/agriculture-elements-in-the-timeline-weather-api/", tipoEnlace: "documentacion",
    tema: "clima histórico con elementos agrícolas",
    resumen: "Temperatura mínima, punto de rocío y radiación, con elementos agrícolas como suelo, ET0, mojamiento foliar y grados día.",
    datos: [
      "Temperatura mínima", "Punto de rocío", "Radiación", "Temperatura y humedad del suelo", "Evapotranspiración ET0",
      "Mojamiento foliar", "Grados día",
    ],
    usos: [
      "Revisar el clima histórico de tu predio para el riego.",
      "Llevar los grados día.",
    ],
    como: "AgroHubs consulta la API Timeline de Visual Crossing con las coordenadas de tu predio.",
  },
  {
    slug: "weatherbit-ag",
    nombre: "Weatherbit Ag-Weather",
    organizacion: "Weatherbit",
    grupo: "clima", estado: "cuenta",
    enlace: "https://www.weatherbit.io/api/ag-weather-api-forecast", tipoEnlace: "documentacion",
    tema: "evapotranspiración y suelo a 8 días",
    resumen: "Pronóstico agrícola a 8 días con evapotranspiración FAO56, humedad y temperatura del suelo por profundidad y radiación.",
    datos: ["Evapotranspiración FAO56", "Humedad del suelo por profundidad", "Temperatura del suelo por profundidad", "Radiación", "Pronóstico a 8 días"],
    usos: [
      "Hacer el balance hídrico para regar.",
    ],
    como: "AgroHubs consulta la API Ag-Weather de Weatherbit con las coordenadas de tu predio.",
  },
  {
    slug: "copernicus-agera5",
    nombre: "Copernicus AgERA5",
    organizacion: "Copernicus Climate Data Store (ECMWF)",
    grupo: "clima", estado: "cuenta",
    enlace: "https://cds.climate.copernicus.eu/datasets/sis-agrometeorological-indicators", tipoEnlace: "documentacion",
    tema: "indicadores agroclimáticos diarios desde 1979",
    resumen: "AgERA5 diario desde 1979: temperatura, punto de rocío, humedad, déficit de presión de vapor, radiación, ET0, lluvia y viento.",
    datos: [
      "Temperatura", "Punto de rocío", "Humedad", "Déficit de presión de vapor", "Radiación", "Evapotranspiración ET0", "Lluvia",
      "Viento", "Datos diarios desde 1979",
    ],
    usos: [
      "Calcular horas frío, grados día y ET0 de años anteriores.",
    ],
    como: "AgroHubs descarga AgERA5 desde el Climate Data Store de Copernicus para la zona de tu predio.",
  },
  {
    slug: "nasa-firms",
    nombre: "NASA FIRMS",
    organizacion: "NASA",
    grupo: "clima", estado: "cuenta",
    enlace: "https://firms.modaps.eosdis.nasa.gov/api/area/", tipoEnlace: "documentacion",
    tema: "focos de incendio cerca de tu predio",
    resumen: "Focos de calor e incendios casi en tiempo real, para saber a tiempo si hay fuego cerca de tu predio.",
    datos: ["Focos de calor", "Incendios casi en tiempo real"],
    usos: [
      "Recibir una alerta si hay un incendio cerca del predio.",
    ],
    como: "AgroHubs consulta los focos de FIRMS en un área alrededor de tu predio.",
  },

  // ── Satélite, suelo y agua ──
  {
    slug: "copernicus-sentinel",
    nombre: "Copernicus Sentinel",
    organizacion: "Copernicus Data Space (ESA)",
    grupo: "satelite", estado: "cuenta",
    enlace: "https://documentation.dataspace.copernicus.eu/APIs.html", tipoEnlace: "documentacion",
    tema: "imágenes Sentinel y NDVI por cuartel",
    resumen: "Imágenes Sentinel-1 y Sentinel-2, con NDVI y estadísticas por polígono, para ver el vigor y el estrés de cada cuartel.",
    datos: ["Imágenes Sentinel-1", "Imágenes Sentinel-2", "NDVI", "Estadísticas por polígono"],
    usos: [
      "Ver el vigor de cada cuartel.",
      "Detectar estrés a tiempo.",
    ],
    como: "AgroHubs pide a Copernicus Data Space las imágenes y estadísticas del polígono de cada cuartel.",
  },
  {
    slug: "agromonitoring",
    nombre: "Agromonitoring",
    organizacion: "OpenWeather",
    grupo: "satelite", estado: "cuenta",
    enlace: "https://agromonitoring.com/api", tipoEnlace: "documentacion",
    tema: "NDVI y humedad de suelo por cuartel",
    resumen: "NDVI, EVI y NDWI por polígono, con temperatura y humedad del suelo y el clima de cada cuartel.",
    datos: ["NDVI", "EVI", "NDWI", "Temperatura del suelo", "Humedad del suelo", "Clima del polígono"],
    usos: [
      "Seguir el NDVI de cada cuartel.",
      "Revisar la humedad del suelo.",
    ],
    como: "AgroHubs registra el polígono de cada cuartel en Agromonitoring y trae sus índices.",
  },
  {
    slug: "earth-search",
    nombre: "Earth Search",
    organizacion: "Element 84, en AWS Open Data",
    grupo: "satelite", estado: "disponible",
    enlace: "https://earth-search.aws.element84.com/v1", tipoEnlace: "documentacion",
    tema: "imágenes satelitales abiertas",
    resumen: "Catálogo de imágenes Sentinel-2, Sentinel-1 y Landsat y modelo de elevación, para calcular un NDVI propio sin cuota.",
    datos: ["Imágenes Sentinel-2", "Imágenes Sentinel-1", "Imágenes Landsat", "Modelo de elevación"],
    usos: [
      "Calcular el NDVI de tus cuarteles sin cuota de uso.",
      "Ver la elevación del terreno.",
    ],
    como: "AgroHubs busca las imágenes en el catálogo Earth Search y calcula el NDVI de tus cuarteles.",
  },
  {
    slug: "nasa-appeears",
    nombre: "NASA AppEEARS",
    organizacion: "NASA LP DAAC",
    grupo: "satelite", estado: "cuenta",
    enlace: "https://appeears.earthdatacloud.nasa.gov/api/", tipoEnlace: "documentacion",
    tema: "series históricas de NDVI por predio",
    resumen: "NDVI de MODIS, temperatura superficial, humedad del suelo de SMAP y evapotranspiración, por punto o por área.",
    datos: ["NDVI de MODIS", "Temperatura superficial", "Humedad del suelo de SMAP", "Evapotranspiración"],
    usos: [
      "Ver la historia de NDVI de tu predio.",
    ],
    como: "AgroHubs pide a AppEEARS las series del punto o del área de tu predio.",
  },
  {
    slug: "google-earth-engine",
    nombre: "Google Earth Engine",
    organizacion: "Google",
    grupo: "satelite", estado: "cuenta",
    enlace: "https://developers.google.com/earth-engine/guides/access", tipoEnlace: "documentacion",
    tema: "imágenes satelitales y cálculo en la nube",
    resumen: "Catálogo de Sentinel-2, Landsat, MODIS, ERA5 y más, con cálculo en la nube, para NDVI y series históricas de tu zona.",
    datos: ["Sentinel-2", "Landsat", "MODIS", "ERA5", "Cálculo en la nube"],
    usos: [
      "Calcular el NDVI.",
      "Comparar series históricas de tu zona.",
    ],
    como: "AgroHubs hace el cálculo en la nube de Earth Engine y trae el resultado para tu predio.",
  },
  {
    slug: "soilgrids",
    nombre: "SoilGrids",
    organizacion: "ISRIC",
    grupo: "satelite", estado: "disponible",
    enlace: "https://docs.isric.org/globaldata/soilgrids/", tipoEnlace: "documentacion",
    tema: "textura y pH de referencia del suelo",
    resumen: "pH, carbono orgánico, arena, limo, arcilla, CIC y nitrógeno en seis profundidades, con resolución de 250 m.",
    datos: ["pH", "Carbono orgánico", "Arena, limo y arcilla", "Capacidad de intercambio catiónico (CIC)", "Nitrógeno", "Seis profundidades, a 250 m"],
    usos: [
      "Tener la textura y el pH de referencia de tu predio antes del análisis de suelo.",
    ],
    como: "AgroHubs consulta los servicios de mapas WCS y WMS de SoilGrids en la ubicación de tu predio.",
  },
  {
    slug: "fao-wapor",
    nombre: "FAO WaPOR",
    organizacion: "FAO",
    grupo: "satelite", estado: "disponible",
    enlace: "https://www.fao.org/in-action/remote-sensing-for-water-productivity/wapor-data-access/en", tipoEnlace: "documentacion",
    tema: "productividad del agua de riego",
    resumen: "Evapotranspiración real, transpiración y productividad primaria cada 10 días desde 2018, para medir la productividad del agua de riego.",
    datos: ["Evapotranspiración real", "Transpiración", "Productividad primaria", "Cada 10 días desde 2018"],
    usos: [
      "Comparar la productividad del agua de riego entre temporadas.",
    ],
    como: "AgroHubs consulta los datos de WaPOR para el área de tu predio.",
  },

  // ── Estaciones propias del agricultor ──
  {
    slug: "davis-weatherlink",
    nombre: "Davis WeatherLink",
    organizacion: "Davis Instruments",
    grupo: "estaciones", estado: "cuenta",
    enlace: "https://weatherlink.github.io/v2-api/", tipoEnlace: "documentacion",
    tema: "tu estación Davis en AgroHubs",
    resumen: "Las observaciones de tu estación Davis, junto a los demás datos de tu predio.",
    datos: ["Observaciones de tus estaciones Davis"],
    usos: [
      "Ver tu propia estación junto a las fuentes públicas.",
    ],
    como: "AgroHubs lee las observaciones de tu estación desde WeatherLink.",
  },
  {
    slug: "metos-fieldclimate",
    nombre: "METOS FieldClimate",
    organizacion: "Pessl Instruments (METOS)",
    grupo: "estaciones", estado: "cuenta",
    enlace: "https://api.fieldclimate.com/v2/docs/", tipoEnlace: "documentacion",
    tema: "tu estación METOS y modelos de enfermedades",
    resumen: "Datos de tu estación METOS, pronóstico, modelos de enfermedades por cultivo y cámaras de plagas, junto a los datos de tu predio.",
    datos: ["Datos de la estación", "Pronóstico", "Modelos de enfermedades por cultivo", "Cámaras de plagas"],
    usos: [
      "Ver tu propia estación junto a las fuentes públicas.",
      "Usar los modelos de enfermedades por cultivo.",
    ],
    como: "AgroHubs lee los datos de tu estación desde FieldClimate.",
  },
]

export const integracionPorSlug = (slug) => INTEGRACIONES.find((i) => i.slug === slug)
export const integracionesDeGrupo = (grupo) => INTEGRACIONES.filter((i) => i.grupo === grupo)
