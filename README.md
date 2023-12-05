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
};
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
};
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
};
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
};
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
};
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

[PostCSS](https://postcss.org/) 是一个用 JavaScript 编写的工具，它可以对 CSS 进行处理、转换和优化，如：

- 使用 autoprefixer 为写好的 css 属性自动添加浏览器前缀
- 为 css 添加变量、嵌套、函数等特性
- 使用一些 css 的新特性，同时为旧浏览器提供降级方案

首先，需要安装 postcss 提供 postcss 的核心支持，为了让 webpack 能够成功调用 postcss 还需要安装 [postcss-loader](https://github.com/webpack-contrib/postcss-loader#getting-started)：

```sh
pnpm install postcss postcss-loader -D
```

在 webpack 中添加对应的 loader:

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
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 添加 post-css loader
          // 注意：postcss 只能处理 css 代码，因此如果添加使用 saas、less 等 css 预处理器，postcss-loader 要放在对应的预处理器 loader 的前面
          'postcss-loader',
        ],
      },
    ],
  },
};
```

为了使 postcss 生效，还需要在项目的根目录下创建一个 `postcss.config.js` 文件：

```js
module.exports = {
  plugins: [
    // 添加你想使用的插件
  ],
};
```

`postcss-loader` 会自动读取这个文件，但是目前我们尚未配置任何插件，postcss 并不会正产工作。一般情况下，我们只需要引入 [postcss-preset-env](https://www.npmjs.com/package/postcss-preset-env) 即可，这个插件可以将现代 CSS 转换成大多数浏览器都能理解的内容，同时也可以根据目标浏览器或运行时环境添加所需的语法垫片。

首先，我们要安装这个插件：

```sh
pnpm install postcss-preset-env -D
```

然后向 `postcss.config.js` 中添加这个插件：

```js
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [postcssPresetEnv()],
};
```

默认的，`postcss-preset-env` 提供了缩进语法的特性，我们可以编写带缩进的 css 代码来判断 postcss 是否生效：

```css
.hello {
  background-color: pink;

  a {
    color: pink;
  }
}
```

执行 webpack 构建指令后，查看编译后的代码：

```css
.hello {
  background-color: pink;
}
.hello a {
  color: pink;
}
```

默认情况下，postcss-preset-env 会自动按照 browserslist 的默认兼容策略来编译 css，按照默认策略可以兼容 80% 以上的浏览器。

browserslist 是一个用于专门声明当前项目的目标浏览器的配置文件，如果我们要调整 postcss-preset-env 的默认兼容策略，就可以在项目根目录创建一个 `.browserslistrc` 的文件，并编写对应的配置，如下是一个提供更广泛兼容的配置，它兼容了全世界市场占用率大于 0.5% 的浏览器，并兼容所有主流浏览器（包括已经停止更新的）的最后两个版本：

```txt
> 0.5%, last 2 versions
```

使用了这个配置后你就会发现编译出的代码变得更大了，很多属性都被添加了 css 属性前缀，因为它需要兼容更多的浏览器。

> 你可以在 [browsersl.ist](https://browsersl.ist/#q=defaults) 网站上查看 browserslist 的配置规则

## 进阶：babel

[Babel](https://babeljs.io/) 与 PostCSS 类似，都是一种语言的编译器，PostCSS 负责处理 CSS 而 Babel 负责处理 JavaScript。通过使用 Babel，能够将高级版本的 JavaScript 代码转换为向后兼容的版本，以便能够在老版本的浏览器或环境中运行。

首先，我们要安装 [@babel/core](https://www.npmjs.com/package/@babel/core) 来提供 babel 的核心支持，同时还需要安装 [babel-loader](https://www.npmjs.com/package/babel-loader) 来让 webpack 能够调用 babel：

```sh
pnpm install @babel/core babel-loader -D
```

然后在 webpack 中添加对应的 loader:

```js
module.exports = {
  // webpack 其他配置
  module: {
    rules: [
      // ... 其他 loader ...
      // 处理 js 文件
      {
        test: /\.(?:js|mjs|cjs)$/, // 匹配 js、mjs、cjs 后缀的文件
        exclude: /node_modules/, // 从 node_modules 引入的 js 代码不需要 babel 参与编译（因为大多数包已经被编译好了）
        use: {
          loader: ['babel-loader'],
        },
      },
    ],
  },
};
```

为了使 babel 生效，与 PostCSS 类似的，我们需要一个 babel 的配置文件，在项目的根目录下创建一个 `babel.config.js` 文件：

```js
module.exports = {
  presets: [
    // 添加你想使用的预设
  ],
};
```

可以发现，Babel 的配置文件与 PostCSS 的配置文件是类似的，因为它们的工作原理都是本身提供一个核心库的支持，而具体的工作则需要对应的插件来完成，因此我们需要安装对应的插件。

在没有什么其他需求的情况下，我们可以安装 [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) 插件来提供一个较为全面的预设配置，改配置可以将现代 JavaScript 代码转换为向后兼容的版本，以便能够在老版本的浏览器或环境中运行。

首先我们安装该插件：

```sh
pnpm install @babel/preset-env -D
```

然后在 `babel.config.js` 中添加该插件：

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // preset config
      },
    ],
  ],
};
```

还记得在上一步我们编写的 browserslist 配置吗？`@babel/preset-env` 同样会根据它来生成对应目标的兼容代码。

当我们执行 webpack 编译指令后，可以发现编译出的代码中，箭头函数、const、let 等新特性都被转换成了 ES5 的代码。以 [可选链运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 为例子，原代码如下：

```js
const o = { a: 123 };
console.log(o?.a ?? 'nothing');
```

为了兼容大部分的浏览器，babel 将可选链操作符进行转换为三元运算符，得出编译后的代码为：

```js
console.log(null !== (n = null == a ? void 0 : a.a) && void 0 !== n ? n : 'nothing')
```
