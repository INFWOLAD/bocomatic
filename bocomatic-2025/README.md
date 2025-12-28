# Bocomatic

- Bocomatic的chrome插件主框架

### 主要架构

- 主体：Vite + Vue3
- 组件库： antdv4
- 打包相关：vite-bundle-analyzer包分析 + fs-extra做manifest整合/index整理(-D) + unplugin-vue-components按需打包
- 其它： less + Prettier + eslint-config-prettier样式整理 / chrome-types chrome插件引入

### popup

- 作为唯一vue入口，最终生成插件popup页面，通过chrome.storage存储相关状态，不直接发送message到content/background
- 基于popup用途考量，未引入router/pinia/tsx等，仅作为单一页面单一组件方式运行
- 对antdv的tabs样式做了部分覆盖，同时已引入按需加载，无需额外import/挂载

### scripts

- content下ts会打包到最终的scripts中，如需增加先配置vite.config.ts增加入口，同时修改manifest.json做对应match和content匹配
- 未设置检查试图，如需增加额外增加background即可
- 该仓库仅保留template.ts，其核心逻辑因涉及内部逻辑，不作上传。template中保留了首次运行和总开关的读取逻辑，可以自行拓展

### 其他相关

- fs-extra 仅仅引入作为打包时dist目录的整理，如需其他地方使用以替代fs，需切换到dependencies。
- 请以工作区方式打开
- vue主入口已设置为popup的main.ts，本地启动前注释chrome.xxx相关以调试

### 相关指令

```js
// 项目初始化
npm install
// 本地调试(已配置主入口，直接运行即可)
npm run dev
// 打包
npm run build
```
