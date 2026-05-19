'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/ui/Icon'

const TABS = [
  { id: 'home',    label: 'Home',     icon: 'home',     href: '/dashboard' },
  { id: 'book',    label: 'Book',     icon: 'plus',     href: '/book/service' },
  { id: 'cal',     label: 'Schedule', icon: 'calendar', href: '/schedule' },
  { id: 'profile', label: 'Profile',  icon: 'user',     href: '/profile' },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div
        className="flex justify-around items-end px-4 pt-3 pb-8"
        style={{ background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}
      >
        {TABS.map(tab => {
          const isBook = tab.id === 'book'
          const isActive = pathname.startsWith(tab.href)

          if (isBook) {
            return (
              <Link key={tab.id} href={tab.href}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center -mt-4 shadow-clay"
                  style={{ background: 'var(--accent)' }}
                >
                  <Icon name="plus" size={22} color="#fff" />
                </div>
              </Link>
            )
          }

          return (
            <Link key={tab.id} href={tab.href}>
              <div
                className="flex flex-col items-center gap-1"
                style={{ color: isActive ? 'var(--fg)' : 'var(--dim)' }}
              >
                <Icon name={tab.icon} size={20} color={isActive ? 'var(--fg)' : 'var(--dim)'} />
                <span className="text-[10px] uppercase tracking-[0.4px]">{tab.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
