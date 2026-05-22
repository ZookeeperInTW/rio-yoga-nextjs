import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import PackagesClient from '@/components/member/PackagesClient'

export default async function PackagesPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const packages = await prisma.package.findMany({
    where: { memberId: session.memberId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <PackagesClient
      history={packages.map(p => ({
        id: p.id,
        total: p.total,
        remaining: p.remaining,
        expiresAt: p.expiresAt.toISOString(),
      }))}
    />
  )
}
