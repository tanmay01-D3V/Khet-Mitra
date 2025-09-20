
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  name: string;
  aadhaar: string;
  photo?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfilePhoto: (photo: string) => Promise<void>;
  updateUserLocation: (location: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('khet-mitra_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('khet-mitra_user');
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    const userWithDefaults = {
        ...userData,
        photo: userData.photo || '',
        location: userData.location || ''
    }
    setUser(userWithDefaults);
    localStorage.setItem('khet-mitra_user', JSON.stringify(userWithDefaults));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('khet-mitra_user');
    window.location.href = '/login';
  };

  const updateProfilePhoto = async (photo: string) => {
    if (user) {
        const updatedUser = { ...user, photo };
        setUser(updatedUser);
        localStorage.setItem('khet-mitra_user', JSON.stringify(updatedUser));
    }
  };

  const updateUserLocation = async (location: string) => {
    if (user) {
        const updatedUser = { ...user, location };
        setUser(updatedUser);
        localStorage.setItem('khet-mitra_user', JSON.stringify(updatedUser));
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfilePhoto, updateUserLocation }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
