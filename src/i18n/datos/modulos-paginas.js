// Traducción del contenido de las páginas de módulo (campo `pagina` de src/lib/modulos.js), por `key`.
// Forma: { en: { bitacora: { pagina: { badge, titulo, ... } } }, pt: { ... } }. Ver localizar() en src/i18n/idiomas.js.
// Arreglos (features, pasos) van en el mismo orden que en español. Las rutas (aviso.enlace.ruta) no se
// traducen: localizar() deja las del español y el enlace agrega el prefijo del idioma.
export default {
  en: {
    bitacora: {
      pagina: {
        badge: "Field notebook (farm log)",
        titulo: "Everything that happens in the field,", destacado: "logged by block",
        bajada: "Log field work, inputs and harvest from your phone as it happens. Every entry is tied to its block and its farm.",
        features: [
          { titulo: "Field work log", desc: "Pruning, irrigation, spraying or any other task, with the date and who did it." },
          { titulo: "Inputs", desc: "What was applied, how much and where, so the history is always at hand." },
          { titulo: "Harvest", desc: "What each block yielded, so you can compare seasons." },
          { titulo: "Traceability by block", desc: "The full history of each block in one place." },
          { titulo: "Export", desc: "Download your records for audits, certifications or your advisor." },
        ],
        pasos: [
          "You set up the blocks on your farm.",
          "You log field work, inputs and harvest from your phone.",
          "You review the history by block and export it whenever you need it.",
        ],
      },
    },
    fuentes: {
      pagina: {
        badge: "External sources",
        titulo: "Bulletins, weather and Chilean public data,", destacado: "next to your own",
        bajada: "AgroHubs brings together technical publications, weather stations and Chilean public data, so the assistant and your team can answer citing the source.",
        features: [
          { titulo: "Technical publications", desc: "Bulletins and guides from INIA, searchable by topic and crop." },
          { titulo: "Agrometeorology", desc: "Stations from Chile's National Agroclimatic Network and CEAZA-Met, next to your farm's weather." },
          { titulo: "Chilean public data", desc: "ODEPA prices, soils and orchard census from IDE Minagri, and climate risk from ARClim." },
          { titulo: "Your own repository", desc: "Documents from the demonstration center, public or private." },
        ],
        pasos: [
          "Together with your hub, we choose the sources that serve its area.",
          "We connect them from the AgroHubs panel.",
          "They show up in search and in the assistant's answers.",
        ],
      },
    },
    clima: {
      pagina: {
        badge: "Weather and agrometeorology",
        titulo: "Forecast and stations", destacado: "for your farm",
        bajada: "Forecasts for the exact location of your field, data from nearby agrometeorological stations, and the indicators that matter for irrigation and spraying.",
        features: [
          { titulo: "Forecast for each farm", desc: "Temperature, rain, wind and humidity for your field's coordinates." },
          { titulo: "Nearby stations", desc: "Data from the agrometeorological network next to your own sensors." },
          { titulo: "Evapotranspiration", desc: "Daily ETo to work out how much water to replace in each sector." },
          { titulo: "Alerts", desc: "Frost, heat and rain turn into advice for your crop." },
        ],
        pasos: [
          "You register your farm with its location.",
          "AgroHubs checks the forecast and the nearby stations.",
          "You see the weather in the app and on the dashboard, and you get the alerts.",
        ],
      },
    },
    recomendaciones: {
      pagina: {
        badge: "Weather-based advice",
        titulo: "Alerts in time", destacado: "for frost, heat, rain and wind",
        bajada: "Twice a day AgroHubs checks the forecast for each farm and drafts specific advice for your crop. Your demonstration center approves it, or it goes out automatically if you choose.",
        features: [
          { titulo: "Frost", desc: "Advance warning when the low drops below 2 °C, with the protection measures to turn on." },
          { titulo: "Heat", desc: "Above 32 °C: shift irrigation times and avoid spraying in the hottest hours." },
          { titulo: "Rain", desc: "Postpone fertilizing and foliar sprays, and check drainage before it rains." },
          { titulo: "Wind", desc: "Strong wind is no time to spray or fly drones. We tell you which days to avoid." },
          { titulo: "Irrigation with ETo", desc: "How many millimeters to replace, based on evapotranspiration and your crop coefficient." },
          { titulo: "Spraying window", desc: "The best time of the week to spray: little wind, no rain and the right temperature." },
        ],
        pasos: [
          "AgroHubs matches your farm's forecast with your crop and your data.",
          "It writes the advice in plain words, with one clear action.",
          "Your demonstration center reviews and approves it, or it goes out automatically.",
          "It reaches you in the app and on the dashboard, with a bell notification.",
        ],
      },
    },
    calculadoras: {
      pagina: {
        badge: "Calculators",
        titulo: "The right rates,", destacado: "without spreadsheets",
        bajada: "Agronomic calculators for fertilizer, soil amendments and spraying, made to use in the field from your phone.",
        features: [
          { titulo: "Fertilizer", desc: "How much to apply by crop, stage and area." },
          { titulo: "Soil amendments", desc: "Lime rates and other soil corrections." },
          { titulo: "Spraying", desc: "Tank mixes and volumes per hectare." },
          { titulo: "Your own parameters", desc: "Each hub can adjust the calculators to its crops." },
        ],
        pasos: [
          "You choose the calculator and your crop.",
          "You enter the area and the stage.",
          "You get the rate and save it to your farm.",
        ],
      },
    },
    tienda: {
      pagina: {
        badge: "Digital Market",
        titulo: "Digital Market",
        bajada: "Products and Services",
        texto: "What the hubs in the network and outside suppliers offer, in one online store.",
        features: [
          { titulo: "Products from the hubs", desc: "Harvests and inputs posted by the growers in each hub." },
          { titulo: "Services", desc: "Farm services from the network and from outside suppliers." },
          { titulo: "Outside suppliers", desc: "Companies outside the network sell in the same market." },
          { titulo: "Online orders and payment", desc: "Cart, order and payment link." },
        ],
        pasos: [
          "Each hub and each supplier posts its products and services.",
          "Buyers across the network find them in one catalog.",
          "They order, pay online and arrange delivery with the seller.",
        ],
      },
    },
  },

  pt: {
    bitacora: {
      pagina: {
        badge: "Caderno de campo",
        titulo: "O que acontece no campo,", destacado: "registrado por talhão",
        bajada: "Anote tarefas, insumos e colheita pelo celular, na hora em que acontecem. Cada registro fica ligado ao talhão e à propriedade.",
        features: [
          { titulo: "Registro de tarefas", desc: "Poda, irrigação, aplicações e qualquer outra tarefa, com data e responsável." },
          { titulo: "Insumos", desc: "O que foi aplicado, quanto e onde, com o histórico sempre à mão." },
          { titulo: "Colheita", desc: "O que cada talhão produziu, para comparar safras." },
          { titulo: "Rastreabilidade por talhão", desc: "O histórico completo de cada talhão em um só lugar." },
          { titulo: "Exportação", desc: "Baixe os registros para auditorias, certificações ou para o seu consultor." },
        ],
        pasos: [
          "Você cadastra os talhões da sua propriedade.",
          "Registra tarefas, insumos e colheita pelo celular.",
          "Consulta o histórico por talhão e exporta quando precisar.",
        ],
      },
    },
    fuentes: {
      pagina: {
        badge: "Fontes externas",
        titulo: "Boletins, clima e dados públicos do Chile,", destacado: "junto aos seus dados",
        bajada: "A AgroHubs reúne publicações técnicas, estações agrometeorológicas e dados públicos chilenos para que o assistente e a sua equipe respondam citando a fonte.",
        features: [
          { titulo: "Publicações técnicas", desc: "Boletins e guias do INIA, pesquisáveis por tema e cultura." },
          { titulo: "Agrometeorologia", desc: "Estações da Rede Agroclimática Nacional do Chile e da CEAZA-Met junto ao clima da sua propriedade." },
          { titulo: "Dados públicos do Chile", desc: "Preços da ODEPA, solos e cadastro frutícola da IDE Minagri e risco climático do ARClim." },
          { titulo: "Repositório próprio", desc: "Documentos do centro demonstrativo, públicos ou privados." },
        ],
        pasos: [
          "Escolhemos com o seu hub as fontes que servem à sua região.",
          "Conectamos essas fontes pelo painel da AgroHubs.",
          "Elas ficam disponíveis na busca e nas respostas do assistente.",
        ],
      },
    },
    clima: {
      pagina: {
        badge: "Clima e agrometeorologia",
        titulo: "Previsão e estações", destacado: "para a sua propriedade",
        bajada: "Previsão para a localização exata do seu campo, dados de estações agrometeorológicas próximas e os indicadores que importam para irrigar e aplicar.",
        features: [
          { titulo: "Previsão por propriedade", desc: "Temperatura, chuva, vento e umidade para as coordenadas do seu campo." },
          { titulo: "Estações próximas", desc: "Dados da rede agrometeorológica junto com os seus próprios sensores." },
          { titulo: "Evapotranspiração", desc: "ETo diária para calcular quanta água repor em cada setor." },
          { titulo: "Alertas", desc: "Geada, calor e chuva viram recomendações para a sua cultura." },
        ],
        pasos: [
          "Você cadastra a sua propriedade com a localização.",
          "A AgroHubs consulta a previsão e as estações próximas.",
          "Você vê o clima no app e no painel, e recebe os alertas.",
        ],
      },
    },
    recomendaciones: {
      pagina: {
        badge: "Recomendações pelo clima",
        titulo: "Alertas a tempo", destacado: "para geada, calor, chuva e vento",
        bajada: "Duas vezes por dia a AgroHubs confere a previsão de cada propriedade e prepara recomendações concretas para a sua cultura. O seu centro demonstrativo aprova, ou elas são enviadas automaticamente, se você preferir.",
        features: [
          { titulo: "Geada", desc: "Aviso antecipado quando a mínima fica abaixo de 2 °C, com as medidas de proteção a acionar." },
          { titulo: "Calor", desc: "Acima de 32 °C: ajuste os horários de irrigação e evite aplicações nas horas mais quentes." },
          { titulo: "Chuva", desc: "Adie adubações e aplicações foliares, e revise a drenagem antes da chuva." },
          { titulo: "Vento", desc: "Com vento forte não é hora de aplicar nem de voar com drone. Avisamos quais dias evitar." },
          { titulo: "Irrigação com ETo", desc: "Quantos milímetros repor, de acordo com a evapotranspiração e o coeficiente da sua cultura." },
          { titulo: "Janela de aplicação", desc: "O melhor momento da semana para aplicar: pouco vento, sem chuva e temperatura adequada." },
        ],
        pasos: [
          "A AgroHubs cruza a previsão da sua propriedade com a sua cultura e os seus dados.",
          "Prepara a recomendação com um texto claro e uma ação concreta.",
          "O seu centro demonstrativo revisa e aprova, ou ela é enviada automaticamente.",
          "Ela chega no app e no painel, com aviso no sino.",
        ],
      },
    },
    calculadoras: {
      pagina: {
        badge: "Calculadoras",
        titulo: "Doses certas,", destacado: "sem planilhas",
        bajada: "Calculadoras agronômicas de adubação, corretivos e aplicações, feitas para usar no campo pelo celular.",
        features: [
          { titulo: "Adubação", desc: "Quanto aplicar conforme a cultura, a fase e a área." },
          { titulo: "Corretivos", desc: "Doses de calcário e outras correções de solo." },
          { titulo: "Aplicações", desc: "Preparo de caldas e volumes por hectare." },
          { titulo: "Parâmetros próprios", desc: "Cada hub pode ajustar as calculadoras às suas culturas." },
        ],
        pasos: [
          "Você escolhe a calculadora e a cultura.",
          "Informa a área e a fase.",
          "Recebe a dose e salva na sua propriedade.",
        ],
      },
    },
    tienda: {
      pagina: {
        badge: "Feira Digital",
        titulo: "Feira Digital",
        bajada: "Produtos e Serviços",
        texto: "O que os hubs da rede e os fornecedores externos oferecem, em uma só loja on-line.",
        features: [
          { titulo: "Produtos dos hubs", desc: "Colheitas e insumos que os agricultores de cada hub publicam." },
          { titulo: "Serviços", desc: "Serviços para o campo, da rede e de fornecedores externos." },
          { titulo: "Fornecedores externos", desc: "Empresas de fora da rede vendem na mesma feira." },
          { titulo: "Pedido e pagamento on-line", desc: "Carrinho, pedido e link de pagamento." },
        ],
        pasos: [
          "Cada hub e cada fornecedor publica seus produtos e serviços.",
          "Os compradores de toda a rede os encontram em um só catálogo.",
          "Fazem o pedido, pagam on-line e combinam a entrega com quem vende.",
        ],
      },
    },
  },
}
