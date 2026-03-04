import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { setLoggedIn, setUser } from '@/slices/authSlice';

export const useAuth = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const login = async (username: string, password: string) => {
  try {
     const res = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ username, password }),
       credentials: 'include',
     });

     if (res.ok) {
      const data = await res.json();
       dispatch(setLoggedIn(true));
      dispatch(setUser(data.user));
       return true;
     }

     return false;
  } catch {
    return false;
  }
 };


  const logout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } finally {
        dispatch(setLoggedIn(false));
        dispatch(setUser(null));
      }
  };

  return { isLoggedIn, user, login, logout };
};
