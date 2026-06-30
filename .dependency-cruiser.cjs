/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* L1: src/types/ must not import from other src/ layers */
    {
      name: 'no-types-imports',
      severity: 'error',
      from: { path: '^src/types/' },
      to: { path: '^src/(builder|ui|services|store|queries|actions|hooks|router|pages)/' },
    },

    /* L2: src/utils/ must not import from higher layers */
    {
      name: 'no-utils-to-high',
      severity: 'error',
      from: { path: '^src/utils/' },
      to: { path: '^src/(services|queries|store|actions|hooks|ui|builder|router|pages)/' },
    },

    /* L4: src/services/ must not import from store/ or queries/ */
    {
      name: 'no-service-to-store',
      severity: 'error',
      from: { path: '^src/services/' },
      to: { path: '^src/(queries|store)/' },
    },

    /* L9: src/ui/ must not import from src/builder/ */
    {
      name: 'no-ui-to-builder',
      severity: 'error',
      from: { path: '^src/ui/' },
      to: { path: '^src/builder/' },
    },

    /* L11: Non-builder pages must not import from builder */
    {
      name: 'no-pages-to-builder',
      severity: 'error',
      from: { path: '^src/(pages|router)/' },
      to: { path: '^src/builder/' },
    },

    /* L3: src/mock/ must only import from src/types/ and src/utils/ */
    {
      name: 'mock-limited-imports',
      severity: 'error',
      from: { path: '^src/mock/' },
      to: {
        path: '^src/',
        pathNot: '^src/(types|utils)/',
      },
    },
  ],

  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: '(node_modules|__tests__|\\.test\\.)',
    },
    includeOnly: '^src/',
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};
