import { z } from 'zod'
import { questSchema, type Quest } from './schema'
import type { SkillId } from './skills'

// Projects as quests. Facts come from the repositories' READMEs and history;
// numbers are counted, not estimated. Private code is described, never linked.

type QuestInput = Omit<z.input<typeof questSchema>, 'stack'> & { stack: SkillId[] }

const questData = [
  {
    slug: 'union-medic',
    kind: 'main',
    status: 'active',
    title: 'Union-Medic',
    epithet: 'Two sites, one codebase',
    giver: 'UNION-MEDIC, a Serbian pharmaceutical company',
    role: 'Freelance developer, via Dušan Selaković’s agency',
    party: [
      { name: 'Tibor Bálint', role: 'Developer' },
      { name: 'Dušan Selaković', role: 'Agency lead & reviewer' },
    ],
    start: '2026-09',
    difficulty: 5,
    sigil: 'potion',
    summary:
      'The agency’s Figma design built as a Next.js site that serves Serbian on union-medic.rs and English on union-medic.com from one codebase, with an article admin for the client’s editors.',
    stack: [
      'nextjs',
      'typescript',
      'css',
      'i18n',
      'a11y',
      'playwright',
      'visual-regression',
      'docker',
      'ci',
      'cms',
      'web-perf',
      'figma',
      'scrum',
    ],
    objectives: [
      'Implement the Figma design faithfully from 320 to 1920 px.',
      'Serve each language from its own domain with localised addresses, hreflang and its own sitemap.',
      'Render every page on the server; keep the browser bundle to the menu and the forms.',
      'Give editors an article admin without giving them the repository.',
      'Ship validated, rate-limited contact and career forms with CV uploads.',
      'Package it as a Docker image the agency’s Coolify server can run.',
    ],
    rewards: [
      '61 pull requests, each tied to a SCRUM ticket and explained in its description.',
      '28 Playwright spec files: visual baselines, axe, layout fit at 12 widths, measured text contrast.',
      'Lighthouse SEO 100 on the audited pages of both sites, enforced at ≥ 95 in CI.',
      'Article pictures shrunk from 2.7 MB to 285 KB by a workflow, before any human review.',
    ],
    boss: {
      name: 'The Phantom Menu',
      symptom:
        'The mobile-menu test failed about 4 times in 40 runs under load. It looked like a flaky test, the kind people retry and forget.',
      hunt: 'Instead of retrying, the test was made deterministic: it holds back the page’s scripts, opens the menu while the page is still static, then lets React take over. Now it failed every time — a menu opened before hydration stayed open only until React arrived, then closed itself.',
      fix: 'The menu now closes when the address changes, not on its first render. Closing after a link or any navigation works as before.',
      lesson:
        'A flaky test is a bug report with bad reproduction steps. After the fix: 40 passes out of 40.',
    },
    journal: [
      {
        heading: 'The brief',
        paragraphs: [
          'A pharmaceutical company needed its site rebuilt from an agency design, in Serbian and English. The agency, run by Dušan Selaković, owned the client and the review; I owned the code.',
          'Work arrived as SCRUM tickets. Every change went through a pull request that Dušan reviewed, with a branch guard workflow reporting anything pushed around that process.',
        ],
      },
      {
        heading: 'Language by domain',
        paragraphs: [
          'We first put the language in the path (/sr, /en). After a decision with the client the rule became: the domain is the language. union-medic.rs is Serbian with Serbian addresses, union-medic.com is English with English ones, and nothing redirects by browser language or cookie.',
          'A proxy maps the request’s host to a language and serves pages from one app/[lang] tree. Every route exists in a typed route table with an address per language, so the language switch links to the same page on the other site and falls back to the parent list when a translation does not exist, never to a 404.',
        ],
      },
      {
        heading: 'Server first',
        paragraphs: [
          'Every page is an async server component that takes its text from a dictionary loaded on the server. The header and footer render once per page in the site’s language; the only client code is small islands — the mobile menu, the language links, the forms.',
          'A test reads the built JavaScript and fails if a sentence from either dictionary reaches the browser.',
        ],
      },
      {
        heading: 'Tests as the contract',
        paragraphs: [
          'Design fidelity was checked, not eyeballed: visual baselines at 390, 1000 and 1440 px (regenerated for Linux by a workflow), a layout-fit suite that fails on clipped or overflowing content at 12 widths, and a contrast test that measures each hero text line against the pixels behind it.',
          'That contrast test found white text at 1.1:1 over a light part of the artwork on tablets. The fix was a tinted veil token behind the text below 1100 px, leaving the desktop design untouched.',
        ],
      },
      {
        heading: 'Editors without the repo',
        paragraphs: [
          'Articles are Markdown files in the shape TinaCMS writes, checked at build time: a missing field, a bad date or a missing picture fails the build and names the file. Editors save to a content branch; a workflow optimises their pictures, opens a pull request into dev and starts the quality checks.',
        ],
      },
    ],
    links: { repoNote: 'Client work in a private repository.' },
  },
  {
    slug: 'payspot',
    kind: 'main',
    status: 'active',
    classified: true,
    title: 'PaySpot',
    epithet: 'Fintech in production',
    giver: 'PaySpot d.o.o., a fintech company in Novi Sad',
    role: 'Medior Software Developer',
    party: [
      { name: 'Tibor Bálint', role: 'Developer' },
      { name: 'The PaySpot team', role: 'Names withheld' },
    ],
    start: '2023-02',
    difficulty: 5,
    sigil: 'sword',
    summary:
      'My day job: UI engineering and architecture on a production fintech app, internal tooling and mentoring. Most of it is under NDA — this is what can be said, and the [[redacted:8]] stays inside.',
    stack: [
      'angular',
      'typescript',
      'client-state',
      'csharp',
      'node',
      'sql',
      'design-systems',
      'scrum',
      'mentoring',
    ],
    objectives: [
      'Own core features end to end and contribute to architecture decisions across the app.',
      'Help start a greenfield [[redacted:7]] app from (almost) day one.',
      'Lead a full UI refresh: layout, styling, reusable components and consistency.',
      'Build a Scrum reporting system for delivery visibility.',
      'Co-build an internal agile tracking web app (Angular + Node.js) with full workflow support.',
      'Triage and fix production and test incidents.',
    ],
    rewards: [
      'Delivery visibility: the Scrum reporting workflow is used in day-to-day planning.',
      'A consistent UI built from reusable components, after the styling refresh.',
      'Less friction for teams with the internal agile tracking app.',
      'Interns and juniors mentored, teammates onboarded, the review bar raised.',
    ],
    journal: [
      {
        heading: 'What can be said',
        paragraphs: [
          'Angular and TypeScript on the front, C# ASP.NET MVC behind it, DB2 procedures underneath — those I consume and maintain rather than design.',
          'The work happens under PCI DSS, which shapes how payment software is built, reviewed and shipped. The specifics stay inside: [[redacted:24]].',
        ],
      },
    ],
    links: { repoNote: 'Proprietary code under NDA.' },
  },
  {
    slug: 'kafe-za-vas',
    kind: 'main',
    status: 'live',
    title: 'Kafe za Vas',
    epithet: 'A coffee shop that prices itself',
    giver: 'My own business',
    role: 'Founder & sole developer',
    party: [{ name: 'Tibor Bálint', role: 'Founder, developer, buyer, shipper' }],
    start: '2024-02',
    difficulty: 4,
    sigil: 'chest',
    summary:
      'My own online shop for coffee capsules, tea and syrups bought in the UK and sold in Serbia: a catalogue that syncs and prices itself every day, pre-orders confirmed over Instagram, and an admin that runs the whole order lifecycle.',
    stack: [
      'react',
      'typescript',
      'node',
      'sql',
      'client-state',
      'integrations',
      'validation',
      'unit-testing',
      'ci',
      'hosting',
      'css',
    ],
    objectives: [
      'Split the code into a shared domain package, a Fastify API and a React storefront.',
      'Sync the supplier’s catalogue daily from its public GraphQL API instead of scraping HTML.',
      'Price every product in dinars from the pound without ever guessing a rate.',
      'Price carts on the server and make checkout safe to retry.',
      'Give the owner an admin for orders, purchasing, shipping and loyalty.',
    ],
    rewards: [
      'About 1,150 products read in roughly 12 requests; about 850 kept across 15 capsule systems, tea and syrups.',
      'Exchange rate falls back from the bank’s sell rate to a mid-rate + 3% to the last stored rate; with none, the sync fails and yesterday’s prices stay.',
      'Products are retired only after a complete listing, and never more than 25% at once.',
      'CI runs format, lint, typecheck, tests and builds on every push.',
    ],
    boss: {
      name: 'The Silent Mailroom',
      symptom:
        'Order e-mails never left production. Locally everything worked; on Render the SMTP connection simply went nowhere.',
      hunt: 'Render’s free tier blocks outbound SMTP. So e-mail moved to HTTPS: the API posts each finished message to a small Google Apps Script relay that sends it from the shop’s Gmail. Then the boss came back in a second phase — mails arrived, but the API reported every one as failed.',
      fix: 'Apps Script runs on the POST and then answers with a redirect to a one-off URL that only accepts GET. Following the 307 automatically repeated the POST there and got a 404. The redirect is now followed by hand, always as a GET.',
      lesson:
        'Read the platform’s limits before the code’s logs — and test the failure report as hard as the success path.',
    },
    journal: [
      {
        heading: 'Shape of the system',
        paragraphs: [
          'An npm workspaces monorepo: packages/core holds the pure rules (supplier mapping, pricing, cart, order transitions, loyalty tiers), shared by apps/api (Fastify, Prisma, Neon Postgres) and apps/web (Vite, React 19, TanStack Query, Zustand, Tailwind 4).',
          'Netlify serves the storefront and proxies /api to the API on Render, so the admin cookie stays first-party and there is no CORS to configure.',
        ],
      },
      {
        heading: 'Prices nobody types',
        paragraphs: [
          'The price is the UK regular price plus weight-based transport, converted at the bank’s rate with a margin, floored at landed cost + 100 RSD and rounded up to the next 50. Supplier sales are never passed on; they become margin. Each order line stores its landed cost, so the admin shows profit per order.',
        ],
      },
      {
        heading: 'Orders without online payment',
        paragraphs: [
          'Customers pre-order and pay the courier in cash. The browser sends only SKUs and quantities; the server re-prices the cart and rejects a changed one with the exact reasons. Checkout is idempotent and rate-limited, and a failed email never fails an order.',
          'Statuses move only along allowed transitions. The supplier’s login is behind reCAPTCHA, so instead of automating it the admin offers a bookmarklet that fills the supplier basket through its own add-to-cart.',
        ],
      },
      {
        heading: 'Working around the platform',
        paragraphs: [
          'Render’s free tier blocks SMTP, so order emails go through a small Gmail relay. Locally the database is PGlite — real Postgres compiled to WebAssembly — so the project runs without Docker.',
        ],
      },
    ],
    gallery: [
      {
        src: '/media/quests/kafe-za-vas/storefront.webp',
        width: 1280,
        height: 800,
        alt: 'The Kafe za Vas storefront: a coffee-capsule hero, shop categories and a search bar.',
        caption: 'The live storefront.',
      },
      {
        src: '/media/quests/kafe-za-vas/mobile.webp',
        width: 390,
        height: 664,
        alt: 'The Kafe za Vas storefront on a phone.',
        caption: 'The same shop on a phone.',
      },
    ],
    links: {
      live: 'https://kafeshop.netlify.app',
      repo: 'https://github.com/F3KT0R/coffee-shop',
    },
  },
  {
    slug: 'vinted-package-tracker',
    kind: 'main',
    status: 'active',
    title: 'Vinted Package Tracker',
    epithet: 'From a spreadsheet script to a full-stack app',
    giver: 'A two-person resale business, UK to Serbia',
    role: 'Sole developer, full stack',
    party: [{ name: 'Tibor Bálint', role: 'Developer' }],
    start: '2026-09',
    difficulty: 5,
    sigil: 'key',
    summary:
      'It began as a Google Apps Script over Gmail and a spreadsheet. A month later it is a full-stack app: a Fastify API on Supabase that reads the mailbox in real time, a mobile-first React app with push notifications for both owners, a shared core of tested business rules, and a Chrome extension for the one carrier without an API.',
    stack: [
      'typescript',
      'node',
      'sql',
      'react',
      'integrations',
      'validation',
      'unit-testing',
      'ci',
      'hosting',
      'apps-script',
      'writing',
    ],
    objectives: [
      'Port the script’s business rules into a shared, tested core: receipt parsing, four carrier parsers, the order state machine, exchange rates.',
      'Read Gmail in real time: a push webhook for new mail, a search-based catch-up for anything missed.',
      'Give both owners one mobile-first app — workbench, inbox, finance, reviews, postage — with push notifications on phone and desktop.',
      'Account for every dinar: a business balance ledger, lot shipping costs and profit per item.',
      'Work around platforms without APIs: a Chrome extension for the reCAPTCHA-protected post office tracker, Instagram messages with a clipboard fallback.',
      'Make any data loss recoverable.',
    ],
    rewards: [
      '21 database models and 35 migrations in the first month, in daily use against a backlog of 151 active orders.',
      '234 test cases across 36 files; CI checks format, lint, builds and tests on every push.',
      'Nightly backups from one read-only snapshot; restores only fill empty tables, all or nothing, and every edit is also mirrored outside the database.',
      'Instagram messages send automatically through Meta’s API when its rules allow, and fall back to copy-and-open when they do not.',
    ],
    boss: {
      name: 'The Egress Leech',
      symptom:
        'The Supabase bandwidth bill climbed far past anything a two-person app should need.',
      hunt: 'Query statistics pointed at full-table reads, so they lost their unused columns — about 45 per order down to the 30 actually used, verified byte-identical against production. That helped. Then the sync log told the real story: 1,709 sync attempts in 26 hours, 84% finding no new mail, with bursts of 475 and 381 runs in a single hour.',
      fix: 'A sync slot that admits the expensive work at most once a minute, checked first in both the scheduled and the Gmail-push routes. A throttled request is a true no-op: nothing is marked processed, so nothing is lost — the next run picks up the backlog.',
      lesson:
        'Measure before you optimise. The first fixes were real, but the biggest cost was how often the code ran, not what it read.',
    },
    journal: [
      {
        heading: 'Receipt-led, not guess-led',
        paragraphs: [
          'The first version tried to correlate anonymous carrier parcels with purchases — which meant guessing. The Apps Script version inverted it: the receipt creates the order, the tracking number is added from the conversation, and only then do carrier e-mails attach to that exact order. Anything ambiguous lands in a review queue instead of a wrong row.',
        ],
      },
      {
        heading: 'Outgrowing the spreadsheet',
        paragraphs: [
          'A spreadsheet is a poor database for two people on phones. In September 2026 the tracker became an npm workspaces monorepo: the parsing rules moved into packages/core with tests, a Fastify API with Prisma took over ingestion on Supabase Postgres, and a React app replaced the sheet — bottom tabs and cards on phones, tables on desktop.',
          'The API runs on Render and the web app on Vercel, which proxies /api to it. Supabase provides the database, sign-in and the listing-photo storage.',
        ],
      },
      {
        heading: 'Built for the weak spots',
        paragraphs: [
          'The Serbian post office tracker sits behind reCAPTCHA and has no API, so a small Chrome extension fills in the tracking number, waits for a human to press search, then reads the result back into the app — and alerts both phones if a parcel is returning to sender. It never changes a package’s collected or returned status on its own, because that moves money.',
          'Backups are written nightly from one read-only transaction, so every table comes from the same instant. The restore tool never deletes or overwrites: it only fills empty tables, in one transaction, and only with an explicit flag.',
        ],
      },
    ],
    links: { repoNote: 'Private repository: it reads a personal mailbox.' },
  },
  {
    slug: 'ravioly',
    kind: 'main',
    status: 'launching',
    title: 'Ravioly',
    epithet: 'A family pasta workshop, online',
    giver: 'ZTUR Ravioly-NB, a family pasta workshop in Novi Bečej since 1991',
    role: 'Designer & developer',
    party: [{ name: 'Tibor Bálint', role: 'Design & development' }],
    start: '2026-10',
    difficulty: 3,
    sigil: 'heart',
    summary:
      'A rebuild of a family business’s old static site into a fast, fully prerendered Next.js site with a small web shop that fits how people in Serbia actually buy: cash on delivery or bank transfer, no accounts.',
    stack: [
      'nextjs',
      'react',
      'typescript',
      'css',
      'validation',
      'integrations',
      'web-perf',
      'writing',
    ],
    objectives: [
      'Prerender every page; keep the only server code to the order and contact forms.',
      'Keep the cart in the browser, synced across tabs.',
      'Never trust a price from the client.',
      'Keep every old address and Google result working.',
    ],
    rewards: [
      'The order action validates with Zod and re-prices every line from the catalogue.',
      'Orders get readable numbers (RV-261002-AB12) and e-mails to the shop and the customer.',
      'Product and bakery photos from 2016 recovered from the Wayback Machine.',
      'Old .html addresses redirect permanently to their new pages.',
    ],
    journal: [
      {
        heading: 'Why rebuild',
        paragraphs: [
          'The workshop was founded in 1991 and is run today by the second generation. Its site had no prices, no shop and pages that had drifted from the products. The goal was a site the family can keep accurate, with ordering that feels familiar: courier with cash on delivery, or a pro-forma invoice.',
        ],
      },
      {
        heading: 'Launch checklist',
        paragraphs: [
          'Everything the code cannot know is listed for the family to confirm before launch — prices, pack weights, which archive products are still made, shipping fees — and demo products are marked in the data, so nothing invented can go live by accident.',
        ],
      },
    ],
    compare: {
      before: {
        src: '/media/quests/ravioly/before.webp',
        width: 1280,
        height: 800,
        alt: 'The old ravioly.rs: a full-width pasta photo with a centred white headline.',
      },
      after: {
        src: '/media/quests/ravioly/after.webp',
        width: 1280,
        height: 800,
        alt: 'The rebuild: a cream page with the headline on the left and product packs on the right.',
      },
      beforeLabel: 'Before: the old ravioly.rs',
      afterLabel: 'After: the rebuild (demo shop, before launch)',
    },
    links: { repoNote: 'Not yet published; launching with the family’s go-ahead.' },
  },
  {
    slug: 'trading-bot',
    kind: 'side',
    status: 'active',
    title: 'Crypto Trading Bot',
    epithet: 'Seven safety layers',
    giver: 'Personal passion — markets and automation',
    role: 'Sole developer',
    party: [{ name: 'Tibor Bálint', role: 'Everything' }],
    start: '2025-12',
    difficulty: 4,
    sigil: 'bolt',
    summary:
      'A passion project where two interests meet — markets and automation: an AI-assisted algorithmic trading bot for Binance in Python, built conservative first: risk gates before strategies, a ledger that reconciles with its logs, and a dashboard that starts in paper or live mode.',
    stack: ['python', 'integrations', 'validation', 'writing'],
    objectives: [
      'Run several strategies (mean reversion, momentum, grid) behind one execution pipeline.',
      'Choose strategies by market regime: trend, range or transition.',
      'Make every trade auditable after the fact.',
    ],
    rewards: [
      'Seven independent safety layers: stop-loss, cooldowns, position limits, trend filter, confirmation, volume tiers, time limits.',
      'A daily halt after three stop-losses per strategy.',
      'A persistent ledger reconciled against logs, with heartbeats and recovery.',
    ],
    links: { repoNote: 'Private repository.' },
  },
  {
    slug: 'grain-and-tide',
    kind: 'side',
    status: 'completed',
    title: 'Grain & Tide',
    epithet: 'Checkout without a backend',
    giver: 'A small run of wood-and-resin wall clocks',
    role: 'Sole developer',
    party: [{ name: 'Tibor Bálint', role: 'Everything' }],
    start: '2026-09',
    end: '2026-09',
    difficulty: 2,
    sigil: 'gem',
    summary:
      'A localised Next.js storefront for one-off clocks sold in the UK, Germany and Serbia, with real PayPal checkout and no database.',
    stack: ['nextjs', 'typescript', 'css', 'integrations', 'i18n'],
    objectives: [
      'Take real payments without storing card details or running a server.',
      'Never trust a total computed in the browser.',
    ],
    rewards: [
      'PayPal’s own button via the Orders API; the buyer pays without leaving the page.',
      'Two small serverless routes recompute the total from the product list on every payment.',
    ],
    gallery: [
      {
        src: '/media/quests/grain-and-tide/storefront.webp',
        width: 1280,
        height: 800,
        alt: 'The Grain & Tide home page: a serif headline and a wood-and-resin wall clock.',
        caption: 'The storefront, in Serbian with dinar prices.',
      },
    ],
    links: { repo: 'https://github.com/F3KT0R/clocks' },
  },
  {
    slug: 'character-sheet',
    kind: 'side',
    status: 'active',
    title: 'This character sheet',
    epithet: 'Portfolio 3.0',
    giver: 'Personal',
    role: 'Designer & developer',
    party: [{ name: 'Tibor Bálint', role: 'Everything' }],
    start: '2026-10',
    difficulty: 3,
    sigil: 'shield',
    summary:
      'The site you are on: a portfolio built like a product, with layered architecture enforced by scripts, validated content and a game layer that never stands between a recruiter and the facts.',
    stack: [
      'nextjs',
      'typescript',
      'css',
      'validation',
      'unit-testing',
      'playwright',
      'a11y',
      'ci',
      'design-systems',
    ],
    objectives: [
      'Readable in thirty seconds without playing anything.',
      'Every page rendered on the server; the game is an enhancement.',
      'Architecture that a linter, not a reviewer, keeps honest.',
    ],
    rewards: [
      'Layer and client-boundary rules checked by scripts/check-architecture.mjs on every lint.',
      'Content validated by Zod at build time; cross-references checked by unit tests.',
      'Every route scanned by axe and rendered without JavaScript in the end-to-end suite.',
    ],
    journal: [
      {
        heading: 'How it is built',
        paragraphs: [
          'Five layers with one direction of dependency: lib, content and game (pure TypeScript), ui (domain-free primitives), features (vertical slices with a public index) and app (thin routes). Client components must be named *.client.tsx, and nothing in app/ is a client component.',
          'The game listens; it never leads. Features announce events on a typed bus, the progress feature turns them into achievements, and removing it would leave every page working.',
        ],
      },
    ],
    gallery: [
      {
        src: '/media/quests/character-sheet/sheet.webp',
        width: 1280,
        height: 800,
        alt: 'This site’s character sheet in the dungeon theme: portrait, level bar and the first panels.',
        caption: 'The sheet, in the dungeon theme.',
      },
    ],
    links: { repo: 'https://github.com/F3KT0R/portfolio' },
  },
  {
    slug: 'watchflix',
    kind: 'archive',
    status: 'completed',
    title: 'Watchflix',
    epithet: 'The graduation thesis',
    giver: 'University of Szeged',
    role: 'Sole developer',
    party: [{ name: 'Tibor Bálint', role: 'Everything' }],
    start: '2020-12',
    end: '2023-03',
    difficulty: 2,
    sigil: 'eye',
    summary:
      'A React progressive web app for browsing films and series on The Movie Database API — my BSc thesis — later rebuilt as v2.0 with cleaner components and shared data hooks.',
    stack: ['react', 'css', 'integrations'],
    objectives: [
      'Build an installable PWA on a public API.',
      'Rebuild it once the first version got hard to change.',
    ],
    rewards: ['Defended as my Computer Science BSc thesis.'],
    links: {
      repo: 'https://github.com/F3KT0R/watchflix-2.0',
    },
  },
] as const satisfies readonly QuestInput[]

export type QuestSlug = (typeof questData)[number]['slug']

export const quests: Quest[] = z.array(questSchema).parse(questData)
