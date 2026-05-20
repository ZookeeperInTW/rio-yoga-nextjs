import type { IronSessionOptions } from 'iron-session'

export interface SessionData {
  memberId?: string
  memberName?: string
  isAdmin?: boolean
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET ?? 'fallback-dev-secret-32-chars-exactly!!',
  cookieName: 'rio-yoga-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
}
