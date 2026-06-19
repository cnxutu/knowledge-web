# 项目B学习目录

这份目录不是“把前端全学完”，而是围绕 `knowledge-web` 这个仓库，帮你作为后端开发者建立一条够用、可落地、能边做边学的路线。

目标只有两个：

1. 让你看得懂当前项目在做什么
2. 让你知道下一步改功能时应该先补哪块知识

## 学习顺序建议

推荐按下面的顺序推进，不要一开始就钻进 UI 细节或框架源码：

1. 先补 JavaScript / TypeScript 基础
2. 再理解前端工程化和 Monorepo
3. 再看 Vue 后台这条线
4. 再看 React / Next.js 前台这条线
5. 最后再进入搜索、图谱、多栏阅读这些产品能力

## 第一层：必学基础

这部分建议优先补，不然你后面会经常“代码能看懂一半，但不敢改”。

### 1. JavaScript / TypeScript 基础

你至少需要掌握这些概念：

- `import / export`
- `async / await`
- 数组常用方法：`map`、`filter`、`find`、`flatMap`
- 对象展开：`...obj`
- 可选链：`?.`
- 类型定义：`type`、`interface`
- 泛型的基本用途
- 函数参数、返回值类型标注

在本项目里对应的位置：

- [packages/shared/src/types/content.ts](D:/workspace/github/knowledge-web/packages/shared/src/types/content.ts)
- [packages/shared/src/providers/content-provider.ts](D:/workspace/github/knowledge-web/packages/shared/src/providers/content-provider.ts)
- [apps/web/lib/content.ts](D:/workspace/github/knowledge-web/apps/web/lib/content.ts)

你学到什么程度算够：

- 能看懂共享类型定义
- 能看懂 provider 怎么返回数据
- 能自己补一个字段，并让调用方跟着改通

### 2. 前端工程化基础

这部分是“前端项目为什么能跑起来”的底层认知。

你需要理解：

- `package.json` 是什么
- `scripts` 是怎么执行的
- `pnpm workspace` 是什么
- Monorepo 为什么有 `apps/*` 和 `packages/*`
- `tsconfig` / 路径别名是干什么的
- `build`、`dev`、`typecheck`、`test` 分别验证什么

在本项目里对应的位置：

- [package.json](D:/workspace/github/knowledge-web/package.json)
- [pnpm-workspace.yaml](D:/workspace/github/knowledge-web/pnpm-workspace.yaml)
- [turbo.json](D:/workspace/github/knowledge-web/turbo.json)
- [tsconfig.base.json](D:/workspace/github/knowledge-web/tsconfig.base.json)

你学到什么程度算够：

- 知道前台和后台为什么能共用 `packages/shared`
- 知道新增一个包时为什么要挂到 `packages/*`
- 知道根脚本和子应用脚本分别负责什么

## 第二层：与当前项目直接相关的前端知识

### 3. Vue 3 后台线

后台是给你最容易上手的一条线，因为它更接近传统“管理系统”思维。

建议先掌握：

- `Vue` 组件是什么
- `template / script setup / style` 三段结构
- `ref` 和响应式数据
- `Pinia` 做什么
- `Vue Router` 做什么
- 登录态、路由守卫的基本流程
- Element Plus 作为后台组件库如何使用

优先看这些文件：

- [apps/admin/src/views/LoginView.vue](D:/workspace/github/knowledge-web/apps/admin/src/views/LoginView.vue)
- [apps/admin/src/views/AdminLayout.vue](D:/workspace/github/knowledge-web/apps/admin/src/views/AdminLayout.vue)
- [apps/admin/src/router/index.ts](D:/workspace/github/knowledge-web/apps/admin/src/router/index.ts)
- [apps/admin/src/store/auth.ts](D:/workspace/github/knowledge-web/apps/admin/src/store/auth.ts)
- [packages/ui-vue/src/AdminSection.vue](D:/workspace/github/knowledge-web/packages/ui-vue/src/AdminSection.vue)

建议你先从后台入手的原因：

- 页面结构更稳定
- 状态流更直白
- 更接近后端同学熟悉的“列表页 / 表单页 / 配置页”模式

### 4. React / Next.js 前台线

前台是这个项目真正的产品主入口，但理解门槛会比后台高一点。

建议重点掌握：

- React 组件和 `props`
- `useState`
- Server Component 和 Client Component 的区别
- Next.js App Router 的目录式路由
- `page.tsx`、`layout.tsx` 的作用
- 为什么内容站适合 `Next.js + MDX`
- Zustand / TanStack Query 在这里分别解决什么问题

优先看这些文件：

- [apps/web/app/page.tsx](D:/workspace/github/knowledge-web/apps/web/app/page.tsx)
- [apps/web/app/articles/[slug]/page.tsx](D:/workspace/github/knowledge-web/apps/web/app/articles/[slug]/page.tsx)
- [apps/web/app/KnowledgeWorkspace.tsx](D:/workspace/github/knowledge-web/apps/web/app/KnowledgeWorkspace.tsx)
- [apps/web/lib/content.ts](D:/workspace/github/knowledge-web/apps/web/lib/content.ts)
- [packages/ui-react/src/knowledge-shell.tsx](D:/workspace/github/knowledge-web/packages/ui-react/src/knowledge-shell.tsx)

你学到什么程度算够：

- 能看懂一篇文章是怎么从 `MDX` 被读取、解析、展示出来的
- 能看懂“主栏 + 右侧关联栏”是怎么组织状态的
- 能自己加一条文章路由或一个简单的页面块

## 第三层：项目能力相关知识

### 5. MDX / 内容建模

这个项目首期是“Repo 内内容源”，所以 MDX 很重要。

你需要理解：

- frontmatter 是什么
- 一篇文章的元数据和正文为什么分开
- 为什么 `categoryPath`、`relatedArticles`、`concepts` 要前置建模

优先看：

- [apps/web/content/articles/security-login-overview.mdx](D:/workspace/github/knowledge-web/apps/web/content/articles/security-login-overview.mdx)
- [templates/content-entry/article-template.mdx](D:/workspace/github/knowledge-web/templates/content-entry/article-template.mdx)

### 6. Provider 思维

这个项目有意把“内容读取、搜索、关系图、后台元数据”先做成 provider 抽象。

你需要理解：

- 为什么先不直接写死 ES
- 为什么 mock provider 对首期很重要
- 为什么这能让前端先跑起来，再逐步替换真实后端能力

优先看：

- [packages/shared/src/providers/content-provider.ts](D:/workspace/github/knowledge-web/packages/shared/src/providers/content-provider.ts)
- [packages/shared/src/providers/search-provider.ts](D:/workspace/github/knowledge-web/packages/shared/src/providers/search-provider.ts)
- [packages/shared/src/providers/graph-provider.ts](D:/workspace/github/knowledge-web/packages/shared/src/providers/graph-provider.ts)

### 7. 图谱与多栏阅读

这部分先理解“为什么这样设计”，不用一开始就去学复杂图形库。

你现在只需要先理解：

- `文章 / 概念 / 专题` 是点
- `引用 / 延伸 / 前置 / 方案` 是边
- 多栏阅读是“围绕当前文章不断展开上下文”

先看：

- [packages/shared/src/types/content.ts](D:/workspace/github/knowledge-web/packages/shared/src/types/content.ts)
- [packages/shared/src/state/reading-panels.ts](D:/workspace/github/knowledge-web/packages/shared/src/state/reading-panels.ts)
- [apps/web/app/KnowledgeWorkspace.tsx](D:/workspace/github/knowledge-web/apps/web/app/KnowledgeWorkspace.tsx)

## 作为后端，你的推荐学习节奏

建议按这个顺序来，边学边改，不要纯看资料：

1. 先把后台跑起来，理解 `router + store + 页面壳子`
2. 再把前台跑起来，理解 `文章读取 + 页面渲染`
3. 自己新增一篇 MDX 文章
4. 再给后台加一个简单管理页或统计卡片
5. 再尝试给前台加一个分类页 / 概念页
6. 最后再去接搜索、图谱、真实后端接口

## 后续建议继续沉淀的主题

后面你可以在 `docs/learning` 下继续补自己的学习笔记，建议一类一个文件：

- `javascript-typescript.md`
- `vue-admin-basics.md`
- `react-next-basics.md`
- `mdx-content-model.md`
- `search-and-graph-roadmap.md`

推荐写法不要像教程摘要，更像“这个项目里我实际遇到的知识点解释 + 代码落点 + 改法”。

