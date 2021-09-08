import config from '../../jest.config.base';

export default {
  ...config,
  resolver: '<rootDir>/jest/resolver.js',
  roots: ['<rootDir>/src', '<rootDir>/jest'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.[jt]s?(x)'],
};
