'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RIO, WEEK_STRIP } from '@/lib/data'
import { useBooking } from '@/context/booking-context'
import Icon from '@/components/ui/Icon'

export default function BookConfirmPage() {
  const router = useRouter()
  const { booking, reset } = useBooking()

  const service = RIO.services.find(s => s.id === booking.serviceId)
  const teacher = booking.teacherId === 'any'
    ? 'Any available'
    : RIO.teachers.find(t => t.id === booking.teacherId)?.name ?? '—'
  const branch = booking.locationType === 'home'
    ? 'In-home'
    : (RIO.branches.find(b => b.id === booking.branchId)?.name ?? '—') + ' · Studio 2'
  const day = WEEK_STRIP[booking.dayIdx]
  const bookingId = `RIO-${Math.floor(Math.random() * 9000 + 1000)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`

  const handleHome = () => {
    reset()
    router.push('/dashboard')
  }

  return (
    <div style={{ color: 'var(--fg)' }} className="min-h-screen flex flex-col">
      <div className="flex justify-end px-[22px] pt-3.5">
        <button className="text-[13px]" style={{ color: 'var(--dim)' }} onClick={handleHome}>Done</button>
      </div>

      <div className="flex-1 px-[26px] py-7 flex flex-col">
        {/* check icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent-soft)' }}
        >
          <Icon name="check" size={42} color="var(--accent)" />
        </div>

        <div className="font-serif text-[42px] leading-[1.0] tracking-[-0.8px] mt-6">
          You&apos;re
          <br />
          <span className="italic" style={{ color: 'var(--accent)' }}>booked.</span>
        </div>
        <p className="text-[13px] mt-3 leading-relaxed" style={{ color: 'var(--dim)' }}>
          We&apos;ve sent a confirmation by SMS and email. Cancel up to 24h before for a full credit refund.
        </p>

        {/* booking detail card */}
        <div
          className="mt-8 p-5 rounded-[18px]"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div className="text-[11px] uppercase tracking-[0.5px]" style={{ color: 'var(--accent)' }}>
            {service?.name}
          </div>
          <div className="font-serif text-[28px] mt-1 tracking-[-0.4px]">
            {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'][booking.dayIdx]} · May {day.d}
          </div>
          <div className="font-serif text-[22px]" style={{ color: 'var(--dim)' }}>
            {booking.time} · {service?.dur} min
          </div>

          <div className="h-px my-4" style={{ background: 'var(--line)' }} />

          <div className="flex flex-col gap-2.5 text-[13px]">
            {[
              { label: 'Teacher', value: teacher },
              { label: 'Location', value: branch },
              { label: 'Booking ID', value: bookingId, mono: true },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span style={{ color: 'var(--dim)' }}>{row.label}</span>
                <span className={row.mono ? 'font-mono text-[11px]' : ''}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* action buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            className="py-3.5 rounded-[14px] text-[13px]"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            Add to calendar
          </button>
          <button
            className="py-3.5 rounded-[14px] text-[13px]"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            Share
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={handleHome}
          className="flex justify-between items-center px-[22px] py-4 rounded-[14px] mb-10 mt-6"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}
        >
          <span className="font-serif text-[17px]">Back to home</span>
          <Icon name="arrow" size={20} color="var(--bg)" />
        </button>
      </div>
    </div>
  )
}
