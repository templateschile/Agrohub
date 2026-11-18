/**
 * Logo AgroHubs vigente desde el 16-11-2026 (el mismo de Instagram, los videos y admin.agrohubs.cl):
 * un anillo con siete puntos, la red de agricultores, y un brote al centro.
 * Usa currentColor; el color lo pone quien lo usa.
 * - `title`: nombre accesible. Con `title={null}` el logo es decorativo (aria-hidden), por ejemplo
 *   dentro de un enlace que ya dice "AgroHubs".
 * - El resto de las props van al <svg> (x, y, width, height), para usarlo dentro de otro SVG.
 */
export function HubMark({ className = 'w-6 h-6', title = 'AgroHubs', ...rest }) {
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true }
  return (
    <svg viewBox="-92 -92 184 184" className={className} focusable="false" {...a11y} {...rest}>
      <circle r="77" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="6.4" />
      <g fill="currentColor">
        <circle cx="0" cy="-77" r="10.2" />
        <circle cx="77" cy="0" r="10.2" />
        <circle cx="-77" cy="0" r="10.2" />
        <circle cx="54.4" cy="-54.4" r="7.6" />
        <circle cx="-54.4" cy="-54.4" r="7.6" />
        <circle cx="54.4" cy="54.4" r="7.6" />
        <circle cx="-54.4" cy="54.4" r="7.6" />
        <path d="M-2 -2 C-10 -19 -34 -21 -42 -9 C-39 11 -18 23 -2 20 Z" />
        <path d="M2 -8 C7 -36 32 -52 53 -50 C54 -29 37 -4 4 5 Z" />
      </g>
      <line x1="0" y1="64" x2="0" y2="-6" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
    </svg>
  )
}
