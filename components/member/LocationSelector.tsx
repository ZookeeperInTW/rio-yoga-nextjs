'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepHeader from './StepHeader'
import Icon from '@/components/ui/Icon'

interface Branch { id: string; slug: string; name: string; address: string }

export default function LocationSelector({ serviceSlug, branches }: { serviceSlug: string; branches: Branch[] }) {
  const router = useRouter()
  const [mode, setMode] = useState<'branch' | 'home'>('branch')
  const [branchSlug, setBranchSlug] = useState(branches[0]?.slug ?? '')
  const [address, setAddress] = useState('114/2 Soi Sukhumvit 31')
  const [unit, setUnit] = useState('12A')
  const [postcode, setPostcode] = useState('10110')
  const [notes, setNotes] = useState('')

  const handleContinue = () => {
    const params = new URLSearchParams({ service: serviceSlug })
    if (mode === 'branch') params.set('branch', branchSlug)
    else params.set('home', '1')
    router.push(`/book/teacher?${params}`)
  }

  return (
    <div className="pb-32">
      <StepHeader step={2} title="Where will it be?" />

      <div className="px-[22px] mt-[18px]">
        <div className="flex p-1 rounded-xl" style={{ background: 'var(--surface2)' }}>
          {[{ id: 'branch' as const, label: 'At a branch' }, { id: 'home' as const, label: 'In-home' }].map(o => (
            <button key={o.id} onClick={() => setMode(o.id)}
              className="flex-1 py-2.5 rounded-[9px] font-serif text-[15px] transition-all"
              style={{ background: mode === o.id ? 'var(--bg)' : 'transparent', color: mode === o.id ? 'var(--fg)' : 'var(--dim)' }}
            >{o.label}</button>
          ))}
        </div>
      </div>

      {mode === 'branch' ? (
        <div className="flex flex-col gap-3 px-[22px] mt-5">
          {branches.map(b => {
            const isSel = branchSlug === b.slug
            return (
              <button key={b.id} onClick={() => setBranchSlug(b.slug)}
                className="rounded-2xl overflow-hidden text-left transition-all"
                style={{ border: isSel ? '1.5px solid var(--accent)' : '1px solid var(--line)', background: 'var(--surface)' }}
              >
                <div className="h-20 relative flex items-center justify-center"
                  style={{ background: 'repeating-linear-gradient(135deg, var(--surface) 0 11px, var(--surface2) 11px 12px)' }}>
                  <span className="font-mono text-[10px] tracking-[0.4px] px-1.5 py-0.5 rounded"
                    style={{ color: 'var(--dim)', background: 'var(--surface)' }}>MAP · {b.name.toUpperCase()}</span>
                </div>
                <div className="px-3.5 py-3 flex justify-between items-center">
                  <div>
                    <div className="font-serif text-[19px]">{b.name}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>{b.address}</div>
                  </div>
                  {isSel && <Icon name="check" size={22} color="var(--accent)" />}
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="px-[22px] mt-5">
          <div className="p-[18px] rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div className="font-serif text-[17px]">Service address</div>
            <p className="text-[12px] mt-1" style={{ color: 'var(--dim)' }}>We&apos;ll add a 30-minute travel buffer before and after.</p>
            <div className="mt-3.5 p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
              <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>Street address</div>
              <input value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-transparent font-serif text-[18px] mt-1" style={{ color: 'var(--fg)' }} />
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              {[{ label: 'Floor / unit', val: unit, set: setUnit }, { label: 'Postcode', val: postcode, set: setPostcode }].map(f => (
                <div key={f.label} className="p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
                  <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>{f.label}</div>
                  <input value={f.val} onChange={e => f.set(e.target.value)} className="w-full bg-transparent font-serif text-[16px] mt-1" style={{ color: 'var(--fg)' }} />
                </div>
              ))}
            </div>
            <div className="mt-2.5 p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
              <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>Notes for the teacher</div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-transparent text-[13px] mt-1 resize-none" style={{ color: 'var(--dim)', fontStyle: 'italic' }} rows={2} placeholder="e.g. Building has a service elevator…" />
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] px-[22px] pb-9 pt-3.5 z-30"
        style={{ background: 'linear-gradient(to top, var(--bg) 50%, transparent)' }}>
        <button onClick={handleContinue}
          className="w-full flex justify-between items-center px-[22px] py-[18px] rounded-2xl"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
          <span className="font-serif text-[17px]">Continue · Teacher</span>
          <Icon name="arrow" size={22} color="var(--bg)" />
        </button>
      </div>
    </div>
  )
}
