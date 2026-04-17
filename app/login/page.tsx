'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login, register } from '../api/auth';
import { useAuthStore } from '../store/auth';

interface FieldErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function validateSignUp(email: string, password: string, confirmPassword: string): FieldErrors {
    const errors: FieldErrors = {};

    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(password)) {
        errors.password = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
}

function validateLogin(email: string, password: string): FieldErrors {
    const errors: FieldErrors = {};

    if (!email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Invalid email format';
    }

    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return errors;
}

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setAuth } = useAuthStore();

    const toggleMode = () => {
        setError('');
        setFieldErrors({});
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsSignUp(!isSignUp);
    };

    const handleSubmit = async (e: { preventDefault(): void }) => {
        e.preventDefault();
        setError('');

        const errors = isSignUp
            ? validateSignUp(email, password, confirmPassword)
            : validateLogin(email, password);

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        setLoading(true);

        try {
            if (isSignUp) {
                await register(email, password);
                const response = await login(email, password);
                setAuth(response.token, { user_id: response.user_id, email: response.email }, response.refreshToken);
                router.push('/');
            } else {
                const response = await login(email, password);
                setAuth(response.token, { user_id: response.user_id, email: response.email }, response.refreshToken);
                router.push('/');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#E4E9F1] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <Image src="/favicon.ico" alt="OfficeAtlas" width={40} height={40} />
                    <span className="text-2xl font-semibold text-[#041E42]">OfficeAtlas</span>
                </div>

                <h1 className="text-lg font-semibold text-[#041E42] mb-6 text-center">
                    {isSignUp ? 'Create an account' : 'Log in'}
                </h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-center">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#041E42] ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {fieldErrors.email && (
                            <p className="text-xs text-red-500 mt-0.5">{fieldErrors.email}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#041E42] ${fieldErrors.password ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {fieldErrors.password && (
                            <p className="text-xs text-red-500 mt-0.5">{fieldErrors.password}</p>
                        )}
                    </div>

                    {isSignUp && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-600" htmlFor="confirmPassword">Confirm password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#041E42] ${fieldErrors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {fieldErrors.confirmPassword && (
                                <p className="text-xs text-red-500 mt-0.5">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#041E42] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#0a3270] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Loading...' : (isSignUp ? 'Create an account' : 'Log in')}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    {isSignUp ? 'Already have an account?' : 'Are you new here?'}{' '}
                    <button
                        onClick={toggleMode}
                        className="text-[#041E42] font-medium hover:underline"
                    >
                        {isSignUp ? 'Log in' : 'Create an account'}
                    </button>
                </p>
            </div>
        </div>
    );
}
