"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { api } from "../api/client";
import { mockApi } from "../api/mockService";
import { useRouter } from "next/navigation";

export type DemoPersona =
  | "donor_rahul"
  | "donor_priya"
  | "hospital_apollo"
  | "hospital_manipal"
  | "ngo_redcross"
  | "public";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isMockMode: boolean;
  toggleMockMode: (enabled: boolean) => void;
  loginAsDemo: (persona: DemoPersona) => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  resetDemoData: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("public");
  const [isMockMode, setIsMockMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Read cached state
    try {
      const storedMock = localStorage.getItem("lifelink_use_mock");
      if (storedMock !== null) {
        setIsMockMode(storedMock === "true");
        api.setMockMode(storedMock === "true");
      }

      const storedUser = localStorage.getItem("lifelink_current_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setRole(parsed.role || "public");
        if (parsed.token) api.setToken(parsed.token);
      } else {
        // Default to a friendly public role initially
        setRole("public");
      }
    } catch (e) {
      console.error("Failed to load user state", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserState = (u: User | null) => {
    setUser(u);
    setRole(u ? u.role : "public");
    if (u) {
      localStorage.setItem("lifelink_current_user", JSON.stringify(u));
      if (u.token) api.setToken(u.token);
    } else {
      localStorage.removeItem("lifelink_current_user");
      api.setToken(null);
    }
  };

  const toggleMockMode = (enabled: boolean) => {
    setIsMockMode(enabled);
    api.setMockMode(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("lifelink_use_mock", enabled ? "true" : "false");
    }
  };

  const resetDemoData = () => {
    mockApi.resetAll();
    // Re-login as default donor
    loginAsDemo("donor_rahul");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const loginAsDemo = async (persona: DemoPersona) => {
    setIsLoading(true);
    try {
      let targetUser: User;

      switch (persona) {
        case "donor_rahul":
          targetUser = {
            id: "donor_1",
            user_id: "usr_donor_1",
            name: "Rahul Sharma (Universal O-)",
            email: "rahul.sharma@example.com",
            role: "donor",
            token: "jwt_mock_donor_1",
          };
          saveUserState(targetUser);
          router.push("/donor/dashboard");
          break;

        case "donor_priya":
          targetUser = {
            id: "donor_2",
            user_id: "usr_donor_2",
            name: "Priya Verma (O- Donor)",
            email: "priya.verma@example.com",
            role: "donor",
            token: "jwt_mock_donor_2",
          };
          saveUserState(targetUser);
          router.push("/donor/dashboard");
          break;

        case "hospital_apollo":
          targetUser = {
            id: "hosp_apollo_blr",
            user_id: "usr_hospital_1",
            name: "Apollo Hospital, Bannerghatta",
            email: "bloodbank@apollo.org",
            role: "hospital_admin",
            token: "jwt_mock_hospital_apollo",
          };
          saveUserState(targetUser);
          router.push("/hospital/dashboard");
          break;

        case "hospital_manipal":
          targetUser = {
            id: "hosp_manipal_blr",
            user_id: "usr_hospital_2",
            name: "Manipal Hospital, Old Airport Rd",
            email: "admin@manipal.org",
            role: "hospital_admin",
            token: "jwt_mock_hospital_manipal",
          };
          saveUserState(targetUser);
          router.push("/hospital/dashboard");
          break;

        case "ngo_redcross":
          targetUser = {
            id: "usr_ngo_1",
            user_id: "usr_ngo_1",
            name: "Indian Red Cross Society",
            email: "coordinator@redcross.org",
            role: "ngo_admin",
            token: "jwt_mock_ngo_1",
          };
          saveUserState(targetUser);
          router.push("/ngo/dashboard");
          break;

        case "public":
        default:
          saveUserState(null);
          router.push("/");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      const loggedUser: User = {
        id: res.id,
        user_id: res.id,
        email: email,
        name: res.name,
        role: res.role,
        token: res.token,
      };
      saveUserState(loggedUser);

      if (res.role === "donor") router.push("/donor/dashboard");
      else if (res.role === "hospital_admin") router.push("/hospital/dashboard");
      else if (res.role === "ngo_admin") router.push("/ngo/dashboard");
      else router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    saveUserState(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isMockMode,
        toggleMockMode,
        loginAsDemo,
        login,
        logout,
        resetDemoData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
