import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Acesso Negado
        </h1>
        <p className="text-gray-600 mb-6">
          Você não possui permissão para acessar esta página.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
