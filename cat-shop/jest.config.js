module.exports= {
    setupFiles: [
        '<rootDir>/src/test/setup-jest.js'
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
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
            babelConfig: false,
            diagnostics: false,
            isolatedModules: true
        }
    }
};