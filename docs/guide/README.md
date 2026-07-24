# 项目B搭建与修改指南

这份文档回答 4 个问题：

1. 这个项目怎么搭起来
2. 前后台分别怎么启动
3. 打包和验证怎么做
4. 后续新增或修改功能时，代码应该放哪里

## 1. 项目定位

`knowledge-web` 是一个前端 Monorepo：

- `apps/admin`：后台知识管理控制台
- `apps/web`：前台知识库内容站
- `packages/*`：共享父层，沉淀类型、组件、provider、约定
- `templates/*`：模板层，沉淀后续扩展时的标准骨架

可以把它理解成前端版：

- `packages/*` ≈ 项目A里的 `knowledge-parent`
- `templates/*` ≈ 项目A里的 `knowledge-template`
- `apps/*` ≈ 实际业务应用

## 2. 环境准备

建议环境：

- Node.js `24.x`
- pnpm `11.x`
- Git
- 推荐编辑器：VS Code

当前仓库已经补了：

- [pnpm-workspace.yaml](D:/workspace/github/knowledge-web/pnpm-workspace.yaml)
- [turbo.json](D:/workspace/github/knowledge-web/turbo.json)
- [tsconfig.base.json](D:/workspace/github/knowledge-web/tsconfig.base.json)
- [package.json](D:/workspace/github/knowledge-web/package.json)

## 3. 安装依赖

在仓库根目录执行：

```powershell
pnpm install
```

如果你机器上第一次装依赖，`pnpm` 可能提示某些 build scripts 被忽略。当前项目已经验证过可正常 `build`，可以先继续使用；后续如果你引入依赖了额外的原生构建能力，再按需处理。

## 4. 启动方式

### 4.1 启动后台

在根目录执行：

```powershell
pnpm dev:admin
```

或者直接进入后台应用目录执行：

```powershell
cd apps/admin
pnpm dev
```

后台默认是 Vite 本地开发模式，主要用于知识元数据管理界面。

### 4.2 启动前台

在根目录执行：

```powershell
pnpm dev:web
```

或者直接进入前台应用目录执行：

```powershell
cd apps/web
pnpm dev
```

前台默认是 Next.js 开发模式，主要用于知识文章展示、多栏阅读和搜索入口。

### 4.3 同时开发前后台

理论上可以在根目录执行：

```powershell
pnpm dev
```

如果你的本地 `turbo` / `pnpm` 环境比较稳定，这个方式最方便。

如果你只是先调一侧功能，更推荐分别启动：

- `pnpm dev:admin`
- `pnpm dev:web`

如果你看到类似 `Cannot find module ... node_modules\\pnpm\\bin\\pnpm.cjs` 的报错，先回到仓库根目录更新依赖并确认已使用当前仓库里的脚本定义；当前根脚本已经改成直接调用本地 `vite` / `next` 二进制，不再依赖手写的 `pnpm.cjs` 路径。

## 5. 打包与基础验证

### 根目录常用命令

```powershell
pnpm test
pnpm typecheck
pnpm build
```

### 分应用打包

```powershell
pnpm build:admin
pnpm build:web
```

### 当前验证重点

- `test`：主要验证共享层逻辑；当前根命令仍会因 Vitest include 路径与 package cwd 不一致而失败，修复后再把它作为稳定门禁
- `typecheck`：保证前后台和共享类型链路一致
- `build`：保证前后台都能产出可构建结果

当前已知验证问题：`packages/shared/vitest.config.ts` 使用包目录执行时应采用包内相对路径。若看到 `No test files found`，先确认 include 已为 `src/__tests__/**/*.test.ts`；另外 admin/web 的 test script 目前仍是占位实现。

## 6. 目录应该怎么理解

### `apps/admin`

这里放后台业务应用代码。

适合放：

- 登录页、管理台布局
- 列表页、配置页、关系管理页
- 后台路由、后台 store、后台页面级请求逻辑

不适合放：

- 可复用的通用组件
- 跨端共享类型
- 前台也会复用的 provider

### `apps/web`

这里放前台知识库产品代码。

适合放：

- 首页、文章页、搜索页、分类页
- 前台内容读取逻辑
- 多栏阅读器页面组织
- 只属于前台的页面交互

不适合放：

- 共享类型定义
- 后台也要复用的通用模型

### `packages/shared`

这里是最重要的共享父层。

适合放：

- `ArticleMeta`、`RelationEdge` 这类共享类型
- 内容 provider、搜索 provider、graph provider
- 阅读栏状态模型
- mock 数据与通用工具

什么时候优先改这里：

- 一个字段前后台都要认识
- 一个模型前台和后台都要消费
- 一个逻辑不应该在两个应用里各写一份

### `packages/api-contract`

这里放前后端边界约定。

适合放：

- DTO
- 查询参数类型
- 管理端 / 前台消费接口约定

### `packages/ui-react`

这里放前台 React 可复用组件。

适合放：

- 内容壳子组件
- 搜索结果列表
- 关联关系卡片
- 后续的图谱展示组件

### `packages/ui-vue`

这里放后台 Vue 可复用组件。

适合放：

- 管理页 section
- 统计卡片
- 列表工具栏
- 表单骨架组件

### `templates`

这里不是运行时代码，而是“后续新增内容时的标准参考”。

适合放：

- 新后台应用模板
- 新内容应用模板
- 新文章 / 新专题模板

## 7. 后续改代码时的思路框架

建议每次改动都先判断“这次是改应用，还是改共享层”。

### 场景 1：新增一篇文章

优先放：

- `apps/web/content/articles/*.mdx`

如果发现还缺标准 frontmatter，再补：

- `templates/content-entry`

### 场景 2：新增一个后台管理页面

优先放：

- `apps/admin/src/views`
- `apps/admin/src/router`

如果页面里有可复用卡片或壳子，再抽到：

- `packages/ui-vue`

### 场景 3：前后台都要认识的新字段

优先改：

- `packages/shared/src/types`
- `packages/api-contract/src`

如果只是页面展示，不要直接先改某个页面临时硬编码。

### 场景 4：新增搜索或图谱能力

优先改：

- `packages/shared/src/providers`
- `packages/shared/src/types`

然后再改：

- `apps/web`

这样能保持“先稳定边界，再改表现层”。

### 场景 5：新增通用组件

React 前台组件放：

- `packages/ui-react`

Vue 后台组件放：

- `packages/ui-vue`

不要把“以后别的页面也能复用”的组件直接塞进某个页面目录。

## 8. 推荐开发顺序

如果你接下来要继续完善项目，推荐按这个顺序：

1. 先补后台目录管理、关系管理的可编辑能力
2. 再补前台分类页、概念页、专题页
3. 再补多栏阅读的宽度调整和聚焦模式
4. 再补真实后端接口接入
5. 最后再补 ES 搜索和图谱可视化

这样能避免一开始就陷进高复杂度功能里。

## 9. 你作为后端开发者的建议实践方式

推荐用“学一点，改一点”的方式，而不是先把前端资料看一大堆。

建议节奏：

1. 跑起来后台和前台
2. 先读 `packages/shared`
3. 自己改一篇文章
4. 自己加一个后台卡片或列表列
5. 再尝试补一个前台页面块

这样最容易建立整体感。
