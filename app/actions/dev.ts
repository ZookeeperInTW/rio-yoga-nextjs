'use server'

import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function switchToMemberAction() {
  const member = await prisma.member.findFirst({ where: { isAdmin: false } })
  if (!member) redirect('/login')

  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.memberId = member.id
  session.memberName = member.name
  session.isAdmin = false
  await session.save()

  redirect('/dashboard')
}

export async function switchToAdminAction() {
  const admin = await prisma.member.findFirst({ where: { isAdmin: true } })
  if (!admin) redirect('/login')

  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.memberId = admin.id
  session.memberName = admin.name
  session.isAdmin = true
  await session.save()

  redirect('/admin/calendar')
}
