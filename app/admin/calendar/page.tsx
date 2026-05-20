import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import AdminCalendarClient from '@/components/admin/CalendarClient'

function startOfDay(iso: string) {
  const d = new Date(iso + 'T00:00:00.000Z')
  return d
}
function endOfDay(iso: string) {
  return new Date(iso + 'T23:59:59.999Z')
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: { date?: string; branch?: string }
}) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')

  const today = new Date().toISOString().slice(0, 10)
  const dateStr = searchParams.date ?? today

  const branches = await prisma.branch.findMany({ orderBy: { name: 'asc' } })
  const branchSlug = searchParams.branch ?? branches[0]?.slug ?? 'sukhumvit'
  const branch = await prisma.branch.findUnique({
    where: { slug: branchSlug },
    include: { studios: { orderBy: { name: 'asc' } } },
  })
  if (!branch) redirect('/admin/calendar')

  const bookings = await prisma.booking.findMany({
    where: {
      branchId: branch.id,
      startTime: { gte: startOfDay(dateStr), lte: endOfDay(dateStr) },
      status: { not: 'cancelled' },
    },
    include: {
      member: true, service: true, teacher: true, studio: true,
    },
    orderBy: { startTime: 'asc' },
  })

  const teachers = await prisma.teacher.findMany({ orderBy: { name: 'asc' } })
  const members = await prisma.member.findMany({ where: { isAdmin: false }, include: { packages: { where: { remaining: { gt: 0 } }, take: 1 } } })
  const services = await prisma.service.findMany()

  return (
    <AdminCalendarClient
      branches={branches.map(b => ({ id: b.id, slug: b.slug, name: b.name }))}
      currentBranchSlug={branchSlug}
      currentDate={dateStr}
      studios={branch.studios.map(s => ({ id: s.id, name: s.name, kind: s.kind }))}
      bookings={bookings.map(b => ({
        id: b.id,
        clientName: b.member?.name ?? '—',
        teacherName: b.teacher?.name ?? '—',
        serviceName: b.service.name,
        serviceSlug: b.service.slug,
        studioId: b.studioId ?? '',
        startTime: b.startTime.toISOString(),
        endTime: b.endTime.toISOString(),
        status: b.status,
        kind: b.kind,
        isInHome: b.isInHome,
      }))}
      teachers={teachers.map(t => ({ id: t.id, name: t.name }))}
      members={members.map(m => ({ id: m.id, name: m.name, phone: m.phone, remaining: m.packages[0]?.remaining ?? 0 }))}
      services={services.map(s => ({ id: s.id, slug: s.slug, name: s.name, durationMin: s.durationMin }))}
    />
  )
}
