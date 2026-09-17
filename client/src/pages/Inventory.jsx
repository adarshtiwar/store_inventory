import { useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { api } from "../services/api";

export default function Inventory({ items, query, refresh, role }) {
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const filteredItems = items.filter((item) =>
    (
      item.name +
      " " +
      item.partNumber +
      " " +
      item.category +
      " " +
      (item.location || "")
    )
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  async function save(event) {
    event.preventDefault();
    const isEditing = Boolean(edit?._id);

    try {
      await api(isEditing ? `/connectors/${edit._id}` : "/connectors", {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(form),
      });
      setError("");
      setEdit(null);
      refresh();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function remove(id) {
    if (confirm("Delete this connector?")) {
      await api(`/connectors/${id}`, { method: "DELETE" });
      refresh();
    }
  }

  return (
    <>
      <div className="panel table-panel">
        <div className="panel-head">
          <div>
            <h3>Inventory</h3>
            <p>
              {items.length} connector SKUs · search, edit and monitor stock
            </p>
          </div>
          {role === "admin" && (
            <button
              className="primary small"
              onClick={() => {
                setForm({ unit: "pcs", minimumStock: 10, currentStock: 0 });
                setEdit({});
              }}
            >
              <Plus size={16} /> Add connector
            </button>
          )}
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Connector</th>
                <th>Part number</th>
                <th>Category</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <b>{item.name}</b>
                    <small>{item.manufacturer || "—"}</small>
                  </td>
                  <td>{item.partNumber}</td>
                  <td>{item.category}</td>
                  <td>{item.location || "—"}</td>
                  <td>
                    <strong>{item.currentStock}</strong> {item.unit}
                  </td>
                  <td>
                    <span
                      className={
                        item.currentStock <= item.minimumStock
                          ? "badge danger"
                          : "badge"
                      }
                    >
                      {item.currentStock <= item.minimumStock
                        ? "Low stock"
                        : "Healthy"}
                    </span>
                  </td>
                  <td>
                    {role === "admin" && (
                      <div className="actions">
                        <button
                          onClick={() => {
                            setEdit(item);
                            setForm({ ...item });
                          }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => remove(item._id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {edit && (
        <Modal
          title={edit._id ? "Edit connector" : "Add connector"}
          onClose={() => {
            setError("");
            setEdit(null);
          }}
        >
          {error && <div className="error">{error}</div>}
          <form className="form-grid" onSubmit={save}>
            <label>
              Name
              <input
                required
                value={form.name || ""}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </label>
            <label>
              Part number
              <input
                required
                value={form.partNumber || ""}
                onChange={(event) =>
                  setForm({ ...form, partNumber: event.target.value })
                }
              />
            </label>
            <label>
              Category
              <input
                value={form.category || ""}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              />
            </label>
            <label>
              Manufacturer
              <input
                value={form.manufacturer || ""}
                onChange={(event) =>
                  setForm({ ...form, manufacturer: event.target.value })
                }
              />
            </label>
            <label>
              Current stock
              <input
                type="number"
                min="0"
                value={form.currentStock ?? 0}
                onChange={(event) =>
                  setForm({
                    ...form,
                    currentStock: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Minimum stock
              <input
                type="number"
                min="0"
                value={form.minimumStock ?? 10}
                onChange={(event) =>
                  setForm({
                    ...form,
                    minimumStock: Number(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Unit
              <input
                value={form.unit || "pcs"}
                onChange={(event) =>
                  setForm({ ...form, unit: event.target.value })
                }
              />
            </label>
            <label>
              Rack / location
              <input
                value={form.location || ""}
                onChange={(event) =>
                  setForm({ ...form, location: event.target.value })
                }
              />
            </label>
            <label className="full">
              Description
              <input
                value={form.description || ""}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </label>
            <button className="primary full">Save connector</button>
          </form>
        </Modal>
      )}
    </>
  );
}
