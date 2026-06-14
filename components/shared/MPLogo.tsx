interface MPLogoProps {
  className?: string
}

export default function MPLogo({ className = 'w-10 h-10' }: MPLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="mpGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#D9C4A8" />
          <stop offset="100%" stopColor="#9E7758" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#mpGrad)" />
      <text
        x="32"
        y="43"
        textAnchor="middle"
        fill="white"
        fontSize="22"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        letterSpacing="1"
      >
        MP
      </text>
    </svg>
  )
}
