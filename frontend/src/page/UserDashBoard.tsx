import KanbanBoard from "../components/KanbanBoard";
import AddApplicationModal from "../components/AddApplicationModal";
import ApplicationStats from "../components/ApplicationStats";
import Nav from "../components/Nav";
import { useState, useMemo, useEffect } from "react";
import { Search, Download, Sun, Moon, Lock } from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useNavigate } from "react-router-dom";

// 🔥 Redux
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const UserDashBoard = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 🔥 Direct Redux data
  const { userData } = useSelector((state: RootState) => state.user);
  const { applications, loading, error } = useSelector(
    (state: RootState) => state.application
  );

  const filteredApplications = useMemo(() => {
    if (!searchQuery) return applications;
    const lower = searchQuery.toLowerCase();
    return applications.filter(
      app => app.company?.toLowerCase().includes(lower) || app.role?.toLowerCase().includes(lower)
    );
  }, [applications, searchQuery]);

  const handleExportCSV = () => {
    if (applications.length === 0) return alert("No applications to export");
    const headers = ["Company,Role,Status,Seniority,Location,Salary,Date Applied,Notes,JD Link"];
    
    const rows = applications.map(app => {
      const date = new Date(app.dateApplied || app.date || Date.now()).toLocaleDateString();
      const clean = (str?: string) => str ? `"${str.replace(/"/g, '""')}"` : "";
      
      return [
        clean(app.company),
        clean(app.role),
        clean(app.status),
        clean(app.seniority),
        clean(app.location),
        clean(app.salaryRange),
        clean(date),
        clean(app.notes),
        clean(app.jdLink)
      ].join(",");
    });

    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "job_applications_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    // Basic route protection: redirect if user hasn't loaded within a short grace period
    const timer = setTimeout(() => {
      if (!userData) {
        navigate("/");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [userData, navigate]);

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex justify-center items-center">
         <div className="flex flex-col items-center gap-4 text-slate-500 dark:text-slate-400">
            <Lock size={40} className="text-amber-400 animate-pulse" />
            <h2 className="text-xl font-bold">Verifying User Session...</h2>
            <p className="text-sm">Please log in to access your dashboard.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white pt-24 px-6 pb-6 transition-colors duration-300">
      
      <Nav />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Job <span className="text-amber-500 dark:text-amber-400">Dashboard</span>
        </h1>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search companies or roles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            title="Export to CSV"
          >
            <Download size={18} /> <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setOpen(true)}
            className="bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded-lg text-black font-semibold transition-colors"
          >
            + Add Application
          </button>
        </div>
      </div>

      <ApplicationStats applications={applications} />

      {/* Loading */}
      {loading && <p className="text-slate-500 dark:text-slate-400">Loading your journey...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      <KanbanBoard applications={filteredApplications} />

      {/* Modal */}
      <AddApplicationModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default UserDashBoard;