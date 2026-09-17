import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  FileBarChart,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  RefreshCw,
  Search,
  Truck,
  Users,
  X,
} from "lucide-react";
import Login from "../components/Login";
import { api } from "../services/api";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Reports from "./Reports";
import StockForm from "./StockForm";
import Suppliers from "./Suppliers";
import Transactions from "./Transactions";
import UsersPage from "./UsersPage";

const navigation = [
  ["Dashboard", LayoutDashboard],
  ["Inventory", Package],
  ["Stock IN", ArrowDownToLine],
  ["Stock OUT", ArrowUpFromLine],
  ["Transactions", History],
  ["Suppliers", Truck],
  ["Reports", FileBarChart],
  ["Users", Users],
];

function readStoredUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

export default function App() {
  const [user, setUser] = useState(readStoredUser);
  const [page, setPage] = useState("Dashboard");
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [report, setReport] = useState([]);
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    if (!user) return;

    setRefreshing(true);
    try {
      const [dashboard, connectors, stock, supplierData] = await Promise.all([
        api("/dashboard"),
        api("/connectors"),
        api("/stock"),
        api("/suppliers"),
      ]);

      setData(dashboard);
      setItems(connectors);
      setTransactions(stock);
      setSuppliers(supplierData);

      if (user.role === "admin") {
        setUsers(await api("/users"));
      }

      setReport(await api("/reports/summary?days=14"));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [user]);

  useEffect(() => {
    function handleExpiredSession() {
      setUser(null);
    }

    window.addEventListener("auth:expired", handleExpiredSession);
    return () => window.removeEventListener("auth:expired", handleExpiredSession);
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <div className="app">
      <aside className={mobileMenuOpen ? "open" : ""}>
        <div className="logo">
          <Boxes />
          <span>
            SHUKLA
            <br />
            <small>INVENTORY</small>
          </span>
          <button className="close" onClick={() => setMobileMenuOpen(false)}>
            <X />
          </button>
        </div>

        {navigation.map(([name, Icon]) => (
          <button
            className={page === name ? "nav active" : "nav"}
            onClick={() => {
              setPage(name);
              setMobileMenuOpen(false);
            }}
            key={name}
          >
            <Icon size={18} />
            {name}
          </button>
        ))}

        <div className="side-bottom">
          <div className="user">
            <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>
            <span>
              {user.name}
              <small>{user.role}</small>
            </span>
          </div>
          <button className="nav" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main>
        <header>
          <div className="mobile-menu">
            <button className="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu />
            </button>
          </div>
          <div>
            <div className="eyebrow">FACTORY STORE / LIVE</div>
            <h2>{page}</h2>
          </div>
          <div className="header-right">
            <div className="search">
              <Search size={17} />
              <input
                placeholder="Search inventory..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <button className="icon" onClick={refresh}>
              <RefreshCw size={18} className={refreshing ? "spin" : ""} />
            </button>
          </div>
        </header>

        {page === "Dashboard" && (
          <Dashboard
            data={data}
            tx={transactions}
            items={items}
            report={report}
          />
        )}
        {page === "Inventory" && (
          <Inventory
            items={items}
            query={query}
            refresh={refresh}
            role={user.role}
          />
        )}
        {(page === "Stock IN" || page === "Stock OUT") && (
          <StockForm
            type={page === "Stock IN" ? "IN" : "OUT"}
            items={items}
            refresh={refresh}
          />
        )}
        {page === "Transactions" && <Transactions tx={transactions} />}
        {page === "Suppliers" && (
          <Suppliers data={suppliers} refresh={refresh} />
        )}
        {page === "Reports" && <Reports report={report} tx={transactions} />}
        {page === "Users" && user.role === "admin" && (
          <UsersPage users={users} refresh={refresh} />
        )}
      </main>
    </div>
  );
}
