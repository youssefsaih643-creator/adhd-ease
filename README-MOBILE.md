# ADHD Ease — PWA + Capacitor preparation

This is a prepared copy of the supplied static HTML project. The existing dashboard, Supabase client bundle, and current data logic have been kept. The PWA manifest, service worker cache strategy, mobile install metadata, and Capacitor project scaffold have been added/updated.

## 1) Deploy the PWA to Vercel

1. Back up the current GitHub repository first (or create a branch named `pwa-capacitor-prep`).
2. Upload the contents of this folder to the repository root, replacing the matching files.
3. Keep the `icons/` folder and all three PNG files.
4. Let Vercel deploy the commit.
5. Open `https://adhd-ease.vercel.app/install` on Android Chrome or iPhone Safari.

Android: use the install prompt if it appears, otherwise Chrome menu > Install app / Add to Home screen.
iPhone: Safari > Share > Add to Home Screen.

After deploying a new service worker, if an old version persists, close the installed app and reload the website once while online.

## 2) Prepare Android / iOS native projects

Requirements: Node.js 22 or newer. Android builds require Android Studio and its Android SDK. iOS builds require macOS and Xcode.

From this folder, open a terminal and run:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

For iOS on a Mac:

```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

After changing the web files, run `npm run cap:sync` before rebuilding the native app.

## IMPORTANT — Google sign-in needs a native callback setup before store release

The current dashboard starts Google OAuth with a redirect to the current web origin (`location.origin + location.pathname`). That is correct for the hosted website/PWA, but a native Capacitor app needs a registered app deep-link callback and a native OAuth return handler. This supplied scaffold does NOT implement that callback yet. Do not submit the native builds to either store until Google sign-in has been tested and this callback flow is implemented, or until you decide to disable Google sign-in in native builds.

Also verify the Supabase `user_data` table and Row Level Security policies in the Supabase dashboard. The front-end source cannot prove that the remote policies are correctly configured.

## What was not changed

- Existing `index.html` dashboard functionality and task data model (only PWA metadata and install links were added).
- Existing `supabase.js` bundle and Supabase project values.
- Existing Vercel rewrite for `/install`.
- Existing icon artwork.

## Package details

Capacitor is scaffolded with app id `com.adhdease.app`. Confirm this identifier is yours and available before any store submission; changing it later can complicate app updates.
