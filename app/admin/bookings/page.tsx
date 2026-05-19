'use client'

import { useState } from 'react'
import { ADMIN_BOOKINGS, ADMIN_TIMES, ADMIN_COLS } from '@/lib/data'
import Icon from '@/components/ui/Icon'

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('')

  const bookings = ADMIN_BOOKINGS.filter(b =>
    b.client.toLowerCase().includes(search.toLowerCase()) ||
    b.teacher.toLowerCase().includes(search.toLowerCase()) ||
    b.label.toLowerCase().includes(search.toLowerCase())
  )

  const kindColor = (kind: string) => {
    if (kind === 'private') return { bg: 'var(--accent-soft)', ink: 'var(--accent-ink)' }
    if (kind === 'group') return { bg: 'var(--ok-soft)', ink: '#3D5A30' }
    if (kind === 'massage') return { bg: '#E4DDEE', ink: '#3F2E5C' }
    return { bg: 'var(--surface2)', ink: 'var(--dim)' }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 px-7 py-[18px]" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="flex-1">
          <div className="font-serif text-[26px] tracking-[-0.4px]">Bookings</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>Monday, 26 May 2026</div>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ border: '1px solid var(--line)' }}
        >
          <Icon name="search" size={14} color="var(--dim)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bookings…"
            className="bg-transparent text-[13px] w-48"
            style={{ color: 'var(--fg)' }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-7">
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {['Time', 'Client', 'Service', 'Teacher', 'Studio', 'Status'].map(h => (
                <th key={h} className="text-left pb-3 pr-6 font-medium text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => {
              const c = kindColor(b.kind)
              return (
                <tr
                  key={i}
                  className="transition-colors"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  <td className="py-3.5 pr-6 font-mono text-[12px]">{ADMIN_TIMES[b.startIdx]}</td>
                  <td className="py-3.5 pr-6 font-serif text-[15px]">{b.client}</td>
                  <td className="py-3.5 pr-6">
                    <span className="px-2.5 py-1 rounded-full text-[11px]" style={{ background: c.bg, color: c.ink }}>
                      {b.label}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6" style={{ color: 'var(--dim)' }}>{b.teacher}</td>
                  <td className="py-3.5 pr-6" style={{ color: 'var(--dim)' }}>{ADMIN_COLS[b.col]?.studio ?? '—'}</td>
                  <td className="py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px]"
                      style={{ background: 'var(--ok-soft)', color: '#3D5A30' }}
                    >
                      Confirmed
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
