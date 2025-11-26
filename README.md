# KoolControl

Application mobile React Native pour le contrôle et la gestion des systèmes KoolNova.

## 🚀 Technologies

- **Expo** ~54.0.25
- **React Native** 0.81.5
- **React** 19.1.0
- **TypeScript** 5.9.2
- **NativeWind** 4.2.1 (Tailwind CSS pour React Native)
- **React Navigation** 7.x
- **Axios** pour les appels API

## 📋 Prérequis

- Node.js (version recommandée: 18+)
- npm ou yarn
- Expo CLI
- Xcode (pour iOS)
- Android Studio (pour Android)
- Compte EAS (pour les builds)

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Générer les dossiers natifs iOS et Android (si nécessaire)
npx expo prebuild

# Pour iOS, installer les pods
cd ios && pod install && cd ..
```

## 🏃 Développement

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android

# Lancer sur le web
npm run web
```

## 📦 Build

### iOS

```bash
# Build de développement (simulateur)
npm run build:ios

# Build preview
npm run build:ios:preview

# Build production
npm run build:ios:production
```

## 🔧 Configuration

### EAS

Le projet utilise EAS Build pour les builds natifs. La configuration se trouve dans `eas.json`.

### API

L'application se connecte à l'API KoolNova (`https://api.koolnova.com`). Les credentials sont gérés via l'authentification dans l'application.

## 📁 Structure du projet

```
koolcontrol/
├── src/
│   ├── api/          # Appels API (auth, projects, sensors)
│   ├── auth/         # Contexte d'authentification
│   ├── components/   # Composants réutilisables
│   └── screens/      # Écrans de l'application
├── assets/           # Images et ressources
├── app.json          # Configuration Expo
├── eas.json          # Configuration EAS Build
└── package.json      # Dépendances et scripts
```

## 🔐 Authentification

L'application utilise AsyncStorage pour persister les tokens d'authentification. Les tokens sont automatiquement restaurés au démarrage de l'application.

## 🚫 Fichiers exclus du Git

Les fichiers suivants sont exclus du contrôle de version :
- `node_modules/`
- `ios/` et `android/` (générés avec `expo prebuild`)
- `.expo/`
- Fichiers de build et temporaires
- Fichiers de configuration locale (`.env*.local`)

**Note** : Les dossiers `ios/` et `android/` ne sont pas versionnés car ils peuvent être régénérés avec `expo prebuild`. Si vous clonez le projet, exécutez `npx expo prebuild` pour générer ces dossiers.

Voir `.gitignore` pour la liste complète.

## 📄 Licence

Private project

