export default {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3, // 为编译后的代码注入 core-js@3 的 polyfill
        useBuiltIns: 'usage', // 按需注入 polyfill
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
