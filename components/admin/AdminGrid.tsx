'use client'

import { useState } from 'react'
import Icon from '@/components/ui/Icon'

const GRID_HOURS = [7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
const CELL_H = 52

type BookingKind = 'private' | 'group' | 'massage' | string

function colorFor(kind: BookingKind) {
  if (kind === 'private') return { bg: 'var(--accent-soft)', ink: 'var(--accent-ink)', bar: 'var(--accent)' }
  if (kind === 'group')   return { bg: 'var(--ok-soft)', ink: '#3D5A30', bar: 'var(--ok)' }
  if (kind === 'massage') return { bg: '#E4DDEE', ink: '#3F2E5C', bar: '#7C5FBA' }
  return { bg: 'var(--surface2)', ink: 'var(--dim)', bar: 'var(--line)' }
}

interface GridBooking {
  id: string
  clientName: string
  teacherName: string
  serviceName: string
  studioId: string
  startTime: string
  endTime: string
  kind: string
}

interface Studio {
  id: string
  name: string
  kind: string
}

interface Props {
  studios: Studio[]
  bookings: GridBooking[]
}

function ictHour(iso: string) {
  return (new Date(iso).getUTCHours() + 7) % 24
}

function durationHours(startIso: string, endIso: string) {
  return Math.max(1, Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 3_600_000))
}

export default function AdminGrid({ studios, bookings }: Props) {
  const [active, setActive] = useState<string | null>(null)

  const cols = studios.length > 0 ? studios : [{ id: '', name: 'Studio', kind: 'yoga' }]

  return (
    <div
      className="rounded-[14px] overflow-auto h-full"
      style={{
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        display: 'grid',
        gridTemplateColumns: `64px repeat(${cols.length}, 1fr)`,
      }}
    >
      {/* header */}
      <div style={{ borderBottom: '1px solid var(--line)' }} />
      {cols.map(s => (
        <div key={s.id} className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--line)', borderLeft: '1px solid var(--line)' }}>
          <div className="font-serif text-[17px]">{s.name}</div>
          <div className="text-[11px] uppercase tracking-[0.5px] mt-0.5" style={{ color: 'var(--dim)' }}>{s.kind}</div>
        </div>
      ))}

      {/* rows */}
      {GRID_HOURS.map((hour, rowIdx) => (
        <div key={hour} className="contents">
          <div
            className="flex items-start justify-end pr-2.5 pt-1 font-mono text-[11px]"
            style={{
              borderTop: rowIdx > 0 ? '1px solid var(--line)' : undefined,
              color: 'var(--dim)',
              height: CELL_H,
            }}
          >
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
          {cols.map((studio, colIdx) => {
            const booking = bookings.find(b => b.studioId === studio.id && ictHour(b.startTime) === hour)
            const key = `${colIdx}-${rowIdx}`
            const isActive = active === key
            return (
              <div
                key={studio.id + hour}
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
                  const span = durationHours(booking.startTime, booking.endTime)
                  const startMin = new Date(booking.startTime).getUTCMinutes()
                  const topOffset = (startMin / 60) * CELL_H
                  return (
                    <>
                      <button
                        onClick={() => setActive(isActive ? null : key)}
                        className="absolute left-1 right-1 rounded-lg text-left text-[11px] flex flex-col justify-between"
                        style={{
                          top: 4 + topOffset,
                          height: CELL_H * span - 8,
                          background: c.bg,
                          color: c.ink,
                          borderLeft: `3px solid ${c.bar}`,
                          padding: '6px 8px',
                          zIndex: 10,
                        }}
                      >
                        <div>
                          <div className="font-medium truncate">{booking.clientName}</div>
                          <div className="opacity-70 mt-0.5 truncate">{booking.serviceName}</div>
                        </div>
                        <div className="opacity-60 text-[10px]">{booking.teacherName}</div>
                      </button>
                      {isActive && (
                        <div
                          className="absolute z-50 w-52 rounded-xl p-3 shadow-lg text-[12px]"
                          style={{ background: 'var(--surface)', border: '1px solid var(--line)', top: 8, left: 8 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium" style={{ color: c.bar }}>{booking.serviceName}</span>
                            <button onClick={() => setActive(null)}><Icon name="x" size={14} color="var(--dim)" /></button>
                          </div>
                          <div style={{ color: 'var(--dim)' }}>
                            <div>Client: <span style={{ color: 'var(--fg)' }}>{booking.clientName}</span></div>
                            <div>Teacher: <span style={{ color: 'var(--fg)' }}>{booking.teacherName}</span></div>
                            <div>Time: <span style={{ color: 'var(--fg)' }}>
                              {`${ictHour(booking.startTime).toString().padStart(2,'0')}:00`}
                              {' – '}
                              {`${ictHour(booking.endTime).toString().padStart(2,'0')}:00`}
                            </span></div>
                          </div>
                        </div>
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
