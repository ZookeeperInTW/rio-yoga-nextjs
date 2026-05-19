interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
}

export default function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.6 }: IconProps) {
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const paths: Record<string, React.ReactNode> = {
    home: <><path {...p} d="M3 11l9-8 9 8" /><path {...p} d="M5 9.5V20h14V9.5" /></>,
    calendar: <><rect {...p} x="3.5" y="5" width="17" height="15" rx="2.5" /><path {...p} d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
    user: <><circle {...p} cx="12" cy="8" r="3.5" /><path {...p} d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
    plus: <path {...p} d="M12 5v14M5 12h14" />,
    arrow: <path {...p} d="M5 12h14M13 6l6 6-6 6" />,
    back: <path {...p} d="M19 12H5M11 6l-6 6 6 6" />,
    check: <path {...p} d="M5 12.5l5 5L19 7" />,
    pin: <><path {...p} d="M12 21s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" /><circle {...p} cx="12" cy="8" r="2.5" /></>,
    clock: <><circle {...p} cx="12" cy="12" r="8.5" /><path {...p} d="M12 7v5l3 2.5" /></>,
    chev: <path {...p} d="M9 6l6 6-6 6" />,
    chevd: <path {...p} d="M6 9l6 6 6-6" />,
    filter: <path {...p} d="M4 6h16M7 12h10M10 18h4" />,
    search: <><circle {...p} cx="11" cy="11" r="6.5" /><path {...p} d="M16 16l4 4" /></>,
    bell: <><path {...p} d="M6 16V11a6 6 0 0112 0v5l1.5 2H4.5L6 16z" /><path {...p} d="M10 20a2 2 0 004 0" /></>,
    sparkle: <path {...p} d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4z" />,
    leaf: <><path {...p} d="M4 20c8 0 16-6 16-16-8 0-16 6-16 16z" /><path {...p} d="M4 20l12-12" /></>,
    flame: <path {...p} d="M12 3c0 4-4 5-4 9a4 4 0 008 0c0-2-1-3-1-5 2 1 3 3 3 5a6 6 0 11-12 0c0-5 5-5 6-9z" />,
    yoga: <><circle {...p} cx="12" cy="5" r="2" /><path {...p} d="M8 21c0-3 1-5 4-5s4 2 4 5" /><path {...p} d="M5 12h14M9 9l-4 3 4 3M15 9l4 3-4 3" /></>,
    massage: <><path {...p} d="M3 16c4-3 8-3 12-3s6 1 6 1" /><circle {...p} cx="6" cy="14" r="1" /><circle {...p} cx="11" cy="13" r="1" /><circle {...p} cx="16" cy="13" r="1" /></>,
    home2: <><path {...p} d="M3 12l9-7 9 7M5 11v9h14v-9" /></>,
    grid: <><rect {...p} x="3.5" y="3.5" width="7" height="7" rx="1" /><rect {...p} x="13.5" y="3.5" width="7" height="7" rx="1" /><rect {...p} x="3.5" y="13.5" width="7" height="7" rx="1" /><rect {...p} x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
    settings: <><circle {...p} cx="12" cy="12" r="3" /><path {...p} d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>,
    user2: <><circle {...p} cx="12" cy="8" r="3.5" /><path {...p} d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></>,
    book: <path {...p} d="M4 4h7v16H6a2 2 0 01-2-2V4zm16 0h-7v16h5a2 2 0 002-2V4z" />,
    money: <><circle {...p} cx="12" cy="12" r="8.5" /><path {...p} d="M9 14c0 1 1 2 3 2s3-1 3-2-1-1.5-3-2-3-1-3-2 1-2 3-2 3 1 3 2M12 7v10" /></>,
    menu: <path {...p} d="M4 7h16M4 12h16M4 17h16" />,
    sun: <><circle {...p} cx="12" cy="12" r="4" /><path {...p} d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>,
    moon: <path {...p} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
    x: <path {...p} d="M18 6L6 18M6 6l12 12" />,
    dot: <circle cx="12" cy="12" r="3" fill={color} />,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {paths[name] ?? null}
    </svg>
  )
}
