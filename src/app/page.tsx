export default function Page() {
  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: 'serif', fontSize: '6rem', background: 'linear-gradient(135deg, #fff, rgba(108,99,255,.9))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        PRECARIOUS
      </h1>
      <p style={{ color: 'rgba(232,234,246,.6)', maxWidth: '540px', textAlign: 'center', lineHeight: 1.7 }}>
        Next.js runtime confirmed. Open <strong>index.html</strong> for the full UI while the React build is completed.
      </p>
    </main>
  )
}
