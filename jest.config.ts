import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@pages/(.*)$': '<rootDir>/src/app/pages/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@layout/(.*)$': '<rootDir>/src/app/layout/$1',
    '^@envs/(.*)$': '<rootDir>/src/environments/$1',
    '^assets/i18n/en.json$': '<rootDir>/src/assets/i18n/en.json',
    '^assets/i18n/es.json$': '<rootDir>/src/assets/i18n/es.json',
  },
};

export default config;
