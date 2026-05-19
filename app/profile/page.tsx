'use client'

import { useRouter } from 'next/navigation'
import { RIO } from '@/lib/data'
import TabBar from '@/components/member/TabBar'
import Icon from '@/components/ui/Icon'
import { useTheme } from '@/context/theme-context'

export default function ProfilePage() {
  const router = useRouter()
  const u = RIO.member
  const { dark, toggle } = useTheme()

  const SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: 'user', label: 'Personal details', sub: u.name },
        { icon: 'bell', label: 'Notifications', sub: 'SMS + email enabled' },
        { icon: 'money', label: 'Payment methods', sub: 'Visa •••• 4242' },
      ],
    },
    {
      title: 'Bookings',
      items: [
        { icon: 'calendar', label: 'All bookings', sub: '24 total' },
        { icon: 'clock', label: 'Cancellations', sub: '2 this year' },
        { icon: 'book', label: 'Package history', sub: '3 packages purchased' },
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen relative pb-28" style={{ color: 'var(--fg)' }}>
        <div className="h-14" />

        {/* header */}
        <div className="px-[22px] pt-3 pb-6 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-[32px] italic"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}
          >
            {u.initial}
          </div>
          <div>
            <div className="font-serif text-[24px]">{u.name}</div>
            <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>Member · {u.streak}-week streak</div>
          </div>
        </div>

        {SECTIONS.map(sec => (
          <div key={sec.title} className="px-[22px] mb-6">
            <div className="text-[11px] uppercase tracking-[0.4px] mb-2.5" style={{ color: 'var(--dim)' }}>{sec.title}</div>
            <div className="rounded-[18px] overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              {sec.items.map((item, i) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
                  style={{ borderTop: i > 0 ? '1px solid var(--line)' : undefined }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--surface2)' }}
                  >
                    <Icon name={item.icon} size={16} color="var(--fg)" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px]">{item.label}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--dim)' }}>{item.sub}</div>
                  </div>
                  <Icon name="chev" size={16} color="var(--dim)" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* dark mode toggle */}
        <div className="px-[22px] mb-6">
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-[18px]"
            style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--surface2)' }}>
                <Icon name={dark ? 'sun' : 'moon'} size={16} color="var(--fg)" />
              </div>
              <div className="text-[15px]">Dark mode</div>
            </div>
            <button
              onClick={toggle}
              className="w-12 h-7 rounded-full transition-colors relative"
              style={{ background: dark ? 'var(--accent)' : 'var(--surface2)' }}
            >
              <div
                className="absolute top-1 w-5 h-5 rounded-full transition-all"
                style={{
                  background: '#fff',
                  left: dark ? 'calc(100% - 24px)' : 4,
                }}
              />
            </button>
          </div>
        </div>

        <div className="px-[22px]">
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3.5 rounded-2xl text-[14px]"
            style={{ border: '1px solid var(--line)', color: 'var(--dim)' }}
          >
            Sign out
          </button>
        </div>

        <TabBar />
      </div>
    </div>
  )
}
