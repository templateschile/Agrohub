export default function Terminos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-3xl mx-auto px-6 lg:px-14">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Términos y Condiciones
          </h1>
          <p className="text-white/65 text-base">
            Licencia compartida AgroHub · Versión 1.0 · Vigente desde 2025
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-6 lg:px-14 flex flex-col gap-10 text-gray-700">

          {/* 1 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Propiedad de los datos</h2>
            <p className="text-sm leading-relaxed">
              Los datos generados, almacenados o procesados dentro de cada AgroHub son propiedad
              exclusiva del hub que los originó. AgroHub no reclama ningún derecho sobre la información
              productiva, climática, de sensores o comercial de cada organización.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              Cualquier compartición de datos entre hubs, con terceros o con la red AgroHub requiere
              autorización expresa, consciente y por escrito del usuario responsable del hub. No existe
              compartición automática ni implícita de ningún dato.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Licencia del código fuente</h2>
            <p className="text-sm leading-relaxed">
              La licencia otorgada al contratar AgroHub incluye acceso al código fuente del panel de
              administración (Node.js + React) y de la aplicación móvil (Flutter). Este acceso es de uso
              interno para el hub contratante.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              Está permitido adaptar la interfaz, agregar contenido propio y configurar integraciones
              específicas del territorio. No está permitido redistribuir, revender o sublicenciar el
              código base a terceros sin autorización escrita del equipo AgroHub.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Mejoras y actualizaciones del ecosistema</h2>
            <p className="text-sm leading-relaxed">
              Los features, mejoras y nuevas funcionalidades desarrolladas para la red AgroHub se
              distribuyen mediante <strong>pull requests</strong> al repositorio compartido. Cada hub
              puede optar por incorporar estas actualizaciones de forma voluntaria, siempre que mantenga
              compatibilidad con la arquitectura base.
            </p>
            <p className="text-sm leading-relaxed mt-3">
              Los desarrollos adicionales realizados por un hub que modifiquen el núcleo del sistema
              sin seguir el proceso de pull request implican la pérdida del soporte técnico garantizado
              por AgroHub sobre las versiones afectadas.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Soporte técnico</h2>
            <p className="text-sm leading-relaxed">
              El primer año de soporte está incluido en el precio de implementación. Desde el segundo
              año, el soporte tiene un costo de <strong>$5.000.000 CLP por año</strong>, e incluye:
              atención de incidencias, actualizaciones de seguridad, seguimiento mensual y acceso
              prioritario a nuevos features de la red.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Usuarios y tarifas adicionales</h2>
            <p className="text-sm leading-relaxed">
              Cada implementación incluye una base de usuarios según lo acordado en la propuesta formal.
              Los usuarios adicionales sobre los límites contratados tienen un costo de
              <strong> $50.000 CLP por usuario al mes</strong>. Esta tarifa aplica a agricultores,
              asesores técnicos y consultores que superen el límite incluido.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Exclusiones</h2>
            <p className="text-sm leading-relaxed">
              El precio de implementación no incluye: licencias de terceros, dispositivos físicos,
              sensores, planes de proveedores de datos, conectividad, hosting avanzado ni servicios
              externos, salvo que se indique expresamente en la propuesta formal.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cotizador referencial</h2>
            <p className="text-sm leading-relaxed">
              Los valores mostrados en el cotizador de <a href="/precios" className="text-agro-green-600 underline font-medium">agrohubs.cl/precios</a> son
              referenciales. El precio definitivo se confirma en una propuesta formal, tras diagnóstico
              técnico del territorio y requerimientos específicos del hub.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Contacto</h2>
            <p className="text-sm leading-relaxed">
              Para consultas sobre estos términos, licencias o condiciones comerciales:
            </p>
            <a
              href="https://wa.me/56987561075"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 bg-agro-green-600 hover:bg-agro-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
            >
              Contactar por WhatsApp →
            </a>
          </div>

          <div className="border-t border-gray-100 pt-6 text-xs text-gray-400">
            Última actualización: enero 2025 · AgroHub · agrohubs.cl
          </div>

        </div>
      </section>
    </div>
  )
}
