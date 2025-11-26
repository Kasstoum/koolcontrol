# KoolControl

React Native mobile application for controlling and managing KoolNova systems.

## 🚀 Technologies

- **Expo** ~54.0.25
- **React Native** 0.81.5
- **React** 19.1.0
- **TypeScript** 5.9.2
- **NativeWind** 4.2.1 (Tailwind CSS for React Native)
- **React Navigation** 7.x
- **Axios** for API calls

## 📋 Prerequisites

- Node.js (recommended version: 18+)
- npm or yarn
- Expo CLI
- Xcode (for iOS)
- Android Studio (for Android)
- EAS account (for builds)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Generate native iOS and Android folders (if needed)
npx expo prebuild

# For iOS, install pods
cd ios && pod install && cd ..
```

## 🏃 Development

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## 📦 Build

### iOS

```bash
# Development build (simulator)
npm run build:ios

# Preview build
npm run build:ios:preview

# Production build
npm run build:ios:production
```

## 🔧 Configuration

### EAS

The project uses EAS Build for native builds. Configuration is in `eas.json`.

### API

The application connects to the KoolNova API (`https://api.koolnova.com`). Credentials are managed through authentication in the application.

## 📁 Project Structure

```
koolcontrol/
├── src/
│   ├── api/          # API calls (auth, projects, sensors)
│   ├── auth/         # Authentication context
│   ├── components/   # Reusable components
│   └── screens/      # Application screens
├── assets/           # Images and resources
├── app.json          # Expo configuration
├── eas.json          # EAS Build configuration
└── package.json      # Dependencies and scripts
```

## 🔐 Authentication

The application uses AsyncStorage to persist authentication tokens. Tokens are automatically restored on application startup.

## 🚫 Files Excluded from Git

The following files are excluded from version control:
- `node_modules/`
- `ios/` and `android/` (generated with `expo prebuild`)
- `.expo/`
- Build and temporary files
- Local configuration files (`.env*.local`)

**Note**: The `ios/` and `android/` folders are not versioned because they can be regenerated with `expo prebuild`. If you clone the project, run `npx expo prebuild` to generate these folders.

See `.gitignore` for the complete list.

## 📄 License

Private project
