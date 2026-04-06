import { Sun, Moon } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { excelToDate } from "../../data/SampleData";

function Topbar({title}) {
  const { isDarkMode, toggleTheme, role, setRole } = useAppStore();
  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between pl-14 lg:pl-6 pr-6">
      <h1 className="text-gray-900 dark:text-white font-semibold text-lg">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="viewer"> Viewer</option>
          <option value="admin"> Admin</option>
        </select>

        {/* theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

export default Topbar;
