interface TopBarProps {
  title: string
  children?: React.ReactNode
}

const aztecBorderSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='4'>
  <rect x='0' y='1' width='4' height='2' fill='%23C9A98A' opacity='0.6'/>
  <rect x='6' y='0' width='4' height='4' fill='%239E7758' opacity='0.5' transform='rotate(45 8 2)'/>
  <rect x='14' y='1' width='4' height='2' fill='%23C9A98A' opacity='0.6'/>
  <rect x='20' y='0' width='4' height='4' fill='%239E7758' opacity='0.5' transform='rotate(45 22 2)'/>
  <rect x='28' y='1' width='4' height='2' fill='%23C9A98A' opacity='0.6'/>
  <rect x='34' y='0' width='4' height='4' fill='%239E7758' opacity='0.5' transform='rotate(45 36 2)'/>
  <rect x='42' y='1' width='4' height='2' fill='%23C9A98A' opacity='0.6'/>
</svg>`

export default function TopBar({ title, children }: TopBarProps) {
  return (
    <header className="bg-white border-b border-[#EDE0CF] flex flex-col">
      <div className="h-16 flex items-center justify-between px-8">
        <h1 className="text-xl font-semibold text-[#5C4028]" style={{ fontFamily: 'var(--font-playfair)' }}>
          {title}
        </h1>
        {children && <div>{children}</div>}
      </div>
      {/* Aztec micro-border strip */}
      <div
        style={{
          height: '4px',
          backgroundImage: `url("data:image/svg+xml,${aztecBorderSvg}")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '48px 4px',
          opacity: 0.7,
        }}
      />
    </header>
  )
}
