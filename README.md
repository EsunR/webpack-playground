# 1. Get Ready

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

# 2. 概念

https://webpack.docschina.org/concepts/

# 3. 实践

- [1. 第一个 Webpack 应用](./docs/1.第一个Webpack应用.md)
- [2. 使用 Webpack 构建 TypeScript 开发环境](./docs/2.使用Webpack构建TypeScript开发环境.md)
- [3. 使用 Webpack 构建 Vue 开发环境](./docs/3.使用Webpack构建Vue开发环境.md)
