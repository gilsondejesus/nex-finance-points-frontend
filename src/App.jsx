import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AccessDenied from "./components/AccessDenied.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { validateToken, getCurrentUser } = useAuth();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (typeof validateToken !== "function" || !validateToken(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  const user = getCurrentUser?.();

  if (!user || !allowedRoles.includes(user?.role)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirecionamento raiz */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas protegidas */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rota de acesso negado */}
        <Route path="/acesso-negado" element={<AccessDenied />} />

        {/* Rota fallback para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
