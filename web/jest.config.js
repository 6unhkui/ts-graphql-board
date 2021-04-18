module.exports = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1",
        "styles/(.*)": "<rootDir>/src/styles/$1",
        "components/(.*)": "<rootDir>/src/components/$1"
    }
};
