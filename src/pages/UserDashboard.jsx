import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "Aprovado", label: "Aprovado" },
  { value: "Reprovado", label: "Reprovado" },
  { value: "Em avaliação", label: "Em avaliação" },
];

export default function UserDashboard() {
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [res1, res2] = await Promise.all([
        api.get("/user/transactions", {
          params: {
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        }),
        api.get("/user/wallet"),
      ]);

      setTransactions(res1.data);
      setBalance(res2.data.total);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao carregar dados");
      if (err.response?.status === 401) navigate("/");
    } finally {
      setLoading(false);
    }
  }, [filters, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="p-6">
      <DashboardHeader
        title="Painel do Usuário"
        subtitle="Bem-vindo à sua área de transações"
        onLogout={handleLogout}
      />

      {/* Cabeçalho com saldo */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 shadow-md">
        <h1 className="text-2xl font-semibold text-blue-800">
          Saldo Disponível: {balance || 0} {balance === 1 ? "ponto" : "pontos"}
        </h1>
        <p className="text-sm text-blue-600 mt-1">
          (Somente transações aprovadas são contabilizadas)
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtrar Transações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleResetFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Listagem de Transações */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {error && (
          <div className="p-4 text-red-500 bg-red-50 text-center">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descrição
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valor (R$)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pontos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {new Date(t.transactionDate).toLocaleDateString(
                          "pt-BR",
                          {
                            timeZone: "UTC",
                          },
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {t.description}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {parseFloat(t.moneyValue).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {t.pointsValue.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            t.status === "Aprovado"
                              ? "bg-green-100 text-green-800"
                              : t.status === "Reprovado"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transactions.length === 0 && !loading && (
              <div className="p-6 text-center text-gray-500">
                Nenhuma transação encontrada
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
