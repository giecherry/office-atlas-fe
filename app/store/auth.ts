import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
    token: string | null;
    user: { user_id: string; email: string } | null;

    getAuthToken: () => string | null;
    isAuthenticated: () => boolean;

    setAuth: (token: string, user: { user_id: string; email: string }) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,

            getAuthToken: () => {
                if (typeof window !== 'undefined') {
                    return localStorage.getItem('auth_token');
                }
                return null;
            },

            isAuthenticated: () => {
                return !!get().getAuthToken();
            },

            setAuth: (token, user) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', token);
                    localStorage.setItem('auth_user', JSON.stringify(user));
                    window.dispatchEvent(new Event('auth-change'));
                }
                set({ token, user });
            },

            clearAuth: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                set({ token: null, user: null });
            },
        }),
        { name: 'auth-store' }
    )
);