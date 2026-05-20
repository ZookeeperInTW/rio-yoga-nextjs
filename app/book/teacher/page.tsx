import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import prisma from '@/lib/db'
import TeacherSelector from '@/components/member/TeacherSelector'

export default async function BookTeacherPage({ searchParams }: { searchParams: { service?: string; branch?: string; home?: string } }) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId) redirect('/login')

  const serviceSlug = searchParams.service ?? 'private'
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } })
  if (!service) redirect('/book/service')

  const teachers = await prisma.teacher.findMany({
    where: { teacherServices: { some: { service: { slug: serviceSlug } } } },
    include: { teacherServices: { include: { service: true } } },
    orderBy: { name: 'asc' },
  })

  return (
    <TeacherSelector
      serviceSlug={serviceSlug}
      branchSlug={searchParams.branch}
      isHome={!!searchParams.home}
      teachers={teachers.map(t => ({
        id: t.id,
        name: t.name,
        yearsExp: t.yearsExp,
        specs: t.teacherServices.map(ts => ts.service.name),
      }))}
    />
  )
}
