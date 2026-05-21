'use client'

import { useState } from 'react'
import Icon from '@/components/ui/Icon'

interface Member {
  id: string; name: string; phone: string; initial: string
  remaining: number; totalBookings: number; packageCount: number; joinedAt: string
}

export default function AdminMembersClient({ members }: { members: Member[] }) {
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  )

  const joinedYear = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 px-7 py-[18px] shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="flex-1">
          <div className="font-serif text-[26px] tracking-[-0.4px]">Members</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>{members.length} members</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: '1px solid var(--line)' }}>
          <Icon name="search" size={14} color="var(--dim)" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or phone…" className="bg-transparent text-[13px] w-48" style={{ color: 'var(--fg)' }} />
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px]"
          style={{ background: 'var(--accent)', color: '#fff' }}
          onClick={() => showToast('Add member — coming soon')}>
          <Icon name="plus" size={14} color="#fff" />
          Add member
        </button>
      </div>

      <div className="flex-1 overflow-auto p-7">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {['Member', 'Phone', 'Classes left', 'Bookings', 'Joined', ''].map(h => (
                <th key={h} className="text-left pb-3 pr-6 font-medium text-[11px] uppercase tracking-[0.4px]"
                  style={{ color: 'var(--dim)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--line)' }}>
                <td className="py-3.5 pr-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-serif text-[14px] italic shrink-0"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {m.initial}
                    </div>
                    <span className="font-serif text-[15px]">{m.name}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-6 font-mono text-[12px]" style={{ color: 'var(--dim)' }}>{m.phone}</td>
                <td className="py-3.5 pr-6">
                  <span className="px-2.5 py-1 rounded-full text-[11px]"
                    style={{ background: m.remaining > 0 ? 'var(--ok-soft)' : 'var(--surface2)', color: m.remaining > 0 ? '#3D5A30' : 'var(--dim)' }}>
                    {m.remaining} left
                  </span>
                </td>
                <td className="py-3.5 pr-6" style={{ color: 'var(--dim)' }}>{m.totalBookings}</td>
                <td className="py-3.5 pr-6 text-[12px]" style={{ color: 'var(--dim)' }}>{joinedYear(m.joinedAt)}</td>
                <td className="py-3.5">
                  <button onClick={() => showToast(`Edit ${m.name} — coming soon`)}>
                    <Icon name="settings" size={15} color="var(--dim)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
