'use client'

import { useState } from 'react'
import Icon from '@/components/ui/Icon'

export default function NotificationPanel({ upcomingCount }: { upcomingCount: number }) {
  const [open, setOpen] = useState(false)

  const notes = [
    upcomingCount > 0
      ? { text: `You have ${upcomingCount} upcoming session${upcomingCount !== 1 ? 's' : ''}.`, time: 'Now' }
      : { text: 'No upcoming sessions — time to book!', time: 'Now' },
    { text: 'Package reminder: use your sessions before they expire.', time: '3d ago' },
    { text: 'New teacher available: Eve M. — Private Pilates.', time: '1w ago' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
        style={{ border: '1px solid var(--line)' }}
      >
        <Icon name="bell" size={17} color="var(--fg)" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute top-12 right-0 w-80 rounded-2xl z-50 shadow-modal overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--line)' }}>
              <span className="font-serif text-[17px]">Notifications</span>
              <button onClick={() => setOpen(false)}><Icon name="x" size={16} color="var(--dim)" /></button>
            </div>
            {notes.map((n, i) => (
              <div key={i} className="px-4 py-3 text-[13px]" style={{ borderBottom: i < notes.length - 1 ? '1px solid var(--line)' : undefined }}>
                <p>{n.text}</p>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--dim)' }}>{n.time}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
