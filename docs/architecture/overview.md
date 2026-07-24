# knowledge-web 架构导览

这份文档是进入项目时的“地图”。建议先读完本页，再按 [搭建与修改指南](../guide/README.md) 启动项目，最后按照 [后端开发者学习路线](../learning/README.md) 逐个阅读代码。

## 1. 一句话理解项目

`knowledge-web` 是一个 pnpm workspace + Turborepo Monorepo：

- `apps/admin` 是 Vue 3 后台，负责知识目录、专题、概念、关系和搜索配置。
- `apps/web` 是 Next.js 前台，负责文章展示、搜索、多栏阅读和 Knowledge Workspace。
- `packages/*` 是共享层，放类型、provider、状态模型和跨应用组件。
- `templates/*` 是新应用/新内容的参考模板，不参与运行时导入。
- `legacy/*` 是早期 demo，只用于迁移参考；新代码不要放进去。

```text
用户浏览器
├─ /admin（Vite + Vue）
│  └─ main.ts → router → AdminLayout → views
│     → composables/service → localStorage + mock provider
└─ /web（Next.js + React）
   └─ app/layout.tsx → app/**/page.tsx
      ├─ lib/content.ts → apps/web/content/articles/*.mdx
      ├─ KnowledgeWorkspace.tsx → shared reading state
      └─ lib/workspace-api.ts → 后端 Workspace HTTP API

共享父层
├─ @knowledge/shared       类型、mock 数据、provider、状态
├─ @knowledge/api-contract  API DTO 和查询参数
├─ @knowledge/ui-vue       后台公共 Vue 组件
└─ @knowledge/ui-react     前台公共 React 组件
```

## 2. 从命令到页面：两个入口

### 后台入口

1. 根脚本 `pnpm dev:admin` 进入 `apps/admin`，执行 Vite。
2. `apps/admin/index.html` 提供 `#app` 挂载点。
3. `apps/admin/src/main.ts` 创建 Vue 应用，注册 Pinia、Vue Router、Element Plus，然后挂载 `App.vue`。
4. `apps/admin/src/App.vue` 只负责 `<router-view />`。
5. `apps/admin/src/router/index.ts` 定义 `/login` 和需要认证的后台布局路由。
6. `AdminLayout.vue` 提供菜单、页头和第二个 `<router-view />`，具体页面位于 `views/`。
7. 页面通过 `useMetadataCollection`、`admin-metadata-service` 操作 `metadata-workspace`；当前持久化介质是浏览器 LocalStorage，初始数据来自 `@knowledge/shared` 的 mock provider。

后台路由：

| 路径 | 页面 | 责任 |
| --- | --- | --- |
| `/login` | `LoginView.vue` | 当前为 demo 登录，账号 `admin` / `123456` |
| `/overview` | `DashboardView.vue` | 元数据概览 |
| `/navigation` | `NavigationView.vue` | 文章入口、分类、标签 |
| `/taxonomy` | `TaxonomyView.vue` | 专题和概念 |
| `/relations` | `RelationsView.vue` | 图谱关系边 |
| `/search` | `SearchConfigView.vue` | 搜索 provider 配置 |

### 前台入口

1. 根脚本 `pnpm dev:web` 启动 `apps/web` 的 Next.js。
2. `apps/web/app/layout.tsx` 是全局布局和 metadata 入口。
3. `apps/web/app/page.tsx` 是首页。
4. `apps/web/app/articles/[slug]/page.tsx` 是文章动态路由，读取文章后交给 `KnowledgeWorkspace` 展示。
5. `apps/web/lib/content.ts` 扫描 `content/articles/*.mdx`，用 `gray-matter` 解析 frontmatter，并拼出 `KnowledgeArticle`。
6. `apps/web/app/KnowledgeWorkspace.tsx` 是多栏阅读的客户端交互层，状态模型来自 `@knowledge/shared`。
7. `apps/web/lib/workspace-api.ts` 是 Workspace 后端 HTTP 边界，预览/发布/历史查询都集中在这里。

前台主要路由：

| 路径 | 作用 |
| --- | --- |
| `/` | 知识库首页 |
| `/articles/[slug]` | MDX 文章阅读 |
| `/search?q=...` | 搜索结果 |
| `/workspace` | 每日工作记录编辑器 |
| `/workspace/history` | 工作记录历史 |
| `/workspace/articles` | 知识文章历史 |
| `/workspace/articles/new` | 新建知识文章 |

## 3. 一次“文章展示”的完整链路

以 `/articles/security-login-overview` 为例：

1. Next.js 根据 `app/articles/[slug]/page.tsx` 匹配路由。
2. 页面调用 `getArticleBySlug(slug)`。
3. `lib/content.ts` 在 `apps/web/content/articles/security-login-overview.mdx` 读取文件。
4. `gray-matter` 把 frontmatter 解析为 `ArticleMeta`，正文保留为 `body`。
5. 页面同时读取导航和相关文章。
6. `KnowledgeWorkspace` 以客户端组件维护打开的阅读栏、焦点栏、折叠和关闭。
7. `packages/ui-react` 的 `KnowledgeShell`、`RelationshipList`、`SearchResultList` 负责可复用展示。

这条链路里，页面不应该直接拼路径、解析 frontmatter 或实现搜索评分；这些职责分别属于 `lib/content.ts` 和 shared provider。

## 4. 共享层怎么分工

### `packages/shared`

这里是跨端的业务语言层。`src/types/content.ts` 定义文章、概念、专题、关系、搜索结果和阅读状态；`src/providers/` 定义可替换的数据能力；`src/state/reading-panels.ts` 维护纯函数状态变换；`src/mock/knowledge.ts` 提供当前 demo 数据。

provider 的价值是稳定调用方：页面依赖 `ContentProvider` / `SearchProvider` / `GraphProvider` 接口，后续可以把 mock 实现替换成 API、ES 或图数据库实现，而不是让每个页面都改一遍。

### `packages/api-contract`

这里放“前后端边界”的类型，不放页面逻辑。当前主要是共享模型的 payload 别名和 `ArticleQuery`。真实后端接口稳定后，建议把请求/响应 DTO、错误码和分页结构继续集中到这里。

### `packages/ui-vue` / `packages/ui-react`

只放可复用的展示组件。组件应尽量通过 props 接收数据，不在这里读取路由、LocalStorage 或具体业务 provider；业务编排留在 `apps/*`。

## 5. 新代码放哪里：判断规则

| 需求 | 首选位置 | 判断标准 |
| --- | --- | --- |
| 新增后台页面/路由 | `apps/admin/src/views`、`router` | 只有后台使用 |
| 后台页面公共卡片/表单 | `packages/ui-vue` | 至少两个后台页面复用 |
| 新增前台页面 | `apps/web/app` | 由 URL 和 Next.js 页面组成 |
| 前台服务端内容读取 | `apps/web/lib` | 只服务前台运行时 |
| 前后台共用领域类型 | `packages/shared/src/types` | 两端都需要理解 |
| 前后端接口 DTO | `packages/api-contract/src` | 属于契约，不是 UI 状态 |
| 可替换的数据来源 | `packages/shared/src/providers` | mock/API/ES 可以互换 |
| 前台公共组件 | `packages/ui-react` | 不绑定具体页面 |
| 文章正文 | `apps/web/content/articles` | 当前首期内容源是 MDX |
| 新文章格式/新应用骨架 | `templates` | 供复制和约定，不是运行时代码 |

推荐的依赖方向是：

```text
apps/* → packages/*
apps/* → 自己的 lib / modules / views
packages/ui-* → packages/shared（仅在确有需要时）
packages/* ✕ 不反向依赖 apps/*
```

如果一个改动同时涉及“页面、接口、共享类型”，建议按 `api-contract/shared → app service/lib → view/component` 的顺序落地，先固定边界再写 UI。

## 6. 当前真实状态与后续演进点

- 登录是 demo 认证，token 只存在 Pinia 内存中，不能视为生产认证方案。
- 后台元数据目前写入 LocalStorage，尚未接真实管理 API。
- 前台文章正文来自仓库内 MDX；Workspace 的预览、发布、历史依赖 `NEXT_PUBLIC_KNOWLEDGE_WORKSPACE_API_URL` 指向后端。
- 搜索和图谱目前是 mock provider；`elasticsearch` 只是配置类型中的预留选项。
- 各包的 `lint`/部分 `test` 脚本仍是占位实现，新增功能时应同步补测试，不要把绿色脚本输出当成完整质量保证。

这些限制不是阅读障碍，反而是理解项目边界的关键：先学会接口、状态和页面分层，再逐步把 mock/localStorage 替换成真实后端能力。
