import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  pendingAction: string | null;
  setPendingAction: (action: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(localStorage.getItem('ns_pending_action'));

  useEffect(() => {
    const savedUser = localStorage.getItem('ns_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (pendingAction) {
      localStorage.setItem('ns_pending_action', pendingAction);
    } else {
      localStorage.removeItem('ns_pending_action');
    }
  }, [pendingAction]);

  const login = () => {
    const mockUser = { id: 'user_123', email: 'victim@example.com', name: 'John Doe' };
    setUser(mockUser);
    localStorage.setItem('ns_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ns_user');
    localStorage.removeItem('ns_pending_action');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      login, 
      logout, 
      pendingAction, 
      setPendingAction 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
