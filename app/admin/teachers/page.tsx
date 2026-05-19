'use client'

import { useState } from 'react'
import { ADMIN_TEACHERS_EXTENDED } from '@/lib/data'
import AvailabilityGrid from '@/components/admin/AvailabilityGrid'
import Icon from '@/components/ui/Icon'

const STATS = [
  { label: 'Sessions this month', value: '47' },
  { label: 'Hours scheduled', value: '38.5' },
  { label: 'Avg rating', value: '4.92' },
]

export default function AdminTeachersPage() {
  const [sel, setSel] = useState('t1')
  const [toast, setToast] = useState<string | null>(null)
  const [showAddException, setShowAddException] = useState(false)

  const selected = ADMIN_TEACHERS_EXTENDED.find(t => t.id === sel) ?? ADMIN_TEACHERS_EXTENDED[0]

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="flex h-full">
      {/* topbar */}
      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="flex items-center gap-4 px-7 py-[18px] shrink-0"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <div className="flex-1">
            <div className="font-serif text-[26px] tracking-[-0.4px]">Teachers</div>
            <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
              {ADMIN_TEACHERS_EXTENDED.length} teachers · 3 specialties
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px]"
            style={{ background: 'var(--accent)', color: '#fff' }}
            onClick={() => showToast('Add teacher form coming soon')}
          >
            <Icon name="plus" size={14} color="#fff" />
            Add teacher
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* teacher list */}
          <div
            className="w-[280px] shrink-0 overflow-y-auto scrollbar-hide"
            style={{ borderRight: '1px solid var(--line)' }}
          >
            {ADMIN_TEACHERS_EXTENDED.map(tea => {
              const active = sel === tea.id
              return (
                <button
                  key={tea.id}
                  onClick={() => setSel(tea.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                  style={{
                    background: active ? 'var(--surface)' : 'transparent',
                    borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-[38px] h-[38px] rounded-full shrink-0 flex items-center justify-center font-serif text-[16px] italic"
                    style={{ background: 'var(--surface2)', color: 'var(--accent)' }}
                  >
                    {tea.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-[16px] truncate">{tea.name}</div>
                    <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--dim)' }}>
                      {tea.spec.join(' · ')}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* detail panel */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-[28px] italic shrink-0"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {selected.name[0]}
              </div>
              <div className="flex-1">
                <div className="font-serif text-[28px] tracking-[-0.4px]">{selected.name}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
                  {selected.spec.join(' · ')} · {selected.yrs} years · joined Mar 2023
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3.5 py-2 rounded-lg text-[12px]"
                  style={{ border: '1px solid var(--line)' }}
                  onClick={() => showToast('Edit profile — coming soon')}
                >
                  Edit profile
                </button>
                <button
                  className="px-3.5 py-2 rounded-lg text-[12px]"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
                  onClick={() => showToast(`Message sent to ${selected.name}`)}
                >
                  Send message
                </button>
              </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 gap-3 mt-7">
              {STATS.map(s => (
                <div
                  key={s.label}
                  className="p-4 rounded-[14px]"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
                >
                  <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>{s.label}</div>
                  <div className="font-serif text-[32px] mt-1">{s.value}</div>
                </div>
              ))}
            </div>

            {/* availability */}
            <div
              className="mt-7 p-[22px] rounded-2xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
            >
              <div className="flex justify-between items-baseline">
                <div>
                  <div className="font-serif text-[20px]">Weekly availability</div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
                    Default pattern · effective from May 1, 2026
                  </div>
                </div>
                <button
                  className="text-[12px]"
                  style={{ color: 'var(--accent)' }}
                  onClick={() => setShowAddException(v => !v)}
                >
                  + Add exception
                </button>
              </div>
              <AvailabilityGrid />
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
        <div
          className="fixed bottom-6 right-6 px-4 py-3 rounded-xl text-[13px] flex items-center gap-2 z-50"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}
        >
          <Icon name="check" size={16} color="var(--bg)" />
          {toast}
        </div>
      )}
    </div>
  )
}
