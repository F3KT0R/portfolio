import { themeBootScript } from './theme'

/** Inline, render-blocking on purpose: it must set the theme before first paint. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
}
