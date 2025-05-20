export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest', 
  },
  transformIgnorePatterns: [
    '/node_modules/(?!your-module-to-transform|another-module)/',
  ],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/fileMock.js',
  },
};
