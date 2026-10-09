# Complete Android Studio Setup & APK Build Guide

## Step 1: Install Android Studio

### Windows
1. Go to [developer.android.com/studio](https://developer.android.com/studio)
2. Click **Download Android Studio**
3. Run the `.exe` installer
4. Follow the setup wizard:
   - Accept license agreements
   - Choose installation location (default is fine)
   - Select components to install (keep defaults)
   - Choose start menu folder
5. Click **Finish** when installation completes
6. Launch Android Studio

### macOS
1. Go to [developer.android.com/studio](https://developer.android.com/studio)
2. Download the `.dmg` file (choose Apple Silicon or Intel based on your Mac)
3. Open the `.dmg` file
4. Drag **Android Studio** to the **Applications** folder
5. Wait for copy to complete
6. Go to Applications folder and double-click **Android Studio**
7. Follow first-run setup

### Linux
```bash
# Download and extract (Ubuntu/Debian example)
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2024.1.1.12/android-studio-2024.1.1.12-linux.tar.gz
tar -xzf android-studio-2024.1.1.12-linux.tar.gz
cd android-studio/bin
./studio.sh
```

---

## Step 2: Complete Android Studio Setup

On first launch, Android Studio will ask you to:

1. **Choose your setup type**: Select **Standard** (recommended)
2. **Accept licenses**: Read and accept Android SDK licenses
3. **Download components**: Let it download:
   - Android SDK Platform 34
   - Android SDK Build-tools
   - Android Emulator
   - This may take 10-30 minutes depending on internet speed

4. **Finish setup**: Click **Finish** when complete

---

## Step 3: Install Java Development Kit (JDK)

Android Studio usually includes JDK, but if you need it separately:

### Windows/macOS/Linux
1. Android Studio → **Tools** → **SDK Manager**
2. Click **SDK Tools** tab
3. Check **Android SDK Command-line Tools** if not already selected
4. Click **Apply** → **OK**
5. Wait for download to complete

---

## Step 4: Clone or Import the IP Pulling Tool Project

### Option A: Clone from GitHub
1. Open Android Studio
2. Click **File** → **New** → **Project from Version Control**
3. Choose **Git**
4. Paste the URL:
   ```
   https://github.com/hehewggdgdd/ip-pulling-tool.git
   ```
5. Choose a folder to clone into
6. Click **Clone**
7. Wait for cloning to complete

### Option B: Download ZIP and Import
1. Go to [github.com/hehewggdgdd/ip-pulling-tool](https://github.com/hehewggdgdd/ip-pulling-tool)
2. Click **Code** (green button) → **Download ZIP**
3. Extract the ZIP file
4. Open Android Studio
5. Click **File** → **Open**
6. Select the extracted `ip-pulling-tool` folder
7. Click **Open**

---

## Step 5: Wait for Gradle Sync

After opening the project:
1. Android Studio will automatically start **Gradle sync**
2. A progress bar appears at the bottom
3. **Wait for it to complete** (this may take several minutes)
4. You should see "Gradle sync finished" message

**If sync fails:**
- Close Android Studio completely
- Delete the `.gradle` folder in the project directory
- Reopen Android Studio (it will sync again)

---

## Step 6: Switch to Android-APK Branch (Optional but Recommended)

The APK build files are on a separate branch:

1. At the bottom of Android Studio, find the **Git branch indicator**
2. Click it (shows current branch name)
3. Select **android-apk** branch
4. Click **Checkout**
5. Wait for Gradle to sync again

---

## Step 7: Build the APK

### Method 1: Using Android Studio GUI (Easiest)
1. Go to **Build** menu at the top
2. Click **Build Bundle(s) / APK(s)**
3. Select **Build APK(s)**
4. Wait for build to complete (3-10 minutes)
5. A notification appears: "Build successful"
6. Click **locate** in the notification to find your APK

### Method 2: Using Terminal/Command Line
1. Open Terminal/Command Prompt
2. Navigate to project folder:
   ```bash
   cd /path/to/ip-pulling-tool
   ```
3. Run this command:
   ```bash
   ./gradlew assembleDebug
   ```
   (On Windows, use: `gradlew.bat assembleDebug`)
4. Wait for build to finish
5. APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

---

## Step 8: Find Your APK

After successful build, the APK is located at:

**Path:** `app/build/outputs/apk/debug/app-debug.apk`

From Android Studio notification:
- Click **locate** to open folder automatically

From file explorer:
- Navigate to project folder
- Go to: `app` → `build` → `outputs` → `apk` → `debug` → `app-debug.apk`

---

## Step 9: Install on Android Device

### Option A: Install via Android Studio
1. Connect Android phone via USB cable
2. Enable USB Debugging on phone:
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   - Go back to **Settings** → **Developer Options**
   - Enable **USB Debugging**
3. In Android Studio, click **Run** (green play button)
4. Select your device
5. Click **OK**
6. App will install and launch automatically

### Option B: Install via Command Line
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Option C: Manual Install (No USB)
1. Connect to computer via USB
2. Copy `app-debug.apk` to your phone
3. Open file manager on phone
4. Navigate to the APK file
5. Tap it to install
6. Allow installation from unknown sources if prompted

### Option D: Use Android Emulator
1. In Android Studio, go to **Tools** → **Device Manager**
2. Create a new virtual device (or select existing)
3. Start the emulator
4. Click **Run** (green play button)
5. Select the emulator
6. Click **OK**

---

## Step 10: Test the App

Once installed:
1. Launch "IP Pulling Tool" from your app drawer
2. Try these features:
   - Enter an IP (e.g., `8.8.8.8`)
   - Click **Lookup**
   - Results should appear
   - Click **Get My IP** to detect your IP
   - Try batch lookup with multiple IPs

---

## Troubleshooting

### Build Fails with "Gradle Error"
```bash
# Clean and rebuild
./gradlew clean
./gradlew assembleDebug
```

### "SDK not found" Error
1. Go to **Tools** → **SDK Manager**
2. Install **API Level 34** (Android 14)
3. Install **Build-Tools 34.0.0**

### APK Installation Fails on Phone
1. Uninstall any old version: `adb uninstall com.ippullingtool.app`
2. Reconnect USB
3. Try installing again

### Gradle Sync Stuck
1. Close Android Studio
2. Delete `.gradle` folder in project directory
3. Reopen Android Studio

### "Java version too old" Error
1. Go to **File** → **Project Structure**
2. Select **SDK Location**
3. Ensure JDK is set to Java 11 or newer
4. Click **Apply** → **OK**

---

## Common Commands Reference

```bash
# Clean project
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Run tests
./gradlew test

# Check gradle version
./gradlew --version

# List all tasks
./gradlew tasks
```

---

## What to Do With Your APK

Once you have `app-debug.apk`:

1. **Test on Your Phone** - Install and use it
2. **Share with Others** - Send the APK file
3. **Upload to Google Play** - Publish to app store (requires signing)
4. **Keep for Backup** - Store in safe location
5. **Iterate** - Make changes and rebuild

---

## Next Steps

After successful build:
- Customize app name in `app/src/main/res/values/strings.xml`
- Add custom app icon in `app/src/main/res/mipmap/`
- Modify colors in `app/src/main/res/values/colors.xml`
- Update app version in `app/build.gradle`
- Build release APK for Google Play

---

## Support Resources

- [Android Studio Docs](https://developer.android.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Gradle Documentation](https://gradle.org/guides/)
- [Stack Overflow Android Tag](https://stackoverflow.com/questions/tagged/android)

---

**You're now ready to build your IP Pulling Tool APK! 🚀**

Follow the steps above and you'll have a working Android app in about 30 minutes.
