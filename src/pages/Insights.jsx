import { Calendar, TrendingDown, TrendingUp } from "lucide-react";
import { excelToDate } from "../data/SampleData";
import { useAppStore } from "../store/useAppStore";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

function Insights() {
  const transactions = useAppStore((s) => s.transactions);

  const debitByAccount = {};
  transactions.forEach((tx) => {
    if (tx.Debit > 0) {
      if (!debitByAccount[tx.AccountName]) debitByAccount[tx.AccountName] = 0;
      debitByAccount[tx.AccountName] += tx.Debit;
    }
  });
  const topAccount = Object.entries(debitByAccount).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const creditByAccount = {};
  transactions.forEach((tx) => {
    if (tx.Credit > 0) {
      if (!creditByAccount[tx.AccountName]) creditByAccount[tx.AccountName] = 0;
      creditByAccount[tx.AccountName] += tx.Credit;
    }
  });
  const topCredit = Object.entries(creditByAccount).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const monthly = {};
  transactions.forEach((tx) => {
    const month = excelToDate(tx.TxnDate).slice(0, 7);
    if (!monthly[month]) monthly[month] = { debits: 0, credits: 0 };
    monthly[month].debits += tx.Debit;
    monthly[month].credits += tx.Credit;
  });

  const monthlyData = Object.entries(monthly)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, val]) => ({
      month,
      Debits: parseFloat(val.debits.toFixed(2)),
      Credits: parseFloat(val.credits.toFixed(2)),
      Net: parseFloat((val.credits - val.debits).toFixed(2)),
    }));

  const byDept = {};
  transactions.forEach((tx) => {
    if (tx.Debit > 0) {
      if (!byDept[tx.Dept]) byDept[tx.Dept] = 0;
      byDept[tx.Dept] += tx.Debit;
    }
  });
  const deptData = Object.entries(byDept)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  const byCurrency = {};
  transactions.forEach((tx) => {
    if (!byCurrency[tx.Currency]) byCurrency[tx.Currency] = 0;
    byCurrency[tx.Currency]++;
  });
  const currencyData = Object.entries(byCurrency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const mostActive = Object.entries(monthly).sort(
    (a, b) => b[1].debits + b[1].credits - (a[1].debits + a[1].credits),
  )[0];

  const fmt = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const chartTooltipStyle = {
    contentStyle: {
      backgroundColor: "#111827",
      border: "1px solid #374151",
      borderRadius: 8,
    },
    labelStyle: { color: "#f9fafb" },
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-red-500/20 rounded-xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
            <TrendingDown size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">
              Highest Spend Account
            </span>
          </div>
          <p className="text-gray-900 dark:text-white font-bold text-lg">
            {topAccount?.[0] ?? "—"}
          </p>
          <p className="text-red-500 dark:text-red-400 text-2xl font-bold">
            {topAccount ? fmt(topAccount[1]) : "—"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-emerald-500/20 rounded-xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <TrendingUp size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">
              Highest Revenue Account
            </span>
          </div>
          <p className="text-gray-900 dark:text-white font-bold text-lg">
            {topCredit?.[0] ?? "—"}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 text-2xl font-bold">
            {topCredit ? fmt(topCredit[1]) : "—"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-blue-500/20 rounded-xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
            <Calendar size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">
              Most Active Month
            </span>
          </div>
          <p className="text-gray-900 dark:text-white font-bold text-lg">
            {mostActive?.[0] ?? "—"}
          </p>
          <p className="text-blue-500 dark:text-blue-400 text-2xl font-bold">
            {mostActive
              ? fmt(mostActive[1].debits + mostActive[1].credits)
              : "—"}
          </p>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
        <h2 className="text-gray-900 dark:text-white font-semibold mb-1">
          Monthly Comparison (Last 6 Months)
        </h2>
        <p className="text-gray-500 text-xs mb-4">
          Credits vs Debits vs Net per month
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
            <Tooltip {...chartTooltipStyle} />
            <Legend />
            <Bar dataKey="Credits" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Debits" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Net" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h2 className="text-gray-900 dark:text-white font-semibold mb-1">
            Spend by Department
          </h2>
          <p className="text-gray-500 text-xs mb-4">
            Total debits per department
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={deptData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {deptData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...chartTooltipStyle} formatter={(v) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h2 className="text-gray-900 dark:text-white font-semibold mb-1">
            Currency Distribution
          </h2>
          <p className="text-gray-500 text-xs mb-4">
            Number of entries per currency
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={currencyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                width={40}
              />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {currencyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default Insights;
