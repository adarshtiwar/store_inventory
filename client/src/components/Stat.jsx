import { motion } from "framer-motion";

export default function Stat({ title, value, icon, sub }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="stat">
      <div className="stat-icon">{icon}</div>
      <span>{title}</span>
      <b>{value ?? "—"}</b>
      <small>{sub}</small>
    </motion.div>
  );
}
