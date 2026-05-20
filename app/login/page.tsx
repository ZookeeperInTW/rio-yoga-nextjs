'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction } from '@/app/actions/auth'
import Icon from '@/components/ui/Icon'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-between items-center px-[22px] py-4 rounded-[14px] disabled:opacity-60 transition-opacity mt-7"
      style={{ background: 'var(--fg)', color: 'var(--bg)' }}
    >
      <span className="font-serif text-[17px]">{pending ? 'Signing in…' : 'Continue'}</span>
      <Icon name="arrow" size={20} color="var(--bg)" />
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null)
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[402px] min-h-screen flex flex-col" style={{ color: 'var(--fg)' }}>
        <div className="h-15" />

        <div className="flex items-center gap-3 px-[26px] pt-8">
          <div className="w-10 h-10 rounded-full" style={{ background: 'var(--accent)' }} />
          <div className="font-serif text-[26px] tracking-[-0.4px]">RIO Yoga</div>
        </div>

        <form action={formAction} className="px-[26px] flex-1 flex flex-col">
          <div className="mt-16 mb-8">
            <div className="font-serif text-[42px] leading-[1.0] tracking-[-0.8px]">
              Welcome<br />
              <span className="italic" style={{ color: 'var(--accent)' }}>back.</span>
            </div>
            <p className="text-[13px] mt-3.5 leading-relaxed" style={{ color: 'var(--dim)' }}>
              Sign in to book your next session, manage your package, or check your schedule.
            </p>
          </div>

          {state?.error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-[13px]" style={{ background: 'var(--accent-soft)', color: 'var(--accent-ink)' }}>
              {state.error}
            </div>
          )}

          {/* phone */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.4px] mb-2" style={{ color: 'var(--dim)' }}>Phone number</div>
            <div className="flex items-center gap-2.5 pb-1" style={{ borderBottom: '1px solid var(--fg)' }}>
              <div className="font-serif text-[20px]">+66</div>
              <div className="w-px h-[18px]" style={{ background: 'var(--line)' }} />
              <input
                name="phone"
                type="tel"
                defaultValue="81 234 5678"
                className="flex-1 bg-transparent font-serif text-[20px]"
                style={{ color: 'var(--fg)' }}
                placeholder="81 234 5678"
              />
            </div>
          </div>

          {/* password */}
          <div className="mt-7">
            <div className="text-[11px] uppercase tracking-[0.4px] mb-2" style={{ color: 'var(--dim)' }}>Password</div>
            <div className="flex items-center gap-2" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 6 }}>
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                defaultValue="password"
                className="flex-1 bg-transparent font-serif text-[20px]"
                style={{ color: 'var(--dim)' }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="text-[12px]" style={{ color: 'var(--dim)' }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="text-right mt-1.5">
              <button type="button" className="text-[12px]" style={{ color: 'var(--accent)' }}>Forgot password?</button>
            </div>
          </div>

          <SubmitButton />

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
            <span className="text-[11px] uppercase tracking-[0.5px]" style={{ color: 'var(--dim)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--line)' }} />
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Continue with LINE', color: '#06C755' },
              { label: 'Continue with Google', color: 'var(--fg)' },
            ].map(b => (
              <button
                key={b.label}
                type="button"
                className="w-full flex items-center justify-center gap-2.5 px-[18px] py-3.5 rounded-[14px] text-[14px]"
                style={{ border: '1px solid var(--line)' }}
              >
                <div className="w-[18px] h-[18px] rounded-[4px]" style={{ background: b.color }} />
                {b.label}
              </button>
            ))}
          </div>
        </form>

        <div className="px-[26px] pb-11 text-center text-[13px]" style={{ color: 'var(--dim)' }}>
          Demo: <span className="font-mono text-[11px]">+66812345678 / password</span>
          <br />
          Admin: <span className="font-mono text-[11px]">+66900000000 / admin123</span>
        </div>
      </div>
    </div>
  )
}
