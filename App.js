import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { ToastProvider } from './src/components/Toast';
import { LanguageProvider } from './src/context/LanguageContext';
import { ProfileProvider } from './src/context/ProfileContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <LanguageProvider>
          <ToastProvider>
            <AppNavigator />
          </ToastProvider>
        </LanguageProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
