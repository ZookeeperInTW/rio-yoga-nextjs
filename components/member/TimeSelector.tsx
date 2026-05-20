'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import StepHeader from './StepHeader'
import Icon from '@/components/ui/Icon'
import { createBookingAction } from '@/app/actions/booking'

interface WeekDay { iso: string; d: number; dow: string; mon: string }
interface Slot { t: string; avail: boolean }

interface Props {
  serviceSlug: string; branchSlug?: string; isHome: boolean; teacherId: string
  serviceName: string; serviceDur: number; branchName: string; teacherName: string
  weekDays: WeekDay[]; selectedDate: string; slots: Slot[]
}

export default function TimeSelector(props: Props) {
  const router = useRouter()
  const [sel, setSel] = useState(props.slots.find(s => s.avail)?.t ?? '')
  const [pending, startTransition] = useTransition()

  const handleDayChange = (iso: string) => {
    const params = new URLSearchParams({
      service: props.serviceSlug,
      teacher: props.teacherId,
      date: iso,
    })
    if (props.branchSlug) params.set('branch', props.branchSlug)
    if (props.isHome) params.set('home', '1')
    router.push(`/book/time?${params}`)
  }

  const handleConfirm = () => {
    if (!sel) return
    startTransition(async () => {
      await createBookingAction({
        serviceSlug: props.serviceSlug,
        branchSlug: props.isHome ? undefined : props.branchSlug,
        teacherId: props.teacherId,
        dateIso: props.selectedDate,
        timeStr: sel,
        isInHome: props.isHome,
      })
    })
  }

  return (
    <div className="pb-32" style={{ color: 'var(--fg)' }}>
      <StepHeader step={4} title="Choose a time" />

      {/* summary */}
      <div className="mx-[22px] mt-5 p-3.5 rounded-[14px] flex justify-between items-center"
        style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}>
        <div>
          <div className="font-serif text-[19px]">{props.serviceName}</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
            {props.branchName} · {props.teacherName} · {props.serviceDur} min
          </div>
        </div>
        <button className="text-[12px] font-medium" style={{ color: 'var(--accent)' }}
          onClick={() => router.push('/book/service')}>Edit</button>
      </div>

      {/* week strip */}
      <div className="px-[22px] mt-5">
        <div className="font-serif text-[17px] mb-3">
          {new Date(props.selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="flex gap-1.5">
          {props.weekDays.map(day => {
            const isActive = props.selectedDate === day.iso
            return (
              <button key={day.iso} onClick={() => handleDayChange(day.iso)}
                className="flex-1 pb-3 pt-2.5 rounded-[14px] flex flex-col items-center gap-1 transition-all"
                style={{
                  background: isActive ? 'var(--fg)' : 'transparent',
                  color: isActive ? 'var(--bg)' : 'var(--fg)',
                  border: isActive ? 'none' : '1px solid var(--line)',
                }}>
                <div className="text-[10px] opacity-70 uppercase tracking-[0.4px]">{day.dow}</div>
                <div className="font-serif text-[22px] leading-none">{day.d}</div>
                <div className="text-[9px] opacity-60">{day.mon}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* slot grid */}
      <div className="px-[22px] mt-6">
        <div className="flex justify-between items-baseline mb-3">
          <div className="font-serif text-[17px]">
            {new Date(props.selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div className="text-[11px]" style={{ color: 'var(--dim)' }}>ICT (UTC+7)</div>
        </div>
        {props.slots.length === 0 ? (
          <div className="py-10 text-center text-[13px]" style={{ color: 'var(--dim)' }}>No availability on this day.</div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {props.slots.map(s => {
              const isSel = s.t === sel
              return (
                <button key={s.t} onClick={() => s.avail && setSel(s.t)} disabled={!s.avail}
                  className="py-3.5 rounded-xl font-serif text-[18px] transition-all"
                  style={{
                    background: isSel ? 'var(--accent)' : 'var(--surface)',
                    color: isSel ? '#fff' : s.avail ? 'var(--fg)' : 'var(--dim)',
                    border: isSel ? 'none' : '1px solid var(--line)',
                    textDecoration: s.avail ? 'none' : 'line-through',
                    opacity: s.avail ? 1 : 0.4,
                    cursor: s.avail ? 'pointer' : 'not-allowed',
                  }}>
                  {s.t}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* confirm CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] px-[22px] pb-9 pt-3.5 z-30"
        style={{ background: 'linear-gradient(to top, var(--bg) 50%, transparent)' }}>
        <button onClick={handleConfirm} disabled={!sel || pending}
          className="w-full flex justify-between items-center px-[22px] py-[18px] rounded-2xl disabled:opacity-40"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
          <div>
            <div className="text-[11px] opacity-60 uppercase tracking-[0.4px]">
              {pending ? 'Creating booking…' : 'Confirm'}
            </div>
            {sel && <div className="font-serif text-[19px] mt-0.5">
              {new Date(props.selectedDate).toLocaleDateString('en-US', { weekday: 'short' })} · {sel}
            </div>}
          </div>
          <Icon name="arrow" size={22} color="var(--bg)" />
        </button>
      </div>
    </div>
  )
}
