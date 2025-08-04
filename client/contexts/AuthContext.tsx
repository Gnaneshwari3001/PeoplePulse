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
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, role?: UserRole, department?: Department) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  reloadUser: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  hasPermission: (module: string, action: string) => boolean;
  canAccessModule: (module: string) => boolean;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, displayName: string, role: UserRole = 'employee', department: Department = 'engineering') {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Update user profile
    await updateProfile(user, { displayName });

    // Send email verification
    await sendEmailVerification(user, {
      url: window.location.origin + '/dashboard',
      handleCodeInApp: true
    });

    // Generate employee ID
    const employeeId = `EMP${Date.now().toString().slice(-6)}`;

    // Create comprehensive user profile in database
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName,
      role: role,
      department: department,
      permissions: [], // Will be populated based on role
      employeeId: employeeId,
      joinDate: new Date().toISOString(),
      status: 'pending_verification',
    };

    await set(ref(database, `users/${user.uid}`), userProfile);
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
      const employeeId = `EMP${Date.now().toString().slice(-6)}`;
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role: 'employee',
        department: 'engineering',
        permissions: [],
        employeeId: employeeId,
        joinDate: new Date().toISOString(),
        status: 'active',
        avatar: user.photoURL || undefined
      };

      await set(userRef, userProfile);
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
        await set(ref(database, `users/${currentUser.uid}/status`), 'active');
      }
      // Reload user profile
      await loadUserProfile(currentUser);
    }
  }

  async function loadUserProfile(user: User) {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserProfile(snapshot.val() as UserProfile);
      }
    }
  }

  async function updateUserProfile(updates: Partial<UserProfile>) {
    if (currentUser && userProfile) {
      const updatedProfile = { ...userProfile, ...updates };
      await set(ref(database, `users/${currentUser.uid}`), updatedProfile);
      setUserProfile(updatedProfile);
    }
  }

  const checkPermission = (module: string, action: string): boolean => {
    if (!userProfile) return false;
    return hasPermission(userProfile.role, module, action);
  };

  const checkModuleAccess = (module: string): boolean => {
    if (!userProfile) return false;
    return canAccessModule(userProfile.role, module);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
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
