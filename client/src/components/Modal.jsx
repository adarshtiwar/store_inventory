import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal"
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
