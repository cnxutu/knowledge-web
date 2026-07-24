# 后端开发者学习路线

这条路线围绕当前仓库学习，不要求先把整个前端生态学完。目标是：能启动项目、读懂一条请求/渲染链路、知道改动应该落在哪一层，并能独立完成小功能。

## 推荐顺序

1. JavaScript / TypeScript 模块、异步和类型。
2. pnpm workspace、Turborepo、Vite、Next.js 的启动和构建。
3. 先学 Vue 后台：它更接近后端熟悉的管理台、路由、表单和状态。
4. 再学 React + Next.js 前台：重点是 App Router、Server/Client Component 和文件路由。
5. 最后学习 MDX、provider 抽象、搜索、图谱和真实 API 接入。

每个阶段都建议“读一个文件 → 改一个小点 → 跑 typecheck/test”，不要只看教程。

## 第一阶段：语言和工程基础

### JavaScript / TypeScript

掌握 `import/export`、Promise、`async/await`、数组方法、对象展开、可选链、`type/interface`、泛型、类型收窄和模块边界。

项目入口：

- [共享类型](../../packages/shared/src/types/content.ts)
- [provider 接口](../../packages/shared/src/providers/content-provider.ts)
- [前台内容读取](../../apps/web/lib/content.ts)

官方资料：

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro)
- [TypeScript for Java/C# Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)

### 工程化和 Monorepo

重点理解：`package.json` scripts、workspace 包引用、路径别名、`tsconfig`、Turbo task 依赖、`dev/build/typecheck/test` 的区别。

项目入口：

- [根脚本](../../package.json)
- [workspace 定义](../../pnpm-workspace.yaml)
- [Turbo 任务](../../turbo.json)
- [共享 TS 配置](../../tsconfig.base.json)

官方资料：

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Handbook](https://turborepo.com/docs/handbook)
- [Vite Guide](https://vite.dev/guide/)

练习：新增一个 `packages/*` 小工具包，并让 `apps/web` 通过 workspace 依赖使用它；完成后删除或保留都可以，但要理解依赖方向。

## 第二阶段：Vue 后台线

先阅读这条链：

```text
apps/admin/src/main.ts
  → App.vue
  → router/index.ts
  → views/AdminLayout.vue
  → views/NavigationView.vue 等页面
  → composables/use-metadata-collection.ts
  → modules/admin-metadata-service.ts
  → modules/metadata-workspace.ts
  → LocalStorage / @knowledge/shared mock provider
```

重点掌握：Single-File Component、`script setup`、`ref/computed`、props/events、Pinia、Vue Router 守卫和 Element Plus。

项目入口：

- [Vue 启动入口](../../apps/admin/src/main.ts)
- [后台路由](../../apps/admin/src/router/index.ts)
- [认证 store](../../apps/admin/src/store/auth.ts)
- [后台布局](../../apps/admin/src/views/AdminLayout.vue)
- [通用集合 composable](../../apps/admin/src/composables/use-metadata-collection.ts)
- [后台数据服务](../../apps/admin/src/modules/admin-metadata-service.ts)
- [共享 Vue 组件](../../packages/ui-vue/src/AdminSection.vue)

官方资料：

- [Vue 3 Guide](https://vuejs.org/guide/introduction.html)
- [Vue Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Pinia Introduction](https://pinia.vuejs.org/introduction.html)
- [Vue Router Guide](https://router.vuejs.org/guide/)
- [Element Plus](https://element-plus.org/en-US/)

练习：给后台增加一个只读统计卡片。先在 shared 类型中定义数据，再在 service 中提供数据，最后在 view 中展示；不要直接在模板里写死业务数据。

## 第三阶段：React / Next.js 前台线

Next.js 使用 App Router，目录和文件本身就是路由结构：

```text
apps/web/app/layout.tsx
  → app/page.tsx
  → app/articles/[slug]/page.tsx
  → lib/content.ts
  → MDX + KnowledgeWorkspace.tsx
```

重点掌握：React props/state、hooks、Server Component 与 Client Component 的边界、`page.tsx`/`layout.tsx`、动态路由、`notFound()` 和客户端交互。

项目入口：

- [全局布局](../../apps/web/app/layout.tsx)
- [首页](../../apps/web/app/page.tsx)
- [文章动态路由](../../apps/web/app/articles/[slug]/page.tsx)
- [多栏阅读客户端组件](../../apps/web/app/KnowledgeWorkspace.tsx)
- [React 公共组件](../../packages/ui-react/src/knowledge-shell.tsx)
- [Workspace API 边界](../../apps/web/lib/workspace-api.ts)

官方资料：

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [React Learn](https://react.dev/learn)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)

练习：新增一个文章分类页。先在 `lib/content.ts` 暴露查询函数，再添加 `app/categories/[category]/page.tsx`，最后复用 `packages/ui-react` 组件。

## 第四阶段：内容模型和可替换能力

### MDX

阅读 [示例文章](../../apps/web/content/articles/security-login-overview.mdx) 和 [文章模板](../../templates/content-entry/article-template.mdx)，理解 frontmatter 如何映射到 `ArticleMeta`，正文为什么和元数据分开。

### Provider

阅读：

- [ContentProvider](../../packages/shared/src/providers/content-provider.ts)
- [SearchProvider](../../packages/shared/src/providers/search-provider.ts)
- [GraphProvider](../../packages/shared/src/providers/graph-provider.ts)
- [后台元数据 Provider](../../packages/shared/src/providers/admin-metadata-provider.ts)

把 provider 理解成后端里的 port/interface：页面依赖接口，mock、HTTP、ES 是不同 adapter。接入真实后端时，优先新增实现和 DTO，不要让页面直接 fetch 每个接口。

### 状态模型

阅读 [reading-panels.ts](../../packages/shared/src/state/reading-panels.ts)。它是纯函数状态变换，适合用单元测试验证“打开、聚焦、折叠、关闭”这些规则。

## 第五阶段：真实后端联调

建议按这个顺序替换当前 demo：

1. 在 `packages/api-contract` 定义请求、响应、分页和错误结构。
2. 在 `packages/shared/src/providers` 增加 API provider。
3. 后台把 `metadata-workspace` 的 LocalStorage 持久化替换成 service 调用。
4. 前台把 `lib/content.ts` 的本地 MDX 查询逐步替换成服务端内容 provider。
5. 搜索 provider 再替换为 ES 或后端搜索接口。
6. 最后补登录、权限、缓存、错误态和 loading 态。

后端开发者最需要特别留意：浏览器端代码不是可信边界；权限不能只靠路由守卫，接口必须在服务端校验；`NEXT_PUBLIC_*` 变量会暴露给浏览器，不应放密钥。

## 每次改动的检查清单

- 这是应用特有逻辑，还是共享领域能力？
- 是否应该先改 `shared` / `api-contract` 再改页面？
- 是否混淆了 Server Component 和 Client Component？
- 是否把持久化、请求或权限逻辑写进了纯展示组件？
- 是否补了对应的类型和测试？
- 执行 `pnpm typecheck`；测试脚本稳定后再执行 `pnpm test`。

当前仓库的 `pnpm typecheck` 已可通过；根 `pnpm test` 仍有测试发现配置问题，详见 [搭建与修改指南](../guide/README.md) 的验证章节。
