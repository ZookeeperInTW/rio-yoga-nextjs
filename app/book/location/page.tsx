import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import LocationSelector from '@/components/member/LocationSelector'

export default async function BookLocationPage({ searchParams }: { searchParams: { service?: string } }) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const serviceSlug = searchParams.service ?? 'private'
  const branches = await prisma.branch.findMany({ orderBy: { name: 'asc' } })

  return (
    <LocationSelector
      serviceSlug={serviceSlug}
      branches={branches.map(b => ({ id: b.id, slug: b.slug, name: b.name, address: b.address }))}
    />
  )
}
