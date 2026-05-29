---
locale: pt-br
title: "As Alegrias da Cor, Tecnologia e Luz"
subtitle: "Parte 2 — Desafios Técnicos e Experimentos"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Detecção de cores com Jetson Nano, controle FastLED e alimentação de 5.760 LEDs por pilar nas Coloured Towers de Dave Bramston.
---

Neste post, mergulhamos no lado técnico da construção das torres de LED de 4 metros de altura para o artista britânico Dave Bramston. Se você tem curiosidade sobre a história criativa por trás dessa colaboração e como trabalhamos juntos para criar as *Coloured Towers* durante a pandemia para o The Bowes Museum no Reino Unido, confira a [Parte 1: A História por Trás da Obra](/blog/coloured-towers-part-1/).

Quando se tratou de concretizar esta instalação artística, havia vários obstáculos técnicos que precisávamos superar na TechxArtisan. O hardware essencial que utilizamos incluiu o **Jetson Nano** da Nvidia — um microcomputador de baixo consumo com suporte a GPU, perfeito para executar algoritmos de IA — e o **ESP32**, uma unidade microcontroladora (MCU) amplamente utilizada que gerencia eficientemente a comunicação entre o computador host e as unidades de luz LED usando a biblioteca [FastLED](https://fastled.io/).

Aqui está uma visão geral resumida do processo:

1. **Algoritmos de IA** no Jetson Nano detectam as roupas que as pessoas estão vestindo através de uma câmera.
2. **Agrupamento K-means** é usado para extrair a cor dominante de suas roupas.
3. Os valores RGB extraídos são enviados para o ESP32, que controla as fitas de LED conectadas à obra de arte.

![Technical process diagram](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*O processo técnico.*

Agora, vamos detalhar alguns dos desafios técnicos mais interessantes que encontramos.

### Detectando Roupas com o Nvidia Jetson Nano

O Jetson Nano nos permitiu executar modelos de IA de código aberto treinados para detectar roupas humanas. O processo envolve capturar cada quadro de imagem de uma câmera, dividi-lo em uma matriz de grades 10x16 e executar um modelo para identificar quais grades correspondem ao nosso alvo — roupas, neste caso. Embora o modelo seja projetado para detectar uma variedade de objetos, incluindo aqueles na **lista de Classes MHP**, o utilizamos especificamente para detecção de roupas.

### Traduzindo Cores Entre a Realidade e o Digital

A visão humana percebe cores através da luz refletida, mas as máquinas "veem" cores capturando imagens e convertendo-as em códigos digitais. Aqui é onde a parte complicada entra — as câmeras nem sempre capturam cores com precisão devido a fatores como iluminação, foco, balanço de branco e configurações de exposição. Nosso objetivo foi diminuir essa lacuna e capturar cores o mais próximo possível da realidade.

![Colour checker board](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*Usando um quadro de verificação de cores para alinhar as cores digitais com a realidade.*

Uma vez que a máquina detecta uma cor, aplicamos o agrupamento k-means para extrair a cor dominante das roupas. Esses valores RGB são então calculados em média e enviados ao controlador de LED.

### Cores dos LEDs e o Problema RGB

As fitas de LED (série ws281x) que utilizamos podem misturar canais vermelho, verde e azul (RGB) para criar uma ampla gama de cores. Mas existem algumas limitações:

- As luzes LED têm dificuldade em representar cinzas e pretos se as roupas do visitante forem escuras. Os LEDs simplesmente reduzem o brilho geral.
- Nossas fitas ws281x tendem a ter um leve desvio para o azul, o que significou que tivemos que ajustar finamente o balanço de cores no software para obter os tons corretos.

![Colour detection testing](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*Testando a estabilidade do programa de detecção de cores.*

Há também um interessante ciclo de retroalimentação em jogo: quando a máquina detecta a cor das roupas de alguém, ela projeta uma cor de luz LED correspondente, que por sua vez intensifica o tom original da roupa. Isso cria um processo dinâmico e iterativo que torna a interação mais divertida, especialmente com múltiplos participantes vestindo cores diferentes.

### Alimentando Todas Aquelas Fitas de LED

Iluminar tantas fitas de LED de forma segura e eficiente não foi tarefa fácil. Cada um dos quatro pilares exigiu cálculos de potência cuidadosos para garantir que o sistema pudesse suportar a carga sem problemas. Aqui está um resumo rápido:

Para cada pilar:

- **24 fitas de LED** × 4 metros por fita = **96 metros** de LEDs por pilar
- **96 metros** × 60 LEDs por metro = **5.760 LEDs**
- Cada fita usa **4 ampères** em potência máxima (luz branca)
- Então, **24 fitas** × 4 ampères = **96 ampères** necessários para um pilar
- 96 ampères × **12V** = **1.152W** por pilar

Isso totaliza cerca de **4.600W** quando todos os quatro pilares estão em intensidade máxima. No entanto, a maioria das animações de luz que criamos consome significativamente menos energia, já que raramente usamos luz branca total. Ainda assim, incorporar alguma redundância garante que o sistema permaneça seguro e estável.

![Connecting the power supply](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*Conectando cuidadosamente a fonte de alimentação.*

Para os mais técnicos, aqui está um trecho do nosso código FastLED:

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

Isso nos permitiu controlar **12 x 80 = 960 pixels** por pilar.

### Considerações Finais

Para insights técnicos mais aprofundados, confira minha publicação na comunidade FastLED no Reddit. Gostaria de dar um agradecimento especial a **Quindor** e **Charles Goodwin** pelo apoio e votos positivos. Colaborar com Dave Bramston e o The Bowes Museum foi uma experiência incrivelmente gratificante, e estamos ansiosos para continuar expandindo os limites da arte e da tecnologia.

Se você está trabalhando em um projeto semelhante ou apenas tem curiosidade sobre esse tipo de instalação, sinta-se à vontade para entrar em contato — estamos sempre felizes em compartilhar nosso conhecimento e aprender com outros na comunidade.

Obrigado pela leitura!

---

**Em resumo:** Quatro pilares, ~5 m cada · 5.760 LEDs por pilar · Nvidia Jetson Nano + ESP32 · *Journey in Colour*, The Bowes Museum, 18 de junho – 30 de outubro de 2022.

[Ver o hub do projeto](/projects/coloured-towers) · [Parte 1: A História por Trás da Obra](/blog/coloured-towers-part-1/)
