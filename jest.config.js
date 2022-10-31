/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\.(.*)\.js$': '.$1',
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
};

export default config;
