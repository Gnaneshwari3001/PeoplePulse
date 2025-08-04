import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  reload
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '@/lib/firebase';
import { UserProfile, UserRole, Department, hasPermission, canAccessModule } from '@/types/roles';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  reloadUser: () => Promise<void>;
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

    // Send email verification
    await sendEmailVerification(user, {
      url: window.location.origin + '/dashboard', // Redirect URL after verification
      handleCodeInApp: true
    });

    // Create user record in database
    await set(ref(database, `users/${user.uid}`), {
      email: user.email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      role: 'employee',
      department: '',
      status: 'pending_verification', // Set status to pending until verified
      emailVerified: false
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

  async function sendVerificationEmail() {
    if (currentUser) {
      await sendEmailVerification(currentUser, {
        url: window.location.origin + '/dashboard',
        handleCodeInApp: true
      });
    }
  }

  async function reloadUser() {
    if (currentUser) {
      await reload(currentUser);
      // Update database record if email is now verified
      if (currentUser.emailVerified) {
        await set(ref(database, `users/${currentUser.uid}/emailVerified`), true);
        await set(ref(database, `users/${currentUser.uid}/status`), 'active');
      }
    }
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
    sendEmailVerification: sendVerificationEmail,
    reloadUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
