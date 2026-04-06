import { SampleData, deriveType } from "../data/SampleData";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set, get) => ({
      //data
      transactions: SampleData,

      //role
      role: "viewer",
      setRole: (role) => set({ role }),

      //theme
      isDarkMode: true,
      toggleTheme: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

      //filters
      filters: {
        search: "",
        type: "all",
        dept: "all",
        currency: "all",
        sortBy: "date",
        sortOrder: "desc",
      },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({
          filters: {
            search: "",
            type: "all",
            dept: "all",
            currency: "all",
            sortBy: "date",
            sortOrder: "desc",
          },
        }),

      //CRUD (admin only)
      addTransaction: (tx) =>
        set((s) => ({
          transactions: [...s.transactions, { ...tx, id: Date.now() }],
        })),
      editTransaction: (id, updated) =>
        set((s) => ({
          transactions: s.transactions.map((tx) =>
            tx.GLID === id ? { ...tx, ...updated } : tx,
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((tx) => tx.GLID !== id),
        })),

      //Derived  helpers
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let result = [...transactions];

        if (filters.search)
          result = result.filter(
            (tx) =>
              tx.AccountName.toLowerCase().includes(
                filters.search.toLowerCase(),
              ) ||
              tx.Description.toLowerCase().includes(
                filters.search.toLowerCase(),
              ) ||
              tx.GLID.toLowerCase().includes(filters.search.toLowerCase()),
          );

        if (filters.type !== "all")
          result = result.filter(
            (tx) => deriveType(tx.AccountNumber) === filters.type,
          );

        if (filters.dept !== "all")
          result = result.filter((tx) => tx.Dept === filters.dept);

        if (filters.currency != "all")
          result = result.filter((tx) => tx.Currency === filters.currency);

        result.sort((a, b) => {
          const order = filters.sortOrder === "asc" ? 1 : -1;
          if (filters.sortBy === "amount")
            return (a.Debit + a.Credit - (b.Debit + b.Credit)) * order;
          return (a.TxnDate - b.TxnDate) * order;
        });

        return result;
      },
    }),
    { name: "financial-dashboard-UI" },
  ),
);
