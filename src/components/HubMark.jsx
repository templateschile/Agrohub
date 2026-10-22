/**
 * Logo AgroHubs (el mismo de admin.agrohubs.cl): hub central conectado a tres nodos.
 * Usa currentColor; el color lo pone quien lo usa.
 */
export function HubMark({ className = 'w-6 h-6', title = 'AgroHubs' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label={title} focusable="false">
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

/** Wordmark: cuadro bosque con el hub menta + AGROHUBS espaciado + bajada. `oscuro` = sobre fondo oscuro. */
export function Wordmark({ oscuro = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shadow shrink-0 ${oscuro ? 'bg-white/10 ring-1 ring-white/20' : 'bg-[#0b3b24]'}`}>
        <HubMark className="w-7 h-7 text-[#6ee7a8]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-bold text-[15px] tracking-[0.28em] ${oscuro ? 'text-white' : 'text-[#0b3b24]'}`}
              style={{ fontFamily: "'Sora', 'Inter', system-ui, sans-serif" }}>
          AGROHUBS
        </span>
        <span className={`text-[10px] font-semibold tracking-wide mt-1 ${oscuro ? 'text-[#6ee7a8]/80' : 'text-[#17663c]'}`}>
          Centro Demostrativo Agrícola
        </span>
      </span>
    </span>
  )
}
