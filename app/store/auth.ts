import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
    token: string | null;
    user: { user_id: string; email: string } | null;

    getAuthToken: () => string | null;
    getRefreshToken: () => string | null;
    isAuthenticated: () => boolean;
    isDemoMode: () => boolean;

    setAuth: (token: string, user: { user_id: string; email: string }, refreshToken: string) => void;
    setDemoAuth: () => void;
    updateToken: (token: string) => void;
    clearAuth: () => void;
}

export const DEMO_USER = {
    user_id: 'demo-user',
    email: 'demo@officeatlas.local',
};

const DEMO_TOKEN = 'office-atlas-demo-token';
const DEMO_REFRESH_TOKEN = 'office-atlas-demo-refresh-token';

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

            getRefreshToken: () => {
                if (typeof window !== 'undefined') {
                    return localStorage.getItem('refresh_token');
                }
                return null;
            },

            isAuthenticated: () => {
                return !!get().getAuthToken();
            },

            isDemoMode: () => {
                return get().user?.user_id === DEMO_USER.user_id || get().getAuthToken() === DEMO_TOKEN;
            },

            setAuth: (token, user, refreshToken) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', token);
                    localStorage.setItem('refresh_token', refreshToken);
                    localStorage.setItem('auth_user', JSON.stringify(user));
                    window.dispatchEvent(new Event('auth-change'));
                }
                set({ token, user });
            },

            setDemoAuth: () => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', DEMO_TOKEN);
                    localStorage.setItem('refresh_token', DEMO_REFRESH_TOKEN);
                    localStorage.setItem('auth_user', JSON.stringify(DEMO_USER));
                    window.dispatchEvent(new Event('auth-change'));
                }
                set({ token: DEMO_TOKEN, user: DEMO_USER });
            },

            updateToken: (token) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', token);
                }
                set({ token });
            },

            clearAuth: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('auth_user');
                    window.dispatchEvent(new Event('auth-change'));
                }
                set({ token: null, user: null });
            },
        }),
        { name: 'auth-store' }
    )
);
