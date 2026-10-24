/* 分册配置：把 51 个模块分流到 16 个独立页面，每页只加载本页数据。
   注意：mods 的顺序即分册内章节顺序（章节号 01、02…按此生成），
   题号是分册内连续编号，因此调整顺序不会影响编号连续性。 */
(function (g) {
  g.PARTS = [
    {
      no: '01', id: 'p01-core', file: 'p01-core.html',
      title: '内核 · 范式与推理引擎',
      sub: 'Agent 的定义边界、ReAct / Plan-Execute、LLM 推理引擎、提示词与 Skill 工程',
      tone: 'indigo',
      icon: '<rect x="4" y="4" width="16" height="16" rx="3.2"/><rect x="9.4" y="9.4" width="5.2" height="5.2" rx="1.2"/><path d="M9.5 2v2M14.5 2v2M9.5 20v2M14.5 20v2M2 9.5h2M2 14.5h2M20 9.5h2M20 14.5h2"/>',
      mods: ['basics', 'llm', 'prompt']
    },
    {
      no: '02', id: 'p02-context', file: 'p02-context.html',
      title: '上下文 · 记忆与知识',
      sub: '上下文工程与压缩、前缀缓存、四层记忆、记忆系统深度、RAG 与知识组织、数据工具层实战',
      tone: 'violet',
      icon: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5"/>',
      mods: ['context', 'memory', 'memory-deep', 'data']
    },
    {
      no: '03', id: 'p03-tools', file: 'p03-tools.html',
      title: '工具 · 协议与编排',
      sub: 'Function Calling 链路与工具设计、任务分解与多 Agent 编排、MCP / A2A 与生态标准',
      tone: 'sky',
      icon: '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="12" cy="18" r="2.6"/><path d="M6 8.6v3.4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8.6M12 14v1.4"/>',
      mods: ['tools', 'planning', 'protocols']
    },
    {
      no: '04', id: 'p04-training', file: 'p04-training.html',
      title: '训练 · 成本与系统设计',
      sub: 'SFT / DPO / RLVR / GRPO、信用分配、成本结构与延迟优化、系统设计大题',
      tone: 'emerald',
      icon: '<path d="M4 9v6M20 9v6M7 6v12M17 6v12M7 12h10"/>',
      mods: ['training', 'cost', 'design']
    },
    {
      no: '05', id: 'p05-infra', file: 'p05-infra.html',
      title: '工程 · 运行时与运维',
      sub: '架构分层与断点续跑、沙箱与会话状态、限流背压、可观测性、灰度与回滚',
      tone: 'amber',
      icon: '<rect x="3" y="4" width="18" height="7" rx="2.2"/><rect x="3" y="13" width="18" height="7" rx="2.2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
      mods: ['engineering', 'runtime', 'ops']
    },
    {
      no: '06', id: 'p06-practice', file: 'p06-practice.html',
      title: '编码 · 人机与企业落地',
      sub: '实战编码题、人机交互与产品体验、企业落地与组织、面试策略与表达',
      tone: 'rose',
      icon: '<path d="M8.5 6.5L4 12l4.5 5.5M15.5 6.5L20 12l-4.5 5.5M13.5 4l-3 16"/>',
      mods: ['coding', 'hci', 'enterprise', 'strategy']
    },
    {
      no: '07', id: 'p07-security', file: 'p07-security.html',
      title: '安全 · 对齐与红队',
      sub: '提示注入与致命三件套、能力隔离、外泄通道、agentic misalignment、对抗评测',
      tone: 'red',
      icon: '<path d="M12 3l8 3v5.5c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
      mods: ['security', 'eval-redteam']
    },
    {
      no: '08', id: 'p08-evalsys', file: 'p08-evalsys.html',
      title: '质量评估 · 体系、流程与数据',
      sub: '评测总论、端到端评估流程、离线 / 影子 / A-B 三层漏斗、评估集分层抽样、标注一致性与污染检测',
      tone: 'cyan',
      icon: '<path d="M4 7.5l3 3 5.5-6"/><path d="M4 17.5l3 3 5.5-6"/><path d="M14.5 8H21M14.5 18H21"/>',
      mods: ['eval', 'eval-process', 'eval-data']
    },
    {
      no: '09', id: 'p09-evalmetric', file: 'p09-evalmetric.html',
      title: '质量评估 · 指标与 Judge',
      sub: 'pass@k 与 pass^k、配对设计与 McNemar、bootstrap 区间、多重比较与功效、LLM-as-Judge 校准与偏差消除',
      tone: 'blue',
      icon: '<path d="M4 20V11M10 20V4M16 20v-7M21 20H3"/>',
      mods: ['eval-metrics', 'eval-judge']
    },
    {
      no: '10', id: 'p10-fronresearch', file: 'p10-fronresearch.html',
      title: '前沿 · 科研、多智能体与具身',
      sub: 'AI Scientist 与自主科研、递归自我改进、多智能体协作拓扑与失效模式、VLA 与世界模型、sim-to-real、科研检索',
      tone: 'fuchsia',
      icon: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/>',
      mods: ['research', 'frontier-research', 'frontier-society', 'frontier-embodied']
    },
    {
      no: '11', id: 'p11-froneng', file: 'p11-froneng.html',
      title: '前沿 · 软件工程、OS 与经济',
      sub: 'SWE-bench 与仓库级 Agent、Computer Use 与 GUI 接地、终端与移动 Agent、Agent 经济与支付、前沿产品观点',
      tone: 'orange',
      icon: '<rect x="3" y="4" width="18" height="16" rx="2.4"/><path d="M7.5 9.5l2.8 2.8-2.8 2.8M13.5 15.5h4"/>',
      mods: ['frontier-swe', 'multimodal', 'frontier-os', 'frontier-economy', 'frontier']
    },
    {
      no: '12', id: 'p12-scene', file: 'p12-scene.html',
      title: '场景专项 · 数据、客服、研究与情景',
      sub: '数据分析 Agent、客服与业务流程、深度研究，以及 12 道高压情景快问快答',
      tone: 'teal',
      icon: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6"/>',
      mods: ['scene-data', 'scene-service', 'scene-research', 'scenario']
    },
    {
      no: '13', id: 'p13-quality', file: 'p13-quality.html',
      title: '工程 · 测试、并发与模型治理',
      sub: 'Agent 的测试金字塔与 mock 策略、混沌与回归、并发与分布式原语、模型选型路由与版本治理',
      tone: 'lime',
      icon: '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/>',
      mods: ['testing', 'distributed', 'modelops']
    },
    {
      no: '14', id: 'p14-biz', file: 'p14-biz.html',
      title: '合规 · 产品与开放议题',
      sub: '隐私与合规、日志留存与审计、版权与责任划分、产品化与增长度量，以及 16 道开放辩论题',
      tone: 'slate',
      icon: '<path d="M6 3h9l4 4v14H6z"/><path d="M14.5 3v5H19"/><path d="M9.5 12.5h6M9.5 16.5h4"/>',
      mods: ['compliance', 'product', 'openqa']
    },
    {
      no: '15', id: 'p15-codeagent', file: 'p15-codeagent.html',
      title: '产品解析 · Claude Code 与 Codex',
      sub: '两大编码 Agent 的架构与工具集、权限与沙箱模型、CLAUDE.md / AGENTS.md 上下文工程、subagents / hooks / headless 工作流对比',
      tone: 'grape',
      icon: '<path d="M8 6L3.5 12 8 18M16 6l4.5 6L16 18"/><path d="M13.5 4.5l-3 15"/>',
      mods: ['claudecode', 'codex']
    },
    {
      no: '16', id: 'p16-models', file: 'p16-models.html',
      title: '产品解析 · DeepSeek、Hermes 与评测 Harness',
      sub: 'DeepSeek 模型线与 Agent 能力、MLA / GRPO / DSA 机制、开源 Agent 模型的函数调用与训练、SWE-bench / Terminal-Bench 等评测 harness 与 RL 环境',
      tone: 'wine',
      icon: '<path d="M10 3v5.2L4.6 17.6A2.2 2.2 0 0 0 6.6 21h10.8a2.2 2.2 0 0 0 2-3.4L14 8.2V3"/><path d="M8.5 3h7M7.8 14.5h8.4"/>',
      mods: ['deepseek', 'hermes', 'harness']
    }
  ];
  g.PART_BY_ID = {};
  g.PARTS.forEach(function (p) { g.PART_BY_ID[p.id] = p; });
})(window);
