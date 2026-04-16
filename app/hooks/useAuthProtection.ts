'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth';

export function useAuthProtection() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router, isAuthenticated]);

    return isAuthenticated();
}
