'use client'

import { switchToMemberAction, switchToAdminAction } from '@/app/actions/dev'

export default function DevSwitcher() {
  return (
    <div className="fixed top-3 right-3 z-[9999] flex gap-1.5">
      <form action={switchToMemberAction}>
        <button
          type="submit"
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-opacity hover:opacity-80"
          style={{ background: '#1a1a2e', color: '#7dd3fc', border: '1px solid #334155' }}
        >
          👤 Member
        </button>
      </form>
      <form action={switchToAdminAction}>
        <button
          type="submit"
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-opacity hover:opacity-80"
          style={{ background: '#1a1a2e', color: '#f0abfc', border: '1px solid #334155' }}
        >
          🔑 Admin
        </button>
      </form>
    </div>
  )
}
