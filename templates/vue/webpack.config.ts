import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { VueLoaderPlugin } from 'vue-loader';
import { DefinePlugin, Configuration as WebpackConfiguration } from 'webpack';
import 'webpack-dev-server';

const isDev = process.env.NODE_ENV !== 'production';

const config: WebpackConfiguration = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
  entry: path.resolve(__dirname, './src/main.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    clean: true,
  },
  devServer: {
    port: 8080,
  },
  module: {
    rules: [
      // 加载样式
      {
        test: /\.css$/i,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      // 加载图像
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // 处理 js
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // 处理 ts
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: ['\\.vue$'],
            },
          },
        ],
      },
      // 处理 Vue
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
    }),
    new MiniCssExtractPlugin(),
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: isDev,
      __VUE_PROD_DEVTOOLS__: isDev,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.ts', '.tsx'],
  },
};

export default config;
