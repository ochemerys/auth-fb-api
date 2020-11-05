module.exports = {
  transform: {
      "^.+\\.tsx?$": "ts-jest",
      "\\.(css|less|scss)$": "./jest-stub-transformer.js",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testPathIgnorePatterns: ["/lib/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts, tsx, js, jsx}",
    // exclude typings and wrappers from code coverage
    "!src/@*/**/*.{ts, tsx, js, jsx}",
    "!src/config/**/*.{ts, tsx, js, jsx}",
  ],
};