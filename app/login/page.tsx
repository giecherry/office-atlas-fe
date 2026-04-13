'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);

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

                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#041E42]"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#041E42]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-[#041E42] text-white rounded-lg py-2 text-sm font-medium hover:bg-[#0a3270] transition-colors"
                    >
                        {isSignUp ? 'Create an account' : 'Log in'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-6">
                    {isSignUp ? 'Already have an account?' : 'Create an account?'}{' '}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[#041E42] font-medium hover:underline"
                    >
                        {isSignUp ? 'Log in' : 'Create an account'}
                    </button>
                </p>
            </div>
        </div>
    );
}
