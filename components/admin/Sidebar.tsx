'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/theme-context'
import Icon from '@/components/ui/Icon'

const NAV = [
  { label: 'Calendar', icon: 'calendar', href: '/admin/calendar' },
  { label: 'Bookings', icon: 'book',     href: '/admin/bookings' },
  { label: 'Teachers', icon: 'user2',    href: '/admin/teachers' },
  { label: 'Branches', icon: 'home2',    href: '/admin/branches' },
  { label: 'Members',  icon: 'user',     href: '/admin/members' },
  { label: 'Reports',  icon: 'grid',     href: '/admin/reports' },
  { label: 'Settings', icon: 'settings', href: '/admin/settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { dark, toggle } = useTheme()

  return (
    <div
      className="w-[200px] shrink-0 flex flex-col gap-1 py-5 px-4 h-screen sticky top-0"
      style={{ borderRight: '1px solid var(--line)' }}
    >
      <div className="flex items-center gap-2.5 px-2 pb-[18px]">
        <div className="w-7 h-7 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="font-serif text-[20px] tracking-[-0.3px]">RIO</span>
        <span className="text-[10px] uppercase tracking-[0.5px] ml-auto" style={{ color: 'var(--dim)' }}>ADMIN</span>
      </div>

      {NAV.map(item => {
        const active = pathname.startsWith(item.href)
        return (
          <Link key={item.label} href={item.href}>
            <div
              className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[13px] transition-colors"
              style={{
                background: active ? 'var(--surface2)' : 'transparent',
                color: active ? 'var(--fg)' : 'var(--dim)',
              }}
            >
              <Icon name={item.icon} size={16} color={active ? 'var(--accent)' : 'var(--dim)'} />
              {item.label}
            </div>
          </Link>
        )
      })}

      <div className="flex-1" />

      <button
        onClick={toggle}
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] mb-2 transition-colors"
        style={{ color: 'var(--dim)', border: '1px solid var(--line)' }}
      >
        <Icon name={dark ? 'sun' : 'moon'} size={14} color="var(--dim)" />
        {dark ? 'Light mode' : 'Dark mode'}
      </button>

      <div className="px-2.5 py-2.5 rounded-[10px] text-[12px]" style={{ background: 'var(--surface2)' }}>
        <div className="font-serif text-[14px]">Owner</div>
        <div className="mt-0.5" style={{ color: 'var(--dim)' }}>Anya R.</div>
      </div>
    </div>
  )
}
