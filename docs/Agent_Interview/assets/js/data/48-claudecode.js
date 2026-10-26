KB.register({
  id: "claudecode",
  idx: "48",
  title: "Claude Code 深度解析",
  desc: "终端原生 agentic coding 的工具集与 agent loop、CLAUDE.md 上下文分层、权限模型、subagents / hooks / MCP / headless 工作流",
  items: [
    {      q: "面试官问「Claude Code 和 Copilot 这类补全工具到底差在哪？」一分钟怎么答？",
      tag: "base",
      a: [
        "定位差异：<b>Claude Code 是终端原生的 agentic coding 工具</b>——它不只是建议代码，而是<b>自己读文件、改文件、跑命令、跑测试</b>，直到任务完成；Copilot 类工具主要是<b>编辑器内的补全与改写</b>，动作由人驱动。",
        "形态差异：Claude Code 跑在<b>终端进程</b>里，不依赖 IDE，因此天然能进 <b>CI / 脚本 / 无人值守批处理</b>；同时也能反向挂进 VS Code、JetBrains 做侧边栏。",
        "控制面差异：它有一整套<b>治理设施</b>——CLAUDE.md 记忆分层、settings 权限规则、hooks 生命周期钩子、subagent 上下文隔离——这是「能不能进生产」的分水岭。"
      ],
      plus: "一句话收尾最好用：<b>补全工具解决『我写得更快』，agentic coding 工具解决『这件事不用我盯』</b>；后者真正的难点不是模型多聪明，而是权限、上下文与可观测性。",
      warn: "只说「Claude Code 更强/上下文更长」——没答到动作主体与治理面的变化。",
      follow: "追问：既然它能自己跑命令，你如何保证它不会误删东西？",
      why: "三者是递进关系。第一层是<b>动作主体变了</b>：从「人执行、模型建议」变成「模型执行、人审批」。第二层是<b>运行场所变了</b>：终端进程意味着可脚本化、可编排、可并行。第三层是<b>治理成本变了</b>：一旦模型能改文件和执行命令，就必须有记忆分层（CLAUDE.md）、权限分级（allow/ask/deny）、硬约束（hooks）三件套，否则无法进企业生产。面试里只讲第一层会显得只用过没想过。",
      num: "三句话：<b>模型执行 / 终端可脚本化 / 治理三件套（CLAUDE.md + permissions + hooks）</b>。"
    },
    {      q: "你要给团队讲清一轮对话内部发生了什么。请用 agent loop 把它讲成状态机。",
      tag: "base",
      a: [
        "骨架是一个循环：<b>组装上下文 → 调模型 → 解析出工具调用 → 执行工具 → 把结果回灌进消息列表 → 再调模型</b>，直到模型不再发工具调用而给出最终答复。",
        "四个必须内建的约束：<b>轮数上限</b>（--max-turns）、<b>预算上限</b>（--max-budget-usd）、<b>权限判定</b>（每一步都可能被拦截或要求确认）、<b>终止态区分</b>——明确区分「完成」与「放弃/被中断」。",
        "写成状态机更好讲：<b>idle → planning → calling → observing → finished / aborted</b>。每个工具调用都是一次 calling→observing 的迁移，用户中断（Esc）与 hook 拦截（exit 2）都会落到 aborted。"
      ],
      plus: "加分点：指出<b>观察结果回灌是整个 loop 的地基</b>——工具返回必须是结构化的、可截断的，否则一次 grep 全仓库就能把窗口撑爆，loop 再漂亮也没用。",
      warn: "把 loop 讲成「一直调 API 直到回答」——漏掉权限、预算、终止三个闸门。",
      follow: "追问：如果模型在第 30 轮开始重复同一个错误调用，你的 loop 怎么检测并打断？",
      why: "agent loop 的价值不在循环本身，而在<b>循环上的三个闸门</b>：<b>权限闸门</b>（这一步能不能做）、<b>预算闸门</b>（还能做几步、花多少钱）、<b>终止闸门</b>（什么时候承认失败）。三者缺一，agent 要么不敢动、要么跑到天荒地老、要么在预算里反复犯同一个错。Claude Code 把这三个闸门分别交给 permissions/hooks、--max-turns 与 --max-budget-usd、以及 Stop hook 与显式终态来处理。",
      num: "五步循环 + 三闸门：<b>权限 / 预算 / 终止</b>；CLI 对应 <b>--max-turns</b>、<b>--max-budget-usd</b>、<b>Stop hook</b>。"
    },
    {      q: "新人第一天要配好 Claude Code，你让他先做哪三件事，才能既不危险又不啰嗦？",
      tag: "base",
      a: [
        "第一件：<b>写 CLAUDE.md</b>——把别人猜不到的东西写进去：构建/测试/lint 命令、目录约定、不要碰的生成目录、提交规范。用 /init 生成骨架再删减。",
        "第二件：<b>配权限白名单</b>——在 .claude/settings.json 里把 <code>Bash(npm test)</code>、<code>Bash(git status)</code>、<code>Read(*)</code> 这类高频只读命令放进 permissions.allow，消掉 80% 的确认弹窗。",
        "第三件：<b>配一个 PostToolUse hook</b>——matcher 用 <code>Edit|Write</code>，命令跑 formatter；这样「Claude 忘了格式化」这个高频抱怨一次性根治。"
      ],
      plus: "补一句组织纪律：<b>不相关任务之间用 /clear</b>，同一任务变长用 /compact；别指望一个会话从周一聊到周五。",
      warn: "上来就教 --dangerously-skip-permissions「省事」——把最危险的习惯传给新人。",
      follow: "追问：这三件里哪一件是你认为收益最高的？为什么？",
      why: "这三件事分别对应 agentic coding 的三个失败模式：<b>不知道怎么做</b>（缺记忆 → CLAUDE.md）、<b>做什么都卡一下</b>（缺信任 → allow 规则）、<b>做完了不合规</b>（缺硬约束 → hooks）。新人常见错误是先去调模型和调 prompt，那是第三优先级；配置的第一优先级是<b>把可被声明的事实与规则外置</b>，让模型不必猜、也不必被提醒。",
      num: "三件事：<b>CLAUDE.md 记忆 / permissions.allow 白名单 / PostToolUse 格式化 hook</b>；纪律是 <b>/clear 换任务、/compact 续任务</b>。"
    },
    {      q: "同事让你背一遍 Claude Code 的内置工具清单。你说「背清单没意义」，那你讲什么？",
      tag: "base",
      a: [
        "讲<b>分层</b>而不是清单：<b>文件层</b>（Read / Write / Edit / MultiEdit / NotebookEdit）、<b>检索层</b>（Glob 找文件、Grep 找内容）、<b>执行层</b>（Bash）、<b>网络层</b>（WebSearch / WebFetch）、<b>编排层</b>（Task 派子代理、TodoWrite 记任务）。",
        "讲<b>设计取舍</b>：工具刻意做得<b>少而通用</b>——一个 Bash 就能覆盖绝大多数命令，而不是为 npm / git / docker 各做一个专用工具；代价是需要权限与沙箱兜底，收益是能力上限不会被工具集封死。",
        "讲<b>扩展性</b>：真正缺的能力走 <b>MCP</b> 与自定义 slash command / skill 补，而不是往核心工具集里塞。"
      ],
      plus: "补一个细节显得真用过：<b>Edit 要求 old_string 唯一且精确匹配</b>，这逼着模型必须先 Read 再改，从机制上减少了「凭记忆改错文件」。",
      warn: "背 10 个工具名却讲不出「为什么只有 Bash 一个执行工具」这个设计取舍。",
      follow: "追问：既然 Bash 能力最强，为什么不干脆只用 Bash 而保留 Read/Edit？",
      why: "工具集的设计哲学是<b>用少量通用原语换取能力上限</b>，再用权限与沙箱把风险兜住。对比「为每个场景做专用工具」的路线：后者安全可控但能力被工具集封死，前者能力开放但治理成本高。Claude Code 选了后者，因此它的复杂度主要不在工具实现，而在<b>权限判定、命令静态分析、沙箱隔离</b>——这也是面试真正值得展开的地方。",
      num: "五层：<b>文件 / 检索 / 执行 / 网络 / 编排</b>；关键约束是 <b>Edit 的 old_string 必须唯一精确匹配</b>。"
    },
    {      q: "你让 Claude 重构十个文件，它每改一个就弹确认，你烦；全放开又怕它乱来。这个信任矛盾怎么破？",
      tag: "base",
      a: [
        "用<b>权限模式（permission mode）</b>而不是「全开或全关」。默认档 <b>default</b> 每步询问；<b>acceptEdits</b> 自动批准文件编辑、但 shell 命令仍询问；<b>plan</b> 只读完全不能写；<b>bypassPermissions</b> 跳过全部检查（仅限隔离环境）。",
        "日常推荐 <b>acceptEdits</b>：改文件是最频繁且最易审查的动作，放开它能消掉大部分弹窗；<b>rm / sudo / git push --force / curl</b> 这类高危 shell 仍由你把关。",
        "再加一层 <b>allow 规则</b>：把 <code>Bash(npm test)</code>、<code>Bash(git diff *)</code> 之类高频安全命令写进白名单，剩下的才走询问。"
      ],
      plus: "补一句：<b>Shift+Tab 可在会话中途循环切换模式</b>，复杂改动先 plan 再 acceptEdits，比一路 default 高效得多。",
      warn: "把 --dangerously-skip-permissions 当默认启动方式——等于放弃整个权限层，deny 规则也不再生效。",
      follow: "追问：bypassPermissions 模式下 deny 规则还生效吗？",
      why: "这是<b>信任的光谱而非开关</b>。权限模式定义的是「未被任何规则覆盖的动作」的默认行为，而 <b>allow/ask/deny 规则始终生效</b>、与模式叠加。所以正确心智模型是：<b>模式定基线，规则做例外，deny 是硬否决</b>。把这三件事分清楚，就能做到「90% 的动作不打扰我，10% 的危险动作一定有我」。",
      num: "四档模式：<b>default / acceptEdits / plan / bypassPermissions</b>；规则优先级 <b>deny &gt; ask &gt; allow</b>；切换键 <b>Shift+Tab</b>。"
    },
    {      q: "仓库约定「用 pnpm 不用 npm」「别手改 migrations」，每次开新会话都要重复说。怎么根治？",
      tag: "base",
      a: [
        "写进 <b>CLAUDE.md</b> 并提交到 git。它是<b>每次会话开始时自动加载的持久记忆</b>，本质是普通 Markdown，Claude 读它作为常驻指令，不是训练、也不是数据库。",
        "写法要点：<b>一行一条事实</b>，不写解释不写历史，模型要的是规则不是理由；<b>只写它猜不到的</b>——构建/测试命令、目录约定、易踩的坑、架构决策。",
        "验证办法：新开会话问一句「你知道这个项目的什么约定？」，它能原样复述说明加载成功；也可以用 <b>#</b> 快捷键在会话中随手追加一条。"
      ],
      plus: "重要边界：<b>CLAUDE.md 是上下文不是强制</b>——上下文一长，规则可能被稀释。真的一条都不能破的规则要放进 <b>hook</b>，用 exit 2 物理阻断。",
      warn: "把密钥、超长代码块、随时会变的信息写进 CLAUDE.md——它会被提交进 git 且会过期。",
      follow: "追问：CLAUDE.md 里的规则，Claude 一定会遵守吗？不遵守怎么办？",
      why: "CLAUDE.md 解决的是<b>重复沟通成本</b>，但它有明确的能力边界：它是被「读进去的文本」，服从上下文衰减规律；而 hook 是<b>进程级的执行检查</b>，每一步都跑、模型无法绕过。所以分工是：<b>CLAUDE.md 写偏好与约定（软），hooks 写不可违反的约束（硬）</b>。面试能讲出这条边界，说明真踩过坑。",
      num: "路径：<b>./CLAUDE.md 或 .claude/CLAUDE.md（提交进 git）</b>、<b>~/.claude/CLAUDE.md（个人全局）</b>；经验上限 <b>200 行以内</b>；<b># 快捷键</b> 可快速追加。"
    },
    {      q: "会话跑了两个小时，Claude 开始答非所问、响应也变慢。你判断是上下文问题，第一步该做什么？",
      tag: "base",
      a: [
        "先看<b>上下文占用</b>再决定动作：Claude Code 会在接近窗口上限时<b>自动触发 autocompact</b>，你也可以随时手动执行 <b>/compact</b> 主动压缩。",
        "如果任务已经做完、下一个是无相关任务，正确动作是 <b>/clear</b> 而不是 /compact——压缩是为了<b>续接同一个任务</b>，不是为了让会话长生不老。",
        "如果改崩了想回滚到某个检查点，用 <b>Esc Esc（或 /rewind）</b> 回滚对话与代码状态，比让模型继续「再改一版」更省 token。"
      ],
      plus: "经验法则：<b>同一处错误让 Claude 改两次还没改对，就 /clear 重写一个更清晰的初始 prompt</b>，而不是继续迭代——继续迭代只会把失败的尝试也塞进上下文。",
      warn: "上下文满了就一路 /compact 续着聊——把上个任务的残留一起压进摘要，越压越糊。",
      follow: "追问：/compact 压缩掉的内容，怎么保证不丢关键约束？",
      why: "上下文是<b>稀缺资源</b>而不是免费容器：它同时承担三件事——<b>模型注意力</b>（越满越容易忽略早期约束）、<b>延迟与成本</b>（每轮都要重发）、<b>缓存命中</b>（结构越稳定越省钱）。所以「先压缩」不是优化而是止损。而压缩顺序有讲究：<b>先 /clear 砍无关任务，再 /compact 续当前任务，最后才考虑回滚</b>，顺序反了会白花 token。",
      num: "三个命令：<b>/clear（换任务）</b>、<b>/compact（续任务）</b>、<b>Esc Esc 或 /rewind（回滚）</b>；失败迭代 <b>2 次</b> 后重写 prompt。"
    },
    {      q: "你要在 CI 流水线里让 Claude Code 自动修一批 lint 报错，但它是交互式 REPL。怎么调用它？",
      tag: "base",
      a: [
        "用 <b>headless 模式</b>：<code>claude -p \"修复 lint 报错\"</code>。参数 <b>-p / --print</b> 表示非交互、把结果打到 stdout 后退出。",
        "无人值守必须补三样：<b>--allowedTools</b> 预批准它需要的工具（没人能点确认）、<b>--output-format json</b> 便于解析、<b>--max-turns</b> 防跑飞。",
        "典型命令：<code>claude -p \"...\" --allowedTools \"Read,Edit,Bash\" --output-format json --max-turns 20</code>，把输出 JSON 交给后续步骤判定成败。"
      ],
      plus: "结构化输出里 <b>type:\"result\"</b> 那一条是完成信号，带 <b>total_cost_usd</b> 与 usage 字段，可以直接拿来做成本门禁和统计。",
      warn: "CI 里用 --dangerously-skip-permissions 图省事——在共享 runner 上等于给任意代码执行权限。",
      follow: "追问：批次跑了一半超时了，怎么保证重跑不会重复修改？",
      why: "headless 的关键不是「不弹 UI」，而是<b>把交互式的信任模型换成声明式的信任模型</b>。交互式下信任来自你实时点确认；无人值守下没人点，所以必须<b>事先声明边界</b>——哪些工具可用（--allowedTools）、最多几轮（--max-turns）、最多花多少（--max-budget-usd）。这三件事不定，CI 里的 agent 就是一颗定时炸弹。",
      num: "三件套：<b>-p / --print</b>、<b>--allowedTools</b>、<b>--max-turns</b>；输出格式 <b>text / json / stream-json</b>；成本字段 <b>total_cost_usd</b>。"
    },
    {      q: "你和 Claude 花了半天改完一个 bug，现在要它总结改动、跑测试、提 PR。有哪些现成入口，别再手打一遍？",
      tag: "base",
      a: [
        "对话内：<b>/review</b> 让它审查自己的改动，<b>/commit</b> 或让它直接写 commit message；PR 描述可以让它基于 <code>git diff</code> 生成。",
        "外部集成：装好 <b>gh CLI</b> 后，Claude 能直接开 PR / issue，避免走 API 撞未认证限流；仓库里装 GitHub App 后，<b>在 issue 或 PR 评论里 @claude</b> 就能触发一次任务。",
        "验收环节：让它先跑一遍测试再总结，<b>给它一个可验证的信号</b>（测试退出码、构建产物、diff）比让它口头保证有效得多。"
      ],
      plus: "高阶做法：把这个流程固化成 <b>.claude/commands/ 下的自定义 slash command</b> 或 skill，一条命令跑完「跑测试 → 写总结 → 开 PR」，团队可复用。",
      warn: "让 Claude 自己总结就算验收——没有测试/构建退出码这类客观信号，总结再漂亮也可能是幻觉。",
      follow: "追问：你怎么验证它生成的 PR 描述和实际 diff 一致？",
      why: "这里的核心是<b>把一次性对话沉淀为可复用资产</b>。同一个流程你第二次手打时，就应该变成 slash command（提示词模板）或 skill（带脚本的流程）。判断标准：<b>只在你脑子里、每次都要重说的 → CLAUDE.md；多步流程但偶尔才用的 → skill；每次都要自动发生的 → hook</b>。这是 Claude Code 三层扩展的分工。",
      num: "入口：<b>/review</b>、<b>/commit</b>、<b>gh CLI</b>、<b>@claude</b> 触发；沉淀位置 <b>.claude/commands/</b> 与 <b>.claude/skills/</b>。"
    },
    {      q: "monorepo 里 Claude Code 频繁读错文件，还把别的包的规则套过来。CLAUDE.md 该怎么分层？",
      tag: "adv",
      a: [
        "先利用<b>目录就近加载</b>：Claude Code 会读取工作目录及其上级的项目记忆，并<b>在真正触及某个子目录时懒加载该目录下的 CLAUDE.md</b>。所以把包级约定写在 <code>packages/foo/CLAUDE.md</code>，而不是全堆在根上。",
        "根 CLAUDE.md 只放<b>全仓库通用且它猜不到的</b>：包管理器、构建编排命令、跨包依赖规则、提交规范；包级文件放该包的技术栈与禁令。",
        "大仓库用 <b>claudeMdExcludes</b> 显式排除不该加载的路径（例如其他团队的目录），避免启动时被一堆无关记忆占满窗口。"
      ],
      plus: "更精细的做法是用 <b>.claude/rules/*.md</b> 并在 frontmatter 里写 <b>paths</b> 字段（如 <code>src/api/**/*.ts</code>），让规则只在命中路径时加载——这是 monorepo 下控制基线体积的关键手段。",
      warn: "把所有包的约定合并成一个根目录巨型 CLAUDE.md——每次会话都全量加载，规则还互相污染。",
      follow: "追问：怎么确认某次会话到底加载了哪些记忆文件？",
      why: "monorepo 的上下文爆炸来自<b>基线体积随规模线性增长</b>：根记忆 + 所有包记忆若全量加载，任务还没开始窗口就去了三分之一。解法是<b>把全量加载改成条件加载</b>——目录就近懒加载解决空间维度，rules 的 paths 字段解决语义维度，claudeMdExcludes 解决噪音维度。三者配合，才能让「仓库多大」和「会话基线多大」解耦。",
      num: "三手段：<b>子目录 CLAUDE.md 懒加载</b>、<b>.claude/rules/ + paths frontmatter</b>、<b>settings 里的 claudeMdExcludes</b>；记忆目标 <b>200 行以内</b>。"
    },
    {      q: "面试官问「CLAUDE.md 有几个层级，谁覆盖谁？」你答完之后，最好再补哪一句？",
      tag: "adv",
      a: [
        "四层从低到高：<b>managed（企业托管，如 /etc/claude-code/CLAUDE.md）</b> → <b>user（~/.claude/CLAUDE.md）</b> → <b>project（./CLAUDE.md 或 .claude/CLAUDE.md，提交进 git）</b> → <b>local（CLAUDE.local.md，gitignored）</b>。",
        "关键机制：它们不是「选一个」，而是<b>全部合并</b>；层级只是决定<b>加载顺序与优先级</b>——越靠后加载的越具体，模型越倾向遵循。项目记忆内部，<b>离当前工作目录越近的文件优先级越高</b>。",
        "补充点：<b>.claude/rules/ 下的所有 .md 都会被加载</b>，是拆分长指令的推荐位置，不用把根目录文件撑大。"
      ],
      plus: "值得补的那句：<b>CLAUDE.local.md 这种「本地文件」在 git worktree 场景下会丢失或不随分支走</b>，推荐改用 <b>@~/.claude/my-preferences.md</b> 导入个人偏好——import 能跨 worktree 存活。",
      warn: "说「user 覆盖 project」——实际是合并叠加，且 project 内越靠近 cwd 优先级越高。",
      follow: "追问：企业托管的 CLAUDE.md 和普通项目文件冲突时怎么处理？",
      why: "分层的目的不是覆盖而是<b>叠加</b>：企业定底线（合规、禁止外发）、项目定事实（命令、目录）、个人定偏好（风格、编辑器）。如果设计成「上层覆盖下层」，企业策略就会被个人文件一句话干掉，这在企业场景不可接受。所以正确理解是<b>合并 + 优先级</b>，而 managed 层之所以特殊，是因为它由 IT 部署、用户改不了。",
      num: "四层：<b>managed &gt; user &gt; project &gt; local（优先级从低到高排列，合并而非覆盖）</b>；个人偏好推荐 <b>@~/.claude/xxx.md 导入</b>。"
    },
    {      q: "你把巨型 CLAUDE.md 拆成十个文件用 @import 引入，期望省上下文。结果没省，为什么？",
      tag: "adv",
      a: [
        "因为 <b>@import 不是懒加载</b>：<code>@path/to/file</code> 在<b>会话启动时就被展开并全量载入</b>，拆文件只改善可维护性，不减少 token。",
        "import 有明确约束：相对路径从包含文件所在目录解析，<b>最大跳转深度约 5 层</b>，循环引用会被检测并阻止，不存在的文件被静默忽略（这点很坑，写错路径不报错）。",
        "真正省上下文的手段是<b>按需</b>：<b>.claude/rules/ + paths 条件加载</b>、<b>skill（调用时才加载）</b>、以及把参考资料改成链接让 Claude 需要时再 Read。"
      ],
      plus: "实用模式：项目 CLAUDE.md 里写 <b>@AGENTS.md</b> 复用团队已有的通用约定文件，再叠一层薄的 Claude 专属内容——一份事实来源，多工具共享。",
      warn: "以为 @import 是懒加载，于是放心堆几十个导入文件——启动基线反而更大。",
      follow: "追问：import 的文件不存在时有什么现象？你怎么发现？",
      why: "import 解决的是<b>组织问题</b>不是<b>容量问题</b>。token 账单只关心最终进了多少字，拆成 10 个文件还是 1 个文件总量一样。所以判断标准是：<b>每次会话都必须知道的东西</b>才放记忆（无论怎么拆都省不掉）；<b>只有特定任务才需要的</b>必须走 skill 或让模型自己 Read。混淆这两类，是 CLAUDE.md 越写越胖的根本原因。",
      num: "import 约束：<b>相对路径解析、最深约 5 跳、循环引用被阻止、缺失文件静默忽略</b>；省上下文靠 <b>rules/paths</b> 与 <b>skill 按需加载</b>。"
    },
    {      q: "你的 CLAUDE.md 已经 400 行了，模型开始忽略中间的规则。除了删，还有什么结构化的改法？",
      tag: "adv",
      a: [
        "拆到 <b>.claude/rules/</b>：该目录下的 <b>所有 .md 都会被加载</b>，按主题分成 style.md、testing.md、security.md 等，既好维护又便于定位。",
        "给规则加 <b>paths frontmatter</b>：在文件头写 <code>paths: [\"src/api/**/*.ts\"]</code>，规则只在模型处理匹配文件时生效，把全量基线变成条件基线。",
        "把「多步操作流程」移出记忆，改成 <b>.claude/skills/&lt;name&gt;/SKILL.md</b>——skill 只在被调用时加载，不占用每次会话的基线。"
      ],
      plus: "判断口诀：<b>事实与禁令 → 记忆；步骤与流程 → skill；必须自动发生 → hook；只是你个人偏好 → ~/.claude/CLAUDE.md 或 import 个人文件</b>。",
      warn: "把 CLAUDE.md 拆成 rules 目录后以为会自动少加载——默认全部加载，不加 paths 等于白拆。",
      follow: "追问：rules 里的两条规则互相矛盾时，模型会听谁的？",
      why: "长 CLAUDE.md 的失效机制有两条，都要对症下药：一是<b>注意力稀释</b>——上下文里条目越多，单条被遵循的概率越低；二是<b>无关噪音</b>——改前端时加载后端规则纯属浪费。所以拆分解决不了稀释，必须靠<b>条件加载</b>削减绝对体积，靠<b>流程外置</b>把低频内容移出常驻区。目标不是「写得更短」，而是「基线只装这次用得上的」。",
      num: "目标 <b>200 行以内</b>；<b>.claude/rules/*.md 全量加载</b>；<b>paths frontmatter</b> 支持 glob 与花括号展开；skill 目录格式固定为 <b>skills/&lt;name&gt;/SKILL.md</b>。"
    },
    {      q: "你和 Claude 反复纠正「测试要跑 pnpm vitest 而不是 npm test」，第三次了。怎么让它自己记住？",
      tag: "adv",
      a: [
        "用 <b>#</b> 快捷键或 <b>/memory</b> 命令把修正直接写进记忆：输入 <code># 测试用 pnpm vitest</code>，Claude 会写入合适的记忆文件，下次会话自动带上。",
        "除了你手写的 CLAUDE.md，Claude Code 还有 <b>auto memory</b>——它自己记录学到的模式（构建命令、调试结论、你的偏好），存在 <b>~/.claude/projects/&lt;project&gt;/memory/</b>，<b>MEMORY.md 的前 200 行在会话开始时加载</b>，主题文件按需加载。",
        "auto memory 默认开启，可用 <b>/memory</b> 切换，或用环境变量 <b>CLAUDE_CODE_DISABLE_AUTO_MEMORY=1</b> 关闭；同仓库的所有 worktree 共享同一份记忆目录。"
      ],
      plus: "区分两类记忆很有用：<b>你写的 CLAUDE.md = 指令与规则</b>，<b>auto memory = 它学到的模式与偏好</b>。前者你可控可 review，后者省事但需要定期审视别积累错误结论。",
      warn: "以为 auto memory 记的一定对——它会把一次偶发失败当成通用规律记下来，久了反而误导。",
      follow: "追问：auto memory 记错了东西，你怎么排查和清理？",
      why: "双记忆系统解决的是<b>两类不同知识</b>：CLAUDE.md 装的是<b>稳定、可声明、需要团队一致</b>的事实（命令、约定、架构决策）；auto memory 装的是<b>涌现、难声明、个人化</b>的知识（这个坑我踩过、这个库版本有 bug）。前者必须进 git 被 review，后者是个人加速层。面试能指出「auto memory 也会记错，需要定期清理」会加分。",
      num: "路径 <b>~/.claude/projects/&lt;project&gt;/memory/</b>；<b>MEMORY.md 索引前 200 行</b>在会话开始加载；关闭用 <b>CLAUDE_CODE_DISABLE_AUTO_MEMORY=1</b>；记忆类型含 <b>user / feedback / project / reference</b>。"
    },
    {      q: "Claude Code 会在上下文快满时自动压缩。autocompact 的触发和行为你应该怎么向团队解释？",
      tag: "adv",
      a: [
        "机制：<b>autocompact 是水位线触发的自动摘要</b>——接近窗口上限时，Claude Code 自动把较早的对话与工具输出压成摘要，保留近期内容，让任务能继续跑而不中断。",
        "与手动 <b>/compact</b> 的关系：autocompact 是兜底（你不作为也会发生），/compact 是主动（你在合适时机做，能选摘要重点）；两者都会<b>重新从磁盘读回 CLAUDE.md</b>，所以记忆不会因压缩丢失。",
        "代价：摘要必然<b>损失细节</b>——被压掉的具体报错栈、某次失败尝试的教训、临时的文件名，都可能消失。"
      ],
      plus: "关键补丁：<b>CLAUDE.md 在 /compact 之后会被重新读取</b>，所以硬约束放记忆里是安全的；真正危险的是只存在于对话中的临时约定。",
      warn: "以为压缩后 Claude 还记得「刚才说的那个临时约定」——只存在于对话里的东西最先被压掉。",
      follow: "追问：压缩之后发现它忘了关键约束，你有什么补救动作？",
      why: "autocompact 的设计权衡是<b>用信息损失换任务连续性</b>：不压缩任务直接中断，压缩则可能丢细节。它把「要不要压缩」自动化，是因为大部分用户不会主动管理上下文；但它<b>无法自动判断什么重要</b>，所以摘要质量取决于前期结构——如果你把关键决定都写在记忆或 todo 里，压缩就安全；如果全靠对话口口相传，压缩就是灾难。",
      num: "要点：<b>autocompact 兜底、/compact 主动</b>；<b>CLAUDE.md 压缩后重读不丢</b>；损失的是对话中的临时细节。"
    },
    {      q: "你要把一次长会话压缩掉 80%，但又怕丢掉关键决策和失败教训。压缩前应该先做哪几件事？",
      tag: "adv",
      a: [
        "第一件：<b>把关键结论外置</b>——把本次会话确定的架构决策、接口约定、踩过的坑追加进 <b>CLAUDE.md 或 .claude/rules/</b>，因为它们压缩后会重读，不会丢。",
        "第二件：<b>让 Claude 先写一份结构化交接摘要</b>（改了哪些文件、当前状态、下一步、未解决的问题），再执行 /compact；这份摘要会成为压缩后上下文的地基。",
        "第三件：<b>先砍后压</b>——用 /clear 清掉无关任务、把大工具输出（全仓库 grep、超长日志）单独截断，再做压缩，摘要的输入更干净。"
      ],
      plus: "顺序很重要：<b>外置 → 写交接 → 砍噪音 → /compact</b>。反过来先压再补，等于让模型在丢失细节后再回忆细节，质量差很多。",
      warn: "直接 /compact 然后指望模型「应该还记得」——摘要不会偏爱你的关键决策。",
      follow: "追问：压缩后怎么快速验证它没丢关键约束？",
      why: "压缩的信息损失<b>不可控但可前置</b>。摘要器只能基于已有文本做取舍，它不知道你心里哪条重要，所以<b>把重要的东西提前移到「不会被压的区域」</b>才是根本解：记忆区（压缩后重读）、交接摘要区（压缩输入的最近内容）、todo 区（显式任务状态）。这也解释了为什么 TodoWrite 不只是 UI 装饰——它是抗压缩的显式工作记忆。",
      num: "三步：<b>结论外置到 CLAUDE.md / rules</b> → <b>写交接摘要</b> → <b>/clear 与截断噪音后 /compact</b>。"
    },
    {      q: "面试官追问「为什么说上下文是稀缺资源？」除了窗口大小，你还能讲出哪几层账？",
      tag: "deep",
      a: [
        "第一层 <b>容量账</b>：主 flow 模型上下文约 <b>200K token</b>（长上下文版本可达 1M），工具输出、文件内容、对话历史全在同一份预算里竞争，一次全仓库 grep 就能吃掉一大截。",
        "第二层 <b>注意力账</b>：窗口越满，模型对<b>早期指令的遵循度越低</b>——这就是 CLAUDE.md 写在开头却会「忘」的原因，不是模型任性，是长上下文的注意力衰减。",
        "第三层 <b>成本与延迟账</b>：每轮都要重发整段前缀，基线越大越慢越贵；好消息是<b>稳定的前缀能命中 prompt caching</b>，所以结构稳定的上下文反而省钱。"
      ],
      plus: "落地结论：<b>上下文管理的目标不是「塞满」而是「让每一轮的前缀都小而稳定」</b>——这直接决定了成本、延迟和指令遵循率三件事。",
      warn: "只讲「200K 会满」——容量只是最表层的那一层账。",
      follow: "追问：prompt caching 和上下文结构稳定有什么关系？",
      why: "「上下文是稀缺资源」是 agentic coding 的<b>第一性约束</b>，它同时是容量约束、质量约束和成本约束。三者还互相拉扯：为了省钱砍上下文会丢信息；为了保信息堆上下文会掉遵循率、涨延迟。因此工程手段都围绕<b>削减基线体积 + 提高信息密度 + 保持前缀稳定</b>展开——子代理隔离、规则条件加载、压缩、缓存友好结构，本质上都是同一件事的不同切面。",
      num: "三层账：<b>容量（约 200K，长上下文本可达 1M）/ 注意力衰减 / 成本与缓存</b>；管理目标是<b>小而稳定的前缀</b>。"
    },
    {      q: "你配了 Bash(npm test) 白名单，Claude 加个 -C /path 就失配又来问你。怎么配才稳？",
      tag: "adv",
      a: [
        "先认清匹配模型：<b>permissions 用的是 glob 通配，不是正则</b>。<code>*</code> 匹配任意内容，但 <b>Claude 常会自行插入参数或 flag</b>，导致精确串匹配失效。",
        "写法上用<b>前缀通配</b>收口：<code>Bash(npm test:*)</code>、<code>Bash(git log *)</code>、<code>Bash(ls *)</code>，比写死整条命令鲁棒；读类可以放宽到 <code>Read(*)</code>。",
        "但要清楚边界：<b>规则是声明式匹配，不可靠处要用 hook</b>——hook 能读到真实的 tool_input JSON 并做逻辑判断，是硬保证。"
      ],
      plus: "另外两类规则形态：<b>deny</b> 做硬否决（<code>Bash(rm -rf *)</code>、<code>Bash(sudo *)</code>、<code>Read(./.env)</code>），<b>ask</b> 做强制确认。<b>deny 优先级最高，压过任何层的 allow</b>。",
      warn: "写 <code>Bash(*)</code> 图省事——这类过宽规则要么被系统拦下，要么等于完全放弃控制。",
      follow: "追问：deny 规则和 hook 的 exit 2，两者在 bypassPermissions 下还生效吗？",
      why: "权限规则的匹配发生在<b>字符串层</b>，而命令的实际形态由模型生成，二者天然有 gap——模型会加 <code>-C</code>、加 <code>--</code>、换参数顺序。于是出现两难：<b>写太严 → 频繁失配、弹窗反弹</b>；<b>写太宽 → 等于放弃控制</b>。Claude Code 的解法是<b>双轨</b>：glob 规则负责「高频安全命令的顺滑体验」，hook 负责「必须成立的安全不变量」；同时系统会识别 <code>*</code>、<code>python:</code> 这类过宽的危险规则并不轻易放行。",
      num: "三态规则：<b>allow / ask / deny</b>；<b>glob 非正则</b>；<b>deny 压过所有层的 allow</b>；不可靠判定改用 <b>hook 读 tool_input</b>。"
    },
    {      q: "公司 IT 要统一管控，开发者又有个人偏好。settings 的分层和优先级怎么设计？",
      tag: "adv",
      a: [
        "四个位置：<b>~/.claude/settings.json</b>（用户全局）、<b>.claude/settings.json</b>（项目共享，提交进 git）、<b>.claude/settings.local.json</b>（项目个人，gitignored）、<b>managed policy</b>（企业部署，如 /etc/claude-code/ 或系统级目录）。",
        "优先级：<b>managed &gt; local &gt; project &gt; user</b>。同键覆盖，<b>但 hooks 是合并而非替换</b>——各层钩子会一起跑，这点常被误解。",
        "分工建议：企业放合规与硬约束（managed），团队放共享 hook 与命令白名单（project 提交），个人放自己的 allow 与模型偏好（local / user）。"
      ],
      plus: "实践细节：项目级 settings 里 hook 路径<b>用相对路径</b>（<code>.claude/hooks/guard.sh</code>），否则换台机器就失效；敏感的个人配置永远放 local 并确认已 gitignore。",
      warn: "以为项目 settings 会替换用户 settings 的 hooks——实际是合并，两层都跑。",
      follow: "追问：怎么在会话里audit当前生效的所有 hook 与规则？",
      why: "分层配置的本质是<b>把「谁能改什么」映射到文件系统权限</b>：企业层开发者改不动，项目层走 code review，个人层不进 git。这个设计让治理成本接近零——不需要额外平台，靠 git 与文件权限就完成了策略分发。唯一需要注意的是 hooks 合并语义：如果按「覆盖」理解，会出现「我明明改了配置怎么旧钩子还在跑」的困惑。",
      num: "优先级 <b>managed &gt; local &gt; project &gt; user</b>；<b>hooks 跨层合并，其他键覆盖</b>；<b>deny 规则跨层最高</b>。"
    },
    {      q: "同事问「既然有 permissions.deny，为什么还要 hooks？」你怎么一句话讲清两者的分工？",
      tag: "deep",
      a: [
        "一句话：<b>deny 是按名字匹配的事前否决，hook 是按内容判断的生命周期钩子</b>——前者回答「这个工具能不能用」，后者回答「这一步该不该发生、发生后要做什么」。",
        "能力差异：deny 只能基于 <b>工具名 + glob 参数</b> 做静态匹配；hook 能拿到<b>完整的 tool_input JSON</b>，可做任意逻辑判断，还能<b>修改输入</b>（updatedInput）或<b>在事后触发动作</b>。",
        "时机差异：deny 只在权限判定环节生效；hook 覆盖 <b>PreToolUse / PostToolUse / PermissionRequest / UserPromptSubmit / Stop / SubagentStop / SessionStart</b> 等完整生命周期。"
      ],
      plus: "典型分工举例：<b>禁止改 migrations 目录 → deny 或 PreToolUse hook（要可靠就用 hook）</b>；<b>每次改完文件自动 prettier → PostToolUse hook</b>；<b>结束时重跑测试不过就不许收工 → Stop hook</b>。",
      warn: "用 deny 去拦截「命令里包含某个子串」这类复杂条件——glob 做不到，必须 hook。",
      follow: "追问：hook 返回 allow，但企业层有 deny 规则，最终结果是什么？",
      why: "这是<b>声明式配置 vs 命令式扩展</b>的经典分野。声明式（allow/ask/deny）优点是易读、易审计、开销低，缺点是表达能力受限于模式匹配；命令式（hook）优点是图灵完备、可执行副作用，缺点是难审计、有性能与安全成本。成熟的治理是<b>用声明式覆盖 80% 的常见情况，用命令式守住那 20% 必须成立的不变量</b>，而不是二选一。",
      num: "分工：<b>deny = 静态匹配事前否决；hook = 全生命周期 + 可读 JSON + 可改输入 + 可做事后动作</b>。"
    },
    {      q: "Claude 读第三方 README 修 bug，你怕恶意指令被执行。注入风险在哪？",
      tag: "adv",
      a: [
        "风险升级点：<b>agent 有执行权</b>。普通聊天机器人的注入最多骗到一段文本，agentic coding 工具被注入则可能<b>直接导致文件被改、命令被执行、密钥被外发</b>。",
        "注入载体非常多：<b>README、issue/PR 评论、被读取的源码注释、依赖包内容、WebFetch 抓回的网页、工具返回的报错信息</b>——任何进入上下文的外部文本都是潜在载体。",
        "防护手段：<b>敏感操作必须权限确认</b>；把 <code>.env</code>、<code>secrets/**</code> 放进 <b>permissions.deny</b> 让它们根本进不了上下文；用 <b>PreToolUse hook</b> 拦截外发类命令（curl、nc、git push）；沙箱兜底。"
      ],
      plus: "流程层面的防护同样重要：<b>不可信仓库先在容器或 worktree 里跑</b>、<b>改动一律先看 diff 再合</b>、<b>CI 里绝不 bypassPermissions</b>。技术防线之外， review 是最后一道。",
      warn: "认为「模型足够聪明就不会被骗」——注入成功率与模型智能无单调关系，必须靠机制。",
      follow: "追问：如果注入指令伪装成你自己的 CLAUDE.md 规则，怎么区分？",
      why: "提示注入在 agentic setting 下从「内容安全问题」升级为「权限提升问题」，因为<b>数据通道与指令通道没有边界</b>——模型读到的一段文字同时可能是要执行的指令。目前没有彻底解法，工程上只能做<b>纵深防御</b>：减少不可信内容进入（deny 敏感路径）、限制被注入后的破坏半径（沙箱、权限、hook）、以及事后可审计（diff review、transcript）。接受「无法根治，只能收敛影响」是成熟回答。",
      num: "防护清单：<b>deny 敏感路径 / 敏感操作强制确认 / PreToolUse 拦截外发命令 / 沙箱 / 容器与 worktree 隔离 / diff review</b>。"
    },
    {      q: "你要给团队配一套 Claude Code 自动化，先要理清 hooks 能挂在哪些事件上。请列出事件与典型用途。",
      tag: "adv",
      a: [
        "<b>PreToolUse</b>：工具执行<b>前</b>触发，可拦截（exit 2）或修改输入（updatedInput）；典型用途是拦危险命令、禁止改 migrations。",
        "<b>PostToolUse</b>：工具执行<b>后</b>触发，拿得到 tool_result；典型用途是 Edit/Write 后自动跑 prettier、eslint。",
        "<b>UserPromptSubmit</b>：用户发消息时触发，可通过 <b>additionalContext</b> 注入动态上下文（当前 sprint 信息、最新报错日志）；也可用于校验/拦截请求。"
      ],
      plus: "其余常用事件：<b>Stop</b>（Claude 结束回复时，用 decision:block 可强制它继续，适合做「测试不过不许收工」）、<b>SubagentStop</b>（子代理结束）、<b>SessionStart</b>（可配合 <b>CLAUDE_ENV_FILE</b> 持久化环境变量）、<b>PermissionRequest</b>（接管权限提示）、<b>PreCompact</b>。",
      warn: "所有需求都用 PreToolUse——格式化该放 PostToolUse，收尾校验该放 Stop。",
      follow: "追问：Stop hook 强制继续，会不会导致死循环？",
      why: "hook 的价值在于<b>把生命周期暴露成可编程的横切点</b>，且三个位置解决三类不同问题：<b>事前</b>解决「不该发生」（安全不变量），<b>事后</b>解决「忘了做」（格式化、校验、日志），<b>边界点</b>（提交、结束、会话开始）解决「上下文与流程注入」。理解这个三分法，就能把任何需求快速归类到正确的事件上，而不是一律塞进 PreToolUse。",
      num: "事件：<b>PreToolUse / PostToolUse / UserPromptSubmit / Stop / SubagentStop / SessionStart / PermissionRequest / PreCompact</b>；<b>PreToolUse 专属三态 decision：allow / deny / ask</b>。"
    },
    {      q: "你写了一个 PreToolUse hook 拦截危险命令，用 exit 1 表示「不允许」，结果命令照样执行了。为什么？",
      tag: "adv",
      a: [
        "因为<b>只有 exit 2 表示阻断</b>：<b>exit 0 = 放行（默认）</b>，<b>exit 2 = 阻断并把 stderr 作为错误信息回传给模型</b>，<b>exit 1 及其他非零码 = hook 自身出错，被静默忽略、动作照常执行</b>。",
        "这是刻意的设计：<b>出 bug 的 hook 不应该让整个工具瘫痪</b>。所以脚本崩溃、命令不存在、依赖缺失都退化为「不拦截」，而不是「全拦截」。",
        "要精细控制则退 0 并往 stdout 打 JSON：PreToolUse 用 <b>hookSpecificOutput.permissionDecision</b>（allow/deny/ask）+ reason；PostToolUse 与 Stop 用顶层 <b>decision: \"block\"</b>。"
      ],
      plus: "重要限制：<b>exit 2 时 JSON 会被忽略</b>，两种返回方式不要混用。另外 <b>hook 返回 allow 不能压过 deny 规则</b>——任何层（含 managed）的 deny 都优先。",
      warn: "用 exit 1 表达阻断，或者 exit 2 的同时还打印 JSON 指望被读取。",
      follow: "追问：多个 hook 同时匹配一个事件时，执行顺序和结果如何合并？",
      why: "退出码语义是<b>故障安全（fail-open）与故障封闭（fail-closed）的取舍</b>。安全直觉会说 hook 出错就该阻断，但那会让一个拼写错误直接冻结所有人的工作流，实际运维中不可接受。Claude Code 选择 <b>fail-open + 单一明确阻断码</b>：只有作者显式写 exit 2 才阻断，其余一切异常都不改变既有行为。代价是安全人员必须额外保证 hook 的健壮性，不能依赖「出错即安全」。",
      num: "退出码：<b>0 放行 / 2 阻断（stderr 回传）/ 1 及其他 = 忽略</b>；<b>exit 2 时忽略 JSON</b>；<b>默认超时 60 秒</b>；<b>多个匹配 hook 并行执行、相同命令自动去重</b>。"
    },
    {      q: "团队抱怨「Claude 改完代码总是忘了跑 prettier」。用 hook 一次性根治，你怎么配？",
      tag: "adv",
      a: [
        "在 <b>.claude/settings.json</b> 配 <b>PostToolUse</b>，matcher 用 <b>Edit|Write</b>，命令为 <code>npx prettier --write \"${tool_input.file_path}\"</code>。",
        "hook 通过 <b>stdin 收到 JSON</b>（含 session_id、transcript_path、cwd、tool_name、tool_input、tool_result），用 <code>jq</code> 取字段即可；这样每个被编辑的文件都会被自动格式化，<b>不依赖模型记得</b>。",
        "项目级配置里 hook 路径<b>用相对路径</b>（<code>.claude/hooks/lint.sh</code>）并用 <b>${CLAUDE_PROJECT_DIR}</b> 定位项目根，保证团队每台机器都能跑。"
      ],
      plus: "进阶：把「跑测试」放到 <b>Stop hook</b>——Claude 想结束时就跑一遍，失败则 <b>decision:block</b> 强制它继续修。这比 PostToolUse 跑测试省很多 token（不必每改一个文件就跑一次）。",
      warn: "把 npm test 也放进 PostToolUse——每改一个文件跑一次全量测试，会话会被拖垮。",
      follow: "追问：formatter 改了文件后，Claude 上下文里的文件内容是不是就过期了？",
      why: "这里体现了 hook 相对「写在 CLAUDE.md 里提醒它」的根本优势：<b>提醒是概率性的，钩子是确定性的</b>。模型在长上下文后会忽略指令、在赶任务时会跳过步骤；而 hook 由运行时在每次工具调用后执行，<b>模型无法绕过</b>。选型上还要注意频率——<b>高频低成本动作放 PostToolUse（格式化），低频高成本动作放 Stop（测试、构建）</b>，放反了会严重拖慢会话。",
      num: "配置：<b>PostToolUse + matcher \"Edit|Write\"</b>；环境变量 <b>CLAUDE_PROJECT_DIR</b>；<b>stdin 收 JSON</b>；<b>默认超时 60s</b>；验收放 <b>Stop + decision:block</b>。"
    },
    {      q: "要保住「绝不删库、绝不 force push、绝不读 .env」，用 hook 写在哪一层、怎么判定？",
      tag: "adv",
      a: [
        "写在 <b>PreToolUse</b>，matcher 为 <b>Bash</b>（也可加 Edit|Write 做路径管控）。规则性强的部分优先用 <b>permissions.deny</b>；<b>需要逻辑判断的部分用 hook</b>，两者叠加。",
        "判定脚本从 stdin 读 JSON，取 <code>.tool_input.command</code>，用正则/子串匹配 <code>rm -rf</code>、<code>sudo</code>、<code>git push --force</code>、<code>curl</code> 外发等模式，命中则 <b>exit 2</b> 并把原因打到 stderr 回传给模型。",
        "敏感文件读取用 deny 更简洁：<code>Read(./.env)</code>、<code>Read(./.env.*)</code>、<code>Read(./secrets/**)</code>——既挡住读取，也避免密钥进入上下文和外发。"
      ],
      plus: "别忘了自保：<b>Claude 能用 Edit 改 settings.json 从而卸掉你的 hook</b>。用 <b>/hooks</b> 菜单 review 变更（直接改 hook 配置需在该菜单确认），或再加一条 hook 拦截对 CLAUDE.md 与 settings 文件的编辑。",
      warn: "只配 hook 就以为万无一失——Claude 可能 Edit 掉 settings.json，配置自身也需保护。",
      follow: "追问：模型看到被拦截后换了个等价命令绕过，你的 hook 怎么演进？",
      why: "拦截策略要分两条线：<b>数据外泄线</b>用 deny 从源头掐断（读不到就发不出去），因为 deny 是声明式、跨层最高优先级、且能避免敏感内容进入上下文；<b>破坏性动作线</b>用 hook，因为命令形态千变万化，需要逻辑判断。另外必须意识到<b>配置的完整性本身是攻击面</b>——agent 有写权限就可能在理论上修改自己的规则，所以对配置文件本身的保护要单独设计。",
      num: "要点：<b>PreToolUse + Bash matcher + exit 2</b>；敏感路径用 <b>deny Read(./.env) 等</b>；自保需 <b>/hooks review</b> 或拦截对配置文件的编辑。"
    },
    {      q: "你想定义一个「代码审查员」角色，让 Claude 每次改完代码自动派它去挑刺。怎么实现？",
      tag: "adv",
      a: [
        "用 <b>subagent（子代理）</b>：在 <b>.claude/agents/</b>（项目级）或 <b>~/.claude/agents/</b>（全局）放一个 Markdown 文件，文件名即子代理名。",
        "文件头是 <b>YAML frontmatter</b>：<b>name</b>、<b>description</b>（决定何时被自动委派，最关键）、可选 <b>tools</b>（如 Read, Grep, Glob）与 <b>model</b>（sonnet/opus/haiku）；正文是它的系统提示词。",
        "主 agent 通过 <b>Task / Agent 工具</b> 派发，也可以靠 description 让 Claude 自动判断何时委派；也可用 <b>--agents</b> 以 JSON 内联定义。"
      ],
      plus: "审查类子代理建议<b>只给只读工具</b>（Read/Grep/Glob），并给它<b>对抗性目标</b>（找出能推翻这次改动的问题）。独立上下文让它不会像实现者那样为自己的方案辩护。",
      warn: "description 写得太泛（如「帮忙写代码」）——委派时机全靠它，写泛了要么从不触发要么总是触发。",
      follow: "追问：子代理能不能再派子代理？",
      why: "子代理在这里同时解决两个问题：<b>角色隔离</b>（审查者的系统提示与实现者不同，不会被实现者的思路带偏）和<b>上下文隔离</b>（审查时读的一堆文件不进主会话）。后者尤其关键——如果让主 agent 自己审，它读的证据会永久占据窗口；而子代理<b>只回传一份结论摘要</b>，主上下文保持干净。这就是「对抗性 review 用子代理」比「让它自己检查」有效的根本原因。",
      num: "位置 <b>.claude/agents/ 或 ~/.claude/agents/</b>；字段 <b>name / description / tools / model</b>；派发工具 <b>Task / Agent</b>；内置子代理 <b>Explore、Plan、general-purpose</b>。"
    },
    {      q: "面试官问「为什么 subagent 的上下文隔离被认为是核心设计？」你怎么从第一性原理回答？",
      tag: "deep",
      a: [
        "直接收益：<b>子代理在自己的上下文窗口里工作，只把结论摘要回传主会话</b>。调研时读的 40 个文件、试错的日志，都不会污染主上下文。",
        "质量收益：<b>隔离带来独立性</b>。子代理没有主会话的既有成见，做对抗性审查时不会因为「这是我刚写的」而自我辩护——独立上下文能发现实现者合理化掉的问题。",
        "成本收益：主上下文越小越稳，<b>前缀小 → 每轮重发便宜、缓存命中率高、指令遵循度好</b>；把探索性工作外置是控制主上下文体积最有效的手段。"
      ],
      plus: "反过来说代价：<b>子代理看不到主会话的细节，需要你把任务描述写清楚</b>；且它的消耗计入同一份用量限额，不是免费的并行算力。",
      warn: "以为子代理是「并行省钱」的手段——它省的是主上下文，不省 token 总量，计费仍归同一会话。",
      follow: "追问：什么任务不适合派给子代理？",
      why: "上下文污染是长任务失败的主因之一：<b>探索性工作产生的信息量远大于它的结论价值</b>——读 40 个文件可能只为了确认「连接串在 config/db.ts」。若全进主窗口，几次调研就把预算吃光，后面的实现反而在低质量上下文中进行。子代理把「信息采集」与「信息使用」解耦：<b>采集在隔离窗口里大量发生，使用只保留蒸馏后的结论</b>。这本质是一种上下文层面的 map-reduce。",
      num: "三点：<b>只回传摘要（不污染主窗口）/ 独立性带来审查质量 / 主前缀小 → 成本低遵循好</b>；注意<b>用量计入同一限额</b>。"
    },
    {      q: "你接手一个陌生仓库，想让 Claude 摸清「哪里在建立数据库连接」，但不想让它读 40 个文件把上下文撑爆。怎么干？",
      tag: "adv",
      a: [
        "派 <b>Explore 子代理</b>：它是内置的<b>只读快速检索与分析</b>子代理，专门做这类代码库调研，返回结论而不是原始文件内容。",
        "明确要求它<b>只回传路径 + 结论 + 关键代码片段</b>，不要贴整文件；主会话拿到的就是一份 condensed 报告。",
        "如果这类调研反复出现，就在 <b>.claude/agents/</b> 定义一个专用子代理，<b>tools 限定为 Read, Grep, Glob</b>，把「只读不写」制度化。"
      ],
      plus: "配套习惯：<b>用 @ 精准指定文件</b>比让它自己搜省得多；同时用 <b>permissions.deny</b> 屏蔽 <code>.env</code>、<code>node_modules</code>、日志目录，既省上下文又防敏感信息入对话。",
      warn: "任何「找一下代码里有没有 X」都派子代理——小问题用 Grep 更便宜更快。",
      follow: "追问：子代理返回的摘要不可信/太粗时，你怎么处理？",
      why: "这道题的本质是<b>检索成本的外置</b>。代码库调研是典型的「高信息采集量、低结论密度」任务，直接在主会话做会产生两个恶果：窗口被撑满触发压缩、后续实现质量下降。子代理是标准的解法，但还有更便宜的一层：<b>先用 @ 和 deny 缩小搜索空间</b>，能不派就不派。判断顺序应是 <b>@ 指定 → Grep/Glob 定向 → 子代理调研</b>，别一上来就派 agent。",
      num: "内置子代理 <b>Explore（只读检索）/ Plan（plan mode 下调研）/ general-purpose</b>；自定义子代理放 <b>.claude/agents/</b>；配合 <b>@ 精确指定</b> 与 <b>deny 屏蔽目录</b>。"
    },
    {      q: "你想让 Claude Code 连公司内部的需求系统、数据库和监控。怎么接，接的时候要注意什么？",
      tag: "adv",
      a: [
        "用 <b>MCP（Model Context Protocol）</b>：通过 <code>claude mcp</code> 配置 MCP server，或用 <b>--mcp-config ./mcp.json</b> 加载；接入后 server 暴露的工具可被直接调用。",
        "作用域有三档：<b>local（仅当前项目）/ project（.mcp.json 提交进仓库，团队共享）/ user（全局）</b>；共享的走 project 并进 git review。",
        "命名与权限：MCP 工具名形如 <b>mcp__&lt;server&gt;__&lt;tool&gt;</b>，可在 permissions 里用 <code>mcp__memory__.*</code> 这类模式放行，也可在 hook matcher 中匹配。"
      ],
      plus: "CI/无人值守场景加 <b>--strict-mcp-config</b>：<b>只使用显式传入的 MCP server，不继承用户本机配置</b>——既保证环境一致，也减少启动时的上下文与扫描开销。",
      warn: "接一堆 MCP server 却不管权限——第三方工具同样能改文件、发请求，必须进 allow/deny 与 hook。",
      follow: "追问：MCP 工具太多导致上下文基线变大，怎么缓解？",
      why: "MCP 解决的是<b>核心工具集的扩展性问题</b>：内置工具刻意保持少量通用，专有能力靠开放协议接入。但引入 MCP 有两个隐性成本必须点明：<b>上下文成本</b>（每个 server 的工具定义都占窗口，接太多会显著抬高基线）与<b>权限成本</b>（第三方 server 等于给模型新的执行能力，其工具同样要纳入 allow/deny 与 hook 治理）。所以原则是<b>按需接入、显式声明、纳入权限模型</b>。",
      num: "配置 <b>claude mcp</b> 或 <b>--mcp-config</b>；作用域 <b>local / project / user</b>；工具名 <b>mcp__server__tool</b>；CI 用 <b>--strict-mcp-config</b>。"
    },
    {      q: "同事用 .claude/commands，你用 .claude/skills。command 和 skill 怎么选？",
      tag: "adv",
      a: [
        "共同点：都能被 <code>/name</code> 触发，都是 Markdown 提示词文件，都能带参数。",
        "关键差异在<b>加载时机</b>：<b>slash command 通常需要你显式调用</b>；<b>skill 由 Claude 根据 description 自主判断何时调用</b>，也可以你手动调用。skill 的目录格式固定为 <b>skills/&lt;name&gt;/SKILL.md</b>，可附带脚本与参考资料。",
        "另一个差异：<b>skill 支持渐进加载</b>——先只有描述进上下文，命中后才加载正文，因此对上下文更友好；适合承载较长、较复杂的流程。"
      ],
      plus: "选择口诀：<b>确定由人触发、短小直接 → slash command；希望模型自己判断何时用、流程复杂还带脚本 → skill；每次必须自动发生、无需触发 → hook</b>。",
      warn: "把 skill 目录写成 <code>skills/xxx.md</code> 单文件——只认目录格式，单文件不会被加载。",
      follow: "追问：skill 的 description 写得不好会有什么后果？",
      why: "三者的分野其实是<b>触发权归属</b>与<b>加载成本</b>的二维划分。触发权在人 → command；触发权在模型 → skill；无需触发 → hook。加载成本上，常驻的记忆最贵、command 次之、skill 最省（按需）。所以一个成熟的仓库里，<b>高频硬知识在 CLAUDE.md、交互流程在 command、专家能力在 skill、不变量在 hook</b>，四类资产各司其职，不能互相替代。",
      num: "目录：<b>.claude/commands/</b> 与 <b>.claude/skills/&lt;name&gt;/SKILL.md</b>；SKILL.md 用 <b>YAML frontmatter</b> 配 name/description；skill 支持<b>按需加载与附带脚本</b>。"
    },
    {      q: "你想让「跑测试 → 修 lint → 写 PR 描述」这条流程在团队里复用，且带脚本。做成什么形态最合适？",
      tag: "adv",
      a: [
        "做成 <b>skill</b>：在 <b>.claude/skills/pr-prep/SKILL.md</b> 写流程说明，并把实际脚本放在同目录下，SKILL.md 里引用相对路径调用。",
        "frontmatter 里把 <b>description</b> 写成明确的触发条件（如「准备提交或开 PR 前使用」），让 Claude 能自主判断何时启用，也可以 <code>/pr-prep</code> 手动触发。",
        "提交进 git 让团队共享；需要覆盖个人差异的部分，通过 <b>@~/.claude/xxx.md</b> 导入个人偏好，而不是改共享 skill。"
      ],
      plus: "把可验证性写进 skill：<b>流程每一步都要有客观信号</b>（测试退出码、lint 退出码、diff 输出），并规定「信号不通过就不许进入下一步」——这比让模型口头汇报可靠得多。",
      warn: "把长流程写进 CLAUDE.md「方便它看到」——常驻成本远大于收益。",
      follow: "追问：skill 里的脚本失败了，Claude 会怎么处理？你怎么让它不瞎改脚本？",
      why: "带脚本的多步流程最忌讳放进 CLAUDE.md：它会<b>常驻占用每次会话的基线</b>，而这类流程 90% 的会话用不到。skill 的按需加载正好匹配。同时把脚本与提示词放在同一目录，解决了「提示词描述流程、脚本保证确定性」的配合问题——<b>提示词负责编排与判断，脚本负责确定性执行</b>，这也是 agent 工程里最稳的分工。",
      num: "形态：<b>.claude/skills/&lt;name&gt;/SKILL.md + 同目录脚本</b>；<b>frontmatter 决定触发</b>；共享进 git，个人差异用 <b>@ 导入</b>。"
    },
    {      q: "产品经理也要用 Claude Code 看代码，但嫌它的输出太技术黑话。有什么现成机制能改输出风格？",
      tag: "adv",
      a: [
        "用 <b>output styles（输出风格）</b>：它可以<b>调整 Claude 的表达方式与详略</b>，而不改变它的工具能力——适合面向不同受众切换。",
        "更通用的做法：<b>在 CLAUDE.md 或 system prompt 里写明受众与格式</b>（如「用非技术语言解释，先结论后细节，避免贴大段代码」），用 <b>/output-style</b> 相关入口或配置切换。",
        "若只是偶尔需要，用 <b>--append-system-prompt</b> 追加要求，或在会话里直接说——不必改共享配置。"
      ],
      plus: "区分清楚：<b>output style / system prompt 改的是『怎么说』；permission 与 hook 改的是『能做什么』</b>。别试图用提示词去实现权限约束，那是概率性的。",
      warn: "为了「让它别乱来」而在提示词里写一堆禁令——提示词是软约束，硬约束用 deny 与 hook。",
      follow: "追问：用 --system-prompt 完全替换默认提示词会有什么副作用？",
      why: "表达层与能力层的分离是良好 agent 设计的标志。<b>表达层</b>（output style、system prompt、CLAUDE.md 里的语气约定）成本低、可因人而异、允许模糊；<b>能力层</b>（工具集、权限、hook）必须确定、必须一致、不该因人而异。混淆二者是常见错误——比如为了让输出简洁而限制工具，或为了安全而在 system prompt 里写「不要删文件」（应改用 deny/hook）。",
      num: "手段：<b>output styles / --append-system-prompt / CLAUDE.md 受众约定</b>；原则 <b>表达层与能力层分离</b>。"
    },
    {      q: "想把 hooks、subagents、commands 打包给全公司复用，而不是每仓库复制。有什么机制？",
      tag: "adv",
      a: [
        "用 <b>plugins（插件）</b>：把 <b>commands、agents、skills、hooks、MCP server 配置</b>打包成一个可分发单元，通过 marketplace 安装与更新。",
        "分层仍然存在：<b>managed（企业下发）/ user（~/.claude/）/ project（.claude/）</b> 三层都能承载同类资产，<b>优先级 managed &gt; local &gt; project &gt; user</b>。",
        "企业内部规范优先走 <b>managed policy</b> 下发（IT 部署、用户改不动），团队共享的走项目目录提交进 git，个人实验放 user 层。"
      ],
      plus: "配套治理：插件里的 <b>hook 会以你的用户权限执行任意 shell 命令</b>，所以<b>安装第三方插件等同于信任其作者</b>——企业场景应做白名单与代码 review，并用 <b>/hooks</b> 定期审计当前生效的钩子。",
      warn: "随意安装第三方插件/marketplace 包——里面的 hook 以你的权限执行任意命令。",
      follow: "追问：怎么审计当前会话实际加载了哪些 hook 与插件资产？",
      why: "插件机制解决的是<b>配置资产的复用与分发</b>问题，但它把风险也一并打包了：<b>配置即代码，且以用户权限执行</b>。所以企业级使用必须建立<b>供应链信任</b>——来源白名单、review、版本锁定、以及运行时的可审计（/hooks 能看到每层配置的钩子）。这与 npm 生态面对的问题是同构的，可以类比来讲。",
      num: "打包内容 <b>commands / agents / skills / hooks / MCP</b>；三层 <b>managed / user / project</b>；审计用 <b>/hooks</b>；风险点是 <b>hook 以用户权限执行</b>。"
    },
    {      q: "你要做一个跨十个文件的大重构，直接让 Claude 改你心里没底。plan mode 怎么用才对？",
      tag: "adv",
      a: [
        "进 <b>plan mode</b>（<b>Shift+Tab</b> 循环切换）：此模式下 <b>Claude 只读，不能写入或执行命令</b>，只做调研与方案讨论。",
        "用法：先让它读代码、派 <b>Plan 子代理</b> 做只读调研，产出一份含<b>涉及文件、改动步骤、风险与验证方式</b>的计划；你确认后再退出 plan mode 执行。",
        "把「如何验证」写进计划：<b>哪个测试、哪个构建命令、什么退出码算通过</b>。没有验证信号的计划等于没计划。"
      ],
      plus: "关键认知：<b>plan mode 的价值不是「生成一份文档」，而是把「探索」与「执行」分成两个受控阶段</b>——探索阶段零风险（改不了东西），执行阶段零歧义（方案已定）。",
      warn: "把 plan mode 当「让它先随便看看」，没把验证方式写进计划——执行完仍然无法判断成败。",
      follow: "追问：plan mode 下 Claude 想跑命令验证假设，你会放行吗？",
      why: "plan mode 是对 <b>不可逆动作的前置闸门</b>。agentic 工具的风险集中在写与执行，而调研是免费且可逆的；把它们分离后，人类的注意力可以集中在唯一的决策点上——<b>批准方案</b>。这也顺带解决了上下文问题：方案一旦确定，执行阶段不需要再保留全部探索过程，可以 /clear 后带着计划轻装开工。",
      num: "入口 <b>Shift+Tab 切到 plan mode</b>；配套 <b>Plan 子代理</b>（只读调研）；计划必含<b>验证信号（测试/构建退出码）</b>。"
    },
    {      q: "Claude 在做一个 15 步的重构，做到第 9 步开始偏离目标、重复劳动。TodoWrite 在这里起什么作用？",
      tag: "adv",
      a: [
        "<b>TodoWrite</b> 让模型把任务拆成<b>显式的、可勾选的列表</b>并持续更新状态，把「我打算干什么」从隐式意图变成上下文里的可见结构。",
        "三个作用：<b>抗漂移</b>（每步都能对照列表检查是否偏离）、<b>抗压缩</b>（任务状态是结构化要点，比散落在对话里更可能在摘要中存活）、<b>可观测</b>（人能实时看到进度与卡点）。",
        "实践上：<b>任务超过 3~5 步就应该显式拆列表</b>；一步做错时先看列表是否本身就错了，而不是让模型在错误计划上继续。"
      ],
      plus: "进阶用法：<b>列表项要写验收标准而不只是动作</b>（如「抽出 parser 模块，且 tests/parser 全绿」）。验收标准进了上下文，模型就有了自我检查的锚点。",
      warn: "把 todo 列表当成给人类看的进度条——它首先是给模型用的目标锚点。",
      follow: "追问：todo 列表本身定错了，模型会自己纠正吗？",
      why: "TodoWrite 本质是<b>给模型一块抗衰减的显式工作记忆</b>。长任务的失败模式不是「模型不会做」，而是<b>目标在上下文中逐渐稀释</b>——早期目标被后来的工具输出挤到注意力边缘。把目标外置成结构化列表并反复重写进上下文，等于每隔几步就重新注入一次任务定义。这也解释了为什么它和 /compact 是互补的：<b>列表是压缩后最应该保留的东西</b>。",
      num: "三作用：<b>抗漂移 / 抗压缩 / 可观测</b>；门槛 <b>任务超过 3~5 步就该拆</b>；写法 <b>动作 + 验收标准</b>。"
    },
    {      q: "你想同时跑三个 Claude Code 实例分别做「重构」「写测试」「改文档」，怎么避免它们互相踩？",
      tag: "adv",
      a: [
        "用 <b>git worktree</b>：为每个实例建独立工作树，各自 checkout 到自己的工作目录，<b>文件系统层面天然隔离</b>，不会同时改同一个工作副本。",
        "配套隔离：<b>每个实例用独立分支</b>；涉及端口/临时文件时显式错开（不同 PORT、不同 tmp 目录）；跑 dev server 时尤其注意。",
        "记忆层面：<b>auto memory 按工作树维度共享</b>（同仓库的 worktree 共享一份记忆），所以个人偏好类的临时约定不要依赖它跨实例传递。"
      ],
      plus: "更轻量的替代：短任务可以用<b>会话内的子代理并行</b>或后台 agent；需要长时间独立跑、还要各自 review 的才值得开 worktree + 多实例。",
      warn: "三个实例跑在同一工作副本上，靠「它们应该不会同时改一个文件」的侥幸——必然冲突。",
      follow: "追问：最后怎么把三个 worktree 的改动合并回来？",
      why: "并行的核心矛盾是<b>共享可变状态</b>：同一个工作副本、同一个数据库、同一个端口都是竞争资源。worktree 解决的是最基础的一层——<b>代码文件</b>。但它不解决其他共享状态，所以需要显式错开端口与临时目录。另外一个常被忽略的点是 <b>worktree 与记忆</b>：本地文件（如 CLAUDE.local.md）不随 worktree 走，所以个人偏好应改用 <b>@~/.claude/xxx.md</b> 导入——import 能跨 worktree 存活。",
      num: "隔离手段：<b>git worktree + 独立分支 + 错开端口/临时目录</b>；记忆 <b>worktree 间共享</b>；个人偏好用 <b>@~/.claude/xxx.md</b>。"
    },
    {      q: "要在 GitHub Actions 里让 Claude 响应 issue 评论自动改代码提 PR。最小工作流怎么配？",
      tag: "adv",
      a: [
        "用官方 action <b>anthropics/claude-code-action</b>，在 <code>.github/workflows/claude.yml</code> 里配置；最快的方式是在 Claude Code 里跑 <b>/install-github-app</b>，它会自动装 GitHub App、加 secret 并开一个带工作流的 PR。",
        "触发条件：<b>issue_comment 或 pull_request_review_comment 且评论体包含 @claude</b>；job 需要 <b>contents: write、pull-requests: write、issues: write、id-token: write</b> 等权限。",
        "密钥：<b>ANTHROPIC_API_KEY 存为 repository secret</b>，绝不硬编码；checkout 用 <code>fetch-depth: 1</code> 减少无关历史。"
      ],
      plus: "生产化要点：<b>给 workflow 加并发取消与超时</b>、<b>限制可触发的人（避免任意外部评论触发）</b>、<b>明确 --allowedTools 与 --max-turns</b>，并且<b>CI 里绝不使用 bypassPermissions</b>。",
      warn: "对任意外部评论都触发且不限工具——等于给互联网上一个带仓库写权限的 agent 入口。",
      follow: "追问：外部用户在 issue 里 @claude 会触发吗？怎么防？",
      why: "把 agent 接进 CI 的本质是<b>把「人点确认」换成「工作流声明边界」</b>，所以生产化的重点不在 prompt 而在治理：<b>谁能触发</b>（权限收敛到可写成员，否则外部评论就是注入入口）、<b>能做什么</b>（allowedTools）、<b>能跑多久花多少</b>（timeout、max-turns、max-budget-usd）、<b>能否追溯</b>（PR diff、日志）。少任何一项，agent 在 CI 里都是不可控的。",
      num: "关键项：<b>anthropics/claude-code-action</b>、<b>/install-github-app</b>、<b>@claude 触发</b>、<b>ANTHROPIC_API_KEY 存 secret</b>、<b>--allowedTools + --max-turns</b>。"
    },
    {      q: "团队有人只用终端、有人离不开 IDE。Claude Code 在 IDE 里的集成形态是什么，有什么取舍？",
      tag: "adv",
      a: [
        "形态：<b>VS Code / JetBrains 插件</b>把 Claude Code 的会话挂进侧边栏，<b>改动以 diff 形式在编辑器里呈现</b>，选中代码可直接提问。",
        "底层：<b>仍是同一个 CLI 进程在跑</b>，插件是它的一个前端；因此 CLAUDE.md、settings、hooks、subagents 全部照常生效，不需要两套配置。",
        "取舍：<b>IDE 优势是 diff 可视化与选区上下文</b>（审查体验好）；<b>终端优势是可脚本化、可并行、可进 CI</b>。"
      ],
      plus: "推荐工作流：<b>日常改动在 IDE 里看 diff 审查，批处理与 CI 走终端 headless</b>。二者共用一套配置，所以团队规范只需维护一份。",
      warn: "以为 IDE 版是另一套产品、要另外配一套规则与钩子——实际共用同一份配置。",
      follow: "追问：IDE 里触发的会话能拿到编辑器当前选区吗？",
      why: "「一个内核、多个前端」是架构上的关键设计：<b>agent 的能力与治理在 CLI 内核里，IDE 只是渲染与输入法</b>。这带来的最大好处是<b>治理资产不分裂</b>——hooks、权限、记忆只有一份真源，不会因为有人用 IDE 就绕过约束。反面例子是某些工具把 agent 逻辑做进插件，导致 IDE 内外行为不一致、配置两套。",
      num: "要点：<b>IDE 插件是 CLI 的前端</b>、<b>CLAUDE.md/settings/hooks 全部共用</b>、<b>diff 可视化是 IDE 的主要增益</b>。"
    },
    {      q: "Claude Code 里 Sonnet / Opus / Haiku 怎么分工？一次会话里该怎么切换？",
      tag: "adv",
      a: [
        "大致分工：<b>Opus 适合复杂推理与架构决策</b>（方案设计、疑难 bug），<b>Sonnet 是日常编码的默认主力</b>（速度与质量平衡），<b>Haiku 适合高频轻量任务</b>（格式化、批量小改、子代理检索）。",
        "切换方式：启动时 <b>--model</b>（可用别名 sonnet/opus/haiku 或完整模型名），会话内用 <b>/model</b>；子代理可在 frontmatter 里单独指定 <b>model</b>。",
        "混合用法：<b>主会话用 Sonnet，把检索类子代理指定为 Haiku 省钱</b>，遇到卡点再临时切 Opus，或给关键子代理单独指定 Opus。"
      ],
      plus: "配套参数：<b>--fallback-model</b> 在默认模型过载时降级；成本敏感场景用 <b>--max-budget-usd</b> 设单次上限；思考深度可用 <b>think / think hard / ultrathink</b> 这类提示词档位调节。",
      warn: "全程 Opus 求稳——成本与延迟大幅上升，编码质量增益有限；或全程 Haiku 求快——复杂推理掉档。",
      follow: "追问：子代理指定 haiku 但任务需要推理，会出现什么问题？",
      why: "模型路由的性价比关键在<b>把贵的算力放在决策点而不是执行点</b>。一次任务中真正需要强推理的通常只有「理解需求、设计方案、诊断疑难」几处，其余大量工作是检索、改写、跑命令——这些用更便宜的模型差别不大，但总量占比高。所以成熟用法是<b>主 agent 用中档、子代理按需降档、关键决策临时升档</b>，而不是全程最强模型。",
      num: "分工：<b>Opus 架构/疑难、Sonnet 日常主力、Haiku 高频轻量</b>；切换 <b>--model / /model / 子代理 model 字段</b>；配套 <b>--fallback-model、--max-budget-usd、ultrathink</b>。"
    },
    {      q: "同一个 bug，Claude 有时一眼找到，有时绕半天。thinking 相关的机制该怎么用？",
      tag: "adv",
      a: [
        "机制：<b>extended thinking（扩展思考）</b>让模型在回答前产出更长的内部推理；在提示里用 <b>think / think hard / ultrathink</b> 这类档位词可<b>提高思考预算</b>，档位越高思考越深、耗时与成本越高。",
        "用法：<b>常规改动不开</b>（浪费延迟）；<b>疑难诊断、架构权衡、跨模块 bug 才显式加 ultrathink</b>——把额外算力花在真正的决策点上。",
        "另一个相关机制是 <b>interleaved thinking（交错思考）</b>：模型<b>在工具调用之间保持思考</b>，边观察边调整，而不是一次性想完再动手——这对多步 agent 任务尤其重要。"
      ],
      plus: "配合手段：<b>先派 Explore 子代理把事实查清</b>，再开深度思考做判断。<b>思考预算用在「事实齐备后的推理」上才划算</b>，事实都没查清就深度思考，只会更精致地猜错。",
      warn: "所有请求都加 ultrathink——延迟成本翻倍，简单任务收益接近零。",
      follow: "追问：开了 ultrathink 但事实本身没查清，会发生什么？",
      why: "思考预算的分配逻辑和模型路由是同一个道理：<b>算力应集中在信息已齐备、但结论不显然的地方</b>。交错思考则解决另一个问题——agent 任务中<b>观察会改变推理方向</b>，一次性想完的方案往往第一步就被工具结果推翻，所以「思考 → 工具 → 再思考」的交错结构比「想完再干」更适配 agent loop。这也是为什么长任务里不能只看总思考量，还要看思考是否分布在正确的节点上。",
      num: "机制：<b>extended thinking（think / think hard / ultrathink 档位）</b>、<b>interleaved thinking（工具调用间保持思考）</b>；用法是<b>疑难才开高档</b>。"
    },
    {      q: "你要跑一个预计 200 轮的超长重构任务。怎么设计上下文策略，让它跑到第 200 轮还不崩？",
      tag: "deep",
      a: [
        "第一原则：<b>主上下文只装「当前这一步需要的」</b>。把任务拆成有明确验收标准的阶段，每阶段结束就 <b>/clear</b> 或 <b>/compact</b>，用交接文档而非对话历史传递状态。",
        "第二原则：<b>状态外置到磁盘</b>——计划、已完成的改动、待办、约定写进 CLAUDE.md / rules / 一个 progress.md；它们是持久的，而对话是会被压缩的。",
        "第三原则：<b>探索全部外置给子代理</b>。检索、调研、试错都在隔离窗口里做，主会话只接收结论摘要。"
      ],
      plus: "第四原则：<b>每阶段都要有可机器验证的门禁</b>（测试/构建退出码），并用 <b>Stop hook</b> 强制执行。长任务最大的风险不是慢，而是<b>从某个阶段起就在错误方向上高质量地前进</b>。",
      warn: "指望「上下文够长就能一路跑完」——200K 也好 1M 也好，注意力衰减与噪声累积与容量无关。",
      follow: "追问：阶段之间的交接文档应该包含哪些字段？",
      why: "长任务失败的根因是<b>上下文质量的单调下降</b>：随着工具输出累积，早期目标被稀释、失败尝试占据窗口、模型开始在噪声中决策。单点技巧（压缩、子代理）都只是缓解，真正的解法是<b>把长任务改造成一串短任务的串联</b>——每个短任务有独立干净的上下文、明确的输入输出、机器可判定的门禁，状态通过磁盘文件而非对话历史传递。这与软件工程里「无状态服务 + 持久化状态」的思路同构。",
      num: "四原则：<b>拆分阶段 + 每阶段 /clear 或 /compact / 状态外置到磁盘 / 探索交给子代理 / 每阶段机器门禁（Stop hook）</b>。"
    },
    {      q: "面试官问「CLAUDE.md 和 system prompt 是什么关系？」很多人答不清，你怎么说？",
      tag: "deep",
      a: [
        "位置关系：<b>CLAUDE.md 的内容被加载进上下文，作为系统提示区域的一部分</b>（与工具定义、环境信息等一起构成每轮请求的前缀），不是用户消息、也不是训练数据。",
        "控制关系：<b>system prompt 由 Claude Code 运行时生成，你只能追加不能整体替换</b>（<b>--append-system-prompt</b> 是推荐方式，<b>--system-prompt</b> 会整体替换并可能丢掉工具能力）；CLAUDE.md 是官方提供的、可版本化的追加通道。",
        "内容关系：二者是<b>同一层级的软约束</b>，都靠模型遵循，都会被长上下文稀释；因此<b>都不能替代 hooks 的硬约束</b>。"
      ],
      plus: "关键推论：<b>因为它是前缀的一部分，所以结构稳定时能被 prompt caching 命中</b>——这解释了为什么「稳定的 CLAUDE.md」比「每次临时在对话里交代」更省钱也更快。",
      warn: "以为 CLAUDE.md 是用户消息或会被「优先处理」——它和系统提示同源，同样会衰减。",
      follow: "追问：既然是软约束，那关键的「绝不能做」放哪里？",
      why: "把 CLAUDE.md 理解为<b>可版本化的 system prompt 片段</b>，就能推出它的一切性质：它每轮都被发送（所以有成本）、它在最前面（所以受注意力衰减影响）、它稳定（所以可缓存）、它由文件决定（所以可 code review、可分企业/项目/个人三层）。这也解释了它与 skill 的差异——<b>skill 是按需注入上下文，CLAUDE.md 是常驻注入</b>，二者解决的是不同频率的知识。",
      num: "要点：<b>CLAUDE.md → 系统提示前缀的一部分</b>；修改用 <b>--append-system-prompt</b>（整体替换用 --system-prompt 有风险）；<b>稳定前缀可命中 prompt caching</b>。"
    },
    {      q: "为何核心执行工具只有 Bash，不给 npm/git/docker 各做专用工具？讲讲这个取舍。",
      tag: "deep",
      a: [
        "收益侧：<b>能力上限不被工具集封死</b>。一个通用 shell 入口意味着任何命令行能力（包括尚未出现的）都能被使用；若做成专用工具集，每支持一个新生态就要改一次产品。",
        "成本侧：<b>安全与治理成本全部转移到了 Bash 上</b>——需要命令静态分析（危险内置命令、equals expansion、零宽字符、null-byte 注入等绕过）、权限规则、hook 拦截、沙箱隔离四层防线。",
        "折中产物：保留 <b>Read/Edit/Write</b> 专用文件工具，因为<b>文件读写是最频繁且最需要精确性</b>的操作（Edit 的 old_string 唯一匹配就是为此）；其余交给通用 Bash。"
      ],
      plus: "这个取舍也解释了生态策略：<b>专有能力不进内核，走 MCP 与 skill 扩展</b>——内核保持小，扩展交给协议。",
      warn: "只看到「Bash 很方便」——没看到它把整个安全负担集中到了一处，需要四层防线。",
      follow: "追问：如果让你设计一个更安全的替代方案，你怎么在能力与治理之间取平衡？",
      why: "这是<b>通用原语 vs 专用抽象</b>的经典权衡。通用原语的问题是「什么都能做，所以什么都得防」；专用抽象的问题是「安全可控，但能力被封死」。Claude Code 选通用原语，是因为 coding 场景的<b>能力边界扩张速度远快于产品迭代速度</b>——等着官方支持新工具是死路。而它为此付出的治理成本，恰恰构成了这个产品的护城河：<b>命令静态分析与权限模型的复杂度，比工具实现本身高得多</b>。",
      num: "取舍：<b>Bash 通用（能力开放，治理成本高）/ Read-Edit-Write 专用（精度与频率）</b>；防线四层 <b>静态分析 → 权限 → hook → 沙箱</b>；扩展走 <b>MCP / skill</b>。"
    },
    {      q: "Edit 工具要求 old_string 必须唯一且精确匹配，这个看似别扭的约束背后是什么设计考量？",
      tag: "deep",
      a: [
        "<b>逼迫先读后改</b>：模型必须 Read 到文件内容才能构造出精确的 old_string，从机制上杜绝「凭记忆改文件」导致的内容错乱。",
        "<b>让 diff 可控</b>：精确匹配意味着改动范围是确定的一小段，<b>审查成本低</b>；若允许模糊匹配或行号定位，模型很容易改到意外位置。",
        "<b>失败反馈可学习</b>：匹配失败会返回明确错误，模型可以据此重新 Read 再改——把错误变成 loop 里可恢复的一步，而不是静默写坏文件。"
      ],
      plus: "实践推论：<b>大段重写时用 Write 而不是多次 Edit</b>；<b>多处相同内容需要替换时，old_string 要带上足够的上下文使其唯一</b>，否则工具会报不唯一而拒绝。",
      warn: "抱怨「Edit 老失败」就去放宽匹配——失败正是保护，放宽后错误会静默进入代码。",
      follow: "追问：多处相同代码片段要一起替换，怎么处理？",
      why: "这个约束是<b>用工具的接口设计来约束模型的失败模式</b>的范例。模型在长上下文里对文件内容的记忆并不可靠，若工具允许「大概这样改」，错误会以概率形式出现且难以发现；而强制精确匹配把错误<b>提前到调用前暴露</b>，且暴露方式是确定性的报错而非静默的错误结果。设计原则是：<b>宁可让调用失败并给出可恢复的错误，也不要让调用成功但结果不可控</b>。",
      num: "约束：<b>old_string 唯一且精确匹配</b>；配套 <b>MultiEdit 批量编辑</b>、<b>大段重写用 Write</b>；失败是<b>确定性报错且可恢复</b>。"
    },
    {      q: "hooks 的执行模型里有哪些容易被忽略的工程细节？请讲并行、去重、超时与安全。",
      tag: "deep",
      a: [
        "<b>并行</b>：一个事件匹配到多个 hook 时它们<b>并行执行</b>，相同命令会被<b>自动去重</b>——所以不要依赖执行顺序，也不要靠副作用传递状态。",
        "<b>超时</b>：hook 有<b>默认 60 秒超时，可按 hook 单独配置</b>。跑测试类的 hook 要注意这个上限，超时的行为不会是你期望的「阻断」。",
        "<b>输入</b>：hook 通过 <b>stdin 收 JSON</b>（session_id、transcript_path、cwd、permission_mode、hook_event_name，工具类的还有 tool_name / tool_input / tool_result）；环境变量有 <b>CLAUDE_PROJECT_DIR</b>、<b>CLAUDE_CODE_REMOTE</b>、<b>CLAUDE_ENV_FILE</b>。"
      ],
      plus: "安全细节最有价值：<b>hook 以你的用户权限执行任意 shell 命令</b>，所以脚本要<b>校验 stdin、给 shell 变量加引号防注入、用绝对路径</b>；同时 Claude Code 要求对 hook 配置文件的直接编辑需在 <b>/hooks</b> 菜单中确认才生效，防止被静默植入。",
      warn: "写了 hook 却不校验 stdin、shell 变量不加引号——hook 读到的是模型可控的输入，存在注入风险。",
      follow: "追问：hook 超过 60 秒会怎样？长测试应该放哪？",
      why: "hook 是 agent 系统里<b>唯一能绕过模型意志的执行点</b>，因此它的设计处处是「不要让 hook 本身成为故障源或攻击面」：并行与去重让性能可控、超时让单个坏 hook 不会拖死会话、fail-open 的退出码语义让坏 hook 不会冻结工作流、配置变更需 review 让恶意 hook 不能静默生效。理解这四点，就理解了为什么 hook 的退出码是 0/2/其他这套看似奇怪的设计。",
      num: "细节：<b>并行执行 + 相同命令去重</b>、<b>默认超时 60s（可配）</b>、<b>stdin JSON</b>、<b>环境变量 CLAUDE_PROJECT_DIR / CLAUDE_CODE_REMOTE / CLAUDE_ENV_FILE</b>、<b>配置变更需 /hooks 确认</b>。"
    },
    {      q: "请完整描述一次 Bash 工具调用从被模型发出到真正执行，中间要经过哪些判定环节。",
      tag: "deep",
      a: [
        "<b>第一环：hook（PreToolUse）</b>。先跑匹配的钩子，可 <b>exit 2 拦截</b>或通过 <b>updatedInput 修改入参</b>；这一步在权限之前，且 hook 的 deny 是模型无法绕过的。",
        "<b>第二环：命令静态分析</b>。对命令做白名单与安全检查，覆盖危险内置命令、<b>zsh equals expansion</b>、<b>零宽字符</b>、<b>IFS / null-byte 注入</b> 等绕过手法。",
        "<b>第三环：权限判定</b>。按 <b>deny &gt; ask &gt; allow</b> 的顺序匹配规则（跨层合并，managed 层最高），未命中任何规则时落到<b>当前 permission mode 的基线行为</b>；最后进入沙箱执行。"
      ],
      plus: "顺序要记牢：<b>hook → 静态分析 → 权限规则 → 模式基线 → 沙箱</b>。另外<b>hook 返回 allow 也压不过任何层的 deny 规则</b>，这是硬保证。 四层：命令静态分析 / permissions / hook(exit 2) / 沙箱（macOS Seatbelt、Linux bubblewrap）。 底层是<b>沙箱执行</b>：Claude Code 在命令执行层做隔离，<b>macOS 用 Seatbelt（sandbox_exec）、Linux 用 bubblewrap 之类的机制</b>，把文件系统写入范围与网络访问限制在受控边界内。",
      warn: "以为权限规则是最先执行的——PreToolUse hook 在权限判定之前，且能改输入。",
      follow: "追问：bypassPermissions 会跳过这条链路的哪几环？",
      why: "把链路按「<b>越靠前越确定、越靠后越通用</b>」排列是刻意的设计：<b>hook 最确定</b>（可以写任意逻辑），所以最先执行、也最先能否决；<b>静态分析</b>覆盖已知攻击面，成本低；<b>权限规则</b>是声明式的用户体验层；<b>模式</b>只是未命中规则时的默认；<b>沙箱</b>不依赖枚举，兜底所有漏网的情形。理解这个层次，就能回答「某个拦截该配在哪一层」这类实际问题。",
      num: "链路：<b>PreToolUse hook → 命令静态分析 → deny/ask/allow 规则 → permission mode 基线 → 沙箱</b>；优先级 <b>deny &gt; ask &gt; allow</b>。"
    },
    {      q: "CI 里 headless 批量修 lint，重跑会重复改动还常超时。幂等与超时怎么工程化？",
      tag: "deep",
      a: [
        "<b>幂等</b>：任务输入要<b>确定性</b>——把待修文件列表、规则版本、基准 commit 写进 prompt 或文件；每次从<b>干净的工作副本</b>开始（新建 worktree 或容器），避免叠加历史改动。",
        "<b>去重</b>：以<b>内容哈希或 commit</b> 为键记录已处理项，重跑时先过滤；让输出落到<b>独立分支或 patch 文件</b>，再决定是否应用，而不是直接写回主干。",
        "<b>超时</b>：用 <b>--max-turns</b> 限轮数、<b>--max-budget-usd</b> 限成本、外层再加 <b>timeout 命令与 workflow 级 timeout</b>；把长任务拆成小批次，单批失败可重跑而不影响全局。"
      ],
      plus: "可观测性：<b>--output-format json</b> 拿 <b>type:result</b>、<b>total_cost_usd</b>、<b>num_turns</b> 做统计与门禁；<b>stream-json</b> 用于长任务实时监控；失败要保留 transcript 便于复盘。",
      warn: "让 agent 直接写回主干且没有轮数与预算上限——失败时既难回滚又可能烧掉大量预算。",
      follow: "追问：批次里 10% 的任务反复失败，你怎么处理？",
      why: "headless agent 的工程难点在于<b>它既不是纯函数（有随机性与外部依赖），又要放进要求确定性的流水线</b>。解法是把不确定性<b>隔离在边界内</b>：输入确定（固定基准与文件列表）、环境确定（干净 worktree/容器）、副作用隔离（输出 patch 不直接合入）、预算确定（turns/budget/timeout 三层上限）。做到这四点，agent 在 CI 里就退化成一个「可能失败但可安全重跑」的普通任务。",
      num: "四确定：<b>输入确定 / 环境干净（worktree 或容器）/ 副作用隔离（patch 或分支）/ 预算三层上限（--max-turns、--max-budget-usd、外层 timeout）</b>；输出字段 <b>type:result、total_cost_usd、num_turns</b>。"
    },
    {      q: "两个实例同时改同一个迁移和配置文件，冲突了。除了 worktree，架构上怎么避免？",
      tag: "deep",
      a: [
        "<b>任务切分按所有权而非按动作</b>：让每个实例拥有<b>互不重叠的文件集合或模块</b>（A 只改 packages/a、B 只改 packages/b），共享的迁移与配置由人或单独一个实例串行处理。",
        "<b>共享资源显式串行化</b>：数据库迁移、锁文件、CHANGELOG、版本号这类天然共享的资源，<b>不做并行</b>，或用文件锁/队列保证同一时刻只有一个写入者。",
        "<b>运行时隔离</b>：并行的实例错开 <b>端口、临时目录、数据库 schema / 实例名</b>，避免除了文件之外的第二类冲突。"
      ],
      plus: "收尾策略：<b>并行阶段只产出互不重叠的 patch，合并阶段串行 apply 并跑一次全量验证</b>。把「并行写」改造成「并行算 + 串行合」，冲突面就从整个文件系统缩小到合并点一处。",
      warn: "只做 worktree 隔离就认为并行安全——数据库、端口、锁文件、版本号同样会冲突。",
      follow: "追问：合并阶段发现两个 patch 语义冲突（都改了同一个函数签名）怎么办？",
      why: "并行的正确性取决于<b>是否存在共享可变状态</b>，而 git worktree 只解决了代码文件这一类。真正的架构原则是<b>按所有权划分任务边界</b>——每个并行单元对自己拥有的资源独占写，共享资源要么串行、要么由专门角色负责。这与并发编程里「共享内存 vs 消息传递」的取舍同构：<b>与其让多个写者竞争锁，不如让它们各自产出、最后串行合并</b>，可推理性高得多。",
      num: "三招：<b>按所有权切分（互不重叠文件集）/ 共享资源串行化（迁移、锁文件、版本号）/ 运行时错开端口与库；合并用「并行算 + 串行合」</b>。"
    },
    {      q: "换模型或改 prompt 后，怎么判断改动质量变好还是变差？评测怎么设计？",
      tag: "deep",
      a: [
        "<b>外部基准</b>：用 <b>SWE-bench Verified</b> 这类<b>真实 GitHub issue + 单元测试</b>的基准，指标是<b>解决率（resolved rate）</b>——有客观判定，不像人工打分那样主观。",
        "<b>内部回归集</b>：把团队真实任务沉淀成一批<b>带验收标准的 case</b>（改哪个文件、跑哪个测试必须绿），每次配置变更跑一遍，看通过率与成本、轮数的变化。",
        "<b>过程指标</b>：除最终成败外，统计 <b>平均轮数、token/成本、被 hook 拦截次数、回滚率、人工修改行数</b>——这些能解释「为什么变差」。"
      ],
      plus: "必须强调的坑：<b>基准会泄漏</b>。SWE-bench 类数据是公开的，训练/调参时接触过就会虚高；所以要<b>保留一份内部不外泄的 held-out 集</b>，并定期更新（case 会过时）。",
      warn: "只看「解决率」这一个数——可能被成本与轮数的暴涨换来，也可能是数据泄漏导致的虚高。",
      follow: "追问：内部回归集怎么设计才不会很快就过时或被过拟合？",
      why: "评测 agentic coding 工具的难点在于<b>结果难判定</b>——「代码质量」主观，而「是否解决问题」可用测试客观判定，所以主流基准都用<b>测试通过作为判据</b>。但只看解决率不够：它可能靠更多轮数、更高成本换取，所以必须同时监控<b>效率指标</b>；还可能是过拟合，所以需要 held-out 集。完整的评测体系是<b>客观成败 + 效率成本 + 泛化验证</b>三层。",
      num: "三层：<b>SWE-bench Verified 类外部基准（解决率）/ 内部回归集（带验收标准）/ 过程指标（轮数、成本、拦截次数、回滚率）</b>；防泄漏靠 <b>held-out 集</b>。"
    },
    {      q: "上下文从 200K 涨到 1M，是不是上下文管理就不重要了？请从注意力与成本两个角度反驳或支持。",
      tag: "deep",
      a: [
        "<b>注意力角度：容量不是瓶颈，注意力才是</b>。窗口越大，早期指令被稀释得越厉害；「CLAUDE.md 写了但模型没照做」在长上下文里更常见，而不是更少见。",
        "<b>成本角度：每轮都要重发整个前缀</b>。窗口放大 5 倍不等于成本放大 5 倍（可以不用满），但<b>基线越大每轮越贵越慢</b>；把基线控制小仍是直接省钱。",
        "<b>延迟角度</b>：首 token 延迟与前缀长度强相关，超长上下文对交互式体验是实打实的负担。"
      ],
      plus: "合理的结论：<b>1M 上下文降低了「被硬性中断」的频率（少触发压缩），但没有降低「管理上下文」的价值</b>——只是把目标从「别撑爆」改成「别稀释、别浪费」。",
      warn: "认为 1M 上下文「以后不用管上下文了」——压缩频率会降，但稀释与成本问题依旧。",
      follow: "追问：长上下文下怎么提高关键指令的遵循率？",
      why: "长上下文解决的是<b>硬约束</b>（装不下），不解决<b>软约束</b>（注意力衰减）与<b>经济约束</b>（成本与延迟）。实测中长上下文的典型失效模式是「中间信息被忽略」（lost-in-the-middle），这与容量无关，而是注意力分配问题。因此正确的态度是：<b>把长窗口当作保险而非策略</b>——策略仍是「小而相关的上下文」，长窗口只用来兜住意外的峰值。",
      num: "三笔账：<b>注意力衰减（lost-in-the-middle）/ 每轮重发前缀的成本 / 首 token 延迟</b>；结论是<b>长窗口是保险不是策略</b>。"
    },
    {      q: "原生 Task 工具派出的子代理不能再派子代理（递归被阻断）。如果你确实需要多层委派，有哪些方案？",
      tag: "deep",
      a: [
        "原因：运行时<b>在子代理的工具列表里过滤掉了 Agent/Task 工具</b>，防止递归失控与成本爆炸。这是刻意的设计约束，不是 bug。",
        "方案一（推荐）：<b>改成分层编排但由主 agent 驱动</b>——主 agent 串行/并行派多个子代理，自己负责汇总，把多层树压平成两层。",
        "方案二：<b>用 headless 模式代替内层</b>——子代理通过 <code>claude -p</code> 起一个独立进程（可再派自己的子代理、可指定 model/allowedTools/timeout/maxBudgetUsd），以 <b>--output-format stream-json</b> 取回结果；代价是失去会话内集成、需要自己管进程与取消。",
        "方案三：<b>用 --agents 内联定义或后台 agent / agent teams</b> 做会话级的并行协作。"
      ],
      plus: "选型原则：<b>默认压平成两层；确需递归隔离才用 headless 子进程</b>，并务必设 <b>--max-turns</b> 与 <b>--max-budget-usd</b>，否则递归 + 无预算上限是灾难。",
      warn: "用 headless 递归却不设预算与轮数上限——成本可能指数级失控。",
      follow: "追问：headless 子进程方案下，怎么取消一个跑飞的子任务？",
      why: "禁止递归是<b>对成本与可控性的保护</b>：树形委派的成本是深度的指数函数，且失败时极难定位。压平两层在绝大多数场景已够用——真正的收益来自「上下文隔离」而非「层级深度」。若确实要突破，headless 子进程是官方支持的等价路径（它本质就是把 Claude Code 当成可编排的进程），但你要自己接管进程生命周期、超时、取消与成本，这正是「原生 vs 手工」的取舍。",
      num: "约束：<b>子代理工具列表过滤掉 Agent/Task</b>；方案 <b>压平两层 / claude -p 子进程 / --agents 内联或后台 agent</b>；必须设 <b>--max-turns 与 --max-budget-usd</b>。"
    },
    {      q: "有人说「Claude Code 的护城河是模型强」。从 harness 工程角度，你认为真正的难点在哪？",
      tag: "deep",
      a: [
        "<b>难点一：工具输出的信息密度控制</b>。一次 grep 或一次测试输出可能几万 token，怎么截断、怎么结构化、怎么保住关键证据，决定了上下文能撑多久。",
        "<b>难点二：权限与安全的完整链路</b>。命令静态分析要覆盖不断更新的绕过手法（equals expansion、零宽字符、null-byte），还要 hook、规则、沙箱多层叠加。",
        "<b>难点三：上下文生命周期管理</b>。记忆分层、条件加载、autocompact、子代理隔离、交接状态，是一整套工程而非单个功能。"
      ],
      plus: "难点四常被忽略：<b>可观测与可回滚</b>——transcript（JSONL 全量会话）、diff 呈现、Esc Esc 回滚、checkpoint。没有这些，agent 出错时无法复盘，企业不敢用。",
      warn: "把 agent 产品的竞争力全归于模型——模型可换，harness 的细节才是复用的壁垒。",
      follow: "追问：如果要自研一个 coding agent，你会优先投入哪一块？",
      why: "模型能力是<b>可替换的商品</b>（可换模型、可接第三方），而 harness 是<b>难以复制的系统工程</b>：它由大量与真实使用摩擦相关的细节构成——哪些命令危险、什么输出要截断、压缩时保留什么、弹窗什么时候该出现。这些知识只能通过长期真实使用积累，且直接决定「这个 agent 能不能进生产」。所以更准确的说法是：<b>模型决定上限，harness 决定可用性下限</b>。",
      num: "四难点：<b>工具输出信息密度 / 权限安全链路 / 上下文生命周期 / 可观测与回滚（transcript、diff、Esc Esc checkpoint）</b>。"
    },
    {      q: "你要把未审查的第三方仓库交给 Claude Code 分析，担心提示注入。除了技术手段，组织流程上怎么设计？",
      tag: "deep",
      a: [
        "<b>环境隔离</b>：在<b>一次性容器或临时 git worktree</b> 里跑，不给真实凭据、不给生产网络出口；用完即弃。",
        "<b>权限最小化</b>：<b>默认不用 bypassPermissions</b>；用 <b>--allowedTools</b> 只给完成任务必需的工具（常常只需 Read/Grep/Glob）；敏感路径进 <b>deny</b>。",
        "<b>输出不信任</b>：把 agent 的产出当<b>不可信输入</b>——改动必须看 diff、建议必须验证；不让它在同一轮里既读外部内容又执行写入。"
      ],
      plus: "技术补强：<b>PreToolUse hook 拦截外发类命令</b>（curl、nc、wget、git push、scp），这是把「数据外泄」这条最严重的路径直接切断；再配合沙箱兜底。",
      warn: "在主机上以 bypassPermissions 跑不可信仓库——注入一旦成功就是完整的本机权限。",
      follow: "追问：怎么在流程上保证「读外部内容」和「执行写入」不在同一轮发生？",
      why: "提示注入无法根治，所以组织设计要遵循<b>零信任</b>：假设 agent 已经被注入，问「最坏会发生什么」。三条防线对应三个最坏结果——<b>环境隔离</b>限制破坏半径（拿不到凭据、出不去网）、<b>权限最小化</b>限制可行动作（改不了、发不出）、<b>输出不信任</b>保证最终有人工闸门。技术上再加 hook 切断外发与沙箱兜底。这五层叠加，才是「敢把不可信内容喂给 agent」的前提。",
      num: "五层：<b>容器/worktree 隔离 / --allowedTools 最小化 / 敏感路径 deny / PreToolUse 拦截外发命令 / 人工看 diff</b>；原则 <b>默认不用 bypassPermissions</b>。"
    },
    {      q: "你们想以 Claude Code 为底座做一个内部研发助手产品。有哪些集成方式，各有什么取舍？",
      tag: "deep",
      a: [
        "<b>方式一：Claude Agent SDK / headless CLI</b>。用 <code>claude -p</code> 或 SDK 把它当作可编排的进程，自己实现编排、UI 与权限；<b>取舍是完全可控但要自建外围</b>。",
        "<b>方式二：扩展现有形态</b>。用 <b>plugins / skills / slash commands / MCP</b> 注入企业知识与工具，<b>复用它的全部交互与治理</b>；取舍是被其形态约束。",
        "<b>方式三：CI 集成</b>。通过 <b>claude-code-action</b> 或自建 workflow 把它接进流水线；适合批处理与自动化，不适合交互产品。"
      ],
      plus: "选型关键：<b>先问『是否需要自己的交互形态』</b>。需要 → SDK/headless；不需要 → plugins/skills 扩展（成本最低、能继承全部治理资产）。",
      warn: "一上来就用 SDK 自建一整套——重复造权限与上下文管理的轮子，且丢掉官方治理资产。",
      follow: "追问：用 SDK 自建时，权限与 hooks 这套治理怎么平移？",
      why: "这是<b>「复用 harness」还是「重建 harness」</b>的取舍。Claude Code 的价值大量沉淀在 harness（权限、上下文管理、工具集、可观测），走 plugins/skills 扩展能零成本继承；走 SDK 则放弃它的交互层，需要自己重建 UI、权限 UI 与可观测，只保留内核能力。判断标准是<b>你的差异化在「知识/流程」还是「交互形态」</b>——前者用扩展，后者才值得自建。",
      num: "三路径：<b>Agent SDK / claude -p（自建外围）/ plugins+skills+MCP（继承治理）/ claude-code-action（CI）</b>；配置项 <b>--system-prompt、--append-system-prompt、--agents、--mcp-config、--allowedTools</b>。"
    },
    {      q: "团队用 Claude Code 的成本越来越高，老板要你做成本控制。你会从哪些杠杆入手？",
      tag: "deep",
      a: [
        "<b>杠杆一：削减基线</b>。CLAUDE.md 控制在 200 行内、用 rules + paths 条件加载、流程外置到 skill、MCP 按需接入（<b>--strict-mcp-config</b>）——基线每小一点，每轮都省钱。",
        "<b>杠杆二：模型路由</b>。主会话用 Sonnet，检索类子代理指定 <b>Haiku</b>，只在决策点升 Opus；<b>ultrathink 只在疑难时开</b>。",
        "<b>杠杆三：减少无效轮次</b>。给明确的验证信号与 @ 精确指定文件，避免它在检索上空转；<b>同一处错误改两次就 /clear 重写</b>，别在错误方向上迭代。"
      ],
      plus: "杠杆四：<b>硬上限</b>。批量与 CI 场景一律加 <b>--max-turns</b> 与 <b>--max-budget-usd</b>；用 <b>total_cost_usd</b> 做统计与门禁，异常任务能自动熔断。",
      warn: "只想着换便宜模型——无效轮次与臃肿基线往往才是成本大头。",
      follow: "追问：怎么在不牺牲质量的前提下判断哪个杠杆收益最大？",
      why: "coding agent 的成本结构近似 <b>轮数 × 每轮前缀长度 × 模型单价</b>。三个杠杆正好对应三项：<b>基线</b>压前缀长度、<b>路由</b>压单价、<b>有效轮次</b>压轮数；再加一层<b>上限</b>做兜底。其中轮数最容易被忽视——一次「找文件找了 8 轮」的低效会话，成本可能超过一次高质量的长会话，所以<b>上下文精确性（@、deny、子代理）本身就是成本优化</b>。",
      num: "公式 <b>轮数 × 前缀长度 × 单价</b>；四杠杆 <b>削减基线 / 模型路由 / 减少无效轮次 / --max-turns 与 --max-budget-usd 上限</b>；监控字段 <b>total_cost_usd</b>。"
    },
    {      q: "Claude Code 的终端 UI 据说不是普通 ANSI 输出，而是自己实现了一套渲染栈。为什么值得这么做？",
      tag: "hot",
      a: [
        "它把终端<b>当成 GUI 而不是打印机</b>：React 组件经自定义 reconciler 生成虚拟 DOM，交给 <b>Yoga 做 flexbox 布局</b>，再经 output builder、screen buffer、<b>diff engine</b> 才落成 ANSI 序列。",
        "带来的能力：<b>双缓冲与只重绘变化区域（blit）</b>、<b>二维 cell buffer</b>、样式/字符/超链接池、<b>硬件滚动区域</b>、事件捕获与冒泡、文本选择、软换行、键盘协议解析。",
        "产品意义：只有这样才能承载<b>流式输出、可交互的权限选择、diff 高亮、进度与 todo 面板</b>这些复杂交互——普通 ANSI 打印做不到。"
      ],
      plus: "工程意义更深：<b>agent 的交互复杂度已经接近 GUI 应用</b>（多面板、流式、可中断、需选择），终端若只提供「打印」就成了体验瓶颈。谁把终端产品化，谁就拿到了 CLI 形态的体验差异。",
      warn: "以为终端 UI 只是「打印好看点」——它承载的是权限选择、diff 浏览等核心交互。",
      follow: "追问：这套渲染栈带来的最大工程代价是什么？",
      why: "agentic 工具把大量决策权交回给人（要不要执行、选哪个方案、看哪段 diff），这意味着<b>交互密度远高于传统 CLI</b>。传统 CLI 只需输出文本流，而 agent CLI 需要布局、选择、滚动、实时更新——本质上是一个 GUI 应用，只是宿主是 TTY。自建渲染栈的取舍是：<b>成本极高，但换来不依赖 IDE 也能有接近 GUI 的体验</b>，这正是「终端原生」路线能否成立的前提。",
      num: "技术栈：<b>React 自定义 reconciler → Yoga flexbox → output builder → screen buffer → diff engine → ANSI</b>；优化含 <b>双缓冲、blit 局部重绘、cell buffer、样式池、硬件滚动</b>。"
    },
    {      q: "Agent Skills / SKILL.md 成了跨工具事实标准。它比旧 slash command 本质变了什么？",
      tag: "hot",
      a: [
        "变化一：<b>从『人触发』到『模型自主触发』</b>。skill 靠 frontmatter 里的 description 让模型自己判断何时启用，command 需要显式 <code>/name</code>。",
        "变化二：<b>从『纯提示词』到『提示词 + 可执行资产』</b>。skill 是一个目录（<b>SKILL.md + 脚本 + 参考资料</b>），能把确定性逻辑放进脚本，只让模型做编排与判断。",
        "变化三：<b>渐进式披露（progressive disclosure）</b>。默认只有描述进上下文，命中后才加载正文，<b>大幅降低多能力并存时的基线成本</b>。"
      ],
      plus: "变化四是生态层面：<b>SKILL.md 正在成为跨工具的开放约定</b>（与 AGENTS.md 类似），一份能力资产可在多个 agent 产品间复用——这也是它比私有 slash command 更值得投入的原因。",
      warn: "把 skill 当「换个目录的 slash command」——真正的差异在自主触发与渐进加载。",
      follow: "追问：description 写不好会导致什么具体问题？",
      why: "能力扩展机制的演进方向是<b>降低常驻成本 + 提高自主性</b>。早期 slash command 解决了「复用提示词」，但代价是能力越多、人越要记住名字，且提示词无法承载确定性逻辑。skill 把「能力」变成<b>可被模型检索的资产</b>：描述是索引、正文是内容、脚本是执行体。这让「装了很多能力」与「基线很小」可以同时成立，是 agent 走向平台化的关键一步。",
      num: "三点变化：<b>模型自主触发 / 提示词+脚本的目录形态 / 渐进式加载</b>；目录格式固定 <b>skills/&lt;name&gt;/SKILL.md</b>；类比 <b>AGENTS.md 的跨工具约定</b>。"
    },
    {      q: "Claude Code、Codex CLI、Cursor 都在做 agentic coding。架构差异在哪？",
      tag: "hot",
      a: [
        "<b>Claude Code</b>：<b>终端原生 + 完整治理面</b>（记忆分层、权限模式、hooks、subagents、MCP），优先可脚本化与进 CI，IDE 只是可选前端。",
        "<b>Codex CLI 类</b>：同样走终端与 headless，强调<b>沙箱与审批策略</b>的精细化，配置形态各异。",
        "<b>Cursor 类</b>：<b>编辑器原生</b>，交互与 diff 体验最强（补全、多文件改写、可视化审查），但<b>脚本化与 CI 集成是外挂的</b>而非原生。"
      ],
      plus: "收敛趋势：两端在互相靠拢——<b>编辑器类产品补 headless/CI 与云端 agent，终端类产品补 IDE 插件与 diff 可视化</b>；同时 <b>AGENTS.md / SKILL.md</b> 这类开放约定正在抹平配置层的差异。",
      warn: "只比「谁家模型强/谁家便宜」——架构定位决定适用场景，差异不在模型。",
      follow: "追问：如果团队既有 IDE 重度用户又要跑 CI，你怎么选型？",
      why: "差异根源是<b>宿主选择</b>：宿主为终端 → 天然可进程化、可编排、可并行，代价是交互要靠自建渲染栈；宿主为编辑器 → 天然有 diff、选区、补全，代价是难以进 CI 与批处理。判断一个 agentic coding 工具的天花板，就看它<b>能否同时覆盖「人盯着改」与「无人值守跑」</b>两种模式，以及治理资产是否只有一份真源。",
      num: "三维对比：<b>宿主（终端 vs 编辑器）/ 治理面完整度（记忆、权限、hooks、子代理）/ 可脚本化与 CI 原生度</b>；收敛点 <b>AGENTS.md、SKILL.md</b>。"
    },
    {      q: "你让 Claude 加了条 hook，第二天 settings.json 面目全非。配置被改写怎么防？",
      tag: "hot",
      a: [
        "机制层：Claude Code 对<b> hook 配置文件的直接编辑要求在 /hooks 菜单中确认</b>后才生效，防止被静默植入——这是官方的针对性防护。",
        "加固层：再加一条 <b>PreToolUse hook 拦截对 CLAUDE.md 与 settings*.json 的编辑</b>（matcher <code>Edit|Write</code>，检查 tool_input.file_path），把配置设为不可写。",
        "流程层：<b>settings.json 进 git 并走 review</b>；用 <b>/hooks</b> 定期审计当前生效的钩子来源；第三方插件与 skill 只从可信来源安装。"
      ],
      plus: "意识层最重要：<b>hook 是以你的用户权限执行任意命令的代码，配置本身就是要保护的核心资产</b>。安装第三方插件等价于信任其作者，应纳入供应链 review。",
      warn: "把 settings.json 当普通文件任由 agent 改——它定义了 agent 能做什么，是最该保护的资产。",
      follow: "追问：如果 hook 保护了配置文件，那人要改怎么办？",
      why: "这是 agent 系统的<b>自指风险</b>：agent 有文件写权限，而它的行为规则也存放在文件里，因此理论上它可以修改自己的规则。这类问题无法靠模型自觉解决，只能靠三件事：<b>对敏感配置变更的人工确认（/hooks 菜单）</b>、<b>用 hook 保护配置文件（以毒攻毒）</b>、<b>把配置纳入版本控制与 review</b>。本质是把「配置」提升为一等公民资产来保护。",
      num: "防护：<b>/hooks 菜单确认机制 / PreToolUse 拦截对 CLAUDE.md 与 settings*.json 的编辑 / 配置进 git 走 review / 插件来源白名单</b>。"
    },
    {      q: "有人说「有了 subagent 就可以把任务无限并行，效率线性提升」。这个说法错在哪？",
      tag: "hot",
      a: [
        "<b>错在成本</b>：子代理的消耗<b>计入同一份用量限额</b>，不是免费的额外算力；并行只省墙钟时间，不省 token 总量。",
        "<b>错在上下文</b>：子代理之间<b>不共享上下文</b>，主 agent 需要把足够信息写进每个任务描述；描述不清，并行出来的结果就是一堆需要返工的半成品。",
        "<b>错在冲突</b>：并行单元若共享文件、数据库、端口等可变状态，<b>收益会被冲突与合并成本吃掉</b>；只有按所有权切分且不重叠时并行才划算。"
      ],
      plus: "正确的说法：<b>子代理的核心价值是上下文隔离（质量与体积），并行只是它的副产品</b>。追求并行应先解决所有权划分与合并策略，而不是一味多开。",
      warn: "把子代理当并行算力池无限开——冲突与返工成本会超过并行收益。",
      follow: "追问：什么样的任务最适合并行？给一个判据。",
      why: "并行加速的前提是<b>任务可独立验证且无共享写状态</b>，而软件工程任务恰恰高度耦合——改一个函数签名会影响所有调用方。所以 agent 并行的收益曲线很快会饱和：从 1 到 2~3 个实例有收益，再往上冲突与合并成本指数上升。真正稳健的模型是<b>并行探索（只读、无冲突）+ 串行落地（写入与合并）</b>，这也正是 plan mode 与子代理调研的组合为什么在实践中效果最好。",
      num: "三点反驳：<b>计入同一限额（不省 token）/ 上下文不共享（描述成本高）/ 共享写状态导致冲突</b>；稳健模式 <b>并行探索 + 串行落地</b>。"
    },
    {      q: "面试官让你用一个比喻总结 Claude Code 的设计哲学。你怎么组织这个回答？",
      tag: "hot",
      a: [
        "比喻：<b>它是一个有「操作系统」的实习生</b>——能力强、手脚快，但要给它<b>岗位说明书（CLAUDE.md）、工牌权限（permissions）、不可违反的红线（hooks）、以及独立的工作间（subagent/worktree）</b>。",
        "对应到设计：<b>说明书解决『不知道』、权限解决『不敢信』、红线解决『不能碰』、工作间解决『别污染』</b>，四者分别对应上下文工程、信任工程、安全工程与隔离工程。",
        "最后落到判断：<b>这类产品的竞争不在模型，而在治理与上下文工程</b>——模型决定能力上限，harness 决定能不能进生产。"
      ],
      plus: "收尾金句：<b>「让模型更能写」是上一阶段的命题，「让模型更能被管理」才是这一阶段的命题</b>——前者是能力问题，后者是工程问题。",
      warn: "堆功能名词当总结——没有归到失败模式上，听完记不住。",
      follow: "追问：这四件事里，你会先给一家刚开始用的团队落地哪一件？",
      why: "好的总结要体现<b>结构化而非罗列</b>。四类机制不是并列的八个功能，而是对应四种不同的失败模式：不知道（缺上下文）、不敢信（缺信任梯度）、不能碰（缺硬约束）、会污染（缺隔离）。能把散落的功能点归到失败模式上，说明理解了设计动机而不是背了文档。这也是面试区分「用过」和「想过」的分水岭。",
      num: "四对应：<b>CLAUDE.md=上下文 / permissions=信任梯度 / hooks=硬约束 / subagent+worktree=隔离</b>；核心判断 <b>harness 决定能否进生产</b>。"
    }
  ]
});
