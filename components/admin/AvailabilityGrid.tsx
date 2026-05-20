'use client'

import { useState, useTransition } from 'react'
import { updateAvailabilityAction } from '@/app/actions/admin'
import Icon from '@/components/ui/Icon'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
const LABEL = (h: number) => `${h.toString().padStart(2,'0')}:00`

interface Block { dayOfWeek: number; startHour: number; endHour: number }
interface Props {
  teacherId: string
  initialBlocks: Block[]
}

export default function AvailabilityGrid({ teacherId, initialBlocks }: Props) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const removeBlock = (dayOfWeek: number, startHour: number) => {
    setBlocks(prev => prev.filter(b => !(b.dayOfWeek === dayOfWeek && b.startHour === startHour)))
    setSaved(false)
  }

  const handleSave = () => {
    startTransition(async () => {
      await updateAvailabilityAction(teacherId, blocks)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const totalHours = HOURS.length

  return (
    <div className="mt-4">
      <div className="flex gap-0 mb-1.5 pl-14">
        {HOURS.map(h => (
          <div key={h} className="flex-1 text-[10px] font-mono" style={{ color: 'var(--dim)' }}>{h.toString().padStart(2,'0')}</div>
        ))}
      </div>
      {DAYS.map((d, di) => (
        <div key={d} className="flex items-center h-8 mb-1">
          <div className="w-14 text-[14px] font-serif" style={{ color: 'var(--dim)' }}>{d}</div>
          <div className="flex-1 relative h-7 rounded-lg" style={{ background: 'var(--surface2)' }}>
            {blocks.filter(b => b.dayOfWeek === di).map((b, i) => (
              <button key={i} onClick={() => removeBlock(di, b.startHour)} title="Click to remove"
                className="absolute inset-y-0.5 flex items-center px-2 rounded-md text-[11px] hover:opacity-80 transition-opacity"
                style={{
                  left: `${((b.startHour - HOURS[0]) / totalHours) * 100}%`,
                  width: `${((b.endHour - b.startHour) / totalHours) * 100}%`,
                  background: 'var(--accent-soft)',
                  borderLeft: '3px solid var(--accent)',
                  color: 'var(--accent-ink)',
                }}>
                {LABEL(b.startHour)} – {LABEL(b.endHour)}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px]" style={{ color: 'var(--dim)' }}>Click a block to remove it.</p>
        <button onClick={handleSave} disabled={pending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] disabled:opacity-50"
          style={{ background: saved ? 'var(--ok-soft)' : 'var(--accent)', color: saved ? '#3D5A30' : '#fff' }}>
          {saved ? <><Icon name="check" size={12} color="#3D5A30" /> Saved</> : pending ? 'Saving…' : 'Save availability'}
        </button>
      </div>
    </div>
  )
}
