---
locale: zh-cn
title: "色彩、科技与光影的乐趣"
subtitle: "第二部分 — 技术挑战与实验"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Jetson Nano 色彩检测、FastLED 控制，以及为 Dave Bramston 的《彩色塔》每根立柱驱动 5,760 颗 LED。
---

在这篇文章中，我们将深入探讨为英国艺术家 Dave Bramston 建造 4 米高 LED 塔的技术细节。如果你好奇这次合作的创意背景，以及我们如何在疫情期间为英国 The Bowes Museum 创作《彩色塔》(*Coloured Towers*)，请查看[第一部分：作品背后的故事](/blog/coloured-towers-part-1/)。

在实现这件艺术装置时，TechxArtisan 需要克服 several 技术难题。我们使用的核心硬件包括 Nvidia 的 **Jetson Nano**——一款低功耗、带 GPU 的微型计算机，非常适合运行 AI 算法——以及 **ESP32**，这是一款广泛使用的微控制器单元 (MCU)，能够利用 [FastLED](https://fastled.io/) 库有效管理主机计算机与 LED 灯单元之间的通信。

以下是流程的简要概述：

1. Jetson Nano 上的 **AI 算法**通过摄像头检测人们穿着的衣服。
2. 使用 **K-means 聚类**提取衣服的主色调。
3. 提取的 RGB 值被发送到 ESP32，由它控制附着在艺术品上的 LED 灯带。

![技术流程图](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*技术流程。*

现在，让我们分解一下遇到的一些最有趣的技术挑战。

### 使用 Nvidia Jetson Nano 检测衣物

Jetson Nano 使我们能够运行经过训练的开源 AI 模型来检测人类衣物。该过程包括从摄像头捕获每帧图像，将其划分为 10×16 的网格矩阵，并运行模型来识别哪些网格与我们的目标匹配——在本例中是衣物。虽然该模型设计用于检测包括 **MHP Class 列表**在内的多种对象，但我们专门将其用于衣物检测。

### 在现实与数字之间转换色彩

人类视觉通过反射光感知色彩，但机器通过捕获图像并将其转换为数字代码来"看到"色彩。棘手之处在于——由于光照、焦距、白平衡和曝光设置等因素，摄像头并不总是能准确捕捉色彩。我们的目标是弥合这一差距，尽可能真实地捕捉色彩。

![色彩校准板](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*使用色彩校准板将数字色彩与现实对齐。*

一旦机器检测到色彩，我们就应用 k-means 聚类从衣物中提取主色调。然后对这些 RGB 值进行平均，并发送到 LED 控制器。

### LED 色彩与 RGB 问题

我们使用的 LED 灯带（ws281x 系列）可以混合红、绿、蓝（RGB）通道来创造广泛的色彩范围。但也存在一些限制：

- 如果参观者的衣服颜色较深，LED 灯难以表现灰色和黑色。LED 只是降低整体亮度。
- 我们的 ws281x 灯带倾向于偏蓝，这意味着我们必须在软件中微调色彩平衡以获得恰到好处的色调。

![色彩检测测试](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*测试色彩检测程序的稳定性。*

还有一个有趣的反馈循环在起作用：当机器检测到某人衣服的颜色时，它会投射相应的 LED 光色，这反过来又增强了衣服的原始色调。这创造了一个动态的、迭代的过程，使互动更加有趣，尤其是当多名参与者穿着不同颜色的衣服时。

### 为所有 LED 灯带供电

安全高效地点亮这么多 LED 灯带绝非易事。四根立柱中的每一根都需要仔细的功率计算，以确保系统能够承受负载而不会出现任何问题。以下是简要分解：

每根立柱：

- **24 条 LED 灯带** × 每条 4 米 = 每根立柱 **96 米** LED
- **96 米** × 每米 60 颗 LED = **5,760 颗 LED**
- 每条灯带在全功率（白光）下使用 **4 安培**
- 因此，**24 条灯带** × 4 安培 = 一根立柱需要 **96 安培**
- 96 安培 × **12V** = 每根立柱 **1,152W**

当四根立柱全功率运行时，总功率约为 **4,600W**。然而，我们创建的大多数灯光动画消耗的功率要低得多，因为我们很少使用全白光。尽管如此，建立一些冗余可以确保系统保持安全稳定。

![连接电源](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*小心连接电源。*

对于技术爱好者，以下是我们 FastLED 代码的片段：

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

这使我们能够控制每根立柱 **12 × 80 = 960 个像素**。

### 结语

如需更深入的技术见解，请查看我在 Reddit FastLED 社区的发帖。我要特别感谢 **Quindor** 和 **Charles Goodwin** 的支持和点赞。与 Dave Bramston 和 The Bowes Museum 的合作是一次极其充实的经历，我们渴望继续突破艺术与技术的边界。

如果你正在从事类似项目，或者只是对这类装置感到好奇，欢迎联系我们——我们总是乐于分享知识，并向社区中的其他人学习。

感谢阅读！

---

**概览：** 四根立柱，每根约 5 米 · 每根立柱 5,760 颗 LED · Nvidia Jetson Nano + ESP32 · *Journey in Colour*，The Bowes Museum，2022 年 6 月 18 日 – 10 月 30 日。

[查看项目中心](/projects/coloured-towers) · [第一部分：作品背后的故事](/blog/coloured-towers-part-1/)