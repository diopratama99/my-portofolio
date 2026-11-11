import type { ComponentType, CSSProperties } from 'react'
import { Globe } from 'lucide-react'
import { SiAstro, SiDocker, SiFlutter, SiGo, SiReact, SiSupabase, SiTypescript } from 'react-icons/si'

type IconComponent = ComponentType<{ size?: number; className?: string; style?: CSSProperties }>

const ICONS: Record<string, { Icon: IconComponent; color?: string }> = {
  Web: { Icon: Globe },
  Go: { Icon: SiGo, color: '#00ADD8' },
  React: { Icon: SiReact, color: '#149ECA' },
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  Docker: { Icon: SiDocker, color: '#2496ED' },
  Flutter: { Icon: SiFlutter, color: '#02A9F4' },
  Supabase: { Icon: SiSupabase, color: '#3ECF8E' },
  Astro: { Icon: SiAstro, color: '#FF5D01' },
}

/** A tech stack as a row of icons; the name shows on hover and to screen readers. */
export function StackIcons({ names, size = 22, className = '' }: { names: string[]; size?: number; className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-4 ${className}`}>
      {names.map((name) => {
        const entry = ICONS[name]
        return (
          <li key={name} title={name}>
            {entry ? (
              <>
                <entry.Icon size={size} style={entry.color ? { color: entry.color } : undefined} aria-hidden="true" />
                <span className="sr-only">{name}</span>
              </>
            ) : (
              <span className="text-sm">{name}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
