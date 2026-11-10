import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-pad text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[60vmax] w-[60vmax] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(84,104,255,0.18) 0%, transparent 65%)' }}
      />
      <p className="label relative">Error 404</p>
      <h1 className="relative mt-4 font-display text-[clamp(6rem,24vw,18rem)] font-bold leading-[0.8] tracking-[-0.06em]">
        404
      </h1>
      <p className="relative mt-8 text-lg text-muted">Halaman tidak ditemukan.</p>
      <Link href="/" className="btn btn-primary relative mt-10">
        ← Kembali ke Home
      </Link>
    </main>
  )
}
