import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import { getAvailableSlots } from '@/app/actions/booking'
import TimeSelector from '@/components/member/TimeSelector'

function buildWeekStrip(baseDate: Date) {
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + i)
    days.push({
      iso: d.toISOString().slice(0, 10),
      d: d.getDate(),
      dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
      mon: d.toLocaleDateString('en-US', { month: 'short' }),
    })
  }
  return days
}

export default async function BookTimePage({
  searchParams,
}: {
  searchParams: { service?: string; branch?: string; teacher?: string; home?: string; date?: string }
}) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const serviceSlug = searchParams.service ?? 'private'
  const teacherId = searchParams.teacher ?? 'any'
  const branchSlug = searchParams.branch
  const isHome = !!searchParams.home

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } })
  const branch = branchSlug ? await prisma.branch.findUnique({ where: { slug: branchSlug } }) : null
  const teacher = teacherId !== 'any'
    ? await prisma.teacher.findUnique({ where: { id: teacherId } })
    : null

  // Week strip starting from today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const weekDays = buildWeekStrip(today)

  const selectedDate = searchParams.date ?? weekDays[0].iso
  const slots = await getAvailableSlots(teacherId, serviceSlug, selectedDate)

  return (
    <TimeSelector
      serviceSlug={serviceSlug}
      branchSlug={branchSlug}
      isHome={isHome}
      teacherId={teacherId}
      serviceName={service?.name ?? ''}
      serviceDur={service?.durationMin ?? 60}
      branchName={branch?.name ?? (isHome ? 'In-home' : '')}
      teacherName={teacher?.name ?? 'Any available'}
      weekDays={weekDays}
      selectedDate={selectedDate}
      slots={slots}
    />
  )
}
