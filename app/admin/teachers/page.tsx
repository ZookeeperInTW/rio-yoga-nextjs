import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import AdminTeachersClient from '@/components/admin/TeachersClient'

export default async function AdminTeachersPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')

  const teachers = await prisma.teacher.findMany({
    orderBy: { name: 'asc' },
    include: {
      teacherServices: { include: { service: true } },
      availability: { orderBy: [{ dayOfWeek: 'asc' }, { startHour: 'asc' }] },
    },
  })

  return (
    <AdminTeachersClient
      teachers={teachers.map(t => ({
        id: t.id,
        name: t.name,
        yearsExp: t.yearsExp,
        sessions: t.sessions,
        hoursScheduled: t.hoursScheduled,
        avgRating: t.avgRating,
        specialties: t.teacherServices.map(ts => ts.service.name),
        availability: t.availability.map(a => ({
          dayOfWeek: a.dayOfWeek,
          startHour: a.startHour,
          endHour: a.endHour,
        })),
      }))}
    />
  )
}
