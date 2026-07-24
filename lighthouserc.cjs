const auditedRoutes = ['/', '/gaming', '/science', '/fun', '/news', '/account']

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      isSinglePageApplication: true,
      numberOfRuns: 1,
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
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 5000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 800 }],
        'total-byte-weight': ['warn', { maxNumericValue: 4000000 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
}
