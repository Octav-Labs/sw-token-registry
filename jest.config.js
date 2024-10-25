// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    // Handle module aliases (if any) defined in tsconfig
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true, // Tell Jest to use ESM for TypeScript files
      },
    ],
  },
  testMatch: ['**/tests/**/*.test.ts', '**/src/**/*.test.ts'], // Where to find test files
};
