# Language Ai — V5 Firebase Course

Static, mobile-first, Netlify-ready language-learning app with Firebase-ready auth, synced progress, and public leaderboard.

## Files
- `index.html`
- `styles.css`
- `app.js`
- `firebase-backend.js`
- `manifest.webmanifest`
- `sw.js`
- `FIRESTORE_RULES.txt`

## What changed from V4
- Added Firebase browser module using the provided Firebase web config.
- Added email/password account creation and sign-in UI.
- Added Firebase anonymous guest login with phone-only fallback.
- Added Firestore cloud progress sync at `/users/{uid}`.
- Added public Firestore leaderboard at `/leaderboard/{uid}`.
- Kept all V4 functionality: 60-day English-through-Bangla course, 60-day Spanish-through-English course, games, boss levels, vocabulary bank, sentence bank, pronunciation lab, glass mobile UI, randomized example names, localStorage migration, and offline cache.

## Firebase Console setup
1. Open Firebase Console for project `language-ai-dc22e`.
2. Go to Authentication > Sign-in method.
3. Enable Email/Password.
4. Enable Anonymous sign-in if you want Cloud Guest mode.
5. Go to Firestore Database and create a database if one does not exist.
6. Paste the contents of `FIRESTORE_RULES.txt` into Firestore Rules and publish.
7. Deploy the unzipped folder to Netlify.

## Data model
- `users/{uid}` stores private synced progress for that signed-in learner.
- `leaderboard/{uid}` stores public leaderboard fields only: name, XP, streak, badge, and course.

## Netlify deploy
Upload the whole unzipped folder to Netlify Drop.

## QA checklist
- Open app on Netlify.
- Create an email/password Firebase account.
- Try Cloud Guest mode.
- Finish a few lesson cards and refresh.
- Confirm progress remains after refresh.
- Open Leaderboard and confirm your XP appears after Firestore rules are active.
- Sign out from Settings and sign back in.
- Test phone-only fallback by using “Use This Phone Only.”
- Try speaker buttons; browser voice support varies by device.

## Notes
The Firebase web API key identifies the Firebase project/app. Real access control comes from Firebase Auth, Firestore Security Rules, and App Check/rate limiting if you add it later.
