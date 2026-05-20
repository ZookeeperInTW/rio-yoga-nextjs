'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepHeader from './StepHeader'
import Icon from '@/components/ui/Icon'

interface Service { id: string; slug: string; name: string; durationMin: number; description: string }

export default function ServiceSelector({ services }: { services: Service[] }) {
  const router = useRouter()
  const [sel, setSel] = useState(services[0]?.slug ?? '')

  return (
    <div className="pb-32">
      <StepHeader step={1} title="What kind of session?" />

      <div className="flex flex-col gap-3 px-[22px] mt-5">
        {services.map(s => {
          const isSel = sel === s.slug
          return (
            <button
              key={s.id}
              onClick={() => setSel(s.slug)}
              className="flex gap-3.5 items-center p-[18px] rounded-[18px] text-left transition-all"
              style={{
                background: isSel ? 'var(--fg)' : 'var(--surface)',
                color: isSel ? 'var(--bg)' : 'var(--fg)',
                border: isSel ? 'none' : '1px solid var(--line)',
              }}
            >
              <div
                className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                style={{ background: isSel ? 'rgba(255,255,255,0.12)' : 'var(--accent-soft)', color: isSel ? '#fff' : 'var(--accent)' }}
              >
                <Icon name={s.slug === 'massage' ? 'massage' : 'yoga'} size={26} color="currentColor" />
              </div>
              <div className="flex-1">
                <div className="font-serif text-[21px] tracking-[-0.3px]">{s.name}</div>
                <div className="text-[12px] mt-0.5 opacity-70">{s.durationMin} min · {s.description}</div>
              </div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ border: `1.5px solid ${isSel ? '#fff' : 'var(--line)'}`, background: isSel ? 'var(--accent)' : 'transparent' }}
              >
                {isSel && <Icon name="check" size={14} color="#fff" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] px-[22px] pb-9 pt-3.5 z-30"
        style={{ background: 'linear-gradient(to top, var(--bg) 50%, transparent)' }}>
        <button
          onClick={() => router.push(`/book/location?service=${sel}`)}
          className="w-full flex justify-between items-center px-[22px] py-[18px] rounded-2xl"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}
        >
          <span className="font-serif text-[17px]">Continue · Location</span>
          <Icon name="arrow" size={22} color="var(--bg)" />
        </button>
      </div>
    </div>
  )
}
