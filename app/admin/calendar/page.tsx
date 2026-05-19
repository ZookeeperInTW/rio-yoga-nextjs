'use client'

import { useState } from 'react'
import AdminGrid from '@/components/admin/AdminGrid'
import FilterPill from '@/components/admin/FilterPill'
import ManualBookingModal from '@/components/admin/ManualBookingModal'
import Icon from '@/components/ui/Icon'

const DAYS = ['Sun, 25 May', 'Mon, 26 May', 'Tue, 27 May', 'Wed, 28 May', 'Thu, 29 May']
const BRANCHES = ['Sukhumvit', 'Thonglor', 'Sathorn']
const TEACHERS_LIST = ['Any teacher', 'Mai L.', 'Nina P.', 'Pim S.', 'Kanya R.', 'June O.']
const VIEWS = ['Day', 'Week', 'Month'] as const

export default function AdminCalendarPage() {
  const [dayIdx, setDayIdx] = useState(1)
  const [branch, setBranch] = useState('Sukhumvit')
  const [teacher, setTeacher] = useState('Any teacher')
  const [view, setView] = useState<typeof VIEWS[number]>('Day')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* topbar */}
      <div
        className="flex items-center gap-4 px-7 py-[18px] shrink-0"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        <div>
          <div className="font-serif text-[26px] tracking-[-0.4px]">Master Calendar</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
            {DAYS[dayIdx]} — Day view
          </div>
        </div>

        {/* date nav */}
        <div
          className="flex items-center gap-2 ml-6 px-2.5 py-1.5 rounded-full"
          style={{ border: '1px solid var(--line)' }}
        >
          <button onClick={() => setDayIdx(d => Math.max(0, d - 1))}>
            <Icon name="back" size={14} color="var(--dim)" />
          </button>
          <span className="text-[12px]">Today</span>
          <button onClick={() => setDayIdx(d => Math.min(DAYS.length - 1, d + 1))}>
            <Icon name="chev" size={14} color="var(--dim)" />
          </button>
        </div>

        {/* view toggle */}
        <div
          className="flex overflow-hidden rounded-lg text-[12px]"
          style={{ border: '1px solid var(--line)' }}
        >
          {VIEWS.map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3.5 py-1.5"
              style={{
                background: view === v ? 'var(--fg)' : 'transparent',
                color: view === v ? 'var(--bg)' : 'var(--dim)',
              }}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <FilterPill label="Branch" options={BRANCHES} value={branch} onChange={setBranch} />
          <FilterPill label="Teacher" options={TEACHERS_LIST} value={teacher} onChange={setTeacher} />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px]"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <Icon name="plus" size={14} color="#fff" />
            New booking
          </button>
        </div>
      </div>

      {/* grid */}
      <div className="flex-1 p-7 min-h-0 overflow-hidden">
        <AdminGrid />
      </div>

      {/* manual booking modal */}
      {showModal && (
        <ManualBookingModal
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false)
            showToast('Booking created successfully')
          }}
        />
      )}

      {/* toast */}
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
