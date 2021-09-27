module.exports= {
    setupFiles: [
        '<rootDir>/src/test/setup-jest.js'
    ],
    setupFilesAfterEnv: [
        'jest-allure/dist/setup'
    ],
    moduleFileExtensions: [
        'ts', 'tsx', 'js', 'jsx', 'json', 'node'
    ],
    transform: {
        '^.+\\.[jt]sx?$': 'ts-jest'
    },
    testMatch: [
        '**/src/**/*.(spec|test|feature).ts?(x)'
    ],
    moduleNameMapper: {
        '\\.(css)$': '<rootDir>/src/test/style-file-mock.js'
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
            babelConfig: false,
            diagnostics: false,
            isolatedModules: true
        }
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}'
    ],
    coverageReporters: [
        'text-summary',
        'html'
    ],
    coveragePathIgnorePatterns: [
        '.*\\.spec\\.[jt]s',
        'src/test'
    ]
};