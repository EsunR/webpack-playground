# 0. Get Ready

本项目由 pnpm 管理，因此需要全局安装 pnpm：

```sh
npm install pnpm -g
```

然后在项目的根目录执行：

```sh
pnpm install
```

webpack 的模板都在 `templates` 目录下存放，如果你需要新增模板，则在该目录下新建一个文件夹，比如 `new-template` 然后 `cd` 到该目录，先初始化，再安装需要的依赖：

```sh
# cd 到新创建的目录
cd ./templates/new-template

# 初始化 pnpm
pnpm init

# 安装依赖
pnpm install webpack webpack-cli -D
```

# 1. 概念

https://webpack.docschina.org/concepts/

# 2. 第一个 Webpack 应用

对应代码：`/templates/html`

## 安装 webpack

```sh
# npm
npm install webpack webpack-cli -D

# pnpm（本项目）
pnpm install webpack webpack-cli -D
```

- webpack：webpack 的核心库，提供了 webpack 的核心打包功能
- webpack-cli：webpack 的命令行工具，提供了 webpack 的命令行功能，使得用户可以在命令行中运行 webpack

## 定义出入口

webpack 只需要配置一个入口和一个出口，就已经可以进行基础的打包了，通过以下两个配置可以定义：

- entry 代码入口
- output 配置编译产出

创建 `webpack.config.cjs` 文件：

```js
const path = require('path');

module.exports = {
  mode: 'production',
  // 入口
  entry: path.resolve(__dirname, './src/main.js'),
  output: {
    // 输出路径
    path: path.resolve(__dirname, './dist'),
    // 每次打包前清空 dist 目录
    clean: true,
  },
}
```

output.path 必须是绝对路径，因此会用到下面的方法来获取绝对路径：

- `path.resolve()` 方法会把一个路径或路径片段的序列解析为一个绝对路径
- `__dirname` 是 node.js 中的一个全局变量（仅 CommonJS 环境），它指向当前执行脚本所在的目录

因此，`path.resolve(__dirname, "./dist")` 代表的就是当前目录下的 dist 目录。

> 什么是相对路径：相对路径是相对于当前工作目录或者当前文件的路径来表示目标文件的位置。它以当前位置为基准，通过使用特定的路径规则来定位文件。相对路径往往使用相对于当前目录的文件路径，或者相对于当前文件所在目录的路径。例如，在当前目录下的文件A中使用相对路径”../fileB”来引用上级目录下的文件B，即表示A所在目录的上级目录。

> 什么是绝对路径：绝对路径是从文件系统的根目录开始的完整路径名称，它可以准确地定位文件或目录的位置。绝对路径描述的是文件或目录的完整路径，不论当前工作目录是什么，它总是可以指向相同的位置。例如，在UNIX系统上，绝对路径可能是”/usr/local/bin/fileA”，在Windows系统上可能是”C:\Program Files\fileA”。

在终端输入 webpack 指令进行构建：

```sh
# npm
npx webpack --config webpack.config.cjs

# pnpm（本项目）
pnpm exec webpack --config webpack.config.cjs
```

为了方便使用，我们将执行 webpack 构建的命令行指令写入到 package.json 的 script 中：

```json
{
  "scripts": {
    "build": "webpack --config webpack.config.cjs"
  }
}
```

这样就可以通过 `npm run build` (npm 管理) 或 `pnpm build` (pnpm 管理) 来执行 webpack 构建了。

## 处理 HTML

使用 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 插件：可以将 JS 引入到 HTML 中

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // webpack 其他配置
  plugins: [
    new HtmlWebpackPlugin({
      // 在这里可以填写插件配置，如模板位置、注入 css、js 的方式等
      // 文档：https://github.com/jantimon/html-webpack-plugin#options
      template: path.resolve(__dirname, './public/index.html'),
    }),
  ],
}
```

## 处理 CSS

loader: webpack 会将所有的资源都作为模块引入，但是引入相对应的资源必须有对应的 loader 才可以。

处理 css 必须使用以下两个 loader：

- css-loader：只负责编译 css 代码，让 import、require、@import、url 语法生效，成功引入 css 模块，但不负责让 css 生效
- style-loader：将 css-loader 的产出，注入到 html 里

添加样式处理的 Loader:

```js
module.exports = {
  // webpack 其他配置
  module: {
    rules: [
      // ... 其他 loader ...
      // 处理 css 文件
      {
        test: /\.css$/i,
        use: [
          // loader 的执行顺序是从后往前的，因此先执行 css-loader，再执行 style-loader
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
}
```

`style-loader` 会使用 js 将 css 代码注入到 html 里，如果想要将 css 代码单独抽离出来，可以使用 `mini-css-extract-plugin` 插件

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // webpack 其他配置
  module: {
    rules: [
      // ... 其他 loader ...
      // 处理 css 文件
      {
        test: /\.css$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    // 注意：mini-css-extract-plugin 还包含一个插件需要引入
    new MiniCssExtractPlugin(),
  ],
}
```

## 处理静态资源

webpack4 需要使用 file-loader 处理静态资源

但是 webpack5 内置了静态资源 loader，通过指定模块类型为 `asset/resource` 就可以让 webpack 自动使用静态资源 loader：

```js
module: {
  rules: [
    // ... 其他 loader ...
    // 处理静态资源
    {
      test: /\.(png|svg|jpg|jpeg|gif|mp3|mp4)$/i,
      type: 'asset/resource',
    }
  ],
},
```

## 路径别名

通过 `resolve.alias` 配置路径别名，让 webpack 识别：

```js
module.exports = {
  // webpack 其他配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}
```

但同时，还需要让 vscode 认识配置的路径别名，通过创建一个 `jsconfig.json` 文件来声明路径别名：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## devServer

https://webpack.docschina.org/configuration/dev-server/

安装完 `webpack-dev-server` 后，添加 dev 指令到 package.json

```json
{
  "scripts": {
    "dev": "webpack serve --config webpack.config.cjs",
    "build": "webpack --config webpack.config.cjs"
  }
}
```

在终端运行 `pnpm dev` 就可以启动 dev server 了。

## 进阶：post-css

## 进阶：babel
