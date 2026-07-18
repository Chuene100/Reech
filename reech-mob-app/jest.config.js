module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', "./unit-tests/jestSetup.js"],
    setupFiles: ["./unit-tests/jestSetup.js"],
    automock: false,
};
