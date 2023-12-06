module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // preset config
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
