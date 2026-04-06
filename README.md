# FinLedger — Financial Dashboard UI

A clean, interactive financial dashboard built for tracking and understanding GL (General Ledger) transaction data. Built as a frontend assignment submission.

---

## ��� Tech Stack

| Tool | Purpose |
|------|---------|
| React + Vite | Frontend framework |
| Tailwind CSS v4 | Styling |
| Zustand | State management |
| Recharts | Data visualization |
| Framer Motion | Animations |
| React Router DOM | Client-side routing |
| Lucide React | Icons |

---

## ��� Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd Financial_Dashboard_UI
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Start the development server
\`\`\`bash
npm run dev
\`\`\`

### 4. Open in browser
\`\`\`
http://localhost:5173
\`\`\`

---

## ✨ Features

### ��� Dashboard Overview
- **Summary Cards** — Total Credits, Total Debits, Net Balance, Total Entries
- **Balance Trend Chart** — Line chart showing monthly Credits, Debits, and Net over time
- **Debits by Department** — Bar chart showing spending breakdown across departments

### ��� Transactions Page
- Full GL transaction table with GL ID, Date, Account, Description, Department, Currency, Debit, Credit
- **Search** — by GL ID, Account Name, or Description
- **Filters** — by Account Type, Department, and Currency
- **Sorting** — by Date or Amount (ascending/descending)
- **Pagination** — 20 entries per page
- **CSV Export** — exports current filtered view

### ��� Role-Based UI
Switch between roles using the dropdown in the top right:

| Role | Permissions |
|------|------------|
| Viewer | Read-only — can view all data, charts, and insights |
| Admin | Full access — can add, edit, and delete GL entries |

No backend required — roles are simulated on the frontend.

### ��� Insights Page
- **Highest Spend Account** — account with most total debits
- **Highest Revenue Account** — account with most total credits
- **Most Active Month** — month with highest combined activity
- **Monthly Comparison Chart** — last 6 months Credits vs Debits vs Net
- **Spend by Department** — pie chart of debit distribution
- **Currency Distribution** — horizontal bar chart of entries per currency

### ��� Dark / Light Mode
- Toggle between dark and full light theme using the sun/moon button in the topbar
- Preference is persisted via LocalStorage

### ��� Data Persistence
- All transactions, filters, and role state are persisted in LocalStorage via Zustand's `persist` middleware
- Data survives page refreshes

---

## ��� Folder Structure

\`\`\`
src/
├── components/
│   ├── dashboard/
│   │   ├── SummaryCards.jsx
│   │   ├── BalanceTrendChart.jsx
│   │   └── SpendingBreakdownChart.jsx
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── transactions/
│   │   └── TransactionModal.jsx
│   └── ui/
│       └── ExportButton.jsx
├── data/
│   └── SampleData.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   └── Insights.jsx
├── store/
│   └── useAppStore.js
├── App.jsx
└── main.jsx
\`\`\`

---

## ���️ Data Structure

The dashboard uses GL (General Ledger) entries with the following structure:

\`\`\`js
{
  GLID: "GL000001",
  TxnDate: 45417,
  AccountNumber: "4000",
  AccountName: "Sales Revenue",
  Debit: 0,
  Credit: 2505.15,
  Dept: "Sales",
  CostCenter: "CC500",
  Description: "AutoPost 0",
  Currency: "GBP"
}
\`\`\`

Account types are derived from account number ranges:
- `1000–1999` → Asset
- `2000–2999` → Liability
- `3000–3999` → Equity
- `4000–4999` → Revenue
- `5000–5999` → Expense

---

## ��� Responsive Design

- **Mobile** — sidebar hidden by default with hamburger menu toggle
- **Tablet** — 2-column card grid, stacked charts
- **Desktop** — full sidebar, 4-column cards, side-by-side charts

---

## ��� Approach

The goal was to build a clean, data-driven dashboard that feels intuitive for finance users. Key decisions:

- **Zustand over Redux** — simpler API, less boilerplate, built-in persist middleware
- **GL data structure** — kept the real-world accounting format instead of simplified mock data
- **Role simulation on frontend** — dropdown toggle switches between Viewer and Admin, with UI elements conditionally rendered based on role
- **Excel serial dates** — converted on the fly using a utility function rather than pre-processing the data
- **Dark mode via HTML class** — applied `.dark` to `<html>` element using `useEffect`, enabling Tailwind's `dark:` variants across all components

---

## ��� Assumptions

- All monetary values are treated as-is without currency conversion
- Excel serial dates are converted assuming the 1900 date system
- Role switching is for UI demonstration only — no authentication is implemented
- Data is mock/static — no backend or API integration

---

## ��� Submission

- **Repository:** `<your-github-link>`
- **Live Demo:** `<your-deployment-link>`# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
