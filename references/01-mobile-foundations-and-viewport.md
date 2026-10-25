# 01 移动端设计基石：视口、安全区与触控物理法则 (Mobile Foundations & Viewport)

移动端与桌面 Web 的根本物理差异在于**触控介质（手指而非鼠标指针）**、**有限视口**以及**硬件异形屏幕（刘海、打孔、灵动岛、底部操作指示条）**。任何脱离物理特性的代码生成都会直接导致严重的交互灾难。

---

## 一、画布定义与多密度分辨率换算 (Canvas & Density)

移动端设计必须严格基于**逻辑点（pt / dp）**进行，严禁直接使用物理像素（px）进行固定尺寸开发。

### 1. 标准画布基线表

| 平台 / 机型代表 | 逻辑画布尺寸 (pt / dp) | 渲染倍率 | 物理像素 (px) | 适用场景 |
| --- | --- | --- | --- | --- |
| **通用小程序 / 经典基准** | 375 × 667 / 812 | @2x | 750 × 1334 / 1624 | 微信小程序官方基线、经典开发兼容、轻量 H5 |
| **主流 iOS (iPhone 13-16)** | 390 × 844 / 393 × 852 | @3x | 1170 × 2532 / 1179 × 2556 | 当前现存主流 iPhone 普及机型 |
| **最新 iOS (iPhone 16/17 Pro)** | 402 × 874 / 440 × 956 | @3x | 1206 × 2622 / 1320 × 2868 | 现代新项目、设计系统旗舰级组件库基线 |
| **标准 Android (Material 3)** | 360 × 800 / 412 × 915 | xxhdpi (3x) | 1080 × 2400 / 1236 × 2745 | Android 主流机型开发与界面设计基线 |

### 2. 单位使用铁律
- **布局间距与容器尺寸**：iOS 使用 `pt`，Android 使用 `dp`，移动端 Web / H5 优先使用基于 `rem`、`viewport (vw/vh)` 或 `Tailwind` 标准步进。
- **字体尺寸**：Android 必须使用 `sp`（可随系统字体大小缩放设置自适应），iOS 使用 `pt` 并支持 Dynamic Type 动态字阶。
- **1px 物理边框**：在 @2x、@3x 高清屏上，`1px` 会渲染为 2 到 3 个物理像素的粗线。必须采用移动端专属的 0.5px 微边框配方。

---

## 二、安全区避让规范 (Safe Area Insets)

异形屏幕（刘海屏、灵动岛、打孔屏、底部 Home Bar）决定了内容不能撑满物理屏幕边缘。

### 1. 硬件尺寸基线
- **顶部状态栏 (Status Bar)**：
  - iOS 经典直面屏：20pt
  - iOS 刘海屏 / 挖孔屏：44pt – 50pt
  - iOS 最新灵动岛旗舰系统：54pt – 62pt
  - Android 标准机型：24dp – 36dp
- **顶部导航栏 (NavigationBar / TopAppBar)**：
  - iOS 标准导航栏高：44pt
  - Android Material 3 顶部栏高：56dp 或 64dp
- **底部安全操作指示条 (Home Indicator)**：
  - iOS 刘海及全面屏固定高度：34pt（横屏时为 21pt）
  - Android 手势横条区域：16dp – 24dp（传统三键导航栏为 48dp – 56dp）
- **底部标签栏 (TabBar / BottomNavigation)**：
  - iOS 官方高度：83pt（由 49pt 按钮操作区 + 34pt 底部安全区组成）
  - Android 官方高度：80dp（含触控热区与文字指示）

### 2. 现代工程标准避让配方 (CSS Safe Area)

```css
/* 根视口声明必须包含 viewport-fit=cover */
/* <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"> */

/* 顶部安全区内边距（避免内容被状态栏/灵动岛遮挡） */
.safe-top {
  padding-top: max(20px, env(safe-area-inset-top));
}

/* 底部安全区内边距（避免操作被 Home Bar 遮挡并防止手滑退到桌面） */
.safe-bottom {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* 底部常驻悬浮按钮 (Fixed CTA Button) 避让 */
.fixed-bottom-cta {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(226, 232, 240, 0.7);
}
```

---

## 三、触控热区与费茨法则 (Touch Target & Fitts's Law)

手指的生理接触面是一个面积约为 8mm–10mm 的不规则椭圆。**视觉元素小不等于触控热区小**。

### 1. 平台最小触控热区要求
- **Apple iOS HIG 规范**：最小可交互点击区域必须 $\ge 44 \times 44\text{ pt}$。
- **Google Android Material 规范**：最小可交互点击区域必须 $\ge 48 \times 48\text{ dp}$。
- **两触控项安全间距**：相邻的可点击对象边缘之间必须保持至少 **8pt / 8dp** 的留白，防止误触。

### 2. 小图标热区外扩配方
当视觉设计需要一个 16px 或 20px 的微小图标（如返回箭头、关闭叉号、清除搜索框图标）时，严禁将容器尺寸锁死在 16px。采用以下两种手段扩大触控面：

```css
/* 方案 A：容器保留 44px 热区，内部居中对齐小图标 */
.touch-target {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 方案 B：伪元素向外扩张热区（保持原有布局紧凑） */
.expand-touch-area {
  position: relative;
}
.expand-touch-area::after {
  content: "";
  position: absolute;
  top: -10px;
  bottom: -10px;
  left: -10px;
  right: -10px;
}
```

---

## 四、移动端 0.5px 精细微边框体系 (Retina Hairline)

移动设备 @2x 和 @3x 屏幕如果直接写 `border: 1px solid #ccc`，边框在手机上看会极其粗笨。

### 标准工程实现

```css
/* 移动端 0.5px 分割线 */
.mobile-hairline-bottom {
  position: relative;
}
.mobile-hairline-bottom::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(226, 232, 240, 0.8);
  transform: scaleY(0.5);
  transform-origin: 0 100%;
}
```

---

## 五、单手操作与拇指舒适区法则 (Thumb Zone Rule)

用户在单手握持手机（尤其是 6.1 英寸以上的大屏手机）时，拇指可触及区域呈现明显的三层同心圆弧分布：

```text
┌─────────────────────────┐
│     困难触及区 (Hard)    │  <- 放置：辅助性状态、不可点击标题、纯展示数据
│   (需要调整握姿或双手)    │
├─────────────────────────┤
│     伸展触及区 (Stretch) │  <- 放置：次要操作、搜索框、分类 Tab
├─────────────────────────┤
│                         │
│     舒适自然区 (Natural) │  <- 放置：核心 CTA 提交按钮、底部 TabBar、
│    (单手拇指无压力覆盖)   │     列表核心高频点击项、主要输入卡片
└─────────────────────────┘
```

### 设计落地要求
1. **核心操作沉底**：表单保存、立即购买、确认授权等关键转化按钮一律放置在屏幕下方**自然舒适区**（距离底部 Safe Area 12px 处），严禁将单一主按钮孤立放在屏幕右上角。
2. **长列表下滑触发沉浸**：当用户在信息流中向上滚动阅读时，顶部导航栏可平滑上收折叠，为内容让出宝贵的一屏阅读垂直视野。
