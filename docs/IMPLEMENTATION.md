# 实现核查 · campus-weekend-gigs

以下结论来自当前仓库代码；ZIP 项目按归档内文件核查。代码中存在实现不代表线上端到端测试已通过。

| 说明范围 | 依据 | 核查结论 |
| --- | --- | --- |
| 岗位、认证、申请 | [src/App.jsx](../src/App.jsx) | StudentHome、Verification、MerchantHome、Applicants；示例与持久化范围分开 |
| 真实登录调用 | [src/cloudbase.js](../src/cloudbase.js) | sendCode、loginOrRegister；运行成功依赖服务配置 |
| 示例岗位 | [src/data/jobs.js](../src/data/jobs.js) | distanceKm 为预设距离，不是定位实时计算 |

## 评测状态

`EVALUATION.md` 是本次新增的待执行手动验收方案。仓库没有因此自动具备 Case 平台、模型评测、自动修复或线上监控；未执行用例不能填为通过。
