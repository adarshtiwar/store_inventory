export default function Transactions({ tx }) {
  return (
    <div className="panel table-panel">
      <div className="panel-head">
        <div>
          <h3>Transaction history</h3>
          <p>Immutable audit trail · last 500 events</p>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Connector</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Previous</th>
              <th>Balance</th>
              <th>Person</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {tx.map((entry) => (
              <tr key={entry._id}>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
                <td>
                  <b>{entry.connector?.name}</b>
                  <small>{entry.connector?.partNumber}</small>
                </td>
                <td>
                  <span
                    className={`badge ${entry.type === "OUT" ? "outbadge" : ""}`}
                  >
                    {entry.type}
                  </span>
                </td>
                <td>{entry.quantity}</td>
                <td>{entry.previousStock}</td>
                <td>
                  <strong>{entry.newStock}</strong>
                </td>
                <td>{entry.person}</td>
                <td>{entry.invoiceNumber || entry.reason || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
