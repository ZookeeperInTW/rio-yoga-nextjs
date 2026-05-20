'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepHeader from './StepHeader'
import Icon from '@/components/ui/Icon'

interface Teacher { id: string; name: string; yearsExp: number; specs: string[] }

interface Props { serviceSlug: string; branchSlug?: string; isHome: boolean; teachers: Teacher[] }

export default function TeacherSelector({ serviceSlug, branchSlug, isHome, teachers }: Props) {
  const router = useRouter()
  const [sel, setSel] = useState<string>('any')

  const handleContinue = () => {
    const params = new URLSearchParams({ service: serviceSlug, teacher: sel })
    if (branchSlug) params.set('branch', branchSlug)
    if (isHome) params.set('home', '1')
    router.push(`/book/time?${params}`)
  }

  return (
    <div className="pb-32">
      <StepHeader step={3} title="Choose a teacher" />

      <div className="px-[22px] mt-[18px]">
        <button onClick={() => setSel('any')}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl transition-all"
          style={{ background: sel === 'any' ? 'var(--fg)' : 'var(--accent-soft)', color: sel === 'any' ? 'var(--bg)' : 'var(--accent-ink)' }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: sel === 'any' ? 'rgba(255,255,255,0.18)' : '#fff' }}>
            <Icon name="sparkle" size={22} color={sel === 'any' ? '#fff' : 'var(--accent)'} />
          </div>
          <div className="flex-1 text-left">
            <div className="font-serif text-[18px]">Any available teacher</div>
            <div className="text-[12px] mt-0.5 opacity-75">We&apos;ll match you with the best fit</div>
          </div>
        </button>
      </div>

      <div className="px-[22px] mt-[22px] text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>
        Or pick someone you love
      </div>

      <div className="flex flex-col gap-2.5 px-[22px] mt-2.5">
        {teachers.map(t => {
          const isSel = sel === t.id
          return (
            <button key={t.id} onClick={() => setSel(t.id)}
              className="flex gap-3.5 items-center p-3.5 rounded-2xl text-left transition-all"
              style={{ background: 'var(--surface)', border: isSel ? '1.5px solid var(--accent)' : '1px solid var(--line)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-[19px] italic shrink-0"
                style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>{t.name[0]}</div>
              <div className="flex-1">
                <div className="font-serif text-[17px]">{t.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--dim)' }}>{t.specs.join(' · ')} · {t.yearsExp} yrs</div>
              </div>
              {isSel && <Icon name="check" size={20} color="var(--accent)" />}
            </button>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] px-[22px] pb-9 pt-3.5 z-30"
        style={{ background: 'linear-gradient(to top, var(--bg) 50%, transparent)' }}>
        <button onClick={handleContinue}
          className="w-full flex justify-between items-center px-[22px] py-[18px] rounded-2xl"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
          <span className="font-serif text-[17px]">Continue · Time</span>
          <Icon name="arrow" size={22} color="var(--bg)" />
        </button>
      </div>
    </div>
  )
}
