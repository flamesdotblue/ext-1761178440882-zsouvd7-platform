import { useEffect, useMemo, useState } from 'react'
import HeaderFilters from './components/HeaderFilters'
import StatsBar from './components/StatsBar'
import FlashcardGrid from './components/FlashcardGrid'

const STORAGE_STATUS_KEY = 'ee-flashcards-v1-status'
const STORAGE_FILTER_KEY = 'ee-flashcards-v1-filter'

const initialCards = [
  {
    id: 'CE-001',
    tema: 'Circuitos Elétricos',
    enunciado:
      'Em um circuito RC série com R = 2 kΩ e C = 10 µF, a tensão de entrada é um degrau de 12 V aplicado em t=0. Qual a tensão no capacitor em t = 20 ms?',
    resposta:
      'A tensão no capacitor é vc(t) = 12·(1 - e^{-t/RC}). Com R=2 kΩ e C=10 µF, τ=0,02 s. Para t=0,02 s, vc=12·(1 - e^{-1}) ≈ 12·(1 - 0,3679) ≈ 7,585 V.',
    analise:
      'Constante de tempo τ = R·C = 2000·10e-6 = 0,02 s. Em um degrau, a resposta do capacitor é exponencial crescente com assíntota na tensão de entrada. Substituiu-se t=τ para obter vc(τ)=V(1−e^{-1}).',
    fonte: 'Concurso (Genérico) — Circuitos',
    ano: 2020,
    dificuldade: 'Fácil',
  },
  {
    id: 'ME-002',
    tema: 'Máquinas Elétricas',
    enunciado:
      'Um motor de indução trifásico 4 polos, 60 Hz, apresenta escorregamento de 3% em plena carga. Qual a velocidade mecânica aproximada do rotor?',
    resposta:
      'Ns = 120·f/P = 120·60/4 = 1800 rpm. Com s=0,03, n ≈ (1−s)·Ns = 0,97·1800 ≈ 1746 rpm.',
    analise:
      'A velocidade síncrona depende de f e do número de polos. A velocidade mecânica do rotor é reduzida pelo escorregamento s: n = (1−s)Ns.',
    fonte: 'Concurso (Genérico) — Máquinas',
    ano: 2019,
    dificuldade: 'Fácil',
  },
  {
    id: 'IE-003',
    tema: 'Instalações Elétricas',
    enunciado:
      'Em um circuito de iluminação 127 V com 12 luminárias de 100 W, qual a corrente nominal do circuito e a seção mínima do condutor de cobre considerando queda de tensão desprezível e proteção por disjuntor 10 A (NBR 5410)?',
    resposta:
      'Potência total 1200 W. Corrente I = P/V ≈ 1200/127 ≈ 9,45 A. Seção mínima típica para circuito de iluminação (condutor de cobre) é 1,5 mm²; porém, com corrente próxima de 10 A, é recomendável 2,5 mm² para margem e queda de tensão conforme trecho. Disjuntor de 10 A atende desde que queda e capacidade sejam verificadas.',
    analise:
      'A NBR 5410 admite 1,5 mm² para iluminação, porém a escolha final depende do método de instalação, temperatura e queda de tensão. Para I≈9,45 A, 1,5 mm² pode atender, mas 2,5 mm² eleva robustez e reduz queda em trechos longos.',
    fonte: 'NBR 5410 / Instalações',
    ano: 2021,
    dificuldade: 'Médio',
  },
  {
    id: 'EP-004',
    tema: 'Eletrônica de Potência',
    enunciado:
      'Um retificador monofásico em ponte com carga R de 20 Ω alimentado por 127 V RMS (60 Hz) ideal. Qual a tensão média na carga?',
    resposta:
      'Para ponte de diodos monofásica: Vmed = (2·Vm/π), com Vm = √2·V_rms ≈ 179,6 V. Logo Vmed ≈ 2·179,6/π ≈ 114,4 V.',
    analise:
      'A expressão Vmed=2Vm/π é válida para retificador de onda completa ideal. Não se considerou queda de diodo.',
    fonte: 'Concurso — Potência',
    ano: 2018,
    dificuldade: 'Fácil',
  },
  {
    id: 'PR-005',
    tema: 'Proteção de Sistemas Elétricos',
    enunciado:
      'Relés de sobrecorrente temporizados (51) em coordenação seletiva: qual critério básico entre alimentador e barra principal?',
    resposta:
      'O relé a jusante (alimentador) deve operar antes do relé a montante (barra), com coordenação temporal incluindo margem de segurança (tipicamente 0,2–0,4 s) para garantir seletividade.',
    analise:
      'A coordenação garante que apenas o dispositivo mais próximo à falta atue. Ajustes incluem curvas IEC/IEEE, TMS e pick-up com margens entre estágios.',
    fonte: 'Proteção — Prática',
    ano: 2017,
    dificuldade: 'Médio',
  },
  {
    id: 'MD-006',
    tema: 'Medições Elétricas',
    enunciado:
      'Um wattímetro indica 800 W em um circuito monofásico com V=200 V e I=6 A. Qual o fator de potência?',
    resposta:
      'P = V·I·cosφ ⇒ cosφ = 800/(200·6) = 800/1200 = 0,6667 ≈ 0,67 (atrasado, se indutivo).',
    analise:
      'A leitura de potência ativa e os valores eficazes permitem o cálculo direto do FP. O sinal (adiantado/atrasado) depende da natureza da carga.',
    fonte: 'Medições',
    ano: 2022,
    dificuldade: 'Fácil',
  },
  {
    id: 'SS-007',
    tema: 'Sinais e Sistemas',
    enunciado:
      'A resposta ao impulso h(t) = e^{-2t}u(t). Qual o ganho DC do sistema?',
    resposta:
      'Ganho DC é H(0) = ∫ h(t) dt de 0 a ∞ = ∫ e^{-2t} dt = 1/2.',
    analise:
      'Para sistemas LIT, H(0)=∫ h(t) dt. A integral de e^{-2t} é 1/2.',
    fonte: 'Teoria de Sinais',
    ano: 2016,
    dificuldade: 'Fácil',
  },
  {
    id: 'TD-008',
    tema: 'Transmissão e Distribuição',
    enunciado:
      'Uma linha tem reatância série X=0,3 pu e resistência desprezível. A potência máxima transmitível (estabilidade estática) é proporcional a V^2/X. Se X é reduzida à metade, o que ocorre com Pmax?',
    resposta:
      'Com X→X/2, Pmax≈V^2/X dobra. Logo a potência máxima transmissível aproximadamente dobra.',
    analise:
      'Modelo simplificado de potência P≈(V1·V2/X)·senδ. Maximizando em δ=90°, Pmax∝1/X.',
    fonte: 'Sistemas de Potência',
    ano: 2015,
    dificuldade: 'Fácil',
  },
  {
    id: 'CE-009',
    tema: 'Circuitos Elétricos',
    enunciado:
      'Em um circuito RL série com R=10 Ω e L=100 mH alimentado por 50 V DC em t=0, qual a corrente em t=40 ms?',
    resposta:
      'i(t)= (V/R)·(1−e^{−t/τ}), τ=L/R=0,1/10=0,01 s. Para t=0,04 s (4τ): i≈(50/10)·(1−e^{−4})≈5·(1−0,0183)=4,9085 A.',
    analise:
      'A resposta de corrente em RL é exponencial crescente até V/R com constante de tempo τ=L/R.',
    fonte: 'Circuitos',
    ano: 2020,
    dificuldade: 'Fácil',
  },
  {
    id: 'ME-010',
    tema: 'Máquinas Elétricas',
    enunciado:
      'Um transformador 10 kVA, 220/110 V, possui perdas em vazio de 80 W e perdas em carga de 150 W a plena carga. Qual o rendimento aproximado a plena carga com FP=1?',
    resposta:
      'Pout=10 kW. Perdas totais≈80+150=230 W. η≈Pout/(Pout+Perdas)=10000/(10230)≈0,9775≈97,8%.',
    analise:
      'As perdas em vazio somam-se às perdas em carga. Para FP=1, potência de saída é próxima da nominal em kW.',
    fonte: 'Máquinas',
    ano: 2018,
    dificuldade: 'Médio',
  },
  {
    id: 'IE-011',
    tema: 'Instalações Elétricas',
    enunciado:
      'Para um circuito de tomadas 127 V com demanda de 1800 W em ambiente residencial, qual disjuntor curva C mais adequado considerando corrente nominal e margem?',
    resposta:
      'I = P/V ≈ 1800/127 ≈ 14,17 A. Um disjuntor curva C de 16 A é adequado, desde que a seção do condutor e a queda de tensão estejam compatíveis (tipicamente 2,5 mm²).',
    analise:
      'A curva C é comum para tomadas gerais. Seleciona-se In acima da corrente de projeto, mantendo coordenação com a seção do condutor conforme NBR 5410.',
    fonte: 'NBR 5410',
    ano: 2021,
    dificuldade: 'Fácil',
  },
  {
    id: 'EP-012',
    tema: 'Eletrônica de Potência',
    enunciado:
      'Um chopper buck ideal com Vin=48 V, D=0,35 e carga R. Qual a tensão média na carga?',
    resposta:
      'Para buck ideal, Vout = D·Vin = 0,35·48 ≈ 16,8 V.',
    analise:
      'A relação de conversão do buck ideal é linear com a razão cíclica, desconsiderando perdas.',
    fonte: 'Potência',
    ano: 2019,
    dificuldade: 'Fácil',
  },
]

export default function App() {
  const [filter, setFilter] = useState('Todos')
  const [statusMap, setStatusMap] = useState({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STATUS_KEY)
      if (saved) setStatusMap(JSON.parse(saved))
      const savedFilter = localStorage.getItem(STORAGE_FILTER_KEY)
      if (savedFilter) setFilter(savedFilter)
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STATUS_KEY, JSON.stringify(statusMap))
    } catch (e) {}
  }, [statusMap])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FILTER_KEY, filter)
    } catch (e) {}
  }, [filter])

  const temas = useMemo(() => {
    const set = new Set(initialCards.map((c) => c.tema))
    return ['Todos', ...Array.from(set).sort()]
  }, [])

  const filteredCards = useMemo(() => {
    if (filter === 'Todos') return initialCards
    return initialCards.filter((c) => c.tema === filter)
  }, [filter])

  const totais = useMemo(() => {
    const ids = new Set(filteredCards.map((c) => c.id))
    let corretas = 0
    let erradas = 0
    ids.forEach((id) => {
      if (statusMap[id] === 'correta') corretas += 1
      else if (statusMap[id] === 'errada') erradas += 1
    })
    const total = filteredCards.length
    const restantes = Math.max(0, total - corretas - erradas)
    return { total, corretas, erradas, restantes }
  }, [filteredCards, statusMap])

  function handleResult(id, acertou) {
    setStatusMap((prev) => ({ ...prev, [id]: acertou ? 'correta' : 'errada' }))
  }

  function handleReset() {
    setStatusMap((prev) => {
      const copy = { ...prev }
      const ids = filteredCards.map((c) => c.id)
      ids.forEach((id) => {
        if (id in copy) delete copy[id]
      })
      return copy
    })
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderFilters temas={temas} ativo={filter} onChange={setFilter} onReset={handleReset} />
      <main className="mx-auto max-w-6xl px-4 pb-12">
        <StatsBar totais={totais} filtro={filter} />
        <FlashcardGrid cards={filteredCards} statusMap={statusMap} onResult={handleResult} />
      </main>
      <footer className="border-t border-neutral-200 bg-white/70 py-6">
        <div className="mx-auto max-w-6xl px-4 text-xs text-neutral-500">
          Baseado em questões de concursos de Engenharia Elétrica. Seus resultados são salvos localmente no navegador.
        </div>
      </footer>
    </div>
  )
}
