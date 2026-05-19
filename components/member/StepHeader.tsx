'use client'

import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'

interface StepHeaderProps {
  step: number
  total?: number
  title: string
}

export default function StepHeader({ step, total = 4, title }: StepHeaderProps) {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center gap-3.5 px-[22px] pt-3.5 pb-1">
        <button
          onClick={() => router.back()}
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0"
          style={{ border: '1px solid var(--line)' }}
        >
          <Icon name="back" size={18} color="var(--fg)" />
        </button>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>
            Step {step} of {total}
          </div>
          <div className="font-serif text-[22px] mt-0.5 tracking-[-0.3px]">{title}</div>
        </div>
      </div>
      <div className="flex gap-1.5 px-[22px] pt-3.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full"
            style={{ background: i < step ? 'var(--accent)' : 'var(--surface2)' }}
          />
        ))}
      </div>
    </>
  )
}
