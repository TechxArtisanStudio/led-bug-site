---
locale: fr
title: "Les Joies de la Couleur, de la Technologie et de la Lumière"
subtitle: "Partie 2 — Défis Techniques et Expérimentations"
date: 2022-07-06
authors:
  - TechxArtisan
categories:
  - Project
  - TechArt
series: coloured-towers
part: 2
cover: https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp
description: Détection de couleurs avec Jetson Nano, contrôle FastLED, et alimentation de 5 760 LED par pilier pour les Coloured Towers de Dave Bramston.
---

Dans cet article, nous plongeons dans l'aspect technique de la construction des tours LED de 4 mètres de haut pour l'artiste britannique Dave Bramston. Si vous êtes curieux de connaître l'histoire créative derrière cette collaboration et comment nous avons travaillé ensemble pour créer les *Coloured Towers* pendant la pandémie pour The Bowes Museum au Royaume-Uni, consultez la [Partie 1 : L'Histoire Derrière l'Œuvre](/blog/coloured-towers-part-1/).

Pour réaliser cette installation artistique, nous avons dû surmonter plusieurs obstacles techniques chez TechxArtisan. Le matériel essentiel que nous avons utilisé comprenait le **Jetson Nano** de Nvidia — un micro-ordinateur à faible consommation doté d'un GPU, parfait pour exécuter des algorithmes d'IA — et l'**ESP32**, une unité de microcontrôleur (MCU) largement utilisée qui gère efficacement la communication entre l'ordinateur hôte et les unités d'éclairage LED à l'aide de la bibliothèque [FastLED](https://fastled.io/).

Voici un bref aperçu du processus :

1. Les **algorithmes d'IA** sur le Jetson Nano détectent les vêtements des personnes via une caméra.
2. Le **clustering K-means** est utilisé pour extraire la couleur dominante de leurs vêtements.
3. Les valeurs RVB extraites sont envoyées à l'ESP32, qui contrôle les bandes LED attachées à l'œuvre.

![Schéma du processus technique](https://assets.led-bug.com/images/blog/coloured-towers/part-2-technical-process-diagram.webp)

*Le processus technique.*

Maintenant, décomposons quelques-uns des défis techniques les plus intéressants que nous avons rencontrés.

### Détecter les Vêtements avec le Nvidia Jetson Nano

Le Jetson Nano nous a permis d'exécuter des modèles d'IA open-source entraînés à détecter les vêtements humains. Le processus consiste à capturer chaque image de la caméra, à la diviser en une matrice de grilles 10×16, et à exécuter un modèle pour identifier quelles grilles correspondent à notre cible — les vêtements, dans ce cas. Bien que le modèle soit conçu pour détecter une gamme d'objets, y compris ceux de la **liste des classes MHP**, nous l'avons spécifiquement utilisé pour la détection de vêtements.

### Traduire les Couleurs Entre la Réalité et le Numérique

La vision humaine perçoit la couleur par la lumière réfléchie, mais les machines « voient » les couleurs en capturant des images et en les convertissant en codes numériques. C'est ici qu'intervient la partie délicate — les caméras ne capturent pas toujours les couleurs avec précision en raison de facteurs tels que l'éclairage, la mise au point, la balance des blancs et les réglages d'exposition. Nous avons cherché à combler cet écart et à capturer les couleurs aussi proches de la réalité que possible.

![Planche de contrôle des couleurs](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-checker-board.webp)

*Utilisation d'une planche de contrôle des couleurs pour aligner les couleurs numériques avec la réalité.*

Une fois que la machine détecte une couleur, nous appliquons le clustering K-means pour extraire la couleur dominante des vêtements. Ces valeurs RVB sont ensuite moyennées et envoyées au contrôleur LED.

### Les Couleurs LED et le Problème RVB

Les bandes lumineuses LED (série ws281x) que nous avons utilisées peuvent mélanger les canaux rouge, vert et bleu (RVB) pour créer une large gamme de couleurs. Mais il existe certaines limitations :

- Les lumières LED peinent à représenter les gris et les noirs si les vêtements d'un visiteur sont sombres. Les LED réduisent simplement la luminosité globale.
- Nos bandes ws281x ont tendance à légèrement pencher vers le bleu, ce qui signifie que nous devions affiner l'équilibre des couleurs dans le logiciel pour obtenir les teintes justes.

![Test de détection des couleurs](https://assets.led-bug.com/images/blog/coloured-towers/part-2-colour-detection-testing.webp)

*Test de la stabilité du programme de détection des couleurs.*

Il y a également une boucle de rétroaction intéressante en jeu : lorsque la machine détecte la couleur des vêtements de quelqu'un, elle projette une couleur de lumière LED correspondante, qui à son tour renforce la teinte originale des vêtements. Cela crée un processus dynamique et itératif qui rend l'interaction plus amusante, surtout avec plusieurs participants portant des couleurs différentes.

### Alimenter Toutes Ces Bandes LED

Éclairer autant de bandes LED de manière sûre et efficace n'était pas une mince affaire. Chacun des quatre piliers nécessitait des calculs de puissance minutieux pour garantir que le système pouvait supporter la charge sans problème. Voici un rapide détail :

Pour chaque pilier :

- **24 bandes LED** × 4 mètres par bande = **96 mètres** de LED par pilier
- **96 mètres** × 60 LED par mètre = **5 760 LED**
- Chaque bande utilise **4 ampères** à pleine puissance (lumière blanche)
- Donc, **24 bandes** × 4 ampères = **96 ampères** requis pour un pilier
- 96 ampères × **12V** = **1 152W** par pilier

Cela s'élève à environ **4 600W** lorsque les quatre piliers sont alimentés à pleine intensité. Cependant, la plupart des animations lumineuses que nous avons créées consomment significativement moins d'énergie, puisque nous utilisons rarement la lumière blanche à pleine puissance. Néanmoins, intégrer une certaine redondance garantit que le système reste sûr et stable.

![Connexion de l'alimentation électrique](https://assets.led-bug.com/images/blog/coloured-towers/part-2-power-supply-connection.webp)

*Connexion minutieuse de l'alimentation électrique.*

Pour les esprits techniques, voici un extrait de notre code FastLED :

```cpp
const uint8_t kMatrixWidth = 12;
const uint8_t kMatrixHeight = 80;
```

Cela nous a permis de contrôler **12 × 80 = 960 pixels** par pilier.

### Réflexions Finales

Pour des informations techniques plus approfondies, consultez mon article dans la communauté FastLED sur Reddit. Je tiens à remercier **Quindor** et **Charles Goodwin** pour leur soutien et leurs votes positifs. Collaborer avec Dave Bramston et The Bowes Museum a été une expérience incroyablement enrichissante, et nous sommes impatients de continuer à repousser les limites de l'art et de la technologie.

Si vous travaillez sur un projet similaire ou que vous êtes simplement curieux à propos de ce type d'installation, n'hésitez pas à nous contacter — nous sommes toujours heureux de partager nos connaissances et d'apprendre des autres membres de la communauté.

Merci de votre lecture !

---

**En résumé :** Quatre piliers, ~5 m chacun · 5 760 LED par pilier · Nvidia Jetson Nano + ESP32 · *Journey in Colour*, The Bowes Museum, 18 juin – 30 octobre 2022.

[Consulter la page du projet](/projects/coloured-towers) · [Partie 1 : L'Histoire Derrière l'Œuvre](/blog/coloured-towers-part-1/)