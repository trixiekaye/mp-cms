import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: 'tan' | 'warm' | 'beige' | 'sand'
}

const colorMap = {
  tan:   { bg: 'bg-[#5C4028]', iconBg: 'bg-[#7D5C3E]', icon: 'text-[#EDE0CF]', value: 'text-white',    label: 'text-[#D9C4A8]' },
  warm:  { bg: 'bg-[#7D5C3E]', iconBg: 'bg-[#9E7758]', icon: 'text-[#F5EFE6]', value: 'text-white',    label: 'text-[#D9C4A8]' },
  beige: { bg: 'bg-[#9E7758]', iconBg: 'bg-[#B8916F]', icon: 'text-white',      value: 'text-white',    label: 'text-[#F5EFE6]' },
  sand:  { bg: 'bg-[#B8916F]', iconBg: 'bg-[#C9A98A]', icon: 'text-white',      value: 'text-white',    label: 'text-[#F5EFE6]' },
}

const aztecSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'>
  <polygon points='30,0 60,30 30,60 0,30' fill='none' stroke='%23ffffff' stroke-width='1.2'/>
  <polygon points='30,8 50,30 30,52 10,30' fill='none' stroke='%23ffffff' stroke-width='0.8'/>
  <polygon points='30,16 42,30 30,44 18,30' fill='none' stroke='%23ffffff' stroke-width='0.6'/>
  <polygon points='30,23 37,30 30,37 23,30' fill='white' opacity='0.25'/>
</svg>`

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div
      className={`${c.bg} rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden`}
      style={{
        backgroundImage: `url("data:image/svg+xml,${aztecSvg}")`,
        backgroundSize: '60px 60px',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Gradient overlay to keep text readable */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, transparent 60%)' }}
      />
      <div className={`relative z-10 ${c.iconBg} p-3 rounded-xl shadow-sm`}>
        <Icon size={24} className={c.icon} />
      </div>
      <div className="relative z-10">
        <p className={`text-sm ${c.label}`}>{label}</p>
        <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
      </div>
    </div>
  )
}
