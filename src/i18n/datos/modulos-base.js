// Nombre, nombre corto, descripción y etiqueta del diagrama de los 12 módulos (src/lib/modulos.js) en
// inglés y portugués, por `key`. El contenido de cada página de módulo va en modulos-paginas.js.
// `etiqueta`: nombre para el diagrama del ecosistema cuando el corto no cabe (también en español).
export default {
  es: {
    recomendaciones: { etiqueta: "Avisos" },
  },
  en: {
    dashboard_sensores: { nombre: "Dashboard and sensors", corto: "Sensors", descripcion: "Your weather stations and sensors in one panel, with readings, charts and alerts. It works with the brands you already use." },
    bitacora: { nombre: "Field log and traceability", corto: "Field log", descripcion: "Log field work, inputs and harvest from your phone, block by block." },
    chat_ia: { nombre: "Farm AI chat", corto: "AI chat", descripcion: "An assistant that answers technical questions in plain language, backed by reliable documents." },
    documentos: { nombre: "Technical library", corto: "Library", descripcion: "Technical documents and data sheets, organized and searchable. Upload your own and choose whether they are public or private." },
    fuentes: { nombre: "External sources", corto: "Sources", descripcion: "Information from external sources (MODAG, Kadi, INIA and others) next to your own data." },
    clima: { nombre: "Weather and agrometeorology", corto: "Weather", descripcion: "Forecasts and agrometeorological data for your area." },
    recomendaciones: { nombre: "Weather-based advice", corto: "Advice", etiqueta: "Alerts", descripcion: "Farm alerts from your field's forecast: frost, heat, rain, wind, irrigation and spraying windows." },
    fenologia: { nombre: "Crop stages", corto: "Phenology", descripcion: "Phenological stages for each crop, with management advice for each one." },
    calculadoras: { nombre: "Calculators", corto: "Calculators", descripcion: "Agronomic calculators for rates and costs." },
    eventos: { nombre: "Training and events", corto: "Events", descripcion: "Field days, training sessions and events from your hub." },
    tienda: { nombre: "Harvest market and store", corto: "Market", descripcion: "A catalog of products and inputs, plus harvest sales between growers in the network." },
    drones: { nombre: "Request drones (DronX)", corto: "Drones", descripcion: "Order drone services (spraying, NDVI, mapping, plant counts) from DronX operators." },
  },
  pt: {
    dashboard_sensores: { nombre: "Painel e sensores", corto: "Sensores", descripcion: "Suas estações e sensores em um só painel, com leituras, gráficos e alertas. Funciona com as marcas que você já usa." },
    bitacora: { nombre: "Caderno de campo e rastreabilidade", corto: "Caderno", descripcion: "Registre tarefas, insumos e colheita pelo celular, por talhão." },
    chat_ia: { nombre: "Chat de IA agrícola", corto: "Chat IA", descripcion: "Um assistente que responde dúvidas técnicas em linguagem simples, com base em documentos confiáveis." },
    documentos: { nombre: "Biblioteca técnica", corto: "Biblioteca", descripcion: "Documentos e fichas técnicas organizados e pesquisáveis. Envie os seus e escolha se são públicos ou privados." },
    fuentes: { nombre: "Fontes externas", corto: "Fontes", descripcion: "Informações de fontes externas (MODAG, Kadi, INIA e outras) junto aos seus dados." },
    clima: { nombre: "Clima e agrometeorologia", corto: "Clima", descripcion: "Previsão do tempo e dados agrometeorológicos para a sua região." },
    recomendaciones: { nombre: "Recomendações pelo clima", corto: "Recomendações", etiqueta: "Alertas", descripcion: "Alertas agronômicos pela previsão da sua propriedade: geada, calor, chuva, vento, irrigação e janelas de aplicação." },
    fenologia: { nombre: "Fases fenológicas", corto: "Fenologia", descripcion: "Fases fenológicas de cada cultura, com recomendações de manejo." },
    calculadoras: { nombre: "Calculadoras", corto: "Calculadoras", descripcion: "Calculadoras agronômicas de doses e custos." },
    eventos: { nombre: "Capacitações e eventos", corto: "Eventos", descripcion: "Dias de campo, capacitações e eventos do seu hub." },
    tienda: { nombre: "Mercado de colheita e loja", corto: "Mercado", descripcion: "Catálogo de produtos e insumos, e venda de colheita entre produtores da rede." },
    drones: { nombre: "Solicitar drones (DronX)", corto: "Drones", descripcion: "Peça serviços com drone (aplicação, NDVI, mapeamento, contagem de plantas) a operadores da DronX." },
  },
}
