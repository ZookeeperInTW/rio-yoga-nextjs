import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'

export default async function AdminReportsPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')

  const [totalBookings, totalMembers, totalTeachers] = await Promise.all([
    prisma.booking.count({ where: { status: { not: 'cancelled' } } }),
    prisma.member.count({ where: { isAdmin: false } }),
    prisma.teacher.count(),
  ])

  const recentBookings = await prisma.booking.findMany({
    where: { status: { not: 'cancelled' } },
    include: { service: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const byKind = recentBookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.kind] = (acc[b.kind] ?? 0) + 1
    return acc
  }, {})

  const stats = [
    { label: 'Total bookings', value: totalBookings, sub: 'all time' },
    { label: 'Active members', value: totalMembers, sub: 'registered' },
    { label: 'Teachers', value: totalTeachers, sub: 'on roster' },
  ]

  const breakdown = Object.entries(byKind).map(([kind, count]) => ({
    kind,
    count,
    pct: Math.round((count / recentBookings.length) * 100),
  }))

  return (
    <div className="flex flex-col h-full">
      <div className="px-7 py-[18px] shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="font-serif text-[26px] tracking-[-0.4px]">Reports</div>
        <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>Overview · all time</div>
      </div>

      <div className="flex-1 overflow-auto p-7">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="p-6 rounded-[16px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>{s.label}</div>
              <div className="font-serif text-[48px] mt-1 leading-none">{s.value}</div>
              <div className="text-[12px] mt-1" style={{ color: 'var(--dim)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-[16px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
          <div className="font-serif text-[20px] mb-5">Sessions by type</div>
          <div className="flex flex-col gap-3">
            {breakdown.map(b => (
              <div key={b.kind} className="flex items-center gap-4">
                <div className="w-20 text-[13px] capitalize" style={{ color: 'var(--dim)' }}>{b.kind}</div>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: 'var(--accent)' }} />
                </div>
                <div className="w-12 text-right font-mono text-[12px]" style={{ color: 'var(--dim)' }}>{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
