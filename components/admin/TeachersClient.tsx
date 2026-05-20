'use client'

import { useState } from 'react'
import AvailabilityGrid from './AvailabilityGrid'
import Icon from '@/components/ui/Icon'

interface AvailBlock { dayOfWeek: number; startHour: number; endHour: number }
interface Teacher {
  id: string; name: string; yearsExp: number; sessions: number
  hoursScheduled: number; avgRating: number; specialties: string[]; availability: AvailBlock[]
}

export default function AdminTeachersClient({ teachers }: { teachers: Teacher[] }) {
  const [selId, setSelId] = useState(teachers[0]?.id ?? '')
  const [toast, setToast] = useState<string | null>(null)
  const [showAddException, setShowAddException] = useState(false)

  const selected = teachers.find(t => t.id === selId) ?? teachers[0]

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  if (!selected) {
    return <div className="p-7 text-[14px]" style={{ color: 'var(--dim)' }}>No teachers found.</div>
  }

  const stats = [
    { label: 'Sessions this month', value: selected.sessions.toString() },
    { label: 'Hours scheduled', value: selected.hoursScheduled.toString() },
    { label: 'Avg rating', value: selected.avgRating.toFixed(2) },
  ]

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        {/* topbar */}
        <div className="flex items-center gap-4 px-7 py-[18px] shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="flex-1">
            <div className="font-serif text-[26px] tracking-[-0.4px]">Teachers</div>
            <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
              {teachers.length} teachers
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px]"
            style={{ background: 'var(--accent)', color: '#fff' }}
            onClick={() => showToast('Add teacher form coming soon')}>
            <Icon name="plus" size={14} color="#fff" />
            Add teacher
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* list */}
          <div className="w-[280px] shrink-0 overflow-y-auto" style={{ borderRight: '1px solid var(--line)' }}>
            {teachers.map(t => {
              const active = selId === t.id
              return (
                <button key={t.id} onClick={() => setSelId(t.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                  style={{ background: active ? 'var(--surface)' : 'transparent', borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}` }}>
                  <div className="w-[38px] h-[38px] rounded-full shrink-0 flex items-center justify-center font-serif text-[16px] italic"
                    style={{ background: 'var(--surface2)', color: 'var(--accent)' }}>
                    {t.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-[16px] truncate">{t.name}</div>
                    <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--dim)' }}>
                      {t.specialties.join(' · ')}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* detail */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-[28px] italic shrink-0"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {selected.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-serif text-[28px] tracking-[-0.4px]">{selected.name}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
                  {selected.specialties.join(' · ')} · {selected.yearsExp} years exp
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3.5 py-2 rounded-lg text-[12px]" style={{ border: '1px solid var(--line)' }}
                  onClick={() => showToast('Edit profile — coming soon')}>Edit profile</button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-7">
              {stats.map(s => (
                <div key={s.label} className="p-4 rounded-[14px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>{s.label}</div>
                  <div className="font-serif text-[32px] mt-1">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-7 p-[22px] rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="font-serif text-[20px]">Weekly availability</div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>Recurring weekly schedule</div>
                </div>
                <button className="text-[12px]" style={{ color: 'var(--accent)' }}
                  onClick={() => setShowAddException(v => !v)}>
                  + Add exception
                </button>
              </div>
              <AvailabilityGrid key={selected.id} teacherId={selected.id} initialBlocks={selected.availability} />
              {showAddException && (
                <div className="mt-4 p-3 rounded-xl text-[13px]" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
                  <p style={{ color: 'var(--dim)' }}>Exception date picker — coming in next iteration.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-3 rounded-xl text-[13px] flex items-center gap-2 z-50"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
          <Icon name="check" size={16} color="var(--bg)" />
          {toast}
        </div>
      )}
    </div>
  )
}
