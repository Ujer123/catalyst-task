'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setUser } from '@/slices/authSlice';
import { AppDispatch } from '@/lib/store';
import { User } from '@/types';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          signal: controller.signal,
        });
        
        if (res.ok) {
          const data: User = await res.json();
          dispatch(setLoggedIn(true));
          dispatch(setUser(data));
        } else {
          dispatch(setLoggedIn(false));
          dispatch(setUser(null));
        }
      } catch {
        if (!controller.signal.aborted) {
          dispatch(setLoggedIn(false));
          dispatch(setUser(null));
        }
      }
    };

    checkAuth();

    return () => controller.abort();
  }, [dispatch]);
  return null;
}
