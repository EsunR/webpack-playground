module.exports = {
  root: true,
  plugins: ['html'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  ignorePatterns: ['node_modules', 'dist'],
};
