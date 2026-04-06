import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { excelToDate } from "../data/SampleData";
import {
  ArrowUpDown,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import TransactionModal from "../components/transactions/TransactionModal";
import ExportButton from "../components/ui/ExportButton";
import { motion } from "framer-motion";

const DEPTS = [
  "All",
  "Sales",
  "HR",
  "Marketing",
  "Finance",
  "IT",
  "Operations",
];
const CURRENCIES = ["All", "USD", "AUD", "CAD", "GBP", "EUR", "INR"];
const TYPES = ["all", "revenue", "expense", "asset", "liability"];

function Transactions() {
  const {
    getFilteredTransactions,
    filters,
    setFilter,
    resetFilters,
    role,
    deleteTransaction,
  } = useAppStore();
  const transactions = getFilteredTransactions();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const PER_PAGE = 20;
  const totalPages = Math.ceil(transactions.length / PER_PAGE);
  const paginated = transactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      setFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      setFilter("sortBy", field);
      setFilter("sortOrder", "desc");
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };
  const openEdit = (tx) => {
    setEditTarget(tx);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const selectClass =
    "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search GL ID, account, description..."
            value={filters.search}
            onChange={(e) => {
              setFilter("search", e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => {
            setFilter("type", e.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>

        {/* Dept */}
        <select
          value={filters.dept}
          onChange={(e) => {
            setFilter(
              "dept",
              e.target.value === "All" ? "all" : e.target.value,
            );
            setPage(1);
          }}
          className={selectClass}
        >
          {DEPTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {/* Currency */}
        <select
          value={filters.currency}
          onChange={(e) => {
            setFilter(
              "currency",
              e.target.value === "All" ? "all" : e.target.value,
            );
            setPage(1);
          }}
          className={selectClass}
        >
          {CURRENCIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            resetFilters();
            setPage(1);
          }}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <RotateCcw size={13} /> Reset
        </button>

        <ExportButton />

        {role === "admin" && (
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 text-sm text-black font-medium bg-emerald-500 hover:bg-emerald-400 rounded-lg px-3 py-2 transition-colors ml-auto"
          >
            <Plus size={14} /> Add Entry
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">GL ID</th>
                <th
                  className="text-left px-4 py-3 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => toggleSort("date")}
                >
                  <span className="flex items-center gap-1">
                    Date <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="text-left px-4 py-3">Account</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">Dept</th>
                <th className="text-left px-4 py-3">Currency</th>
                <th
                  className="text-right px-4 py-3 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  onClick={() => toggleSort("amount")}
                >
                  <span className="flex items-center justify-end gap-1">
                    Debit <ArrowUpDown size={11} />
                  </span>
                </th>
                <th className="text-right px-4 py-3">Credit</th>
                {role === "admin" && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginated.map((tx, i) => (
                  <tr
                    key={tx.GLID}
                    className={`border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/10"}`}
                  >
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">
                      {tx.GLID}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {excelToDate(tx.TxnDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900 dark:text-white font-medium">
                        {tx.AccountName}
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 text-xs">
                        {tx.AccountNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {tx.Description}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                        {tx.Dept}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                      {tx.Currency}
                    </td>
                    <td className="px-4 py-3 text-right text-red-500 dark:text-red-400 font-medium">
                      {tx.Debit > 0 ? tx.Debit.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                      {tx.Credit > 0 ? tx.Credit.toFixed(2) : "—"}
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(tx)}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.GLID)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
          <span>{transactions.length} entries found</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors text-gray-700 dark:text-gray-300"
            >
              Prev
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <TransactionModal existing={editTarget} onClose={closeModal} />
      )}
    </motion.div>
  );
}

export default Transactions;
