import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ── Services ────────────────────────────────────────────────────
  const svcPrivate = await prisma.service.upsert({
    where: { slug: 'private' },
    update: {},
    create: { slug: 'private', name: 'Private Pilates', durationMin: 60, description: 'One-on-one, reformer or mat' },
  })
  const svcGroup = await prisma.service.upsert({
    where: { slug: 'group' },
    update: {},
    create: { slug: 'group', name: 'Group Pilates', durationMin: 50, description: 'Up to 6 people, mat-based' },
  })
  const svcMassage = await prisma.service.upsert({
    where: { slug: 'massage' },
    update: {},
    create: { slug: 'massage', name: 'Sports Massage', durationMin: 75, description: 'Therapeutic, in-studio or in-home' },
  })

  // ── Branches & Studios ──────────────────────────────────────────
  const branchSuk = await prisma.branch.upsert({
    where: { slug: 'sukhumvit' },
    update: {},
    create: {
      slug: 'sukhumvit', name: 'Sukhumvit', address: '24 Soi 31, Watthana',
      studios: {
        create: [
          { name: 'Studio 1', kind: 'Group · Reformer',   capacity: 6, hoursStart: '07:00', hoursEnd: '21:00' },
          { name: 'Studio 2', kind: 'Private · Reformer', capacity: 1, hoursStart: '07:00', hoursEnd: '21:00' },
          { name: 'Studio 3', kind: 'Massage Room',       capacity: 1, hoursStart: '09:00', hoursEnd: '20:00' },
        ],
      },
    },
  })
  const branchTho = await prisma.branch.upsert({
    where: { slug: 'thonglor' },
    update: {},
    create: {
      slug: 'thonglor', name: 'Thonglor', address: '88 Thonglor 10, Klongton',
      studios: {
        create: [
          { name: 'Studio 1', kind: 'Group · Reformer',   capacity: 6, hoursStart: '07:00', hoursEnd: '21:00' },
          { name: 'Studio 2', kind: 'Private · Reformer', capacity: 1, hoursStart: '07:00', hoursEnd: '21:00' },
          { name: 'Studio 3', kind: 'Massage Room',       capacity: 1, hoursStart: '09:00', hoursEnd: '20:00' },
        ],
      },
    },
  })
  await prisma.branch.upsert({
    where: { slug: 'sathorn' },
    update: {},
    create: {
      slug: 'sathorn', name: 'Sathorn', address: '12 Naradhiwas Rd, Silom',
      studios: {
        create: [
          { name: 'Studio 1', kind: 'Group · Reformer',   capacity: 6, hoursStart: '07:00', hoursEnd: '21:00' },
          { name: 'Studio 2', kind: 'Private · Reformer', capacity: 1, hoursStart: '07:00', hoursEnd: '21:00' },
          { name: 'Studio 3', kind: 'Massage Room',       capacity: 1, hoursStart: '09:00', hoursEnd: '20:00' },
        ],
      },
    },
  })

  // ── Teachers ────────────────────────────────────────────────────
  const createTeacher = async (
    name: string, yearsExp: number, joined: string,
    services: { slug: string }[],
    avail: { dayOfWeek: number; startHour: number; endHour: number }[],
    stats: { sessions: number; hoursScheduled: number; avgRating: number },
  ) => {
    const existing = await prisma.teacher.findFirst({ where: { name } })
    if (existing) return existing
    return prisma.teacher.create({
      data: {
        name, yearsExp, joinedAt: new Date(joined),
        sessions: stats.sessions, hoursScheduled: stats.hoursScheduled, avgRating: stats.avgRating,
        teacherServices: {
          create: await Promise.all(
            services.map(async s => {
              const svc = await prisma.service.findUnique({ where: { slug: s.slug } })
              return { serviceId: svc!.id }
            })
          ),
        },
        availability: { create: avail },
      },
    })
  }

  const tMai   = await createTeacher('Mai L.',    8, '2023-03-01', [{ slug: 'private' }],
    [{ dayOfWeek: 0, startHour: 9, endHour: 17 }, { dayOfWeek: 1, startHour: 9, endHour: 17 },
     { dayOfWeek: 2, startHour: 9, endHour: 17 }, { dayOfWeek: 3, startHour: 9, endHour: 17 },
     { dayOfWeek: 4, startHour: 9, endHour: 17 }],
    { sessions: 47, hoursScheduled: 38.5, avgRating: 4.92 })

  const tNina  = await createTeacher('Nina P.',   5, '2022-06-15', [{ slug: 'group' }, { slug: 'private' }],
    [{ dayOfWeek: 0, startHour: 8, endHour: 16 }, { dayOfWeek: 1, startHour: 8, endHour: 16 },
     { dayOfWeek: 2, startHour: 8, endHour: 16 }, { dayOfWeek: 4, startHour: 8, endHour: 16 },
     { dayOfWeek: 5, startHour: 9, endHour: 14 }],
    { sessions: 38, hoursScheduled: 32.0, avgRating: 4.85 })

  const tPim   = await createTeacher('Pim S.',   12, '2021-01-10', [{ slug: 'massage' }],
    [{ dayOfWeek: 0, startHour: 9, endHour: 18 }, { dayOfWeek: 1, startHour: 9, endHour: 18 },
     { dayOfWeek: 2, startHour: 9, endHour: 18 }, { dayOfWeek: 3, startHour: 9, endHour: 18 },
     { dayOfWeek: 4, startHour: 9, endHour: 18 }, { dayOfWeek: 5, startHour: 9, endHour: 15 }],
    { sessions: 52, hoursScheduled: 65.0, avgRating: 4.97 })

  const tKanya = await createTeacher('Kanya R.',  6, '2022-09-01', [{ slug: 'private' }, { slug: 'massage' }],
    [{ dayOfWeek: 1, startHour: 9, endHour: 17 }, { dayOfWeek: 3, startHour: 9, endHour: 17 },
     { dayOfWeek: 4, startHour: 9, endHour: 17 }, { dayOfWeek: 5, startHour: 9, endHour: 15 }],
    { sessions: 29, hoursScheduled: 24.5, avgRating: 4.78 })

  await createTeacher('June O.',   3, '2024-02-01', [{ slug: 'group' }],
    [{ dayOfWeek: 0, startHour: 7, endHour: 13 }, { dayOfWeek: 2, startHour: 7, endHour: 13 },
     { dayOfWeek: 4, startHour: 7, endHour: 13 }, { dayOfWeek: 6, startHour: 9, endHour: 13 }],
    { sessions: 18, hoursScheduled: 15.0, avgRating: 4.70 })

  await createTeacher('Sira W.',   2, '2025-01-15', [{ slug: 'group' }],
    [{ dayOfWeek: 1, startHour: 8, endHour: 14 }, { dayOfWeek: 3, startHour: 8, endHour: 14 },
     { dayOfWeek: 5, startHour: 8, endHour: 14 }],
    { sessions: 9, hoursScheduled: 7.5, avgRating: 4.60 })

  await createTeacher('Eve M.',    7, '2022-11-01', [{ slug: 'private' }],
    [{ dayOfWeek: 0, startHour: 10, endHour: 18 }, { dayOfWeek: 2, startHour: 10, endHour: 18 },
     { dayOfWeek: 4, startHour: 10, endHour: 18 }],
    { sessions: 33, hoursScheduled: 28.0, avgRating: 4.88 })

  // ── Members ─────────────────────────────────────────────────────
  const pwHash = await bcrypt.hash('password', 10)
  const adminHash = await bcrypt.hash('admin123', 10)

  const aria = await prisma.member.upsert({
    where: { phone: '+66812345678' },
    update: {},
    create: {
      name: 'Aria Tanaka', phone: '+66812345678', passwordHash: pwHash, initial: 'A',
      packages: {
        create: [{
          total: 10, remaining: 7,
          expiresAt: new Date('2026-08-12'),
        }],
      },
    },
  })

  await prisma.member.upsert({
    where: { phone: '+66895551342' },
    update: {},
    create: {
      name: 'R. Sutton', phone: '+66895551342', passwordHash: pwHash, initial: 'R',
      packages: { create: [{ total: 10, remaining: 6, expiresAt: new Date('2026-09-01') }] },
    },
  })

  await prisma.member.upsert({
    where: { phone: '+66900000000' },
    update: {},
    create: {
      name: 'Anya R.', phone: '+66900000000', passwordHash: adminHash, initial: 'A', isAdmin: true,
    },
  })

  // ── Sample bookings (Aria's upcoming sessions) ──────────────────
  const studios = await prisma.studio.findMany({ where: { branchId: branchSuk.id }, orderBy: { name: 'asc' } })
  const studio2 = studios.find(s => s.name === 'Studio 2')!
  const studio1 = studios.find(s => s.name === 'Studio 1')!
  const studio3Tho = (await prisma.studio.findMany({ where: { branchId: branchTho.id } })).find(s => s.name === 'Studio 1')!

  const makeBooking = async (
    memberId: string, serviceSlug: string, teacherName: string,
    branchSlug: string, studioId: string, startIso: string,
  ) => {
    const svc = await prisma.service.findUniqueOrThrow({ where: { slug: serviceSlug } })
    const teacher = await prisma.teacher.findFirstOrThrow({ where: { name: teacherName } })
    const branch = await prisma.branch.findUniqueOrThrow({ where: { slug: branchSlug } })
    const startTime = new Date(startIso)
    const endTime = new Date(startTime.getTime() + svc.durationMin * 60_000)
    const ref = `RIO-${Math.random().toString(36).slice(2,6).toUpperCase()}-${Math.random().toString(36).slice(2,5).toUpperCase()}`

    return prisma.booking.upsert({
      where: { bookingRef: ref },
      update: {},
      create: {
        bookingRef: ref, memberId, serviceId: svc.id, teacherId: teacher.id,
        branchId: branch.id, studioId,
        startTime, endTime, status: 'confirmed', kind: serviceSlug,
      },
    })
  }

  // Only seed bookings if none exist for Aria
  const existingBookings = await prisma.booking.count({ where: { memberId: aria.id } })
  if (existingBookings === 0) {
    await makeBooking(aria.id, 'private', 'Mai L.',   'sukhumvit', studio2.id, '2026-05-22T09:00:00.000Z')
    await makeBooking(aria.id, 'group',   'Nina P.',  'thonglor',  studio3Tho.id, '2026-05-24T18:30:00.000Z')
    await makeBooking(aria.id, 'private', 'Mai L.',   'sukhumvit', studio2.id, '2026-05-28T07:00:00.000Z')
    await makeBooking(aria.id, 'group',   'Nina P.',  'sukhumvit', studio1.id, '2026-06-02T10:00:00.000Z')
  }

  // ── Admin demo bookings (Sukhumvit, 26 May 2026) ─────────────────
  const studiosSuk = await prisma.studio.findMany({ where: { branchId: branchSuk.id }, orderBy: { name: 'asc' } })
  const s1 = studiosSuk.find(s => s.name === 'Studio 1')!
  const s2 = studiosSuk.find(s => s.name === 'Studio 2')!
  const s3 = studiosSuk.find(s => s.name === 'Studio 3')!

  const existingAdminBookings = await prisma.booking.count({ where: { studioId: s1.id } })
  if (existingAdminBookings === 0) {
    const rSutton = await prisma.member.findFirstOrThrow({ where: { name: 'R. Sutton' } })
    const adminBookings = [
      // Studio 1 (Group)
      { memberId: aria.id,    svc: 'group',   teacherName: 'Nina P.',  studioId: s1.id, iso: '2026-05-26T09:00:00.000Z' },
      { memberId: aria.id,    svc: 'group',   teacherName: 'June O.',  studioId: s1.id, iso: '2026-05-26T11:00:00.000Z' },
      { memberId: aria.id,    svc: 'group',   teacherName: 'Nina P.',  studioId: s1.id, iso: '2026-05-26T16:00:00.000Z' },
      // Studio 2 (Private)
      { memberId: aria.id,    svc: 'private', teacherName: 'Mai L.',   studioId: s2.id, iso: '2026-05-26T09:00:00.000Z' },
      { memberId: rSutton.id, svc: 'private', teacherName: 'Mai L.',   studioId: s2.id, iso: '2026-05-26T10:00:00.000Z' },
      { memberId: aria.id,    svc: 'private', teacherName: 'Kanya R.', studioId: s2.id, iso: '2026-05-26T15:00:00.000Z' },
      // Studio 3 (Massage)
      { memberId: rSutton.id, svc: 'massage', teacherName: 'Pim S.',   studioId: s3.id, iso: '2026-05-26T08:00:00.000Z' },
      { memberId: aria.id,    svc: 'massage', teacherName: 'Pim S.',   studioId: s3.id, iso: '2026-05-26T10:00:00.000Z' },
    ]
    for (const b of adminBookings) {
      await makeBooking(b.memberId, b.svc, b.teacherName, 'sukhumvit', b.studioId, b.iso)
    }
  }

  console.log('Seed complete.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
