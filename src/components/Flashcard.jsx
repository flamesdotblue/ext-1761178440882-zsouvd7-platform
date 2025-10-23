import { useState } from 'react'
import { Check, Eye, EyeOff, X } from 'lucide-react'

export default function Flashcard({ card, status, onResult }) {
  const [revelado, setRevelado] = useState(false)

  const statusStyle =
    status === 'correta'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'errada'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-neutral-50 text-neutral-700 border-neutral-200'

  return (
    <article className={`flex flex-col rounded-xl border ${statusStyle} bg-white p-4 shadow-sm`}>
      <header className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-white">
            {card.tema}
          </span>
          <span className="text-xs text-neutral-500">{card.fonte}{card.ano ? ` · ${card.ano}` : ''}</span>
        </div>
        <span className="text-xs font-medium text-neutral-500">{card.id}</span>
      </header>

      <div className="mb-3">
        <p className="text-sm leading-relaxed text-neutral-900">{card.enunciado}</p>
      </div>

      {!revelado ? (
        <button
          onClick={() => setRevelado(true)}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <Eye size={16} /> Revelar Resposta
        </button>
      ) : (
        <div className="mt-1 flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <div>
            <h4 className="mb-1 text-sm font-semibold text-neutral-800">Resposta</h4>
            <p className="text-sm leading-relaxed text-neutral-900">{card.resposta}</p>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-neutral-800">Análise</h4>
            <p className="text-sm leading-relaxed text-neutral-800">{card.analise}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onResult(card.id, true)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white ${
                  status === 'correta' ? 'bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Check size={16} /> Acertei
              </button>
              <button
                onClick={() => onResult(card.id, false)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white ${
                  status === 'errada' ? 'bg-rose-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <X size={16} /> Errei
              </button>
            </div>
            <button
              onClick={() => setRevelado(false)}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <EyeOff size={16} /> Ocultar
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
