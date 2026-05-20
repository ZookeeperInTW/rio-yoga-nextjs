'use client'

import Link from 'next/link'
import TabBar from './TabBar'
import Icon from '@/components/ui/Icon'

interface Booking {
  id: string; serviceName: string; teacherName: string
  branchName: string; studioName: string
  startTime: string; durationMin: number; status: string
}

function ictDate(iso: string) {
  // Add 7h to UTC to get ICT
  const d = new Date(new Date(iso).getTime() + 7 * 3600_000)
  return {
    dow: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
    day: d.getUTCDate(),
    mon: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
    time: `${d.getUTCHours().toString().padStart(2,'0')}:${d.getUTCMinutes().toString().padStart(2,'0')}`,
  }
}

export default function ScheduleClient({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen relative pb-28" style={{ color: 'var(--fg)' }}>
        <div className="h-14" />

        <div className="px-[22px] pt-3 pb-6">
          <div className="font-serif text-[32px] tracking-[-0.5px]">Schedule</div>
          <div className="text-[13px] mt-1" style={{ color: 'var(--dim)' }}>
            {bookings.length} upcoming session{bookings.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="px-[22px] flex flex-col gap-3">
          {bookings.length === 0 && (
            <div className="py-12 text-center text-[14px]" style={{ color: 'var(--dim)' }}>
              No upcoming bookings.
            </div>
          )}
          {bookings.map(b => {
            const dt = ictDate(b.startTime)
            const location = b.studioName !== '—' ? `${b.branchName} · ${b.studioName}` : b.branchName
            return (
              <div key={b.id} className="flex gap-3.5 p-4 rounded-[18px] items-stretch"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <div className="w-16 rounded-xl flex flex-col items-center justify-center py-2.5 shrink-0"
                  style={{ background: 'var(--surface2)' }}>
                  <div className="text-[10px] uppercase tracking-[0.5px]" style={{ color: 'var(--dim)' }}>{dt.dow}</div>
                  <div className="font-serif text-[26px] leading-none mt-0.5">{dt.day}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--dim)' }}>{dt.mon}</div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--accent)' }}>
                    {b.serviceName}
                  </div>
                  <div className="font-serif text-[19px] mt-0.5">{dt.time} · {b.durationMin} min</div>
                  <div className="text-[12px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--dim)' }}>
                    <Icon name="pin" size={12} color="var(--dim)" />
                    {location} · {b.teacherName}
                  </div>
                </div>
                <div className="self-center">
                  <span className="px-2 py-1 rounded-full text-[10px] capitalize"
                    style={{ background: b.status === 'confirmed' ? 'var(--ok-soft)' : 'var(--surface2)', color: b.status === 'confirmed' ? '#3D5A30' : 'var(--dim)' }}>
                    {b.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-[22px] mt-6">
          <Link href="/book/service"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px]"
            style={{ border: '1px dashed var(--line)', color: 'var(--dim)' }}>
            <Icon name="plus" size={16} color="var(--dim)" />
            Book another session
          </Link>
        </div>

        <TabBar />
      </div>
    </div>
  )
}
