'use client'

import { useState, useTransition } from 'react'
import { useTheme } from '@/context/theme-context'
import { logoutAction } from '@/app/actions/auth'
import Icon from '@/components/ui/Icon'

const SECTIONS = [
  {
    title: 'Studio',
    items: [
      { icon: 'home2', label: 'Business details', sub: 'RIO Yoga · Bangkok' },
      { icon: 'clock', label: 'Operating hours', sub: '07:00 – 21:00 daily' },
      { icon: 'money', label: 'Pricing & packages', sub: '3 package tiers' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: 'bell', label: 'SMS reminders', sub: 'Sent 24h before class' },
      { icon: 'bell', label: 'Cancellation alerts', sub: 'Notify teacher + member' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { icon: 'calendar', label: 'Google Calendar sync', sub: 'Not connected' },
      { icon: 'grid', label: 'LINE Notify', sub: 'Not connected' },
    ],
  },
]

export default function AdminSettingsClient({ adminName }: { adminName: string }) {
  const { dark, toggle } = useTheme()
  const [pending, startTransition] = useTransition()
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  return (
    <div className="flex flex-col h-full">
      <div className="px-7 py-[18px] shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="font-serif text-[26px] tracking-[-0.4px]">Settings</div>
        <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>Signed in as {adminName}</div>
      </div>

      <div className="flex-1 overflow-auto p-7 max-w-[640px]">
        {SECTIONS.map(sec => (
          <div key={sec.title} className="mb-7">
            <div className="text-[11px] uppercase tracking-[0.4px] mb-3" style={{ color: 'var(--dim)' }}>{sec.title}</div>
            <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              {sec.items.map((item, i) => (
                <button key={item.label}
                  className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left"
                  style={{ borderTop: i > 0 ? '1px solid var(--line)' : undefined }}
                  onClick={() => showToast(`${item.label} — coming soon`)}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--surface2)' }}>
                    <Icon name={item.icon} size={16} color="var(--fg)" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px]">{item.label}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>{item.sub}</div>
                  </div>
                  <Icon name="chev" size={16} color="var(--dim)" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* dark mode */}
        <div className="mb-7">
          <div className="text-[11px] uppercase tracking-[0.4px] mb-3" style={{ color: 'var(--dim)' }}>Appearance</div>
          <div className="flex items-center justify-between px-5 py-3.5 rounded-[14px]"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface2)' }}>
                <Icon name={dark ? 'sun' : 'moon'} size={16} color="var(--fg)" />
              </div>
              <div className="text-[14px]">Dark mode</div>
            </div>
            <button onClick={toggle}
              className="w-12 h-7 rounded-full transition-colors relative"
              style={{ background: dark ? 'var(--accent)' : 'var(--surface2)' }}>
              <div className="absolute top-1 w-5 h-5 rounded-full transition-all"
                style={{ background: '#fff', left: dark ? 'calc(100% - 24px)' : 4 }} />
            </button>
          </div>
        </div>

        <button
          onClick={() => startTransition(() => logoutAction())}
          disabled={pending}
          className="w-full py-3.5 rounded-[14px] text-[14px] disabled:opacity-50"
          style={{ border: '1px solid var(--line)', color: 'var(--dim)' }}>
          {pending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-3 rounded-xl text-[13px] flex items-center gap-2 z-50"
          style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
          <Icon name="check" size={16} color="var(--bg)" />
          {toast}
        </div>
      )}
    </div>
  )
}
