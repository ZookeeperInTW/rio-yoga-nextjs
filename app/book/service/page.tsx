import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import ServiceSelector from '@/components/member/ServiceSelector'

export default async function BookServicePage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })

  return (
    <ServiceSelector
      services={services.map(s => ({ id: s.id, slug: s.slug, name: s.name, durationMin: s.durationMin, description: s.description }))}
    />
  )
}
