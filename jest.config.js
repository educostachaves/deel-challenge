module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  reporters: ['default'],
  testEnvironment: 'node',
  testMatch: ['**/*.spec.js', '**/*.test.js'],
  verbose: true,
  transformIgnorePatterns: ['<rootDir>/(build|config|dist|node_modules|docker)/'],
  moduleFileExtensions: ['js', 'json'],
  moduleDirectories: ['node_modules'],
};
