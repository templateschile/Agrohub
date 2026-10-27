/**
 * Logo AgroHubs (el mismo de admin.agrohubs.cl): hub central conectado a tres nodos.
 * Usa currentColor; el color lo pone quien lo usa.
 * - `title`: nombre accesible. Con `title={null}` el logo es decorativo (aria-hidden), por ejemplo
 *   dentro de un enlace que ya dice "AgroHubs".
 * - El resto de las props van al <svg> (x, y, width, height), para usarlo dentro de otro SVG.
 */
export function HubMark({ className = 'w-6 h-6', title = 'AgroHubs', ...rest }) {
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }
  return (
    <svg viewBox="0 0 48 48" className={className} focusable="false" {...a11y} {...rest}>
      <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
        <line x1="24" y1="26" x2="11" y2="12" />
        <line x1="24" y1="26" x2="38" y2="13" />
        <line x1="24" y1="26" x2="25.5" y2="39" />
      </g>
      <circle cx="24" cy="26" r="8" fill="currentColor" />
      <circle cx="11" cy="12" r="4" fill="currentColor" />
      <circle cx="38" cy="13" r="4" fill="currentColor" />
      <circle cx="25.5" cy="39" r="4" fill="currentColor" />
    </svg>
  )
}
