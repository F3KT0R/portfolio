import Link from 'next/link'
import type { Route } from 'next'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cx(styles.button, styles[variant], styles[size], className)
}

type Common = { variant?: Variant; size?: Size; children: ReactNode; className?: string }

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: Common & ComponentPropsWithoutRef<'button'>) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />
}

/** An internal link that looks like a button; `href` is checked by typedRoutes. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  ...rest
}: Common & { href: Route } & Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>) {
  return <Link href={href} className={buttonClass(variant, size, className)} {...rest} />
}

/** An external or file link that looks like a button. */
export function ButtonAnchor({
  variant,
  size,
  className,
  ...rest
}: Common & ComponentPropsWithoutRef<'a'>) {
  return <a className={buttonClass(variant, size, className)} {...rest} />
}
