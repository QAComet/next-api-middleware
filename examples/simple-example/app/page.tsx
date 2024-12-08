
export default function Home() {
  return (
    <div style={{padding: '32px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
      <div>Check out <a href="/dashboard">/dashboard/</a></div>
      <div>Check out <a href="/dashboard/1234/">/dashboard/:userId/</a></div>
    </div>
  )
}
