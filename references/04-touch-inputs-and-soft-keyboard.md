# 04 触控输入与软键盘交互治理 (Touch Inputs & Soft Keyboard)

移动端输入体验是整个 App 流失率最高的环节。软键盘弹出时将占据屏幕 40% 到 55% 的绝对空间，处理不当会造成**输入框被键盘遮挡、页面布局被粗暴顶碎、吸底按钮遮挡视线、键盘无法收起**等一系列严重问题。

---

## 一、软键盘遮挡与视口自适应治理 (Keyboard Overlap)

### 1. 核心高频 Bug 场景
- **输入框盲打**：点击靠下方的输入框，软键盘弹起直接盖住输入框，用户完全看不见自己打的字。
- **Fixed 吸底按钮撞车**：使用 `position: fixed; bottom: 0` 的主按钮在 iOS/Android 键盘弹起时，被系统粗暴顶到键盘正上方，直接盖住正在编辑的内容区域。

### 2. 标准工程解决方案

```typescript
// 方案 A：输入框聚焦自动居中滚动 (Scroll Into Center View)
const handleInputFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const target = event.currentTarget;
  // 延迟 300ms 等待键盘弹起动效完成
  setTimeout(() => {
    target.scrollIntoView({
      behavior: "smooth",
      block: "center", // 将输入项滚动到可见视口的正中央，而非顶部或底部
    });
  }, 300);
};
```

```css
/* 方案 B：表单容器底部增加弹性内边距垫高 */
.form-scroll-container {
  padding-bottom: 350px; /* 预留给软键盘与吸底按钮的富余滚动空间 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

---

## 二、字段类型与键盘外观的精准映射 (Inputmode & Keyboard Types)

> **铁律**：严禁在所有输入项上无脑使用通用的 `<input type="text">`！根据字段业务类型唤起最契合的原生键盘，能消灭 80% 的多余切换操作。

| 业务输入场景 | HTML5 标准属性配置 | 键盘唤起效果 | 关键增益与体验细节 |
| --- | --- | --- | --- |
| **手机号码** | `type="tel"`<br>`inputmode="tel"` | 纯数字九宫格大按键（带 `+ * #` 符号） | 按钮面积最大，单手按键极速输入，支持粘贴剪贴板号码 |
| **短信验证码** | `type="text"`<br>`inputmode="numeric"`<br>`autoComplete="one-time-code"` | 纯数字键盘 | **支持 iOS/Android 系统短信验证码一键填充** |
| **金额与纯数值** | `type="text"`<br>`inputmode="decimal"` | 带小数点的紧凑数字小键盘 | 杜绝用户误触打入字母或特殊字符 |
| **电子邮箱** | `type="email"`<br>`inputmode="email"` | 包含 `@` 和 `.` 独立按键的全键盘 | 消除用户在第二层标点符号面板找 `@` 的繁琐路径 |
| **搜索框** | `type="search"` | 键盘右下角主按键变为蓝底 **“搜索 (Search)”** | 监听键盘 Enter 事件直接触发搜索，免点页面搜索按钮 |
| **安全密码** | `type="password"` | 密码安全键盘，遮蔽内容，防录屏 | 必须在右侧配备“眼睛”图标，允许用户切换显隐核对 |

---

## 三、键盘收起交互行为的三种标准模式 (Keyboard Dismissal)

键盘不能只管弹出不管收回。必须在页面中提供自然的键盘关闭出口：

1. **轻触空白处立即收起 (Tap to Dismiss)**：
   - 用户点击表单外的任意空白区域或遮罩层，立即调用 `document.activeElement.blur()` 收起软键盘。
2. **列表滑动即收起 (On Drag Dismiss)**：
   - 在聊天界面、商品评论区、搜索结果长列表中，一旦用户手指开始向上或向下拖动滚动列表，键盘必须自动平滑退下（对齐 iOS 原生 `UIScrollView.KeyboardDismissMode.onDrag`）。
3. **完成动作自动收起**：
   - 验证码输满 4 位/6 位、点击了键盘右下角“搜索”或“完成”，系统在触发请求的同时必须自动收起键盘，露出完整的操作反馈结果。

---

## 四、移动端表单轻量化与单屏法则

在移动设备上填写长表单极易让人产生心理窒息感。

### 核心约束
- **单屏字段 $\le 5$ 项**：单页面表单核心字段尽量控制在 5 项以内，超出部分采用**分步向导 (Stepper)** 或**分组卡片**折叠承载。
- **占位符严禁废话**：占位提示仅用于展示示例格式（如 `例如: 13800000000`），不要在 placeholder 里写大段说明规则。
- **校验即时化**：在输入框失去焦点（`onBlur`）时立即触发局部校验，红字提示直接紧贴在输入框下方，严禁用模态弹窗打断输入心流。
