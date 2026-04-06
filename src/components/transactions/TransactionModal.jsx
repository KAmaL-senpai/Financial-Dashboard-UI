import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { X } from "lucide-react";

const DEPTS = ["Sales", "HR", "Marketing", "Finance", "IT", "Operations"];
const CURRENCIES = ["USD", "AUD", "CAD", "GBP", "EUR", "INR"];

const empty = {
  GLID: "",
  TxnDate: "",
  AccountNumber: "",
  AccountName: "",
  Debit: 0,
  Credit: 0,
  Dept: "Sales",
  CostCenter: "",
  Description: "",
  Currency: "USD",
};

function TransactionModal({ existing, onClose }) {
  const { addTransaction, editTransaction } = useAppStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const isEdit = !!existing;

  useEffect(() => {
    if (existing) {
      const { TxnDate, ...rest } = existing;
      //convert excel serial back to date string for input
      const date = new Date((TxnDate - 25569) * 86400 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      setForm({ ...rest, TxnDate: dateStr });
    }
  }, [existing]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.GLID.trim()) e.GLID = "Required";
    if (!form.TxnDate) e.TxnDate = "Required";
    if (!form.AccountNumber.trim()) e.AccountNumber = "Required";
    if (!form.AccountName.trim()) e.AccountName = "Required";
    if (form.Debit < 0) e.Debit = "Must be ≥ 0";
    if (form.Credit < 0) e.Credit = "Must be ≥ 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Convert date string to Excel serial
    const dateSerial =
      Math.floor(new Date(form.TxnDate).getTime() / 86400000) + 25569;
    const payload = {
      ...form,
      TxnDate: dateSerial,
      Debit: parseFloat(form.Debit) || 0,
      Credit: parseFloat(form.Credit) || 0,
    };

    if (isEdit) {
      editTransaction(existing.GLID, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  const field = (label, key, type = "text", extra = {}) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400 font-medium">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 ${errors[key] ? "border-red-500" : "border-gray-700"}`}
        {...extra}
      />
      {errors[key] && (
        <span className="text-red-400 text-xs">{errors[key]}</span>
      )}
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">
            {isEdit ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          {field("GL ID", "GLID")}
          {field("Date", "TxnDate", "date")}
          {field("Account Number", "AccountNumber")}
          {field("Account Name", "AccountName")}
          {field("Description", "Description")}
          {field("Cost Center", "CostCenter")}
          {field("Debit", "Debit", "number", { min: 0, step: "0.01" })}
          {field("Credit", "Credit", "number", { min: 0, step: "0.01" })}

          {/* Dept */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">
              Department
            </label>
            <select
              value={form.Dept}
              onChange={(e) => set("Dept", e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {DEPTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">
              Currency
            </label>
            <select
              value={form.Currency}
              onChange={(e) => set("Currency", e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg px-4 py-2 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm text-black font-medium bg-emerald-500 hover:bg-emerald-400 rounded-lg px-4 py-2 transition-colors"
          >
            {isEdit ? "Save Changes" : "Add Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
