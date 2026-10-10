'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isActive, primaryNav } from '@/lib/routes'
import { Kbd, PixelIcon } from '@/ui'
import styles from './NavHotbar.module.css'

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

/**
 * The primary navigation as an action bar: number keys 1–6 jump to a slot.
 * In the header on wide screens, pinned to the bottom edge on phones.
 */
export function NavHotbar() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || isTyping(event.target)) return
      if (document.querySelector('dialog[open]')) return
      const item = primaryNav[Number(event.key) - 1]
      if (item) router.push(item.href)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router])

  return (
    <nav className={styles.nav} aria-label="Primary" data-hud="bottom">
      <ul className={styles.list}>
        {primaryNav.map((item, index) => {
          const current = isActive(pathname, item.href)
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className={styles.slot}
                aria-current={current ? 'page' : undefined}
                aria-keyshortcuts={String(index + 1)}
                title={`${item.label} — ${item.plain}`}
              >
                <PixelIcon name={item.icon} size={20} />
                <span className={styles.label}>{item.label}</span>
                <span className={styles.key} aria-hidden>
                  <Kbd>{index + 1}</Kbd>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
