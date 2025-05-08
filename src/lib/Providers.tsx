'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { setToken } from '@/lib/authReducer';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      store.dispatch(setToken(savedToken));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
