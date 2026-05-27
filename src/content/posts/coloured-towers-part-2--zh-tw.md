---
locale: zh-cn
title: "色彩、科技與光影的樂趣"
subtitle: "第二部分 — 技術挑戰與實驗"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Jetson Nano 色彩檢測、FastLED 控制，以及為 Dave Bramston 的《彩色塔》每根立柱驅動 5,760 顆 LED。
---

在這篇文章中，我們將深入探討為英國藝術家 Dave Bramston 建造 4 米高 LED 塔的技術細節。如果你好奇這次合作的創意背景，以及我們如何在疫情期間為英國 The Bowes Museum 創作《彩色塔》(*Coloured Towers*)，請查看[第一部分：作品背後的故事](/blog/coloured-towers-part-1/)。

在實現這件藝術裝置時，TechxArtisan 需要克服 several 技術難題。我們使用的核心硬件包括 Nvidia 的 **Jetson Nano**——一款低功耗、帶 GPU 的微型計算機，非常適合運行 AI 算法——以及 **ESP32**，這是一款廣泛使用的微控制器單元 (MCU)，能夠利用 [FastLED](https://fastled.io/) 庫有效管理主機計算機與 LED 燈單元之間的通信。

以下是流程的簡要概述：

1. Jetson Nano 上的 **AI 算法**通過攝像頭檢測人們穿著的衣服。
2. 使用 **K-means 聚類**提取衣服的主色調。
3. 提取的 RGB 值被髮送到 ESP32，由它控制附著在藝術品上的 LED 燈帶。

![技術流程圖](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*技術流程。*

現在，讓我們分解一下遇到的一些最有趣的技術挑戰。

### 使用 Nvidia Jetson Nano 檢測衣物

Jetson Nano 使我們能夠運行經過訓練的開源 AI 模型來檢測人類衣物。該過程包括從攝像頭捕獲每幀圖像，將其劃分為 10×16 的網格矩陣，並運行模型來識別哪些網格與我們的目標匹配——在本例中是衣物。雖然該模型設計用於檢測包括 **MHP Class 列表**在內的多種對象，但我們專門將其用於衣物檢測。

### 在現實與數字之間轉換色彩

人類視覺通過反射光感知色彩，但機器通過捕獲圖像並將其轉換為數字代碼來"看到"色彩。棘手之處在於——由於光照、焦距、白平衡和曝光設置等因素，攝像頭並不總是能準確捕捉色彩。我們的目標是彌合這一差距，儘可能真實地捕捉色彩。

![色彩校準板](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*使用色彩校準板將數字色彩與現實對齊。*

一旦機器檢測到色彩，我們就應用 k-means 聚類從衣物中提取主色調。然後對這些 RGB 值進行平均，併發送到 LED 控制器。

### LED 色彩與 RGB 問題

我們使用的 LED 燈帶（ws281x 系列）可以混合紅、綠、藍（RGB）通道來創造廣泛的色彩範圍。但也存在一些限制：

- 如果參觀者的衣服顏色較深，LED 燈難以表現灰色和黑色。LED 只是降低整體亮度。
- 我們的 ws281x 燈帶傾向於偏藍，這意味著我們必須在軟件中微調色彩平衡以獲得恰到好處的色調。

![色彩檢測測試](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*測試色彩檢測程序的穩定性。*

還有一個有趣的反饋循環在起作用：當機器檢測到某人衣服的顏色時，它會投射相應的 LED 光色，這反過來又增強了衣服的原始色調。這創造了一個動態的、迭代的過程，使互動更加有趣，尤其是當多名參與者穿著不同顏色的衣服時。

### 為所有 LED 燈帶供電

安全高效地點亮這麼多 LED 燈帶絕非易事。四根立柱中的每一根都需要仔細的功率計算，以確保系統能夠承受負載而不會出現任何問題。以下是簡要分解：

每根立柱：

- **24 條 LED 燈帶** × 每條 4 米 = 每根立柱 **96 米** LED
- **96 米** × 每米 60 顆 LED = **5,760 顆 LED**
- 每條燈帶在全功率（白光）下使用 **4 安培**
- 因此，**24 條燈帶** × 4 安培 = 一根立柱需要 **96 安培**
- 96 安培 × **12V** = 每根立柱 **1,152W**

當四根立柱全功率運行時，總功率約為 **4,600W**。然而，我們創建的大多數燈光動畫消耗的功率要低得多，因為我們很少使用全白光。儘管如此，建立一些冗餘可以確保系統保持安全穩定。

![連接電源](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*小心連接電源。*

對於技術愛好者，以下是我們 FastLED 代碼的片段：

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

這使我們能夠控制每根立柱 **12 × 80 = 960 個像素**。

### 結語

如需更深入的技術見解，請查看我在 Reddit FastLED 社區的發帖。我要特別感謝 **Quindor** 和 **Charles Goodwin** 的支持和點贊。與 Dave Bramston 和 The Bowes Museum 的合作是一次極其充實的經歷，我們渴望繼續突破藝術與技術的邊界。

如果你正在從事類似項目，或者只是對這類裝置感到好奇，歡迎聯繫我們——我們總是樂於分享知識，並向社區中的其他人學習。

感謝閱讀！

---

**概覽：** 四根立柱，每根約 5 米 · 每根立柱 5,760 顆 LED · Nvidia Jetson Nano + ESP32 · *Journey in Colour*，The Bowes Museum，2022 年 6 月 18 日 – 10 月 30 日。

[查看項目中心](/projects/coloured-towers) · [第一部分：作品背後的故事](/blog/coloured-towers-part-1/)