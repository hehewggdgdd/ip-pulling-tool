# IP Pulling Tool - Android APK Build Guide

## Prerequisites

1. **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
2. **Java Development Kit (JDK)** - Version 11 or higher
3. **Android SDK** - API Level 34 (Android 14)

## Quick Start

### Option 1: Build Using Android Studio (Recommended)

1. **Open the Project**
   - Launch Android Studio
   - Click "Open" and select the `ip-pulling-tool` repository folder
   - Wait for Gradle to sync

2. **Build APK**
   - Go to `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Android Studio will compile and build the APK
   - APK will be saved in: `app/build/outputs/apk/debug/app-debug.apk`

3. **Install on Device/Emulator**
   - Connect your Android device via USB (or open emulator)
   - Go to `Run` → `Run 'app'`
   - Select your device and click OK
   - The app will install and launch automatically

### Option 2: Build Using Command Line

```bash
# Navigate to project directory
cd ip-pulling-tool

# Build APK
./gradlew assembleDebug

# APK location: app/build/outputs/apk/debug/app-debug.apk
```

### Option 3: Build Release APK (Signed)

For production distribution:

```bash
# Create keystore (first time only)
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias ip-pulling-tool

# Build release APK
./gradlew assembleRelease

# Sign the APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release.keystore \
  app/build/outputs/apk/release/app-release-unsigned.apk ip-pulling-tool

# Align APK
zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk \
  app/build/outputs/apk/release/app-release.apk
```

## Project Structure

```
ip-pulling-tool/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/ippullingtool/app/
│   │       │   └── MainActivity.kt          # Main Activity
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml    # UI Layout
│   │       │   ├── values/
│   │       │   │   ├── strings.xml
│   │       │   │   ├── colors.xml
│   │       │   │   └── themes.xml
│   │       │   └── mipmap/                  # App Icons
│   │       ├── assets/
│   │       │   ├── index.html               # Web App
│   │       │   ├── styles.css               # Styles
│   │       │   └── script.js                # JavaScript
│   │       └── AndroidManifest.xml          # App Manifest
│   └── build.gradle                         # App Build Config
├── build.gradle                             # Project Build Config
├── gradle.properties                        # Gradle Properties
└── settings.gradle                          # Gradle Settings
```

## Features

✅ Single IP lookup
✅ Batch IP lookup (up to 45 IPs)
✅ Get your own IP address
✅ Detailed geolocation data
✅ ISP and AS information
✅ Export to JSON & CSV
✅ Dark theme UI
✅ Responsive design
✅ IPv4 & IPv6 support

## Configuration

### Change App Name
Edit `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

### Change App Icon
Place your icon files in `app/src/main/res/mipmap-*/ic_launcher.png`

### Change Package Name
Edit `app/build.gradle`:
```gradle
defaultConfig {
    applicationId "your.package.name"
    ...
}
```

## Troubleshooting

### Build Fails
- Clean project: `./gradlew clean`
- Rebuild: `./gradlew assembleDebug`
- Check Java version: `java -version` (should be 11+)

### APK Not Installing
- Enable USB debugging on your device
- Install correct Android SDK version (API 34)
- Try on emulator first to test

### WebView Not Loading
- Ensure internet permission is set in `AndroidManifest.xml`
- Check `MainActivity.kt` WebView configuration
- Assets should be in `app/src/main/assets/`

## Publishing to Google Play

1. Sign the release APK (see Option 3 above)
2. Create a Google Play Developer account
3. Go to Google Play Console
4. Create new app
5. Upload signed APK
6. Fill in app details, screenshots, description
7. Submit for review

## Performance Tips

- Use ProGuard to minify release APKs
- Enable hardware acceleration in WebView settings
- Test on actual devices for better performance
- Optimize asset sizes (CSS, JS)

## Support

For issues or questions:
- Check [Android Developer Docs](https://developer.android.com/docs)
- Review [Gradle Documentation](https://gradle.org/guides/)
- Check IP-API documentation: [ip-api.com](https://ip-api.com)

---

**Built with ❤️ | IP Pulling Tool v1.0.0**