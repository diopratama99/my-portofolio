import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: '#0B1426', fontFamily: 'var(--font-mono, monospace)' }}
    >
      {/* Glow blob */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <p
        className="text-xs tracking-[0.3em] uppercase mb-4"
        style={{ color: 'rgba(59,130,246,0.7)' }}
      >
        Error 404
      </p>

      <h1
        className="font-bold leading-none mb-4"
        style={{
          fontSize: 'clamp(5rem, 20vw, 12rem)',
          background: 'linear-gradient(135deg, #E2E8F0 0%, #3B82F6 60%, #6366F1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </h1>

      <p className="text-base mb-8" style={{ color: 'rgba(148,163,184,0.6)' }}>
        Halaman tidak ditemukan.
      </p>

      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
        style={{
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.4)',
          color: '#60A5FA',
          textDecoration: 'none',
        }}
      >
        ← Kembali ke Home
      </Link>
    </div>
  )
}
