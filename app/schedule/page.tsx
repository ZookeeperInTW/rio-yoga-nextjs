'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RIO } from '@/lib/data'
import TabBar from '@/components/member/TabBar'
import Icon from '@/components/ui/Icon'

const MONTHS = ['April 2026', 'May 2026', 'June 2026']
const UPCOMING_ALL = [
  ...RIO.member.upcoming,
  { date: 'Tue, May 28', time: '07:00', service: 'Group Pilates', teacher: 'June O.', branch: 'Sukhumvit', room: 'Studio 1', dur: '50 min' },
  { date: 'Thu, May 30', time: '10:00', service: 'Private Pilates', teacher: 'Mai L.', branch: 'Thonglor', room: 'Studio 2', dur: '60 min' },
  { date: 'Sun, Jun 2', time: '11:00', service: 'Sports Massage', teacher: 'Kanya R.', branch: 'Sathorn', room: 'Studio 3', dur: '75 min' },
]

export default function SchedulePage() {
  const [monthIdx, setMonthIdx] = useState(1)

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen relative pb-28" style={{ color: 'var(--fg)' }}>
        <div className="h-14" />

        <div className="px-[22px] pt-3 pb-6">
          <div className="font-serif text-[32px] tracking-[-0.5px]">Schedule</div>

          {/* month nav */}
          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => setMonthIdx(m => Math.max(0, m - 1))}>
              <Icon name="back" size={18} color="var(--dim)" />
            </button>
            <div className="flex-1 text-center font-serif text-[17px]">{MONTHS[monthIdx]}</div>
            <button onClick={() => setMonthIdx(m => Math.min(MONTHS.length - 1, m + 1))}>
              <Icon name="chev" size={18} color="var(--dim)" />
            </button>
          </div>
        </div>

        <div className="px-[22px] flex flex-col gap-3">
          {UPCOMING_ALL.map((b, i) => {
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

        <div className="px-[22px] mt-6">
          <Link
            href="/book/service"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px]"
            style={{ border: '1px dashed var(--line)', color: 'var(--dim)' }}
          >
            <Icon name="plus" size={16} color="var(--dim)" />
            Book another session
          </Link>
        </div>

        <TabBar />
      </div>
    </div>
  )
}
