/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fetchUserInfo, loginMethod, registerMethod } from "@/api/auth-service";
import { LoginResponseProps, User } from "@/types/AuthProps";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<string | void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const getUserInfo = async () => {
      try {
        const user = await fetchUserInfo(token);
        setUser(user);
      } catch (error) {
        console.error("Auth fetch error:", error);
        setError("Session expired. Please log in again.");
        logout(); // clear token if 401
      } finally {
        setIsLoading(false);
      }
    };

    getUserInfo();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        accessToken,
        userId,
        userName,
        userRole,
        userEmail,
      }: LoginResponseProps = await loginMethod(email, password);

      const user = { userId, userName, userRole, userEmail };

      localStorage.setItem("accessToken", accessToken);
      setUser(user);
    } catch (err: any) {
      if (err) {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerMethod({
        firstName,
        email,
        lastName,
        password,
      });
      return result.data.message;
    } catch (err: any) {
      if (err) {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isLoading, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
