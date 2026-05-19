'use client'

import { useState } from 'react'
import { RIO, MEMBERS_SEARCH } from '@/lib/data'
import Icon from '@/components/ui/Icon'

interface Props {
  onClose: () => void
  onConfirm: () => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-3.5 py-3 rounded-[10px] text-[13px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
      <div className="text-[10px] uppercase tracking-[0.5px] mb-1.5" style={{ color: 'var(--dim)' }}>{label}</div>
      {children}
    </div>
  )
}

export default function ManualBookingModal({ onClose, onConfirm }: Props) {
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState(MEMBERS_SEARCH[1])
  const [serviceId, setServiceId] = useState('private')
  const [studioIdx, setStudioIdx] = useState(1)
  const [teacherIdx, setTeacherIdx] = useState(0)
  const [note, setNote] = useState('Phone-in by member · paid with class package')
  const [showMemberSearch, setShowMemberSearch] = useState(false)

  const service = RIO.services.find(s => s.id === serviceId)!

  const filteredMembers = memberSearch
    ? MEMBERS_SEARCH.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.phone.includes(memberSearch))
    : MEMBERS_SEARCH

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(20,15,10,0.45)' }} onClick={onClose} />

      <div
        className="relative w-full max-w-[560px] rounded-[20px] overflow-hidden shadow-modal"
        style={{ background: 'var(--bg)' }}
      >
        {/* header */}
        <div className="px-[26px] py-[22px] pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="text-[11px] uppercase tracking-[0.5px]" style={{ color: 'var(--dim)' }}>New booking</div>
          <div className="font-serif text-[26px] mt-1 tracking-[-0.4px]">Walk-in for Monday · 14:00</div>
        </div>

        {/* body */}
        <div className="p-6 flex flex-col gap-4">
          {/* member search */}
          <Field label="Member">
            <div className="relative">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => setShowMemberSearch(s => !s)}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-serif italic text-[14px]"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  {selectedMember.name[0]}
                </div>
                <div className="font-serif text-[17px]">{selectedMember.name}</div>
                <div className="ml-auto text-[11px]" style={{ color: 'var(--dim)' }}>
                  {selectedMember.phone} · {selectedMember.remaining} classes left
                </div>
                <Icon name="chevd" size={14} color="var(--dim)" />
              </div>
              {showMemberSearch && (
                <div
                  className="absolute top-full mt-2 left-0 right-0 rounded-xl z-10 py-1.5"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                >
                  <div className="px-3 pb-1.5">
                    <input
                      autoFocus
                      value={memberSearch}
                      onChange={e => setMemberSearch(e.target.value)}
                      placeholder="Search name or phone..."
                      className="w-full text-[13px] bg-transparent py-1"
                      style={{ borderBottom: '1px solid var(--line)', color: 'var(--fg)' }}
                    />
                  </div>
                  {filteredMembers.map(m => (
                    <button
                      key={m.id}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-[13px] hover:bg-[var(--surface2)]"
                      onClick={() => { setSelectedMember(m); setShowMemberSearch(false); setMemberSearch('') }}
                    >
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-serif" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        {m.name[0]}
                      </div>
                      <span>{m.name}</span>
                      <span className="ml-auto" style={{ color: 'var(--dim)' }}>{m.remaining} left</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          {/* service */}
          <Field label="Service">
            <div className="flex items-center gap-2">
              <select
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="font-serif text-[17px] bg-transparent cursor-pointer"
                style={{ color: 'var(--fg)' }}
              >
                {RIO.services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <span className="text-[11px]" style={{ color: 'var(--dim)' }}>{service.dur} min</span>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Studio">
              <select
                value={studioIdx}
                onChange={e => setStudioIdx(Number(e.target.value))}
                className="font-serif text-[17px] bg-transparent cursor-pointer"
                style={{ color: 'var(--fg)' }}
              >
                <option value={0}>Studio 1</option>
                <option value={1}>Studio 2</option>
                <option value={2}>Studio 3</option>
              </select>
            </Field>
            <Field label="Teacher">
              <select
                value={teacherIdx}
                onChange={e => setTeacherIdx(Number(e.target.value))}
                className="font-serif text-[17px] bg-transparent cursor-pointer"
                style={{ color: 'var(--fg)' }}
              >
                {RIO.teachers.map((t, i) => (
                  <option key={t.id} value={i}>{t.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <div className="font-serif text-[17px]">Mon · May 26</div>
            </Field>
            <Field label="Time">
              <div className="font-serif text-[17px]">14:00 – 15:00</div>
            </Field>
          </div>

          {/* conflict banner */}
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-[12px]"
            style={{ background: 'var(--ok-soft)', color: '#3D5A30' }}
          >
            <Icon name="check" size={16} color="#3D5A30" />
            <span><strong>No conflicts</strong> · Teacher, studio and member are all free.</span>
          </div>

          {/* note */}
          <Field label="Internal note (optional)">
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-transparent text-[13px] italic"
              style={{ color: 'var(--dim)' }}
            />
          </Field>
        </div>

        {/* footer */}
        <div
          className="px-6 py-4 flex justify-between items-center"
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)' }}
        >
          <div className="text-[12px]" style={{ color: 'var(--dim)' }}>
            Will deduct 1 class from package
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-[18px] py-2.5 rounded-lg text-[13px]"
              style={{ border: '1px solid var(--line)' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-[22px] py-2.5 rounded-lg text-[13px] flex items-center gap-1.5"
              style={{ background: 'var(--fg)', color: 'var(--bg)' }}
            >
              <Icon name="check" size={14} color="var(--bg)" />
              Create booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
