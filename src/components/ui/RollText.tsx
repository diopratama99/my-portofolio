/** Label that rolls up to a duplicate of itself when its link or button is hovered. */
export function RollText({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}
