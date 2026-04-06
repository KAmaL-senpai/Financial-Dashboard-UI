import { Download } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { excelToDate } from "../../data/SampleData";

function ExportButton() {
  const { getFilteredTransactions } = useAppStore();
  const handleExport = () => {
    const transactions = getFilteredTransactions();
    const headers = [
      "GL ID",
      "Date",
      "Account Number",
      "Account Name",
      "Description",
      "Dept",
      "Cost Center",
      "Currency",
      "Debit",
      "Credit",
    ];

    const rows = transactions.map((tx) => [
      tx.GLID,
      excelToDate(tx.TxnDate),
      tx.AccountNumber,
      tx.AccountName,
      tx.Description,
      tx.Dept,
      tx.CostCenter,
      tx.Currency,
      tx.Debit,
      tx.Credit,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gl-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors"
    >
      <Download size={14} />
      Export CSV
    </button>
  );
}

export default ExportButton;
