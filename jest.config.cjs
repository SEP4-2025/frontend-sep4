/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svg$': 'jest-transform-stub',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.svg$': 'jest-transform-stub',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
