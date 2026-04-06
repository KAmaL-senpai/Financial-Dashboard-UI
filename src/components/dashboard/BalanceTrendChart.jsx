import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { excelToDate } from "../../data/SampleData";
import { useAppStore } from "../../store/useAppStore";


function BalanceTrendingChart() {
    const transactions = useAppStore((s) => s.transactions);

    //group of month-> sum credits and debits
    const monthly = {};
    transactions.forEach((tx) => {
        const date = excelToDate(tx.TxnDate);
        const month = date.slice(0, 7); //"2024-01"
        if (!monthly[month]) monthly[month] = { month, credits: 0, debits: 0 };
        monthly[month].credits += tx.Credit;
        monthly[month].debits += tx.Debit;
    })

    const data = Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month)).map((m) => ({
        month: m.month.slice(0, 7),
        Credits: parseFloat(m.credits.toFixed(2)),
        Debits: parseFloat(m.debits.toFixed(2)),
        Net: parseFloat((m.credits - m.debits).toFixed(2)),
    }));

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mt-5">
        <h2 className="text-gray-900 dark:text-white font-semibold mb-4">
          Balance Trend
        </h2>
        <ResponsiveContainer width={"100 %"} height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey={"month"} tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#f9fafb" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Credits"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Debits"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Net"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
}

export default BalanceTrendingChart;