import { Hash, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { motion } from "framer-motion";

function SummaryCards() {
  const transactions = useAppStore((s) => s.transactions);

  const totalDebits = transactions.reduce((sum, tx) => sum + tx.Debit, 0);
  const totalCredits = transactions.reduce((sum, tx) => sum + tx.Credit, 0);
  const netBalance = totalCredits - totalDebits;
  const totalEntries = transactions.length;

  const cards = [
    {
      label: "Total Credits",
      value: totalCredits,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Debits",
      value: totalDebits,
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "borde-red-500/20",
    },
    {
      label: "Net Balance",
      value: netBalance,
      icon: Scale,
      color: netBalance >= 0 ? "text-emerald-400" : "text-red-400",
      bg: netBalance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
      border: netBalance >= 0 ? "border-emerald-500/20" : "border-red-500/20",
    },
    {
      label: "Total Entries",
      value: totalEntries,
      icon: Hash,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      isCurrency: false,
    },
  ];

  const fmt = (val, isCurrency = true) =>
    isCurrency
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(val)
      : val.toLocaleString();
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {cards.map(
        ({
          label,
          value,
          icon: Icon,
          color,
          bg,
          border,
          isCurrency = true,
        }) => (
          <div
            key={label}
            className={`rounded-xl border ${border} ${bg} bg-white dark:bg-transparent p-5 flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm font-medium">{label}</span>
              <div
                className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center`}
              >
                <Icon size={16} className={color} />
              </div>
            </div>
            <span className={`text-xl sm:text-2xl font-bold ${color}`}>
              {fmt(value, isCurrency)}
            </span>
          </div>
        ),
      )}
    </motion.div>
  );
}

export default SummaryCards;
