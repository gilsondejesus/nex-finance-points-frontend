import React, { useState } from "react";
import api from "../api";

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await api.post("/admin/upload", formData);

      setUploadResult(response.data);
      if (typeof onUploadSuccess === "function") {
        onUploadSuccess();
      }
    } catch (err) {
      alert("Erro no upload: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleNewUpload = () => {
    setFile(null);
    setUploadResult(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {!uploadResult ? (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o arquivo XLSX
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept=".xlsx"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`px-4 py-2 rounded-md flex items-center justify-center
              ${loading || !file ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} 
              text-white transition-colors`}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? "Processando..." : "Enviar Planilha"}
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg ${uploadResult.errors.length > 0 ? "bg-yellow-50" : "bg-green-50"}`}
          >
            <h3
              className={`text-lg font-medium ${uploadResult.errors.length > 0 ? "text-yellow-800" : "text-green-800"}`}
            >
              {uploadResult.message}
            </h3>

            {uploadResult.errors.length > 0 && (
              <div className="mt-2 text-sm text-yellow-700">
                <p>Erros encontrados:</p>
                <ul className="list-disc pl-5 mt-1">
                  {uploadResult.errors.map((error, index) => (
                    <li key={index}>
                      Linha {error.linha}: {error.erro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleNewUpload}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Novo Upload
            </button>

            <button
              onClick={() => onUploadSuccess("report")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Ver Relatório
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
