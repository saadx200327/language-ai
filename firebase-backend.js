/*
 Language Ai Firebase bridge
 - Static Netlify-compatible browser module
 - Uses Firebase Auth + Cloud Firestore through official CDN modules
 - Keeps the app usable if Firebase is blocked, disabled, or offline
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjXE9PvF1yFt6yo091hdJQfOX4YInKklo",
  authDomain: "language-ai-dc22e.firebaseapp.com",
  projectId: "language-ai-dc22e",
  storageBucket: "language-ai-dc22e.firebasestorage.app",
  messagingSenderId: "13249769704",
  appId: "1:13249769704:web:ad853833c85fac835b995d",
  measurementId: "G-XQVQHZF63F"
};

let app, auth, db, authUser = null, ready = false;

function compactUser(user) {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    isAnonymous: !!user.isAnonymous
  };
}

function cleanName(name) {
  return String(name || "Learner").replace(/[<>]/g, "").trim().slice(0, 24) || "Learner";
}

function requireUser() {
  if (!authUser) throw new Error("auth/not-signed-in");
  return authUser;
}

function safeProgress(progress) {
  return {
    schemaVersion: 5,
    courseId: progress.courseId || "bn_en",
    activeUnitByCourse: progress.activeUnitByCourse || { bn_en: "day1", en_es: "day1" },
    activityIndexByUnit: progress.activityIndexByUnit || {},
    completed: progress.completed || {},
    xp: Math.max(0, Number(progress.xp || 0)),
    coins: Math.max(0, Number(progress.coins || 0)),
    hearts: Math.max(0, Math.min(5, Number(progress.hearts || 5))),
    streak: Math.max(0, Number(progress.streak || 0)),
    lastVisit: String(progress.lastVisit || ""),
    mistakes: Array.isArray(progress.mistakes) ? progress.mistakes.slice(-180) : [],
    mastered: Array.isArray(progress.mastered) ? progress.mastered.slice(-500) : [],
    nameSeed: Number(progress.nameSeed || 0),
    updatedAtMs: Number(progress.updatedAtMs || Date.now())
  };
}

async function saveUserShell(user, displayName = "") {
  const name = cleanName(displayName || user.displayName || (user.isAnonymous ? "Guest Learner" : "Learner"));
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName: name,
    email: user.email || "",
    isAnonymous: !!user.isAnonymous,
    lastLoginAt: serverTimestamp()
  }, { merge: true });
  return compactUser(user);
}

async function createAccount(email, password, displayName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const name = cleanName(displayName);
  await updateProfile(cred.user, { displayName: name }).catch(() => {});
  await saveUserShell(cred.user, name).catch(() => {});
  return compactUser(cred.user);
}

async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await saveUserShell(cred.user, cred.user.displayName || "Learner").catch(() => {});
  return compactUser(cred.user);
}

async function signInGuest(displayName) {
  const cred = await signInAnonymously(auth);
  const name = cleanName(displayName || "Guest Learner");
  await updateProfile(cred.user, { displayName: name }).catch(() => {});
  await saveUserShell(cred.user, name).catch(() => {});
  return compactUser(cred.user);
}

async function syncProgress(progress) {
  const user = requireUser();
  const payload = safeProgress(progress || {});
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    displayName: user.displayName || "Learner",
    email: user.email || "",
    progress: payload,
    updatedAt: serverTimestamp()
  }, { merge: true });
  return { ok: true, updatedAtMs: payload.updatedAtMs };
}

async function loadCloudProgress() {
  const user = requireUser();
  const snap = await getDoc(doc(db, "users", user.uid));
  return snap.exists() ? snap.data() : null;
}

async function syncLeaderboard(payload = {}) {
  const user = requireUser();
  const xp = Math.max(0, Number(payload.xp || 0));
  const streak = Math.max(0, Number(payload.streak || 0));
  const name = cleanName(payload.name || user.displayName || "Learner");
  await setDoc(doc(db, "leaderboard", user.uid), {
    uid: user.uid,
    name,
    xp,
    streak,
    badge: cleanName(payload.badge || "Rising"),
    courseId: payload.courseId === "en_es" ? "en_es" : "bn_en",
    updatedAt: serverTimestamp()
  }, { merge: true });
  return { ok: true };
}

async function getLeaderboard(maxRows = 25) {
  const q = query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(Math.max(5, Math.min(50, Number(maxRows || 25)))));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const x = d.data();
    return {
      uid: x.uid || d.id,
      name: cleanName(x.name || "Learner"),
      xp: Number(x.xp || 0),
      streak: Number(x.streak || 0),
      badge: cleanName(x.badge || "Rising"),
      courseId: x.courseId || "bn_en"
    };
  });
}

async function signOut() {
  await firebaseSignOut(auth);
  return { ok: true };
}

function boot() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    ready = true;
    window.LanguageAiBackend = {
      isReady: () => ready,
      currentUser: () => compactUser(authUser),
      createAccount,
      signIn,
      signInGuest,
      signOut,
      syncProgress,
      loadCloudProgress,
      syncLeaderboard,
      getLeaderboard
    };
    window.dispatchEvent(new CustomEvent("languageai:backend-ready"));
    onAuthStateChanged(auth, async user => {
      authUser = user;
      window.dispatchEvent(new CustomEvent("languageai:auth-change", { detail: { user: compactUser(user) } }));
    });
  } catch (error) {
    ready = false;
    window.LanguageAiBackend = {
      isReady: () => false,
      currentUser: () => null,
      error: String(error?.message || error)
    };
    window.dispatchEvent(new CustomEvent("languageai:backend-error", { detail: { error } }));
  }
}

boot();
