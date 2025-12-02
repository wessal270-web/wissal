
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Role } from '../types';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, pass: string, role: Role) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
          } else {
            // Fallback if profile doesn't exist yet (or just registered)
            setUser({ 
              id: firebaseUser.uid, 
              email: firebaseUser.email || '', 
              name: firebaseUser.displayName || 'User', 
              role: 'user' 
            });
          }
        } catch (error: any) {
          if (error.code !== 'permission-denied') {
             console.error("Error fetching user profile:", error);
          }
          // Set basic user info to allow app access even if Firestore fetch fails
          setUser({ 
              id: firebaseUser.uid, 
              email: firebaseUser.email || '', 
              name: 'User', 
              role: 'user' 
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    navigate('/dashboard');
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/login');
  };

  const register = async (name: string, email: string, pass: string, role: Role) => {
    // 1. Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    
    const userData: User = { 
      id: firebaseUser.uid, 
      name, 
      email, 
      role 
    };

    // 2. Add User to Firestore 'users' collection
    // This relies on the security rule: match /users/{userId} { allow write: if isOwner(userId); }
    try {
        await setDoc(doc(db, "users", firebaseUser.uid), userData);
        
        // 3. Update local state immediately so UI reflects role without waiting for network fetch
        setUser(userData);
        
        navigate('/dashboard');
    } catch (error) {
        console.error("Error creating user profile in Firestore:", error);
        // Even if Firestore fails, we set the user locally so they can try again or use basic features
        setUser(userData); 
        navigate('/dashboard');
    }
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!auth.currentUser || !user) throw new Error("No user logged in");
    
    // Re-authenticate user to ensure security session is fresh
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(auth.currentUser, credential);
    
    // Update password
    await updatePassword(auth.currentUser, newPass);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, changePassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
