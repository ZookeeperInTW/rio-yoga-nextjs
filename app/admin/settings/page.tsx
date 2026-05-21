import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import AdminSettingsClient from '@/components/admin/SettingsClient'

export default async function AdminSettingsPage() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.memberId || !session.isAdmin) redirect('/login')

  return <AdminSettingsClient adminName={session.memberName ?? 'Admin'} />
}
