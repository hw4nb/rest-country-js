module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['standard', 'prettier'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': ['error'],
  },
}
