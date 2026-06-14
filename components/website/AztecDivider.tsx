interface AztecDividerProps {
  color?: string
  opacity?: number
  height?: number
}

export default function AztecDivider({
  color = '#9E7758',
  opacity = 0.38,
  height = 52,
}: AztecDividerProps) {
  // Encode SVG tile as CSS background-image (avoids SVG ID conflicts when used multiple times)
  const h = height
  const cx = 36
  const cy = h / 2
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='${h}'>
    <polygon points='${cx},3 ${cx + 32},${cy} ${cx},${h - 3} ${cx - 32},${cy}' fill='none' stroke='${color}' stroke-width='2'/>
    <polygon points='${cx},9 ${cx + 22},${cy} ${cx},${h - 9} ${cx - 22},${cy}' fill='none' stroke='${color}' stroke-width='1.4'/>
    <polygon points='${cx},15 ${cx + 13},${cy} ${cx},${h - 15} ${cx - 13},${cy}' fill='none' stroke='${color}' stroke-width='1.1'/>
    <polygon points='${cx},${cy - 5} ${cx + 5},${cy} ${cx},${cy + 5} ${cx - 5},${cy}' fill='${color}' opacity='0.55'/>
    <line x1='${cx}' y1='0' x2='${cx}' y2='3' stroke='${color}' stroke-width='1.5'/>
    <line x1='${cx}' y1='${h - 3}' x2='${cx}' y2='${h}' stroke='${color}' stroke-width='1.5'/>
    <line x1='${cx - 18}' y1='0' x2='${cx - 18}' y2='5' stroke='${color}' stroke-width='1' opacity='0.45'/>
    <line x1='${cx + 18}' y1='0' x2='${cx + 18}' y2='5' stroke='${color}' stroke-width='1' opacity='0.45'/>
    <line x1='${cx - 18}' y1='${h}' x2='${cx - 18}' y2='${h - 5}' stroke='${color}' stroke-width='1' opacity='0.45'/>
    <line x1='${cx + 18}' y1='${h}' x2='${cx + 18}' y2='${h - 5}' stroke='${color}' stroke-width='1' opacity='0.45'/>
  </svg>`

  const encoded = `url("data:image/svg+xml,${encodeURIComponent(tile)}")`

  return (
    <div
      style={{
        height,
        backgroundImage: encoded,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `72px ${height}px`,
        opacity,
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    />
  )
}
