// Editor-time CSS guards. Colour ownership is enforced structurally by
// scripts/check-color-tokens.mjs, which also catches rgb()/hsl() literals.
const stylelintConfig = {
  rules: {
    // Raw colours belong to the primitive palette in tokens.css only.
    'color-no-hex': true,
    'color-named': 'never',
    'declaration-no-important': true,
    'no-duplicate-selectors': true,
    'selector-max-id': 0,
    // CSS Modules: a component styles its own classes, not other components' internals.
    'selector-max-specificity': '0,3,0',
    'selector-max-compound-selectors': 3,
    // Motion must be opt-out-able: durations come from tokens that collapse under reduced motion.
    'declaration-property-value-disallowed-list': {
      transition: ['/\\d+m?s/'],
      'transition-duration': ['/\\d+m?s/'],
      'animation-duration': ['/\\d+m?s/'],
    },
  },
  overrides: [
    {
      files: ['src/styles/tokens.css'],
      rules: { 'color-no-hex': null, 'declaration-property-value-disallowed-list': null },
    },
  ],
}

export default stylelintConfig
