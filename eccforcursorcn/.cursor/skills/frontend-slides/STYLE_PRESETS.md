# 风格预设参考

为 `frontend-slides` 精选的视觉风格。

本文件用于：
- 强制性的视口适配 CSS 基础样式
- 预设选择和情绪映射
- CSS 注意事项和验证规则

仅使用抽象形状。除非用户明确要求，否则避免使用插图。

## 视口适配不可妥协

每张幻灯片必须完整适配一个视口。

### 黄金法则

```text
Each slide = exactly one viewport height.
Too much content = split into more slides.
Never scroll inside a slide.
```

### 密度限制

| 幻灯片类型 | 最大内容量 |
|------------|-----------|
| 标题页 | 1 个标题 + 1 个副标题 + 可选标语 |
| 内容页 | 1 个标题 + 4-6 个要点或 2 个段落 |
| 功能网格 | 最多 6 张卡片 |
| 代码展示页 | 最多 8-10 行 |
| 引用页 | 1 条引言 + 出处 |
| 图片页 | 1 张图片，理想情况下不超过 60vh |

## 必需的基础 CSS

将此代码块复制到每个生成的演示文稿中，然后在其上方添加主题样式。

```css
/* ===========================================
   VIEWPORT FITTING: MANDATORY BASE STYLES
   =========================================== */

html, body {
    height: 100%;
    overflow-x: hidden;
}

html {
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
}

.slide {
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    position: relative;
}

.slide-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-height: 100%;
    overflow: hidden;
    padding: var(--slide-padding);
}

:root {
    --title-size: clamp(1.5rem, 5vw, 4rem);
    --h2-size: clamp(1.25rem, 3.5vw, 2.5rem);
    --h3-size: clamp(1rem, 2.5vw, 1.75rem);
    --body-size: clamp(0.75rem, 1.5vw, 1.125rem);
    --small-size: clamp(0.65rem, 1vw, 0.875rem);

    --slide-padding: clamp(1rem, 4vw, 4rem);
    --content-gap: clamp(0.5rem, 2vw, 2rem);
    --element-gap: clamp(0.25rem, 1vw, 1rem);
}

.card, .container, .content-box {
    max-width: min(90vw, 1000px);
    max-height: min(80vh, 700px);
}

.feature-list, .bullet-list {
    gap: clamp(0.4rem, 1vh, 1rem);
}

.feature-list li, .bullet-list li {
    font-size: var(--body-size);
    line-height: 1.4;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
    gap: clamp(0.5rem, 1.5vw, 1rem);
}

img, .image-container {
    max-width: 100%;
    max-height: min(50vh, 400px);
    object-fit: contain;
}

@media (max-height: 700px) {
    :root {
        --slide-padding: clamp(0.75rem, 3vw, 2rem);
        --content-gap: clamp(0.4rem, 1.5vw, 1rem);
        --title-size: clamp(1.25rem, 4.5vw, 2.5rem);
        --h2-size: clamp(1rem, 3vw, 1.75rem);
    }
}

@media (max-height: 600px) {
    :root {
        --slide-padding: clamp(0.5rem, 2.5vw, 1.5rem);
        --content-gap: clamp(0.3rem, 1vw, 0.75rem);
        --title-size: clamp(1.1rem, 4vw, 2rem);
        --body-size: clamp(0.7rem, 1.2vw, 0.95rem);
    }

    .nav-dots, .keyboard-hint, .decorative {
        display: none;
    }
}

@media (max-height: 500px) {
    :root {
        --slide-padding: clamp(0.4rem, 2vw, 1rem);
        --title-size: clamp(1rem, 3.5vw, 1.5rem);
        --h2-size: clamp(0.9rem, 2.5vw, 1.25rem);
        --body-size: clamp(0.65rem, 1vw, 0.85rem);
    }
}

@media (max-width: 600px) {
    :root {
        --title-size: clamp(1.25rem, 7vw, 2.5rem);
    }

    .grid {
        grid-template-columns: 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.2s !important;
    }

    html {
        scroll-behavior: auto;
    }
}
```

## 视口检查清单

- 每个 `.slide` 都有 `height: 100vh`、`height: 100dvh` 和 `overflow: hidden`
- 所有排版使用 `clamp()`
- 所有间距使用 `clamp()` 或视口单位
- 图片有 `max-height` 约束
- 网格使用 `auto-fit` + `minmax()` 自适应
- 存在 `700px`、`600px` 和 `500px` 的小高度断点
- 如果内容感觉拥挤，拆分幻灯片

## 情绪到预设的映射

| 情绪 | 推荐预设 |
|------|---------|
| 令人印象深刻 / 自信 | Bold Signal、Electric Studio、Dark Botanical |
| 兴奋 / 充满活力 | Creative Voltage、Neon Cyber、Split Pastel |
| 平静 / 专注 | Notebook Tabs、Paper & Ink、Swiss Modern |
| 受启发 / 感动 | Dark Botanical、Vintage Editorial、Pastel Geometry |

## 预设目录

### 1. Bold Signal

- 氛围：自信、高影响力、适合主题演讲
- 适用场景：路演幻灯片、产品发布、声明
- 字体：Archivo Black + Space Grotesk
- 配色：炭灰底色、亮橙焦点卡片、纯白文字
- 标志性元素：超大章节编号、深色背景上的高对比卡片

### 2. Electric Studio

- 氛围：干净、大胆、专业机构质感
- 适用场景：客户演示、战略评审
- 字体：仅 Manrope
- 配色：黑色、白色、饱和钴蓝强调色
- 标志性元素：双面板分屏和锐利的编辑式对齐

### 3. Creative Voltage

- 氛围：活力四射、复古现代、自信的趣味性
- 适用场景：创意工作室、品牌工作、产品叙事
- 字体：Syne + Space Mono
- 配色：电光蓝、霓虹黄、深海军蓝
- 标志性元素：半调纹理、徽章、强烈对比

### 4. Dark Botanical

- 氛围：优雅、高端、氛围感强
- 适用场景：奢侈品牌、深度叙事、高端产品演示
- 字体：Cormorant + IBM Plex Sans
- 配色：近黑色、暖象牙白、腮红色、金色、赤陶色
- 标志性元素：模糊的抽象圆形、细线条、克制的动效

### 5. Notebook Tabs

- 氛围：编辑式、有条理、触感强
- 适用场景：报告、评审、结构化叙事
- 字体：Bodoni Moda + DM Sans
- 配色：炭灰底上的奶油纸色配柔和色标签
- 标志性元素：纸张质感、彩色侧边标签、装订细节

### 6. Pastel Geometry

- 氛围：亲切、现代、友好
- 适用场景：产品概览、新手引导、轻量级品牌演示
- 字体：仅 Plus Jakarta Sans
- 配色：浅蓝底、奶油色卡片、柔和粉/薄荷/淡紫强调色
- 标志性元素：竖向胶囊形、圆角卡片、柔和阴影

### 7. Split Pastel

- 氛围：趣味性、现代、创意
- 适用场景：机构介绍、工作坊、作品集
- 字体：仅 Outfit
- 配色：桃色 + 淡紫分屏配薄荷徽章
- 标志性元素：分屏背景、圆角标签、浅色网格叠加

### 8. Vintage Editorial

- 氛围：机智、个性鲜明、杂志风格
- 适用场景：个人品牌、观点鲜明的演讲、叙事
- 字体：Fraunces + Work Sans
- 配色：奶油色、炭灰色、暖色调温暖强调色
- 标志性元素：几何装饰、边框引用框、有冲击力的衬线标题

### 9. Neon Cyber

- 氛围：未来感、科技感、动感
- 适用场景：AI、基础设施、开发工具、未来趋势演讲
- 字体：Clash Display + Satoshi
- 配色：午夜海军蓝、青色、品红色
- 标志性元素：发光效果、粒子、网格、数据雷达能量感

### 10. Terminal Green

- 氛围：面向开发者、极客式整洁
- 适用场景：API、CLI 工具、工程演示
- 字体：仅 JetBrains Mono
- 配色：GitHub 深色 + 终端绿
- 标志性元素：扫描线、命令行式框架、精确的等宽字体节奏

### 11. Swiss Modern

- 氛围：极简、精确、数据导向
- 适用场景：企业级、产品策略、数据分析
- 字体：Archivo + Nunito
- 配色：白色、黑色、信号红
- 标志性元素：可见网格、不对称布局、几何纪律性

### 12. Paper & Ink

- 氛围：文学感、深思熟虑、叙事驱动
- 适用场景：随笔、主题演讲叙事、宣言式幻灯片
- 字体：Cormorant Garamond + Source Serif 4
- 配色：暖奶油色、炭灰色、深红强调色
- 标志性元素：引文强调、首字下沉、优雅线条

## 直接选择提示

如果用户已经知道想要的风格，让他们直接从上述预设名称中选择，而非强制生成预览。

## 动画感觉映射

| 感觉 | 动效方向 |
|------|---------|
| 戏剧性 / 电影感 | 慢速淡入、视差效果、大比例缩放 |
| 科技感 / 未来感 | 发光、粒子、网格运动、文字扰乱效果 |
| 趣味性 / 友好 | 弹性缓动、圆角形状、漂浮运动 |
| 专业 / 企业级 | 细微的 200-300ms 过渡、干净的滑动 |
| 平静 / 极简 | 非常克制的运动、留白优先 |
| 编辑式 / 杂志风 | 强层级、交错的文字和图片交互 |

## CSS 注意事项：函数取反

永远不要这样写：

```css
right: -clamp(28px, 3.5vw, 44px);
margin-left: -min(10vw, 100px);
```

浏览器会静默忽略它们。

始终这样写：

```css
right: calc(-1 * clamp(28px, 3.5vw, 44px));
margin-left: calc(-1 * min(10vw, 100px));
```

## 验证尺寸

至少在以下尺寸测试：
- 桌面端：`1920x1080`、`1440x900`、`1280x720`
- 平板端：`1024x768`、`768x1024`
- 移动端：`375x667`、`414x896`
- 横屏手机：`667x375`、`896x414`

## 反模式

不要使用：
- 白底紫色的初创公司模板
- Inter / Roboto / Arial 作为视觉风格，除非用户明确要求实用主义的中性风格
- 要点堆砌、小号字体或需要滚动的代码块
- 当抽象几何图形更适合时使用的装饰性插图
