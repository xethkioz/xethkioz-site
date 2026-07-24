const auditedRoutes = ['/', '/gaming', '/science', '/fun', '/news', '/account']

const median = { aggregationMethod: 'median' }
const pessimistic = { aggregationMethod: 'pessimistic' }

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      isSinglePageApplication: true,
      numberOfRuns: 3,
      url: auditedRoutes.map((route) => `http://localhost${route}`),
      settings: {
        preset: 'desktop',
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
        maxWaitForLoad: 60000,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: ['uses-http2'],
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            'categories:performance': ['error', { minScore: 0.85, ...median }],
            'categories:accessibility': ['error', { minScore: 1, ...pessimistic }],
            'categories:best-practices': ['error', { minScore: 1, ...pessimistic }],
            'first-contentful-paint': ['error', { maxNumericValue: 1800, ...median }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2500, ...median }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, ...pessimistic }],
            'total-blocking-time': ['error', { maxNumericValue: 300, ...pessimistic }],
            'total-byte-weight': ['error', { maxNumericValue: 3200000, ...pessimistic }],
          },
        },
        {
          matchingUrlPattern: '^http://localhost(?::\\d+)?/(?:$|gaming(?:[/?#].*)?|science(?:[/?#].*)?|fun(?:[/?#].*)?|news(?:[/?#].*)?)$',
          assertions: {
            'categories:seo': ['error', { minScore: 1, ...pessimistic }],
          },
        },
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
}
