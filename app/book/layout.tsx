import { BookingProvider } from '@/context/booking-context'

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col items-center" style={{ background: 'var(--bg)' }}>
        <div className="w-full max-w-[402px] min-h-screen relative" style={{ color: 'var(--fg)' }}>
          <div className="h-14" />
          {children}
        </div>
      </div>
    </BookingProvider>
  )
}
