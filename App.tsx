
import React, { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './hooks/useFavorites';
import { AuthProvider } from './context/AuthContext';
import { AssociationsProvider } from './context/AssociationsContext';
import { NewsProvider } from './context/NewsContext';
import { UsersProvider } from './context/UsersContext';
import { NotificationProvider } from './context/NotificationContext';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import AssociationsListPage from './pages/AssociationsListPage';
import AssociationDetailPage from './pages/AssociationDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import BackToTopButton from './components/BackToTopButton';

function App() {
  
  // Track Total Visitors (Once per session)
  useEffect(() => {
    const countVisit = async () => {
        const hasVisited = sessionStorage.getItem('has_visited_wessal');
        if (!hasVisited) {
            try {
                const statsRef = doc(db, 'stats', 'general');
                await setDoc(statsRef, { 
                    totalVisits: increment(1) 
                }, { merge: true });
                sessionStorage.setItem('has_visited_wessal', 'true');
            } catch (error: any) {
                if (error.code !== 'permission-denied') {
                    console.error("Error updating visitor count:", error);
                }
            }
        }
    };
    countVisit();
  }, []);

  // Track Real-time Presence (Heartbeat)
  useEffect(() => {
    // Generate a session ID for this tab/window
    const sessionId = sessionStorage.getItem('wessal_session_id') || `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('wessal_session_id', sessionId);

    const presenceRef = doc(db, 'presence', sessionId);

    const updateHeartbeat = async () => {
        try {
            await setDoc(presenceRef, {
                timestamp: Date.now(), // Current client time
                lastSeen: new Date().toISOString()
            }, { merge: true });
        } catch (err) {
            // Ignore offline/permission errors for presence
        }
    };

    // Initial heartbeat
    updateHeartbeat();

    // Update every 30 seconds to keep session alive
    const interval = setInterval(updateHeartbeat, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <HashRouter>
          <UsersProvider>
            <AuthProvider>
              <AssociationsProvider>
                <NewsProvider>
                  <FavoritesProvider>
                    <NotificationProvider>
                      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 relative transition-colors duration-300">
                        <Header />
                        <main className="flex-grow container mx-auto px-4 py-8 pb-24 md:pb-8">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/associations/:category" element={<AssociationsListPage />} />
                            <Route path="/association/:id" element={<AssociationDetailPage />} />
                            <Route path="/news" element={<NewsPage />} />
                            <Route path="/news/:id" element={<NewsDetailPage />} />
                            <Route path="/favorites" element={<FavoritesPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/dashboard" element={
                              <ProtectedRoute>
                                <DashboardPage />
                              </ProtectedRoute>
                            } />
                          </Routes>
                        </main>
                        <BackToTopButton />
                        <Footer />
                        <BottomNav />
                      </div>
                    </NotificationProvider>
                  </FavoritesProvider>
                </NewsProvider>
              </AssociationsProvider>
            </AuthProvider>
          </UsersProvider>
        </HashRouter>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
