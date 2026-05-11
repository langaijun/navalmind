# Navalmind.cc — 技术规格

## 依赖 (Dependencies)

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.1.0 | UI 框架 |
| `react-dom` | ^19.1.0 | DOM 渲染 |
| `react-router-dom` | ^7.6.0 | Landing ↔ Chat 视图路由切换 |
| `framer-motion` | ^12.10.0 | 页面过渡、滚动揭示、打字机、交互动画 |
| `lucide-react` | ^0.511.0 | 图标系统 |
| `@fontsource/noto-sans-sc` | ^5.0.0 | 中文无衬线字体 |
| `@fontsource/inter` | ^5.0.0 | 英文/数字字体 |

**开发依赖**: `vite`, `typescript`, `tailwindcss`, `@types/react`, `@types/react-dom`

---

## 组件清单

### 布局 (Layout)

| 组件 | 来源 | 复用 | 说明 |
|------|------|------|------|
| `AppLayout` | 自建 | 是 | 根布局，包裹 `AnimatePresence` 和 `Routes`，处理全屏路由过渡 |

### 页面 (Pages)

| 组件 | 来源 | 说明 |
|------|------|------|
| `LandingPage` | 自建 | 单页长滚动：Hero + Philosophy + Preview + Footer |
| `ChatPage` | 自建 | 全屏聊天视图：Header + Chat Area (iframe) + Input Bar |

### 区块 (Sections)

| 组件 | 来源 | 页面 | 说明 |
|------|------|------|------|
| `HeroSection` | 自建 | Landing | 全屏首屏：Canvas 背景 + 标题 + CTA |
| `PhilosophySection` | 自建 | Landing | 4 卡片网格，滚动揭示动画 |
| `PreviewSection` | 自建 | Landing | 演示对话 Mockup，打字机动画 |
| `FooterSection` | 自建 | Landing | CTA + 导航链接 + 版权 |

### 可复用组件 (Shared Components)

| 组件 | 来源 | 复用 | 说明 |
|------|------|------|------|
| `NeuralConstellation` | 自建 | 1 次 | Canvas 2D 粒子连线背景动画 |
| `TypewriterText` | 自建 | 4 次 | 逐字显示动画文本 |
| `ScrollReveal` | 自建 | 5+ 次 | IntersectionObserver 驱动的入场动画包装器 |
| `SectionHeader` | 自建 | 3 次 | Eyebrow + Title + Subtitle 组合 |
| `CTAButton` | 自建 | 3 次 | 统一样式的主行动按钮，带路由跳转 |
| `ChatInterface` | 自建 | 1 次 | 聊天视图主组件，组合 Header/iframe/Input |
| `ChatHeader` | 自建 | 1 次 | Chat 顶部导航栏（返回、标题、语音切换） |
| `ChatInputBar` | 自建 | 1 次 | 底部输入区域（语音按钮 + 文本输入 + 发送） |
| `SuggestionChips` | 自建 | 1 次 | 空对话时的建议词条 |
| `TypingIndicator` | 自建 | 2 次 | 三个弹跳圆点的 AI 思考中动画 |

### Hooks

| Hook | 说明 |
|------|------|
| `useTypewriter` | 打字机效果：逐字显示，支持速度/延迟/完成回调 |
| `useVoiceInput` | Web Speech API 封装：录音状态管理、实时转写、错误处理 |
| `useScrollReveal` | IntersectionObserver 封装：返回 ref 和动画状态 |
| `useNeuralConstellation` | Canvas 动画引擎：粒子初始化、更新循环、鼠标交互 |

---

## 动画实现方案

| 动画 | 库 | 实现方式 | 复杂度 |
|------|-----|----------|--------|
| Neural Constellation 粒子背景 | 原生 Canvas 2D | `useNeuralConstellation` hook：requestAnimationFrame 驱动 80 粒子漂移 + 距离检测连线 + 鼠标排斥场 | **High** 🔒 |
| 页面路由过渡 (Landing ↔ Chat) | framer-motion | `AnimatePresence` + `motion.div`：Landing 淡出 + Chat 从底部滑入，自定义 cubic-bezier | **Medium** |
| Hero 内容依次入场 | framer-motion | `motion.div` staggerChildren：Eyebrow → Headline → Subheadline → CTA 依次 translateY + opacity | **Low** |
| 滚动揭示 (Philosophy 卡片) | framer-motion | `ScrollReveal` 组件：IntersectionObserver 触发 translateY(60px→0) + opacity(0→1)，stagger 0.1s | **Low** |
| 打字机效果 (Preview 对话) | framer-motion + `useTypewriter` | 逐字追加到显示文本 + blinking caret 光标，4 条消息顺序触发 | **Medium** |
| 打字机效果 (Chat AI 回复) | framer-motion + `useTypewriter` | 同上，集成在 Chat 消息流中 | **Medium** |
| Scroll Indicator 线条延伸 | CSS animation | `@keyframes` 实现线条 height 从 0→40px 的循环动画 | **Low** |
| 在线状态脉冲 | CSS animation | `@keyframes` 实现绿色圆点 opacity 脉冲 | **Low** |
| Typing Indicator 弹跳圆点 | CSS animation | `@keyframes` 实现三个圆点依次 translateY 弹跳 | **Low** |
| 语音按钮脉冲 | CSS animation | `@keyframes` 实现录音状态下红色阴影扩散动画 | **Low** |
| 卡片 Hover 效果 | CSS transition | border-color + background 的 0.4s transition | **Low** |
| 按钮 Hover 效果 | CSS transition | background-color 的 0.3s transition | **Low** |

---

## 状态与逻辑架构

### 路由结构

```
/           → LandingPage（长滚动单页）
/chat       → ChatPage（全屏聊天）
```

使用 `react-router-dom` 的 `BrowserRouter`，两个路由之间通过 `AnimatePresence` 实现页面级过渡动画。

### Chat 页面状态

| 状态 | 类型 | 管理 | 说明 |
|------|------|------|------|
| `messages` | `Message[]` | React `useState` | 消息历史数组（用户 + AI） |
| `inputText` | `string` | React `useState` | 输入框当前文本 |
| `isRecording` | `boolean` | `useVoiceInput` | 语音识别中状态 |
| `isTyping` | `boolean` | React `useState` | AI 是否正在生成回复 |
| `isEmpty` | `boolean` | 派生状态 | messages.length === 0，控制欢迎界面显示 |

### 数据流

```
用户输入 (文本/语音)
    → inputText 更新
    → 点击发送 / 按 Enter
    → message 追加到 messages 数组
    → 调用 Dify API (通过 iframe postMessage 或直接 fetch)
    → isTyping = true
    → 收到流式响应
    → AI message 逐字追加 (useTypewriter)
    → isTyping = false
```

### Dify 集成策略

**方案 A（首选）**: iframe 嵌入 Dify 聊天小部件，通过 CSS 注入覆盖默认白色主题。Dify 已提供主题配置参数，设置 `theme: 'dark'` 并自定义颜色变量。

**方案 B（备选）**: 若 iframe 样式覆盖受限，使用 Dify 的 HTTP API 直接调用聊天接口，前端完全自研 UI。API endpoint 为 Dify 实例的 `/v1/chat-messages`。

---

## 其他关键决策

### 字体加载策略

使用 `@fontsource/noto-sans-sc` 加载 Noto Sans SC 字体的 **400/500/700** 字重子集（覆盖常用汉字），避免全量加载。英文使用 `@fontsource/inter` 的 **300/400/500** 字重。通过 CSS `@import` 在入口文件一次性加载。

### Canvas 性能优化

- 粒子数根据设备类型自适应：Desktop 80 / Mobile 40（通过 `window.innerWidth < 768` 判断）
- Canvas 使用 `alpha: false` 的 2D context，配合 CSS 背景色减少重绘
- `requestAnimationFrame` 在组件卸载时 cancel
- Resize 事件使用 debounce（200ms）

### Voice Input 降级

`useVoiceInput` hook 在初始化时检测 `SpeechRecognition` / `webkitSpeechRecognition` API 可用性。若浏览器不支持，语音按钮自动隐藏。错误状态通过 toast 提示用户。

### 深色主题一致性

全站采用系统级深色主题，不使用 CSS 变量切换（无亮色模式需求）。Tailwind 的 `darkMode: 'class'` 配置配合顶层 `<div class="dark">` 实现。所有颜色值硬编码在 Tailwind config 中，确保 Dify iframe 覆盖和原生组件一致。
