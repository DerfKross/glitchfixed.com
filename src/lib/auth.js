import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUser();
  }, []);

  async function refreshUser() {
    setLoading(true);
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function getIdToken() {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString();
  }

  const value = useMemo(() => ({
    user,
    loading,
    refreshUser,
    getIdToken,
    signIn: () => signInWithRedirect(),
    signOut: () => signOut()
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
