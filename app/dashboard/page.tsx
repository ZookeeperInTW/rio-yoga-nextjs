import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import Link from 'next/link'
import prisma from '@/lib/db'
import { sessionOptions, type SessionData } from '@/lib/session'
import TabBar from '@/components/member/TabBar'
import Icon from '@/components/ui/Icon'
import NotificationPanel from '@/components/member/NotificationPanel'

export default async function DashboardPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    include: {
      packages: {
        where: { remaining: { gt: 0 }, expiresAt: { gt: new Date() } },
        orderBy: { expiresAt: 'asc' },
        take: 1,
      },
      bookings: {
        where: { startTime: { gte: new Date() }, status: 'confirmed' },
        include: { service: true, teacher: true, branch: true, studio: true },
        orderBy: { startTime: 'asc' },
        take: 5,
      },
    },
  })

  if (!member) redirect('/login')

  const pkg = member.packages[0]
  const upcomingBookings = member.bookings.map(b => ({
    id: b.id,
    service: b.service.name,
    teacher: b.teacher?.name ?? '—',
    branch: b.branch?.name ?? (b.isInHome ? 'In-home' : '—'),
    studio: b.studio?.name ?? '—',
    dur: `${b.service.durationMin} min`,
    startTime: b.startTime.toISOString(),
  }))

  const hourGreeting = new Date().getHours()
  const greeting = hourGreeting < 12 ? 'Good morning' : hourGreeting < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen relative pb-28" style={{ color: 'var(--fg)' }}>
        <div className="h-14" />

        {/* top bar */}
        <div className="relative px-[22px] pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-serif text-[22px] italic"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}
            >
              {member.initial}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>{greeting}</div>
              <div className="font-serif text-[19px] mt-0.5">{member.name.split(' ')[0]}</div>
            </div>
          </div>
          <NotificationPanel upcomingCount={upcomingBookings.length} />
        </div>

        {/* hero */}
        <div className="px-[22px] py-[18px] pb-6">
          <div className="font-serif text-[38px] leading-[1.05] tracking-[-0.5px]">
            {upcomingBookings.length > 0 ? (
              <>{upcomingBookings.length} session{upcomingBookings.length !== 1 ? 's' : ''}<br />
              <span className="italic" style={{ color: 'var(--accent)' }}>coming up.</span></>
            ) : (
              <>Nothing<br /><span className="italic" style={{ color: 'var(--accent)' }}>booked yet.</span></>
            )}
          </div>
          {upcomingBookings.length > 0 && (
            <p className="text-[13px] mt-2 leading-snug" style={{ color: 'var(--dim)' }}>
              Your next class is with {upcomingBookings[0].teacher}.
            </p>
          )}
        </div>

        {/* package card */}
        {pkg ? (
          <div className="mx-[22px] p-[18px] rounded-[18px]" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--dim)' }}>{pkg.total}-class package</div>
                <div className="font-serif text-[32px] mt-1">
                  {pkg.remaining}<span className="text-[18px]" style={{ color: 'var(--dim)' }}> /{pkg.total}</span>
                </div>
              </div>
              <div className="text-[11px] text-right" style={{ color: 'var(--dim)' }}>
                expires<br />
                <span className="font-serif text-[14px]" style={{ color: 'var(--fg)' }}>
                  {new Date(pkg.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: 'var(--surface2)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${(pkg.remaining / pkg.total) * 100}%`, background: 'var(--accent)' }}
              />
            </div>
            <div className="flex gap-2 mt-3">
              <Link href="/book/service" className="flex-1 text-center py-2 rounded-xl text-[12px]" style={{ border: '1px solid var(--line)' }}>
                Book a class
              </Link>
              <button className="flex-1 text-center py-2 rounded-xl text-[12px]" style={{ border: '1px solid var(--line)' }}>
                Buy more
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-[22px] p-[18px] rounded-[18px] text-center" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div className="font-serif text-[17px]">No active package</div>
            <Link href="/book/service" className="mt-3 block py-3 rounded-xl text-[13px]" style={{ background: 'var(--accent)', color: '#fff' }}>
              Buy a package
            </Link>
          </div>
        )}

        {/* upcoming */}
        <div className="px-[22px] pt-7 pb-2 flex justify-between items-baseline">
          <div className="font-serif text-[22px]">Upcoming</div>
          <Link href="/schedule" className="text-[12px]" style={{ color: 'var(--accent)' }}>View all →</Link>
        </div>

        <div className="px-[22px] flex flex-col gap-3">
          {upcomingBookings.length === 0 ? (
            <div className="py-8 text-center text-[13px]" style={{ color: 'var(--dim)' }}>
              No upcoming sessions.{' '}
              <Link href="/book/service" style={{ color: 'var(--accent)' }}>Book one →</Link>
            </div>
          ) : (
            upcomingBookings.map((b) => {
              const dt = new Date(b.startTime)
              const dow = dt.toLocaleDateString('en-US', { weekday: 'short' })
              const day = dt.getDate()
              const mon = dt.toLocaleDateString('en-US', { month: 'short' })
              const time = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
              return (
                <div key={b.id} className="flex gap-3.5 p-4 rounded-[18px] items-stretch" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div className="w-16 rounded-xl flex flex-col items-center justify-center py-2.5 shrink-0" style={{ background: 'var(--surface2)' }}>
                    <div className="text-[10px] uppercase tracking-[0.5px]" style={{ color: 'var(--dim)' }}>{dow}</div>
                    <div className="font-serif text-[26px] leading-none mt-0.5">{day}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--dim)' }}>{mon}</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[11px] uppercase tracking-[0.4px]" style={{ color: 'var(--accent)' }}>{b.service}</div>
                    <div className="font-serif text-[19px] mt-0.5">{time} · {b.dur}</div>
                    <div className="text-[12px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--dim)' }}>
                      <Icon name="pin" size={12} color="var(--dim)" />
                      {b.branch}{b.studio !== '—' && ` · ${b.studio}`} · {b.teacher}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <TabBar />
      </div>
    </div>
  )
}
