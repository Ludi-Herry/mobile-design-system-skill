# 05 移动端浮层系统与底部操作面板 (Mobile Overlays & Bottom Sheet)

移动端屏幕面积极其狭小，弹窗与浮层必须极度克制。居中弹窗是打断心流最强烈的武器，**在移动端应优先使用从底部升起的半屏抽屉 (Bottom Sheet / ActionSheet)**。

---

## 一、移动端浮层组件选型矩阵

| 组件名称 | 唤起位置 | 核心适用场景 | 关键约束与设计禁令 |
| --- | --- | --- | --- |
| **底部动作列表 (ActionSheet)** | 屏幕底部升起 | 单维度操作分流（如“拍照 / 从相册选择 / 取消”、“分享至微信 / 朋友圈”） | 选项单列垂直居中排布；**“取消”按钮必须物理独立分组**，用 8pt 灰色间距与上方动作区完全切断。 |
| **半屏抽屉 (Modal Bottom Sheet)** | 屏幕底部升起 (30%/60%/80%) | 商品多规格 SKU 选择、多维度高级筛选、复杂地址选择、快捷评论面板 | **顶部必须包含拖拽指示条 (Drag Handle, 36×4pt)**；支持手指下滑手势平滑关闭；底部必须留足 34pt 安全区。 |
| **模态确认框 (Alert / Dialog)** | 屏幕中央垂直偏上 (38.2% 处) | 涉及账号注销、彻底删除、权限关闭等破坏性二次确认 | **严禁承载超过 2 个以上的输入框**；严禁用于常规图文长详情展示；必须提供明确取消出口。 |
| **轻量轻提示 (Toast / Snackbar)** | 屏幕下方或中央 | “复制成功”、“已加入书签”等弱状态反馈 | **严禁包含可点击的操作按钮**；展示时长严格控制在 **1.5秒–2.5秒** 之间自动平滑淡出，不阻断底层任何操作。 |

---

## 二、底部半屏抽屉的三分屏高度法则 (The Three-Tier Sizing Rule)

为了保证全应用浮层视觉节奏的一致性，Bottom Sheet 的展开高度严禁随意指定固定像素，统一按照屏幕高度的百分比划分三大标准档位：

```text
┌──────────────────────────────────────────────────┐
│                                                  │
│   [80% 高度档位]                                  │
│   - 用于：多步骤填写、SKU选择、复杂树形分类选择   │
│   - 顶部保留 20% 原生背景露底，支持点击快速关闭  │
├──────────────────────────────────────────────────┤
│                                                  │
│   [60% 高度档位 (最通用)]                         │
│   - 用于：中等复杂度筛选、商品图文摘要参数、评论区│
├──────────────────────────────────────────────────┤
│                                                  │
│   [30% 高度档位]                                  │
│   - 用于：单选选择器、支付方式二选一、短提示面板  │
└──────────────────────────────────────────────────┘
```

---

## 三、滚动穿透与手势死锁的终极治理 (Scroll Chaining & Lock)

> **致命高频 Bug**：在弹出的半屏抽屉中上下滑动时，抽屉还没滚到底，底层的整个主页面就已经开始疯狂乱滚乱晃（滚动穿透）。

### 1. 底层页面滚动锁死配方 (Body Scroll Lock)

```typescript
// 当浮层 (Modal/Drawer) 展开时锁死 body
export const lockBodyScroll = () => {
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.overflow = "hidden";
};

// 当浮层关闭时恢复滚动位置
export const unlockBodyScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.overflow = "";
  window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
};
```

### 2. 内部滚动与下拉收起的手势死锁解决
- 当抽屉内部有长列表（如评论列表）且**当前滚动条位于最顶部（scrollTop === 0）**时，用户继续向下拉动手指，此时判定为**“关闭抽屉意图”**，跟随手指位移将抽屉整体向下滑出视口。
- 当**滚动条不在顶部（scrollTop > 0）**时，向下拉动优先响应**内部列表向上回滚**，绝不能误触发浮层关闭。

---

## 四、点击穿透防范 (Click Penetration)

移动端早期因模拟双击缩放存在 300ms 点击延迟，直接使用 `touchend` 隐藏遮罩会导致手指点击事件穿透到遮罩底部的真实链接或按钮上。

- **硬规则**：统一采用现代标准的 `pointerdown` / `pointerup` 或框架成熟的点击事件处理。
- **浮层退出过渡动画保护**：浮层在执行关闭淡出动画的 200ms–300ms 期间，遮罩层必须通过 `pointer-events: none` 阻断一切穿透事件。
