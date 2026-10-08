// Dron agrícola (cuadricóptero) con el mismo trazo que los íconos de lucide-react.
export default function IconoDron({ size = 24, className = '', strokeWidth = 2 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="6" height="5" rx="1.5" />
      <path d="M9 10.5 5.5 7.5M15 10.5l3.5-3M9 12.5l-3.5 3M15 12.5l3.5 3" />
      <path d="M3 7.5h5M16 7.5h5M3 15.5h5M16 15.5h5" />
      <path d="M12 14v2.5M10.5 18.5h3" />
    </svg>
  )
}
