---
locale: it
title: "Le Gioie del Colore, della Tecnologia e della Luce"
subtitle: "Parte 2 — Sfide Tecniche ed Esperimenti"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Rilevamento del colore con Jetson Nano, controllo FastLED e alimentazione di 5.760 LED per pilastro per le Coloured Towers di Dave Bramston.
---

In questo articolo, approfondiamo il lato tecnico della costruzione delle torri LED alte 4 metri per l'artista britannico Dave Bramston. Se sei curioso della storia creativa dietro questa collaborazione e di come abbiamo lavorato insieme per creare le *Coloured Towers* durante la pandemia per The Bowes Museum nel Regno Unito, dai un'occhiata alla [Parte 1: La Storia Dietro l'Opera d'Arte](/blog/coloured-towers-part-1/).

Quando si è trattato di realizzare questa installazione artistica, ci sono state diverse sfide tecniche che abbiamo dovuto affrontare in TechxArtisan. L'hardware essenziale che abbiamo utilizzato includeva il **Jetson Nano** di Nvidia—un microcomputer a basso consumo con GPU, perfetto per eseguire algoritmi di intelligenza artificiale—e l'**ESP32**, un'unità di microcontrollore (MCU) ampiamente utilizzata che gestisce efficacemente la comunicazione tra il computer host e le unità luminose LED utilizzando la libreria [FastLED](https://fastled.io/).

Ecco una breve panoramica del processo:

1. Gli **algoritmi di intelligenza artificiale** sul Jetson Nano rilevano i vestiti che le persone indossano tramite una telecamera.
2. Il **clustering k-means** viene utilizzato per estrarre il colore dominante dei loro vestiti.
3. I valori RGB estratti vengono inviati all'ESP32, che controlla le strisce LED attaccate all'opera d'arte.

![Diagramma del processo tecnico](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*Il processo tecnico.*

Ora, analizziamo alcune delle sfide tecniche più interessanti che abbiamo incontrato.

### Rilevare i Vestiti con Nvidia Jetson Nano

Il Jetson Nano ci ha permesso di eseguire modelli di intelligenza artificiale open-source addestrati per rilevare i vestiti umani. Il processo prevede la cattura di ogni fotogramma da una telecamera, la divisione in una matrice di griglie 10x16 e l'esecuzione di un modello per identificare quali griglie corrispondono al nostro obiettivo—i vestiti, in questo caso. Sebbene il modello sia progettato per rilevare una gamma di oggetti, inclusi quelli nella **lista delle classi MHP**, lo abbiamo utilizzato specificamente per il rilevamento dei vestiti.

### Tradurre i Colori tra Realtà e Digitale

La visione umana percepisce il colore attraverso la luce riflessa, ma le macchine "vedono" i colori catturando immagini e convertendole in codici digitali. Qui entra in gioco la parte complicata—le telecamere non sempre catturano i colori con precisione a causa di fattori come l'illuminazione, la messa a fuoco, il bilanciamento del bianco e le impostazioni di esposizione. Abbiamo mirato a colmare questa lacuna e catturare i colori il più vicino possibile alla realtà.

![Tavola di controllo colore](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*Utilizzo di una tavola di controllo colore per allineare i colori digitali con la realtà.*

Una volta che la macchina rileva un colore, applichiamo il clustering k-means per estrarre il colore dominante dai vestiti. Questi valori RGB vengono poi mediati e inviati al controller LED.

### I Colori LED e il Problema RGB

Le strisce luminose LED (serie ws281x) che abbiamo utilizzato possono miscelare i canali rosso, verde e blu (RGB) per creare una vasta gamma di colori. Ma ci sono alcune limitazioni:

- Le luci LED faticano a rappresentare i grigi e i neri se i vestiti di un visitatore sono scuri. I LED semplicemente riducono la luminosità complessiva.
- Le nostre strisce ws281x tendono a spostarsi leggermente verso il blu, il che significa che abbiamo dovuto affinare il bilanciamento del colore nel software per ottenere le tonalità giuste.

![Test di rilevamento colore](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*Test della stabilità del programma di rilevamento colore.*

C'è anche un interessante ciclo di feedback in gioco: quando la macchina rileva il colore dei vestiti di qualcuno, proietta un corrispondente colore di luce LED, che a sua volta esalta la tonalità originale dei vestiti. Questo crea un processo dinamico e iterativo che rende l'interazione più divertente, specialmente con più partecipanti che indossano colori diversi.

### Alimentare Tutte Quelle Strisce LED

Illuminare così tante strisce LED in modo sicuro ed efficiente non è stata impresa da poco. Ciascuno dei quattro pilastri richiedeva calcoli attenti dell'alimentazione per garantire che il sistema potesse gestire il carico senza problemi. Ecco una rapida analisi:

Per ogni pilastro:

- **24 strisce LED** × 4 metri per striscia = **96 metri** di LED per pilastro
- **96 metri** × 60 LED per metro = **5.760 LED**
- Ogni striscia utilizza **4 ampere** a piena potenza (luce bianca)
- Quindi, **24 strisce** × 4 ampere = **96 ampere** richiesti per un pilastro
- 96 ampere × **12V** = **1.152W** per pilastro

Questo si somma a circa **4.600W** quando tutti e quattro i pilastri sono alimentati a piena intensità. Tuttavia, la maggior parte delle animazioni luminose che abbiamo creato consumano significativamente meno energia, poiché raramente utilizziamo la luce bianca completa. Nonostante ciò, costruire un po' di ridondanza garantisce che il sistema rimanga sicuro e stabile.

![Collegamento dell'alimentazione](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*Collegamento attento dell'alimentazione.*

Per i tecnici, ecco un frammento del nostro codice FastLED:

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

Questo ci ha permesso di controllare **12 x 80 = 960 pixel** per pilastro.

### Considerazioni Finali

Per approfondimenti tecnici più dettagliati, dai un'occhiata al mio post nella community FastLED su Reddit. Vorrei ringraziare **Quindor** e **Charles Goodwin** per il loro supporto e i loro upvote. Collaborare con Dave Bramston e The Bowes Museum è stata una esperienza incredibilmente gratificante, e siamo desiderosi di continuare a spingere i confini dell'arte e della tecnologia.

Se stai lavorando a un progetto simile o sei semplicemente curioso di questo tipo di installazione, sentiti libero di contattarci—siamo sempre felici di condividere le nostre conoscenze e imparare dagli altri nella community.

Grazie per la lettura!

---

**In sintesi:** Quattro pilastri, ~5 m ciascuno · 5.760 LED per pilastro · Nvidia Jetson Nano + ESP32 · *Journey in Colour*, The Bowes Museum, 18 giugno – 30 ottobre 2022.

[Visualizza l'hub del progetto](/projects/coloured-towers) · [Parte 1: La Storia Dietro l'Opera d'Arte](/blog/coloured-towers-part-1/)