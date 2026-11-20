# VoltGrid EV Mobile App (React Native & Expo)

Cross-platform EV Charging App for Android and iOS, matching the Zeon mobile design language for Gujarat's EV corridor.

## Features
- **Onboarding Walkthrough Flow**: 6 guided slides matching Zeon's original onboarding layout.
- **Interactive Map**: Stations across Gujarat (Ahmedabad, Surat, Vadodara, Rajkot, Bharuch, etc.).
- **Phone Number & OTP Authentication**: Required when tapping `My EVs` or `Favourites`.
- **VoltGrid Wallet**: In-app balance, instant UPI top-ups, transaction ledger.
- **QR Code Scanner**: Central elevated red lightning button to scan chargers & start charging.
- **Filter Drawer**: Charger capacity (3.3kW to >240kW), DC/AC, connector type (CCS2, Type II, 16A), and accessibility.

## Quick Start (Development)
```bash
cd mobile
npm install
npx expo start
```
Scan the QR code with **Expo Go** on your Android or iPhone device.

## Generate Android APK
To generate a standalone `.apk` using EAS Build:
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Log in to Expo
eas login

# 3. Build standalone APK
npm run build:apk
# or
eas build -p android --profile preview
```
The resulting `.apk` can be installed on any Android phone directly.
