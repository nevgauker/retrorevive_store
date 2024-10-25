// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    testEnvironment: "node",
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1", // Map @/ to the root directory
    },
};

module.exports = createJestConfig(customJestConfig);
