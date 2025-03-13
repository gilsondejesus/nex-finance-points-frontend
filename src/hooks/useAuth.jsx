import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  };

  return { validateToken, getCurrentUser };
};
