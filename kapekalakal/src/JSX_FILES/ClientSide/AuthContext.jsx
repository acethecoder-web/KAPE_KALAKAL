import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Since you're using cookies, check with the backend
      const response = await fetch("http://localhost:5174/api/auth/verify", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setIsLoggedIn(true);
          setUser(data.user);
        }
      } else {
        // If verification fails, clear any stored user data
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    try {
      setIsLoggedIn(true);
      setUser(userData);

      // Store minimal user data in localStorage as backup
      localStorage.setItem("userData", JSON.stringify(userData));
      if (token && token !== "cookie-auth") {
        localStorage.setItem("authToken", token);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session/cookies
      await fetch("http://localhost:5174/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear local state
      setIsLoggedIn(false);
      setUser(null);

      // Clear any stored data
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if server call fails, clear local state
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    }
  };

  const requireAuth = (
    callback,
    redirectMessage = "Please log in to continue"
  ) => {
    if (!isLoggedIn) {
      alert(redirectMessage);
      return false;
    }
    if (callback) callback();
    return true;
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    requireAuth,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
