'use client'

import { useState } from 'react'
import { ADMIN_TIMES, ADMIN_COLS, ADMIN_BOOKINGS, AdminBooking, BookingKind } from '@/lib/data'
import Icon from '@/components/ui/Icon'

const CELL_H = 52

function colorFor(kind: BookingKind) {
  if (kind === 'private') return { bg: 'var(--accent-soft)', ink: 'var(--accent-ink)', bar: 'var(--accent)' }
  if (kind === 'group')   return { bg: 'var(--ok-soft)', ink: '#3D5A30', bar: 'var(--ok)' }
  if (kind === 'massage') return { bg: '#E4DDEE', ink: '#3F2E5C', bar: '#7C5FBA' }
  return { bg: 'var(--surface2)', ink: 'var(--dim)', bar: 'var(--line)' }
}

interface BookingTooltipProps {
  booking: AdminBooking
  onClose: () => void
}

function BookingTooltip({ booking, onClose }: BookingTooltipProps) {
  const c = colorFor(booking.kind)
  return (
    <div
      className="absolute z-50 w-56 rounded-xl p-3 shadow-modal text-[12px]"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)', top: 8, left: 8 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium" style={{ color: c.bar }}>{booking.label}</span>
        <button onClick={onClose}><Icon name="x" size={14} color="var(--dim)" /></button>
      </div>
      <div style={{ color: 'var(--dim)' }}>
        <div>Client: <span style={{ color: 'var(--fg)' }}>{booking.client}</span></div>
        <div>Teacher: <span style={{ color: 'var(--fg)' }}>{booking.teacher}</span></div>
        <div>Time: <span style={{ color: 'var(--fg)' }}>{ADMIN_TIMES[booking.startIdx]} – {ADMIN_TIMES[Math.min(booking.startIdx + booking.span, ADMIN_TIMES.length - 1)]}</span></div>
      </div>
    </div>
  )
}

export default function AdminGrid() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div
      className="rounded-[14px] overflow-auto h-full"
      style={{
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        display: 'grid',
        gridTemplateColumns: '64px 1fr 1fr 1fr',
      }}
    >
      {/* header row */}
      <div style={{ borderBottom: '1px solid var(--line)' }} />
      {ADMIN_COLS.map((c, i) => (
        <div
          key={i}
          className="px-4 py-3.5"
          style={{ borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line)' }}
        >
          <div className="font-serif text-[17px]">{c.studio}</div>
          <div className="text-[11px] uppercase tracking-[0.5px] mt-0.5" style={{ color: 'var(--dim)' }}>{c.subtitle}</div>
        </div>
      ))}

      {/* time rows */}
      {ADMIN_TIMES.map((time, rowIdx) => (
        <div key={time} className="contents">
          <div
            className="flex items-start justify-end pr-2.5 pt-1 font-mono text-[11px]"
            style={{
              borderTop: rowIdx > 0 ? '1px solid var(--line)' : undefined,
              color: 'var(--dim)',
              height: CELL_H,
            }}
          >
            {time}
          </div>
          {ADMIN_COLS.map((_, colIdx) => {
            const booking = ADMIN_BOOKINGS.find(b => b.col === colIdx && b.startIdx === rowIdx)
            const key = `${colIdx}-${rowIdx}`
            return (
              <div
                key={colIdx}
                className="relative"
                style={{
                  borderTop: rowIdx > 0 ? '1px solid var(--line)' : undefined,
                  borderLeft: '1px solid var(--line)',
                  height: CELL_H,
                  padding: 4,
                }}
              >
                {booking && (() => {
                  const c = colorFor(booking.kind)
                  const isActive = active === key
                  return (
                    <>
                      <button
                        onClick={() => setActive(isActive ? null : key)}
                        className="absolute inset-1 rounded-lg text-left text-[11px] flex flex-col justify-between"
                        style={{
                          height: CELL_H * booking.span - 8,
                          background: c.bg,
                          color: c.ink,
                          borderLeft: `3px solid ${c.bar}`,
                          padding: '6px 8px',
                        }}
                      >
                        <div>
                          <div className="font-medium truncate">{booking.client}</div>
                          <div className="opacity-70 mt-0.5 truncate">{booking.label}</div>
                        </div>
                        <div className="opacity-60 text-[10px]">{booking.teacher}</div>
                      </button>
                      {isActive && (
                        <BookingTooltip booking={booking} onClose={() => setActive(null)} />
                      )}
                    </>
                  )
                })()}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
