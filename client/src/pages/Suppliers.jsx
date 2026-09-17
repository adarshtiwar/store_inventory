import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import { api } from "../services/api";

export default function Suppliers({ data, refresh }) {
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);

  async function save(event) {
    event.preventDefault();
    await api("/suppliers", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setForm({});
    setOpen(false);
    refresh();
  }

  return (
    <>
      <div className="panel table-panel">
        <div className="panel-head">
          <div>
            <h3>Suppliers</h3>
            <p>Manage vendors for incoming material</p>
          </div>
          <button className="primary small" onClick={() => setOpen(true)}>
            <Plus size={16} /> Add supplier
          </button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((supplier) => (
                <tr key={supplier._id}>
                  <td>
                    <b>{supplier.name}</b>
                    <small>{supplier.address || ""}</small>
                  </td>
                  <td>{supplier.contactPerson || "—"}</td>
                  <td>{supplier.phone || "—"}</td>
                  <td>{supplier.email || "—"}</td>
                  <td>
                    <span className="badge">
                      {supplier.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <Modal title="Add supplier" onClose={() => setOpen(false)}>
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
              Contact person
              <input
                value={form.contactPerson || ""}
                onChange={(event) =>
                  setForm({ ...form, contactPerson: event.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone || ""}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email || ""}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />
            </label>
            <label className="full">
              Address
              <input
                value={form.address || ""}
                onChange={(event) =>
                  setForm({ ...form, address: event.target.value })
                }
              />
            </label>
            <button className="primary full">Save supplier</button>
          </form>
        </Modal>
      )}
    </>
  );
}
