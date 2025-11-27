import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { messaging, db, auth } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface NotificationContextType {
  requestPermission: () => void;
  fcmToken: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// REPLACE THIS WITH YOUR GENERATED VAPID KEY FROM FIREBASE CONSOLE
// Project Settings -> Cloud Messaging -> Web Configuration -> Generate Key pair
const VAPID_KEY = "YOUR_VAPID_KEY_HERE"; 

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get Token
        const token = await getToken(messaging, { 
            vapidKey: VAPID_KEY 
        });
        
        if (token) {
            console.log('FCM Token:', token);
            setFcmToken(token);
            saveTokenToFirestore(token);
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
      } else {
        console.log('Unable to get permission to notify.');
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
    }
  };

  const saveTokenToFirestore = async (token: string) => {
      const user = auth.currentUser;
      if (user) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
              fcmTokens: arrayUnion(token)
          }).catch(err => console.error("Error saving FCM token to profile:", err));
      }
  };

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // You can add a toast notification library here to show a UI alert
      const title = payload.notification?.title || 'New Notification';
      const body = payload.notification?.body || '';
      
      // Simple browser alert for demonstration, or use a custom Toast component
      // alert(`${title}: ${body}`); 
      
      // Better approach: Native notification if the tab is focused but user isn't looking
      if (Notification.permission === 'granted') {
           new Notification(title, { body, icon: '/vite.svg' });
      }
    });

    return () => unsubscribe();
  }, []);

  // Automatically request permission if user logs in (Optional strategy)
  useEffect(() => {
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
             // We can optionally auto-request, or wait for user to click a button
             // requestPermission(); 
          }
      });
      return () => unsubscribeAuth();
  }, []);

  return (
    <NotificationContext.Provider value={{ requestPermission, fcmToken }}>
      {children}
      {/* Optional: Add a UI element here if you want to show a button to enable notifications globally */}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
