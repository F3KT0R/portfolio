export const siteConfig = {
  githubUser: 'F3KT0R',

  // If set, only these repos (full_name values) are shown.
  // Example: "F3KT0R/watchflix-2.0,F3KT0R/tax-calculator"
  showcaseAllowlist: process.env.SHOWCASE_REPOS?.split(',').map((s) => s.trim()).filter(Boolean) ?? null,

  // Exclude repos by name or full_name.
  showcaseDenylist: new Set(
    (process.env.SHOWCASE_REPOS_EXCLUDE?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? []).concat(['F3KT0R/F3KT0R'])
  ),

  // WARNING: enabling this can expose private repo names and README contents publicly.
  // Only works if `GITHUB_TOKEN` has access to the private repos.
  includePrivate: process.env.SHOW_PRIVATE_REPOS === 'true',

  maxShowcase: Number(process.env.SHOWCASE_MAX ?? 12),
  maxFeatured: Number(process.env.FEATURED_MAX ?? 3),
}
