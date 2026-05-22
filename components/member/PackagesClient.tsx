'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { buyPackageAction } from '@/app/actions/booking'
import TabBar from './TabBar'
import Icon from '@/components/ui/Icon'

const TIERS = [
  { id: '5'  as const, classes: 5,  price: '฿2,500', per: '฿500/class', popular: false },
  { id: '10' as const, classes: 10, price: '฿4,500', per: '฿450/class', popular: true  },
  { id: '20' as const, classes: 20, price: '฿8,000', per: '฿400/class', popular: false },
]

interface PkgHistory { id: string; total: number; remaining: number; expiresAt: string }

export default function PackagesClient({ history }: { history: PkgHistory[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const buy = (tier: '5' | '10' | '20') => {
    startTransition(() => buyPackageAction(tier))
  }

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen relative pb-28" style={{ color: 'var(--fg)' }}>
        <div className="h-14" />

        <div className="px-[22px] pt-3 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <Icon name="back" size={20} color="var(--fg)" />
          </button>
          <div className="font-serif text-[28px] tracking-[-0.4px]">Packages</div>
        </div>

        <p className="px-[22px] mt-2 text-[13px]" style={{ color: 'var(--dim)' }}>
          Valid for 3 months from purchase. Classes roll over if not used.
        </p>

        <div className="px-[22px] mt-6 flex flex-col gap-3">
          {TIERS.map(t => (
            <div key={t.id} className="p-5 rounded-[18px] relative"
              style={{
                background: t.popular ? 'var(--fg)' : 'var(--surface)',
                color: t.popular ? 'var(--bg)' : 'var(--fg)',
                border: t.popular ? 'none' : '1px solid var(--line)',
              }}>
              {t.popular && (
                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.5px]"
                  style={{ background: 'var(--accent)', color: '#fff' }}>
                  Best value
                </div>
              )}
              <div className="font-serif text-[36px]">{t.classes}<span className="text-[18px] ml-1 opacity-60">classes</span></div>
              <div className="font-serif text-[24px] mt-1">{t.price}</div>
              <div className="text-[12px] mt-0.5 opacity-60">{t.per} · expires in 3 months</div>
              <button
                onClick={() => buy(t.id)}
                disabled={pending}
                className="w-full mt-4 py-3 rounded-[14px] text-[14px] font-medium disabled:opacity-50 transition-opacity"
                style={{
                  background: t.popular ? 'rgba(255,255,255,0.15)' : 'var(--fg)',
                  color: t.popular ? '#fff' : 'var(--bg)',
                  border: t.popular ? '1px solid rgba(255,255,255,0.2)' : 'none',
                }}>
                {pending ? 'Processing…' : `Buy ${t.classes}-class pack`}
              </button>
            </div>
          ))}
        </div>

        {history.length > 0 && (
          <div className="px-[22px] mt-8">
            <div className="text-[11px] uppercase tracking-[0.4px] mb-3" style={{ color: 'var(--dim)' }}>Package history</div>
            <div className="rounded-[18px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              {history.map((p, i) => {
                const exp = new Date(p.expiresAt)
                const expired = exp < new Date()
                return (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3.5 text-[13px]"
                    style={{ borderTop: i > 0 ? '1px solid var(--line)' : undefined }}>
                    <div>
                      <div className="font-serif text-[16px]">{p.total}-class pack</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--dim)' }}>
                        {expired ? 'Expired' : 'Expires'} {exp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px]"
                      style={{ background: expired ? 'var(--surface2)' : 'var(--ok-soft)', color: expired ? 'var(--dim)' : '#3D5A30' }}>
                      {p.remaining}/{p.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <TabBar />
      </div>
    </div>
  )
}
