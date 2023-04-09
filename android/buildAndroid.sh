#!/bin/bash
./gradlew clean
rm android/app/build/outputs/apk/debug/app-debug.apk
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output app/src/main/assets/index.android.bundle --assets-dest app/src/main/res
./gradlew assembleDebug
