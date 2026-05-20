import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import AdminBookingsClient from '@/components/admin/BookingsClient'

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { date?: string }
}) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')

  const today = new Date().toISOString().slice(0, 10)
  const dateStr = searchParams.date ?? today

  const start = new Date(dateStr + 'T00:00:00.000Z')
  const end = new Date(dateStr + 'T23:59:59.999Z')

  const bookings = await prisma.booking.findMany({
    where: { startTime: { gte: start, lte: end } },
    include: { member: true, service: true, teacher: true, studio: true, branch: true },
    orderBy: { startTime: 'asc' },
  })

  return (
    <AdminBookingsClient
      dateStr={dateStr}
      bookings={bookings.map(b => ({
        id: b.id,
        bookingRef: b.bookingRef,
        clientName: b.member?.name ?? '—',
        serviceName: b.service.name,
        kind: b.kind,
        teacherName: b.teacher?.name ?? '—',
        studioName: b.studio?.name ?? (b.isInHome ? 'In-home' : '—'),
        branchName: b.branch?.name ?? '—',
        startTime: b.startTime.toISOString(),
        status: b.status,
      }))}
    />
  )
}
