import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { api } from "../services/api";

export default function StockForm({ type, items, refresh }) {
  const [form, setForm] = useState({
    connectorId: "",
    quantity: "",
    person: "",
    supplier: "",
    invoiceNumber: "",
    reason: "",
  });
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();

    try {
      await api("/stock", {
        method: "POST",
        body: JSON.stringify({ ...form, type }),
      });
      setMessage("Stock updated successfully");
      setForm({ ...form, quantity: "", invoiceNumber: "", reason: "" });
      refresh();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="form-wrap">
      <div className="form-card">
        <div className="form-title">
          <div className={`big-icon ${type === "IN" ? "in" : "out"}`}>
            {type === "IN" ? <ArrowDownToLine /> : <ArrowUpFromLine />}
          </div>
          <div>
            <h3>Stock {type}</h3>
            <p>
              {type === "IN"
                ? "Receive material into the store"
                : "Issue material to production"}
            </p>
          </div>
        </div>
        {message && <div className="notice">{message}</div>}
        <form onSubmit={submit} className="form-grid">
          <label>
            Connector
            <select
              required
              value={form.connectorId}
              onChange={(event) =>
                setForm({ ...form, connectorId: event.target.value })
              }
            >
              <option value="">Select connector</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} · {item.partNumber} · {item.currentStock}{" "}
                  {item.unit}
                </option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              required
              value={form.quantity}
              onChange={(event) =>
                setForm({ ...form, quantity: event.target.value })
              }
            />
          </label>
          <label>
            Person
            <input
              required
              value={form.person}
              placeholder="Employee / storekeeper"
              onChange={(event) =>
                setForm({ ...form, person: event.target.value })
              }
            />
          </label>
          {type === "IN" && (
            <>
              <label>
                Supplier
                <input
                  value={form.supplier}
                  onChange={(event) =>
                    setForm({ ...form, supplier: event.target.value })
                  }
                />
              </label>
              <label>
                Invoice number
                <input
                  value={form.invoiceNumber}
                  onChange={(event) =>
                    setForm({ ...form, invoiceNumber: event.target.value })
                  }
                />
              </label>
            </>
          )}
          <label className="full">
            Reason / production reference
            <input
              value={form.reason}
              onChange={(event) =>
                setForm({ ...form, reason: event.target.value })
              }
            />
          </label>
          <button className="primary full">Confirm Stock {type}</button>
        </form>
      </div>
    </div>
  );
}
