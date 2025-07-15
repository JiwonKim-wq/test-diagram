const { createJestConfig } = require('react-scripts/scripts/utils/createJestConfig');
const path = require('path');

const config = createJestConfig(
  filePath => path.posix.join('<rootDir>', 'src', filePath),
  path.resolve(__dirname),
  false
);

// 추가 설정
config.setupFilesAfterEnv = ['<rootDir>/src/setupTests.ts'];
config.testEnvironment = 'jsdom';
config.moduleNameMapping = {
  ...config.moduleNameMapping,
  '^@diagram/(.*)$': '<rootDir>/../../packages/$1/src'
};

module.exports = config; 