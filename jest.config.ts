import type { Config } from "jest";

const config: Config = {
  projects: [
    {
      displayName: "node",
      testEnvironment: "node",
      testMatch: ["**/__tests__/lib/**/*.test.ts", "**/__tests__/api/**/*.test.ts"],
      transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: { module: "commonjs" } }] },
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
    },
    {
      displayName: "jsdom",
      testEnvironment: "jsdom",
      testMatch: ["**/__tests__/components/**/*.test.tsx"],
      transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: { module: "commonjs", jsx: "react-jsx" } }] },
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
      setupFilesAfterEnv: ["@testing-library/jest-dom"],
    },
  ],
};

export default config;
