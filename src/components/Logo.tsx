interface LogoProps {
size?: 'sm' | 'md' | 'lg' | 'xl'
className?: string
}

export default function Logo({
size = 'md',
className = '',
}: LogoProps) {
const sizes = {
sm: 'max-w-[120px]',
md: 'max-w-[160px]',
lg: 'max-w-[220px]',
xl: 'max-w-[320px]',
}

const fontSizes = {
sm: 16,
md: 22,
lg: 30,
xl: 44,
}

const g = "l${size}"

return (
<svg
viewBox="0 0 200 60"
preserveAspectRatio="xMidYMid meet"
xmlns="http://www.w3.org/2000/svg"
className={"${sizes[size]} w-full h-auto block ${className}"}
role="img"
aria-label="XETHKIOZ"
>
<defs>
<linearGradient
id={"o${g}"}
x1="0%"
y1="0%"
x2="100%"
y2="100%"
>
<stop offset="0%" stopColor="#FF8A1A" />
<stop offset="100%" stopColor="#FF6A00" />
</linearGradient>

    <linearGradient
      id={`p${g}`}
      x1="0%"
      y1="0%"
      x2="100%"
      y2="100%"
    >
      <stop offset="0%" stopColor="#B576FF" />
      <stop offset="100%" stopColor="#8A2BE2" />
    </linearGradient>

    <filter id={`og${g}`}>
      <feGaussianBlur stdDeviation="1.5" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id={`pg${g}`}>
      <feGaussianBlur stdDeviation="1.2" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <g filter={`url(#og${g})`}>
    <path
      d="M10 8 L18 8 L22 16 L26 8 L34 8 L28 22 L34 36 L26 36 L22 28 L18 36 L10 36 L16 22 Z"
      fill={`url(#o${g})`}
    />
  </g>

  <g filter={`url(#pg${g})`}>
    <path
      d="M44 10 L48 6 L52 10 L50 14 L54 14 L52 18 L48 18 L48 24 L52 24 L54 28 L50 28 L52 32 L48 36 L44 32 L46 28 L42 28 L44 24 L48 24 L48 18 L44 18 L42 14 L46 14 Z"
      fill={`url(#p${g})`}
      opacity="0.9"
    />
  </g>

  <text
    x="62"
    y="38"
    fontFamily="Orbitron, sans-serif"
    fontWeight="900"
    fontSize={fontSizes[size]}
    fill={`url(#p${g})`}
    filter={`url(#pg${g})`}
  >
    ETHKIOZ
  </text>
</svg>

)
}