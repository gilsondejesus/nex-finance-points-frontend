// Alterar para:
import jwtDecode from "jwt-decode";

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
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  return { validateToken, getCurrentUser };
};
