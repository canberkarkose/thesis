import type { Config } from 'jest';

const config: Config = {
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  projects: [
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      testMatch: ['**/*.test.tsx', '**/*.test.ts'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', {
          diagnostics: false,
        }],
      },
    }
  ]
};

export default config;
