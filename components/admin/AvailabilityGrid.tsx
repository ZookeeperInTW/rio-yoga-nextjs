'use client'

import { useState } from 'react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']

const DEFAULT_BLOCKS: [number, number, number][] = [
  [0, 2, 10], [1, 2, 10], [2, 2, 10], [3, 9, 13], [4, 9, 13], [5, 2, 6],
]

export default function AvailabilityGrid() {
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS)

  const removeBlock = (di: number, start: number) => {
    setBlocks(prev => prev.filter(b => !(b[0] === di && b[1] === start)))
  }

  return (
    <div className="mt-4">
      <div className="flex gap-0 mb-1.5 pl-14">
        {HOURS.map(h => (
          <div key={h} className="flex-1 text-[10px] font-mono" style={{ color: 'var(--dim)' }}>{h}</div>
        ))}
      </div>
      {DAYS.map((d, di) => (
        <div key={d} className="flex items-center h-8 mb-1">
          <div className="w-14 text-[14px] font-serif" style={{ color: 'var(--dim)' }}>{d}</div>
          <div className="flex-1 relative h-7 rounded-lg" style={{ background: 'var(--surface2)' }}>
            {blocks.filter(b => b[0] === di).map((b, i) => (
              <button
                key={i}
                onClick={() => removeBlock(di, b[1])}
                title="Click to remove"
                className="absolute inset-y-0.5 flex items-center px-2 rounded-md text-[11px] hover:opacity-80 transition-opacity"
                style={{
                  left: `${(b[1] / HOURS.length) * 100}%`,
                  width: `${((b[2] - b[1]) / HOURS.length) * 100}%`,
                  background: 'var(--accent-soft)',
                  borderLeft: '3px solid var(--accent)',
                  color: 'var(--accent-ink)',
                }}
              >
                {HOURS[b[1]]}:00 – {HOURS[b[2]]}:00
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="mt-3 text-[11px]" style={{ color: 'var(--dim)' }}>Click a block to remove it. Use "+ Add exception" for one-off changes.</p>
    </div>
  )
}
