
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAh33l7dtICOfHsLQpR5Mog244b-C8Jm8s",
  authDomain: "wessal-app.firebaseapp.com",
  projectId: "wessal-app",
  storageBucket: "wessal-app.firebasestorage.app",
  messagingSenderId: "560120389402",
  appId: "1:560120389402:web:3b838b69df7a4a2bfed6a3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with specific settings to improve connectivity
// experimentalForceLongPolling helps in environments where WebSockets are blocked or unstable
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  }),
  experimentalForceLongPolling: true,
});

export const messaging = getMessaging(app);
export const storage = getStorage(app);
export default app;
