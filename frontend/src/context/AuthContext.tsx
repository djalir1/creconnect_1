"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "STUDIO_OWNER" | "VENUE_OWNER";
  avatar?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "CLIENT" | "STUDIO_OWNER" | "VENUE_OWNER";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<User>; // Changed return type
  register: (data: RegisterData) => Promise<User>; // Changed return type
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (data: LoginData): Promise<User> => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      toast.success("Welcome back!");
      return user; // Return the user so the page can handle redirect
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<User> => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/register", data);
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success("Account created successfully!");
      return user;

    } catch (error: any) {
        toast.error(error.response?.data?.message || "Registration failed");
        throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth");
    toast.info("Logged out successfully");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}