'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'
import { adminCancelBookingAction } from '@/app/actions/booking'

interface Booking {
  id: string; bookingRef: string; clientName: string; serviceName: string
  kind: string; teacherName: string; studioName: string; branchName: string
  startTime: string; status: string
}

function kindColor(kind: string) {
  if (kind === 'private') return { bg: 'var(--accent-soft)', ink: 'var(--accent-ink)' }
  if (kind === 'group') return { bg: 'var(--ok-soft)', ink: '#3D5A30' }
  if (kind === 'massage') return { bg: '#E4DDEE', ink: '#3F2E5C' }
  return { bg: 'var(--surface2)', ink: 'var(--dim)' }
}

function statusColor(status: string) {
  if (status === 'confirmed') return { bg: 'var(--ok-soft)', ink: '#3D5A30' }
  if (status === 'cancelled') return { bg: '#FEE2E2', ink: '#991B1B' }
  return { bg: 'var(--surface2)', ink: 'var(--dim)' }
}

function ictTime(iso: string) {
  const h = (new Date(iso).getUTCHours() + 7) % 24
  const m = new Date(iso).getUTCMinutes()
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`
}

function addDays(iso: string, n: number) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function AdminBookingsClient({ dateStr, bookings }: { dateStr: string; bookings: Booking[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [cancelPending, startCancel] = useTransition()
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const handleCancel = (id: string) => {
    setCancellingId(id)
    startCancel(async () => {
      await adminCancelBookingAction(id)
      router.refresh()
      setCancellingId(null)
    })
  }

  const filtered = bookings.filter(b =>
    b.clientName.toLowerCase().includes(search.toLowerCase()) ||
    b.teacherName.toLowerCase().includes(search.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingRef.toLowerCase().includes(search.toLowerCase())
  )

  const dayLabel = new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })

  const navigate = (date: string) => router.push(`/admin/bookings?date=${date}`)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 px-7 py-[18px]" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="flex-1">
          <div className="font-serif text-[26px] tracking-[-0.4px]">Bookings</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>{dayLabel}</div>
        </div>

        {/* date nav */}
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(addDays(dateStr, -1))}
            className="p-2 rounded-lg" style={{ border: '1px solid var(--line)' }}>
            <Icon name="back" size={14} color="var(--fg)" />
          </button>
          <input type="date" value={dateStr} onChange={e => e.target.value && navigate(e.target.value)}
            className="text-[13px] px-2 py-1.5 rounded-lg bg-transparent"
            style={{ border: '1px solid var(--line)', color: 'var(--fg)' }} />
          <button onClick={() => navigate(addDays(dateStr, 1))}
            className="p-2 rounded-lg" style={{ border: '1px solid var(--line)' }}>
            <Icon name="chev" size={14} color="var(--fg)" />
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: '1px solid var(--line)' }}>
          <Icon name="search" size={14} color="var(--dim)" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search bookings…" className="bg-transparent text-[13px] w-48" style={{ color: 'var(--fg)' }} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-7">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[14px]" style={{ color: 'var(--dim)' }}>No bookings for this date.</div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                {['Time', 'Client', 'Service', 'Teacher', 'Studio', 'Ref', 'Status'].map(h => (
                  <th key={h} className="text-left pb-3 pr-6 font-medium text-[11px] uppercase tracking-[0.4px]"
                    style={{ color: 'var(--dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const kc = kindColor(b.kind)
                const sc = statusColor(b.status)
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td className="py-3.5 pr-6 font-mono text-[12px]">{ictTime(b.startTime)}</td>
                    <td className="py-3.5 pr-6 font-serif text-[15px]">{b.clientName}</td>
                    <td className="py-3.5 pr-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] capitalize"
                        style={{ background: kc.bg, color: kc.ink }}>{b.serviceName}</span>
                    </td>
                    <td className="py-3.5 pr-6" style={{ color: 'var(--dim)' }}>{b.teacherName}</td>
                    <td className="py-3.5 pr-6" style={{ color: 'var(--dim)' }}>{b.studioName}</td>
                    <td className="py-3.5 pr-6 font-mono text-[11px]" style={{ color: 'var(--dim)' }}>{b.bookingRef}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] capitalize"
                          style={{ background: sc.bg, color: sc.ink }}>{b.status}</span>
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            disabled={cancelPending && cancellingId === b.id}
                            className="text-[11px] disabled:opacity-40"
                            style={{ color: '#991B1B' }}>
                            {cancelPending && cancellingId === b.id ? '…' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
