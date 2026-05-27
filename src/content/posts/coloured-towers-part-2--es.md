---
locale: es
title: "Las Alegrías del Color, la Tecnología y la Luz"
subtitle: "Parte 2 — Desafíos Técnicos y Experimentos"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Detección de color con Jetson Nano, control con FastLED y alimentación de 5,760 LEDs por pilar para las Torres de Color de Dave Bramston.
---

En este artículo, profundizamos en el lado técnico de la construcción de las torres LED de 4 metros de altura para el artista británico Dave Bramston. Si te interesa conocer la historia creativa detrás de esta colaboración y cómo trabajamos juntos para crear las *Torres de Color* durante la pandemia para The Bowes Museum en el Reino Unido, consulta la [Parte 1: Historia detrás de la Obra](/blog/coloured-towers-part-1/).

A la hora de materializar esta instalación artística, hubo varios obstáculos técnicos que tuvimos que superar en TechxArtisan. El hardware esencial que utilizamos incluyó el **Jetson Nano** de Nvidia, una microcomputadora de bajo consumo con GPU perfecta para ejecutar algoritmos de IA, y el **ESP32**, una unidad de microcontrolador (MCU) ampliamente utilizada que gestiona eficazmente la comunicación entre la computadora host y las unidades de luz LED utilizando la biblioteca [FastLED](https://fastled.io/).

Aquí hay una breve descripción del proceso:

1. **Algoritmos de IA** en el Jetson Nano detectan la ropa que lleva la gente a través de una cámara.
2. **Agrupamiento k-means** se utiliza para extraer el color dominante de su ropa.
3. Los valores RGB extraídos se envían al ESP32, que controla las tiras LED adheridas a la obra de arte.

![Technical process diagram](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*El proceso técnico.*

Ahora, desglosemos algunos de los desafíos técnicos más interesantes que encontramos.

### Detectar Ropa con Nvidia Jetson Nano

El Jetson Nano nos permitió ejecutar modelos de IA de código abierto entrenados para detectar ropa humana. El proceso implica capturar cada cuadro de imagen de una cámara, dividirlo en una matriz de cuadrículas de 10x16 y ejecutar un modelo para identificar qué cuadrículas coinciden con nuestro objetivo: ropa, en este caso. Aunque el modelo está diseñado para detectar una variedad de objetos, incluyendo los de la **lista de clase MHP**, lo usamos específicamente para la detección de ropa.

### Traducir Colores entre la Realidad y lo Digital

La visión humana percibe el color a través de la luz reflejada, pero las máquinas "ven" los colores capturando imágenes y convirtiéndolas en códigos digitales. Aquí es donde viene la parte difícil: las cámaras no siempre capturan los colores con precisión debido a factores como la iluminación, el enfoque, el balance de blancos y la configuración de exposición. Nuestro objetivo fue salvar esta brecha y capturar los colores lo más cerca posible de la realidad.

![Colour checker board](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*Usando un tablero de verificación de color para alinear los colores digitales con la realidad.*

Una vez que la máquina detecta un color, aplicamos agrupamiento k-means para extraer el color dominante de la ropa. Estos valores RGB luego se promedian y se envían al controlador LED.

### Colores LED y el Problema RGB

Las tiras de luz LED (serie ws281x) que usamos pueden mezclar los canales rojo, verde y azul (RGB) para crear una amplia gama de colores. Pero hay algunas limitaciones:

- Las luces LED tienen dificultades para representar grises y negros si la ropa de un visitante es oscura. Los LED simplemente reducen el brillo general.
- Nuestras tiras ws281x tienden a desviarse ligeramente hacia el azul, lo que significa que tuvimos que ajustar el equilibrio de color en el software para obtener los tonos tepatinos.

![Colour detection testing](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*Probando la estabilidad del programa de detección de color.*

También hay un ciclo de retroalimentación interesante en juego: cuando la máquina detecta el color de la ropa de alguien, proyecta un color de luz LED correspondiente, lo que a su vez mejora el tono original de la ropa. Esto crea un proceso dinámico e iterativo que hace que la interacción sea más divertida, especialmente con múltiples participantes usando diferentes colores.

### Alimentar Todas Esas Tiras LED

Iluminar tantas tiras LED de manera segura y eficiente no fue poca cosa. Cada uno de los cuatro pilares requería cálculos de energía cuidadosas para asegurar que el sistema pudiera manejar la carga sin problemas. Aquí hay un desglose rápido:

Para cada pilar:

- **24 tiras LED** × 4 metros por tira = **96 metros** de LED por pilar
- **96 metros** × 60 LED por metro = **5,760 LED**
- Cada tira usa **4 amperios** a plena potencia (luz blanca)
- Entonces, **24 tiras** × 4 amperios = **96 amperios** requeridos para un pilar
- 96 amperios × **12V** = **1,152W** por pilar

Esto suma alrededor de **4,600W** cuando los cuatro pilares están alimentados a máxima intensidad. Sin embargo, la mayoría de las animaciones de luz que creamos consumen significativamente menos energía, ya que rara vez usamos luz blanca completa. Sin embargo, incorporar algo de redundancia asegura que el sistema permanezca seguro y estable.

![Connecting the power supply](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*Conectando cuidadosamente la fuente de alimentación.*

Para los técnicamente inclinados, aquí hay un fragmento de nuestro código FastLED:

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

Esto nos permitió controlar **12 x 80 = 960 píxeles** por pilar.

### Reflexiones Finales

Para obtener información técnica más detallada, consulta mi publicación en la comunidad de FastLED en Reddit. Me gustaría dar las gracias a **Quindor** y **Charles Goodwin** por su apoyo y votos positivos. Colaborar con Dave Bramston y The Bowes Museum ha sido una experiencia increíblemente gratificante, y estamos ansiosos por continuar empujando los límites del arte y la tecnología.

Si estás trabajando en un proyecto similar o simplemente tienes curiosidad sobre este tipo de instalación, no dudes en contactarnos, siempre estamos felices de compartir nuestro conocimiento y aprender de otros en la comunidad.

¡Gracias por leer!

---

**De un vistazo:** Cuatro pilares, ~5 m cada uno · 5,760 LED por pilar · Nvidia Jetson Nano + ESP32 · *Journey in Colour*, The Bowes Museum, 18 de junio – 30 de octubre de 2022.

[Ver el centro del proyecto](/projects/coloured-towers) · [Parte 1: Historia detrás de la Obra](/blog/coloured-towers-part-1/)