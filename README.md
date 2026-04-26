# Cactus App Workspace

This repository is the parent workspace for the Verdict mobile app.

## Repository Layout

- Verdict/: React Native application source and platform projects.
- Verdict_Release.apk: Built Android release artifact (optional local output).
- README.md: Workspace-level documentation.

## Verdict App

Verdict is a local-first mobile app that analyzes phone usage and generates a daily narrative verdict.

Primary stack:

- React Native with TypeScript
- Android native usage stats integration
- Local AI narrative generation with remote fallback support

## Prerequisites

Install the following before running the app:

- Node.js 18+
- npm 9+
- Java 17+
- Android SDK and Android Studio (for Android builds)
- Xcode and CocoaPods (for iOS builds on macOS)

## Getting Started

1. Change into the app folder:

    cd Verdict

2. Install dependencies:

    npm install

3. Start Metro:

    npm start

4. Run on Android:

    npm run android

5. Run on iOS (macOS only):

    cd ios && pod install && cd ..
    npm run ios

## Build Android APK

From the app folder:

1. cd android
2. .\gradlew assembleDebug

Output path:

- app/build/outputs/apk/debug/app-debug.apk

## Notes

- Usage access permission is required for behavior analysis features.
- Keep secrets and API keys out of source control.
- If a remote AI fallback is enabled, network permission is required.
