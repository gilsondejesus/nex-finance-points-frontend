import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import AdminReport from "../components/AdminReport";
import DashboardHeader from "../components/DashboardHeader";

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-b-2 border-blue-500 text-blue-600"
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");
  const [reportVersion, setReportVersion] = useState(0);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const handleUploadSuccess = useCallback(() => {
    setActiveTab("report");
    setReportVersion((prev) => prev + 1);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardHeader title="Painel Administrativo" onLogout={handleLogout} />

      <nav className="mb-6 border-b border-gray-200">
        <div className="flex gap-2">
          <TabButton
            active={activeTab === "upload"}
            onClick={() => setActiveTab("upload")}
          >
            Upload de Arquivo
          </TabButton>
          <TabButton
            active={activeTab === "report"}
            onClick={() => setActiveTab("report")}
          >
            Relatório
          </TabButton>
        </div>
      </nav>

      <main>
        {activeTab === "upload" ? (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <AdminReport key={reportVersion} />
        )}
      </main>
    </div>
  );
}
