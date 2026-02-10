import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ width: 'min(900px, calc(100% - 2.5rem))', margin: '0 auto', padding: '4rem 0' }}>
      <h1>Not found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link href="/">Go home</Link>
    </div>
  )
}
