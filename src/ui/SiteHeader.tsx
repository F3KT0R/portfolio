'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi'

import styles from './SiteHeader.module.scss'
import { AccentToggle } from '@/ui/theme/AccentToggle'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/about', label: 'About' },
  { href: '/uses', label: 'Uses' },
  { href: '/now', label: 'Now' },
  { href: '/contact', label: 'Contact' },
]

function toggleTheme() {
  const current = document.documentElement.dataset.theme
  const next = current === 'light' ? 'dark' : 'light'
  document.documentElement.dataset.theme = next
  localStorage.setItem('theme', next)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const themeIcon = useMemo(() => {
    const t = typeof document === 'undefined' ? 'dark' : document.documentElement.dataset.theme
    return t === 'light' ? <FiMoon aria-hidden /> : <FiSun aria-hidden />
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="Go to home">
          <span>F3</span>
          <span className={styles.badge}>Portfolio v2</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <div className={styles.links}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
            <AccentToggle />

            <button
              type="button"
              className={styles.iconButton}
              onClick={() => toggleTheme()}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {themeIcon}
            </button>

            <button
              type="button"
              className={`${styles.iconButton} ${styles.mobileToggle}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation"
              title="Menu"
            >
              <FiMenu aria-hidden />
            </button>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div id="mobile-nav" className={styles.mobilePanel}>
          <div className={styles.mobileGrid}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.link}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
