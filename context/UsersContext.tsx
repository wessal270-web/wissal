import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { db, auth } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface UsersContextType {
  users: User[];
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: Role) => Promise<void>;
  getUserByEmail: (email: string) => User | undefined;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Only attempt to fetch users if someone is logged in
        unsubscribeSnapshot = onSnapshot(collection(db, "users"), (snapshot) => {
          const loadedUsers = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          } as User));
          setUsers(loadedUsers);
        }, (error) => {
          // Suppress permission errors for non-admins who can't read the users list
          if (error.code !== 'permission-denied') {
            console.error("Error fetching users:", error);
          } else {
            // Permission denied -> likely a regular user, clear users list
            setUsers([]);
          }
        });
      } else {
        // Logged out
        setUsers([]);
        if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            unsubscribeSnapshot = undefined;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const addUser = (user: User) => {
    // Handled by AuthContext register
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const updateUserRole = async (id: string, role: Role) => {
    try {
      await updateDoc(doc(db, "users", id), { role });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };

  const getUserByEmail = (email: string) => {
    return users.find((user) => user.email === email);
  };

  return (
    <UsersContext.Provider value={{ users, addUser, deleteUser, updateUserRole, getUserByEmail }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};