# knowledge-web

前端知识库 Monorepo，对齐项目A中“共享父层 + 模板层 + 业务应用”的组织方式。

## 目录结构

- `apps/admin`：后台知识管理控制台，技术栈为 Vue 3 + Vite + TypeScript + Element Plus。
- `apps/web`：前台知识库内容站，技术栈为 Next.js + TypeScript + MDX。
- `packages/shared`：跨端共享类型、provider、状态模型与 mock 数据。
- `packages/api-contract`：前后端接口约定与 DTO。
- `packages/ui-react`：前台 React 通用组件。
- `packages/ui-vue`：后台 Vue 通用组件。
- `templates`：后台应用模板、内容应用模板、内容条目模板。
- `docs/architecture`：工程和内容建模说明。
- `legacy`：保留早期 demo，供迁移参考。

## 快速开始

1. 使用 `pnpm install` 安装依赖。
2. 使用 `pnpm dev` 启动前后台开发环境。
3. 使用 `pnpm test`、`pnpm lint`、`pnpm typecheck` 做基础验证。

