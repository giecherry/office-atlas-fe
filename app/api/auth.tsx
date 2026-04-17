const BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

export interface AuthResponse {
    user_id: string;
    email: string;
    token: string;
    refreshToken: string;
}

async function parseErrorResponse(res: Response): Promise<string> {
    try {
        const error = await res.json();
        if (error.errors && Array.isArray(error.errors)) {
            return error.errors[0]?.msg || 'Validation error';
        }
        return error.error || error.msg || 'An error occurred';
    } catch (e) {
        return 'An unexpected error occurred';
    }
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    try {
        const res = await fetch(`${BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            if (res.status === 429) {
                const error = await res.json();
                throw new Error(error.error);
            }
            throw new Error('Invalid email or password');
        }

        return res.json();
    } catch (error) {
        throw error instanceof Error ? error : new Error('Login failed');
    }
}

export async function refreshAccessToken(refreshToken: string): Promise<{ token: string }> {
    const res = await fetch(`${BASE}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        throw new Error('Session expired, please log in again');
    }

    return res.json();
}

export async function register(email: string, password: string): Promise<{ message: string }> {
    try {
        const res = await fetch(`${BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const errorMessage = await parseErrorResponse(res);
            throw new Error(errorMessage);
        }

        return res.json();
    } catch (error) {
        throw error instanceof Error ? error : new Error('Registration failed');
    }
}
