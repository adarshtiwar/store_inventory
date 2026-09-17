import { api } from "../services/api";

export default function UsersPage({ users, refresh }) {
  async function updateRole(id, role) {
    await api(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    refresh();
  }

  return (
    <div className="panel table-panel">
      <div className="panel-head">
        <div>
          <h3>User management</h3>
          <p>Control access to the store system</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <b>{user.name}</b>
              </td>
              <td>{user.email}</td>
              <td>
                <select
                  className="role-select"
                  value={user.role}
                  onChange={(event) => updateRole(user._id, event.target.value)}
                >
                  <option>admin</option>
                  <option>manager</option>
                  <option>employee</option>
                </select>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
