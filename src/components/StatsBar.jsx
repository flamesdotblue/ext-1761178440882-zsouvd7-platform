import { BarChart3 } from 'lucide-react'

export default function StatsBar({ totais, filtro }) {
  const { total, corretas, erradas, restantes } = totais
  return (
    <section className="mb-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 text-neutral-700">
        <BarChart3 size={18} />
        <h2 className="text-sm font-medium">Desempenho — {filtro}</h2>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatPill label="Total" value={total} color="bg-neutral-900" />
        <StatPill label="Certas" value={corretas} color="bg-emerald-600" />
        <StatPill label="Erradas" value={erradas} color="bg-rose-600" />
        <StatPill label="Restantes" value={restantes} color="bg-amber-600" />
      </div>
    </section>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
      <span className="text-sm text-neutral-600">{label}</span>
      <span className={`ml-3 rounded-md px-2 py-1 text-sm font-semibold text-white ${color}`}>{value}</span>
    </div>
  )
}
