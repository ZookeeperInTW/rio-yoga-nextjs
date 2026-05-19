'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RIO } from '@/lib/data'
import TabBar from '@/components/member/TabBar'
import Icon from '@/components/ui/Icon'

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const notes = [
    { text: 'Reminder: Private Pilates tomorrow at 09:00 with Mai L.', time: '2h ago' },
    { text: 'Your booking RIO-0826-Y2A has been confirmed.', time: '1d ago' },
    { text: 'Package expires Aug 12 — 7 classes remaining.', time: '3d ago' },
  ]
  return (
    <div
      className="absolute top-16 right-4 w-80 rounded-2xl z-50 shadow-modal overflow-hidden"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--line)' }}>
        <span className="font-serif text-[17px]">Notifications</span>
        <button onClick={onClose}><Icon name="x" size={16} color="var(--dim)" /></button>
      </div>
      {notes.map((n, i) => (
        <div key={i} className="px-4 py-3 text-[13px]" style={{ borderBottom: i < notes.length - 1 ? '1px solid var(--line)' : undefined }}>
          <p>{n.text}</p>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--dim)' }}>{n.time}</p>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const u = RIO.member
  const [showNotif, setShowNotif] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen relative pb-28" style={{ color: 'var(--fg)' }}>

        <div className="h-14" />

        {/* top bar */}
        <div className="relative px-[22px] pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-serif text-[22px] italic"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}
            >
              {u.initial}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>Good morning</div>
              <div className="font-serif text-[19px] mt-0.5">{u.name.split(' ')[0]}</div>
            </div>
          </div>
          <button
            onClick={() => setShowNotif(v => !v)}
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
            style={{ border: '1px solid var(--line)' }}
          >
            <Icon name="bell" size={17} color="var(--fg)" />
          </button>
          {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
        </div>

        {/* hero */}
        <div className="px-[22px] py-[18px] pb-6">
          <div className="font-serif text-[38px] leading-[1.05] tracking-[-0.5px]">
            Three sessions
            <br />
            <span className="italic" style={{ color: 'var(--accent)' }}>this week.</span>
          </div>
          <p className="text-[13px] mt-2 leading-snug" style={{ color: 'var(--dim)' }}>
            Your next class is Wednesday at 9:00 with Mai L.
          </p>
        </div>

        {/* package card */}
        <div
          className="mx-[22px] p-[18px] rounded-[18px]"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>10-class package</div>
              <div className="font-serif text-[32px] mt-1">
                {u.pkgRemaining}
                <span className="text-[18px]" style={{ color: 'var(--dim)' }}> /{u.pkgTotal}</span>
              </div>
            </div>
            <div className="text-[11px] text-right" style={{ color: 'var(--dim)' }}>
              expires<br />
              <span className="font-serif text-[14px]" style={{ color: 'var(--fg)' }}>Aug 12</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: 'var(--surface2)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(u.pkgRemaining / u.pkgTotal) * 100}%`, background: 'var(--accent)' }}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Link href="/book/service" className="flex-1 text-center py-2 rounded-xl text-[12px]" style={{ border: '1px solid var(--line)' }}>
              Book a class
            </Link>
            <button className="flex-1 text-center py-2 rounded-xl text-[12px]" style={{ border: '1px solid var(--line)' }}>
              Buy more
            </button>
          </div>
        </div>

        {/* streak */}
        <div className="mx-[22px] mt-3 px-4 py-3 rounded-[14px] flex items-center gap-3" style={{ background: 'var(--accent-soft)' }}>
          <Icon name="flame" size={20} color="var(--accent)" />
          <div>
            <span className="font-serif text-[17px]" style={{ color: 'var(--accent-ink)' }}>{u.streak}-week streak</span>
            <span className="text-[12px] ml-2" style={{ color: 'var(--accent)' }}>Keep it up!</span>
          </div>
        </div>

        {/* upcoming */}
        <div className="px-[22px] pt-7 pb-2 flex justify-between items-baseline">
          <div className="font-serif text-[22px]">Upcoming</div>
          <Link href="/schedule" className="text-[12px]" style={{ color: 'var(--accent)' }}>View all →</Link>
        </div>

        <div className="px-[22px] flex flex-col gap-3">
          {u.upcoming.map((b, i) => {
            const parts = b.date.split(' ')
            return (
              <div
                key={i}
                className="flex gap-3.5 p-4 rounded-[18px] items-stretch"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
              >
                <div
                  className="w-16 rounded-xl flex flex-col items-center justify-center py-2.5 shrink-0"
                  style={{ background: 'var(--surface2)' }}
                >
                  <div className="text-[10px] uppercase tracking-[0.5px]" style={{ color: 'var(--dim)' }}>{parts[0].replace(',','')}</div>
                  <div className="font-serif text-[26px] leading-none mt-0.5">{parts[2]}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--dim)' }}>{parts[1]}</div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--accent)' }}>{b.service}</div>
                  <div className="font-serif text-[19px] mt-0.5">{b.time} · {b.dur}</div>
                  <div className="text-[12px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--dim)' }}>
                    <Icon name="pin" size={12} color="var(--dim)" />
                    {b.branch}{b.room !== '—' && ` · ${b.room}`} · {b.teacher}
                  </div>
                </div>
                <button className="self-center" style={{ color: 'var(--dim)' }}>
                  <Icon name="chev" size={16} color="var(--dim)" />
                </button>
              </div>
            )
          })}
        </div>

        <TabBar />
      </div>
    </div>
  )
}
