import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengecek sesi saat ini ketika aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Mendengarkan perubahan state otentikasi (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fungsi Register (Sign Up)
  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name, // metadata yang akan memicu trigger di PostgreSQL
          },
        },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Fungsi Login (Sign In)
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Fungsi Login dengan Google
  const loginWithGoogle = async () => {
    try {
      const redirectUrl = Linking.createURL('/auth/callback');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          // Parse token from URL (Implicit Grant Flow)
          const hashMatch = result.url.match(/#access_token=([^&]+)/);
          const refreshMatch = result.url.match(/&refresh_token=([^&]+)/);
          
          if (hashMatch && refreshMatch) {
            const access_token = hashMatch[1];
            const refresh_token = refreshMatch[1];
            
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            
            if (sessionError) throw sessionError;
            return { success: true, data: sessionData };
          }
          
          // Parse PKCE code if returned instead of hash
          const codeMatch = result.url.match(/\?code=([^&]+)/);
          if (codeMatch) {
            // Not typical for implicitly grant, but handled just in case
            return { success: false, message: 'PKCE flow is currently not fully configured for URL parsing.' };
          }
        }
      }
      return { success: false, message: 'Login dibatalkan atau gagal mendapatkan sesi.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Fungsi Logout (Sign Out)
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    session,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
