# knowledge-web

前端知识库 Monorepo，对齐项目A中“共享父层 + 模板层 + 业务应用”的组织方式。

## 仓库目标

这个仓库不是单纯的“前台页面工程”，而是一个面向个人知识库产品的前端工作区：

- `apps/admin` 承载后台知识管理控制台
- `apps/web` 承载前台知识内容站
- `packages/*` 承载共享父层能力
- `templates/*` 承载后续扩展模板

整体思路对齐项目A：

- `packages/*` 对应前端版 `knowledge-parent`
- `templates/*` 对应前端版 `knowledge-template`
- `apps/*` 对应实际运行应用

## 目录结构总览

- `apps/admin`：后台知识管理控制台，技术栈为 Vue 3 + Vite + TypeScript + Element Plus。
- `apps/web`：前台知识库内容站，技术栈为 Next.js + TypeScript + MDX。
- `packages/shared`：跨端共享类型、provider、状态模型与 mock 数据。
- `packages/api-contract`：前后端接口约定与 DTO。
- `packages/ui-react`：前台 React 通用组件。
- `packages/ui-vue`：后台 Vue 通用组件。
- `templates`：后台应用模板、内容应用模板、内容条目模板。
- `docs/architecture`：工程和内容建模说明。
- `docs/learning`：学习目录，帮助后端视角理解前端项目涉及的知识点。
- `docs/guide`：搭建、启动、打包、扩展与修改思路指南。
- `legacy`：保留早期 demo，供迁移参考。

## 环境要求

- Node.js `24.x`
- pnpm `11.x`
- Git

建议先保证本机 `node` 和 `pnpm` 都可直接使用。

## 安装依赖

在仓库根目录执行：

```powershell
pnpm install
```

## 启动方式

### 启动后台

```powershell
pnpm dev:admin
```

或：

```powershell
cd apps/admin
pnpm dev
```

### 启动前台

```powershell
pnpm dev:web
```

或：

```powershell
cd apps/web
pnpm dev
```

### 同时启动前后台

```powershell
pnpm dev
```

如果你本地只想调某一侧，更推荐分别启动 `dev:admin` 或 `dev:web`。

如果根脚本报 `Cannot find module ... node_modules\\pnpm\\bin\\pnpm.cjs`，说明之前的脚本路径已经过时；当前版本已经改成直接调用本地 `vite` / `next` 二进制，不再依赖 `pnpm.cjs` 或 `turbo --filter` 的二次发现逻辑。

### Knowledge Workspace

前台每日工作区位于 `/workspace`，通过 `NEXT_PUBLIC_KNOWLEDGE_WORKSPACE_API_URL` 指向后端 Workspace 服务；未配置时默认请求 `http://localhost:8091/api/workspace`。编辑中的当天草稿会保存到浏览器 LocalStorage，发布后由后端写入配置的 Obsidian Vault。

知识文章录入位于 `/workspace/articles/new`，文章以 `knowledge-article` 类型保存，包含标题、稳定 Slug、摘要、标签、概念、分类路径、相关文章和 Markdown 正文；发布后写入 Vault 的 `知识沉淀/{slug}.md` 与 `.knowledge-hub/articles/{slug}.json`。

## 打包与验证

```powershell
pnpm test
pnpm typecheck
pnpm build
```

分别打包：

```powershell
pnpm build:admin
pnpm build:web
```

## 代码应该放哪里

### 后台页面、路由、后台交互

放到：

- `apps/admin`

### 前台页面、文章展示、多栏阅读

放到：

- `apps/web`

### 前后台共享类型、provider、通用状态模型

放到：

- `packages/shared`
- `packages/api-contract`

### 可复用 Vue 后台组件

放到：

- `packages/ui-vue`

### 可复用 React 前台组件

放到：

- `packages/ui-react`

### 新文章、新专题、新应用的模板

放到：

- `templates`

## 推荐阅读顺序

1. [docs/architecture/overview.md](D:/workspace/github/knowledge-web/docs/architecture/overview.md)
2. [docs/guide/README.md](D:/workspace/github/knowledge-web/docs/guide/README.md)
3. [docs/learning/README.md](D:/workspace/github/knowledge-web/docs/learning/README.md)

## 补充说明

- 当前后台首期主要管理导航、关系、专题和搜索配置，不做重 CMS。
- 当前前台首期以 Repo 内 MDX 为内容源。
- 搜索和图谱已经预留 provider 抽象，后续可逐步替换成真实后端能力。
