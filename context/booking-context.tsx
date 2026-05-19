'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface BookingState {
  serviceId: string
  locationType: 'branch' | 'home'
  branchId: string
  teacherId: string
  dayIdx: number
  time: string
}

interface BookingContextValue {
  booking: BookingState
  setBooking: (patch: Partial<BookingState>) => void
  reset: () => void
}

const defaults: BookingState = {
  serviceId: 'private',
  locationType: 'branch',
  branchId: 'sukhumvit',
  teacherId: 't1',
  dayIdx: 4,
  time: '10:00',
}

const BookingContext = createContext<BookingContextValue>({
  booking: defaults,
  setBooking: () => {},
  reset: () => {},
})

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBookingState] = useState<BookingState>(defaults)

  const setBooking = (patch: Partial<BookingState>) =>
    setBookingState(prev => ({ ...prev, ...patch }))

  const reset = () => setBookingState(defaults)

  return (
    <BookingContext.Provider value={{ booking, setBooking, reset }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
