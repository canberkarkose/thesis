import type { Config } from 'jest';

const config: Config = {
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  projects: [
    {
      displayName: 'frontend',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      testMatch: ['**/*.test.tsx', '**/*.test.ts'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(react-syntax-highlighter|@mui)/)',
      ],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
      },
    }
  ]
};

export default config;
