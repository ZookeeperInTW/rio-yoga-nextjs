'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/Icon'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('81 234 5678')
  const [password, setPassword] = useState('password')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 600)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen flex flex-col" style={{ color: 'var(--fg)' }}>
        <div className="h-15" />

        {/* logo */}
        <div className="flex items-center gap-3 px-[26px] pt-8">
          <div className="w-10 h-10 rounded-full" style={{ background: 'var(--accent)' }} />
          <div className="font-serif text-[26px] tracking-[-0.4px]">RIO Yoga</div>
        </div>

        <div className="px-[26px] flex-1 flex flex-col">
          {/* hero */}
          <div className="mt-16 mb-8">
            <div className="font-serif text-[42px] leading-[1.0] tracking-[-0.8px]">
              Welcome
              <br />
              <span className="italic" style={{ color: 'var(--accent)' }}>back.</span>
            </div>
            <p className="text-[13px] mt-3.5 leading-relaxed" style={{ color: 'var(--dim)' }}>
              Sign in to book your next session, manage your package, or check your schedule.
            </p>
          </div>

          {/* phone field */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.4px] mb-2" style={{ color: 'var(--dim)' }}>Phone number</div>
            <div
              className="flex items-center gap-2.5 pb-1"
              style={{ borderBottom: '1px solid var(--fg)' }}
            >
              <div className="font-serif text-[20px]">+66</div>
              <div className="w-px h-[18px]" style={{ background: 'var(--line)' }} />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 bg-transparent font-serif text-[20px]"
                style={{ color: 'var(--fg)' }}
                placeholder="81 234 5678"
              />
            </div>
          </div>

          {/* password field */}
          <div className="mt-7">
            <div className="text-[11px] uppercase tracking-[0.4px] mb-2" style={{ color: 'var(--dim)' }}>Password</div>
            <div
              className="flex items-center gap-2"
              style={{ borderBottom: '1px solid var(--line)', paddingBottom: 6 }}
            >
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 bg-transparent font-serif text-[20px]"
                style={{ color: 'var(--dim)', letterSpacing: showPw ? 0 : '0.2em' }}
              />
              <button onClick={() => setShowPw(v => !v)} style={{ color: 'var(--dim)' }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="text-right mt-1.5">
              <button className="text-[12px]" style={{ color: 'var(--accent)' }}>Forgot password?</button>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-7 w-full flex justify-between items-center px-[22px] py-4 rounded-[14px] disabled:opacity-60 transition-opacity"
            style={{ background: 'var(--fg)', color: 'var(--bg)' }}
          >
            <span className="font-serif text-[17px]">{loading ? 'Signing in…' : 'Continue'}</span>
            <Icon name="arrow" size={20} color="var(--bg)" />
          </button>

          {/* divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
            <span className="text-[11px] uppercase tracking-[0.5px]" style={{ color: 'var(--dim)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
          </div>

          {/* social buttons */}
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Continue with LINE', color: '#06C755' },
              { label: 'Continue with Google', color: 'var(--fg)' },
            ].map(b => (
              <button
                key={b.label}
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center justify-center gap-2.5 px-[18px] py-3.5 rounded-[14px] text-[14px]"
                style={{ border: '1px solid var(--line)' }}
              >
                <div className="w-[18px] h-[18px] rounded-[4px]" style={{ background: b.color }} />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-[26px] pb-11 text-center text-[13px]" style={{ color: 'var(--dim)' }}>
          New here?{' '}
          <button className="font-serif italic text-[15px]" style={{ color: 'var(--accent)' }}>
            Create account →
          </button>
        </div>
      </div>
    </div>
  )
}
