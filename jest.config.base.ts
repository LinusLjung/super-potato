import { JestConfigWithTsJest } from 'ts-jest';
import rootConfig from './jest.config';

const { coverageDirectory, coveragePathIgnorePatterns } = rootConfig;

const config: JestConfigWithTsJest = {
  clearMocks: true,
  coverageDirectory,
  coveragePathIgnorePatterns,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/dist/'],
};

export default config;
