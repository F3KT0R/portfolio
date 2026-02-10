'use client'

export function ThemeScript() {
  // Inline script to avoid theme flash. Must stay small.
  // eslint-disable-next-line react/no-danger
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(() => {
  try {
    const storedTheme = localStorage.getItem('theme');
    const storedAccent = localStorage.getItem('accent');

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = storedTheme || (prefersLight ? 'light' : 'dark');

    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = storedAccent || 'lime';
  } catch (_) {
    // no-op
  }
})();`,
      }}
    />
  )
}
