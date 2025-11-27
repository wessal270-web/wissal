
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Association } from '../types';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  collectionGroup, 
  query,
  getDocs
} from 'firebase/firestore';

interface AssociationsContextType {
  associations: Association[];
  addAssociation: (association: Association) => Promise<void>;
  updateAssociation: (association: Association) => Promise<void>;
  deleteAssociation: (id: string) => Promise<void>;
}

const AssociationsContext = createContext<AssociationsContextType | undefined>(undefined);

// Helper to handle legacy data {ar: '...', fr: '...'} or plain strings
const sanitizeString = (val: any): string => {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object' && 'ar' in val) return String(val.ar);
  return '';
};

export const AssociationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [associations, setAssociations] = useState<Association[]>([]);

  useEffect(() => {
    // Fetch all associations from all users using a Collection Group Query
    const q = query(collectionGroup(db, 'associations'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedAssociations = snapshot.docs.map(doc => {
        const data = doc.data();
        
        return {
            id: doc.id,
            ...data,
            name: sanitizeString(data.name),
            president: sanitizeString(data.president),
            address: sanitizeString(data.address),
            municipality: sanitizeString(data.municipality),
            activityType: sanitizeString(data.activityType),
            workingHours: sanitizeString(data.workingHours),
            documents: Array.isArray(data.documents) ? data.documents.map((d: any) => ({
                ...d,
                name: sanitizeString(d.name)
            })) : []
        } as Association;
      });
      
      setAssociations(loadedAssociations);
    }, (error) => {
      if (error.code === 'permission-denied') {
         console.warn("Firestore permission denied fetching associations. Check firestore.rules.");
         setAssociations([]);
      } else {
         console.error("Error fetching associations:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const addAssociation = async (association: Association) => {
    if (!auth.currentUser) {
        console.error("User must be logged in to add an association");
        return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = association;
      
      // Add ownerId to the data to allow presidents to find their own associations later
      const associationData = {
          ...data,
          ownerId: auth.currentUser.uid
      };
      
      // Add to: users/{userId}/associations/{associationId}
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'associations'), associationData);
    } catch (error) {
      console.error("Error adding association:", error);
      throw error;
    }
  };

  const getAssociationRef = async (id: string) => {
    // Query to find the document across all subcollections
    const q = query(collectionGroup(db, 'associations'));
    const snapshot = await getDocs(q);
    const docMatch = snapshot.docs.find(d => d.id === id);
    return docMatch ? docMatch.ref : null;
  };

  const updateAssociation = async (updatedAssociation: Association) => {
    try {
      const docRef = await getAssociationRef(updatedAssociation.id);
      if (docRef) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = updatedAssociation;
        await updateDoc(docRef, data);
      } else {
        console.error("Association document not found for update");
      }
    } catch (error) {
      console.error("Error updating association:", error);
      throw error;
    }
  };

  const deleteAssociation = async (id: string) => {
    try {
      const docRef = await getAssociationRef(id);
      if (docRef) {
        await deleteDoc(docRef);
      } else {
        console.error("Association document not found for deletion");
      }
    } catch (error) {
      console.error("Error deleting association:", error);
      throw error;
    }
  };

  return (
    <AssociationsContext.Provider value={{ associations, addAssociation, updateAssociation, deleteAssociation }}>
      {children}
    </AssociationsContext.Provider>
  );
};

export const useAssociations = (): AssociationsContextType => {
  const context = useContext(AssociationsContext);
  if (context === undefined) {
    throw new Error('useAssociations must be used within an AssociationsProvider');
  }
  return context;
};
