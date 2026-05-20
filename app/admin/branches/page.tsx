import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import AdminBranchesClient from '@/components/admin/BranchesClient'

export default async function AdminBranchesPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')

  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' },
    include: {
      studios: { orderBy: { name: 'asc' } },
    },
  })

  return (
    <AdminBranchesClient
      branches={branches.map(b => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        address: b.address,
        studios: b.studios.map(s => ({
          id: s.id,
          name: s.name,
          kind: s.kind,
          capacity: s.capacity,
          hoursStart: String(s.hoursStart),
          hoursEnd: String(s.hoursEnd),
        })),
      }))}
    />
  )
}
