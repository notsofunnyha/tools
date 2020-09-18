* 热加载遗留问题: 修改async方法时, dev.js亦会更新, 然而新代码并不起作用, 执行的仍是旧代码, 发现去掉@babel/preset-env后 (取消 async to generate), 热加载可正常工作, 猜测async并不是特例, 肯定是哪里设置有问题, 因为一些其它库也有async-to-generate; @ 暂时不明白具体是啥原因, 搜索也没相关结果, 先放一放 

* 加入 serialport 后的问题
    * Error: `NODE_MODULE_VERSION 不一致`
    * 解决: npm rebuild 
    * 
    * Error: `Could not locate the bindings file. Tried: → F:\tools\build\bindings.node`
    * 解决: 拷贝 node_modules/@serialport/... 下的 bindings.node