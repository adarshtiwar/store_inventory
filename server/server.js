require("dotenv").config();

const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/connectors", require("./routes/connectors"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/users", require("./routes/users"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: "Internal server error" });
});

async function startServer() {
  await connectDB();
  app.listen(port, () => console.log(`API running on ${port}`));
}

startServer().catch((error) => {
  console.error(`Unable to start API: ${error.message}`);
  process.exit(1);
});
