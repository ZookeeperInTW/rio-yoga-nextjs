import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import AdminMembersClient from '@/components/admin/MembersClient'

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')

  const members = await prisma.member.findMany({
    where: { isAdmin: false },
    include: {
      packages: { orderBy: { expiresAt: 'asc' } },
      bookings: { where: { status: { not: 'cancelled' } } },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <AdminMembersClient
      members={members.map(m => {
        const active = m.packages.find(p => p.remaining > 0 && p.expiresAt > new Date())
        return {
          id: m.id,
          name: m.name,
          phone: m.phone,
          initial: m.initial,
          remaining: active?.remaining ?? 0,
          totalBookings: m.bookings.length,
          packageCount: m.packages.length,
          joinedAt: m.createdAt.toISOString(),
        }
      })}
    />
  )
}
