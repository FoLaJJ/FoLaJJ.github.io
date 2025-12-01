// 网站数据配置
const siteDataConfig = {
  "categories": [
    {
      "id": "all",
      "name": "全部",
      "icon": "fas fa-globe"
    },
    {
      "id": "Forum",
      "name": "论坛",
      "icon": "fa-solid fa-comment"
    },
    {
      "id": "TargetDrones",
      "name": "靶场",
      "icon": "fa-solid fa-flask"
    },
    {
      "id": "SlackOff",
      "name": "摸鱼",
      "icon": "fa-solid fa-headphones"
    },
    {
      "id": "ToolChain",
      "name": "工具链",
      "icon": "fa-solid fa-wrench"
    },
    {
      "id": "VulnerabilityDatabase",
      "name": "漏洞库",
      "icon": "fa-solid fa-user-secret"
    },
    {
      "id": "meme",
      "name": "迷因",
      "icon": "fa-solid fa-ghost"
    },
    {
      "id": "AI",
      "name": "AI方面",
      "icon": "fa-solid fa-robot"
    },
    {
      "id": "Server",
      "name": "服务器",
      "icon": "fa-solid fa-server"
    },
    {
      "id": "CampusWelfare",
      "name": "校内福利",
      "icon": "fa-solid fa-gift"
    },
    {
      "id": "papers",
      "name": "论文",
      "icon": "fa-solid fa-book"
    },
    {
      "id": "gowork",
      "name": "笔面试找工作",
      "icon": "fa-solid fa-person-praying"
    },
    {
      "id": "Information",
      "name": "信息搜集",
      "icon": "fa-solid fa-hat-cowboy"
    },

  ],
  "sites": [
    /*
    ===================================================================================
    ================================gowork=============================================
    */
    {
      "id": "learngitbranching",
      "name": "LearnGitBranching",
      "url": "https://learngitbranching.js.org/?locale=zh_CN",
      "description": "一个在线练习git操作的网站",
      "category": "gowork",
      "icon": "icon/learngitbranching.ico"
    },
    {
      "id": "nowcoder",
      "name": "牛客",
      "url": "https://www.nowcoder.com/",
      "description": "一款挺杂的面经分享网站，杂了招聘、做题、做项目、背八股",
      "category": "gowork",
      "icon": "icon/nowcoder.ico"
    },
    {
      "id": "programmercarl",
      "name": "代码随想录",
      "url": "https://programmercarl.com/",
      "description": "代码随想录",
      "category": "gowork",
      "icon": "icon/programmercarl.png"
    },
    {
      "id": "mianshiya",
      "name": "面试鸭",
      "url": "https://www.mianshiya.com/",
      "description": "一款AI生成资料的八股背诵工具",
      "category": "gowork",
      "icon": "icon/mianshiya.ico"
    },
    {
      "id": "xiaolincoding",
      "name": "小林Coding",
      "url": "https://www.xiaolincoding.com/",
      "description": "系统和网络部分很经典",
      "category": "gowork",
      "icon": "icon/xiaolincoding.webp"
    },
    {
      "id": "csguidecn",
      "name": "编程指北",
      "url": "https://csguide.cn/",
      "description": "cpp挺全的",
      "category": "gowork",
      "icon": "icon/csguidecn.ico"
    },
    {
      "id": "csview",
      "name": "csview",
      "url": "https://www.csview.cn/",
      "description": "CSView一个面试和八股文的网站",
      "category": "gowork",
      "icon": "icon/csview.png"
    },
    {
      "id": "leetcode",
      "name": "LeetCode",
      "url": "https://leetcode.cn/",
      "description": "你们什么时候周赛才能打败AI",
      "category": "gowork",
      "icon": "icon/leetcode.webp"
    },
    {
      "id": "wondercv",
      "name": "超级简历",
      "url": "https://www.wondercv.com/",
      "description": "比较好用的一个简历制作网站",
      "category": "gowork",
      "icon": "icon/wondercv.ico"
    },
    {
      "id": "bosszhipin",
      "name": "Boss直聘",
      "url": "https://www.zhipin.com/",
      "description": "什么都有",
      "category": "gowork",
      "icon": "icon/bosszhipin.ico"
    },
    {
      "id": "lintcode",
      "name": "Lintcode炼码",
      "url": "https://www.lintcode.com/",
      "description": "体验不如leetcode",
      "category": "gowork",
      "icon": "icon/lintcode.ico"
    },
    {
      "id": "acmcoder",
      "name": "acmcoder赛码",
      "url": "https://www.acmcoder.com/",
      "description": "有些公司会使用这个平台进行笔试",
      "category": "gowork",
      "icon": "icon/acmcoder.ico"
    },
    {
      "id": "shixiseng",
      "name": "实习僧",
      "url": "https://www.shixiseng.com/",
      "description": "一般",
      "category": "gowork",
      "icon": "icon/shixiseng.ico"
    },
    {
      "id": "zhilianzhaopin",
      "name": "智联招聘",
      "url": "https://www.zhaopin.com/",
      "description": "智联招聘",
      "category": "gowork",
      "icon": "icon/zhilianzhaopin.png"
    },
    {
      "id": "ciweishixi",
      "name": "刺猬实习",
      "url": "https://www.ciwei.net/",
      "description": "刺猬实习",
      "category": "gowork",
      "icon": "icon/ciweishixi.ico"
    },
    {
      "id": "haitouzhaopin",
      "name": "鱼泡直聘校招",
      "url": "https://www.haitou.cc/",
      "description": "原网站是海投网",
      "category": "gowork",
      "icon": "icon/haitouzhaopin.ico"
    },
    {
      "id": "yingjiesheng",
      "name": "应届生求职网",
      "url": "https://www.yingjiesheng.com/",
      "description": "应届生求职网",
      "category": "gowork",
      "icon": "icon/yingjiesheng.png"
    },
    {
      "id": "maimai",
      "name": "脉脉",
      "url": "https://maimai.cn/",
      "description": "momo",
      "category": "gowork",
      "icon": "icon/maimai.ico"
    },
    {
      "id": "offershow",
      "name": "offershow",
      "url": "https://www.offershow.cn/",
      "description": "马内马内",
      "category": "gowork",
      "icon": "icon/offershow.ico"
    },
    /*
    ===================================================================================
    ================================papers=============================================
    */
    {
      "id": "mycolorSpace",
      "name": "mycolor-space",
      "url": "https://mycolor.space/",
      "description": "科研绘图配色推荐！",
      "category": "papers",
      "icon": "icon/MycolorSpace.png"
    },
    {
      "id": "zlib",
      "name": "Z-Library",
      "url": "https://z-lib.id/",
      "description": "Z-Library",
      "category": "papers",
      "icon": "icon/zlib.ico"
    },
    {
      "id": "arxiv",
      "name": "arXiv",
      "url": "https://arxiv.org/",
      "description": "arxiv，预印本",
      "category": "papers",
      "icon": "icon/arxiv.png"
    },
    {
      "id": "sota",
      "name": "SOTA",
      "url": "https://paperswithcode.com/sota",
      "description": "收集论文SOTA模型",
      "category": "papers",
      "icon": "icon/sota.png"
    },
    {
      "id": "overleaf",
      "name": "Overleaf",
      "url": "https://www.overleaf.com/",
      "description": "经典Latex在线工具，写作必备",
      "category": "papers",
      "icon": "icon/overleaf.svg"
    },
        {
      "id": "semanticscholar",
      "name": "Semanticscholar",
      "url": "https://www.semanticscholar.org/",
      "description": "在线查找papers",
      "category": "papers",
      "icon": "icon/semanticscholar.png"
    },
        {
      "id": "ccfnis",
      "name": "CCF分区",
      "url": "https://www.ccf.org.cn/Academic_Evaluation/NIS/",
      "description": "网络与信息安全推荐期刊",
      "category": "papers",
      "icon": "icon/ccfnis.png"
    },
        {
      "id": "IEEEtemplateSelector",
      "name": "IEEE论文模板下载",
      "url": "https://template-selector.ieee.org/secure/templateSelector/publicationType",
      "description": "IEEE论文模板下载",
      "category": "papers",
      "icon": "icon/IEEEtemplateSelector.png"
    },
    {
      "id": "xueshu",
      "name": "学术之家",
      "url": "https://www.xueshu.com/",
      "description": "学术之家",
      "category": "papers",
      "icon": "icon/xueshu.ico"
    },
        {
      "id": "enmermaid",
      "name": "mermaid",
      "url": "https://mermaid.live/",
      "description": "国外的在线mermaid，有限量免费，样式还行",
      "category": "papers",
      "icon": "icon/enmermaid.svg"
    },
    {
      "id": "yanfajia",
      "name": "研发家",
      "url": "https://www.yanfajia.com/",
      "description": "研发家",
      "category": "papers",
      "icon": "icon/yanfajia.ico"
    },
    {
      "id": "cnmermaid",
      "name": "mermaid",
      "url": "https://www.min2k.com/tools/mermaid/",
      "description": "国内的在线mermaid",
      "category": "papers",
      "icon": "icon/cnmermaid.ico"
    },

    /*
    ===================================================================================
    ================================CampusWelfare======================================
    */
    {
      "id": "futurecv",
      "name": "未来简历",
      "url": "https://futurecv.cn/",
      "description": "你深也有一个会免的简历制作工具",
      "category": "CampusWelfare",
      "icon": "icon/futurecv.png"
    },    
    {
      "id": "jiuyexing",
      "name": "就业星",
      "url": "https://portal.jiuyexing.com/#/home/home-page",
      "description": "也是有模拟面试之类的，会免",
      "category": "CampusWelfare",
      "icon": "icon/jiuyexing.png"
    },
    {
      "id": "aminer",
      "name": "有时面试",
      "url": "https://growup.aminer.cn/student/login",
      "description": "你深特有的会免，可以AI模拟面试",
      "category": "CampusWelfare",
      "icon": "icon/aminer.jpg"
    },
    {
      "id": "szunas",
      "name": "网安Alist网盘",
      "url": "http://nas.szu.moe/",
      "description": "仅限校内网络访问，里面很多东西思密达，经常性崩",
      "category": "CampusWelfare",
      "icon": "icon/szunas.svg"
    },
    {
      "id": "szums",
      "name": "校内正版软件下载",
      "url": "http://ms.szu.edu.cn/",
      "description": "仅限校内网络访问，matlab、wps",
      "category": "CampusWelfare",
      "icon": "icon/szums.ico"
    },

    
    /*
    ===================================================================================
    ========================================Server=====================================
    */
    {
      "id": "vpsboy",
      "name": "vpsboy",
      "url": "https://vpsboy.top/",
      "description": "多的不说了",
      "category": "Server",
      "icon": "icon/vpsboy.png"
    },
    {
      "id": "cloudcone",
      "name": "cloudcone",
      "url": "https://app.cloudcone.com/",
      "description": "多的不说了",
      "category": "Server",
      "icon": "icon/cloudcone.png"
    },
    {
      "id": "whdmw",
      "name": "whdmw",
      "url": "https://www.whdmw.com/",
      "description": "大麦云主机",
      "category": "Server",
      "icon": "icon/whdmw.ico"
    },
    {
      "id": "autodl",
      "name": "AutoDL",
      "url": "https://www.autodl.com/console/homepage/personal",
      "description": "经典GPU算力，主要是可以走报销，有账单说明啥的",
      "category": "Server",
      "icon": "icon/autodl.png"
    },
    {
      "id": "tencentCloud",
      "name": "腾讯云",
      "url": "https://cloud.tencent.com/",
      "description": "有保证",
      "category": "Server",
      "icon": "icon/tencentCloud.ico"
    },
    {
      "id": "huaweiCloud",
      "name": "华为云",
      "url": "https://www.huaweicloud.com/",
      "description": "华为云",
      "category": "Server",
      "icon": "icon/huaweiCloud.ico"
    },
    {
      "id": "tianyiCloud",
      "name": "天翼云",
      "url": "https://www.ctyun.cn/",
      "description": "呃呃呃",
      "category": "Server",
      "icon": "icon/tianyiCloud.ico"
    },
    {
      "id": "jdCloud",
      "name": "京东云",
      "url": "https://www.jdcloud.com/",
      "description": "嗯嗯嗯",
      "category": "Server",
      "icon": "icon/jdCloud.ico"
    },
    {
      "id": "volcengine",
      "name": "火山引擎",
      "url": "https://www.volcengine.com/product/gpu",
      "description": "新起之秀",
      "category": "Server",
      "icon": "icon/volcengine.png"
    },
    {
      "id": "aliyun",
      "name": "阿里云",
      "url": "https://cn.aliyun.com/",
      "description": "品牌的力量",
      "category": "Server",
      "icon": "icon/aliyun.ico"
    },
    
    /*
    ===================================================================================
    ========================================AI=========================================
    */
    {
      "id": "kaggle",
      "name": "kaggle",
      "url": "https://www.kaggle.com/",
      "description": "kaggle",
      "category": "AI",
      "icon": "icon/kaggle.ico"
    },
    {
      "id": "HappyLLM",
      "name": "HappyLLM",
      "url": "https://datawhalechina.github.io/happy-llm/#/",
      "description": "适合中国宝宝体质的LLM入门手册",
      "category": "AI",
      "icon": "icon/HappyLLM.png"
    },
    {
      "id": "LLaMAFactory",
      "name": "LLaMA-Factory",
      "url": "https://github.com/hiyouga/LLaMA-Factory",
      "description": "永远的神，LLaMA-Factory",
      "category": "AI",
      "icon": "icon/LLaMAFactory.png"
    },
    {
      "id": "easydataset",
      "name": "Easy-dataset",
      "url": "https://github.com/ConardLi/easy-dataset/blob/main/README.zh-CN.md",
      "description": "一个使用大模型帮你处理数据集的好东西",
      "category": "AI",
      "icon": "icon/easydataset.png"
    },
    {
      "id": "promptingguide",
      "name": "PromptingGuide",
      "url": "https://www.promptingguide.ai/zh",
      "description": "21世纪每个人都得会提示词工程",
      "category": "AI",
      "icon": "icon/promptingguide.svg"
    },
    {
      "id": "promptoptimizer",
      "name": "PromptOptimizer",
      "url": "https://github.com/linshenkx/prompt-optimizer",
      "description": "什么？你说不会提示词？那就AI帮你改吧",
      "category": "AI",
      "icon": "icon/promptoptimizer.ico"
    },
    {
      "id": "henapi",
      "name": "HenAPI",
      "url": "https://www.henapi.top/dash",
      "description": "HenAPI",
      "category": "AI",
      "icon": "icon/henapi.png"
    },
    {
      "id": "siliconflow",
      "name": "硅基流动",
      "url": "https://siliconflow.cn/",
      "description": "硅基流动",
      "category": "AI",
      "icon": "icon/siliconflow.ico"
    },
    {
      "id": "openai",
      "name": "Openai",
      "url": "https://openai.com/",
      "description": "还是无法逾越的高山",
      "category": "AI",
      "icon": "icon/openai.svg"
    },
    {
      "id": "deepseek",
      "name": "DeepSeek",
      "url": "https://chat.deepseek.com/",
      "description": "不要念成DickSeek了",
      "category": "AI",
      "icon": "icon/deepseek.svg"
    },
    {
      "id": "qwenai",
      "name": "Qwen",
      "url": "https://chat.qwen.ai/",
      "description": "从学术界迈向ToC",
      "category": "AI",
      "icon": "icon/qwenai.png"
    },
    {
      "id": "chatgpt",
      "name": "ChatGPT",
      "url": "https://chat.chatbot.app/?model=4o-mini",
      "description": "ChatGPT对话",
      "category": "AI",
      "icon": "icon/chatgpt.svg"
    },
    {
      "id": "kimi",
      "name": "kimi",
      "url": "https://www.kimi.com/",
      "description": "别的不敢说，但他搜索arxiv有一手的",
      "category": "AI",
      "icon": "icon/kimi.ico"
    },
    {
      "id": "yuanbao",
      "name": "腾讯元宝",
      "url": "https://yuanbao.tencent.com/",
      "description": "DeepSeek启动器罢了",
      "category": "AI",
      "icon": "icon/yuanbao.svg"
    },
    {
      "id": "doubao",
      "name": "豆包",
      "url": "https://www.doubao.com/chat/",
      "description": "豆包姐越来越像人了",
      "category": "AI",
      "icon": "icon/doubao.png"
    },
    {
      "id": "mcpcn",
      "name": "MCP大全",
      "url": "https://www.mcp-cn.com/",
      "description": "MCP菜单",
      "category": "AI",
      "icon": "icon/mcpcn.svg"
    },
    {
      "id": "dify",
      "name": "Dify",
      "url": "https://cloud.dify.ai/apps",
      "description": "好好好",
      "category": "AI",
      "icon": "icon/dify.svg"
    },
    {
      "id": "huggingface",
      "name": "HuggingFace",
      "url": "https://huggingface.co/",
      "description": "好好好",
      "category": "AI",
      "icon": "icon/huggingface.ico"
    },
    {
      "id": "modelscope",
      "name": "魔塔",
      "url": "https://www.modelscope.cn/home",
      "description": "好好好",
      "category": "AI",
      "icon": "icon/modelscope.ico"
    },
    {
      "id": "gpt4oapi",
      "name": "GPT4o-api资源",
      "url": "https://www.gpt4oapi.com/",
      "description": "某个gpt资源站",
      "category": "AI",
      "icon": "icon/gpt4oapi.ico"
    },
    {
      "id": "gptapius",
      "name": "GPT资源",
      "url": "https://www.gptapi.us/",
      "description": "某个gpt资源站",
      "category": "AI",
      "icon": "icon/gptapius.ico"
    },
    {
      "id": "labml",
      "name": "labml",
      "url": "https://nn.labml.ai/zh/",
      "description": "逐行解读机器学习代码",
      "category": "AI",
      "icon": "icon/labml.png"
    },
    {
      "id": "trae",
      "name": "Trae",
      "url": "https://www.trae.cn/plugin",
      "description": "感觉不如cursor",
      "category": "AI",
      "icon": "icon/trae.png"
    },
    {
      "id": "cursor",
      "name": "Cursor",
      "url": "https://cursor.com/cn",
      "description": "双汇火腿肠，王中王",
      "category": "AI",
      "icon": "icon/cursor.ico"
    },
    {
      "id": "d2lai",
      "name": "深度学习",
      "url": "https://zh.d2l.ai/index.html",
      "description": "动手学深度学习一书的电子册",
      "category": "AI",
      "icon": "icon/d2lai.png"
    },       
    /*
    ===================================================================================
    =====================================meme==========================================
    */
    {
      "id": "nof1ai",
      "name": "LLM-solo炒股战",
      "url": "https://nof1.ai/",
      "description": "LLM塞博斗蛐蛐",
      "category": "meme",
      "icon": "icon/nof1ai.png"
    },
    {
      "id": "icebergcharts",
      "name": "中文互联网迷因",
      "url": "https://icebergcharts.com/i/Chinese_Oddities",
      "description": "当小故事看了，还挺有趣的",
      "category": "meme",
      "icon": "icon/icebergcharts.png"
    },
    {
      "id": "typora",
      "name": "typora通行证管理",
      "url": "https://store.typora.io/my",
      "description": "谁把这玩意放这里了？",
      "category": "meme",
      "icon": "icon/typora.png"
    },
    {
      "id": "wanxuege",
      "name": "考研网盘",
      "url": "https://www.wanxuege.com/forum-93-1.html",
      "description": "万学阁，考研网盘挺全的",
      "category": "meme",
      "icon": "icon/wanxuege.ico"
    },
    {
      "id": "tapfog",
      "name": "Tapfog",
      "url": "https://www.tapfog.io/#/login",
      "description": "DDDD，阶段计费型",
      "category": "meme",
      "icon": "icon/tapfog.ico"
    },
    {
      "id": "mojie",
      "name": "MoJie",
      "url": "https://mojie.me/#/dashboard",
      "description": "DDDD，当量计费型",
      "category": "meme",
      "icon": "icon/mojie.ico"
    },
    {
      "id": "tizi001",
      "name": "tizi001",
      "url": "https://tizi001.com/",
      "description": "DDDD，备用",
      "category": "meme",
      "icon": "icon/tizi001.ico"
    },
    {
      "id": "xhj",
      "name": "小火箭",
      "url": "https://xhj.info/",
      "description": "游戏加速",
      "category": "meme",
      "icon": "icon/xhj.png"
    },
    {
      "id": "xxfvipaff",
      "name": "小旋风加速",
      "url": "https://ca01.xxfvipaff.pro/#/login",
      "description": "游戏加速",
      "category": "meme",
      "icon": "icon/xxfvipaff.png"
    },
    {
      "id": "windy",
      "name": "Windy风力图",
      "url": "https://www.windy.com/",
      "description": "十分好用的气象网站",
      "category": "meme",
      "icon": "icon/windy.png"
    },
    /*
    ===================================================================================
    ================================VulnerabilityDatabase==============================
    */
    {
      "id": "huntrCom",
      "name": "Huntr",
      "url": "https://huntr.com/",
      "description": "全球首个针对人工智能的漏洞赏金平台",
      "category": "VulnerabilityDatabase",
      "icon": "icon/huntrCom.ico"
    },
    {
      "id": "Vulnerability-lookup",
      "name": "Vulnerability-lookup",
      "url": "https://cve.circl.lu/",
      "description": "Vulnerability-lookup漏洞查找",
      "category": "VulnerabilityDatabase",
      "icon": "icon/Vulnerability-lookup.ico"
    },
    {
      "id": "cnnvd",
      "name": "国家信息安全漏洞库",
      "url": "https://www.cnnvd.org.cn/home/childHome",
      "description": "CNNVD",
      "category": "VulnerabilityDatabase",
      "icon": "icon/cnnvd.ico"
    },
    {
      "id": "cve",
      "name": "CVE漏洞库",
      "url": "https://www.cve.org/",
      "description": "CVE漏洞库",
      "category": "VulnerabilityDatabase",
      "icon": "icon/cve.svg"
    },
    {
      "id": "avdaliyun",
      "name": "aliyun漏洞库",
      "url": "https://avd.aliyun.com/",
      "description": "aliyun漏洞库",
      "category": "VulnerabilityDatabase",
      "icon": "icon/avdaliyun.ico"
    },
    {
      "id": "CVEProject",
      "name": "CVEProject",
      "url": "https://github.com/CVEProject/cvelistV5",
      "description": "cvelist在github",
      "category": "VulnerabilityDatabase",
      "icon": "icon/CVEProject.png"
    },
    {
      "id": "exploitdb",
      "name": "ExploitDB",
      "url": "https://www.exploit-db.com/",
      "description": "不止漏洞库，还有很多其他东西",
      "category": "VulnerabilityDatabase",
      "icon": "icon/exploitdb.ico"
    },
    {
      "id": "butian",
      "name": "补天",
      "url": "https://www.butian.net/",
      "description": "补天平台",
      "category": "VulnerabilityDatabase",
      "icon": "icon/butian.ico"
    },
    {
      "id": "seebug",
      "name": "Seebug",
      "url": "https://www.seebug.org/",
      "description": "知道创宇的漏洞平台",
      "category": "VulnerabilityDatabase",
      "icon": "icon/seebug.ico"
    },
    /*
    ===================================================================================
    ======================================ToolChain====================================
    */
    {
      "id": "namesilo",
      "name": "NameSilo",
      "url": "https://www.namesilo.com/account/",
      "description": "一个免备案的域名站",
      "category": "ToolChain",
      "icon": "icon/NameSilo.ico"
    },
    {
      "id": "qianduangebilidanmu",
      "name": "bili_danmu",
      "url": "https://tool.qianduange.cn/bili_danmu",
      "description": "一个查B站弹幕发送者的网站",
      "category": "ToolChain",
      "icon": "icon/qianduangebilidanmu.png"
    },
    {
      "id": "ctftoolsio",
      "name": "ctftools-io",
      "url": "https://ctftools.github.io/",
      "description": "一个在线的CTFtools收集网站",
      "category": "ToolChain",
      "icon": "icon/ctftoolsio.ico"
    },
    {
      "id": "InternxtCom",
      "name": "InternxtCom",
      "url": "https://internxt.com/zh/temporary-email",
      "description": "一个在线的免费临时邮箱",
      "category": "ToolChain",
      "icon": "icon/InternxtCom.png"
    },
    {
      "id": "viewdnsinfo",
      "name": "viewdnsinfo",
      "url": "https://viewdns.info/",
      "description": "viewdns.info一个有较多关于dns查询、ip查询的在线网站",
      "category": "ToolChain",
      "icon": "icon/viewdnsinfo.ico"
    },
    {
      "id": "de4js",
      "name": "de4js",
      "url": "https://lelinhtinh.github.io/de4js/",
      "description": "de4js，一款js反混淆工具",
      "category": "ToolChain",
      "icon": "icon/de4js.ico"
    },
    {
      "id": "linuxmirrorscn",
      "name": "Linuxmirrors",
      "url": "https://linuxmirrors.cn/",
      "description": "一键脚本换源，巨好用！适配多种系统，别再自己配啦！",
      "category": "ToolChain",
      "icon": "icon/linuxmirrorscn.svg"
    },
    {
      "id": "SerpApi",
      "name": "SerpApi",
      "url": "https://serpapi.com/",
      "description": "SerpApi综合的搜索引擎平台，有免费额度",
      "category": "ToolChain",
      "icon": "icon/SerpApi.png"
    },
    {
      "id": "busuanzi",
      "name": "busuanzi",
      "url": "https://busuanzi.ibruce.info/",
      "description": "永久免费使用，好人站长。你的站点要在公网，它才会去记录",
      "category": "ToolChain",
      "icon": "icon/busuanzi.png"
    },
    {
      "id": "googleanalytics",
      "name": "GoogleAnalytics",
      "url": "https://analytics.google.com/analytics/web/provision/#/provision",
      "description": "GoogleAnalytics",
      "category": "ToolChain",
      "icon": "icon/GoogleAnalytics.png"
    },
    {
      "id": "cloudflareanalytics",
      "name": "CloudflareAnalytics",
      "url": "https://www.cloudflare.com/zh-tw/application-services/products/analytics/",
      "description": "cloudflare网站访问量统计平台",
      "category": "ToolChain",
      "icon": "icon/CloudflareAnalytics.png"
    },
    {
      "id": "counterapi",
      "name": "CounterAPI",
      "url": "https://app.counterapi.dev/",
      "description": "一款免费限量的网站访问量统计平台",
      "category": "ToolChain",
      "icon": "icon/counterapi.png"
    },
    {
      "id": "cowtransfer",
      "name": "奶牛快传（悲）",
      "url": "https://cowtransfer.com/",
      "description": "一个非常简洁好用的文件分享工具，时代的眼泪，25年12月寄了",
      "category": "ToolChain",
      "icon": "icon/cowtransfer.png"
    },
    {
      "id": "dnslog",
      "name": "DNSLog",
      "url": "https://dnslog.uk/template",
      "description": "dnslog反代检查之类的必备，已经寄了",
      "category": "ToolChain",
      "icon": "icon/dnslog.png"
    },
    {
      "id": "syscall",
      "name": "Syscall",
      "url": "https://syscall.sh/",
      "description": "系统调用号查询，什么？你说你是pwn手？",
      "category": "ToolChain",
      "icon": "icon/syscall.png"
    },
    {
      "id": "libc",
      "name": "Libc",
      "url": "https://libc.rip/",
      "description": "libc库查询工具",
      "category": "ToolChain",
      "icon": "icon/libc.png"
    },
    {
      "id": "shellcode",
      "name": "Shellcode",
      "url": "http://shell-storm.org/shellcode/index.html",
      "description": "shellcode大全",
      "category": "ToolChain",
      "icon": "icon/shellcode.png"
    },
    {
      "id": "1o1oxyz",
      "name": "随波逐流",
      "url": "http://1o1o.xyz/",
      "description": "随波逐流一把梭",
      "category": "ToolChain",
      "icon": "icon/1o1oxyz.jpg"
    },
    {
      "id": "lazydork",
      "name": "LazyDork",
      "url": "https://iamunixtz.github.io/LazyDork/",
      "description": "有各种写好配置的谷歌搜索，方便偷懒",
      "category": "ToolChain",
      "icon": "icon/lazydork.ico"
    },
    {
      "id": "sthreatbook",
      "name": "微步云沙箱",
      "url": "https://s.threatbook.com/",
      "description": "好用，简单分析木马文件之类的",
      "category": "ToolChain",
      "icon": "icon/sthreatbook.ico"
    },
    {
      "id": "ddosiscg",
      "name": "SqlMap偷懒",
      "url": "https://www.ddosi.org/scg/",
      "description": "SQLMAP命令偷懒生成的工具罢了",
      "category": "ToolChain",
      "icon": "icon/ddosiscg.png"
    },    
    {
      "id": "dockeraityp",
      "name": "Docker镜像源",
      "url": "https://docker.aityp.com/",
      "description": "Docker渡渡鸟镜像源",
      "category": "ToolChain",
      "icon": "icon/dockeraityp.ico"
    },
    {
      "id": "ddosishell",
      "name": "反弹shell偷懒",
      "url": "https://www.ddosi.org/shell/",
      "description": "反弹shell自动生成的在线工具",
      "category": "ToolChain",
      "icon": "icon/ddosiscg.png"
    },
    {
      "id": "ddosidork",
      "name": "谷歌dork偷懒",
      "url": "https://www.ddosi.org/dork/",
      "description": "谷歌dork偷懒",
      "category": "ToolChain",
      "icon": "icon/ddosiscg.png"
    },
    {
      "id": "factordb",
      "name": "大数分解",
      "url": "http://factordb.com/",
      "description": "大数分解",
      "category": "ToolChain",
      "icon": "icon/factordb.png"
    },
    {
      "id": "godbolt",
      "name": "在线程序转汇编",
      "url": "https://godbolt.org/",
      "description": "在线程序转汇编，非常好用，pwn手初学必备",
      "category": "ToolChain",
      "icon": "icon/godbolt.ico"
    },
    {
      "id": "linuxcommand",
      "name": "Linux命令快查手册",
      "url": "https://wangchujiang.com/linux-command/hot.html",
      "description": "Linux命令快查手册",
      "category": "ToolChain",
      "icon": "icon/linuxcommand.ico"
    },
    {
      "id": "cmd5",
      "name": "CMD5",
      "url": "https://www.cmd5.com/default.aspx",
      "description": "cmd5查询某些加密的在线网站，必备",
      "category": "ToolChain",
      "icon": "icon/cmd5.ico"
    },
    {
      "id": "wavedrom",
      "name": "硬件协议时序图",
      "url": "https://wavedrom.com/editor.html",
      "description": "用于生成硬件协议时序图，美观",
      "category": "ToolChain",
      "icon": "icon/wavedrom.ico"
    },
    {
      "id": "chaipip",
      "name": "高精度IP地址搜索",
      "url": "https://chaipip.com/",
      "description": "定位某个邪恶ip罢了",
      "category": "ToolChain",
      "icon": "icon/chaipip.ico"
    },
    {
      "id": "mirrorstsinghua",
      "name": "清华镜像站",
      "url": "https://mirrors.tuna.tsinghua.edu.cn/",
      "description": "换源必备",
      "category": "ToolChain",
      "icon": "icon/mirrorstsinghua.png"
    },
    {
      "id": "busybox",
      "name": "busybox",
      "url": "https://busybox.net/",
      "description": "应急响应可能需要的原生Linux命令工具",
      "category": "ToolChain",
      "icon": "icon/busybox.ico"
    },    
    {
      "id": "nomoreransom",
      "name": "国际刑警组织反勒索病毒网站",
      "url": "https://www.nomoreransom.org/zh/index.html",
      "description": "如果运气好，你被锁住的文件也许可以找回",
      "category": "ToolChain",
      "icon": "icon/nomoreransom.png"
    },
    {
      "id": "ATTCK",
      "name": "ATT&CK",
      "url": "https://www.ddosi.org/att/index.html#",
      "description": "ATT&CK",
      "category": "ToolChain",
      "icon": "icon/ddosiscg.png"
    },
    {
      "id": "drawnix",
      "name": "Drawnix",
      "url": "https://drawnix.com/",
      "description": "一款开源的白板工具，https://github.com/plait-board/drawnix",
      "category": "ToolChain",
      "icon": "icon/drawnix.ico"
    },
    /*
    ===================================================================================
    ======================================SlackOff=====================================
    */
    {
      "id": "youtube",
      "name": "youtube",
      "url": "https://www.youtube.com/",
      "description": "油管！",
      "category": "SlackOff",
      "icon": "icon/youtube.png"
    },
    {
      "id": "netflix",
      "name": "netflix",
      "url": "https://www.netflix.com/",
      "description": "网飞！",
      "category": "SlackOff",
      "icon": "icon/netflix.ico"
    },
    {
      "id": "acfun",
      "name": "A站",
      "url": "https://www.acfun.cn/",
      "description": "acfun",
      "category": "SlackOff",
      "icon": "icon/acfun.ico"
    },
    {
      "id": "bilibili",
      "name": "B站",
      "url": "https://www.bilibili.com/",
      "description": "都快变成p站了",
      "category": "SlackOff",
      "icon": "icon/bilibili.ico"
    },
    {
      "id": "cctv",
      "name": "CCTV",
      "url": "https://tv.cctv.com/",
      "description": "这是C站，谁赞成，谁反对",
      "category": "SlackOff",
      "icon": "icon/cctv.ico"
    },
    {
      "id": "missevan",
      "name": "M站",
      "url": "https://www.missevan.com/",
      "description": "missevan，猫耳FM弹幕音图站",
      "category": "SlackOff",
      "icon": "icon/missevan.ico"
    },
    {
      "id": "ddys",
      "name": "低端影视（悲）",
      "url": "https://ddys.pro//",
      "description": "时代的眼泪，不可抗力停站了！",
      "category": "SlackOff",
      "icon": "icon/ddys.webp"
    },
    {
      "id": "iqiyi",
      "name": "爱奇艺",
      "url": "https://www.iqiyi.com/",
      "description": "爱奇艺",
      "category": "SlackOff",
      "icon": "icon/iqiyi.ico"
    },
    {
      "id": "youku",
      "name": "优酷",
      "url": "https://www.youku.com/ku/webhome",
      "description": "优酷",
      "category": "SlackOff",
      "icon": "icon/youku.png"
    },
    {
      "id": "saduck",
      "name": "SaDuck考公网站",
      "url": "https://saduck.top/",
      "description": "空闲练一练行测真不是说笑",
      "category": "SlackOff",
      "icon": "icon/saduck.png"
    },
    {
      "id": "tuxun",
      "name": "图寻",
      "url": "https://tuxun.fun/",
      "description": "一屋不出看天下，每日挑战攒积分",
      "category": "SlackOff",
      "icon": "icon/tuxun.ico"
    },
    {
      "id": "haiyongmoyu",
      "name": "摸鱼小游戏",
      "url": "https://haiyong.site/moyu/",
      "description": "摸鱼小游戏，挺全的，无聊玩一下",
      "category": "SlackOff",
      "icon": "icon/haiyongmoyu.png"
    },
    {
      "id": "emoji6",
      "name": "emoji表情包生成",
      "url": "https://emoji6.com/",
      "description": "emoji表情包生成，杂交",
      "category": "SlackOff",
      "icon": "icon/emoji6.png"
    },
    {
      "id": "cilisousuo",
      "name": "磁力神器",
      "url": "https://cilishenqi.cc/favorites/cilisousuo",
      "description": "某些同学不要在实验室搜索奇奇怪怪的东西哈，尼玛的这网站还banF12",
      "category": "SlackOff",
      "icon": "icon/cilisousuo.png"
    },
    {
      "id": "ddosibug",
      "name": "神兽保佑",
      "url": "https://www.ddosi.org/bug.html",
      "description": "放置在代码中的玄学标识",
      "category": "SlackOff",
      "icon": "icon/ddosiscg.png"
    },
    {
      "id": "similarsites",
      "name": "找相似网站",
      "url": "https://www.similarsites.com/",
      "description": "找相似网站",
      "category": "SlackOff",
      "icon": "icon/similarsites.png"
    },
    {
      "id": "carbon",
      "name": "代码展示生成",
      "url": "https://carbon.now.sh/",
      "description": "做PPT必备，不会有人直接白纸黑字粘贴上去吧",
      "category": "SlackOff",
      "icon": "icon/carbon.ico"
    },
    {
      "id": "fyscs",
      "name": "csgo风云社",
      "url": "https://fyscs.com/",
      "description": "风云社启动！",
      "category": "SlackOff",
      "icon": "icon/fyscs.png"
    },
    {
      "id": "codefun2000",
      "name": "Hot100的ACM模式",
      "url": "https://codefun2000.com/",
      "description": "充值了的Hot100，可以acm模式",
      "category": "SlackOff",
      "icon": "icon/codefun2000.png"
    },
    /*
    ===================================================================================
    =====================================TargetDrones==================================
    */
    {
      "id": "labex",
      "name": "LabEx",
      "url": "https://labex.io/zh/learn",
      "description": "LabEx",
      "category": "TargetDrones",
      "icon": "icon/labex.ico"
    },
    {
      "id": "portswigger",
      "name": "Burp官网实验",
      "url": "https://portswigger.net/web-security",
      "description": "Burp官网实验",
      "category": "TargetDrones",
      "icon": "icon/portswigger.ico"
    },
    {
      "id": "PwnProtostar",
      "name": "PWN-Protostar",
      "url": "https://exploit.education/protostar/",
      "description": "一个关卡式学习pwn的网站",
      "category": "TargetDrones",
      "icon": "icon/PwnProtostar.png"
    },
    {
      "id": "buuctf",
      "name": "BUUCTF",
      "url": "https://buuoj.cn/challenges",
      "description": "BUUCTF，免费的ctf在线练习平台",
      "category": "TargetDrones",
      "icon": "icon/buuctf.ico"
    },
    {
      "id": "ctfshow",
      "name": "CTFshow",
      "url": "https://ctf.show/",
      "description": "CTFshow",
      "category": "TargetDrones",
      "icon": "icon/ctfshow.png"
    },
    {
      "id": "ctfhub",
      "name": "CTFhub",
      "url": "https://www.ctfhub.com/#/index",
      "description": "ctfhub",
      "category": "TargetDrones",
      "icon": "icon/ctfhub.png"
    },
    {
      "id": "edisec",
      "name": "玄机靶场",
      "url": "https://xj.edisec.net/",
      "description": "玄机靶场",
      "category": "TargetDrones",
      "icon": "icon/edisec.ico"
    },
    {
      "id": "bugku",
      "name": "Bugku",
      "url": "https://ctf.bugku.com/",
      "description": "bugku",
      "category": "TargetDrones",
      "icon": "icon/bugku.ico"
    },
    {
      "id": "didctf",
      "name": "DIDCTF",
      "url": "https://forensics.didctf.com/",
      "description": "电子数据取证练习平台",
      "category": "TargetDrones",
      "icon": "icon/didctf.png"
    },
    {
      "id": "xctf",
      "name": "xctf",
      "url": "https://adworld.xctf.org.cn/home/index",
      "description": "攻防世界",
      "category": "TargetDrones",
      "icon": "icon/xctf.ico"
    },
    {
      "id": "ctfwar",
      "name": "ctfwar",
      "url": "https://ctfwar.org.cn/",
      "description": "攻防战争",
      "category": "TargetDrones",
      "icon": "icon/ctfwar.jpg"
    },
    {
      "id": "helloctf",
      "name": "HelloCTF",
      "url": "https://hello-ctf.com/",
      "description": "HelloCTF",
      "category": "TargetDrones",
      "icon": "icon/helloctf.png"
    },


    /*
    ===================================================================================
    ====================================Forum==========================================
    */
    {
      "id": "DailyDarkWeb",
      "name": "DailyDarkWeb",
      "url": "https://dailydarkweb.net/",
      "description": "DailyDarkWeb每日暗网，可能不全",
      "category": "Forum",
      "icon": "icon/DailyDarkWeb.png"
    },
    {
      "id": "linuxdo",
      "name": "Linuxdo社区",
      "url": "https://linux.do/",
      "description": "L站",
      "category": "Forum",
      "icon": "icon/linuxdo.png"
    },
    {
      "id": "v2ex",
      "name": "V2EX社区",
      "url": "https://www.v2ex.com/",
      "description": "V2EX社区",
      "category": "Forum",
      "icon": "icon/v2ex.ico"
    },
    {
      "id": "kanxue",
      "name": "看雪",
      "url": "https://bbs.kanxue.com/",
      "description": "看雪",
      "category": "Forum",
      "icon": "icon/kanxue.ico"
    },
    {
      "id": "ichunqiu",
      "name": "i春秋",
      "url": "https://www.ichunqiu.com/",
      "description": "i春秋",
      "category": "Forum",
      "icon": "icon/ichunqiu.ico"
    },
    {
      "id": "longyusec",
      "name": "泷羽Sec安全团队",
      "url": "https://longyusec.com/",
      "description": "泷羽Sec安全团队",
      "category": "Forum",
      "icon": "icon/longyusec.png"
    },
    {
      "id": "52pojie",
      "name": "吾爱破解",
      "url": "https://www.52pojie.cn/forum.php",
      "description": "神中神，大佬云集",
      "category": "Forum",
      "icon": "icon/52pojie.svg"
    },
    {
      "id": "anquanke",
      "name": "安全客",
      "url": "https://www.anquanke.com/",
      "description": "安全客",
      "category": "Forum",
      "icon": "icon/anquanke.ico"
    },
    {
      "id": "aqniukt",
      "name": "安全牛课堂",
      "url": "https://www.aqniukt.com/",
      "description": "不做评价",
      "category": "Forum",
      "icon": "icon/aqniukt.png"
    },
    {
      "id": "freebuf",
      "name": "FreeBuf",
      "url": "https://www.freebuf.com/",
      "description": "以前很好，现在只能拣点有趣的看看了",
      "category": "Forum",
      "icon": "icon/freebuf.png"
    },
    {
      "id": "ctfwiki",
      "name": "ctf-wiki教学时间",
      "url": "https://ctf-wiki.org/",
      "description": "ctfwiki",
      "category": "Forum",
      "icon": "icon/ctfwiki.png"
    },
    {
      "id": "yuquehxfqg9",
      "name": "二进制学习笔记",
      "url": "https://www.yuque.com/hxfqg9/bin",
      "description": "（别人的）",
      "category": "Forum",
      "icon": "icon/yuquehxfqg9.png"
    },
    {
      "id": "wwwprojectwebsecuritytestingguide",
      "name": "OWASP基金会测试手册",
      "url": "https://owasp.org/www-project-web-security-testing-guide/stable/",
      "description": "OWASP基金会测试手册",
      "category": "Forum",
      "icon": "icon/wwwprojectwebsecuritytestingguide.ico"
    },
    {
      "id": "bdziyi",
      "name": "棉花糖",
      "url": "https://vip.bdziyi.com/",
      "description": "网安在线吃瓜学习网站",
      "category": "Forum",
      "icon": "icon/bdziyi.jpg"
    },
    {
      "id": "cnsec",
      "name": "cnsec中文站",
      "url": "https://cn-sec.com/",
      "description": "网安学习网站，挺多的",
      "category": "Forum",
      "icon": "icon/cnsec.ico"
    },
    {
      "id": "anquan419",
      "name": "安全419",
      "url": "http://www.anquan419.com/",
      "description": "网安信息汇总，主要是比赛",
      "category": "Forum",
      "icon": "icon/anquan419.ico"
    },
    {
      "id": "yijinglab",
      "name": "蚁景网安",
      "url": "https://www.yijinglab.com/",
      "description": "就跟那种中国大学MOOC一样的主页，然后你付钱就是了",
      "category": "Forum",
      "icon": "icon/yijinglab.png"
    },
    {
      "id": "cnfnst",
      "name": "隼目安全",
      "url": "https://www.cn-fnst.top/",
      "description": "网安学习平台",
      "category": "Forum",
      "icon": "icon/cnfnst.png"
    },
    /*
    ===================================================================================
    ================================Information========================================
    */
    {
      "id": "uidejfkdev",
      "name": "UidEjfkdev",
      "url": "https://uid.ejfkdev.com/",
      "description": "一个检测分享链接泄露隐私的在线网站",
      "category": "Information",
      "icon": "icon/uidejfkdev.ico"
    },
    {
      "id": "xamgt",
      "name": "环宇网络社工库",
      "url": "https://xamgt.com/",
      "description": "一个付费的社工库",
      "category": "Information",
      "icon": "icon/xamgt.ico"
    },
    {
      "id": "privacyaiuys",
      "name": "个人数据泄露检测",
      "url": "https://privacy.aiuys.com/?ref=@#google_vignette",
      "description": "通过QQ/手机号/身份证等来查连带",
      "category": "Information",
      "icon": "icon/privacyaiuys.ico"
    },
    {
      "id": "fofa",
      "name": "FoFa",
      "url": "https://fofa.info/",
      "description": "fofa，好用，可以去咸鱼找找便宜的资源",
      "category": "Information",
      "icon": "icon/fofa.ico"
    },
    {
      "id": "hunter",
      "name": "Hunter",
      "url": "https://hunter.how/",
      "description": "我勒个Hunter啊",
      "category": "Information",
      "icon": "icon/hunter.ico"
    },
    {
      "id": "shodan",
      "name": "shodan",
      "url": "https://www.shodan.io/",
      "description": "shodan信息搜集",
      "category": "Information",
      "icon": "icon/shodan.png"
    },
    {
      "id": "Quake360",
      "name": "Quake360",
      "url": "https://quake.360.net/quake/#/index",
      "description": "360网络空间测绘",
      "category": "Information",
      "icon": "icon/Quake360.png"
    },
    {
      "id": "zoomeye",
      "name": "zoomeye",
      "url": "https://www.zoomeye.org/",
      "description": "钟馗之眼，感觉IoT得行",
      "category": "Information",
      "icon": "icon/zoomeye.ico"
    },
    {
      "id": "CenSys",
      "name": "CenSys",
      "url": "https://search.censys.io/",
      "description": "也相当于资产测绘了",
      "category": "Information",
      "icon": "icon/CenSys.ico"
    },
    {
      "id": "crtsh",
      "name": "CrtSh",
      "url": "https://crt.sh/",
      "description": "搜索子域名，免费又全！还能搜历史缓存。",
      "category": "Information",
      "icon": "icon/CrtSh.png"
    },
    {
      "id": "weixinsogou",
      "name": "weixinsogou",
      "url": "https://weixin.sogou.com/",
      "description": "搜狗查找微信公众号等内容",
      "category": "Information",
      "icon": "icon/weixinsogou.ico"
    },
    {
      "id": "ti360",
      "name": "Ti360",
      "url": "https://ti.360.net/",
      "description": "360安全大脑，不自信的网站就开Anti-Debug了",
      "category": "Information",
      "icon": "icon/ti360.png"
    },
    {
      "id": "tiqianxin",
      "name": "TiQiAnXin",
      "url": "https://ti.qianxin.com/",
      "description": "奇安信威胁情报中心，这哥们真没icon啊，随便截了个",
      "category": "Information",
      "icon": "icon/tiqianxin.png"
    },
    {
      "id": "tisangfor",
      "name": "TiSangfor",
      "url": "https://ti.sangfor.com.cn/analysis-platform?lang=ZH-CN",
      "description": "深信服威胁情报中心",
      "category": "Information",
      "icon": "icon/tisangfor.ico"
    },
    {
      "id": "beianx",
      "name": "ICP备案查询",
      "url": "https://www.beianx.cn/",
      "description": "ICP备案查询",
      "category": "Information",
      "icon": "icon/beianx.ico"
    },
    {
      "id": "dnsdumpster",
      "name": "dnsdumpster",
      "url": "https://dnsdumpster.com/",
      "description": "信息收集必备，找旁站或者内网之类的",
      "category": "Information",
      "icon": "icon/dnsdumpster.ico"
    },
    {
      "id": "xthreatbook",
      "name": "微步在线威胁分析",
      "url": "https://x.threatbook.com/",
      "description": "微步在线威胁分析",
      "category": "Information",
      "icon": "icon/xthreatbook.ico"
    },
    {
      "id": "lingfengyun",
      "name": "lingfengyun",
      "url": "https://www.lingfengyun.com/",
      "description": "凌风云，一个可以搜索很多网盘关键字的平台，信息搜集",
      "category": "Information",
      "icon": "icon/lingfengyun.ico"
    },
  ]
}; 