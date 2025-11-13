// Ícone de ônibus em linha contínua com traços uniformes
export default function BusIcon({ className = '', size = 32, color = '#222' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 12C12 9.79086 13.7909 8 16 8H32C34.2091 8 36 9.79086 36 12V28C36 30.2091 34.2091 32 32 32H16C13.7909 32 12 30.2091 12 28V12Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 24H36"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 16H32"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="18"
        cy="36"
        r="3"
        stroke={color}
        strokeWidth="1.8"
      />
      <circle
        cx="30"
        cy="36"
        r="3"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M14 32V36"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M34 32V36"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 36H26"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
