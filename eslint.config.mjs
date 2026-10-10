import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'

// Editor-time hints for the layer rules. The authoritative check is
// scripts/check-architecture.mjs (part of `npm run lint`), which also sees
// relative imports and cross-feature deep imports.
const layerRestriction = (patterns) => ['error', { patterns }]

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/no-cycle': 'error',
      'import/no-default-export': 'error',
    },
  },
  {
    // Next.js and tool configs require default exports.
    files: ['src/app/**/*.{ts,tsx}', '*.config.{ts,mjs}'],
    rules: { 'import/no-default-export': 'off' },
  },
  {
    files: ['src/lib/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': layerRestriction([
        {
          group: ['@/*', '!@/lib/*'],
          message: 'lib/ is the bottom layer: it imports nothing else.',
        },
      ]),
    },
  },
  {
    files: ['src/content/**/*.ts'],
    rules: {
      'no-restricted-imports': layerRestriction([
        { group: ['react', 'react-dom', 'next', 'next/*'], message: 'content/ is data only.' },
        {
          group: ['@/ui/*', '@/features/*', '@/game/*', '@/app/*'],
          message: 'content/ may import lib/ only.',
        },
      ]),
    },
  },
  {
    files: ['src/game/**/*.ts'],
    rules: {
      'no-restricted-imports': layerRestriction([
        { group: ['react', 'react-dom', 'next', 'next/*'], message: 'game/ is the pure engine.' },
        {
          group: ['@/ui/*', '@/features/*', '@/app/*'],
          message: 'game/ may import lib/ and content/ only.',
        },
      ]),
    },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': layerRestriction([
        {
          group: ['@/features/*', '@/content/*', '@/game/*', '@/app/*'],
          message: 'ui/ primitives know nothing about the domain.',
        },
      ]),
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': layerRestriction([
        {
          group: ['@/features/*/*'],
          message: 'Import a feature through its public index: @/features/<name>.',
        },
      ]),
    },
  },
  {
    // The console greeting talks to the devtools console on purpose; scripts report to the terminal.
    files: ['src/features/easter-eggs/**/*.{ts,tsx}', 'scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
  prettierConfig,
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**']),
])
