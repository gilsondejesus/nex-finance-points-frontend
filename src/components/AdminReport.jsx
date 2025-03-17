import React, { useState, useEffect, useCallback } from "react";
import api from "../api";

const formatNumber = (value) => {
  const numberValue = typeof value === 'string' 
    ? parseFloat(value.replace(/\./g, '').replace(',', '.')) 
    : value;
  
  return new Intl.NumberFormat("pt-BR", { 
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(numberValue);
};

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "Aprovado", label: "Aprovado" },
  { value: "Reprovado", label: "Reprovado" },
  { value: "Em avaliação", label: "Em avaliação" },
];

export default function AdminReport() {
  const [filters, setFilters] = useState({
    cpf: "",
    startDate: "",
    endDate: "",
    minPoints: "",
    maxPoints: "",
    minMoney: "",
    maxMoney: "",
    status: "",
  });

  const [reportData, setReportData] = useState({
    total: 0,
    periodo: "",
    transacoes: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        cpf: filters.cpf,
        startDate: filters.startDate,
        endDate: filters.endDate,
        minPoints: filters.minPoints,
        maxPoints: filters.maxPoints,
        minMoney: filters.minMoney,
        maxMoney: filters.maxMoney,
        status: filters.status,
      };

      const response = await api.get("/admin/report", { params });
      setReportData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleResetFilters = () => {
    setFilters({
      cpf: "",
      startDate: "",
      endDate: "",
      minPoints: "",
      maxPoints: "",
      minMoney: "",
      maxMoney: "",
      status: "",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div className="p-6">
      {/* Seção de Filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filtros do Relatório</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Campos de Filtro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={filters.cpf}
              onChange={handleFilterChange}
              placeholder="000.000.000-00"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pontos Mínimos
            </label>
            <input
              type="number"
              name="minPoints"
              value={filters.minPoints}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pontos Máximos
            </label>
            <input
              type="number"
              name="maxPoints"
              value={filters.maxPoints}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Mínimo (R$)
            </label>
            <input
              type="number"
              name="minMoney"
              value={filters.minMoney}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Máximo (R$)
            </label>
            <input
              type="number"
              name="maxMoney"
              value={filters.maxMoney}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Aplicar Filtros
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </form>
      </div>

      {/* Seção de Resultados */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Relatório - {reportData.periodo}
          </h2>
          <span className="text-gray-600">
            Total: {reportData.total} transações
          </span>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-4">⚠️ {error}</div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    CPF
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pontos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.transacoes.map((transacao, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {transacao.CPF}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {transacao.Descrição}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {transacao.Data}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatNumber(transacao.Pontos)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {transacao.Dinheiro || "R$ 0,00"}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transacao.Status === "Aprovado"
                            ? "bg-green-100 text-green-800"
                            : transacao.Status === "Reprovado"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {transacao.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reportData.transacoes.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-4">
                Nenhuma transação encontrada
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
