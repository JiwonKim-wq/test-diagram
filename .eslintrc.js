module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  ignorePatterns: ['apps/frontend/**/*'],
  overrides: [
    {
      files: ['apps/backend/**/*', 'packages/**/*'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
      ]
    }
  ]
}; 