package com.dueldive.app;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.BridgeActivity;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends BridgeActivity {
    private static final String VERSION_URL = "https://raw.githubusercontent.com/theocwdell211209-tech/I-dunno-some-roguelike/main/android/version.json";
    private static final String APK_URL = "https://raw.githubusercontent.com/theocwdell211209-tech/I-dunno-some-roguelike/main/android/duel-dive.apk";
    private final ExecutorService updateExecutor = Executors.newSingleThreadExecutor();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        new android.os.Handler(getMainLooper()).postDelayed(this::checkForUpdate, 1200);
    }

    private void checkForUpdate() {
        updateExecutor.execute(() -> {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(VERSION_URL + "?t=" + System.currentTimeMillis()).openConnection();
                connection.setConnectTimeout(8000);
                connection.setReadTimeout(8000);
                connection.setUseCaches(false);
                JSONObject latest = new JSONObject(readAll(connection.getInputStream()));
                int latestCode = latest.getInt("versionCode");
                if (latestCode <= getPackageManager().getPackageInfo(getPackageName(), 0).versionCode) return;
                String versionName = latest.optString("versionName", "new version");
                runOnUiThread(() -> new AlertDialog.Builder(this)
                    .setTitle("Update available")
                    .setMessage("Duel Dive " + versionName + " is ready. Download and install it now?")
                    .setNegativeButton("Later", null)
                    .setPositiveButton("Update", (dialog, which) -> downloadAndInstall()))
                    .show());
            } catch (Exception ignored) {
                // Updates are optional; the game remains playable offline.
            }
        });
    }

    private void downloadAndInstall() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !getPackageManager().canRequestPackageInstalls()) {
            startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getPackageName())));
            return;
        }
        runOnUiThread(() -> android.widget.Toast.makeText(this, "Downloading update…", android.widget.Toast.LENGTH_SHORT).show());
        updateExecutor.execute(() -> {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(APK_URL + "?t=" + System.currentTimeMillis()).openConnection();
                connection.setConnectTimeout(15000);
                connection.setReadTimeout(30000);
                connection.setInstanceFollowRedirects(true);
                File apk = new File(getCacheDir(), "duel-dive-update.apk");
                try (InputStream input = connection.getInputStream(); FileOutputStream output = new FileOutputStream(apk)) {
                    byte[] buffer = new byte[8192];
                    int count;
                    while ((count = input.read(buffer)) != -1) output.write(buffer, 0, count);
                }
                Uri apkUri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", apk);
                Intent install = new Intent(Intent.ACTION_VIEW).setDataAndType(apkUri, "application/vnd.android.package-archive");
                install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(install);
            } catch (Exception error) {
                runOnUiThread(() -> android.widget.Toast.makeText(this, "Update failed. Try again later.", android.widget.Toast.LENGTH_LONG).show());
            }
        });
    }

    private static String readAll(InputStream input) throws Exception {
        StringBuilder result = new StringBuilder();
        byte[] buffer = new byte[4096];
        int count;
        while ((count = input.read(buffer)) != -1) result.append(new String(buffer, 0, count, java.nio.charset.StandardCharsets.UTF_8));
        input.close();
        return result.toString();
    }
}
