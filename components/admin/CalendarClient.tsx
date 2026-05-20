'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminGrid from './AdminGrid'
import ManualBookingModal from './ManualBookingModal'
import Icon from '@/components/ui/Icon'

interface Branch { id: string; slug: string; name: string }
interface Studio { id: string; name: string; kind: string }
interface Booking {
  id: string; clientName: string; teacherName: string; serviceName: string; serviceSlug: string
  studioId: string; startTime: string; endTime: string; status: string; kind: string; isInHome: boolean
}
interface Teacher { id: string; name: string }
interface Member { id: string; name: string; phone: string; remaining: number }
interface Service { id: string; slug: string; name: string; durationMin: number }

interface Props {
  branches: Branch[]
  currentBranchSlug: string
  currentDate: string
  studios: Studio[]
  bookings: Booking[]
  teachers: Teacher[]
  members: Member[]
  services: Service[]
}

function addDays(iso: string, n: number) {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC',
  })
}

export default function AdminCalendarClient({
  branches, currentBranchSlug, currentDate, studios, bookings, teachers, members, services,
}: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const navigate = (date: string, branch?: string) => {
    const p = new URLSearchParams({ date, branch: branch ?? currentBranchSlug })
    router.push(`/admin/calendar?${p}`)
  }

  return (
    <div className="flex flex-col h-full">
      {/* topbar */}
      <div className="flex items-center gap-4 px-7 py-[18px] shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="flex-1">
          <div className="font-serif text-[26px] tracking-[-0.4px]">Calendar</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
            {fmtDate(currentDate)} · {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* branch selector */}
        <div className="flex gap-1.5">
          {branches.map(b => {
            const active = b.slug === currentBranchSlug
            return (
              <button key={b.slug} onClick={() => navigate(currentDate, b.slug)}
                className="px-3 py-1.5 rounded-lg text-[12px] transition-all"
                style={{
                  background: active ? 'var(--fg)' : 'var(--surface)',
                  color: active ? 'var(--bg)' : 'var(--dim)',
                  border: active ? 'none' : '1px solid var(--line)',
                }}>
                {b.name}
              </button>
            )
          })}
        </div>

        {/* date nav */}
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(addDays(currentDate, -1))}
            className="p-2 rounded-lg" style={{ border: '1px solid var(--line)' }}>
            <Icon name="back" size={14} color="var(--fg)" />
          </button>
          <input type="date" value={currentDate}
            onChange={e => e.target.value && navigate(e.target.value)}
            className="text-[13px] px-2 py-1.5 rounded-lg bg-transparent"
            style={{ border: '1px solid var(--line)', color: 'var(--fg)' }} />
          <button onClick={() => navigate(addDays(currentDate, 1))}
            className="p-2 rounded-lg" style={{ border: '1px solid var(--line)' }}>
            <Icon name="chev" size={14} color="var(--fg)" />
          </button>
        </div>

        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px]"
          style={{ background: 'var(--accent)', color: '#fff' }}>
          <Icon name="plus" size={14} color="#fff" />
          New booking
        </button>
      </div>

      {/* grid */}
      <div className="flex-1 p-4 overflow-auto min-h-0">
        <AdminGrid studios={studios} bookings={bookings} />
      </div>

      {showModal && (
        <ManualBookingModal
          onClose={() => setShowModal(false)}
          dateStr={currentDate}
          members={members}
          teachers={teachers}
          studios={studios}
          services={services}
        />
      )}
    </div>
  )
}
