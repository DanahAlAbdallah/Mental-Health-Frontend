import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { apiRequest } from "../api/apiRequest";

// USED IN LOCAL STORAGE
const TOKEN_KEY = "token";
const USER_KEY = "user";

// SEND FROM BACKEND AFTER LOGIN OR SIGNUP
interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// READ THE SAVED USER FROM LOCALSTORAGE WHEN THE SITE OPENS
function readStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

// PROVIDE THE LOGGED IN USER, TOKEN AND AUTH ACTIONS TO THE WHOLE APP
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  // SAVE THE TOKEN AND USER IN LOCALSTORAGE AND IN STATE
  function saveSession({ token, user }: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  // REMOVE THE TOKEN AND USER FROM LOCALSTORAGE AND FROM STATE
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // UPDATE THE USER IN STATE AND LOCALSTORAGE (e.g. after editing the profile)
  const updateUser = useCallback((next: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
  }, []);

  // LOG THE USER OUT AUTOMATICALLY WHEN THE TOKEN EXPIRES
  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  // LOG IN WITH EMAIL AND PASSWORD AND SAVE THE SESSION
  async function login(email: string, password: string) {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(data);
  }

  // CREATE A NEW ACCOUNT AND SAVE THE SESSION
  async function signup(
    name: string,
    email: string,
    password: string,
    role: string,
  ) {
    const data = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
    saveSession(data);
  }

  // PREPARE THE BUNDLE OF AUTH DATA THAT ALL PAGES RECEIVE
  // REBUILD IT ONLY WHEN THE USER OR THE TOKEN CHANGES, NOT ON EVERY RENDER
  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: user !== null,
      login,
      signup,
      logout,
      updateUser
    }),
    [user, token, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// HOOK THAT LETS ANY COMPONENT READ THE AUTH DATA AND ACTIONS
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
