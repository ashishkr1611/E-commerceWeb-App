
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";


type User = {
  id: string;
  username: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string; // Added city
  pinCode?: string;
  isVerified: boolean;
  role?: 'admin' | 'user';
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (user: Omit<User, "id" | "isVerified" | "role"> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
  verifyEmail: (token: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock database of users (in a real app, this would be in a backend)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "2",
    username: "admin",
    password: "admin123",
    email: "admin@homemadedelights.com",
    name: "Admin User",
    phone: "9876543210",
    address: "Bungalow No. 7, MG Road, Pune, Maharashtra",
    pinCode: "411001",
    isVerified: true,
    role: 'admin'
  }
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const userObj: User = {
            id: profile.id,
            username: profile.username || "",
            email: session.user.email || "",
            name: profile.full_name || "",
            phone: profile.phone || "",
            address: profile.address || "",
            city: profile.city || "",
            pinCode: profile.pin_code || "",
            isVerified: profile.is_verified || !!session.user.email_confirmed_at,
            role: profile.role as 'admin' | 'user'
          };
          setUser(userObj);
          localStorage.setItem("user", JSON.stringify(userObj));
        }
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Handle in login function
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const userObj: User = {
            id: profile.id,
            username: profile.username || "",
            email: data.user.email || "",
            name: profile.full_name || "",
            phone: profile.phone || "",
            address: profile.address || "",
            city: profile.city || "",
            pinCode: profile.pin_code || "",
            isVerified: profile.is_verified || !!data.user.email_confirmed_at,
            role: profile.role as 'admin' | 'user'
          };
          setUser(userObj);
          localStorage.setItem("user", JSON.stringify(userObj));
          toast({
            title: "Login Successful",
            description: `Welcome back, ${userObj.name}!`,
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, "id" | "isVerified" | "role"> & { password: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name || userData.username,
            username: userData.username,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create verification link for logging
        const verificationToken = Math.random().toString(36).substring(2, 9);
        const verificationLink = `${window.location.origin}/verify-email/${verificationToken}`;

        console.log("--- DEVELOPMENT VERIFICATION LINK ---");
        console.log(verificationLink);

        // Update profile with extra details
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username: userData.username,
            full_name: userData.name || userData.username,
            phone: userData.phone || "",
            address: userData.address || "",
            pin_code: userData.pinCode || "",
          });

        if (profileError) console.warn("Profile update error:", profileError);

        // Try to trigger verification email
        try {
          await supabase.functions.invoke("send-user-mail", {
            body: {
              email: userData.email,
              type: "verification",
              name: userData.name,
              verificationLink,
            },
          });
        } catch (mailError) {
          console.warn("Mail trigger error:", mailError);
        }

        toast({
          title: "Registration Successful",
          description: "Your account has been created! Please check your email to verify it.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const updateProfile = async (updatedUser: Partial<User>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updatedUser.name,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city,
            pin_code: updatedUser.pinCode,
            username: updatedUser.username
          })
          .eq('id', user.id);

        if (error) throw error;

        const newUser = { ...user, ...updatedUser };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
        });
      } catch (error: any) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real production app with tokens in DB, we would verify here.
      // Since we are simulating tokens but using Supabase profiles:
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_verified: true })
          .eq('id', user.id);

        if (error) throw error;

        const newUser = { ...user, isVerified: true };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));

        toast({
          title: "Email Verified",
          description: "Your email has been verified successfully!",
        });
        return true;
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Reset Email Sent",
        description: "Please check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    verifyEmail,
    resetPassword,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
