import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LoginResult, authenticate } from '../services/community';
import {
  StorageKeys,
  readJson,
  removeKey,
  writeJson,
} from '../services/storage';
import type { CommunityData, Role, Session } from '../types/community';
import { useCommunity } from './CommunityContext';

interface AuthContextValue {
  session: Session | null;
  /** Volontario (admin) o super admin: può revisionare le proposte. */
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasRole: (role: Role) => boolean;
  login: (contact: string, password: string) => Promise<LoginResult['kind']>;
  logout: () => Promise<void>;
  ready: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Una sessione salvata vale solo se l'account esiste ancora. */
function isSessionValid(session: Session, data: CommunityData): boolean {
  if (session.role === 'superadmin') {
    return session.userId === data.superAdmin.id;
  }
  return data.volunteers.some(v => v.id === session.userId);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data } = useCommunity();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!data || ready) {
      return;
    }
    readJson<Session>(StorageKeys.session).then(stored => {
      if (stored && isSessionValid(stored, data)) {
        setSession(stored);
      }
      setReady(true);
    });
  }, [data, ready]);

  const login = useCallback(
    async (contact: string, password: string) => {
      if (!data) {
        return 'invalid' as const;
      }
      const result = authenticate(data, contact, password);
      if (result.kind === 'ok') {
        setSession(result.session);
        await writeJson(StorageKeys.session, result.session);
      }
      return result.kind;
    },
    [data],
  );

  const logout = useCallback(async () => {
    setSession(null);
    await removeKey(StorageKeys.session);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const isSuperAdmin = session?.role === 'superadmin';
    const isAdmin = session?.role === 'admin' || isSuperAdmin;
    return {
      session,
      isAdmin,
      isSuperAdmin,
      hasRole: role => (role === 'admin' ? isAdmin : isSuperAdmin),
      login,
      logout,
      ready,
    };
  }, [session, login, logout, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook per ruoli e permessi (§18): usato per le guard delle schermate. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
