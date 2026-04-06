import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import { useAppStore } from "./store/useAppStore";
import { useEffect } from "react";


const pageTitles = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
};

function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  // ADD THIS — puts dark class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-950`}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
