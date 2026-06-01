interface TopBarProps {
  title: string
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-[#ffd6e7] flex items-center px-8">
      <h1 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'var(--font-playfair)' }}>
        {title}
      </h1>
    </header>
  )
}
