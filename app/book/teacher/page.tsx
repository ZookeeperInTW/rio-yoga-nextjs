'use client'

import { useRouter } from 'next/navigation'
import { RIO } from '@/lib/data'
import { useBooking } from '@/context/booking-context'
import StepHeader from '@/components/member/StepHeader'
import StepCTA from '@/components/member/StepCTA'
import Icon from '@/components/ui/Icon'

export default function BookTeacherPage() {
  const router = useRouter()
  const { booking, setBooking } = useBooking()
  const sel = booking.teacherId

  return (
    <div className="pb-32">
      <StepHeader step={3} title="Choose a teacher" />

      <div className="px-[22px] mt-[18px]">
        {/* any teacher */}
        <button
          onClick={() => setBooking({ teacherId: 'any' })}
          className="w-full flex items-center gap-3.5 p-4 rounded-2xl transition-all"
          style={{
            background: sel === 'any' ? 'var(--fg)' : 'var(--accent-soft)',
            color: sel === 'any' ? 'var(--bg)' : 'var(--accent-ink)',
          }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: sel === 'any' ? 'rgba(255,255,255,0.18)' : '#fff',
            }}
          >
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
        {RIO.teachers.map(tea => {
          const isSel = sel === tea.id
          return (
            <button
              key={tea.id}
              onClick={() => setBooking({ teacherId: tea.id })}
              className="flex gap-3.5 items-center p-3.5 rounded-2xl text-left transition-all"
              style={{
                background: 'var(--surface)',
                border: isSel ? `1.5px solid var(--accent)` : '1px solid var(--line)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-serif text-[19px] italic shrink-0"
                style={{ background: 'var(--surface2)', color: 'var(--accent)' }}
              >
                {tea.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-serif text-[17px]">{tea.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--dim)' }}>
                  {tea.spec.join(' · ')} · {tea.yrs} yrs
                </div>
              </div>
              {isSel && <Icon name="check" size={20} color="var(--accent)" />}
            </button>
          )
        })}
      </div>

      <StepCTA label="Continue · Time" onClick={() => router.push('/book/time')} />
    </div>
  )
}
