/**
 * Recomendador por reglas: puntúa el catálogo contra un texto libre ("necesito alertas de helada
 * y riego"). Lo usa el asesor IA para preseleccionar candidatos y como respaldo si Ollama no responde.
 * Sin dependencias para poder copiarlo tal cual al sitio (scripts/apis del repo Agrohub).
 */
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// raíz de palabra -> casos de uso del catálogo
const TEMAS = [
    [['riego', 'regar', 'riega', 'agua', 'hidric', 'goteo', 'caudal', 'evapotransp', 'eto'], ['programacion-de-riego', 'balance-hidrico-y-eto']],
    [['helada', 'frio', 'temperatura', 'horas frio'], ['alerta-de-heladas', 'fenologia-y-grados-dia']],
    [['clima', 'tiempo', 'pronost', 'lluvia', 'viento', 'meteorol', 'estacion', 'precipit'], ['pronostico-y-clima-local']],
    [['satel', 'ndvi', 'vigor', 'teledetec', 'dron', 'imagenes', 'sentinel', 'landsat'], ['monitoreo-de-cultivo-satelital']],
    [['suelo', 'textura', 'fertilid', 'nutric', 'arcilla'], ['caracterizacion-de-suelo']],
    [['labor', 'cuaderno', 'aplicacion', 'registro', 'tarea', 'faena', 'bitacora', 'campo'], ['registro-de-labores']],
    [['precio', 'mercado', 'venta', 'vender', 'export', 'comerci', 'dolar', 'commodit', 'cotizac'], ['precios-y-comercializacion']],
    [['estadist', 'censo', 'superficie', 'planific', 'produccion'], ['estadisticas-y-planificacion']],
    [['incendio', 'fuego', 'quema'], ['prevencion-de-incendios']],
    [['fenolog', 'grados', 'floracion', 'cosecha', 'madurez'], ['fenologia-y-grados-dia']],
    [['plaga', 'enfermedad', 'hongo', 'insecto', 'trampa', 'sanidad', 'oidio', 'botritis', 'maleza'], ['manejo-de-plagas-y-enfermedades']],
    [['foto', 'identific', 'reconoc', 'camara'], ['identificacion-por-imagen']],
    [['maquina', 'tractor', 'telemetr', 'gps', 'flota', 'cosechadora', 'deere'], ['telemetria-de-maquinaria']],
    [['ganad', 'vaca', 'bovin', 'ovin', 'leche', 'lecher', 'animal', 'acuicul', 'salmon', 'potrero'], ['monitoreo-de-ganado']],
    [['certific', 'globalgap', 'trazab', 'cumplim', 'auditor', 'normativ', 'deforest'], ['certificacion-y-cumplimiento']],
    [['carbono', 'huella', 'emision', 'sostenib', 'mrv', 'residuo'], ['huella-de-carbono-y-mrv']],
    [['conocimiento', 'documento', 'manual', 'investig', 'publicac', 'boletin', 'biblioteca', 'buscador'], ['busqueda-de-conocimiento-tecnico']],
    [['ia', 'chat', 'asistente', 'inteligencia', 'llm', 'gpt', 'bot'], ['asistente-ia-agronomico']],
    [['sensor', 'iot', 'sonda', 'humedad', 'lora', 'datalogger'], ['sensores-en-el-predio']],
    [['mapa', 'predio', 'gis', 'catastro', 'poligono', 'geo', 'coordenad'], ['geodatos-del-predio']],
    [['pago', 'cobro', 'suscrip', 'factura', 'tienda', 'ecommerce'], ['pagos-y-suscripciones']],
    [['integrar', 'erp', 'sap', 'interoper', 'estandar', 'unificar', 'conectar', 'centraliz'], ['interoperabilidad-de-datos']]
];

const PAISES = { chile: 'CL', argentina: 'AR', brasil: 'BR', peru: 'PE', colombia: 'CO', mexico: 'MX', uruguay: 'UY', 'estados unidos': 'US', eeuu: 'US' };
const VACIAS = new Set('para con que los las del una uno unos unas por como quiero necesito tengo hacer tener sobre desde entre esta este esto mis sus nuestro nuestra mas muy sistema software datos dato app aplicacion plataforma empresa queremos busco'.split(' '));

/**
 * @param {string} texto  necesidad en lenguaje natural
 * @param {Array} items   [{ slug, nombre, resumen, pais, categorias, casos_de_uso, que_entrega, ranking }]
 * @param {object} [o]    { limite }
 * @returns {{ apis: Array<{slug, nombre, motivo, puntaje}>, temas: string[], pais: string|null }}
 */
function recomendar(texto, items, o = {}) {
    const t = norm(texto);
    const palabras = t.split(/[^a-z0-9ñ]+/).filter((w) => w.length >= 4 && !VACIAS.has(w));
    const temas = new Set();
    for (const [raices, casos] of TEMAS) {
        if (raices.some((r) => (r.length <= 3 ? new RegExp(`\\b${r}\\b`).test(t) : t.includes(r)))) casos.forEach((c) => temas.add(c));
    }
    let pais = null;
    for (const [n, iso] of Object.entries(PAISES)) if (t.includes(n)) { pais = iso; break; }

    const puntuados = items.map((i) => {
        const texto = norm([i.nombre, i.resumen, (i.que_entrega || []).join(' '), (i.categorias || []).join(' ')].join(' '));
        const nombre = norm(i.nombre);
        let p = 0;
        const casos = (i.casos_de_uso || []).filter((c) => temas.has(c));
        p += casos.length * 6;
        for (const w of palabras) {
            const raiz = w.slice(0, Math.max(4, w.length - 2));
            if (nombre.includes(raiz)) p += 4;
            else if (texto.includes(raiz)) p += 1;
        }
        if (p > 0) {
            const r = i.ranking || {};
            const pertinente = casos.length > 0 || p >= 4; // el país solo desempata entre fuentes pertinentes
            p += (r.relevancia || 0) / 25;
            if (!pertinente) return { i, p, casos };
            if (pais && i.pais === pais) p += 3;
            else if (pais && i.pais !== 'GLOBAL' && i.pais !== pais) p -= 3;
            else if (!pais && i.pais === 'CL') p += 2; // sin país explícito: primero Chile, luego global
            else if (!pais && i.pais !== 'GLOBAL') p -= 1.5;
        }
        return { i, p, casos };
    }).filter((x) => x.p > 0).sort((a, b) => b.p - a.p);

    const limite = o.limite || 6;
    return {
        temas: [...temas], pais,
        apis: puntuados.slice(0, limite).map(({ i, p }) => ({
            slug: i.slug, nombre: i.nombre, puntaje: Math.round(p * 10) / 10,
            motivo: i.resumen
        })),
        candidatos: puntuados.map((x) => x.i)
    };
}

module.exports = { recomendar, norm, TEMAS };
