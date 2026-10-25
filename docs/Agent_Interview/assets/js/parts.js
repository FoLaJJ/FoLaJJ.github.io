/* 分册配置：把全部模块分流到独立页面，每页只加载本页数据。
   注意：mods 的顺序即分册内章节顺序（章节号 01、02…按此生成），
   题号是分册内连续编号，因此调整顺序不会影响编号连续性。
   结构：7 个大类 × 每类 4 册 = 28 册，首页按大类分组时每一行都是 4 张卡，视觉整齐。
   改 no 不影响 file（file 保持不变以免旧链接失效），但新增册用新文件名。 */
(function (g) {
  g.PARTS = [
    /* ========== 内核与基础 ========== */
    {
      group: '内核与基础',
      no: '01', id: 'p01-core', file: 'p01-core.html',
      title: '内核 · 范式与推理引擎',
      sub: 'Agent 的定义边界、ReAct / Plan-Execute、LLM 推理引擎、提示词与 Skill 工程',
      tone: 'indigo',
      icon: '<rect x="4" y="4" width="16" height="16" rx="3.2"/><rect x="9.4" y="9.4" width="5.2" height="5.2" rx="1.2"/><path d="M9.5 2v2M14.5 2v2M9.5 20v2M14.5 20v2M2 9.5h2M2 14.5h2M20 9.5h2M20 14.5h2"/>',
      mods: ['basics', 'llm', 'prompt']
    },
    {
      group: '内核与基础',
      no: '02', id: 'p02-context', file: 'p02-context.html',
      title: '上下文 · 记忆与知识',
      sub: '上下文工程与压缩、前缀缓存、四层记忆、记忆系统深度、RAG 与知识组织、数据工具层实战',
      tone: 'violet',
      icon: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5"/>',
      mods: ['context', 'memory', 'memory-deep', 'data']
    },
    {
      group: '内核与基础',
      no: '03', id: 'p03-tools', file: 'p03-tools.html',
      title: '工具 · 协议与编排',
      sub: 'Function Calling 链路与工具设计、任务分解与多 Agent 编排、MCP / A2A 与生态标准',
      tone: 'sky',
      icon: '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="12" cy="18" r="2.6"/><path d="M6 8.6v3.4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8.6M12 14v1.4"/>',
      mods: ['tools', 'planning', 'protocols']
    },
    {
      group: '内核与基础',
      no: '04', id: 'p04-training', file: 'p04-training.html',
      title: '训练 · 成本与系统设计',
      sub: 'SFT / DPO / RLVR / GRPO、信用分配、成本结构与延迟优化、系统设计大题',
      tone: 'emerald',
      icon: '<path d="M4 9v6M20 9v6M7 6v12M17 6v12M7 12h10"/>',
      mods: ['training', 'cost', 'design']
    },

    /* ========== 工程与方法 ========== */
    {
      group: '工程与方法',
      no: '05', id: 'p05-infra', file: 'p05-infra.html',
      title: '工程 · 运行时与运维',
      sub: '架构分层与断点续跑、沙箱与会话状态、限流背压、可观测性、灰度与回滚',
      tone: 'amber',
      icon: '<rect x="3" y="4" width="18" height="7" rx="2.2"/><rect x="3" y="13" width="18" height="7" rx="2.2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
      mods: ['engineering', 'runtime', 'ops']
    },
    {
      group: '工程与方法',
      no: '06', id: 'p13-quality', file: 'p13-quality.html',
      title: '工程 · 测试、并发与模型治理',
      sub: 'Agent 的测试金字塔与 mock 策略、混沌与回归、并发与分布式原语、模型选型路由与版本治理',
      tone: 'lime',
      icon: '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/>',
      mods: ['testing', 'distributed', 'modelops']
    },
    {
      group: '工程与方法',
      no: '07', id: 'p-frameworks', file: 'p17-frameworks.html',
      title: '框架工程 · 编排框架与 RAG',
      sub: 'LangGraph / CrewAI / AutoGen 与 Harness 微内核、RAG 全流程、切片与检索、检索评测与知识库运营',
      tone: 'teal',
      icon: '<rect x="3.5" y="3.5" width="7" height="6" rx="1.6"/><rect x="13.5" y="14.5" width="7" height="6" rx="1.6"/><path d="M7 9.5v5a2 2 0 0 0 2 2h4.5"/>',
      mods: ['frameworks', 'rageng']
    },
    {
      group: '工程与方法',
      no: '08', id: 'p-intent', file: 'p18-intent.html',
      title: '方法 · 意图路由与提示词工程',
      sub: '意图识别与路由、0-shot / few-shot 适用边界、模型路由、提示词标准与 Skill / 权限治理',
      tone: 'slate',
      icon: '<circle cx="5.5" cy="18.5" r="2.4"/><circle cx="18.5" cy="5.5" r="2.4"/><path d="M5.5 16V9a3 3 0 0 1 3-3h7"/>',
      mods: ['intent', 'prompts']
    },

    /* ========== 质量评估与优化 ========== */
    {
      group: '质量评估与优化',
      no: '09', id: 'p08-evalsys', file: 'p08-evalsys.html',
      title: '质量评估 · 体系、流程与数据',
      sub: '评测总论、端到端评估流程、离线 / 影子 / A-B 三层漏斗、评估集分层抽样、标注一致性与污染检测',
      tone: 'cyan',
      icon: '<path d="M4 7.5l3 3 5.5-6"/><path d="M4 17.5l3 3 5.5-6"/><path d="M14.5 8H21M14.5 18H21"/>',
      mods: ['eval', 'eval-process', 'eval-data']
    },
    {
      group: '质量评估与优化',
      no: '10', id: 'p09-evalmetric', file: 'p09-evalmetric.html',
      title: '质量评估 · 指标与 Judge',
      sub: 'pass@k 与 pass^k、配对设计与 McNemar、bootstrap 区间、多重比较与功效、LLM-as-Judge 校准与偏差消除',
      tone: 'blue',
      icon: '<path d="M4 20V11M10 20V4M16 20v-7M21 20H3"/>',
      mods: ['eval-metrics', 'eval-judge']
    },
    {
      group: '质量评估与优化',
      no: '11', id: 'p-finetune', file: 'p24-finetune.html',
      title: '优化 · 微调落地与超参',
      sub: '该不该微调的判据、LoRA / QLoRA 的 rank 与 target_modules、数据与配比、超参搜索预算分配、训练工程排障、模型发展趋势',
      tone: 'amber',
      icon: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
      mods: ['finetune']
    },
    {
      group: '质量评估与优化',
      no: '12', id: 'p-qualityops', file: 'p25-qualityops.html',
      title: '优化 · 质量闭环与改善',
      sub: 'p90 / p95 与成本分位数、SLO 与错误预算、bad case 采集与归因闭环、离线测试工程、RAG 与 Agent 的改善优先级',
      tone: 'rose',
      icon: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v4h-4"/>',
      mods: ['qualityops']
    },

    /* ========== 安全与合规 ========== */
    {
      group: '安全与合规',
      no: '13', id: 'p07-security', file: 'p07-security.html',
      title: '安全 · 对齐与红队',
      sub: '提示注入与致命三件套、能力隔离、外泄通道、agentic misalignment、对抗评测',
      tone: 'red',
      icon: '<path d="M12 3l8 3v5.5c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
      mods: ['security', 'eval-redteam']
    },
    {
      group: '安全与合规',
      no: '14', id: 'p-offsec', file: 'p20-offsec.html',
      title: '攻防 · 自动化挖洞',
      sub: '渗透测试 Agent 的五段架构、PoC 验收线与误报治理、宽窄范围的成本差异、授权 ROE 与合规、SDL 左右移',
      tone: 'rose',
      icon: '<path d="M12 3l7 3.5v5c0 4.4-3 7.4-7 8.5-4-1.1-7-4.1-7-8.5v-5z"/><path d="M9.5 11.8l1.8 1.8 3.2-3.6"/>',
      mods: ['offsec']
    },
    {
      group: '安全与合规',
      no: '15', id: 'p-agentsec', file: 'p26-agentsec.html',
      title: '安全 · 十大漏洞与权限治理',
      sub: 'OWASP Agentic Top 10（ASI01–ASI10）逐条拆解、MCP 与技能供应链、Agent 身份与凭证、审批闸门与 kill switch、影子 AI',
      tone: 'orange',
      icon: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.4"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/><path d="M12 14.5v2.5"/>',
      mods: ['agentsec']
    },
    {
      group: '安全与合规',
      no: '16', id: 'p14-biz', file: 'p14-biz.html',
      title: '合规 · 产品与开放议题',
      sub: '隐私与合规、日志留存与审计、版权与责任划分、产品化与增长度量，以及 16 道开放辩论题',
      tone: 'slate',
      icon: '<path d="M6 3h9l4 4v14H6z"/><path d="M14.5 3v5H19"/><path d="M9.5 12.5h6M9.5 16.5h4"/>',
      mods: ['compliance', 'product', 'openqa']
    },

    /* ========== 场景与体验 ========== */
    {
      group: '场景与体验',
      no: '17', id: 'p06-practice', file: 'p06-practice.html',
      title: '编码 · 人机与企业落地',
      sub: '实战编码题、人机交互与产品体验、企业落地与组织、面试策略与表达',
      tone: 'rose',
      icon: '<path d="M8.5 6.5L4 12l4.5 5.5M15.5 6.5L20 12l-4.5 5.5M13.5 4l-3 16"/>',
      mods: ['coding', 'hci', 'enterprise', 'strategy']
    },
    {
      group: '场景与体验',
      no: '18', id: 'p12-scene', file: 'p12-scene.html',
      title: '场景专项 · 数据、客服、研究与情景',
      sub: '数据分析 Agent、客服与业务流程、深度研究，以及 12 道高压情景快问快答',
      tone: 'teal',
      icon: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.5v2.6M12 17.9v2.6M3.5 12h2.6M17.9 12h2.6"/>',
      mods: ['scene-data', 'scene-service', 'scene-research', 'scenario']
    },
    {
      group: '场景与体验',
      no: '19', id: 'p-hci2', file: 'p27-service.html',
      title: '客服系统 · 体验与隐私边界',
      sub: '从零设计客服 Agent、转人工与 SLA、渐进式自主与可接管、隐私越界的四条判定判据与脱敏留存',
      tone: 'emerald',
      icon: '<path d="M4 5.5h16v10.5H8.5L4 19.5z"/><path d="M8.5 10.5h7M8.5 13.5h4"/>',
      mods: ['hci2']
    },
    {
      group: '场景与体验',
      no: '20', id: 'p-vertical', file: 'p21-vertical.html',
      title: '垂直领域 · 金融与医疗',
      sub: '持牌边界与适当性、口径与可追溯、回测陷阱、循证与剂量零容错、危急值转医生、模型乏力点与兜底设计',
      tone: 'cyan',
      icon: '<path d="M4 20V9l8-5 8 5v11"/><path d="M9.5 20v-6h5v6"/><path d="M4 20h16"/>',
      mods: ['vertical']
    },

    /* ========== 前沿与协作 ========== */
    {
      group: '前沿与协作',
      no: '21', id: 'p10-fronresearch', file: 'p10-fronresearch.html',
      title: '前沿 · 科研、多智能体与具身',
      sub: 'AI Scientist 与自主科研、递归自我改进、多智能体协作拓扑与失效模式、VLA 与世界模型、sim-to-real、科研检索',
      tone: 'fuchsia',
      icon: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/>',
      mods: ['research', 'frontier-research', 'frontier-society', 'frontier-embodied']
    },
    {
      group: '前沿与协作',
      no: '22', id: 'p11-froneng', file: 'p11-froneng.html',
      title: '前沿 · 软件工程、OS 与经济',
      sub: 'SWE-bench 与仓库级 Agent、Computer Use 与 GUI 接地、终端与移动 Agent、Agent 经济与支付、前沿产品观点',
      tone: 'orange',
      icon: '<rect x="3" y="4" width="18" height="16" rx="2.4"/><path d="M7.5 9.5l2.8 2.8-2.8 2.8M13.5 15.5h4"/>',
      mods: ['frontier-swe', 'multimodal', 'frontier-os', 'frontier-economy', 'frontier']
    },
    {
      group: '前沿与协作',
      no: '23', id: 'p-multiagent', file: 'p22-multi.html',
      title: '协作 · 多 Agent 架构',
      sub: '五种协作拓扑与选型依据、通信机制与上下文边界、15 倍 token 的成本结构、级联失败与熔断、Agent 间通信安全',
      tone: 'violet',
      icon: '<circle cx="6.5" cy="6.5" r="2.6"/><circle cx="17.5" cy="6.5" r="2.6"/><circle cx="12" cy="17.5" r="2.6"/><path d="M8.4 8.6l2.4 6.6M15.6 8.6l-2.4 6.6M9.1 6.5h5.8"/>',
      mods: ['multiagent']
    },
    {
      group: '前沿与协作',
      no: '24', id: 'p-multimodal2', file: 'p28-multimodal.html',
      title: '多模态 · 图文对齐与幻觉治理',
      sub: '多模态 Agent 的输入输出契约、截图闭环与视觉 grounding、图文对齐失效、幻觉类型与成因、四层治理与度量',
      tone: 'fuchsia',
      icon: '<rect x="3" y="4.5" width="18" height="15" rx="2.6"/><circle cx="8.6" cy="9.6" r="1.7"/><path d="M4 17l4.6-4.6 3.4 3.4 3-2.6L20 17"/>',
      mods: ['multimodal2']
    },

    /* ========== 产品与模型 ========== */
    {
      group: '产品与模型',
      no: '25', id: 'p15-codeagent', file: 'p15-codeagent.html',
      title: '产品解析 · Claude Code 与 Codex',
      sub: '两大编码 Agent 的架构与工具集、权限与沙箱模型、CLAUDE.md / AGENTS.md 上下文工程、subagents / hooks / headless 工作流对比',
      tone: 'grape',
      icon: '<path d="M8 6L3.5 12 8 18M16 6l4.5 6L16 18"/><path d="M13.5 4.5l-3 15"/>',
      mods: ['claudecode', 'codex']
    },
    {
      group: '产品与模型',
      no: '26', id: 'p-deepseek', file: 'p29-deepseek.html',
      title: '产品解析 · DeepSeek 模型线',
      sub: 'DeepSeek 模型线与 Agent 能力、MLA / GRPO / DSA 机制、V4.1-Flash-1017 的帕累托改进与 Search / Fetch 接口',
      tone: 'wine',
      icon: '<path d="M10 3v5.2L4.6 17.6A2.2 2.2 0 0 0 6.6 21h10.8a2.2 2.2 0 0 0 2-3.4L14 8.2V3"/><path d="M8.5 3h7M7.8 14.5h8.4"/>',
      mods: ['deepseek']
    },
    {
      group: '产品与模型',
      no: '27', id: 'p16-models', file: 'p16-models.html',
      title: '产品解析 · Hermes 与评测 Harness',
      sub: '开源 Agent 模型的函数调用与训练、Harness 微内核与 Cordis 插件体系、SWE-bench / Terminal-Bench 等评测环境与 RL 训练环境',
      tone: 'indigo',
      icon: '<path d="M4 7h16M4 12h16M4 17h10"/><circle cx="19" cy="17" r="2.2"/>',
      mods: ['hermes', 'harness']
    },
    {
      group: '产品与模型',
      no: '28', id: 'p-eco', file: 'p23-eco.html',
      title: '生态与格局 · 工作台与 2026 模型',
      sub: 'WorkBuddy / Qoder / CodeBuddy 等 Agent 工作台与四层扩展、连接器与技能生态、Flash 化趋势、GLM-5.3-Flash / GPT-6.1 Sol 等新模型线',
      tone: 'grape',
      icon: '<path d="M12 3.5l8 4.2v8.6l-8 4.2-8-4.2V7.7z"/><path d="M12 12.2l8-4.3M12 12.2v8.3M12 12.2L4 7.9"/>',
      mods: ['products', 'models26']
    }
  ];
  g.PART_BY_ID = {};
  g.PARTS.forEach(function (p) { g.PART_BY_ID[p.id] = p; });
  /* 大类顺序：首页按此分组展示（每类固定 4 册，行宽一致） */
  g.GROUPS = [];
  g.PARTS.forEach(function (p) {
    var last = g.GROUPS[g.GROUPS.length - 1];
    if (!last || last.name !== p.group) g.GROUPS.push({ name: p.group, parts: [p] });
    else last.parts.push(p);
  });
})(window);
