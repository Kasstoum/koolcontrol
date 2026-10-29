# Migration de KoolControl vers Vue 3 et Vite

## Contexte

KoolControl est une application privée de pilotage KoolNova. Elle permet de se connecter, de consulter le premier projet, ses capteurs et la météo locale, puis de modifier le mode, la vitesse, la température de consigne et l'état d'un capteur.

L'application est aujourd'hui écrite avec Expo et React Native, puis adaptée au navigateur avec React Native Web. Les builds iOS et Android ne sont pas utilisés. Les seules cibles retenues sont le web desktop, le web mobile et une PWA installable.

## Objectif

Remplacer la stack Expo par une application web statique, plus simple à maintenir, en conservant le parcours actuel et en ajoutant les retours d'erreur décrits dans ce document.

La migration est terminée lorsque le parcours actuel fonctionne dans la nouvelle application et que la chaîne de build native a été retirée.

## Décisions

- Utiliser Vue 3, TypeScript et Vite.
- Produire une single-page application statique, sans rendu serveur ni SEO.
- Utiliser Vue Router, Tailwind CSS 4 et `vite-plugin-pwa`.
- Appeler les API avec `fetch` via un petit client typé. Ne pas conserver Axios.
- Ne pas ajouter Pinia : l'authentification tient dans un composable et l'état du tableau de bord dans un autre.
- Conserver l'interface en anglais, comme l'application actuelle.
- Réécrire l'application dans ce dépôt. Le résultat final ne contient plus Expo, React Native, EAS ni Workbox configuré séparément.

Nuxt n'est pas retenu : l'application n'a ni pages publiques, ni besoin d'un serveur frontend.

## Périmètre fonctionnel

L'application conserve :

- la connexion avec identifiant et mot de passe ;
- la restauration de session au rechargement ;
- la déconnexion ;
- l'affichage du premier projet uniquement ;
- la météo Open-Meteo de Saint-Didier-de-Formans ;
- le changement de mode, de vitesse globale, de consigne et d'état ;
- l'actualisation manuelle ;
- l'installation PWA, l'affichage plein écran et une proposition de rechargement lors d'une nouvelle version.

Elle ne prend pas en charge :

- iOS, Android et EAS Build ;
- le choix entre plusieurs projets ;
- le rafraîchissement automatique ;
- le cache ou les modifications hors ligne ;
- les notifications push ;
- les pages publiques et le référencement ;
- un serveur proxy ou des sessions côté serveur.

## Architecture

Le routeur expose deux routes :

- `/login`, accessible sans session ;
- `/`, accessible uniquement avec un jeton.

Sans jeton, toute navigation vers `/` mène à `/login`. Avec un jeton, une navigation vers `/login` mène à `/`. Toute route inconnue suit la même règle : `/` avec un jeton, sinon `/login`. Pendant la restauration du jeton, l'application affiche un indicateur de chargement et ne montre aucun des deux écrans.

Le mode `history` est utilisé. L'hébergement statique redirige les chemins demandés vers `index.html` avec le code HTTP 200.

```text
src/
├── api/
│   ├── client.ts
│   ├── auth.ts
│   ├── projects.ts
│   ├── sensors.ts
│   └── weather.ts
├── components/
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── WeatherCard.vue
│   ├── SensorCard.vue
│   ├── Logo.vue
│   ├── ModeIcon.vue
│   ├── SpeedIndicator.vue
│   ├── ModeDialog.vue
│   ├── SpeedDialog.vue
│   ├── TemperatureDialog.vue
│   └── StatusDialog.vue
├── composables/
│   ├── useAuth.ts
│   └── useDashboard.ts
├── router/
│   └── index.ts
├── views/
│   ├── LoginView.vue
│   └── DashboardView.vue
├── assets/
├── App.vue
└── main.ts
```

`npm run dev` lance Vite. `npm run build` écrit le site dans `dist`. `npm run preview` sert cette version. `npm run test` exécute Vitest.

## Authentification

Le jeton est stocké dans `localStorage` sous la clé `koolcontrol_token`. Au démarrage, `useAuth` le restaure avant de conclure l'état de chargement. Le routeur attend cette restauration avant de choisir la redirection.

`POST /auth/v2/login/` reçoit `{ username, password }` et renvoie `{ access_token }`. Le jeton est ensuite envoyé sur toutes les requêtes KoolNova via `Authorization: Bearer <token>`.

La déconnexion supprime le jeton de la mémoire et de `localStorage`, puis affiche `/login`.

Le client transforme un échec HTTP en `ApiError`, avec son statut et son message, mais il ne manipule ni le routeur ni le stockage. `useAuth` observe les erreurs des requêtes authentifiées : un statut 401 supprime la session et ramène à `/login`. Une erreur de connexion, y compris un statut 401 renvoyé par l'endpoint de login, reste une erreur de formulaire et ne déclenche pas cette redirection.

## Données

Le client KoolNova utilise `https://api.koolnova.com` et un délai de 10 secondes. Il normalise les échecs en une erreur contenant le statut HTTP et un message.

### Chargement

À l'ouverture du tableau de bord, `useDashboard` lance en parallèle :

- la météo, sans authentification ;
- `GET /projects/?page=1&page_size=50`.

Les réponses des projets et des capteurs sont des objets `{ data: [...] }`. Seul le premier projet est utilisé. Son nom, son mode, sa date `last_sync` et l'identifiant de son topic alimentent l'en-tête et le pied de page. Les capteurs sont ensuite chargés avec `GET /topics/sensors/?project=<id>&page=1&page_size=50`. Une liste vide affiche l'état `No project available`. Un premier projet sans identifiant est traité comme un échec de chargement.

La vitesse affichée est celle du premier capteur, car sa modification s'applique à tous les capteurs. L'actualisation manuelle recommence toute cette séquence. Il n'y a pas d'intervalle de rafraîchissement.

La météo interroge Open-Meteo pour la latitude `45.97`, la longitude `4.78`, le fuseau `Europe/Paris` et le nom affiché `St-Didier-de-Formans`. Elle demande la température, la température ressentie, l'humidité, le vent, le code météo, le fait qu'il fasse jour, ainsi que les températures minimale et maximale du jour. Les correspondances entre codes météo, libellés et symboles sont reprises sans changement depuis l'implémentation actuelle.

`last_sync` est affiché relativement à l'heure locale :

- moins d'une minute : `just now` ;
- moins de 60 minutes : `1 min ago` ou `N mins ago` ;
- moins de 24 heures : `1 h ago` ou `N h ago` ;
- moins de 7 jours : `1 day ago` ou `N days ago` ;
- au-delà, la date est affichée en `en-US`, avec le jour, le mois abrégé et l'heure ;
- une date invalide est affichée telle qu'elle a été reçue.

### Modifications

Une modification déjà active ne déclenche aucun appel :

- mode `1` pour le refroidissement et `2` pour le chauffage, via `PATCH /topics/<topicId>/` ;
- vitesse `1`, `2`, `3` ou `4`, via `PATCH /topics/sensors/<firstSensorId>/` ;
- consigne, via `PATCH /topics/sensors/<sensorId>/` avec `setpoint_temperature` ;
- état `03` pour allumé et `02` pour éteint, via `PATCH /topics/sensors/<sensorId>/`.

L'interface conserve la valeur précédente pendant l'appel et ne la remplace qu'après une réponse réussie. Les libellés restent `Cooling`, `Heating`, `Low`, `Medium`, `Fast` et `Auto`.

La consigne accepte des valeurs de 15 à 30 °C, par pas de 0,5 °C. Les raccourcis sont 18, 20, 22, 24 et 26 °C.

## Interface

`LoginView` affiche le formulaire et transmet les identifiants à `useAuth`. Elle ne connaît pas le stockage du jeton.

`DashboardView` affiche les états de chargement, vide et erreur, puis compose l'en-tête, la météo, les cartes et le pied de page. Elle possède uniquement l'état d'ouverture des dialogues.

Les composants visuels reçoivent leurs données et émettent des événements. Ils n'appellent pas l'API. `useDashboard` exécute les chargements et les modifications.

La disposition responsive reste celle de l'application actuelle :

- une colonne sous 768 px ;
- deux colonnes à partir de 768 px ;
- trois colonnes à partir de 1 200 px ;
- une largeur maximale de 1 400 px pour le contenu desktop.

Les cartes affichent le nom, la présence en ligne, la température mesurée, l'écart avec la consigne, la consigne et l'état. L'écart est orange avec `↑` au-dessus de 0,5 °C, bleu avec `↓` en dessous de -0,5 °C, et vert avec `✓` entre les deux.

Le contrôle de mode n'apparaît que si le projet possède un mode et un identifiant de topic. Le contrôle de vitesse n'apparaît que si une vitesse est connue. Une consigne absente affiche `-` et n'ouvre pas son dialogue. Un état absent affiche `-` et n'ouvre pas son dialogue. Un autre état que `02` ou `03` affiche `-`, mais peut ouvrir le dialogue.

## Erreurs

Les messages suivent la langue anglaise de l'interface :

- champs vides : `Please enter username and password.` ;
- échec de connexion sans message exploitable : `Unable to connect.` ;
- échec du chargement : `Unable to load data`, avec un bouton `Retry` ;
- aucun projet : `No project available` ;
- échec météo : `Unable to load weather` ;
- échec d'une modification : `Unable to save the change`.

Si une réponse JSON contient un champ texte `detail`, ce texte remplace le message générique correspondant. Un échec météo n'empêche pas d'afficher les capteurs. Un échec des projets ou des capteurs affiche l'état d'erreur du tableau de bord.

Le message d'échec d'une modification apparaît dans le tableau de bord, sans bibliothèque de notifications. L'utilisateur peut le fermer. Il disparaît aussi dès que l'action suivante réussit. Les valeurs affichées ne changent pas lorsque l'appel échoue.

## PWA

La PWA reste installable sous le nom `KoolControl`, avec l'affichage `standalone`. Elle réutilise les icônes existantes `logo.svg`, `logo192.png` et `logo512.png`, ainsi que les couleurs `#3B82F6` du manifeste actuel.

Le service worker précache uniquement les fichiers de l'interface. Les réponses de `api.koolnova.com` et `api.open-meteo.com` ne sont pas mises en cache.

Lorsqu'une nouvelle version est prête, l'application continue d'utiliser la version ouverte et affiche une barre contenant `A new version is available` et un bouton `Reload`. Le rechargement applique alors la nouvelle version.

## Tests

Vitest couvre :

- l'ajout du jeton, le délai de 10 secondes et la normalisation d'un échec en `ApiError` ;
- la fin de session uniquement après un 401 reçu sur une requête authentifiée ;
- la restauration, l'enregistrement et la suppression du jeton ;
- l'absence d'appel lorsqu'une valeur est déjà active ;
- la conservation des valeurs après un échec et leur mise à jour après un succès ;
- l'isolation d'une erreur météo ;
- le formatage relatif de `last_sync` et les libellés des codes météo.

Les composants graphiques et les dialogues ne font pas l'objet de tests automatisés. Aucun test de bout en bout n'est ajouté.

Avant de supprimer Expo, le parcours suivant est vérifié manuellement sur desktop et mobile :

- connexion, déconnexion et restauration après rechargement ;
- chargement, actualisation et absence de projet ;
- modifications de mode, vitesse, consigne et état ;
- erreurs visibles sans changement des valeurs en cas d'échec ;
- installation PWA et proposition de rechargement.

## Migration

L'implémentation remplace l'application Expo dans le dépôt. Les types et contrats actuels servent de référence comportementale. Les fichiers de configuration et dépendances propres à Expo, React Native, NativeWind, EAS et Workbox sont supprimés uniquement lorsque les vérifications automatisées et manuelles passent.

Le déploiement utilise `npm run build` et publie `dist`, avec une redirection SPA vers `index.html`.
