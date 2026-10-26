# 周末搭子 · Campus Weekend Gigs

> 把周末兼职发现、认证与报名串成完整体验。

![React](https://img.shields.io/badge/React-0F766E?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-0F766E?style=flat-square) ![JavaScript](https://img.shields.io/badge/JavaScript-0F766E?style=flat-square)

**在线体验：** [打开产品](https://echohux.github.io/campus-weekend-gigs/) · [验收与迭代记录](./docs/EVALUATION.md)

![周末搭子 · Campus Weekend Gigs 项目封面](./docs/assets/readme-cover.svg)

## 项目简介

面向大学生与校园周边商家的双角色兼职撮合 MVP。学生可浏览与筛选岗位、模拟身份认证并报名；商家可模拟认证、发布岗位并体验申请处理流程。

项目重点解决以下问题：

- 岗位发现：在同一页面呈现岗位列表、筛选和详情。
- 信任门槛：通过认证状态控制报名与发布入口，验证交互逻辑。
- 双角色流程：分别验证学生找兼职和商家招人的关键任务。

## 核心能力

- CloudBase 邮箱验证码注册 / 登录。
- 学生端浏览示例岗位，按岗位名 / 商家搜索，按日期、类型和预置距离筛选，查看详情与本地报名记录。
- 学生认证、商家待审核及模拟审核通过状态。
- 商家新增岗位与本地新增岗位编辑。
- 示例申请者录用 / 拒绝交互。

## 产品流程 · Pipeline

```text
邮箱验证码 → 注册 / 登录
    ↓
选择学生 / 商家角色
    ↓
学生：浏览筛选 → 模拟认证 → 报名 → 查看申请
    ↓
商家：模拟认证 → 模拟审核通过 → 发布岗位
    ↓
查看示例申请者 → 录用 / 拒绝
    ↓
按用户 ID 保存本地业务状态
```

认证审核、岗位与申请流程用于 MVP 演示。新发岗位没有接入真实跨账号撮合；申请者列表为示例数据，录用状态只保存在组件内存。定位会读取授权坐标，但岗位距离仍使用示例数据中的 distanceKm，并未按用户坐标计算真实距离。

## 评测闭环

将核心任务、状态反馈与稳定性分开验收，再保留失败样例进行回归：

| 项目验收项 | 对应实际实现 |
| --- | --- |
| 登录与权限入口 | 验证码失败、未认证禁用报名 / 发布 |
| 本地业务状态 | 认证、报名、新增岗位刷新后是否保留 |
| 演示边界 | 示例距离、模拟审核与示例申请者不应被当作真实撮合 |

```text
体验核心流程 → 记录实际结果 → 标注 Good / Bad / Boundary Case
      ↑                                      ↓
回归同一组用例 ← 修复并对比结果 ← 定位规则 / 数据 / 交互 / 依赖原因
```

这是本次补充的验收与迭代规范，尚未代表已经完成评测、建立自动化平台或取得量化成绩。项目专属用例与待填写记录见 [EVALUATION.md](./docs/EVALUATION.md)。

## 技术架构

- 界面与状态：`src/App.jsx`；演示岗位：`src/data/jobs.js`。
- 身份登录：`src/cloudbase.js`，通过 CloudBase Web SDK 完成邮箱验证。
- 业务数据：按用户 ID 在浏览器 localStorage 保存认证、报名与新增岗位。
- 样式：`src/styles.css`；构建与发布：Vite + GitHub Actions。

**技术栈：** React · Vite · JavaScript · CloudBase · localStorage。

## 本地运行

环境：Node.js 22、pnpm 10。

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

在 `.env.local` 中填写自己的 `VITE_TCB_ENV_ID`，必要时设置 `VITE_TCB_REGION`。CloudBase 需开启相应邮箱登录方式，并允许本地开发域名。终端会显示访问地址。

## 部署

现有 `.github/workflows/deploy-pages.yml` 在 `main` 推送时安装依赖、构建 `dist/` 并部署 GitHub Pages。线上登录仍依赖 CloudBase 的登录配置、安全域名和服务可用性。部署到自己的环境时，应通过构建环境变量覆盖默认环境 ID。

## 项目结构

```text
src/App.jsx              # 双角色页面及业务状态
src/cloudbase.js         # 邮箱验证与登录
src/data/jobs.js         # 演示岗位
src/styles.css           # 界面样式
public/assets/           # 岗位图片
.github/workflows/       # Pages 构建部署
```

## 产品取舍与边界

证件选择与审核是模拟流程，请勿输入真实敏感身份资料。示例岗位编辑不会持久化；跨账号共享岗位、真实资质核验与交易履约尚未实现。

## 功能依据

具体代码位置、归档内路径及无法核实的范围见 [实现核查](./docs/IMPLEMENTATION.md)。

## 项目背景

项目通过 Vibe Coding 构建，产品关注点包括需求定义、任务流程、交互优先级与快速验证。本次说明文档参考 [FlowCraft AI](https://github.com/FILPPED-jin/FlowCraft-AI-Product) 的项目展示结构，按本仓库实际内容重新组织。
