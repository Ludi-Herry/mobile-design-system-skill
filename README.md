# 移动端设计系统与跨平台组件规范 AI Skill (Ludi Mobile Design System Skill)

> **将 iOS HIG、Android Material 3 与移动端工程实战踩坑法则，转化为 AI 可执行的代码生成与审查约束。**  
> 一套彻底终结“移动端代码直接照搬桌面表格、安全区被遮挡、软键盘弹起遮挡输入框、浮层滑动底层乱晃”的工业级设计系统资产。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Mobile Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android%20%7C%20H5%20%7C%20MiniApp-emerald.svg)]()
[![Design Guidelines](https://img.shields.io/badge/Guidelines-iOS%20HIG%20%7C%20Material%203-purple.svg)]()
[![Touch Standard](https://img.shields.io/badge/Touch%20Target-44pt%20%2F%2048dp-orange.svg)]()

---

## 为什么需要这个 Skill？

在移动端（iOS / Android / 小程序 / 响应式 Web）开发与 AI 代码生成中，开发者常面临以下严重缺陷：
- 底部固定定位按钮（`fixed bottom-0`）没有避让 iPhone 全面屏的 Home Indicator，按钮被横条遮挡，用户点击时频繁误触滑回桌面；
- 在手机极窄屏幕上生搬硬套桌面端的多列大表格，导致页面发生灾难性的横向晃动；
- 点击靠下的输入框时，软键盘弹起直接盖住输入框，用户完全看不见自己输入的字符；
- 手机号或纯数字字段未配置 `inputmode`，手机弹出了全尺寸的英文键盘，用户必须手动切换到数字面板；
- 弹出了底部半屏抽屉，手指在抽屉里上下滑动时，抽屉没动，底层的整个主页面却在疯狂跟着晃动（滚动穿透）；
- 关闭小按钮只有 16px，按压失败率极高，缺乏 44pt 最小触控热区保证。

**根本原因：移动端拥有与桌面 Web 截然不同的物理触控法则、视口硬件边界与手势心智。**

本 Skill 将 iOS 与 Android 两大平台的设计规范、多分辨率倍率换算以及真实的移动工程避坑经验，提炼成 Agent、Claude Code、Cursor、Windsurf、Codex 可以直接遵循的 **“移动端 AI 可执行设计规则层”**。

---

## 核心能力与规范架构

### 1. 物理视口与安全区避让 (Safe Area Insets)
- 顶部状态栏避让（44–62pt）与底部 Home Bar 避让（34pt），全面屏标准声明 `env(safe-area-inset-*)`；
- 逻辑点（pt/dp）与渲染倍率（@2x/@3x/xxhdpi）严谨换算；
- 移动端 0.5px 精细微边框体系，解决 Retina 屏幕下 `1px` 粗笨失真的历史缺陷。

### 2. 触控热区与费茨法则 (Touch Target & Thumb Zone)
- iOS 最小可交互触控热区强制 $\ge 44 \times 44\text{pt}$，Android 强制 $\ge 48 \times 48\text{dp}$；
- 微小图标通过容器或 `::after` 伪元素向外扩张触控面；
- 核心操作沉底至单手拇指自然舒适区，避免长臂大拇指频繁拉伸。

### 3. 软键盘防遮挡与精准映射 (Keyboard & Inputmode)
- 输入框聚焦自动居中平滑滚动（`scrollIntoView({ block: 'center' })`）；
- 容器底部预留至少 300px 缓冲垫高，杜绝 fixed 吸底按钮挤压遮挡；
- 精准映射 `inputmode="tel"`、`numeric`、`email`、`search` 以及短信验证码自动填充 `one-time-code`。

### 4. 底部半屏抽屉与滚动穿透锁死 (Bottom Sheet & Scroll Lock)
- 遵循 30% / 60% / 80% 三分屏高度标准阶梯；
- 顶部标配 36×4pt 拖拽指示条 (Drag Handle)，支持平滑下滑关闭；
- 浮层展开时通过 `position: fixed` 彻底锁死底层 Body 滚动穿透；
- 录入表单类浮层严禁开启点击暗色遮罩静默关闭。

### 5. 跨平台范式与手势冲突保护 (iOS HIG vs Material 3)
- 解决 iOS 屏幕左边缘右滑返回手势与横向轮播图（Swiper）的手势死锁；
- iOS NavigationBar（居中/大标题折叠）与 Android TopAppBar（居左/溢出菜单）原生体验适配；
- 平台支付与内购（IAP 规则）硬约束避让。

### 6. 出海多语言百分比切割法与排版暗坑治理 (i18n & Typographic Safeguards)
- **大厂百分比切割法**：底部操作栏分两截，左侧辅助区预设五档固定宽度（72%/43%/28%/13%/0%），右侧按钮 `flex: 1` 弹性填满，杜绝写死固定像素宽度导致欧系多语言（短词膨胀定律）撑爆折行；
- **极端长词优雅降级**：长词优先压为纯动词，依然放不下时自动换全世界通用图标，绝不在角落硬塞字母；
- **多语言音标声调防削顶**：泰语、越南语、阿拉伯语文本行高保留 $\ge 1.5$，严禁滥用 `overflow: hidden` 削掉上下变音符号；
- **RTL 阿语镜像与 LTR 强制特例**：使用 CSS 逻辑属性，但视频进度条、电话号码、纯数字强制保持 LTR；
- **等宽数字 (`tabular-nums`)** 与 **标题防孤字 (`text-wrap: balance`)**。

---

## 仓库结构 (Repository Structure)

```text
mobile-design-system-skill/
├── SKILL.md                          # 移动端核心执行引擎与大模型调度规范
├── README.md                         # 规范概览、使用指南与架构说明
├── LICENSE                           # MIT 开源协议
├── components.manifest.json          # 移动端机器可读组件清单与 avoidWhen 契约
├── .cursorrules                      # Cursor 移动端一键开箱即用规则
├── .windsurfrules                    # Windsurf 移动端一键开箱即用规则
│
├── references/                       # 7 大模块化深度规范库 (随时检索)
│   ├── 01-mobile-foundations-and-viewport.md     # 视口、安全区、pt/dp/sp换算、44/48dp热区、Retina微边框
│   ├── 02-ios-vs-android-design-paradigms.md    # iOS HIG vs Material 3 导航、返回手势、FAB、内购对比
│   ├── 03-mobile-navigation-and-gestures.md     # 3-5槽位TabBar、顶部Tab、手势冲突解决、橡皮筋阻尼公式
│   ├── 04-touch-inputs-and-soft-keyboard.md     # 软键盘防遮挡、inputmode精准映射、单屏表单轻量化
│   ├── 05-mobile-overlays-and-bottom-sheet.md   # 底部抽屉三分屏、底层Body滚动锁死、防误触丢失
│   ├── 06-mobile-archetypes-and-feed-lists.md   # 信息流列表下拉刷新触底加载、虚拟滚动、图片三段式裁切
│   └── 07-mobile-pitfalls-and-audit-checklist.md # 10大实战踩坑地图与16项交付自查硬门禁
│
├── templates/                        # 工业级开箱即用代码实战模板
│   ├── mobile-feed-list-template.tsx            # 下拉刷新 + 触底加载 + 16:9 裁切 + 44pt 触控流
│   ├── mobile-bottom-sheet-template.tsx         # 三分屏高度 + 顶部拖拽把手 + 底层滚动彻底锁死
│   ├── mobile-compact-form-template.tsx         # 聚焦平滑居中防遮挡 + inputmode + 底部全宽主按钮
│   └── mobile-tabbar-app-shell.tsx              # 标准 4 槽位 TabBar + 安全区避让 + 消息徽标外壳
│
└── scripts/                          # 自动化合规检查工具
    └── audit-mobile-design.py        # Python 自动化移动端设计系统规则检查脚本
```

---

## 如何在你的 AI 工具中使用？

### 方式 1：Cursor 用户 (推荐)
直接将本目录下的 [`.cursorrules`](.cursorrules) 复制到你的移动端项目根目录下，或在 `.cursor/rules/` 目录下添加指向 `SKILL.md` 的引用。

### 方式 2：Claude Code / Antigravity (AGY) / Codex 用户
在你的工作区运行并直接向 AI 下达指令：
```text
请严格遵循 mobile-design-system 规范，为我生成一个移动端商品规格选择半屏抽屉与购买确认流。
```

### 方式 3：通用 Prompt
在任意 AI 工具（ChatGPT、Claude、DeepSeek 等）中直接粘贴以下引导词：

```markdown
请你扮演一名资深高级移动端 UI/UX 设计专家与 iOS/Android 前端工程架构师。
在接下来的移动端页面设计与代码生成中，你必须 100% 遵守以下移动端硬门禁：
1. 物理安全区：底部吸底按钮必须显式声明 env(safe-area-inset-bottom)，严禁被 Home Bar 遮挡；顶部避让状态栏与灵动岛；
2. 触控面积：所有可点击项触控热区必须 >= 44x44pt (iOS) / 48x48dp (Android)，相邻按键留白 >= 8pt；
3. 软键盘防遮挡：手机号必须配置 inputmode="tel"，验证码必须配置 inputmode="numeric"，输入框聚焦时平滑居中滚动；
4. 浮层系统：优先采用从底部升起的半屏抽屉 (Bottom Sheet) 遵循三分屏高度，展开时必须彻底锁死底层 Body 滚动穿透；
5. 视觉质感：使用 Retina 0.5px 精细微边框，图片遵循 1:1、4:3 或 16:9 三段式比例控制，严禁在移动端直接照搬桌面多列大表格。
```

---

## 贡献与交流 (Contributing)

欢迎提交 Issue 和 Pull Request！如果你在移动端生产实践中遇到了新的踩坑案例或优化技巧，非常欢迎为本项目贡献你的智慧！

## 开源协议 (License)

本项目采用 [MIT License](LICENSE) 开源协议。无论是个人学习、团队规范制定还是商业化项目落地，均可自由使用与二开。
