# knowledge-web 架构说明

## 目标

把 `knowledge-web` 从两个孤立 demo，提升为一个可长期扩展的前端 Monorepo。

## 分层对应关系

- `apps/*`：业务应用层，对齐项目A里的业务模块
- `packages/shared`：共享父层，对齐前端版 `knowledge-parent`
- `templates/*`：模板层，对齐前端版 `knowledge-template`

## 当前默认约束

- 后台首期只管理导航、关系、专题与搜索配置，不做重 CMS
- 前台首期以 Repo 内 MDX 为内容源
- 搜索默认走 mock provider，保留后续切换 ES 的边界
- 图谱首期先稳定 `node / edge / topic` 结构，不强做完整画布

## 后续扩展建议

- 新增移动端：直接放进 `apps/mobile`
- 新增公共设计系统：继续扩展 `packages/ui-react` / `packages/ui-vue`
- 新增 SDK 或接口封装：放进新的 `packages/*`
- 新增专题模板：优先补 `templates/content-entry`
