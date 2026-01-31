'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Dashboard from '@/components/dashboard';
import AuthModal from '@/components/auth-modal';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAuth = (email: string, password: string, isSignUp: boolean) => {
    const userName = email.split('@')[0];
    setUser({
      id: '1',
      name: userName,
      email: email,
    });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('dashboard');
    setUser(null);
  };

  if (!isAuthenticated) {
    return <AuthModal onAuth={handleAuth} />;
  }

  return (
    <div className={`flex h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Header 
          userName={user?.name || 'User'} 
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <Dashboard activeView={activeView} user={user} />
      </div>
    </div>
  );
}
