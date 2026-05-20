# 宇宙飞船星际穿越动画 - SPEC

## Concept & Vision

一个沉浸式的星际穿越动画体验：一艘发光飞船在星海中疾驰，星空在周围快速流动，产生超空间跳跃的视觉冲击感。风格参考 anime.js 官网——暗色调 + 霓虹光晕 + 流体运动，干净优雅但有力量感。

## Design Language

- **Aesthetic**: 深空暗色系 + 霓虹蓝紫光晕，参考 anime.js 官网暗色主题
- **Colors**:
  - 背景: `#030014` (近黑深紫)
  - 星星白: `#ffffff`, `#a5c8ff`
  - 飞船主体: `#0a0a1a` (深蓝黑)
  - 引擎光晕: `#00d4ff` (青蓝霓虹)
  - 辅助光: `#7c3aed` (紫色)
  - 热光: `#f59e0b` (琥珀色)
- **Typography**: Space Grotesk (Google Fonts) — 科技感
- **Motion**: 大量 RAF + anime.js，流动感强，easing 偏 elastic/expo
- **Visual Assets**: 纯 SVG + CSS，无外部图片依赖

## Layout & Structure

- 全屏 canvas：星空 + 飞船
- 底部标题区 + 状态文字
- 顶层：控制面板（暂停/播放，speed 调节）

## Features & Interactions

### 核心动画序列
1. **星空背景** — 多层星星以不同速度向后流动（近/中/远景）
2. **飞船入场** — 从下方渐入，发光引擎逐步点亮
3. **超空间跳跃** — 星星变成光线拉伸（streak lines），飞船轻微震动 + 引擎全开
4. **星云漂移** — 背景有半透明彩色星云缓慢漂移
5. **引擎尾焰** — 动态拖尾 + 粒子感

### 交互
- 空格键：暂停/继续
- 点击飞船：触发 burst 效果（短暂加速）
- Speed 滑杆：0.5x - 3x

### States
- Loading: 引擎点火动画（从小光点展开）
- Idle: 轻微悬浮动画 (hover)
- Warp: 全速飞行（星星变 streak）
- Arriving: 减速，引擎光收缩

## Component Inventory

### Starship (SVG)
- 主体：流线型梭形，深蓝黑
- 座舱：透明蓝玻璃质感
- 引擎：3 个圆形推进器，带发光
- 光晕层：多层 blur filter，外层大范围 glow

### Stars
- 3 层：远景(小/慢/暗)、中景(中速)、近景(大/快/亮白)
- 近景星星在 warp 模式变 streak

### Nebula
- 2-3 个半透明渐变圆，缓慢漂移
- 颜色：紫/蓝/粉

### UI
- 标题：`INTERSTELLAR TRANSIT` + 副标题
- 状态文字：`WARP DRIVE ENGAGED` / `COASTING`
- 控制栏：播放/暂停按钮 + 速度滑块

## Technical Approach

- 单文件 `index.html`（CSS + JS 内联）
- anime.js via CDN (esm.sh)
- SVG 内联（便于 anime.js 操作 transform）
- 全屏相对定位，所有元素绝对定位堆叠
- anime.js Timeline 编排主序列
- 星星用 JS 动态生成 DOM + anime.js 管理
- Vite 打包（可选），或纯静态