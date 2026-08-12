'use client';
import { create } from 'zustand';

type AuthUser = {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'admin';
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (accessToken: string, user: AuthUser) => void;
  clearSession: () => void;
  hydrate: () => void;
};

const STORAGE_KEY = 'cinemo_access_token';

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,

  setSession: (accessToken, user) => {
    localStorage.setItem(STORAGE_KEY, accessToken);
    set({ accessToken, user });
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ accessToken: null, user: null });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const accessToken = localStorage.getItem(STORAGE_KEY);
    set({ accessToken });
  },
}));
