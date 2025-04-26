'use client';

import { useAuthCheck } from '@/lib/useAuthCheck';

export default function AuthCheckWrapper({ children }: { children: React.ReactNode }) {
    useAuthCheck();
    return <>{children}</>;
}