import { motion } from "framer-motion";
import BalanceTrendingChart from "../components/dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "../components/dashboard/SpendingBreakdownChart";
import SummaryCards from "../components/dashboard/SummaryCards";

function Dashboard() {
  return (
    <motion.div
      className="text-white p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceTrendingChart />
        <SpendingBreakdownChart />
      </div>
    </motion.div>
  );
}

export default Dashboard;
