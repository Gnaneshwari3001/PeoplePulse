import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, displayName: string) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile
    await updateProfile(user, { displayName });
    
    // Create user record in database
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      role: 'employee',
      department: '',
      status: 'active'
    });
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    // Add additional scopes for better profile data
    provider.addScope('profile');
    provider.addScope('email');

    const { user } = await signInWithPopup(auth, provider);

    // Check if user exists in database, if not create record
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        role: 'employee',
        department: '',
        status: 'active',
        loginMethod: 'google'
      });
    }
  }

  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
