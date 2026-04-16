'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login, register } from '../api/auth';
import { useAuthStore } from '../store/auth';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setAuth } = useAuthStore();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                await register(email, password);
                const response = await login(email, password);
                setAuth(response.token, { user_id: response.user_id, email: response.email });
                router.push('/');
            } else {
                const response = await login(email, password);
                setAuth(response.token, { user_id: response.user_id, email: response.email });
                router.push('/');
            }
        } catch (err: unknown) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error.message || 'An error occurred');
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setError('');
        setEmail('');
        setPassword('');
        setIsSignUp(!isSignUp);
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            required
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#041E42]"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#041E42]"
                        />
                    </div>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
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
