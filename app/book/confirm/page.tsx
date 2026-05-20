import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import ConfirmClient from '@/components/member/ConfirmClient'

export default async function BookConfirmPage({ searchParams }: { searchParams: { id?: string } }) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  if (!searchParams.id) redirect('/book/service')

  const booking = await prisma.booking.findFirst({
    where: { id: searchParams.id, memberId: session.memberId },
    include: { service: true, teacher: true, branch: true, studio: true },
  })

  if (!booking) redirect('/dashboard')

  return (
    <ConfirmClient
      booking={{
        id: booking.id,
        bookingRef: booking.bookingRef,
        serviceName: booking.service.name,
        durationMin: booking.service.durationMin,
        teacherName: booking.teacher?.name ?? 'Any available',
        branchName: booking.branch?.name ?? (booking.isInHome ? 'In-home' : '—'),
        studioName: booking.studio?.name ?? '—',
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
      }}
    />
  )
}
