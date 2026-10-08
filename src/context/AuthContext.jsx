/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/firebase';

const AuthContext = createContext(null);

// Session inactivity configuration (60 minutes of inactivity)
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;
const LAST_ACTIVE_KEY = 'crimenova_last_active';
const REMEMBER_ME_KEY = 'crimenova_remember_me';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function formatAuthError(error) {
  if (!error) return '';
  const code = error.code || '';

  switch (code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Google sign-in popup request was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in Firebase Console. Please verify under Authentication > Sign-in method.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access temporarily disabled. Please reset password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/requires-recent-login':
      return 'This operation is sensitive and requires a recent login. Please re-authenticate.';
    default:
      if (!isFirebaseConfigured) {
        return 'Firebase credentials not configured yet. Please update the .env file with your Firebase API keys.';
      }
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionNotice, setSessionNotice] = useState(null);
  const lastActiveThrottleRef = useRef(0);

  // Clear session notice
  const clearSessionNotice = useCallback(() => {
    setSessionNotice(null);
  }, []);

  // Check if session has expired due to inactivity
  const isSessionExpired = useCallback(() => {
    const lastActiveStr = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!lastActiveStr) return false;
    const lastActive = parseInt(lastActiveStr, 10);
    if (Number.isNaN(lastActive)) return false;
    return Date.now() - lastActive > INACTIVITY_TIMEOUT_MS;
  }, []);

  // Update last active timestamp (throttled to at most once per 10 seconds)
  const recordActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastActiveThrottleRef.current > 10000) {
      lastActiveThrottleRef.current = now;
      localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
    }
  }, []);

  // Graceful logout
  const logout = useCallback(async (reason = null) => {
    try {
      localStorage.removeItem(LAST_ACTIVE_KEY);
      if (reason) {
        setSessionNotice(reason);
      }
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  // Inactivity watchdog and activity event listeners
  useEffect(() => {
    if (!currentUser) return;

    const handleUserInteraction = () => {
      recordActivity();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    // Check every 15s for session expiration
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        console.warn('[Session] Inactivity limit reached. Terminating session.');
        logout('Your session has expired due to inactivity. Please sign in again.');
      }
    }, 15000);

    // Check when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (isSessionExpired()) {
          console.warn('[Session] Session expired while tab was inactive.');
          logout('Your session has expired due to inactivity. Please sign in again.');
        } else {
          recordActivity();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserInteraction);
      });
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, recordActivity, isSessionExpired, logout]);

  // Auth state & token listeners
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          if (isSessionExpired()) {
            console.warn('[Session] Session expired while app was closed/inactive.');
            logout('Your session has expired due to inactivity. Please sign in again.');
          } else {
            recordActivity();
            setCurrentUser(user);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firebase onAuthStateChanged error:', error);
        setLoading(false);
      }
    );

    const unsubscribeToken = onIdTokenChanged(auth, (user) => {
      if (user && !isSessionExpired()) {
        setCurrentUser(user);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, [isSessionExpired, logout, recordActivity]);

  const configurePersistence = async (rememberMe) => {
    try {
      localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
    } catch (err) {
      console.warn('Could not set persistence mode:', err);
    }
  };

  const signup = async (email, password, displayName, rememberMe = true) => {
    await configurePersistence(rememberMe);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && userCredential.user) {
      try {
        await updateProfile(userCredential.user, { displayName });
        setCurrentUser({ ...userCredential.user, displayName });
      } catch (err) {
        console.warn('Failed to set displayName:', err);
      }
    }
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
    lastActiveThrottleRef.current = now;
    setSessionNotice(null);
    return userCredential;
  };

  const login = async (email, password, rememberMe = true) => {
    await configurePersistence(rememberMe);
    const result = await signInWithEmailAndPassword(auth, email, password);
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
    lastActiveThrottleRef.current = now;
    setSessionNotice(null);
    return result;
  };

  const loginWithGoogle = async (rememberMe = true) => {
    await configurePersistence(rememberMe);
    const result = await signInWithPopup(auth, googleProvider);
    const now = Date.now();
    localStorage.setItem(LAST_ACTIVE_KEY, now.toString());
    lastActiveThrottleRef.current = now;
    setSessionNotice(null);
    return result;
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Determine user role and admin authorization
  const isAdmin = Boolean(
    currentUser && (
      currentUser.email?.toLowerCase().includes('admin') ||
      currentUser.email?.toLowerCase() === 'admin@crimenova.org'
    )
  );

  const value = {
    currentUser,
    userLoggedIn: Boolean(currentUser),
    isAdmin,
    loading,
    sessionNotice,
    clearSessionNotice,
    isFirebaseConfigured,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    formatAuthError,
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary, #0b0f19)',
          color: 'var(--text-primary, #f8fafc)',
          gap: '16px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: '#94a3b8', letterSpacing: '0.5px' }}>
          Initializing Crimenova...
        </span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
