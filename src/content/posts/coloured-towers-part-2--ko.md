---
locale: ko
title: "색채, 기술, 그리고 빛의 즐거움"
subtitle: "파트 2 — 기술적 도전과 실험"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Dave Bramston의 Coloured Towers를 위한 Jetson Nano 색상 감지, FastLED 제어, 그리고 기둥당 5,760개 LED의 전원 공급.
---

이번 글에서는 영국 아티스트 Dave Bramston을 위해 4미터 높이의 LED 타워를 제작한 기술적 측면에 대해 자세히 살펴봅니다. 팬데믹 기간 동안 영국 The Bowes Museum을 위한 *Coloured Towers*를 어떻게 함께 만들게 되었는지에 대한 창작 배경 이야기가 궁금하시다면, [파트 1: 작품 뒤에 숨겨진 이야기](/blog/coloured-towers-part-1/)를 확인해보세요.

이 예술 설치 작품을 실현할 때, TechxArtisan에서 극복해야 할 여러 기술적 난관이 있었습니다. 우리가 사용한 핵심 하드웨어에는 Nvidia의 **Jetson Nano** — AI 알고리즘 실행에 완벽한 저전력 GPU 기반 마이크로컴퓨터 — 와 **ESP32** — [FastLED](https://fastled.io/) 라이브러리를 사용하여 호스트 컴퓨터와 LED 조명 유닛 간의 통신을 효과적으로 관리하는 널리 사용되는 마이크로컨트롤러 유닛(MCU) — 가 포함되었습니다.

프로세스에 대한 간략한 개요입니다:

1. Jetson Nano의 **AI 알고리즘**이 카메라를 통해 사람들이 입고 있는 옷을 감지합니다.
2. **K-평균 클러스터링**을 사용하여 옷의 주요 색상을 추출합니다.
3. 추출된 RGB 값이 ESP32로 전송되어 작품에 부착된 LED 스트립을 제어합니다.

![Technical process diagram](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*기술적 프로세스.*

이제 우리가 마주한 가장 흥미로운 기술적 도전들을 분석해 보겠습니다.

### Nvidia Jetson Nano를 이용한 의류 감지

Jetson Nano를 통해 인간의 의류를 감지하도록 훈련된 오픈소스 AI 모델을 실행할 수 있었습니다. 이 과정은 카메라에서 각 이미지 프레임을 캡처하고, 이를 10x16 그리드 매트릭스로 분할한 뒤, 모델을 실행하여 어떤 그리드가 우리의 대상 — 이 경우 의류 — 과 일치하는지 식별하는 것입니다. 모델은 **MHP 클래스 리스트**에 포함된 것들을 비롯한 다양한 객체를 감지하도록 설계되었지만, 우리는 특별히 의류 감지에만 사용했습니다.

### 현실과 디지털 사이의 색상 변환

인간의 시각은 반사된 빛을 통해 색상을 인식하지만, 기계는 이미지를 캡처하고 디지털 코드로 변환함으로써 색상을 "봅니다". 여기서 까다로운 부분이 등장합니다 — 카메라는 조명, 초점, 화이트 밸런스, 노출 설정과 같은 요인으로 인해 항상 색상을 정확하게 캡처하지 못합니다. 우리는 이 격차를 줄이고 가능한 한 현실에 가깝게 색상을 캡처하는 것을 목표로 했습니다.

![Colour checker board](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*컬러 체커 보드를 사용하여 디지털 색상을 현실에 맞추기.*

기계가 색상을 감지하면, K-평균 클러스터링을 적용하여 의류에서 주요 색상을 추출합니다. 이 RGB 값들은 평균화되어 LED 컨트롤러로 전송됩니다.

### LED 색상과 RGB 문제

우리가 사용한 LED 조명 스트립(ws281x 시리즈)은 빨강, 초록, 파랑(RGB) 채널을 혼합하여 다양한 색상을 만들어낼 수 있습니다. 하지만 몇 가지 한계가 있습니다:

- LED 조명은 방문객의 옷이 어두울 경우 회색과 검정을 표현하는 데 어려움을 겪습니다. LED는 단순히 전체 밝기를 줄일 뿐입니다.
- 우리의 ws281x 스트립은 약간 파란색으로 치우치는 경향이 있어, 올바른 색조를 얻기 위해 소프트웨어에서 색상 밸런스를 미세 조정해야 했습니다.

![Colour detection testing](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*색상 감지 프로그램의 안정성 테스트.*

또한 흥미로운 피드백 루프가 작용합니다: 기계가 누군가의 옷 색상을 감지하면, 그에 상응하는 LED 조명 색상을 투사하고, 이는 다시 옷의 원래 색조를 강화합니다. 이것은 역동적이고 반복적인 프로세스를 만들어내어, 특히 다른 색상의 옷을 입은 여러 참가자가 있을 때 상호작용을 더욱 재미있게 만듭니다.

### 모든 LED 스트립에 전력 공급하기

그렇게 많은 LED 스트립에 안전하고 효율적으로 전력을 공급하는 것은 결코 작은 일이 아니었습니다. 네 개의 기둥 각각에는 시스템이 문제 없이 부하를 감당할 수 있도록 신중한 전력 계산이 필요했습니다. 간략한 분석입니다:

각 기둥당:

- **24개 LED 스트립** × 스트립당 4미터 = 기둥당 **96미터**의 LED
- **96미터** × 미터당 60개 LED = **5,760개 LED**
- 각 스트립은 최대 출력(백색광)에서 **4암페어** 사용
- 따라서 **24개 스트립** × 4암페어 = 하나의 기둥에 **96암페어** 필요
- 96암페어 × **12V** = 기둥당 **1,152W**

네 개의 기둥 모두 최대 강도로 작동할 때 약 **4,600W**에 달합니다. 그러나 우리가 만든 대부분의 조명 애니메이션은 전체 백색광을 거의 사용하지 않기 때문에 훨씬 적은 전력을 소비합니다. 그럼에도 불구하고, 약간의 여유를 두어 시스템이 안전하고 안정적으로 유지되도록 했습니다.

![Connecting the power supply](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*전원 공급 장치를 신중하게 연결하는 모습.*

기술에 관심 있는 분들을 위해, 우리 FastLED 코드의 일부를 공유합니다:

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

이를 통해 기둥당 **12 x 80 = 960 픽셀**을 제어할 수 있었습니다.

### 마무리 생각

더 심층적인 기술 인사이트를 원하시면, Reddit의 FastLED 커뮤니티에 올린 제 글을 확인해보세요. 지원과 업보트를 해주신 **Quindor**와 **Charles Goodwin**에게 감사의 말씀을 전합니다. Dave Bramston 및 The Bowes Museum과의 협업은 놀라울 정도로 보람 있는 경험이었으며, 우리는 예술과 기술의 경계를 계속해서 넓혀가기를 열망합니다.

비슷한 프로젝트를 진행 중이시거나 이런 종류의 설치 작품에 대해 궁금하신 분들은 언제든지 연락해 주세요 — 우리는 항상 기꺼이 지식을 공유하고 커뮤니티의 다른 분들로부터 배우고 있습니다.

읽어주셔서 감사합니다!

---

**한눈에 보기:** 4개의 기둥, 각 ~5m · 기둥당 5,760개 LED · Nvidia Jetson Nano + ESP32 · *Journey in Colour*, The Bowes Museum, 2022년 6월 18일 – 10월 30일.

[프로젝트 허브 보기](/projects/coloured-towers) · [파트 1: 작품 뒤에 숨겨진 이야기](/blog/coloured-towers-part-1/)
