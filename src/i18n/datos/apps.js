// Traducción de src/lib/apps.js por `slug`, con los mismos campos de texto (y los arreglos del mismo largo).
// Forma: { en: { dronx: { promesa, bajada, problemas: [...], ... } }, pt: { ... } }. Ver localizar().
// Los nombres de las apps, las rutas, los sitios y los destinos no se traducen: salen de lib/apps.js.
// scripts/tests/apps.test.mjs revisa que no falte ningún texto.

export default {
  en: {
    agrohubs: {
      promesa: "Build your Agricultural Demonstration Center",
    },
    agrociclo: {
      promesa: "Turn your farm waste into value",
      bajada: "AgroCiclo connects growers with recyclers who pick up, price and recycle farm waste. You request everything from your phone.",
      cta: "Go to AgroCiclo",
      otra: { texto: "How it works" },
      problemas: [
        {
          problema: "Irrigation plastics, containers and scrap metal pile up on the farm with no clear way to get them collected.",
          solucion: "You post the materials with photos and a location, and request a pickup from your phone.",
        },
        {
          problema: "You don't know what the material you hand over is worth.",
          solucion: "The recycler records the actual weight and applies the per-kilo price of each material. You see the breakdown before you confirm.",
        },
        {
          problema: "For recyclers, finding material nearby means phone calls and wasted trips.",
          solucion: "They see nearby requests as they come in and drive straight to the farm.",
        },
      ],
      pasos: [
        { titulo: "Register your farm", texto: "Add the location, the crop type and the materials you need picked up." },
        { titulo: "Request a pickup", texto: "Nearby recyclers get notified. One of them checks the request, comes to the farm and takes the material." },
        { titulo: "Get your valuation", texto: "The value of the material is calculated. You confirm it and earn points for every completed pickup." },
      ],
      paraQuien: [
        { titulo: "Growers", texto: "Who want this season's waste off the farm and something in return." },
        { titulo: "Recyclers", texto: "Who look for material nearby and want to earn from every pickup." },
        { titulo: "Demonstration centers", texto: "That want to organize waste pickup for the growers in their network." },
      ],
      conexion: [
        "AgroHubs organizes the farm and its data, and AgroCiclo handles what leaves the farm as waste.",
        "Your demonstration center can add AgroCiclo as the waste pickup channel for its growers.",
        "Whatever doesn't sell on AgroSeller can be sent to AgroCiclo.",
      ],
      faq: [
        {
          q: "What materials can be recycled?",
          a: "Irrigation plastics (film, drip tape and hoses), empty agrochemical containers that have been properly rinsed, PVC pipe, farm scrap metal and other farm waste. The recycler confirms the materials on arrival.",
        },
        {
          q: "How much does it cost?",
          a: "It depends on the material and its value. You may receive a net payment or pay a minimum service fee, and you always see the valuation before you confirm.",
        },
        {
          q: "How is the valuation calculated?",
          a: "The recycler records the actual weight, applies the per-kilo price for each type of material and deducts logistics when it applies. You get the full breakdown.",
        },
        {
          q: "What if there are no recyclers in my area yet?",
          a: "You can still sign up. Coverage is growing and we'll let you know when there are recyclers nearby.",
        },
      ],
      cierre: {
        titulo: "Get the waste off your farm and put a value on it",
        texto: "Register your farm on AgroCiclo and request your first pickup.",
      },
    },
    dronx: {
      promesa: "Drone services on demand",
      bajada: "DronX, built by OlaDigital, connects people who need drone work with the operators in its network. From AgroHubs you request the service and it goes out with your farm's data.",
      cta: "Request through AgroHubs",
      otra: { texto: "Visit the DronX website" },
      problemas: [
        {
          problema: "Finding an available drone operator near the farm takes time.",
          solucion: "You request the service and it goes out to the operators in the DronX network.",
        },
        {
          problema: "Every flight is quoted and scheduled over the phone.",
          solucion: "Each type of service shows an estimated base price before you book. Custom missions get a quote from the operator.",
        },
        {
          problema: "Maps and reports end up scattered across emails and USB drives.",
          solucion: "You download the deliverables in the app and, if you ordered through AgroHubs, you see them next to your farm.",
        },
      ],
      pasos: [
        { titulo: "Choose the service", texto: "Enter the type of service, the location, the date and the time. You can add instructions and reference images." },
        { titulo: "An operator flies it", texto: "An operator in the network accepts the mission and carries it out." },
        { titulo: "Get the deliverables", texto: "Download photos, videos, maps or reports, approve the mission and rate the service." },
      ],
      paraQuien: [
        { titulo: "Growers and farm managers", texto: "Who need spraying, maps or plant counts without buying a drone." },
        { titulo: "Demonstration centers and advisors", texto: "That want to offer drone services to the growers in their network." },
        { titulo: "Drone operators", texto: "Who get nearby requests and are paid for every completed mission." },
      ],
      conexion: [
        "You request the service from the AgroHubs app or your farm's dashboard, with the crop, hectares, location and date.",
        "The request reaches DronX with your farm's data.",
        "The request status and the deliverables come back to AgroHubs.",
      ],
      faq: [
        {
          q: "What farm services can I request?",
          a: "Drone spraying, NDVI maps, mapping and surveying, plant counts and thermal imaging, among others.",
        },
        {
          q: "How much does a service cost?",
          a: "Each type of service has a base price that you see as an estimate before booking. For custom missions, an operator sends you a quote that you can accept.",
        },
        {
          q: "How do I get the deliverables?",
          a: "The operator uploads them to the app and you download them from there. If you ordered through AgroHubs, they are also linked to your farm.",
        },
        {
          q: "Are there operators in my area?",
          a: "The network is growing. If there are no operators in your area yet, you can sign up and we'll let you know when one is nearby.",
        },
      ],
      cierre: {
        titulo: "Book your next drone service",
        texto: "Request it from the AgroHubs Drones module or visit the DronX website.",
      },
    },
    agroseller: {
      estado: "In development",
      promesa: "Sell your fruit straight to market vendors, by the lot and with reservations",
      bajada: "AgroSeller grew out of AgroCiclo so that growers and packhouses can sell fruit to market vendors and retailers. You post lots with a price and a minimum order, and the buyer reserves, picks up or asks for delivery. It's in development, and you can sign up to try it first.",
      cta: "Count me in",
      otra: { texto: "How it works" },
      problemas: [
        {
          problema: "Market vendors call several growers to find out what fruit is available, at what price and when.",
          solucion: "They search by fruit, distance and date, and see each lot's price, minimum order and pickup point in one place.",
        },
        {
          problema: "Growers sell over the phone and lose track of their stock and of what's already promised.",
          solucion: "Reservations come in at or above the minimum order. You confirm or decline them, and stock is only deducted when you confirm.",
        },
        {
          problema: "Fruit that doesn't sell in time goes to waste.",
          solucion: "Unconfirmed reservations expire and move to the waitlist. Whatever doesn't sell goes to AgroCiclo.",
        },
      ],
      pasos: [
        { titulo: "Post your lots", texto: "By species, variety, size grade and pack. Each variant has its own price, minimum order, stock, availability date, photos and pickup point." },
        { titulo: "The vendor reserves", texto: "They reserve at or above the minimum, choose pickup (day and time) or delivery, can leave a deposit and get the confirmation on WhatsApp." },
        { titulo: "You confirm and deliver", texto: "You confirm or decline the reservation. Confirming deducts the stock; if you don't confirm in time, the reservation expires." },
      ],
      incluye: {
        titulo: "How a lot is listed",
        etiqueta: "Each lot is organized by",
        jerarquia: ["Species", "Variety", "Size grade", "Pack: 10 kg box, bin or bulk"],
        grupos: [
          {
            titulo: "Each variant has",
            items: [
              "Price, with volume tiers",
              "Minimum order",
              "Stock",
              "Availability date",
              "Category: export, domestic market or commercial",
              "Photos",
              "Pickup point",
            ],
          },
          {
            titulo: "The market vendor",
            items: [
              "Searches by fruit, distance and date",
              "Reserves at or above the minimum order",
              "Chooses pickup (day and time) or delivery",
              "Can leave a deposit",
              "Gets the confirmation on WhatsApp",
            ],
          },
          {
            titulo: "Also",
            items: [
              "Recurring reservations, such as “every Friday for the market”",
              "A waitlist when stock runs out",
              "Ratings for growers and buyers",
              "An official reference price next to each lot, such as ODEPA's in Chile",
              "Whatever doesn't sell goes to AgroCiclo",
            ],
          },
        ],
      },
      paraQuien: [
        { titulo: "Growers and packhouses", texto: "With fruit for the domestic or commercial market, or export surplus, who want to sell by the lot with clear rules." },
        { titulo: "Market vendors and retailers", texto: "Who buy in volume every week and need to know what's available, where and when." },
        { titulo: "Demonstration centers", texto: "That want to open a sales channel for the growers in their network." },
      ],
      conexion: [
        "It grew out of AgroCiclo, and whatever doesn't sell on AgroSeller goes to AgroCiclo.",
        "It shows the reference price from ODEPA, in Chile, one of the sources AgroHubs already integrates.",
        "It adds lot reservations for market vendors to the AgroHubs Harvest market.",
      ],
      faq: [
        {
          q: "Can I use AgroSeller yet?",
          a: "Not yet. We're designing it with growers and market vendors. If you want to take part in the first trials, leave us your details.",
        },
        {
          q: "Can I buy less than the minimum?",
          a: "No. Each variant has a minimum order set by the grower, and reservations start at that minimum.",
        },
        {
          q: "What happens if the grower doesn't confirm my reservation?",
          a: "The reservation expires and the stock becomes available again. If there's a waitlist, the next person is notified.",
        },
        {
          q: "What is the reference price?",
          a: "It's the price an official source publishes for each product and market, such as ODEPA (Office of Agricultural Studies and Policies) in Chile. It appears next to the lot price so you can compare.",
        },
      ],
      cierre: {
        titulo: "Join the first trials",
        texto: "If you grow fruit or buy for the market, tell us about your business and we'll let you know when AgroSeller is ready.",
      },
    },
    fisaro: {
      promesa: "Farm assistance with over 50,000 technical documents in your pocket",
      bajada: "Fisaro, built by OlaDigital, gathers over 50,000 agricultural technical documents. Search by text, voice or photo, ask the AI assistant, check the weather by district, calculate fertilization and keep consulting offline.",
      cta: "Go to Fisaro",
      otra: { texto: "How it works" },
      problemas: [
        { problema: "Technical information is scattered across bulletins, sheets and manuals that are hard to find in the field.", solucion: "Over 50,000 technical documents in one app, searchable by text, voice or photo." },
        { problema: "An agronomic question in the field waits until you reach the advisor.", solucion: "The AI assistant answers right away, backed by the library's documents." },
        { problema: "Many farms have no signal.", solucion: "What you looked up stays available offline." },
      ],
      pasos: [
        { titulo: "Search", texto: "Type, speak or take a photo: the app finds the document or the answer." },
        { titulo: "Consult", texto: "Ask the AI assistant, check your district's weather or use the fertilization calculators." },
        { titulo: "Take the answer to the field", texto: "Save what you looked up and use it offline." },
      ],
      paraQuien: [
        { titulo: "Growers", texto: "Who need a technical answer on the spot, at the farm." },
        { titulo: "Advisors and technicians", texto: "Who look up sheets, bulletins and rates without carrying folders." },
        { titulo: "Students and training centers", texto: "Who want a technical library at hand." },
      ],
      conexion: [
        "Fisaro is a separate app by OlaDigital, with its own website and account.",
        "AgroHubs and Fisaro share the same development team.",
      ],
      faq: [
        { q: "What documents does it have?", a: "Over 50,000 agricultural technical documents: bulletins, sheets, manuals and publications." },
        { q: "Does it work without internet?", a: "Yes: what you looked up stays available offline." },
        { q: "How do I search?", a: "By text, by voice or with a photo." },
        { q: "Is it the same app as AgroHubs?", a: "No. Fisaro is OlaDigital's farm assistance app; AgroHubs is the platform for your Demonstration Center." },
      ],
      cierre: { titulo: "Download Fisaro", texto: "Go to fisaro.cl and start looking things up." },
    },
  },

  pt: {
    agrohubs: {
      promesa: "Crie seu Centro Demonstrativo Agrícola",
    },
    agrociclo: {
      promesa: "Transforme seus resíduos agrícolas em valor",
      bajada: "A AgroCiclo conecta produtores rurais a recicladores que coletam, avaliam e reciclam os resíduos da propriedade. Você pede tudo pelo celular.",
      cta: "Ir para a AgroCiclo",
      otra: { texto: "Como funciona" },
      problemas: [
        {
          problema: "Plásticos de irrigação, embalagens e metais se acumulam na propriedade sem uma coleta definida.",
          solucion: "Você publica os materiais com fotos e localização e pede a coleta pelo celular.",
        },
        {
          problema: "Você não sabe quanto vale o que entrega.",
          solucion: "O reciclador registra o peso real e aplica o valor por quilo de cada material. Você vê o detalhamento antes de confirmar.",
        },
        {
          problema: "Para o reciclador, achar material por perto significa ligações e viagens perdidas.",
          solucion: "Ele vê as solicitações próximas assim que chegam e vai direto à propriedade.",
        },
      ],
      pasos: [
        { titulo: "Cadastre sua propriedade", texto: "Informe a localização, o tipo de cultura e os materiais que você tem para coleta." },
        { titulo: "Peça a coleta", texto: "Os recicladores próximos recebem o aviso. Um deles verifica a solicitação, vai até a propriedade e retira o material." },
        { titulo: "Receba a avaliação", texto: "O valor do material é calculado. Você confirma e ganha pontos a cada coleta concluída." },
      ],
      paraQuien: [
        { titulo: "Produtores rurais", texto: "Que querem tirar da propriedade os resíduos da safra e receber algo em troca." },
        { titulo: "Recicladores", texto: "Que procuram material por perto e querem gerar renda a cada coleta." },
        { titulo: "Centros demonstrativos", texto: "Que querem organizar a coleta de resíduos dos produtores da sua rede." },
      ],
      conexion: [
        "A AgroHubs organiza a propriedade e seus dados, e a AgroCiclo cuida do que sai da propriedade como resíduo.",
        "Seu centro demonstrativo pode adotar a AgroCiclo como canal de coleta de resíduos para os seus produtores.",
        "O que não é vendido na AgroSeller pode ir para a AgroCiclo.",
      ],
      faq: [
        {
          q: "Quais materiais podem ser reciclados?",
          a: "Plásticos de irrigação (filme, fitas e mangueiras), embalagens vazias e bem lavadas de agroquímicos, tubos de PVC, metais agrícolas e outros resíduos do agro. O reciclador confirma os materiais ao chegar.",
        },
        {
          q: "Quanto custa?",
          a: "Depende do material e do valor dele. Você pode receber um pagamento líquido ou pagar uma taxa mínima pelo serviço, e sempre vê a avaliação antes de confirmar.",
        },
        {
          q: "Como a avaliação é calculada?",
          a: "O reciclador registra o peso real, aplica o valor por quilo conforme o tipo de material e desconta a logística quando for o caso. Você recebe o detalhamento completo.",
        },
        {
          q: "E se ainda não houver recicladores na minha região?",
          a: "Você pode se cadastrar mesmo assim. A cobertura está crescendo e vamos avisar quando houver recicladores por perto.",
        },
      ],
      cierre: {
        titulo: "Tire os resíduos da propriedade e dê valor a eles",
        texto: "Cadastre sua propriedade na AgroCiclo e peça sua primeira coleta.",
      },
    },
    dronx: {
      promesa: "Serviços de drone sob demanda",
      bajada: "A DronX, da OlaDigital, conecta quem precisa de um drone aos operadores da sua rede. Pela AgroHubs você pede o serviço e a solicitação sai com os dados da sua propriedade.",
      cta: "Pedir pela AgroHubs",
      otra: { texto: "Ir para o site da DronX" },
      problemas: [
        {
          problema: "Encontrar um operador de drone disponível perto da propriedade leva tempo.",
          solucion: "Você pede o serviço e a solicitação chega aos operadores da rede DronX.",
        },
        {
          problema: "Cada voo é orçado e combinado por telefone.",
          solucion: "Cada tipo de serviço mostra um preço base estimado antes da reserva. Missões sob medida recebem o orçamento do operador.",
        },
        {
          problema: "Mapas e relatórios ficam espalhados em e-mails e pendrives.",
          solucion: "Você baixa os entregáveis no app e, se pediu pela AgroHubs, vê tudo junto à sua propriedade.",
        },
      ],
      pasos: [
        { titulo: "Escolha o serviço", texto: "Informe o tipo de serviço, o local, a data e o horário. Você pode incluir instruções e imagens de referência." },
        { titulo: "Um operador executa", texto: "Um operador da rede aceita a missão e a realiza." },
        { titulo: "Receba os entregáveis", texto: "Você baixa fotos, vídeos, mapas ou relatórios, aprova a missão e avalia o serviço." },
      ],
      paraQuien: [
        { titulo: "Produtores e gestores de propriedades", texto: "Que precisam de aplicações, mapas ou contagens sem comprar um drone." },
        { titulo: "Centros demonstrativos e consultores", texto: "Que querem oferecer serviços com drone aos produtores da sua rede." },
        { titulo: "Operadores de drone", texto: "Que recebem solicitações próximas e são pagos por missão concluída." },
      ],
      conexion: [
        "Você pede o serviço pelo app ou pelo painel da sua propriedade na AgroHubs, com a cultura, os hectares, o local e a data.",
        "A solicitação chega à DronX com os dados da sua propriedade.",
        "O status da solicitação e os entregáveis voltam para a AgroHubs.",
      ],
      faq: [
        {
          q: "Quais serviços agrícolas posso pedir?",
          a: "Aplicação com drone, mapas NDVI, mapeamento e topografia, contagem de plantas e termografia, entre outros.",
        },
        {
          q: "Quanto custa um serviço?",
          a: "Cada tipo de serviço tem um preço base que você vê como estimativa antes de reservar. Em missões sob medida, um operador envia um orçamento que você pode aceitar.",
        },
        {
          q: "Como recebo os entregáveis?",
          a: "O operador envia os arquivos para o app e você os baixa por lá. Se pediu pela AgroHubs, eles também ficam vinculados à sua propriedade.",
        },
        {
          q: "Há operadores na minha região?",
          a: "A rede está crescendo. Se ainda não houver operadores na sua região, você pode se cadastrar para avisarmos quando houver um por perto.",
        },
      ],
      cierre: {
        titulo: "Peça seu próximo serviço com drone",
        texto: "Peça pelo módulo Drones da AgroHubs ou acesse o site da DronX.",
      },
    },
    agroseller: {
      estado: "Em desenvolvimento",
      promesa: "Venda sua fruta direto para feirantes, por lote e com reserva",
      bajada: "A AgroSeller nasceu da AgroCiclo para que produtores e packing houses vendam fruta a feirantes e comerciantes. Você publica lotes com preço e pedido mínimo, e o comprador reserva, retira ou pede entrega. Está em desenvolvimento, e você pode se inscrever para testar antes.",
      cta: "Quero participar",
      otra: { texto: "Como funciona" },
      problemas: [
        {
          problema: "O feirante liga para vários produtores para saber que fruta tem, a que preço e quando.",
          solucion: "Ele busca por fruta, distância e data e vê em um só lugar o preço, o pedido mínimo e o ponto de retirada de cada lote.",
        },
        {
          problema: "O produtor vende por telefone e perde o controle do estoque e do que já está comprometido.",
          solucion: "As reservas chegam a partir do pedido mínimo. Você confirma ou recusa, e o estoque só é baixado quando você confirma.",
        },
        {
          problema: "A fruta que não é vendida a tempo se perde.",
          solucion: "Reservas não confirmadas expiram e passam para a lista de espera. O que não é vendido vai para a AgroCiclo.",
        },
      ],
      pasos: [
        { titulo: "Publique seus lotes", texto: "Por espécie, variedade, calibre e embalagem. Cada variante tem preço, pedido mínimo, estoque, data de disponibilidade, fotos e ponto de retirada." },
        { titulo: "O feirante reserva", texto: "Reserva a partir do mínimo, escolhe retirada (dia e horário) ou entrega, pode deixar um sinal e recebe a confirmação pelo WhatsApp." },
        { titulo: "Você confirma e entrega", texto: "Você confirma ou recusa a reserva. Ao confirmar, o estoque é baixado; se você não confirmar a tempo, a reserva expira." },
      ],
      incluye: {
        titulo: "Como um lote é publicado",
        etiqueta: "Cada lote é organizado por",
        jerarquia: ["Espécie", "Variedade", "Calibre", "Embalagem: caixa de 10 kg, bin ou a granel"],
        grupos: [
          {
            titulo: "Cada variante tem",
            items: [
              "Preço, com faixas por volume",
              "Pedido mínimo",
              "Estoque",
              "Data de disponibilidade",
              "Categoria: exportação, mercado interno ou comercial",
              "Fotos",
              "Ponto de retirada",
            ],
          },
          {
            titulo: "O feirante",
            items: [
              "Busca por fruta, distância e data",
              "Reserva a partir do pedido mínimo",
              "Escolhe retirada (dia e horário) ou entrega",
              "Pode deixar um sinal",
              "Recebe a confirmação pelo WhatsApp",
            ],
          },
          {
            titulo: "E mais",
            items: [
              "Reservas recorrentes, por exemplo «toda sexta para a feira»",
              "Lista de espera quando o estoque acaba",
              "Avaliações de produtores e compradores",
              "Preço de referência oficial junto a cada lote, como o da ODEPA no Chile",
              "O que não é vendido vai para a AgroCiclo",
            ],
          },
        ],
      },
      paraQuien: [
        { titulo: "Produtores e packing houses", texto: "Com fruta para o mercado interno, comercial ou sobras de exportação, que querem vender por lote com regras claras." },
        { titulo: "Feirantes e comerciantes", texto: "Que compram volume toda semana e precisam saber o que tem, onde e quando." },
        { titulo: "Centros demonstrativos", texto: "Que querem abrir um canal de venda para os produtores da sua rede." },
      ],
      conexion: [
        "Nasceu da AgroCiclo, e o que não é vendido na AgroSeller vai para a AgroCiclo.",
        "Mostra o preço de referência da ODEPA, no Chile, uma das fontes que a AgroHubs já integra.",
        "Complementa o Mercado de colheita da AgroHubs com reservas por lote para feirantes.",
      ],
      faq: [
        {
          q: "Já posso usar a AgroSeller?",
          a: "Ainda não. Estamos desenhando a AgroSeller com produtores e feirantes. Se quiser participar dos primeiros testes, deixe seus dados.",
        },
        {
          q: "Posso comprar menos que o mínimo?",
          a: "Não. Cada variante tem um pedido mínimo definido pelo produtor, e a reserva começa nesse mínimo.",
        },
        {
          q: "O que acontece se o produtor não confirmar minha reserva?",
          a: "A reserva expira e o estoque volta a ficar disponível. Se houver lista de espera, a próxima pessoa é avisada.",
        },
        {
          q: "O que é o preço de referência?",
          a: "É o preço que uma fonte oficial publica para cada produto e mercado, como a ODEPA (Escritório de Estudos e Políticas Agrárias) no Chile. Ele aparece junto ao preço do lote para comparar.",
        },
      ],
      cierre: {
        titulo: "Participe dos primeiros testes",
        texto: "Se você produz fruta ou compra para a feira, conte seu caso e avisaremos quando a AgroSeller estiver pronta.",
      },
    },
    fisaro: {
      promesa: "Assistência agrícola com mais de 50.000 documentos técnicos no bolso",
      bajada: "O Fisaro, desenvolvido pela OlaDigital, reúne mais de 50.000 documentos técnicos agrícolas. Você busca por texto, voz ou foto, consulta o assistente de IA, vê o clima por município, calcula adubação e continua consultando sem conexão.",
      cta: "Ir para o Fisaro",
      otra: { texto: "Como funciona" },
      problemas: [
        { problema: "A informação técnica fica espalhada em boletins, fichas e manuais difíceis de achar no campo.", solucion: "Mais de 50.000 documentos técnicos em um só app, com busca por texto, voz ou foto." },
        { problema: "Uma dúvida agronômica no campo espera até falar com o assessor.", solucion: "O assistente de IA responde na hora, com base nos documentos da biblioteca." },
        { problema: "Em muitas propriedades não há sinal.", solucion: "O que você consultou fica disponível sem conexão." },
      ],
      pasos: [
        { titulo: "Busque", texto: "Escreva, fale ou tire uma foto: o app encontra o documento ou a resposta." },
        { titulo: "Consulte", texto: "Pergunte ao assistente de IA, veja o clima do seu município ou use as calculadoras de adubação." },
        { titulo: "Leve a resposta para o campo", texto: "Salve o que consultou e use sem conexão." },
      ],
      paraQuien: [
        { titulo: "Produtores", texto: "Que precisam de uma resposta técnica na hora, na propriedade." },
        { titulo: "Assessores e técnicos", texto: "Que buscam fichas, boletins e doses sem carregar pastas." },
        { titulo: "Estudantes e centros de formação", texto: "Que querem uma biblioteca técnica à mão." },
      ],
      conexion: [
        "O Fisaro é um app à parte, da OlaDigital, com site e conta próprios.",
        "AgroHubs e Fisaro têm a mesma equipe de desenvolvimento.",
      ],
      faq: [
        { q: "Quais documentos ele tem?", a: "Mais de 50.000 documentos técnicos agrícolas: boletins, fichas, manuais e publicações." },
        { q: "Funciona sem internet?", a: "Sim: o que você consultou fica disponível sem conexão." },
        { q: "Como eu busco?", a: "Por texto, por voz ou com uma foto." },
        { q: "É o mesmo app que a AgroHubs?", a: "Não. O Fisaro é o app de assistência agrícola da OlaDigital; a AgroHubs é a plataforma do seu Centro Demonstrativo." },
      ],
      cierre: { titulo: "Baixe o Fisaro", texto: "Entre em fisaro.cl e comece a consultar." },
    },
  },
}
