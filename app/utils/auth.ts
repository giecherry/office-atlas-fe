export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token');
    }
    return null;
};

export const getAuthUser = (): { user_id: string; email: string } | null => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('auth_user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const setAuth = (token: string, user: { user_id: string; email: string }): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        window.dispatchEvent(new Event('auth-change'));
    }
};

export const clearAuth = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.dispatchEvent(new Event('auth-change'));
    }
};
