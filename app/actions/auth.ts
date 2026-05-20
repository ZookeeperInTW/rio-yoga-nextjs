'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function loginAction(_prev: unknown, formData: FormData) {
  const phone = (formData.get('phone') as string ?? '').replace(/\s/g, '')
  const password = formData.get('password') as string ?? ''
  const normalized = phone.startsWith('+66') ? phone : `+66${phone}`

  const member = await prisma.member.findUnique({ where: { phone: normalized } })

  if (!member || !(await bcrypt.compare(password, member.passwordHash))) {
    return { error: 'Phone number or password is incorrect.' }
  }

  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.memberId = member.id
  session.memberName = member.name
  session.isAdmin = member.isAdmin
  await session.save()

  redirect(member.isAdmin ? '/admin/calendar' : '/dashboard')
}

export async function logoutAction() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.destroy()
  redirect('/login')
}
