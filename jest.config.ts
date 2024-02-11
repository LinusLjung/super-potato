import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/src/**/*.ts', '**/src/**/*.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '/dist/', '/build/'],
  coverageProvider: 'v8',
  projects: [
    '<rootDir>/src/api',
    '<rootDir>/src/savior',
    '<rootDir>/src/youtuber',
    '<rootDir>/src/fronter/server',
    '<rootDir>/src/packages/google-auth',
  ],
};

export default config;
