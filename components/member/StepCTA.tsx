import Icon from '@/components/ui/Icon'

interface StepCTAProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function StepCTA({ label, onClick, disabled = false }: StepCTAProps) {
  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[402px] px-[22px] pb-9 pt-3.5 z-30"
      style={{ background: 'linear-gradient(to top, var(--bg) 50%, transparent)' }}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full flex justify-between items-center px-[22px] py-[18px] rounded-2xl disabled:opacity-40"
        style={{ background: 'var(--fg)', color: 'var(--bg)' }}
      >
        <span className="font-serif text-[17px]">{label}</span>
        <Icon name="arrow" size={22} color="var(--bg)" />
      </button>
    </div>
  )
}
