import { Filter, RefreshCcw } from 'lucide-react'

export default function HeaderFilters({ temas, ativo, onChange, onReset }) {
  return (
    <header className="sticky top-0 z-30 mb-6 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white font-bold">EE</div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Flashcards de Engenharia Elétrica</h1>
            <p className="text-sm text-neutral-500">Estude por temas, revele respostas e acompanhe seu desempenho</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 active:scale-[0.99]"
          title="Zerar desempenho do filtro atual"
        >
          <RefreshCcw size={16} /> Zerar desempenho
        </button>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-3">
        <div className="mb-2 flex items-center gap-2 text-neutral-600">
          <Filter size={16} />
          <span className="text-sm">Filtrar por tema</span>
        </div>
        <div className="flex flex-wrap gap-2 pb-2">
          {temas.map((tema) => {
            const ativoTema = tema === ativo
            return (
              <button
                key={tema}
                onClick={() => onChange(tema)}
                className={`${
                  ativoTema
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-300'
                } inline-flex select-none items-center gap-2 rounded-full border px-4 py-1.5 text-sm`}
              >
                {tema}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
