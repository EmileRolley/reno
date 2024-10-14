# Notes de version du modèle

## À propos

### Versionage sémantique

À chaque changement du modèle, si le changement est cassant, nous publions une nouvelle version majeure (2.1.2 -> 3.0.0) pour signaler le changement cassant. Par exemple, une variable d'entrée renommée.

> MAJOR version when you make incompatible API changes

À l'inverse si c'est par exemple une amélioration substantielle du calcul, une nouvelle aide, ou juste la documentation d'une variable qui est améliorée, c'est un changement mineur (2.1.2 -> 2.1.3).

> MINOR version when you add functionality in a backward compatible manner

Si c'est une correction de bug sans incidence sur les réintégrateurs, c'est une version dite patch.

> PATCH version when you make backward compatible bug fixes

À noter, tant que nous n'avons pas atteint la version 1, le versionage sémantique est décalé vers la droite d'une décimale : passer de 0.4.1 à 0.5.0 représente un changement cassant !

### Externalisation du modèle ?

Dans un premier temps, je pense que nous devons garder le modèle et le code JS sur le même dépot, et les versions sont unifiées : on y met les changement de l'interface comme du modèle.

Dans un second temps, nous pourrons imaginer découpler les deux.

On pourra publier paquet NPM à chaque changement de version qui expose le modèle publicodes. On peut aussi inscrire dans l'URL de l'API exposée par `/api/routes.ts` le numéro de version.

Et prendre les demandes de nos réintégrateurs au fur et à mesure.

## Versions

### v0.6.0

Nous avons déplacé l'écrètement depuis la règle MaPrimeRénov' accompagnée vers la nouvelle règle "aides globales". En effet, même si l'écrêtement pouvait agir sur cette première seule (semblerait-il du fait d'une erreur de conception de l'aide sur la tranche revenus supérieurs), il prend surtout son sens sur un ensemble cumulatif d'aides, dont les aides locales.

### v0.5.0

Changement cassant : nous avons trouvé des bugs dans nos barèmes de revenu, qui sont maintenant corrigés.

- notre système de maximum, mis en place pour optimiser la génération des questions, était sujet à oubli de mise à jour (constaté), confusion. Nous l'avons enlevé.
- les seuils sont tous augmenté d'1 €, car le barème national France-Rénov semble avoir une mauvaise utilisation, ou du moins une ambiguité, du "jusqu'à". Leur "jusqu'à 24004" signifie en fait "inférieur strict à 24005".

### v0.4.1

Intégration des changements des montanst pour les aides MaPrimeRénov' par geste biomasse au 1er avril 2024. [Commit](https://github.com/betagouv/reno/commit/3f0bcffa758dae6028ee472410e6af0d057ee12f).

### v0.4.0

Nous décidons de mettre dans ce fichier les changements du modèle pour réserver la page [releases](https://github.com/betagouv/reno/releases) aux changements majeures d'interface.

#### Changement cassant

Les entrées de codes géographiques commune et région sont maintenant des chaînes de caractères, plutôt que des entiers.

Voir [ce commit](https://github.com/betagouv/reno/commit/e0a25017fb59550a7a0865166d20c048caa4d149) pour comprendre le changement et sa raison.
