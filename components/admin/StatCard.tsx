import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  color: 'pink' | 'rose' | 'fuchsia' | 'purple'
}

const colorMap = {
  pink:    { bg: 'bg-[#fff0f5]', icon: 'text-[#e84080]', value: 'text-[#c93070]' },
  rose:    { bg: 'bg-rose-50',   icon: 'text-rose-500',   value: 'text-rose-700'  },
  fuchsia: { bg: 'bg-fuchsia-50',icon: 'text-fuchsia-500',value: 'text-fuchsia-700'},
  purple:  { bg: 'bg-purple-50', icon: 'text-purple-500', value: 'text-purple-700' },
}

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div className={`${c.bg} rounded-2xl p-6 flex items-center gap-5`}>
      <div className={`${c.icon} p-3 bg-white rounded-xl shadow-sm`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
      </div>
    </div>
  )
}
