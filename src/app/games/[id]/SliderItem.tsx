import { IoCheckmarkSharp, IoClose } from 'react-icons/io5'

import { useConfetti } from '@/app/(Global)/ConfettiControl'
import { Card } from '@/components/Card'
import { GlossaryText } from '@/components/GlossaryText'
import { MatchCard, useMatch } from '@/hooks/useMatch'

interface SliderItemProps {
  card: MatchCard
}

export function SliderItem({ card }: SliderItemProps) {
  const { open: confetti } = useConfetti()
  const { answer } = useMatch()
  const emoji = card.answered ? (card.answeredCorrectly ? '😁' : '😭') : '🤔'

  const checkAnswer = (userAnswer: MatchCard['answer']) => () => {
    answer(card, userAnswer)
    if (userAnswer === card.answer) {
      confetti()
    }
  }

  return (
    <Card className="flex h-full flex-col justify-around p-5">
      <p className="mb-4 text-center text-7xl">{emoji}</p>
      <GlossaryText className="mb-2 text-center font-serif font-semibold">{card.question}</GlossaryText>
      {card.answered && card.explanation && (
        <div className="mb-1 overflow-auto break-all text-center font-serif font-semibold scrollbar-thin scrollbar-track-white/75 scrollbar-thumb-[#8888884b] dark:scrollbar-track-zinc-700">
          Explicação:
          <br />
          <GlossaryText>{card.explanation}</GlossaryText>
        </div>
      )}
      {!card.answered && (
        <div className="flex justify-around text-white">
          <div
            className="flex aspect-square cursor-pointer justify-center rounded-lg bg-red-500 p-5 active:scale-95"
            onClick={checkAnswer('FALSE')}
          >
            <IoClose size={40} />
          </div>
          <div
            className="flex aspect-square cursor-pointer justify-center rounded-lg bg-green-500 p-5 active:scale-95"
            onClick={checkAnswer('TRUE')}
          >
            <IoCheckmarkSharp size={40} />
          </div>
        </div>
      )}
    </Card>
  )
}
