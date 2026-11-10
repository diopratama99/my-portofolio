import type { IconType } from 'react-icons'
import {
  SiFlutter, SiDart, SiSupabase, SiPostgresql, SiSqlite,
  SiGit, SiGithub, SiFigma,
} from 'react-icons/si'
// Simple Icons dropped the VS Code mark; Codicons has the official one
import { VscVscode } from 'react-icons/vsc'

export interface Tech {
  Icon: IconType
  color: string
  label: string
}

/** Tools used day to day for mobile work. */
export const toolbox: Tech[] = [
  { Icon: SiFlutter, color: '#54C5F8', label: 'Flutter' },
  { Icon: SiDart, color: '#0175C2', label: 'Dart' },
  { Icon: SiSupabase, color: '#3ECF8E', label: 'Supabase' },
  { Icon: SiPostgresql, color: '#6B9BD1', label: 'PostgreSQL' },
  { Icon: SiSqlite, color: '#44A6CF', label: 'SQLite' },
  { Icon: SiGit, color: '#F05032', label: 'Git' },
  { Icon: SiGithub, color: '#E6EDF3', label: 'GitHub' },
  { Icon: SiFigma, color: '#F24E1E', label: 'Figma' },
  { Icon: VscVscode, color: '#23A9F2', label: 'VS Code' },
]

/** Other technologies, listed quietly as text. */
export const alsoUsed = ['React', 'Next.js', 'TypeScript', 'Laravel', 'PHP', 'Python', 'Docker', 'Linux']
