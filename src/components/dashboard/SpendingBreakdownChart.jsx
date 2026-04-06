import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAppStore } from "../../store/useAppStore";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

function SpendingBreakdownChart() {
  const transactions = useAppStore((s) => s.transactions);

  //group debits by Department
  const byDept = {};
  transactions.forEach((tx) => {
    if (tx.Debit > 0) {
      if (!byDept[tx.Dept]) byDept[tx.Dept] = 0;
      byDept[tx.Dept] += tx.Debit;
    }
  });
  const data = Object.entries(byDept)
    .map(([dept, total]) => ({ dept, Total: parseFloat(total.toFixed(2)) }))
    .sort((a, b) => b.Total - a.Total);
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mt-5">
      <h2 className="text-gray-900 dark:text-white font-semibold mb-4">
        Debits by Department
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="dept" tick={{ fill: "#6b7280", fontSize: 11 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #374151",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#f9fafb" }}
          />
          <Bar dataKey="Total" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingBreakdownChart;
