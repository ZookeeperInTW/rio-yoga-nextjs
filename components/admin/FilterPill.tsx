'use client'

import { useState, useRef, useEffect } from 'react'
import Icon from '@/components/ui/Icon'

interface FilterPillProps {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}

export default function FilterPill({ label, options, value, onChange }: FilterPillProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]"
        style={{ border: '1px solid var(--line)' }}
      >
        <span style={{ color: 'var(--dim)' }}>{label}:</span>
        <span className="font-medium">{value}</span>
        <Icon name="chevd" size={12} color="var(--dim)" />
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 z-50 min-w-[160px] rounded-xl py-1.5 shadow-modal"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-[13px] hover:bg-[var(--surface2)] transition-colors"
              style={{ color: opt === value ? 'var(--accent)' : 'var(--fg)' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
