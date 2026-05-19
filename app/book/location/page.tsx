'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RIO } from '@/lib/data'
import { useBooking } from '@/context/booking-context'
import StepHeader from '@/components/member/StepHeader'
import StepCTA from '@/components/member/StepCTA'
import Icon from '@/components/ui/Icon'

export default function BookLocationPage() {
  const router = useRouter()
  const { booking, setBooking } = useBooking()
  const mode = booking.locationType
  const setMode = (v: 'branch' | 'home') => setBooking({ locationType: v })

  return (
    <div className="pb-32">
      <StepHeader step={2} title="Where will it be?" />

      {/* mode tabs */}
      <div className="px-[22px] mt-[18px]">
        <div className="flex p-1 rounded-xl" style={{ background: 'var(--surface2)' }}>
          {[
            { id: 'branch' as const, label: 'At a branch' },
            { id: 'home' as const, label: 'In-home' },
          ].map(o => (
            <button
              key={o.id}
              onClick={() => setMode(o.id)}
              className="flex-1 py-2.5 rounded-[9px] font-serif text-[15px] transition-all"
              style={{
                background: mode === o.id ? 'var(--bg)' : 'transparent',
                color: mode === o.id ? 'var(--fg)' : 'var(--dim)',
                boxShadow: mode === o.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'branch' ? (
        <div className="flex flex-col gap-3 px-[22px] mt-5">
          {RIO.branches.map(b => {
            const isSel = booking.branchId === b.id
            return (
              <button
                key={b.id}
                onClick={() => setBooking({ branchId: b.id })}
                className="rounded-2xl overflow-hidden text-left transition-all"
                style={{
                  border: isSel ? `1.5px solid var(--accent)` : '1px solid var(--line)',
                  background: 'var(--surface)',
                }}
              >
                {/* stripe map placeholder */}
                <div
                  className="h-20 relative flex items-center justify-center"
                  style={{
                    background: `repeating-linear-gradient(135deg, var(--surface) 0 11px, var(--surface2) 11px 12px)`,
                  }}
                >
                  <span className="font-mono text-[10px] tracking-[0.4px] px-1.5 py-0.5 rounded" style={{ color: 'var(--dim)', background: 'var(--surface)' }}>
                    MAP · {b.name.toUpperCase()}
                  </span>
                </div>
                <div className="px-3.5 py-3 flex justify-between items-center">
                  <div>
                    <div className="font-serif text-[19px]">{b.name}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>{b.addr}</div>
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
            <p className="text-[12px] mt-1" style={{ color: 'var(--dim)' }}>
              We&apos;ll add a 30-minute travel buffer before and after your session.
            </p>
            <div className="mt-3.5 p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
              <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>Street address</div>
              <input
                defaultValue="114/2 Soi Sukhumvit 31"
                className="w-full bg-transparent font-serif text-[18px] mt-1"
                style={{ color: 'var(--fg)' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
                <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>Floor / unit</div>
                <input defaultValue="12A" className="w-full bg-transparent font-serif text-[16px] mt-1" style={{ color: 'var(--fg)' }} />
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
                <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>Postcode</div>
                <input defaultValue="10110" className="w-full bg-transparent font-serif text-[16px] mt-1" style={{ color: 'var(--fg)' }} />
              </div>
            </div>
            <div className="mt-2.5 p-3 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--line)' }}>
              <div className="text-[10px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>Notes for the teacher</div>
              <textarea
                defaultValue="Building has a service elevator on the back…"
                className="w-full bg-transparent text-[13px] mt-1 resize-none"
                style={{ color: 'var(--dim)', fontStyle: 'italic' }}
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      <StepCTA label="Continue · Teacher" onClick={() => router.push('/book/teacher')} />
    </div>
  )
}
