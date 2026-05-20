'use client'

import Link from 'next/link'
import Icon from '@/components/ui/Icon'

interface ConfirmBooking {
  id: string; bookingRef: string; serviceName: string; durationMin: number
  teacherName: string; branchName: string; studioName: string
  startTime: string; endTime: string
}

export default function ConfirmClient({ booking }: { booking: ConfirmBooking }) {
  const start = new Date(booking.startTime)
  const dayLabel = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const timeLabel = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  const handleAddToCalendar = () => {
    const end = new Date(booking.endTime)
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g,'').slice(0,15) + 'Z'
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(booking.serviceName + ' at RIO Yoga')}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(`Booking ID: ${booking.bookingRef}`)}&location=${encodeURIComponent(booking.branchName)}`
    window.open(url, '_blank')
  }

  return (
    <div style={{ color: 'var(--fg)' }} className="min-h-screen flex flex-col">
      <div className="flex justify-end px-[22px] pt-3.5">
        <Link href="/dashboard" className="text-[13px]" style={{ color: 'var(--dim)' }}>Done</Link>
      </div>

      <div className="flex-1 px-[26px] py-7 flex flex-col">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
          <Icon name="check" size={42} color="var(--accent)" />
        </div>

        <div className="font-serif text-[42px] leading-[1.0] tracking-[-0.8px] mt-6">
          You&apos;re<br />
          <span className="italic" style={{ color: 'var(--accent)' }}>booked.</span>
        </div>
        <p className="text-[13px] mt-3 leading-relaxed" style={{ color: 'var(--dim)' }}>
          Confirmation sent by SMS and email. Cancel up to 24h before for a full credit refund.
        </p>

        <div className="mt-8 p-5 rounded-[18px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
          <div className="text-[11px] uppercase tracking-[0.5px]" style={{ color: 'var(--accent)' }}>{booking.serviceName}</div>
          <div className="font-serif text-[28px] mt-1 tracking-[-0.4px]">{dayLabel}</div>
          <div className="font-serif text-[22px]" style={{ color: 'var(--dim)' }}>{timeLabel} · {booking.durationMin} min</div>
          <div className="h-px my-4" style={{ background: 'var(--line)' }} />
          <div className="flex flex-col gap-2.5 text-[13px]">
            {[
              { label: 'Teacher', value: booking.teacherName },
              { label: 'Location', value: booking.studioName !== '—' ? `${booking.branchName} · ${booking.studioName}` : booking.branchName },
              { label: 'Booking ID', value: booking.bookingRef, mono: true },
            ].map(r => (
              <div key={r.label} className="flex justify-between">
                <span style={{ color: 'var(--dim)' }}>{r.label}</span>
                <span className={r.mono ? 'font-mono text-[11px]' : ''}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button onClick={handleAddToCalendar} className="py-3.5 rounded-[14px] text-[13px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
            Add to calendar
          </button>
          <button onClick={() => navigator.share?.({ title: `RIO Yoga — ${booking.serviceName}`, text: `Booking ${booking.bookingRef} on ${dayLabel} at ${timeLabel}` })}
            className="py-3.5 rounded-[14px] text-[13px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
            Share
          </button>
        </div>

        <div className="flex-1" />

        <Link href="/dashboard"
          className="flex justify-between items-center px-[22px] py-4 rounded-[14px] mb-10 mt-6"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
          <span className="font-serif text-[17px]">Back to home</span>
          <Icon name="arrow" size={20} color="var(--bg)" />
        </Link>
      </div>
    </div>
  )
}
