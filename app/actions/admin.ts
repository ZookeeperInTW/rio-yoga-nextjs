'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { sessionOptions, type SessionData } from '@/lib/session'

function genRef() {
  return `RIO-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
}

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')
  return session
}

export async function createAdminBookingAction(data: {
  memberId: string
  serviceSlug: string
  teacherId: string
  studioId: string
  startIso: string
  notes?: string
}) {
  await requireAdmin()

  const service = await prisma.service.findUniqueOrThrow({ where: { slug: data.serviceSlug } })
  const startTime = new Date(data.startIso)
  const endTime = new Date(startTime.getTime() + service.durationMin * 60_000)
  const studio = await prisma.studio.findUniqueOrThrow({ where: { id: data.studioId }, include: { branch: true } })

  await prisma.booking.create({
    data: {
      bookingRef: genRef(),
      memberId: data.memberId,
      serviceId: service.id,
      teacherId: data.teacherId,
      branchId: studio.branchId,
      studioId: data.studioId,
      startTime,
      endTime,
      status: 'confirmed',
      kind: service.slug,
      notes: data.notes,
    },
  })

  // Deduct package
  const pkg = await prisma.package.findFirst({
    where: { memberId: data.memberId, remaining: { gt: 0 }, expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: 'asc' },
  })
  if (pkg) {
    await prisma.package.update({ where: { id: pkg.id }, data: { remaining: { decrement: 1 } } })
  }

  revalidatePath('/admin/calendar')
}

export async function updateAvailabilityAction(teacherId: string, blocks: { dayOfWeek: number; startHour: number; endHour: number }[]) {
  await requireAdmin()

  await prisma.availability.deleteMany({ where: { teacherId } })
  await prisma.availability.createMany({
    data: blocks.map(b => ({ teacherId, ...b })),
  })

  revalidatePath('/admin/teachers')
}
