---
name: mobile-design-system
description: "移动端(iOS HIG与Android Material 3)工业级设计系统与组件规范执行Skill。将全面屏安全区避让、44/48dp触控热区、软键盘防遮挡、底部抽屉三分屏、滚动穿透阻断、信息流列表与踩坑红线转化为可执行的AI生成与审查约束。用于移动端页面设计、组件搭建与高保真原型还原。"
version: 1.0.0
tags: [mobile, ios, android, design-system, touch, safe-area, bottom-sheet]
---

# 移动端设计系统与跨平台组件规范 AI 执行引擎 (Ludi Mobile Design System Skill)

本 Skill 是面向 AI 编程助手（Agent、Claude Code、Cursor、Windsurf、Codex 等）的可执行移动端设计系统指令层。它彻底终结“AI 写移动端代码直接套用桌面表格、安全区 Home Bar 被遮挡、软键盘弹起遮挡输入框、浮层上下滑动导致底层乱晃”的行业通病，将资深设计师与移动工程架构师的物理约束转化为确定性的生成规则。

---

## 核心执行工作流 (Standard Workflow)

每当接收到任何移动端（iOS / Android / 小程序 / 响应式 H5）界面生成、修改或审查需求时，按以下六步顺序执行：

```
[步骤 1: 物理视口] ──► 确定逻辑画布 (375pt / 390pt / 402pt)，声明 viewport-fit=cover
        │
[步骤 2: 安全区避让] ──► 顶部状态栏避让 + 底部 Home Indicator 避让 (env(safe-area-inset-*))
        │
[步骤 3: 架构骨架] ──► 从五大移动端页面骨架精准选型 (Feed / 详情 / 紧凑表单 / 个人中心)
        │
[步骤 4: 触控与键盘] ──► 锁定 44/48dp 最小热区，精准配置 inputmode 映射与聚焦居中
        │
[步骤 5: 浮层与手势] ──► 采用底部半屏抽屉 (Bottom Sheet) 三分屏，锁死底层 body 滚动穿透
        │
[步骤 6: 闭环走查] ──► 运行 16 项移动端交付硬门禁与踩坑自查 (references/07)
```

---

## 必须遵守的三大底层硬红线 (Non-Negotiable Redlines)

1. **全面屏安全区物理避让**：
   - 底部固定定位按钮（`fixed bottom-0`）必须显式声明 `padding-bottom: max(16px, env(safe-area-inset-bottom))`，严禁按钮紧贴物理边缘被系统 Home Bar 遮挡。
   - 顶部导航栏必须避让状态栏与灵动岛（`env(safe-area-inset-top)`）。

2. **触控热区与按键面积底线**：
   - iOS 最小可交互触控热区必须 $\ge 44 \times 44\text{pt}$，Android 必须 $\ge 48 \times 48\text{dp}$。小图标必须通过容器或伪元素向外扩张触控面。
   - 相邻可点击项留白 $\ge 8\text{pt}$，严禁紧贴导致连带误触。

3. **软键盘防遮挡与浮层防穿透**：
   - 手机号必须配置 `inputmode="tel"`，纯数字配置 `inputmode="numeric"`，验证码配置 `autocomplete="one-time-code"`。
   - 输入框聚焦时必须执行平滑居中滚动（`scrollIntoView`），滚动容器底部保留充足垫高缓冲。
   - 弹出的半屏抽屉必须锁死底层 Body 滚动，且严禁点击背景遮罩静默关闭表单。

4. **出海多语言与百分比切割法**：
   - **大厂百分比切割法**：底部操作栏分两截，左侧辅助区预设 5 档固定比例（72%/43%/28%/13%/0%），右侧按钮 `flex: 1` 弹性填满，杜绝写死固定像素宽度被外文长词撑爆；极端超长词压为动词或换通用图标；
   - **多语言音标防削顶与 RTL 逻辑属性**：泰语/越南语/阿语文本行高 $\ge 1.5$ 且杜绝滥用 `overflow: hidden` 削掉音标声调；阿语界面用 CSS 逻辑属性，但播放进度条、电话号码与数字强制保持 LTR；
   - **等宽数字与防孤字成行**：金额与倒计时锁死 `tabular-nums` 防抖，卡片标题启用 `text-wrap: balance`。

5. **下沉市场现实主义与动效肉感 (Real-World Pragmatism & Spring Physics)**：
   - **强光高对比与千元机降级**：户外直射下核心文本对比度 $\ge 4.5:1$（禁用极浅灰字）；低端机禁用大面积毛玻璃高斯模糊与多重复杂 Spring，保证 60fps 硬件加速流畅；弱网离线采用乐观更新与失败 Toast 恢复出口；
   - **滑动的肉感**：触控 1:1 跟手零延迟，离手释放初速度动量自然衰减，边界回弹具备有质量的弹簧阻尼肉感；
   - **同心圆角与页面默认平**：嵌套圆角满足 $R_{outer} = R_{inner} + Padding$；卡片一律纯平，大阴影只留给底抽屉 (BottomSheet)；字号严格限定 4 档，全清 eyebrow 悬顶小标签。

---

## 深度参考规范库导航 (References Index)

遇到具体移动端设计决策时，精准查阅 `references/` 目录下的专门手册：

- **视口与物理法则**：[01-mobile-foundations-and-viewport.md](./references/01-mobile-foundations-and-viewport.md)
  - 画布定义、pt/dp/sp 换算、安全区配方、44/48dp 触控热区、Retina 0.5px 微边框、下沉市场环境现实主义、同心圆角与去 AI 味纯平规范。
- **跨平台范式对比**：[02-ios-vs-android-design-paradigms.md](./references/02-ios-vs-android-design-paradigms.md)
  - iOS NavigationBar vs Android TopAppBar、大标题模式折叠、FAB 边界、预测性返回手势、内购与支付合规。
- **导航与手势系统**：[03-mobile-navigation-and-gestures.md](./references/03-mobile-navigation-and-gestures.md)
  - 3-5 槽位 TabBar、分段控制器 vs 横滑 Tab、触控 1:1 跟手零延迟、离手动量衰减、橡皮筋阻尼曲线公式。
- **触控输入与软键盘**：[04-touch-inputs-and-soft-keyboard.md](./references/04-touch-inputs-and-soft-keyboard.md)
  - 软键盘顶起防遮挡、6 大输入类型精准映射、三种键盘收起行为、单屏表单轻量化。
- **浮层系统与底部抽屉**：[05-mobile-overlays-and-bottom-sheet.md](./references/05-mobile-overlays-and-bottom-sheet.md)
  - 底部动作表单 (ActionSheet)、三分屏抽屉 (30%/60%/80%)、Body 滚动穿透彻底锁死、点击穿透防范。
- **核心页面原型与信息流**：[06-mobile-archetypes-and-feed-lists.md](./references/06-mobile-archetypes-and-feed-lists.md)
  - 信息流列表下拉刷新与触底加载、虚拟滚动性能、图片 1:1/4:3/16:9 三段式裁切法则、底部全宽 CTA。
- **踩坑避坑地图与自查清单**：[07-mobile-pitfalls-and-audit-checklist.md](./references/07-mobile-pitfalls-and-audit-checklist.md)
  - 10 大生产实战踩坑地图、24 项移动端交付硬门禁走查表。

---

## 开箱即用实战模板 (Templates)

生成真实代码时，可直接参考或复用 `templates/` 目录中的标准工程代码：
- `templates/mobile-feed-list-template.tsx`：安全区避让 + 搜索吸顶 + 16:9 图片裁切 + 下拉刷新与触底加载流。
- `templates/mobile-bottom-sheet-template.tsx`：顶部拖拽条 + 三分屏高度 + 底层滚动彻底锁死 + 确定取消动作。
- `templates/mobile-compact-form-template.tsx`：聚焦居中防遮挡 + inputmode 精准映射 + 底部全宽主按钮。
- `templates/mobile-tabbar-app-shell.tsx`：标准 4 槽位 TabBar + 消息未读数与红点 + 毛玻璃材质外壳。

---

## 自动化校验脚本 (Lint Script)

代码生成完成后，可随时执行 Python 走查脚本自检：
```bash
python scripts/audit-mobile-design.py path/to/your/code
```
