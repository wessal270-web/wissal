import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Association } from '../types';
import { db, auth } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query,
  collectionGroup
} from 'firebase/firestore';

interface AssociationsContextType {
  associations: Association[];
  addAssociation: (association: Association) => Promise<void>;
  updateAssociation: (association: Association) => Promise<void>;
  deleteAssociation: (id: string) => Promise<void>;
}

const AssociationsContext = createContext<AssociationsContextType | undefined>(undefined);

const sanitizeString = (val: any): string => {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object' && 'ar' in val) return String(val.ar);
  return '';
};

export const AssociationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [associations, setAssociations] = useState<Association[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Use collectionGroup to fetch associations from both root and any user subcollections
    const q = query(collectionGroup(db, 'associations'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedAssociations = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            refPath: doc.ref.path, // Store reference path to know where to update/delete
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
             console.warn("Permission denied fetching associations. Check firestore.rules.");
         } else {
             console.error("Error fetching associations:", error);
         }
    });

    return () => unsubscribe();
  }, []);

  const addAssociation = async (association: Association) => {
    if (!auth.currentUser) throw new Error("يجب تسجيل الدخول");
    const uid = auth.currentUser.uid;

    // Simple check: 1 association per president (unless admin)
    if (user && user.role !== 'admin') {
        const existing = associations.find(a => a.ownerId === uid);
        if (existing) throw new Error("لديك جمعية مسجلة بالفعل.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, refPath, ...data } = association;
    
    // Construct payload
    const payload = {
        name: data.name || '',
        category: data.category || 'youth',
        president: data.president || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        municipality: data.municipality || '',
        activityType: data.activityType || '',
        workingHours: data.workingHours || '',
        foundedYear: Number(data.foundedYear) || new Date().getFullYear(),
        logoUrl: data.logoUrl || '',
        
        socialLinks: {
          facebook: data.socialLinks?.facebook || '',
          instagram: data.socialLinks?.instagram || '',
          twitter: data.socialLinks?.twitter || ''
        },
        documents: data.documents || [],
        location: data.location || { lat: 0, lng: 0 },
        
        ownerId: String(uid), 
        createdAt: new Date().toISOString()
    };
    
    // Remove undefined values
    const safePayload = JSON.parse(JSON.stringify(payload));
    
    // Strictly write to the User's Subcollection: /users/{uid}/associations
    // This matches the firestore.rules: match /users/{userId}/associations/{docId} { allow write: if isOwner(userId); }
    try {
        await addDoc(collection(db, 'users', uid, 'associations'), safePayload);
    } catch (error: any) {
        console.error("Add association failed:", error);
        throw error;
    }
  };

  const updateAssociation = async (association: Association) => {
    let docRef;
    if (association.refPath) {
        docRef = doc(db, association.refPath);
    } else {
        if (association.ownerId) {
             docRef = doc(db, 'users', association.ownerId, 'associations', association.id);
        } else {
             docRef = doc(db, 'associations', association.id);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, refPath, ...data } = association;
    
    const payload = { ...data, updatedAt: new Date().toISOString() };
    const safePayload = JSON.parse(JSON.stringify(payload));

    await updateDoc(docRef, safePayload);
  };

  const deleteAssociation = async (id: string) => {
    const assoc = associations.find(a => a.id === id);
    if (!assoc) throw new Error("Association not found");

    if (assoc.refPath) {
        await deleteDoc(doc(db, assoc.refPath));
    } else {
        if (assoc.ownerId) {
             await deleteDoc(doc(db, 'users', assoc.ownerId, 'associations', id));
        } else {
             await deleteDoc(doc(db, 'associations', id));
        }
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