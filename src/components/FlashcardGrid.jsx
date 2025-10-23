import Flashcard from './Flashcard'

export default function FlashcardGrid({ cards, statusMap, onResult }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
        Nenhuma questão para este filtro.
      </div>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Flashcard key={card.id} card={card} status={statusMap[card.id]} onResult={onResult} />
      ))}
    </section>
  )
}
