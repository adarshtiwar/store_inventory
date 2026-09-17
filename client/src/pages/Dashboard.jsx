import { useMemo } from "react";
import { AlertTriangle, ArrowDownToLine, Boxes, Package } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Scene from "../components/Scene";
import Stat from "../components/Stat";

export default function Dashboard({ data, tx, items, report }) {
  const chart = useMemo(() => {
    const movementByDate = {};

    report.forEach((entry) => {
      const date = entry._id.date;
      movementByDate[date] ??= { date, IN: 0, OUT: 0 };
      movementByDate[date][entry._id.type] = entry.quantity;
    });

    return Object.values(movementByDate);
  }, [report]);

  return (
    <>
      <section className="stats">
        <Stat
          title="Connector SKUs"
          value={data?.totalConnectors}
          icon={<Package />}
          sub="Products tracked"
        />
        <Stat
          title="Units in store"
          value={data?.totalUnits?.toLocaleString()}
          icon={<Boxes />}
          sub="Current balance"
        />
        <Stat
          title="Stock IN today"
          value={data?.todayIn}
          icon={<ArrowDownToLine />}
          sub="Transactions"
        />
        <Stat
          title="Low stock"
          value={data?.lowStock}
          icon={<AlertTriangle />}
          sub="Needs attention"
        />
      </section>

      <section className="grid top-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Inventory command center</h3>
              <p>Interactive 3D view of your store</p>
            </div>
            <span className="live">
              <i /> LIVE
            </span>
          </div>
          <Scene items={items} />
        </div>

        <div className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h3>Stock movement</h3>
              <p>Last 14 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chart}>
              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{
                  background: "#0d1b23",
                  border: "1px solid #29434f",
                }}
              />
              <Area
                type="monotone"
                dataKey="IN"
                stroke="#b8f35a"
                fill="#b8f35a22"
              />
              <Area
                type="monotone"
                dataKey="OUT"
                stroke="#ff8b7a"
                fill="#ff8b7a18"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid bottom-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Recent movement</h3>
              <p>Latest inventory events</p>
            </div>
          </div>
          {tx?.slice(0, 6).map((entry) => (
            <div className="row" key={entry._id}>
              <div className={`dot ${entry.type.toLowerCase()}`} />
              <div className="grow">
                <b>{entry.connector?.name}</b>
                <small>
                  {entry.connector?.partNumber} · {entry.person}
                </small>
              </div>
              <strong className={entry.type === "IN" ? "plus" : "minus"}>
                {entry.type === "IN" ? "+" : "-"}
                {entry.quantity}
              </strong>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Low stock watch</h3>
              <p>Replenishment candidates</p>
            </div>
          </div>
          {items
            .filter((item) => item.currentStock <= item.minimumStock)
            .slice(0, 6)
            .map((item) => (
              <div className="row" key={item._id}>
                <AlertTriangle size={16} color="#ffb199" />
                <div className="grow">
                  <b>{item.name}</b>
                  <small>{item.location || "No location"}</small>
                </div>
                <strong className="minus">{item.currentStock}</strong>
              </div>
            ))}
          {!items.some((item) => item.currentStock <= item.minimumStock) && (
            <div className="empty">
              All tracked items are above minimum stock.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
