module.exports = {
  name: 'int-test-example',
  displayName: 'int-test-example',
  rootDir: './',
  testEnvironment: 'node',
  modulePaths: [
    'src',
    '/node_modules/',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverageFrom: [
    'src/**/*.js',
  ],
  testRegex: './tests/unit/.*.js$',
};
