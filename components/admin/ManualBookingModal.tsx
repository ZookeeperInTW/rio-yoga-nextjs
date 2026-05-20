'use client'

import { useState, useTransition } from 'react'
import Icon from '@/components/ui/Icon'
import { createAdminBookingAction } from '@/app/actions/admin'

interface Member { id: string; name: string; phone: string; remaining: number }
interface Teacher { id: string; name: string }
interface Studio { id: string; name: string; kind: string }
interface Service { id: string; slug: string; name: string; durationMin: number }

interface Props {
  onClose: () => void
  dateStr: string
  members: Member[]
  teachers: Teacher[]
  studios: Studio[]
  services: Service[]
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-3.5 py-3 rounded-[10px] text-[13px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
      <div className="text-[10px] uppercase tracking-[0.5px] mb-1.5" style={{ color: 'var(--dim)' }}>{label}</div>
      {children}
    </div>
  )
}

export default function ManualBookingModal({ onClose, dateStr, members, teachers, studios, services }: Props) {
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id ?? '')
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? 'private')
  const [studioId, setStudioId] = useState(studios[0]?.id ?? '')
  const [teacherId, setTeacherId] = useState(teachers[0]?.id ?? '')
  const [timeStr, setTimeStr] = useState('09:00')
  const [note, setNote] = useState('')
  const [showMemberSearch, setShowMemberSearch] = useState(false)
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  const selectedMember = members.find(m => m.id === selectedMemberId) ?? members[0]
  const selectedService = services.find(s => s.slug === serviceSlug) ?? services[0]

  const filteredMembers = memberSearch
    ? members.filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.phone.includes(memberSearch))
    : members

  const dayLabel = new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })

  const handleCreate = () => {
    if (!selectedMemberId || !studioId || !teacherId) return
    startTransition(async () => {
      const [hh, mm] = timeStr.split(':').map(Number)
      // Convert ICT to UTC: subtract 7 hours
      const utcHour = hh - 7
      const startIso = `${dateStr}T${utcHour.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:00.000Z`
      await createAdminBookingAction({
        memberId: selectedMemberId,
        serviceSlug,
        teacherId,
        studioId,
        startIso,
        notes: note || undefined,
      })
      setDone(true)
      setTimeout(onClose, 800)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ background: 'rgba(20,15,10,0.45)' }} onClick={onClose} />

      <div className="relative w-full max-w-[560px] rounded-[20px] overflow-hidden shadow-lg" style={{ background: 'var(--bg)' }}>
        <div className="px-[26px] py-[22px] pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
          <div className="text-[11px] uppercase tracking-[0.5px]" style={{ color: 'var(--dim)' }}>New booking</div>
          <div className="font-serif text-[26px] mt-1 tracking-[-0.4px]">Walk-in · {dayLabel}</div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* member */}
          <Field label="Member">
            <div className="relative">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setShowMemberSearch(s => !s)}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-serif italic text-[14px]"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  {selectedMember?.name[0] ?? '?'}
                </div>
                <div className="font-serif text-[17px]">{selectedMember?.name ?? 'Select member'}</div>
                <div className="ml-auto text-[11px]" style={{ color: 'var(--dim)' }}>
                  {selectedMember?.phone} · {selectedMember?.remaining ?? 0} classes left
                </div>
                <Icon name="chevd" size={14} color="var(--dim)" />
              </div>
              {showMemberSearch && (
                <div className="absolute top-full mt-2 left-0 right-0 rounded-xl z-10 py-1.5"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                  <div className="px-3 pb-1.5">
                    <input autoFocus value={memberSearch} onChange={e => setMemberSearch(e.target.value)}
                      placeholder="Search name or phone..."
                      className="w-full text-[13px] bg-transparent py-1"
                      style={{ borderBottom: '1px solid var(--line)', color: 'var(--fg)' }} />
                  </div>
                  {filteredMembers.map(m => (
                    <button key={m.id} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[13px]"
                      style={{ background: selectedMemberId === m.id ? 'var(--surface2)' : undefined }}
                      onClick={() => { setSelectedMemberId(m.id); setShowMemberSearch(false); setMemberSearch('') }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-serif"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
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
              <select value={serviceSlug} onChange={e => setServiceSlug(e.target.value)}
                className="font-serif text-[17px] bg-transparent cursor-pointer flex-1" style={{ color: 'var(--fg)' }}>
                {services.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
              <span className="text-[11px]" style={{ color: 'var(--dim)' }}>{selectedService?.durationMin} min</span>
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Studio">
              <select value={studioId} onChange={e => setStudioId(e.target.value)}
                className="font-serif text-[17px] bg-transparent cursor-pointer w-full" style={{ color: 'var(--fg)' }}>
                {studios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Teacher">
              <select value={teacherId} onChange={e => setTeacherId(e.target.value)}
                className="font-serif text-[17px] bg-transparent cursor-pointer w-full" style={{ color: 'var(--fg)' }}>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <div className="font-serif text-[17px]">{dayLabel}</div>
            </Field>
            <Field label="Time (ICT)">
              <input type="time" value={timeStr} onChange={e => setTimeStr(e.target.value)}
                className="font-serif text-[17px] bg-transparent w-full" style={{ color: 'var(--fg)' }} />
            </Field>
          </div>

          {done && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] text-[12px]"
              style={{ background: 'var(--ok-soft)', color: '#3D5A30' }}>
              <Icon name="check" size={16} color="#3D5A30" />
              <span><strong>Booking created</strong> · Package deducted.</span>
            </div>
          )}

          <Field label="Internal note (optional)">
            <input value={note} onChange={e => setNote(e.target.value)}
              className="w-full bg-transparent text-[13px] italic" style={{ color: 'var(--dim)' }}
              placeholder="e.g. Phone-in by member · paid with class package" />
          </Field>
        </div>

        <div className="px-6 py-4 flex justify-between items-center" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)' }}>
          <div className="text-[12px]" style={{ color: 'var(--dim)' }}>
            {selectedMember?.remaining ? `${selectedMember.remaining} class${selectedMember.remaining !== 1 ? 'es' : ''} remaining` : 'No package on file'}
          </div>
          <div className="flex gap-2.5">
            <button onClick={onClose} className="px-[18px] py-2.5 rounded-lg text-[13px]"
              style={{ border: '1px solid var(--line)' }}>Cancel</button>
            <button onClick={handleCreate} disabled={pending || done}
              className="px-[22px] py-2.5 rounded-lg text-[13px] flex items-center gap-1.5 disabled:opacity-50"
              style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
              <Icon name="check" size={14} color="var(--bg)" />
              {pending ? 'Creating…' : 'Create booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
