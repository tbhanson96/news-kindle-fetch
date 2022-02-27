import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    
    // Matches any string with a .ts extension
    transform: { '^.+\\.ts$': 'ts-jest' },
    
    // Matches /test/<anystring>.test.ts
    testRegex: '/test/.*\\.test\\.ts$',
    moduleFileExtensions: ['ts', 'js'],
    
    // Coverage setup.
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text-summary', 'text', 'cobertura'],
};

export default config;