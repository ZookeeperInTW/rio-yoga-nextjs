'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import prisma from '@/lib/db'
import { sessionOptions, type SessionData } from '@/lib/session'

function genRef() {
  return `RIO-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
}

export async function createBookingAction(data: {
  serviceSlug: string
  branchSlug?: string
  teacherId?: string
  dateIso: string    // ISO date string "2026-05-26"
  timeStr: string    // "10:00"
  isInHome: boolean
}) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const service = await prisma.service.findUniqueOrThrow({ where: { slug: data.serviceSlug } })

  const [h, m] = data.timeStr.split(':').map(Number)
  const startTime = new Date(data.dateIso)
  startTime.setUTCHours(h, m, 0, 0)
  const endTime = new Date(startTime.getTime() + service.durationMin * 60_000)

  const branch = data.branchSlug
    ? await prisma.branch.findUnique({ where: { slug: data.branchSlug } })
    : null

  // Pick the first matching studio in that branch for this service type
  let studioId: string | undefined
  if (branch) {
    const kindMap: Record<string, string> = { private: 'Private', group: 'Group', massage: 'Massage' }
    const studio = await prisma.studio.findFirst({
      where: { branchId: branch.id, kind: { contains: kindMap[service.slug] ?? '' } },
    })
    studioId = studio?.id
  }

  const booking = await prisma.booking.create({
    data: {
      bookingRef: genRef(),
      memberId: session.memberId,
      serviceId: service.id,
      teacherId: data.teacherId && data.teacherId !== 'any' ? data.teacherId : undefined,
      branchId: branch?.id,
      studioId,
      startTime,
      endTime,
      status: 'confirmed',
      kind: service.slug,
      isInHome: data.isInHome,
    },
  })

  // Deduct one session from active package
  const pkg = await prisma.package.findFirst({
    where: { memberId: session.memberId, remaining: { gt: 0 }, expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: 'asc' },
  })
  if (pkg) {
    await prisma.package.update({ where: { id: pkg.id }, data: { remaining: { decrement: 1 } } })
  }

  revalidatePath('/dashboard')
  revalidatePath('/schedule')

  redirect(`/book/confirm?id=${booking.id}`)
}

export async function cancelBookingAction(bookingId: string) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  await prisma.booking.update({
    where: { id: bookingId, memberId: session.memberId },
    data: { status: 'cancelled' },
  })

  // Refund package credit
  const pkg = await prisma.package.findFirst({
    where: { memberId: session.memberId, expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: 'asc' },
  })
  if (pkg) {
    await prisma.package.update({ where: { id: pkg.id }, data: { remaining: { increment: 1 } } })
  }

  revalidatePath('/dashboard')
  revalidatePath('/schedule')
}

export async function getAvailableSlots(teacherId: string, serviceSlug: string, dateIso: string) {
  const date = new Date(dateIso)
  // dayOfWeek: 0=Mon … 6=Sun (matching seed data)
  const dow = date.getDay() === 0 ? 6 : date.getDay() - 1

  const service = await prisma.service.findUniqueOrThrow({ where: { slug: serviceSlug } })
  const durationHours = Math.ceil(service.durationMin / 60)

  const availability = teacherId !== 'any'
    ? await prisma.availability.findMany({ where: { teacherId, dayOfWeek: dow } })
    : await prisma.availability.findMany({ where: { dayOfWeek: dow } })

  const startOfDay = new Date(dateIso)
  startOfDay.setUTCHours(0, 0, 0, 0)
  const endOfDay = new Date(dateIso)
  endOfDay.setUTCHours(23, 59, 59, 999)

  const booked = await prisma.booking.findMany({
    where: {
      teacherId: teacherId !== 'any' ? teacherId : undefined,
      startTime: { gte: startOfDay, lt: endOfDay },
      status: { not: 'cancelled' },
    },
  })

  const slots: { t: string; avail: boolean }[] = []
  const seen = new Set<string>()

  for (const window of availability) {
    for (let hour = window.startHour; hour + durationHours <= window.endHour; hour++) {
      const label = `${hour.toString().padStart(2, '0')}:00`
      if (seen.has(label)) continue
      seen.add(label)

      const slotStart = new Date(dateIso)
      slotStart.setUTCHours(hour, 0, 0, 0)
      const slotEnd = new Date(slotStart.getTime() + service.durationMin * 60_000)

      const conflict = booked.some(b => b.startTime < slotEnd && b.endTime > slotStart)
      slots.push({ t: label, avail: !conflict })
    }
  }

  slots.sort((a, b) => a.t.localeCompare(b.t))

  // If no availability data, return default slots
  if (slots.length === 0) {
    const defaults = ['07:00','08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00']
    return defaults.map(t => ({ t, avail: true }))
  }

  return slots
}
