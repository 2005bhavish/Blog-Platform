import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';
import { RootState } from '@/store';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);

        if (session?.user) {
          dispatch(loginSuccess({
            id: session.user.id,
            name: session.user.user_metadata?.display_name || session.user.email || 'Anonymous User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url
          }));
        } else {
          dispatch(logout());
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const signUp = async (email: string, password: string, displayName?: string) => {
    dispatch(loginStart());
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName || email.split('@')[0],
          }
        }
      });

      if (error) {
        dispatch(loginFailure(error.message));
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to confirm your account.",
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      dispatch(loginFailure(errorMessage));
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: new Error(errorMessage) };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    dispatch(loginStart());
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch(loginFailure(error.message));
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      dispatch(loginFailure(errorMessage));
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: new Error(errorMessage) };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        dispatch(loginFailure(error.message));
        toast({
          title: "Google Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      dispatch(loginFailure(errorMessage));
      toast({
        title: "Google Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: new Error(errorMessage) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      return { error: new Error(error.message || 'An unexpected error occurred') };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};