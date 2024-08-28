### 国际化翻译小助手

1. 使用说明：
2. 新项目首次使用需要安装依赖 `npm install node-fetch@2.7.0 -D`  node-fetch 依赖包不能使用过高版本，新版本默认不支持cjs 模块。
3. eg：先在 zh_CN/basic.json 中追加 { "aaa": "啊啊啊" }
4. 运行 `node index.js`， zh_TW/basic.json 和 en_US/basic.json 会自动生成{ "aaa": "aaa" }对应的翻译。

## 注： zh_TW/basic.json和 en_US/basic.json之中已经存在的key，会自动跳过。

## 注意： ！！！！！！！！！！！第一次执行的时候要复查一遍哪些做了改动，哪些没做改动，避免覆盖了没改动的key！！！！！！！！！！！
