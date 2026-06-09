import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AdminAuthContext = createContext(null);
let logoutTimer;

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);

  const login = (jwt) => {
    const decoded = jwtDecode(jwt);

    localStorage.setItem("admin_token", jwt);
    setToken(jwt);
     axios.get(`${import.meta.env.VITE_API_URL}me/user`,{
      headers: {
        Accept : 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    }).then (response => {
      localStorage.setItem("admin_info", JSON.stringify(response.data));
      setAdmin(response.data);
    });
    //setAdmin(decoded);

    startLogoutTimer(decoded.exp);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    setToken(null);
    setAdmin(null);
    clearTimeout(logoutTimer);
  };

  const startLogoutTimer = (exp) => {
    const expiresInMs = exp * 1000 - Date.now();
    if (expiresInMs <= 0) return logout();
    logoutTimer = setTimeout(logout, expiresInMs);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    try {
      const decoded = jwtDecode(storedToken);

      if (decoded.exp * 1000 < Date.now()) return logout();

      setToken(storedToken);
      setAdmin(localStorage.getItem("admin_info") ? JSON.parse(localStorage.getItem("admin_info")) : null);
      //setAdmin(decoded);
      startLogoutTimer(decoded.exp);
    } catch {
      logout();
    }
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
