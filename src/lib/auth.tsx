import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  increment,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserProfile {
  uid: string;
  email: string | null;
  coins: number;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  deductCoins: (amount: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const newProfile = {
            email: firebaseUser.email,
            coins: 300,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, newProfile);
          setProfile({ uid: firebaseUser.uid, email: firebaseUser.email, coins: 300 });
        } else {
          const data = userSnap.data();
          setProfile({ uid: firebaseUser.uid, email: firebaseUser.email, coins: data.coins });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const deductCoins = async (amount: number): Promise<boolean> => {
    if (!user || !profile) return false;
    
    if (profile.coins < amount) return false;

    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        coins: increment(-amount),
        updatedAt: serverTimestamp()
      });
      setProfile(prev => prev ? { ...prev, coins: prev.coins - amount } : null);
      return true;
    } catch (error) {
      console.error("Coin deduction failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logOut, deductCoins }}>
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
