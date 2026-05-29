---
locale: de
title: "Die Freuden der Farbe, Technologie und des Lichts"
subtitle: "Teil 2 — Technische Herausforderungen und Experimente"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Farberkennung mit Jetson Nano, FastLED-Steuerung und Stromversorgung für 5.760 LEDs pro Säule für Dave Bramstons Coloured Towers.
---

In diesem Beitrag tauchen wir in die technische Seite des Baus der 4 Meter hohen LED-Türme für den britischen Künstler Dave Bramston ein. Wenn ihr neugierig auf die kreative Hintergrundgeschichte dieser Zusammenarbeit seid und wie wir während der Pandemie gemeinsam die *Coloured Towers* für The Bowes Museum in Großbritannien geschaffen haben, schaut euch [Teil 1: Die Geschichte hinter dem Kunstwerk](/blog/coloured-towers-part-1/) an.

Bei der Realisierung dieser Kunstinstallation mussten wir bei TechxArtisan mehrere technische Hürden überwinden. Die wesentliche Hardware, die wir verwendeten, umfasste Nvidias **Jetson Nano** – einen stromsparenden, GPU-gestützten Mikrocomputer, der perfekt für die Ausführung von KI-Algorithmen geeignet ist – und den **ESP32**, eine weit verbreitete Mikrocontroller-Einheit (MCU), die die Kommunikation zwischen dem Host-Computer und den LED-Lichteinheiten mithilfe der [FastLED](https://fastled.io/)-Bibliothek effektiv verwaltet.

Hier ein kurzer Überblick über den Prozess:

1. **KI-Algorithmen** auf dem Jetson Nano erkennen über eine Kamera die Kleidung, die Personen tragen.
2. **K-Means-Clustering** wird verwendet, um die dominante Farbe ihrer Kleidung zu extrahieren.
3. Die extrahierten RGB-Werte werden an den ESP32 gesendet, der die am Kunstwerk befestigten LED-Streifen steuert.

![Technical process diagram](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*Der technische Prozess.*

Schauen wir uns nun einige der interessantesten technischen Herausforderungen an, auf die wir gestoßen sind.

### Kleidungserkennung mit Nvidia Jetson Nano

Der Jetson Nano ermöglichte es uns, Open-Source-KI-Modelle auszuführen, die darauf trainiert sind, menschliche Kleidung zu erkennen. Der Prozess beinhaltet das Erfassen jedes Bildframes einer Kamera, die Aufteilung in eine Matrix von 10x16 Rastern und die Ausführung eines Modells zur Identifizierung, welche Raster unserem Ziel entsprechen – in diesem Fall Kleidung. Obwohl das Modell darauf ausgelegt ist, eine Reihe von Objekten zu erkennen, einschließlich derer auf der **MHP-Klassenliste**, verwendeten wir es speziell für die Kleidungserkennung.

### Übersetzung von Farben zwischen Realität und Digitalem

Die menschliche Wahrnehmung erkennt Farben durch reflektiertes Licht, aber Maschinen „sehen" Farben, indem sie Bilder aufnehmen und in digitale Codes umwandeln. Hier wird es knifflig – Kameras erfassen Farben aufgrund von Faktoren wie Beleuchtung, Fokus, Weißabgleich und Belichtungseinstellungen nicht immer genau. Wir wollten diese Lücke überbrücken und Farben so realitätsnah wie möglich erfassen.

![Colour checker board](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*Verwendung einer Farbtafel zur Abstimmung digitaler Farben mit der Realität.*

Sobald die Maschine eine Farbe erkennt, wenden wir K-Means-Clustering an, um die dominante Farbe der Kleidung zu extrahieren. Diese RGB-Werte werden dann gemittelt und an den LED-Controller gesendet.

### LED-Farben und das RGB-Problem

Die von uns verwendeten LED-Lichtstreifen (ws281x-Serie) können rote, grüne und blaue (RGB) Kanäle mischen, um eine breite Palette an Farben zu erzeugen. Es gibt jedoch einige Einschränkungen:

- LED-Lichter haben Schwierigkeiten, Grau- und Schwarztöne darzustellen, wenn die Kleidung eines Besuchers dunkel ist. Die LEDs reduzieren einfach die Gesamthelligkeit.
- Unsere ws281x-Streifen neigen dazu, leicht ins Blaue zu tendieren, was bedeutete, dass wir die Farbbalance in der Software feinabstimmen mussten, um die richtigen Farbtöne zu erhalten.

![Colour detection testing](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*Testen der Stabilität des Farberkennungsprogramms.*

Es gibt auch eine interessante Rückkopplungsschleife: Wenn die Maschine die Farbe der Kleidung einer Person erkennt, projiziert sie eine entsprechende LED-Lichtfarbe, die wiederum den ursprünglichen Farbton der Kleidung verstärkt. Dies erzeugt einen dynamischen, iterativen Prozess, der die Interaktion noch unterhaltsamer macht, besonders wenn mehrere Teilnehmer verschiedenfarbige Kleidung tragen.

### Stromversorgung all dieser LED-Streifen

So viele LED-Streifen sicher und effizient mit Strom zu versorgen, war keine kleine Aufgabe. Jede der vier Säulen erforderte sorgfältige Leistungsberechnungen, um sicherzustellen, dass das System die Last ohne Probleme bewältigen konnte. Hier eine kurze Aufschlüsselung:

Für jede Säule:

- **24 LED-Streifen** × 4 Meter pro Streifen = **96 Meter** LEDs pro Säule
- **96 Meter** × 60 LEDs pro Meter = **5.760 LEDs**
- Jeder Streifen verbraucht **4 Ampere** bei voller Leistung (weißes Licht)
- Also **24 Streifen** × 4 Ampere = **96 Ampere** für eine Säule erforderlich
- 96 Ampere × **12V** = **1.152W** pro Säule

Das summiert sich auf etwa **4.600W**, wenn alle vier Säulen mit voller Intensität betrieben werden. Allerdings verbrauchen die meisten der von uns erstellten Lichtanimationen deutlich weniger Strom, da wir selten volles weißes Licht verwenden. Dennoch sorgt eine gewisse Redundanz dafür, dass das System sicher und stabil bleibt.

![Connecting the power supply](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*Sorgfältiges Anschließen der Stromversorgung.*

Für die technisch Interessierten hier ein Ausschnitt aus unserem FastLED-Code:

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

Damit konnten wir **12 x 80 = 960 Pixel** pro Säule steuern.

### Abschließende Gedanken

Für weitergehende technische Einblicke schaut euch meinen Beitrag in der FastLED-Community auf Reddit an. Ich möchte **Quindor** und **Charles Goodwin** für ihre Unterstützung und Upvotes danken. Die Zusammenarbeit mit Dave Bramston und The Bowes Museum war eine unglaublich erfüllende Erfahrung, und wir freuen uns darauf, die Grenzen von Kunst und Technologie weiter zu verschieben.

Wenn ihr an einem ähnlichen Projekt arbeitet oder einfach neugierig auf diese Art von Installation seid, meldet euch gerne – wir teilen unser Wissen immer gerne und lernen von anderen in der Community.

Danke fürs Lesen!

---

**Auf einen Blick:** Vier Säulen, je ~5 m · 5.760 LEDs pro Säule · Nvidia Jetson Nano + ESP32 · *Journey in Colour*, The Bowes Museum, 18. Juni – 30. Oktober 2022.

[Zum Projekt-Hub](/projects/coloured-towers) · [Teil 1: Die Geschichte hinter dem Kunstwerk](/blog/coloured-towers-part-1/)
