'use client'

import { useState } from 'react'
import Icon from '@/components/ui/Icon'

interface Studio {
  id: string; name: string; kind: string; capacity: number; hoursStart: string; hoursEnd: string
}
interface Branch {
  id: string; slug: string; name: string; address: string; studios: Studio[]
}

export default function AdminBranchesClient({ branches }: { branches: Branch[] }) {
  const [selSlug, setSelSlug] = useState(branches[0]?.slug ?? '')
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }
  const branch = branches.find(b => b.slug === selSlug) ?? branches[0]
  const totalStudios = branches.reduce((n, b) => n + b.studios.length, 0)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-7 py-[18px] shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="flex-1">
          <div className="font-serif text-[26px] tracking-[-0.4px]">Branches & Studios</div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>
            {branches.length} branches · {totalStudios} studios
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px]"
          style={{ background: 'var(--accent)', color: '#fff' }}
          onClick={() => showToast('Add branch — coming soon')}>
          <Icon name="plus" size={14} color="#fff" />
          Add branch
        </button>
      </div>

      {/* branch tabs */}
      <div className="flex gap-3.5 px-7 pt-5">
        {branches.map(b => {
          const active = selSlug === b.slug
          return (
            <button key={b.slug} onClick={() => setSelSlug(b.slug)}
              className="flex-1 p-5 rounded-[14px] text-left transition-all"
              style={{
                background: active ? 'var(--fg)' : 'var(--surface)',
                color: active ? 'var(--bg)' : 'var(--fg)',
                border: active ? 'none' : '1px solid var(--line)',
              }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{ background: active ? 'rgba(255,255,255,0.12)' : 'var(--accent-soft)', color: active ? '#fff' : 'var(--accent)' }}>
                  <Icon name="home2" size={16} color="currentColor" />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-[18px]">{b.name}</div>
                  <div className="text-[11px] mt-0.5 opacity-70">{b.studios.length} studios</div>
                </div>
              </div>
              <div className="text-[12px] mt-3 opacity-75">{b.address}</div>
            </button>
          )
        })}
      </div>

      {branch && (
        <>
          <div className="flex justify-between items-baseline px-7 pt-7 pb-1">
            <div className="font-serif text-[20px]">Studios at {branch.name}</div>
            <button className="text-[12px]" style={{ color: 'var(--accent)' }}
              onClick={() => showToast('Add studio — coming soon')}>
              + Add studio
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-3.5 flex flex-col gap-3">
            {branch.studios.map(s => (
              <div key={s.id} className="flex items-center gap-[18px] p-[18px] rounded-[14px]"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--surface2)' }}>
                  <Icon name={s.kind === 'massage' ? 'massage' : 'yoga'} size={24} color="var(--fg)" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2.5">
                    <div className="font-serif text-[20px]">{s.name}</div>
                    <div className="text-[12px] capitalize" style={{ color: 'var(--dim)' }}>{s.kind}</div>
                  </div>
                  <div className="flex gap-3.5 text-[12px] mt-1" style={{ color: 'var(--dim)' }}>
                    <span><strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{s.capacity}</strong> capacity</span>
                    <span>Hours · <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>
                      {s.hoursStart} – {s.hoursEnd}
                    </strong></span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] capitalize"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}>
                  {s.kind}
                </span>
                <button onClick={() => showToast(`Edit ${s.name} — coming soon`)}>
                  <Icon name="settings" size={18} color="var(--dim)" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

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
