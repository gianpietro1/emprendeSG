#!/bin/bash
./gradlew clean
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/
rm -rf app/src/main/res/drawable-mdpi/*assets_*
rm -rf app/src/main/res/drawable-mdpi/node_modules*
rm -rf app/src/main/res/drawable-hdpi/node_modules*
rm -rf app/src/main/res/drawable-xhdpi/node_modules*
rm -rf app/src/main/res/drawable-xxhdpi/node_modules*
rm -rf app/src/main/res/drawable-xxxhdpi/node_modules*
rm -rf app/src/main/res/raw/*
./gradlew bundleRelease
