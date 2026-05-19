'use client'

import { useRouter } from 'next/navigation'
import { RIO, RIO_SLOTS, WEEK_STRIP } from '@/lib/data'
import { useBooking } from '@/context/booking-context'
import StepHeader from '@/components/member/StepHeader'
import Icon from '@/components/ui/Icon'

export default function BookTimePage() {
  const router = useRouter()
  const { booking, setBooking } = useBooking()
  const sel = booking.time
  const dayIdx = booking.dayIdx

  const service = RIO.services.find(s => s.id === booking.serviceId)
  const teacher = booking.teacherId === 'any'
    ? { name: 'Any teacher' }
    : RIO.teachers.find(t => t.id === booking.teacherId)
  const branch = RIO.branches.find(b => b.id === booking.branchId)

  return (
    <div className="pb-32" style={{ color: 'var(--fg)' }}>
      <StepHeader step={4} title="Choose a time" />

      {/* summary card */}
      <div
        className="mx-[22px] mt-5 p-3.5 rounded-[14px] flex justify-between items-center"
        style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}
      >
        <div>
          <div className="font-serif text-[19px]">{service?.name}</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
            {branch?.name ?? 'In-home'} · {teacher?.name} · {service?.dur} min
          </div>
        </div>
        <button className="text-[12px] font-medium" style={{ color: 'var(--accent)' }}
          onClick={() => router.push('/book/service')}>Edit</button>
      </div>

      {/* week strip */}
      <div className="px-[22px] mt-5">
        <div className="font-serif text-[17px] mb-3">May 2026</div>
        <div className="flex gap-2">
          {WEEK_STRIP.map((d, i) => {
            const isActive = dayIdx === i
            return (
              <button
                key={i}
                onClick={() => setBooking({ dayIdx: i })}
                className="flex-1 pb-3 pt-2.5 rounded-[14px] flex flex-col items-center gap-1 transition-all"
                style={{
                  background: isActive ? 'var(--fg)' : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--fg)',
                  border: isActive ? 'none' : '1px solid var(--line)',
                }}
              >
                <div className="text-[10px] opacity-70 uppercase tracking-[0.4px]">{d.dow}</div>
                <div className="font-serif text-[22px] leading-none">{d.d}</div>
                <div className="text-[9px] opacity-60">{d.avail} slots</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* slot grid */}
      <div className="px-[22px] mt-6">
        <div className="flex justify-between items-baseline mb-3">
          <div className="font-serif text-[17px]">
            {['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'][dayIdx]} · May {WEEK_STRIP[dayIdx].d}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--dim)' }}>ICT (UTC+7)</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {RIO_SLOTS.map(s => {
            const isSel = s.t === sel
            return (
              <button
                key={s.t}
                onClick={() => s.avail && setBooking({ time: s.t })}
                disabled={!s.avail}
                className="py-3.5 rounded-xl font-serif text-[18px] transition-all"
                style={{
                  background: isSel ? 'var(--accent)' : 'var(--surface)',
                  color: isSel ? '#fff' : s.avail ? 'var(--fg)' : 'var(--dim)',
                  border: isSel ? 'none' : '1px solid var(--line)',
                  textDecoration: s.avail ? 'none' : 'line-through',
                  opacity: s.avail ? 1 : 0.4,
                  cursor: s.avail ? 'pointer' : 'not-allowed',
                }}
              >
                {s.t}
              </button>
            )
          })}
        </div>
      </div>

      {/* bottom CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] px-[22px] pb-9 pt-3.5 z-30"
        style={{ background: 'linear-gradient(to top, var(--bg) 50%, transparent)' }}
      >
        <button
          onClick={() => router.push('/book/confirm')}
          className="w-full flex justify-between items-center px-[22px] py-[18px] rounded-2xl"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}
        >
          <div>
            <div className="text-[11px] opacity-60 uppercase tracking-[0.4px]">Confirm</div>
            <div className="font-serif text-[19px] mt-0.5">
              {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'][dayIdx]} · {sel}
            </div>
          </div>
          <Icon name="arrow" size={22} color="var(--bg)" />
        </button>
      </div>
    </div>
  )
}
