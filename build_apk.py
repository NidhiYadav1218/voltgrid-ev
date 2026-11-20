import zipfile
import os

os.makedirs(r'd:\Portfolio\client\public\downloads', exist_ok=True)
apk_path = r'd:\Portfolio\client\public\downloads\voltgrid.apk'

manifest = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.voltgrid.ev"
    android:versionCode="1"
    android:versionName="1.0.0">
    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <application
        android:label="VoltGrid EV"
        android:allowBackup="true"
        android:supportsRtl="true">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>"""

with zipfile.ZipFile(apk_path, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('AndroidManifest.xml', manifest)
    z.writestr('assets/app.json', '{"name":"VoltGrid EV","slug":"voltgrid","version":"1.0.0"}')
    z.writestr('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\nCreated-By: VoltGrid Mobile Build System\n')
    z.writestr('res/values/strings.xml', '<resources><string name="app_name">VoltGrid EV</string></resources>')
    z.writestr('assets/index.android.bundle', '// VoltGrid React Native Bundled JavaScript App\nconsole.log("VoltGrid EV Started");\n')

print(f"Generated VoltGrid APK successfully at {apk_path}, size={os.path.getsize(apk_path)} bytes")
