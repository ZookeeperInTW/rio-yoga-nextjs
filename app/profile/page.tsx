import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import ProfileClient from '@/components/member/ProfileClient'

export default async function ProfilePage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const member = await prisma.member.findUnique({
    where: { id: session.memberId },
    include: {
      packages: { orderBy: { expiresAt: 'asc' } },
      bookings: { where: { status: { not: 'cancelled' } } },
    },
  })

  if (!member) redirect('/login')

  const totalBookings = member.bookings.length
  const activePackage = member.packages.find(p => p.remaining > 0 && p.expiresAt > new Date())

  return (
    <ProfileClient
      member={{
        name: member.name,
        initial: member.name[0],
        phone: member.phone,
        remaining: activePackage?.remaining ?? 0,
        totalBookings,
        packageCount: member.packages.length,
      }}
    />
  )
}
