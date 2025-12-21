import { create } from 'zustand';

interface User {
  id: string;
  email: string | null;
  user_id: string;
}

interface LoginInput {
  user_id: string;
  password: string;
}

interface SignupInput {
  email: string;
  password: string;
  user_id: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingUserId: string | null;
  login: (credentials: LoginInput) => Promise<void>;
  signup: (credentials: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: User) => void;
  setPendingUserId: (id: string | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  pendingUserId: null,

  login: async (credentials: LoginInput) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user } = await response.json();
      localStorage.setItem('userData', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  signup: async (credentials: SignupInput) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const { user } = await response.json();
      localStorage.setItem('userData', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('userData');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  setAuth: (user: User) => {
    localStorage.setItem('userData', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  setPendingUserId: (id: string | null) => {
    if (id) {
      localStorage.setItem('pending_user_id', id);
    } else {
      localStorage.removeItem('pending_user_id');
    }
    set({ pendingUserId: id });
  },

  checkAuth: async () => {
    // 1. First run: check localStorage for faster initial UI
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userData');
      const pending = localStorage.getItem('pending_user_id');

      if (stored) {
        try {
          const user = JSON.parse(stored);
          set({ user, isAuthenticated: true, pendingUserId: pending });
        } catch (e) {
          set({ pendingUserId: pending });
        }
      } else {
        set({ pendingUserId: pending });
      }
    }

    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const { user } = await response.json();
        localStorage.setItem('userData', JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        localStorage.removeItem('userData');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Don't remove from localStorage here yet, maybe transient error
      set({ isLoading: false });
    }
  },
}));
