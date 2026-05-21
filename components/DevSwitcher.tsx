'use client'

import { useTransition } from 'react'
import { switchToMemberAction, switchToAdminAction } from '@/app/actions/dev'

export default function DevSwitcher() {
  const [pending, startTransition] = useTransition()

  return (
    <div
      className="fixed top-3 right-3 z-[9999] flex gap-1.5"
      title="Dev switcher"
    >
      <button
        onClick={() => startTransition(() => switchToMemberAction())}
        disabled={pending}
        className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono disabled:opacity-50 transition-opacity"
        style={{
          background: '#1a1a2e',
          color: '#7dd3fc',
          border: '1px solid #334155',
        }}
      >
        👤 Member
      </button>
      <button
        onClick={() => startTransition(() => switchToAdminAction())}
        disabled={pending}
        className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono disabled:opacity-50 transition-opacity"
        style={{
          background: '#1a1a2e',
          color: '#f0abfc',
          border: '1px solid #334155',
        }}
      >
        🔑 Admin
      </button>
    </div>
  )
}
