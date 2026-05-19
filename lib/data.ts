export const RIO = {
  member: {
    name: 'Aria Tanaka',
    initial: 'A',
    upcoming: [
      { date: 'Wed, May 22', time: '09:00', service: 'Private Pilates', teacher: 'Mai L.', branch: 'Sukhumvit', room: 'Studio 2', dur: '60 min' },
      { date: 'Fri, May 24', time: '18:30', service: 'Group Pilates', teacher: 'Nina P.', branch: 'Thonglor', room: 'Studio 1', dur: '50 min' },
      { date: 'Sun, May 26', time: '11:00', service: 'Sports Massage', teacher: 'Pim S.', branch: 'In-home', room: '—', dur: '75 min' },
    ],
    streak: 12,
    pkgRemaining: 7,
    pkgTotal: 10,
  },
  branches: [
    { id: 'sukhumvit', name: 'Sukhumvit', addr: '24 Soi 31, Watthana' },
    { id: 'thonglor', name: 'Thonglor', addr: '88 Thonglor 10, Klongton' },
    { id: 'sathorn', name: 'Sathorn', addr: '12 Naradhiwas Rd, Silom' },
  ],
  services: [
    { id: 'private', name: 'Private Pilates', dur: 60, desc: 'One-on-one, reformer or mat' },
    { id: 'group', name: 'Group Pilates', dur: 50, desc: 'Up to 6 people, mat-based' },
    { id: 'massage', name: 'Sports Massage', dur: 75, desc: 'Therapeutic, in-studio or in-home' },
  ],
  teachers: [
    { id: 't1', name: 'Mai L.', spec: ['Private Pilates'], yrs: 8 },
    { id: 't2', name: 'Nina P.', spec: ['Group Pilates', 'Private Pilates'], yrs: 5 },
    { id: 't3', name: 'Pim S.', spec: ['Sports Massage'], yrs: 12 },
    { id: 't4', name: 'Kanya R.', spec: ['Private Pilates', 'Sports Massage'], yrs: 6 },
    { id: 't5', name: 'June O.', spec: ['Group Pilates'], yrs: 3 },
  ],
}

export const RIO_SLOTS = [
  { t: '07:00', avail: true },  { t: '08:00', avail: true },
  { t: '09:00', avail: false }, { t: '10:00', avail: true },
  { t: '11:00', avail: true },  { t: '12:00', avail: false },
  { t: '13:00', avail: true },  { t: '14:00', avail: true },
  { t: '15:00', avail: false }, { t: '16:00', avail: true },
  { t: '17:00', avail: true },  { t: '18:00', avail: true },
  { t: '19:00', avail: false }, { t: '20:00', avail: true },
]

export const WEEK_STRIP = [
  { d: 22, dow: 'Thu', avail: 6 },
  { d: 23, dow: 'Fri', avail: 4 },
  { d: 24, dow: 'Sat', avail: 9 },
  { d: 25, dow: 'Sun', avail: 7 },
  { d: 26, dow: 'Mon', avail: 8, sel: true },
  { d: 27, dow: 'Tue', avail: 5 },
  { d: 28, dow: 'Wed', avail: 6 },
]

export const ADMIN_TIMES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']

export const ADMIN_COLS = [
  { studio: 'Studio 1', subtitle: 'Group · Reformer' },
  { studio: 'Studio 2', subtitle: 'Private · Reformer' },
  { studio: 'Studio 3', subtitle: 'Massage Room' },
]

export type BookingKind = 'private' | 'group' | 'massage' | 'hold'
export interface AdminBooking {
  col: number; startIdx: number; span: number; kind: BookingKind;
  teacher: string; client: string; label: string;
}

export const ADMIN_BOOKINGS: AdminBooking[] = [
  { col: 0, startIdx: 1, span: 1, kind: 'group',   teacher: 'Nina P.',  client: 'Group · 4/6',       label: 'Group Pilates' },
  { col: 0, startIdx: 3, span: 1, kind: 'group',   teacher: 'June O.',  client: 'Group · 6/6',       label: 'Group Pilates' },
  { col: 0, startIdx: 8, span: 1, kind: 'group',   teacher: 'Nina P.',  client: 'Group · 5/6',       label: 'Group Pilates' },
  { col: 0, startIdx: 10, span: 1, kind: 'group',  teacher: 'June O.',  client: 'Group · 3/6',       label: 'Group Pilates' },
  { col: 1, startIdx: 1, span: 1, kind: 'private', teacher: 'Mai L.',   client: 'A. Tanaka',         label: 'Private Pilates' },
  { col: 1, startIdx: 2, span: 1, kind: 'private', teacher: 'Mai L.',   client: 'R. Sutton',         label: 'Private Pilates' },
  { col: 1, startIdx: 4, span: 1, kind: 'hold',    teacher: '—',        client: 'Maintenance',       label: 'Studio hold' },
  { col: 1, startIdx: 7, span: 1, kind: 'private', teacher: 'Kanya R.', client: 'J. Wong',           label: 'Private Pilates' },
  { col: 1, startIdx: 9, span: 1, kind: 'private', teacher: 'Mai L.',   client: 'E. Park',           label: 'Private Pilates' },
  { col: 2, startIdx: 0, span: 1, kind: 'massage', teacher: 'Pim S.',   client: 'C. Ortega',         label: 'Sports Massage' },
  { col: 2, startIdx: 2, span: 2, kind: 'massage', teacher: 'Pim S.',   client: 'D. Lin',            label: 'Sports Massage · 75m' },
  { col: 2, startIdx: 5, span: 1, kind: 'hold',    teacher: 'Pim S.',   client: 'Travel buffer',     label: 'In-home buffer' },
  { col: 2, startIdx: 6, span: 2, kind: 'massage', teacher: 'Pim S.',   client: 'Y. Sato (in-home)', label: 'Sports Massage · in-home' },
  { col: 2, startIdx: 9, span: 1, kind: 'hold',    teacher: 'Pim S.',   client: 'Travel buffer',     label: 'In-home buffer' },
]

export const ADMIN_TEACHERS_EXTENDED = [
  ...RIO.teachers,
  { id: 't6', name: 'Sira W.', spec: ['Group Pilates'], yrs: 2 },
  { id: 't7', name: 'Eve M.', spec: ['Private Pilates'], yrs: 7 },
]

export const ADMIN_STUDIOS = [
  { name: 'Studio 1', kind: 'Group · Reformer', cap: 6, hours: '07:00 – 21:00', allow: ['Group Pilates'] },
  { name: 'Studio 2', kind: 'Private · Reformer', cap: 1, hours: '07:00 – 21:00', allow: ['Private Pilates'] },
  { name: 'Studio 3', kind: 'Massage Room', cap: 1, hours: '09:00 – 20:00', allow: ['Sports Massage'] },
]

export const MEMBERS_SEARCH = [
  { id: 'm1', name: 'A. Tanaka', phone: '+66 81 234 5678', remaining: 7 },
  { id: 'm2', name: 'R. Sutton', phone: '+66 89 555 1342', remaining: 6 },
  { id: 'm3', name: 'J. Wong',   phone: '+66 82 333 9900', remaining: 3 },
  { id: 'm4', name: 'E. Park',   phone: '+66 91 777 2211', remaining: 10 },
  { id: 'm5', name: 'D. Lin',    phone: '+66 84 111 5566', remaining: 2 },
]
