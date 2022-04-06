import path from 'path';
import { InitialOptionsTsJest } from 'ts-jest';
import rootConfig from './jest.config';

const { collectCoverage, coverageDirectory, coveragePathIgnorePatterns, coverageProvider } = rootConfig;

const config: InitialOptionsTsJest = {
  clearMocks: true,
  collectCoverage,
  coverageDirectory,
  coveragePathIgnorePatterns,
  coverageProvider,
  preset: 'ts-jest',
  resolver: path.resolve(__dirname, './jest/resolver.js'),
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
};

export default config;
