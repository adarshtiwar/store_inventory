import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Download,
  FileBarChart,
  History,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";
import Stat from "../components/Stat";

export default function Reports({ report, tx }) {
  const chart = useMemo(() => {
    const movementByDate = {};

    report.forEach((entry) => {
      movementByDate[entry._id.date] ??= {
        date: entry._id.date,
        IN: 0,
        OUT: 0,
      };
      movementByDate[entry._id.date][entry._id.type] = entry.quantity;
    });

    return Object.values(movementByDate);
  }, [report]);

  const inboundUnits = report
    .filter((entry) => entry._id.type === "IN")
    .reduce((total, entry) => total + entry.quantity, 0);
  const outboundUnits = report
    .filter((entry) => entry._id.type === "OUT")
    .reduce((total, entry) => total + entry.quantity, 0);

  function downloadStockReport() {
    const rows = tx.map((entry) => ({
      Date: new Date(entry.createdAt).toLocaleString(),
      Connector: entry.connector?.name || "",
      "Part Number": entry.connector?.partNumber || "",
      Type: entry.type,
      Quantity: entry.quantity,
      "Previous Stock": entry.previousStock,
      "New Stock": entry.newStock,
      Person: entry.person || "",
      Supplier: entry.supplier || "",
      "Invoice Number": entry.invoiceNumber || "",
      Reason: entry.reason || "",
      Reference: entry.reference || "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Transactions");
    XLSX.writeFile(
      workbook,
      `stock-transactions-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  }

  return (
    <>
      <section className="stats">
        <Stat
          title="Events"
          value={tx.length}
          icon={<History />}
          sub="Loaded transactions"
        />
        <Stat
          title="Inbound units"
          value={inboundUnits}
          icon={<ArrowDownToLine />}
          sub="Selected period"
        />
        <Stat
          title="Outbound units"
          value={outboundUnits}
          icon={<ArrowUpFromLine />}
          sub="Selected period"
        />
        <Stat
          title="Period"
          value="14d"
          icon={<FileBarChart />}
          sub="Rolling report"
        />
      </section>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Daily stock movement</h3>
            <p>Units received vs issued</p>
          </div>
          <button
            className="icon"
            onClick={downloadStockReport}
            title="Download stock report"
          >
            <Download size={17} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chart}>
            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip
              contentStyle={{
                background: "#0d1b23",
                border: "1px solid #29434f",
              }}
            />
            <Bar dataKey="IN" fill="#b8f35a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="OUT" fill="#ff8b7a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
