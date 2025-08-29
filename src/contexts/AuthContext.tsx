import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define the user profile type based on our database schema
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  rank?: string;
  specialization?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from our custom users table with retry logic
  const fetchUserProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);

        // If it's a row not found error and we haven't retried too many times, wait and retry
        if (error.code === 'PGRST116' && retryCount < 3) {
          console.log(`Profile not found, retrying in ${(retryCount + 1) * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
          return fetchUserProfile(userId, retryCount + 1);
        }

        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);

        setSession(session);
        setUser(session?.user ?? null);

        // Fetch user profile when authenticated
        if (session?.user) {
          try {
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // Set a default profile to allow redirection
            setProfile({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email || 'User',
              email: session.user.email || '',
              role: 'User' // Default role
            });
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // Set a default profile to allow redirection
          setProfile({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email || 'User',
            email: session.user.email || '',
            role: 'User' // Default role
          });
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name, // This will be used by our trigger function
        }
      }
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};