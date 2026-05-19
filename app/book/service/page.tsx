'use client'

import { useRouter } from 'next/navigation'
import { RIO } from '@/lib/data'
import { useBooking } from '@/context/booking-context'
import StepHeader from '@/components/member/StepHeader'
import StepCTA from '@/components/member/StepCTA'
import Icon from '@/components/ui/Icon'

export default function BookServicePage() {
  const router = useRouter()
  const { booking, setBooking } = useBooking()
  const sel = booking.serviceId

  return (
    <div className="pb-32">
      <StepHeader step={1} title="What kind of session?" />

      <div className="flex flex-col gap-3 px-[22px] mt-5">
        {RIO.services.map(s => {
          const isSel = sel === s.id
          return (
            <button
              key={s.id}
              onClick={() => setBooking({ serviceId: s.id })}
              className="flex gap-3.5 items-center p-[18px] rounded-[18px] text-left transition-all"
              style={{
                background: isSel ? 'var(--fg)' : 'var(--surface)',
                color: isSel ? 'var(--bg)' : 'var(--fg)',
                border: isSel ? 'none' : '1px solid var(--line)',
              }}
            >
              <div
                className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                style={{
                  background: isSel ? 'rgba(255,255,255,0.12)' : 'var(--accent-soft)',
                  color: isSel ? '#fff' : 'var(--accent)',
                }}
              >
                <Icon name={s.id === 'massage' ? 'massage' : 'yoga'} size={26} color="currentColor" />
              </div>
              <div className="flex-1">
                <div className="font-serif text-[21px] tracking-[-0.3px]">{s.name}</div>
                <div className="text-[12px] mt-0.5 opacity-70">{s.dur} min · {s.desc}</div>
              </div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{
                  border: `1.5px solid ${isSel ? '#fff' : 'var(--line)'}`,
                  background: isSel ? 'var(--accent)' : 'transparent',
                }}
              >
                {isSel && <Icon name="check" size={14} color="#fff" />}
              </div>
            </button>
          )
        })}
      </div>

      <StepCTA label="Continue · Location" onClick={() => router.push('/book/location')} />
    </div>
  )
}
