---
locale: nl
title: "De Vreugde van Kleur, Technologie en Licht"
subtitle: "Deel 2 — Technische Uitdagingen en Experimenten"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Kleurdetectie met Jetson Nano, FastLED-besturing en het voeden van 5.760 LEDs per pilaar voor Dave Bramston's Coloured Towers.
---

In deze post duiken we in de technische kant van het bouwen van de 4 meter hoge LED-torens voor de Britse kunstenaar Dave Bramston. Als je benieuwd bent naar het creatieve verhaal achter deze samenwerking en hoe we samen de *Coloured Towers* creëerden tijdens de pandemie voor The Bowes Museum in het VK, bekijk dan [Deel 1: Het Verhaal Achter het Kunstwerk](/blog/coloured-towers-part-1/).

Bij het realiseren van deze kunstinstallatie waren er verschillende technische hindernissen die we bij TechxArtisan moesten overwinnen. De essentiële hardware die we gebruikten omvatte Nvidia's **Jetson Nano** — een energiezuinige, GPU-ondersteunde microcomputer die perfect is voor het draaien van AI-algoritmen — en de **ESP32**, een veelgebruikte microcontroller-eenheid (MCU) die de communicatie tussen de hostcomputer en LED-lichtunits efficiënt beheert met behulp van de [FastLED](https://fastled.io/)-bibliotheek.

Hier is een kort overzicht van het proces:

1. **AI-algoritmen** op de Jetson Nano detecteren de kleding die mensen dragen via een camera.
2. **K-means clustering** wordt gebruikt om de dominante kleur van hun kleding te extraheren.
3. De geëxtraheerde RGB-waarden worden naar de ESP32 gestuurd, die de LED-strips aanstuurt die aan het kunstwerk zijn bevestigd.

![Technical process diagram](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*Het technische proces.*

Laten we nu enkele van de meest interessante technische uitdagingen die we tegenkwamen, uiteenzetten.

### Kleding Detecteren met de Nvidia Jetson Nano

De Jetson Nano stelde ons in staat om open-source AI-modellen te draaien die getraind zijn om menselijke kleding te detecteren. Het proces omvat het vastleggen van elk beeldframe van een camera, het verdelen ervan in een matrix van 10x16 rasters, en het draaien van een model om te identificeren welke rasters overeenkomen met ons doel — in dit geval kleding. Hoewel het model is ontworpen om een reeks objecten te detecteren, inclusief die op de **MHP-klassenlijst**, gebruikten we het specifiek voor kledingdetectie.

### Kleuren Vertalen Tussen Realiteit en Digitaal

Menselijk zicht neemt kleur waar door gereflecteerd licht, maar machines "zien" kleuren door beelden vast te leggen en ze om te zetten in digitale codes. Hier wordt het lastig — camera's leggen kleuren niet altijd nauwkeurig vast vanwege factoren zoals belichting, scherpstelling, witbalans en belichtingsinstellingen. We streefden ernaar deze kloof te overbruggen en kleuren zo dicht mogelijk bij de werkelijkheid vast te leggen.

![Colour checker board](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*Een kleurenkaart gebruiken om digitale kleuren af te stemmen op de werkelijkheid.*

Zodra de machine een kleur detecteert, passen we k-means clustering toe om de dominante kleur uit de kleding te extraheren. Deze RGB-waarden worden vervolgens gemiddeld en naar de LED-controller gestuurd.

### LED-kleuren en het RGB-probleem

De LED-lichtstrips (ws281x-serie) die we gebruikten kunnen rode, groene en blauwe (RGB) kanalen mixen om een breed scala aan kleuren te creëren. Maar er zijn enkele beperkingen:

- LED-lichten hebben moeite met het weergeven van grijstinten en zwart als de kleding van een bezoeker donker is. De LEDs verminderen simpelweg de algehele helderheid.
- Onze ws281x-strips neigen enigszins naar blauw, wat betekende dat we de kleurbalans in software moesten fijnafstemmen om de tinten precies goed te krijgen.

![Colour detection testing](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*Het testen van de stabiliteit van het kleurdetectieprogramma.*

Er is ook een interessante feedbacklus in het spel: wanneer de machine de kleur van iemands kleding detecteert, projecteert het een overeenkomstige LED-lichtkleur, die op zijn beurt de oorspronkelijke tint van de kleding versterkt. Dit creëert een dynamisch, iteratief proces dat de interactie leuker maakt, vooral met meerdere deelnemers die verschillende kleuren dragen.

### Al Die LED-strips Van Stroom Voorzien

Het veilig en efficiënt verlichten van zoveel LED-strips was geen sinecure. Elke van de vier pilaren vereiste zorgvuldige vermogensberekeningen om ervoor te zorgen dat het systeem de belasting probleemloos aankon. Hier is een kort overzicht:

Voor elke pilaar:

- **24 LED-strips** × 4 meter per strip = **96 meter** aan LEDs per pilaar
- **96 meter** × 60 LEDs per meter = **5.760 LEDs**
- Elke strip verbruikt **4 ampère** op vol vermogen (wit licht)
- Dus **24 strips** × 4 ampère = **96 ampère** vereist voor één pilaar
- 96 ampère × **12V** = **1.152W** per pilaar

Dit telt op tot ongeveer **4.600W** wanneer alle vier de pilaren op volle intensiteit branden. De meeste lichtanimaties die we creëerden verbruiken echter aanzienlijk minder vermogen, aangezien we zelden vol wit licht gebruiken. Desondanks zorgt het inbouwen van enige redundantie ervoor dat het systeem veilig en stabiel blijft.

![Connecting the power supply](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*Zorgvuldig de voeding aansluiten.*

Voor de technisch geïnteresseerden, hier is een fragment uit onze FastLED-code:

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

Hiermee konden we **12 x 80 = 960 pixels** per pilaar aansturen.

### Slotgedachten

Voor meer diepgaande technische inzichten, bekijk mijn bericht in de FastLED-community op Reddit. Ik wil graag **Quindor** en **Charles Goodwin** bedanken voor hun steun en upvotes. De samenwerking met Dave Bramston en The Bowes Museum was een ongelooflijk bevredigende ervaring, en we zijn enthousiast om de grenzen van kunst en technologie te blijven verleggen.

Als je aan een soortgelijk project werkt of gewoon nieuwsgierig bent naar dit type installatie, neem gerust contact op — we delen altijd graag onze kennis en leren van anderen in de community.

Bedankt voor het lezen!

---

**In een oogopslag:** Vier pilaren, ~5 m elk · 5.760 LEDs per pilaar · Nvidia Jetson Nano + ESP32 · *Journey in Colour*, The Bowes Museum, 18 juni – 30 oktober 2022.

[Bekijk de projecthub](/projects/coloured-towers) · [Deel 1: Het Verhaal Achter het Kunstwerk](/blog/coloured-towers-part-1/)
