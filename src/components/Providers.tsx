'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store';
import AuthInitializer from '@/components/AuthInitializer';
import Loading from '@/app/loading';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <AuthInitializer />
        {children}
      </PersistGate>
    </Provider>
  );
}