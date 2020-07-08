module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/scripts/setupTests.js'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx}'],
  testEnvironment: 'jsdom',
  testRunner: require.resolve('jest-circus/runner'),
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  resetMocks: true,
};
