import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import ScheduleClient from '@/components/member/ScheduleClient'

export default async function SchedulePage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const bookings = await prisma.booking.findMany({
    where: {
      memberId: session.memberId,
      startTime: { gte: new Date() },
      status: { not: 'cancelled' },
    },
    include: { service: true, teacher: true, branch: true, studio: true },
    orderBy: { startTime: 'asc' },
    take: 30,
  })

  return (
    <ScheduleClient
      bookings={bookings.map(b => ({
        id: b.id,
        serviceName: b.service.name,
        teacherName: b.teacher?.name ?? 'Any available',
        branchName: b.branch?.name ?? (b.isInHome ? 'In-home' : '—'),
        studioName: b.studio?.name ?? '—',
        startTime: b.startTime.toISOString(),
        durationMin: b.service.durationMin,
        status: b.status,
      }))}
    />
  )
}
