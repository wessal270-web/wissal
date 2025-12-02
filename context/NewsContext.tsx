
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { NewsItem } from '../types';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  collectionGroup, 
  query,
  getDocs
} from 'firebase/firestore';

interface NewsContextType {
  news: NewsItem[];
  addNews: (item: NewsItem) => Promise<void>;
  updateNews: (item: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  getNewsById: (id: string) => NewsItem | undefined;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

// Helper to handle legacy data {ar: '...', fr: '...'} or plain strings
const sanitizeString = (val: any): string => {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object' && 'ar' in val) return String(val.ar);
  return '';
};

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Fetch news from ALL users using collectionGroup
    const q = query(collectionGroup(db, "news"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedNews = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                title: sanitizeString(data.title),
                summary: sanitizeString(data.summary)
            } as NewsItem;
        });

        // Client side sort
        loadedNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setNews(loadedNews);
    }, (error) => {
        // Handle permission errors gracefully
        if (error.code === 'permission-denied') {
             console.warn("Permission denied fetching news. Public access might not be propagated yet.");
             setNews([]);
        } else {
             console.error("Error fetching news:", error);
        }
    });
    return () => unsubscribe();
  }, []);

  const addNews = async (item: NewsItem) => {
    if (!auth.currentUser) {
        throw new Error("يجب تسجيل الدخول");
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = item;
        // Add to users/{userId}/news
        await addDoc(collection(db, 'users', auth.currentUser.uid, 'news'), data);
    } catch (error) {
        console.error("Error adding news:", error);
        throw error;
    }
  };

  // Helper to find document reference across subcollections
  const getNewsRef = async (id: string) => {
    const q = query(collectionGroup(db, 'news'));
    const snapshot = await getDocs(q);
    const docMatch = snapshot.docs.find(d => d.id === id);
    return docMatch ? docMatch.ref : null;
  };

  const updateNews = async (updatedItem: NewsItem) => {
    try {
        const docRef = await getNewsRef(updatedItem.id);
        if (docRef) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...data } = updatedItem;
            await updateDoc(docRef, data);
        } else {
            console.error("News document not found for update");
            throw new Error("News not found");
        }
    } catch (error) {
        console.error("Error updating news:", error);
        throw error;
    }
  };

  const deleteNews = async (id: string) => {
    try {
        const docRef = await getNewsRef(id);
        if (docRef) {
            await deleteDoc(docRef);
        } else {
            console.error("News document not found for deletion");
            throw new Error("News not found");
        }
    } catch (error) {
        console.error("Error deleting news:", error);
        throw error;
    }
  };

  const getNewsById = (id: string) => {
    return news.find((item) => item.id === id);
  };

  return (
    <NewsContext.Provider value={{ news, addNews, updateNews, deleteNews, getNewsById }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
