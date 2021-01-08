# 基于 electron, react 制作的小工具

- electron-version: 9.1.0
- node-version: 12.14.1
- chrome-version: 83.0.4103.122

# 打包 - windows

`yarn pack-win`

- 第一次打包需先运行项目, 生成 bindings.node 文件

- 目前打包存在缺陷, 详见:

  - Todo
    - serialport - 打包

# Todo

### serialport - 打包 - windows

- 使用 mode:production 构建的 index.js, 出现错误 "Cannot read property 'indexOf' of undefined"
  1. 已有相关 issue <https://github.com/serialport/node-serialport/issues/1789>
  2. 按照 issue 中的解决方案, 使用 `externals:{serialport: 'commonjs serialport'}` 解决问题, 但导致 app 依赖 node_modules, 打包体积过大
  3. 目前打包后手动删除 node_modules 中不需要的文件, 但总归是不科学的

### 热加载问题

```
修改 async 方法时, dev.js 亦会更新, 然而新代码并不起作用, 执行的仍是旧代码
去掉 @babel/preset-env 后 (取消 async to generate), 热加载可正常工作
猜测 async 并不是特例, 肯定是哪里设置有问题, 因为一些其它库也有 async-to-generate
```

# Done

### 加入 serialport 后的问题

- `NODE_MODULE_VERSION 不一致`

  - `npm rebuild`

- `Could not locate the bindings file. Tried: → F:\tools\build\bindings.node`
  1. `yarn build`
  2. 拷贝 node_modules/@serialport/... 下的 bindings.node

### 开发过程中代码报错, 导致整个应用崩溃

- 使用 `ErrorBoundary` 处理异常, 防止崩溃
